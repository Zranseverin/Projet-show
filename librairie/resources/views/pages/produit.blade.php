@verbatim
<!-- ═══════════════════════════════════════════
     PAGE PRODUIT
═══════════════════════════════════════════ -->
<div id="page-product" class="page">
<nav class="breadcrumb">
    <a onclick="showPage('home')">Accueil</a><span>›</span>
    <a onclick="showPage('catalogue')" id="productCategoryCrumb">Catalogue</a><span>›</span>
    <span id="productBreadcrumbTitle">Chargement</span>
  </nav>

  <div class="product-main">
    <div class="cover-sticky">
      <div class="cover-frame" id="productCoverFrame">
        <img class="product-cover-img" id="productCoverImg" src="" alt="">
        <div class="product-cover-fallback" id="productCoverFallback" style="font-size:80px">...</div>
        <div class="spine-overlay"></div>
      </div>
      <button class="extract-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Feuilleter un extrait (PDF)
      </button>
      <button class="wishlist-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        Ajouter à ma liste
      </button>
    </div>
    <div class="product-info">
      <h1 class="product-h1" id="productTitle">Chargement</h1>
      <div class="product-author" id="productAuthor">Catalogue API</div>
      <div class="rating-row">
        <span class="stars" id="productStars">☆☆☆☆☆</span>
        <span class="rating-score" id="productRating">0.0</span>
        <span style="color:var(--light)">·</span>
        <a class="rating-link" id="productReviewsLink" onclick="switchTab(document.querySelectorAll('.tab-btn')[2],'avis')">0 avis clients</a>
      </div>
      <div class="format-label">Choisir un format</div>
      <div class="formats" id="productFormats">
        <div class="fmt-option selected"><div class="fmt-name">Chargement</div><div class="fmt-price">API</div></div>
      </div>
      <div class="stock-badge" id="productStock">Chargement du stock</div>
      <div class="price-row">
        <span class="price-main" id="selPrice">0 FCFA</span>
        <span class="price-old" id="productOldPrice"></span>
        <span class="price-save" id="productSave"></span>
      </div>
      <button class="btn-cart" id="productAddBtn" onclick="addCurrentProductToCart()">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        Ajouter au panier
      </button>
      <div class="reassurance-strip">
        <div class="reassurance-item"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><span>Livraison offerte dès 35 000 FCFA</span></div>
        <div class="reassurance-item"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg><span>Retour gratuit 14 j</span></div>
        <div class="reassurance-item"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>Paiement sécurisé</span></div>
      </div>
    </div>
  </div>

  <div class="desc-block">
    <div class="tab-nav">
      <button class="tab-btn active" onclick="switchTab(this,'synopsis')">Synopsis</button>
      <button class="tab-btn" onclick="switchTab(this,'fiche')">Fiche technique</button>
      <button class="tab-btn" onclick="switchTab(this,'avis')">Avis clients (142)</button>
    </div>
    <div id="tab-synopsis" class="tab-content active">
      <div class="synopsis">
        <div id="productDescription">
          <p>Chargement de la description depuis l API.</p>
        </div>
      </div>
    </div>
    <div id="tab-fiche" class="tab-content">
      <table class="fiche-table">
        <tr><td>Éditeur</td><td id="productPublisher">Non renseigné</td></tr>
        <tr><td>Date de parution</td><td id="productPublicationDate">Non renseigné</td></tr>
        <tr><td>Nombre de pages</td><td id="productPageCount">Non renseigné</td></tr>
        <tr><td>Dimensions</td><td id="productDimensions">Non renseigné</td></tr>
        <tr><td>Traducteur</td><td id="productTranslator">Non renseigné</td></tr>
        <tr><td>Langue</td><td id="productLanguage">Non renseigné</td></tr>
        <tr><td>Collection</td><td id="productCollection">Non renseigné</td></tr>
        <tr><td>ISBN</td><td id="productIsbn">Non renseigné</td></tr>
      </table>
    </div>
    <div id="tab-avis" class="tab-content">
      <div class="review-summary">
        <div class="review-score"><div class="score-big">4.8</div><div class="score-stars">★★★★★</div><div class="score-count">sur 142 avis</div></div>
        <div class="review-bars">
          <div class="bar-row"><span class="bar-label">5 ★</span><div class="bar-track"><div class="bar-fill" style="width:78%"></div></div><span class="bar-count">111</span></div>
          <div class="bar-row"><span class="bar-label">4 ★</span><div class="bar-track"><div class="bar-fill" style="width:14%"></div></div><span class="bar-count">20</span></div>
          <div class="bar-row"><span class="bar-label">3 ★</span><div class="bar-track"><div class="bar-fill" style="width:5%"></div></div><span class="bar-count">7</span></div>
          <div class="bar-row"><span class="bar-label">2 ★</span><div class="bar-track"><div class="bar-fill" style="width:2%"></div></div><span class="bar-count">3</span></div>
          <div class="bar-row"><span class="bar-label">1 ★</span><div class="bar-track"><div class="bar-fill" style="width:1%"></div></div><span class="bar-count">1</span></div>
        </div>
      </div>
      <div class="review-list">
        <div class="review-item"><div class="review-text">Aucun avis dynamique disponible pour le moment.</div></div>
      </div>
    </div>
  </div>
</div>
@endverbatim

