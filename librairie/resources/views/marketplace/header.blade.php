<header class="mp-header">
    <a class="mp-logo" href="{{ route('home') }}">
        <img src="{{ asset('images/zran-market.svg') }}" alt="" width="44" height="44">
        <span>Zran Market</span>
    </a>
    <form action="{{ route('catalogue') }}" class="mp-search" role="search">
        <button type="submit" aria-label="Rechercher"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button>
        <input name="q" aria-label="Rechercher un produit ou une marque" value="{{ request('q') }}" placeholder="Rechercher un produit, une marque…">
    </form>
    <nav class="mp-account" aria-label="Compte et panier">
        <a href="{{ route(auth()->check() ? 'account' : 'login') }}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg><span>Compte</span></a>
        <a class="mp-cart" href="{{ route('cart') }}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 3-2 4v14h18V7l-2-4H5ZM3 7h18M8 11a4 4 0 0 0 8 0"/></svg><span>Panier</span><span class="mp-cart-count" aria-label="Quantité dans le panier">{{ array_sum(array_column(session('market_cart', []), 'quantity')) }}</span></a>
    </nav>
</header>
@php($navCategories = array_map('strval', (array) request('categories', request('category') ? [request('category')] : [])))
<nav class="mp-category-nav" aria-label="Catégories de produits">
    <a @class(['active' => !$navCategories && !request('sale')]) href="{{ route('catalogue') }}">Tous les produits</a>
    @foreach(array_slice($categories ?? [], 0, 8) as $category)
        <a @class(['active' => in_array((string)$category['id'], $navCategories, true)]) href="{{ route('catalogue', ['category'=>$category['id']]) }}">{{ $category['name'] }}</a>
    @endforeach
    <a @class(['active' => request('sale')]) href="{{ route('catalogue', ['sale'=>1]) }}">Promos</a>
    <a href="{{ route('seller.register') }}">Devenir vendeur</a>
</nav>
