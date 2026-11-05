@extends('marketplace.layout')
@section('title', 'Mon compte · Zran Market')
@section('content')
<section class="panel" style="max-width:650px;margin:20px auto"><div class="eyebrow">MON COMPTE CLIENT</div><h1>Bonjour {{ auth()->user()->name }}.</h1><p class="muted">Vous êtes connecté avec {{ auth()->user()->email }}.</p><p>Vous pouvez ajouter vos produits au panier et confirmer votre commande.</p><p><a class="btn" href="{{ route('cart') }}">Voir mon panier</a> <a class="btn secondary" href="{{ route('catalogue') }}">Continuer mes achats</a></p><form method="post" action="{{ route('logout') }}">@csrf<button class="secondary">Me déconnecter</button></form></section>
@endsection
