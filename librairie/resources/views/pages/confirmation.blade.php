@verbatim
<!-- ═══════════════════════════════════════════
     PAGE CONFIRMATION
═══════════════════════════════════════════ -->
<div id="page-confirm" class="page">
<div class="confirm-page">
    <div class="confirm-box">
      <div class="confirm-icon">✅</div>
      <h2>Commande confirmée !</h2>
      <p class="sub">Merci pour votre achat. Les informations de confirmation<br>sont chargees depuis la commande API.</p>
      <div class="order-number">
        <div class="label">Numéro de commande</div>
        <div class="code" id="orderCode">En attente API</div>
      </div>
      <div class="confirm-steps">
        <div class="cs-step">
          <div class="sn">📦</div>
          <div class="st">En préparation</div>
          <div class="sd">Votre commande est prise en charge par notre équipe.</div>
        </div>
        <div class="cs-step">
          <div class="sn">🚚</div>
          <div class="st">Expédition</div>
          <div class="sd">Livraison estimée : 3 à 5 jours ouvrés.</div>
        </div>
        <div class="cs-step">
          <div class="sn">🎉</div>
          <div class="st">Bonne lecture !</div>
          <div class="sd">Un e-mail de suivi vous sera envoyé dès l'expédition.</div>
        </div>
      </div>
      <div class="confirm-actions">
        <button class="btn-outline" onclick="showReceipt()">Suivre ma commande</button>
        <button class="btn-primary" onclick="showPage('home');cart=[];updateBadges()" style="flex:1;justify-content:center">Retour à la boutique</button>
      </div>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast">
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
  <span id="toastMsg"></span>
</div>
@endverbatim

