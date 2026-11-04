@verbatim
<!-- ═══════════════════════════════════════════
     PAGE SUIVI DE COMMANDE
═══════════════════════════════════════════ -->
<div id="page-tracking" class="page">
<div class="tracking-page">
    <nav class="breadcrumb" style="border-bottom:none;padding:14px 32px 0">
      <a onclick="showPage('account')">Mon compte</a><span>›</span>Suivi de commande
    </nav>
    <div class="tracking-hero">
      <h1>Suivi de livraison</h1>
      <div class="tracking-ref">Commande <strong id="trackingReference">Non chargee</strong></div>
    </div>
    <div class="tracking-layout">
      <div class="tracking-main">
        <!-- Statut global -->
        <div class="tracking-status-card">
          <div class="tsc-icon">🚚</div>
          <div class="tsc-info">
            <div class="tsc-title">Aucune livraison chargee</div>
            <div class="tsc-sub">Les informations seront affichees depuis l API de commande.</div>
          </div>
          <div class="tsc-carrier">
            <div class="carrier-logo">API</div>
            <div class="carrier-num">-</div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="tracking-timeline">
          <div class="tl-step">
            <div class="tl-dot"></div>
            <div class="tl-content">
              <div class="tl-title">Commande</div>
              <div class="tl-date">En attente de donnees API</div>
              <div class="tl-detail">Aucune information statique n est affichee.</div>
            </div>
          </div>
        </div>

        <!-- Contenu de la commande -->
        <div class="tracking-items-card">
          <h3>Contenu de la commande</h3>
          <div class="tracking-item">
            <div class="ti-info"><div class="ti-title">Aucun article charge</div><div class="ti-sub">Connecter cette page a l API de suivi commande.</div></div>
            <div class="ti-price">0 FCFA</div>
          </div>
          <div class="tracking-total">Total payé : <strong>0 FCFA</strong></div>
        </div>
      </div>

      <!-- Sidebar infos -->
      <div class="tracking-sidebar">
        <div class="ts-card">
          <h4>Adresse de livraison</h4>
          <p>Aucune adresse chargee depuis l API.</p>
        </div>
        <div class="ts-card">
          <h4>Actions</h4>
          <button class="btn-outline-full" onclick="showToast('Demande de modification envoyée')">Modifier l'adresse</button>
          <button class="btn-outline-full" onclick="showToast('Demande de retour initiée')">Initier un retour</button>
          <button class="btn-outline-full" onclick="showToast('Facture téléchargée')">Télécharger la facture</button>
          <button class="btn-outline-full" onclick="showToast('Contactez notre support au 01 23 45 67 89')">Contacter le support</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════
     PAGE RÉSULTATS DE RECHERCHE
═══════════════════════════════════════════ -->
@endverbatim

