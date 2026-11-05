<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MarketplaceController extends Controller
{
    private function api()
    {
        return Http::acceptJson()->connectTimeout(5)->timeout(12)->baseUrl(rtrim(config('api.base_url'), '/').'/marketplace');
    }

    public function index(Request $request)
    {
        $filters = $request->validate(['q' => 'nullable|string|max:200', 'category' => 'nullable|integer', 'seller' => 'nullable|string|max:200', 'page' => 'nullable|integer|min:1']);
        $products = [];
        $categories = [];
        $meta = ['current_page' => 1, 'last_page' => 1, 'total' => 0];
        $error = null;
        try {
            $response = $this->api()->get('/products', $filters);
            if ($response->successful()) {
                $products = $response->json('data', []);
                $meta = $response->json('meta', $meta);
            } else {
                $error = 'Le catalogue est temporairement indisponible. Réessayez dans un instant.';
            }
            $options = $this->api()->get('/options');
            if ($options->successful()) {
                $categories = $options->json('data.categories', []);
            }
        } catch (ConnectionException $exception) {
            $error = 'La connexion au catalogue est momentanément indisponible.';
        }

        return view('marketplace.catalog', compact('products', 'categories', 'meta', 'error'));
    }

    public function product(int $id)
    {
        try {
            $response = $this->api()->get('/products/'.$id);
        } catch (ConnectionException $exception) {
            abort(503, 'Le catalogue est temporairement indisponible.');
        }
        abort_if($response->status() === 404, 404);
        abort_unless($response->successful(), 503);

        return view('marketplace.product', ['product' => $response->json('data')]);
    }

    public function add(Request $request)
    {
        $data = $request->validate(['product_id' => 'required|integer|min:1', 'quantity' => 'required|integer|min:1|max:100']);
        try {
            $response = $this->api()->get('/products/'.$data['product_id']);
        } catch (ConnectionException $exception) {
            return back()->withErrors(['cart' => 'Impossible de vérifier ce produit. Réessayez.']);
        }
        if (! $response->successful()) {
            return back()->withErrors(['cart' => 'Ce produit est indisponible.']);
        }
        $product = $response->json('data');
        $cart = $request->session()->get('market_cart', []);
        $quantity = ($cart[$product['id']]['quantity'] ?? 0) + $data['quantity'];
        if ($quantity > min($product['stock'], 100)) {
            return back()->withErrors(['cart' => 'La quantité demandée dépasse le stock disponible.']);
        }
        if (! isset($cart[$product['id']]) && count($cart) >= 50) {
            return back()->withErrors(['cart' => 'Le panier est limité à 50 produits différents.']);
        }
        $cart[$product['id']] = ['product' => $product, 'quantity' => $quantity];
        $request->session()->put('market_cart', $cart);
        $request->session()->forget('checkout_key');

        return redirect()->route('cart')->with('success', 'Produit ajouté au panier.');
    }

    public function cart()
    {
        return view('marketplace.cart');
    }

    public function remove(Request $request, int $id)
    {
        $cart = $request->session()->get('market_cart', []);
        unset($cart[$id]);
        $request->session()->put('market_cart', $cart);
        $request->session()->forget('checkout_key');

        return back()->with('success', 'Produit retiré du panier.');
    }

    public function checkout(Request $request)
    {
        if (! $request->session()->get('market_cart')) {
            return redirect()->route('cart');
        }
        try {
            $response = $this->api()->get('/options');
        } catch (ConnectionException $exception) {
            return redirect()->route('cart')->withErrors(['checkout' => 'Le service de commande est indisponible.']);
        }
        if (! $response->successful()) {
            return redirect()->route('cart')->withErrors(['checkout' => 'Le service de commande est indisponible.']);
        }
        if (! $request->session()->has('checkout_key')) {
            $request->session()->put('checkout_key', (string) Str::uuid());
        }

        return view('marketplace.checkout', ['modes' => $response->json('data.payment_modes', [])]);
    }

    public function order(Request $request)
    {
        $data = $request->validate(['customer_name' => 'required|string|max:180', 'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'required|string|max:40', 'address' => 'required|string|max:2000', 'payment_mode' => 'required|in:platform,direct']);
        $cart = $request->session()->get('market_cart', []);
        if (! $cart || ! $request->session()->has('checkout_key')) {
            return redirect()->route('cart');
        }
        $data['request_key'] = $request->session()->get('checkout_key');
        $data['items'] = array_values(array_map(fn ($line) => ['product_id' => $line['product']['id'], 'quantity' => $line['quantity']], $cart));
        try {
            $response = $this->api()->post('/orders', $data);
        } catch (ConnectionException $exception) {
            return back()->withErrors(['order' => 'La confirmation a été interrompue. Réessayez avec les mêmes informations pour éviter une double commande.'])->withInput();
        }
        if (! $response->successful()) {
            return back()->withErrors(['order' => $response->status() === 422 ? $response->json('message', 'Vérifiez votre panier et les informations saisies.') : 'Impossible de confirmer la commande. Réessayez.'])->withInput();
        }
        $request->session()->put('market_confirmation', $response->json('data'));
        $request->session()->forget(['market_cart', 'checkout_key']);

        return redirect()->route('order.confirmation');
    }

    public function confirmation(Request $request)
    {
        if (! $request->session()->has('market_confirmation')) {
            return redirect()->route('home');
        }

        return view('marketplace.confirmation', ['order' => $request->session()->get('market_confirmation')]);
    }
}
