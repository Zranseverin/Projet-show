<article class="product-card">
    <a class="product-image" href="{{ route('product', $product['id']) }}" aria-label="Voir {{ $product['name'] }}">
        @if($product['image_url'])
            <img src="{{ $product['image_url'] }}" alt="{{ $product['name'] }}" width="220" height="200" loading="lazy">
        @else
            <span>Photo à venir</span>
        @endif
    </a>
    <div class="product-copy">
        <h3><a href="{{ route('product', $product['id']) }}">{{ $product['name'] }}</a></h3>
        <p class="seller">{{ $product['seller']['name'] }}</p>
        <span class="price">{{ number_format($product['price'], 0, ',', ' ') }} <small>FCFA</small></span>
        @if($product['old_price'] !== null && $product['old_price'] > $product['price'])
            <s class="old-price">{{ number_format($product['old_price'], 0, ',', ' ') }}</s>
        @endif
        <div class="stock">{{ $product['stock'] > 0 ? 'En stock' : 'Épuisé' }}</div>
    </div>
    <form method="post" action="{{ route('cart.add') }}">
        @csrf
        <input type="hidden" name="product_id" value="{{ $product['id'] }}">
        <input type="hidden" name="quantity" value="1">
        <button @disabled($product['stock'] < 1)>{{ $product['stock'] > 0 ? '+ Ajouter au panier' : 'Indisponible' }}</button>
    </form>
</article>
