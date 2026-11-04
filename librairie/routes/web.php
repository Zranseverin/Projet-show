<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::get('/catalogue', function () {
    return view('welcome');
})->name('catalogue');

Route::get('/livre', function () {
    return view('welcome');
})->name('product');

Route::get('/panier', function () {
    return view('welcome');
})->name('cart');

Route::get('/connexion', function () {
    return view('welcome');
})->name('login');

Route::get('/commande', function () {
    return view('welcome');
})->name('checkout');

Route::get('/compte', function () {
    return view('welcome');
})->name('account');

Route::get('/recherche', function () {
    return view('welcome');
})->name('search');
