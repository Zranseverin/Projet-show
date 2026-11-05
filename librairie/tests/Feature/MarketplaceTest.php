<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MarketplaceTest extends TestCase
{
    use \Illuminate\Foundation\Testing\RefreshDatabase;
    private array $advertisements = [];
    private function product(): array
    {
        return ['id' => 5, 'name' => 'Sac de voyage', 'description' => '<script>unsafe</script>', 'category' => 'Voyage', 'image_url' => null,
            'brand' => 'Marque', 'sku' => 'SAC-1', 'attributes' => ['Couleur' => 'Bleu'], 'price' => 12500, 'old_price' => null, 'stock' => 3,
            'seller' => ['id' => 1, 'name' => 'Ma boutique', 'slug' => 'ma-boutique', 'description' => 'Voyage et accessoires']];
    }

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.marketplace.checkout_key' => 'checkout-test-key']);
        Http::preventStrayRequests();
        Http::fake([
            '*/marketplace/options' => fn () => Http::response(['data' => ['categories' => [['id' => 1, 'name' => 'Voyage']], 'payment_modes' => ['platform', 'direct'], 'advertisements' => $this->advertisements]]),
            '*/marketplace/products/5' => Http::response(['data' => $this->product()]),
            '*/marketplace/products*' => Http::response(['data' => [$this->product()], 'meta' => ['current_page' => 1, 'last_page' => 1, 'total' => 1]]),
        ]);
    }

    public function test_catalog_and_detail_render_real_product_fields_safely(): void
    {
        $this->get('/')->assertOk()->assertSee('Sac de voyage')->assertSee('Ma boutique');
        $this->get('/produits/5')->assertOk()->assertSee('Couleur')->assertSee('Bleu')->assertDontSee('<script>unsafe</script>', false);
    }

    public function test_guest_must_register_before_cart_and_checkout_then_product_is_resumed(): void
    {
        $this->post('/panier', ['product_id' => 5, 'quantity' => 2])->assertRedirect(route('register'))
            ->assertSessionHas('pending_cart_item')->assertSessionMissing('market_cart');
        $this->get('/commande')->assertRedirect(route('login'));
        $this->post('/commande', [])->assertRedirect(route('login'));
        $this->post('/inscription', ['name' => 'Client Test', 'email' => 'client@example.com',
            'password' => 'secret12345', 'password_confirmation' => 'secret12345'])->assertRedirect(route('cart'));
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', ['email' => 'client@example.com']);
        $this->get('/panier')->assertOk()->assertSee('Sac de voyage');
        $this->assertSame(2, session('market_cart.5.quantity'));
        $this->get('/compte')->assertOk()->assertSee('client@example.com');
        $this->post('/deconnexion')->assertRedirect(route('home'))->assertSessionMissing('market_cart');
        $this->assertGuest();
    }

    public function test_existing_customer_can_login_to_resume_cart_and_wrong_password_is_rejected(): void
    {
        $user = \App\Models\User::factory()->create(['email' => 'known@example.com', 'password' => 'secret12345']);
        $this->post('/panier', ['product_id' => 5, 'quantity' => 1])->assertRedirect(route('register'));
        $this->post('/connexion', ['email' => $user->email, 'password' => 'incorrect'])->assertSessionHasErrors('email');
        $this->assertGuest();
        $this->post('/connexion', ['email' => $user->email, 'password' => 'secret12345'])->assertRedirect(route('cart'));
        $this->assertAuthenticatedAs($user);
        $this->assertSame(1, session('market_cart.5.quantity'));
    }

    public function test_catalog_layout_and_filters_are_forwarded_to_the_api(): void
    {
        $this->get('/catalogue?categories[]=1&sort=price_asc')->assertOk()
            ->assertSee('catalog-sidebar', false)->assertSee('offers-rail', false)
            ->assertSee('Appliquer les filtres')->assertSee('Prix croissant');
        Http::assertSent(fn ($request) => str_contains($request->url(), '/marketplace/products')
            && $request['sort'] === 'price_asc' && $request['categories'] === ['1']);
    }

    public function test_catalog_advertisements_come_from_the_admin_api(): void
    {
        $this->advertisements = [
            ['title' => 'Nouvelle campagne', 'image_url' => 'https://example.com/banner.png', 'button_url' => 'https://example.com/offer'],
        ];
        $this->get('/catalogue')->assertOk()->assertSee('Nouvelle campagne')->assertSee('https://example.com/offer', false)->assertSee('data-ad-pause', false);
    }

    public function test_cart_checks_stock_and_checkout_renders_both_payment_modes(): void
    {
        $this->actingAs(\App\Models\User::factory()->create());
        $this->post('/panier', ['product_id' => 5, 'quantity' => 2])->assertRedirect(route('cart'));
        $this->get('/panier')->assertOk()->assertSee('Sac de voyage');
        $this->post('/panier', ['product_id' => 5, 'quantity' => 2])->assertSessionHasErrors('cart');
        $this->get('/commande')->assertOk()->assertSee('value="platform"', false)->assertSee('value="direct"', false);
        $this->delete('/panier/5')->assertRedirect();
        $this->get('/commande')->assertRedirect(route('cart'));
    }

    public function test_checkout_preserves_cart_on_api_error(): void
    {
        $this->actingAs(\App\Models\User::factory()->create());
        Http::fake(['*/marketplace/orders' => Http::response(['message' => 'Stock insuffisant'], 422)]);
        $this->withSession(['market_cart' => [5 => ['product' => $this->product(), 'quantity' => 1]], 'checkout_key' => '68a164be-8f39-40d4-a9df-45aa6d24885b'])
            ->post('/commande', ['customer_name' => 'Client', 'customer_phone' => '0700000000', 'address' => 'Abidjan', 'payment_mode' => 'direct'])
            ->assertSessionHasErrors('order')->assertSessionHas('market_cart');
    }

    public function test_confirmation_renders_pending_order_and_payment_instructions(): void
    {
        $this->actingAs(\App\Models\User::factory()->create());
        $order = ['reference' => 'CMD-123', 'total' => 12500, 'payment_mode' => 'direct', 'payment_status' => 'pending',
            'sellers' => [['name' => 'Ma boutique', 'total' => 12500, 'payment_instructions' => 'Compte vendeur', 'items' => [['name' => 'Sac de voyage', 'quantity' => 1]]]]];
        Http::fake(['*/marketplace/orders' => Http::response(['data' => $order], 201)]);
        $this->withSession(['market_cart' => [5 => ['product' => $this->product(), 'quantity' => 1]], 'checkout_key' => '68a164be-8f39-40d4-a9df-45aa6d24885b'])
            ->post('/commande', ['customer_name' => 'Client', 'customer_phone' => '0700000000', 'address' => 'Abidjan', 'payment_mode' => 'direct'])
            ->assertRedirect(route('order.confirmation'))->assertSessionMissing('market_cart');
        $this->get('/commande/confirmation')->assertOk()->assertSee('Compte vendeur')->assertSee('CMD-123');
        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/marketplace/orders') && $request['items'][0]['product_id'] === 5 && ! isset($request['items'][0]['price']));
    }
}
