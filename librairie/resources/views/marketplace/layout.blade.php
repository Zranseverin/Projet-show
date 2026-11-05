<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>@yield('title', 'Zran Market · Vos envies, nos boutiques')</title><link rel="icon" href="{{ asset('images/zran-market.svg') }}" type="image/svg+xml"><link rel="stylesheet" href="{{ asset('css/marketplace.css') }}?v=1"><link rel="stylesheet" href="{{ asset('css/store-header.css') }}?v=1">@stack('styles')<link rel="stylesheet" href="{{ asset('css/responsive.css') }}?v=1">
</head>
<body>
@include('marketplace.header')
@yield('hero')
<main>
@if(session('success'))<div class="notice" role="status">{{ session('success') }}</div>@endif
@if($errors->any())<div class="notice error" role="alert"><ul>@foreach($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul></div>@endif
@yield('content')
</main>
<footer><div><a class="brand" href="{{ route('home') }}">Zran Market</a><p>Des produits variés, des vendeurs à découvrir.</p></div><div><a href="{{ route('seller.register') }}">Ouvrir une boutique</a><a href="{{ route('seller.login') }}">Espace vendeur</a><a href="{{ route('catalogue') }}">Tous les produits</a></div><p class="muted">Paiement manuel vérifié. Chaque boutique prépare ses propres commandes.</p></footer>
</body></html>
