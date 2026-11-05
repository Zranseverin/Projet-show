@if(!empty($advertisements))
<section class="catalog-advertising" aria-labelledby="advertising-title" data-advertising>
    <div class="advertising-heading"><h2 id="advertising-title">Publicités</h2><div class="advertising-controls"><button type="button" aria-label="Publicité précédente" data-ad-direction="-1">‹</button><button type="button" aria-label="Mettre le défilement en pause" aria-pressed="false" data-ad-pause>⏸</button><button type="button" aria-label="Publicité suivante" data-ad-direction="1">›</button></div></div>
    <div class="advertising-track" tabindex="0" aria-label="Bande publicitaire à défilement horizontal">
        @foreach($advertisements as $advertisement)
        <a class="advertising-slide" href="{{ $advertisement['button_url'] ?: $advertisement['image_url'] }}" target="_blank" rel="noopener sponsored" aria-label="{{ $advertisement['title'] }} (nouvel onglet)">
            <img src="{{ $advertisement['image_url'] }}" alt="{{ $advertisement['title'] }}" loading="lazy" width="460" height="280">
            <span>{{ $advertisement['title'] }} <small>{{ $advertisement['button_url'] ? 'En savoir plus' : 'Agrandir' }} ↗</small></span>
        </a>
        @endforeach
    </div>
    <p class="advertising-hint">Défilement automatique · survolez pour faire une pause.</p>
</section>
@endif
