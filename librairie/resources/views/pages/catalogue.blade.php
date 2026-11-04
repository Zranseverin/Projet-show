@verbatim
<!-- ═══════════════════════════════════════════
     PAGE CATALOGUE
═══════════════════════════════════════════ -->
<div id="page-catalogue" class="page">
  <div class="catalogue-shell">
    <nav class="catalogue-breadcrumb" aria-label="Fil d'Ariane">
      <a onclick="showPage('home')">Accueil</a>
      <span>›</span>
      <a onclick="showPage('catalogue')">Livres</a>
      <span>›</span>
      <strong>Catalogue</strong>
    </nav>

    <section class="catalogue-market-head">
      <div>
        <h1>Catalogue livres</h1>
        <p><strong id="catCountTop">0</strong> titres disponibles · livraison offerte dès 35 000 FCFA</p>
      </div>
      <div class="catalogue-head-actions">
        <span class="market-chip active">Meilleures ventes</span>
        <span class="market-chip">Nouveautés</span>
        <span class="market-chip">Promos</span>
      </div>
    </section>

  <div class="catalogue-layout">
    <aside class="filters-panel">
      <div class="filter-title-row">
        <strong>Filtres</strong>
        <button onclick="resetCatalogueFilters()">Tout effacer</button>
      </div>
      <div class="filter-group">
        <h4>Catégorie</h4>
        <div id="catalogueCategoryFilters"></div>
      </div>
      <div class="filter-group">
        <h4>Auteur populaire</h4>
        <div id="catalogueAuthorFilters"></div>
      </div>
      <div class="filter-group">
        <h4>Format</h4>
        <div id="catalogueFormatFilters"></div>
      </div>
      <div class="filter-group">
        <h4>Prix</h4>
        <div class="price-range">
          <input type="number" id="priceMin" value="0" min="0" max="100000" onchange="applyCatalogueFilters()">
          <span>à</span>
          <input type="number" id="priceMax" value="50000" min="0" max="100000" onchange="applyCatalogueFilters()">
          <span>FCFA</span>
        </div>
        <input type="range" class="range-slider" id="priceRange" min="0" max="100000" value="50000" step="500" oninput="document.getElementById('priceMax').value=this.value;applyCatalogueFilters()">
      </div>
      <div class="filter-group">
        <h4>Note</h4>
        <div class="filter-option"><input type="checkbox" id="r5"><label for="r5">★★★★★ (5 étoiles)</label></div>
        <div class="filter-option"><input type="checkbox" id="r4" checked><label for="r4">★★★★☆ et plus</label></div>
        <div class="filter-option"><input type="checkbox" id="r3"><label for="r3">★★★☆☆ et plus</label></div>
      </div>
      <button class="filter-reset" onclick="resetCatalogueFilters()">Réinitialiser les filtres</button>

      <!-- PUB SIDEBAR -->
      <div style="margin-top:20px">
        <div style="font-size:9.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;text-align:center">Publicité</div>
        <div id="adCatalogSidebar" class="ad-sidebar" style="display:none">
          <div class="ad-sidebar-img">
            <img src="" alt="Publicite">
          </div>
          <div class="ad-sidebar-body" style="background:white">
            <div class="ad-sidebar-tag">Sponsorisé</div>
            <div class="ad-sidebar-title" style="color:var(--navy)">Publicite dynamique</div>
            <div class="ad-sidebar-sub" style="color:var(--muted)">Contenu charge depuis l API.</div>
            <button class="ad-sidebar-btn" style="background:#2D6A4F;color:white">Voir</button>
          </div>
        </div>
      </div>
    </aside>

    <div class="catalogue-main">
      <section class="catalogue-deals">
        <div class="catalogue-deals-head">
          <h2>Meilleures offres</h2>
          <button onclick="showPage('home')">Retour accueil</button>
        </div>
        <div class="carousel" id="catalogue-carousel"></div>
      </section>

      <div class="catalogue-toolbar">
        <div>
          <div class="catalogue-count"><strong id="catCount">24</strong> livres trouvés</div>
          <div class="catalogue-similar">Suggestions chargees depuis les filtres du catalogue.</div>
        </div>
        <select class="sort-select" onchange="showToast('Tri appliqué : '+this.options[this.selectedIndex].text)">
          <option>Les plus demandés</option>
          <option>Prix croissant</option>
          <option>Prix décroissant</option>
          <option>Meilleures notes</option>
          <option>Nouveautés</option>
          <option>Titre A→Z</option>
        </select>
      </div>
      <div class="catalogue-grid" id="catGrid"></div>
      <div class="pagination">
        <button class="pg-btn">‹</button>
        <button class="pg-btn active">1</button>
        <button class="pg-btn">2</button>
        <button class="pg-btn">3</button>
        <button class="pg-btn">…</button>
        <button class="pg-btn">8</button>
        <button class="pg-btn">›</button>
      </div>
    </div>
  </div>
  </div>
</div>
@endverbatim

