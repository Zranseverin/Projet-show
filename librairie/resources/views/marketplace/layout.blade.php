<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>@yield('title', 'Marketplace · Vos envies, nos boutiques')</title><link rel="icon" href="{{ asset('images/logo-librairie-dominion.png') }}" type="image/png"><link rel="stylesheet" href="{{ asset('css/marketplace.css') }}?v=1"></head>
<body>
<div class="topline">Des boutiques indépendantes. Une seule adresse pour vos envies.</div>
<header><a class="brand" href="{{ route('home') }}">market<span>place</span><small>Les bonnes trouvailles commencent ici.</small></a><form action="{{ route('catalogue') }}" class="search" role="search"><input name="q" aria-label="Rechercher des produits" value="{{ request('q') }}" placeholder="Que recherchez-vous ?"><button aria-label="Lancer la recherche">Rechercher</button></form><nav aria-label="Navigation principale"><a href="{{ route('seller.register') }}">Vendre</a><a href="{{ route('login') }}">Mon espace</a><a class="cart-link" href="{{ route('cart') }}">Panier <span>{{ array_sum(array_column(session('market_cart', []), 'quantity')) }}</span></a></nav></header>
<main>
@if(session('success'))<div class="notice" role="status">{{ session('success') }}</div>@endif
@if($errors->any())<div class="notice error" role="alert"><ul>@foreach($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul></div>@endif
@yield('content')
</main>
<footer><div><a class="brand" href="{{ route('home') }}">market<span>place</span></a><p>Des produits variés, des vendeurs à découvrir.</p></div><div><a href="{{ route('seller.register') }}">Ouvrir une boutique</a><a href="{{ route('login') }}">Espace vendeur</a><a href="{{ route('catalogue') }}">Tous les produits</a></div><p class="muted">Paiement manuel vérifié. Chaque boutique prépare ses propres commandes.</p></footer>
</body></html>
