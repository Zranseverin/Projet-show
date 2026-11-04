@verbatim
<!-- ═══════════════════════════════════════════
     PAGE ACCUEIL
═══════════════════════════════════════════ -->
<div id="page-home" class="page active">
  <section class="section">
    <div class="section-head">
      <h2 class="section-title">Nourrir votre foi, transformer votre vie</h2>
      <span class="see-all" onclick="showPage('catalogue')">Voir tout →</span>
    </div>
    <div class="carousel" id="bs-carousel"></div>
  </section>


  <!-- PUB 1 : Bannière dynamique -->
  <div id="adBanner1" class="ad-banner" style="display:none;background:linear-gradient(135deg,#1A2744 0%,#2C4A8C 100%);color:white">
    <div class="ad-banner-inner">
      <div class="ad-banner-visual">
        <img src="" alt="Publicite">
      </div>
      <div class="ad-banner-body">
        <span class="ad-banner-tag" style="background:rgba(255,255,255,.15);color:white">Sponsorisé</span>
        <div class="ad-banner-title" style="color:white">Publicite dynamique</div>
        <div class="ad-banner-sub" style="color:rgba(255,255,255,.75)">Contenu charge depuis l API.</div>
      </div>
      <div class="ad-banner-cta">
        <button class="btn-primary" style="background:var(--amber);white-space:nowrap">Voir</button>
      </div>
    </div>
    <button class="ad-close" onclick="event.stopPropagation();document.getElementById('adBanner1').style.display='none'" title="Fermer la pub">✕</button>
  </div>
  <div style="text-align:center;margin:0 32px 32px"><span class="ad-label" style="max-width:200px;margin:6px auto 0">Publicité</span></div>

  <div class="promo-banner">
    <div class="pb-icon"></div>
    <div class="promo-copy">
      <h3>Grandissez dans la foi avec WCIA</h3>
      <p>Découvrez des ressources chrétiennes pour nourrir votre foi et transformer votre vie.</p>
    </div>
    <button class="btn-primary" onclick="showPage('catalogue')">Découvrir nos ressources</button>
  </div>

  <section class="section category-section">
    <div class="section-head category-section-head">
      <div>
        <span class="section-kicker">Ressources pour votre croissance</span>
        <h2 class="section-title">Explorez par catégorie</h2>
        <p class="section-subtitle">Choisissez les ouvrages qui accompagneront votre marche avec Dieu.</p>
      </div>
      <button class="category-see-all" onclick="showPage('catalogue')">Tout voir <span aria-hidden="true">→</span></button>
    </div>
    <div class="genre-grid" id="homeCategoryGrid">
      <div class="genre-card" onclick="showPage('catalogue')"><span class="gi"></span><div class="genre-card-copy"><div class="gl">Catégories</div><div class="gc">Chargement...</div></div><span class="genre-arrow" aria-hidden="true">→</span></div>
    </div>
  </section>


  <!-- PUB 2 : Duo cartes -->
  <div style="padding:8px 32px 0">
    <div class="ad-label">Publicité</div>
  </div>
  <div class="ad-duo" style="margin-bottom:44px">
    <div id="adHomeDuoLeft" class="ad-card" style="display:none">
      <div class="ad-card-img">
        <img src="" alt="Publicite">
      </div>
      <div class="ad-card-body" style="background:white">
        <div class="ad-card-brand">Sponsorisé</div>
        <div class="ad-card-title" style="color:var(--navy)">Publicite dynamique</div>
        <div class="ad-card-sub" style="color:var(--muted)">Contenu charge depuis l API.</div>
        <button class="ad-card-btn" style="background:var(--amber);color:white">Voir</button>
      </div>
      <button class="ad-close" style="color:white;top:8px;right:8px" onclick="event.stopPropagation();this.closest('.ad-card').style.display='none'">✕</button>
    </div>
    <div id="adHomeDuoRight" class="ad-card" style="display:none">
      <div class="ad-card-img">
        <img src="" alt="Publicite">
      </div>
      <div class="ad-card-body" style="background:white">
        <div class="ad-card-brand">Sponsorisé</div>
        <div class="ad-card-title" style="color:var(--navy)">Publicite dynamique</div>
        <div class="ad-card-sub" style="color:var(--muted)">Contenu charge depuis l API.</div>
        <button class="ad-card-btn" style="background:#E8003D;color:white">Voir</button>
      </div>
      <button class="ad-close" style="color:white;top:8px;right:8px" onclick="event.stopPropagation();this.closest('.ad-card').style.display='none'">✕</button>
    </div>
  </div>

  <section class="section" style="padding-top:0">
    <div class="section-head">
      <h2 class="section-title">Nouveautés</h2>
      <span class="see-all" onclick="showPage('catalogue')">Voir tout →</span>
    </div>
    <div class="carousel" id="nv-carousel"></div>
  </section>

</div>
@endverbatim
