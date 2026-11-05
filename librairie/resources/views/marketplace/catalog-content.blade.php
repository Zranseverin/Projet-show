@php
    $selectedCategories = array_map('strval', (array) request('categories', request('category') ? [request('category')] : []));
    $offers = collect($products)->filter(fn ($p) => $p['old_price'] !== null && $p['old_price'] > $p['price'])->take(8);
    $offersTitle = $offers->isEmpty() ? 'À découvrir' : 'Meilleures offres';
    if ($offers->isEmpty()) $offers = collect($products)->take(8);
    $sort = request('sort', 'popular');
@endphp
<div class="catalog-shell">
    <nav class="catalog-breadcrumb" aria-label="Fil d’Ariane"><a href="{{ route('home') }}">Accueil</a><span aria-hidden="true">›</span><span>Produits</span><span aria-hidden="true">›</span><strong>Catalogue</strong></nav>
    <section class="catalog-top">
        <div><h1 id="catalog-title">Catalogue produits</h1><p>{{ $meta['total'] }} produit(s) disponible(s) @if(request('q')) · « {{ request('q') }} » @endif</p></div>
        <nav class="catalog-tabs" aria-label="Sélections du catalogue">
            <a @class(['selected' => $sort === 'popular' && !request('sale')]) href="{{ route('catalogue', array_merge(request()->except(['page','sale']), ['sort'=>'popular'])) }}">Meilleures ventes</a>
            <a @class(['selected' => $sort === 'newest' && !request('sale')]) href="{{ route('catalogue', array_merge(request()->except(['page','sale']), ['sort'=>'newest'])) }}">Nouveautés</a>
            <a @class(['selected' => request('sale')]) href="{{ route('catalogue', array_merge(request()->except('page'), ['sale'=>1])) }}">Promos</a>
        </nav>
    </section>
    <div class="catalog-layout">
        <aside class="catalog-sidebar" aria-labelledby="filters-title">
            <div class="catalog-section-heading"><h2 id="filters-title">Filtres</h2><a href="{{ route('catalogue') }}">Tout effacer</a></div>
            <form method="get" action="{{ route('catalogue') }}" class="catalog-filter-form">
                @foreach(['q','seller','sort','sale'] as $key)
                    @if(request()->filled($key))<input type="hidden" name="{{ $key }}" value="{{ request($key) }}">@endif
                @endforeach
                <fieldset><legend>Catégories</legend>
                    @foreach($categories as $category)
                    <label class="category-option" for="category-{{ $category['id'] }}">
                        <input id="category-{{ $category['id'] }}" type="checkbox" name="categories[]" value="{{ $category['id'] }}" @checked(in_array((string)$category['id'], $selectedCategories, true))>
                        <span>{{ $category['name'] }}</span><small>({{ $category['products_count'] ?? 0 }})</small>
                    </label>
                    @endforeach
                </fieldset>
                <button>Appliquer les filtres</button>
            </form>
            @include('marketplace.advertising')
        </aside>
        <div class="catalog-main">
            @if($error)
                <div class="notice error" role="alert">{{ $error }} <a href="{{ url()->full() }}">Réessayer</a></div>
            @else
                @if($offers->isNotEmpty())
                <section class="catalog-offers" aria-labelledby="offers-title">
                    <div class="catalog-section-heading"><h2 id="offers-title">{{ $offersTitle }}</h2><a href="{{ route('home') }}">Retour accueil</a></div>
                    <div class="offers-rail" tabindex="0" role="region" aria-label="Produits à découvrir, défilement horizontal">
                        @foreach($offers as $product)@include('marketplace.product-card', ['product'=>$product])@endforeach
                    </div>
                </section>
                @endif
                <section class="catalog-results" aria-labelledby="results-title">
                    <div class="catalog-results-toolbar">
                        <div><h2 id="results-title">{{ $meta['total'] }} produit(s) trouvé(s)</h2><p>Les produits correspondant à votre sélection.</p></div>
                        <form method="get" action="{{ route('catalogue') }}" class="catalog-sort">
                            @foreach(['q','seller','category','sale'] as $key)
                                @if(request()->filled($key))<input type="hidden" name="{{ $key }}" value="{{ request($key) }}">@endif
                            @endforeach
                            @foreach((array)request('categories', []) as $category)<input type="hidden" name="categories[]" value="{{ $category }}">@endforeach
                            <label for="catalog-sort">Trier par</label><select id="catalog-sort" name="sort">
                                @foreach(['newest'=>'Les nouveautés','popular'=>'Les plus demandés','price_asc'=>'Prix croissant','price_desc'=>'Prix décroissant'] as $key=>$label)<option value="{{ $key }}" @selected($sort === $key)>{{ $label }}</option>@endforeach
                            </select><button class="secondary">Trier</button>
                        </form>
                    </div>
                    <div class="catalog-product-results products">
                        @forelse($products as $product)@include('marketplace.product-card', ['product'=>$product])
                        @empty<div class="empty full"><h3>Aucun produit pour cette sélection</h3><p>Essayez une autre catégorie ou un autre mot-clé.</p><a href="{{ route('catalogue') }}">Tout afficher</a></div>@endforelse
                    </div>
                    <div class="pagination">
                        @if($meta['current_page'] > 1)<a href="{{ route('catalogue', array_merge(request()->query(), ['page'=>$meta['current_page']-1])) }}">← Précédent</a>@else<span></span>@endif
                        <span>Page {{ $meta['current_page'] }} / {{ $meta['last_page'] }}</span>
                        @if($meta['current_page'] < $meta['last_page'])<a href="{{ route('catalogue', array_merge(request()->query(), ['page'=>$meta['current_page']+1])) }}">Suivant →</a>@endif
                    </div>
                </section>
            @endif
        </div>
    </div>
</div>
