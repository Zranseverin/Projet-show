<?php

use App\Http\Controllers\MarketplaceController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MarketplaceController::class, 'index'])->name('home');
Route::get('/catalogue', [MarketplaceController::class, 'index'])->name('catalogue');
Route::get('/recherche', [MarketplaceController::class, 'index'])->name('search');
Route::get('/produits/{id}', [MarketplaceController::class, 'product'])->whereNumber('id')->name('product');
Route::get('/panier', [MarketplaceController::class, 'cart'])->name('cart');
Route::post('/panier', [MarketplaceController::class, 'add'])->name('cart.add');
Route::delete('/panier/{id}', [MarketplaceController::class, 'remove'])->whereNumber('id')->middleware('auth')->name('cart.remove');
Route::get('/commande', [MarketplaceController::class, 'checkout'])->middleware('auth')->name('checkout');
Route::post('/commande', [MarketplaceController::class, 'order'])->middleware(['auth', 'throttle:10,1'])->name('checkout.store');
Route::get('/commande/confirmation', [MarketplaceController::class, 'confirmation'])->middleware('auth')->name('order.confirmation');
Route::get('/devenir-vendeur', fn () => redirect()->away(rtrim(preg_replace('#/api/?$#', '', config('api.base_url')), '/').'/devenir-vendeur'))->name('seller.register');
Route::get('/espace-vendeur', fn () => redirect()->away(rtrim(preg_replace('#/api/?$#', '', config('api.base_url')), '/').'/login'))->name('seller.login');
Route::middleware('guest')->group(function () {
    Route::get('/connexion', [\App\Http\Controllers\CustomerAuthController::class, 'login'])->name('login');
    Route::post('/connexion', [\App\Http\Controllers\CustomerAuthController::class, 'authenticate'])->middleware('throttle:5,1')->name('login.store');
    Route::get('/inscription', [\App\Http\Controllers\CustomerAuthController::class, 'register'])->name('register');
    Route::post('/inscription', [\App\Http\Controllers\CustomerAuthController::class, 'store'])->middleware('throttle:5,1')->name('register.store');
});
Route::get('/compte', [\App\Http\Controllers\CustomerAuthController::class, 'account'])->middleware('auth')->name('account');
Route::post('/deconnexion', [\App\Http\Controllers\CustomerAuthController::class, 'logout'])->middleware('auth')->name('logout');
Route::redirect('/livre', '/catalogue');
