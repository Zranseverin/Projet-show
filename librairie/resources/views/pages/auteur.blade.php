@verbatim
<!-- ═══════════════════════════════════════════
     PAGE AUTEUR
═══════════════════════════════════════════ -->
<div id="page-author" class="page">
<nav class="breadcrumb">
    <a onclick="showPage('home')">Accueil</a><span>›</span>
    <a onclick="showPage('catalogue')">Auteurs</a><span>›</span>
    <span id="authorBreadcrumbName">Auteur</span>
  </nav>
  <div class="author-page">
    <div class="author-hero">
      <div class="author-avatar" id="authorAvatar">AD</div>
      <div class="author-info">
        <h1 class="author-name" id="authorName">Auteur dynamique</h1>
        <div class="author-dates" id="authorDates">Catalogue API</div>
        <div class="author-genres" id="authorGenres">
          <span class="genre-tag">Catalogue</span>
        </div>
        <div class="author-stats">
          <div class="astat"><div class="astat-n" id="authorBooksCount">0</div><div class="astat-l">Romans</div></div>
          <div class="astat"><div class="astat-n" id="authorReviewsCount">0</div><div class="astat-l">Avis clients</div></div>
          <div class="astat"><div class="astat-n" id="authorRatingAverage">★ 0.0</div><div class="astat-l">Note moyenne</div></div>
        </div>
      </div>
    </div>
    <div class="author-bio-block" id="authorBio">
      <h3>Biographie</h3>
      <p>Chargement des informations depuis le catalogue dynamique.</p>
    </div>
    <div class="author-books-section">
      <h3>Tous ses livres disponibles</h3>
      <div class="carousel" id="author-carousel"></div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════
     BARRE DE NAVIGATION MOBILE
═══════════════════════════════════════════ -->
@endverbatim

