<?php

use App\Http\Controllers\MarketplaceController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MarketplaceController::class, 'index'])->name('home');
Route::get('/catalogue', [MarketplaceController::class, 'index'])->name('catalogue');
Route::get('/recherche', [MarketplaceController::class, 'index'])->name('search');
Route::get('/produits/{id}', [MarketplaceController::class, 'product'])->whereNumber('id')->name('product');
Route::get('/panier', [MarketplaceController::class, 'cart'])->name('cart');
Route::post('/panier', [MarketplaceController::class, 'add'])->name('cart.add');
Route::delete('/panier/{id}', [MarketplaceController::class, 'remove'])->whereNumber('id')->name('cart.remove');
Route::get('/commande', [MarketplaceController::class, 'checkout'])->name('checkout');
Route::post('/commande', [MarketplaceController::class, 'order'])->middleware('throttle:10,1')->name('checkout.store');
Route::get('/commande/confirmation', [MarketplaceController::class, 'confirmation'])->name('order.confirmation');
Route::get('/devenir-vendeur', fn () => redirect()->away(rtrim(preg_replace('#/api/?$#', '', config('api.base_url')), '/').'/devenir-vendeur'))->name('seller.register');
Route::get('/connexion', fn () => redirect()->away(rtrim(preg_replace('#/api/?$#', '', config('api.base_url')), '/').'/login'))->name('login');
Route::get('/compte', fn () => redirect()->route('login'))->name('account');
Route::redirect('/livre', '/catalogue');
