@verbatim
<div class="app-header">
  <div class="market-topbar">
    <span>Vendez vos livres</span>
    <span>Livraison rapide</span>
    <span>Aide & suivi commande</span>
  </div>
  <header>
    <span class="logo" onclick="showPage('home')">
@endverbatim
      <img src="{{ asset('images/logo-librairie-dominion.png') }}" alt="Librairie Dominion" class="brand-logo">
@verbatim
      <span>Librairie Dominion</span>
    </span>
    <div class="search-wrap">
      <svg class="si" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" placeholder="Rechercher un livre, un auteur..." oninput="handleSearch(this.value,'home-search-dd')" onfocus="handleSearch(this.value,'home-search-dd')" onblur="setTimeout(()=>closeDD('home-search-dd'),200)">
      <div class="search-dropdown" id="home-search-dd"></div>
    </div>
    <div class="header-actions">
      <button class="icon-btn" title="Mon compte" onclick="showPage('login')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Compte</span>
      </button>
      <button class="icon-btn" title="Mon panier" onclick="showPage('cart')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span>Panier</span>
        <span class="cart-badge" id="badge-global">0</span>
      </button>
    </div>
  </header>

  <nav class="navbar" id="headerCategoryNav">
    <div class="nav-item active" onclick="openCatalogueCategory()">Tous les livres</div>
    <div class="nav-item" onclick="showPage('catalogue')">Chargement...</div>
  </nav>

  <section class="hero">
    <div class="hero-content">
      <span class="hero-eyebrow" id="heroEyebrow">Catalogue dynamique</span>
      <h1 id="heroTitle">Chargement<br><em>des livres</em></h1>
      <p id="heroSubtitle">Contenu charge depuis l API</p>
      <div class="hero-promo">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        WCIA · Une église où la foi grandit et les vies sont transformées
      </div>
      <br>
      <button class="btn-primary" onclick="showPage('catalogue')">
        Découvrir la sélection
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
    <div class="hero-visual">
      <div class="hero-book-main" id="heroMainBook">
        <div class="bcp">...</div><div class="spine-ov"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="hero-book-sm" id="heroSideBookOne"><div class="bcp sm">...</div></div>
        <div class="hero-book-sm" id="heroSideBookTwo" style="margin-bottom:16px"><div class="bcp sm">...</div></div>
      </div>
    </div>
  </section>
</div>
@endverbatim
