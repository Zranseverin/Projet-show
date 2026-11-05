@php($featuredProduct = $products[0] ?? null)
<section class="mp-hero" aria-labelledby="mp-hero-title">
    <div class="mp-hero-content">
        <span class="mp-hero-eyebrow">La sélection du moment</span>
        <h1 id="mp-hero-title">{{ $featuredProduct['name'] ?? 'Vos prochaines découvertes commencent ici.' }}</h1>
        <p class="mp-hero-subtitle">@if($featuredProduct){{ $featuredProduct['seller']['name'] }} · {{ number_format($featuredProduct['price'], 0, ',', ' ') }} FCFA @else Découvrez les produits de nos boutiques partenaires. @endif</p>
        <div class="mp-hero-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>Des produits variés, des vendeurs à découvrir.</div>
        <a class="mp-hero-button" href="{{ $featuredProduct ? route('product', $featuredProduct['id']) : route('catalogue').'#catalog-title' }}">Découvrir la sélection<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></a>
    </div>
</section>
