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
<footer class="market-footer">
    <div class="market-footer-main">
        <section class="market-footer-brand" aria-label="À propos de Zran Market">
            <a class="market-footer-logo" href="{{ route('home') }}" aria-label="Zran Market, accueil"><span class="market-footer-mark" aria-hidden="true">Z</span><span>Zran <strong>Market</strong></span></a>
            <p>Des produits variés, des vendeurs à découvrir.</p>
            <span class="market-footer-location"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>Une marketplace pensée pour vous</span>
        </section>

        <nav class="market-footer-links" aria-label="Liens utiles">
            <h2>Explorer</h2>
            <a href="{{ route('catalogue') }}"><span>Tous les produits</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></a>
            <a href="{{ route('seller.register') }}"><span>Ouvrir une boutique</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></a>
            <a href="{{ route('seller.login') }}"><span>Espace vendeur</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></a>
        </nav>

        <aside class="market-footer-trust">
            <div class="market-footer-trust-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></svg></div>
            <div><h2>Des achats en toute clarté</h2><p>Paiement manuel vérifié. Chaque boutique prépare ses propres commandes.</p></div>
        </aside>
    </div>
    <div class="market-footer-bottom"><span>© {{ date('Y') }} Zran Market</span><span>Vos envies, nos boutiques.</span></div>
</footer>
</body></html>
