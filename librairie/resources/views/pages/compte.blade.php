@verbatim
<!-- ═══════════════════════════════════════════
     PAGE MON COMPTE
═══════════════════════════════════════════ -->
<div id="page-account" class="page">
<div class="account-page">
    <div class="account-layout">
      <aside class="account-sidebar">
        <div class="account-avatar">
          <div class="avatar-circle">CL</div>
          <div>
            <div class="avatar-name">Client</div>
            <div class="avatar-email">Connectez-vous pour voir vos donnees</div>
          </div>
        </div>
        <nav class="account-nav">
          <div class="account-nav-item active" onclick="switchAccountTab(this,'orders')">Mes commandes</div>
          <div class="account-nav-item" onclick="switchAccountTab(this,'wishlist')">Ma liste de souhaits</div>
          <div class="account-nav-item" onclick="switchAccountTab(this,'profile')">Mon profil</div>
          <div class="account-nav-item" onclick="switchAccountTab(this,'addresses')">Mes adresses</div>
          <div class="account-nav-item" onclick="switchAccountTab(this,'settings')">Paramètres</div>
          <div class="account-nav-item logout" onclick="showPage('home');showToast('Déconnexion réussie')">Se déconnecter</div>
        </nav>
      </aside>

      <div class="account-content">
        <div id="acc-orders" class="acc-tab active">
          <div class="acc-header">
            <h2>Mes commandes</h2>
            <span class="acc-count">0 commande</span>
          </div>
          <div class="orders-list">
            <div class="order-card">
              <div class="order-card-head">
                <div>
                  <div class="order-ref">Aucune commande dynamique</div>
                  <div class="order-date">Les commandes client devront etre chargees depuis l API.</div>
                </div>
                <span class="order-status">API</span>
              </div>
            </div>
          </div>
        </div>

        <div id="acc-wishlist" class="acc-tab">
          <div class="acc-header">
            <h2>Ma liste de souhaits</h2>
            <span class="acc-count">0 livre</span>
          </div>
          <div class="wishlist-grid">
            <div class="wish-card">
              <div class="wish-body">
                <div class="wish-title">Aucune liste dynamique</div>
                <div class="wish-author">Connecter la wishlist a une API client.</div>
              </div>
            </div>
          </div>
        </div>

        <div id="acc-profile" class="acc-tab">
          <div class="acc-header"><h2>Mon profil</h2></div>
          <div class="profile-form">
            <div class="form-grid">
              <div class="fld"><label>Prénom</label><input type="text"></div>
              <div class="fld"><label>Nom</label><input type="text"></div>
              <div class="fld full"><label>Adresse e-mail</label><input type="email"></div>
              <div class="fld"><label>Téléphone</label><input type="tel"></div>
              <div class="fld"><label>Date de naissance</label><input type="date"></div>
            </div>
            <div style="margin-top:20px;display:flex;gap:10px">
              <button class="btn-primary" onclick="showToast('Profil dynamique non connecte')">Enregistrer</button>
            </div>
          </div>
        </div>

        <div id="acc-addresses" class="acc-tab">
          <div class="acc-header">
            <h2>Mes adresses</h2>
            <button class="btn-primary" style="font-size:13px;padding:8px 14px" onclick="showToast('API client requise')">+ Ajouter une adresse</button>
          </div>
          <div class="addresses-grid">
            <div class="address-card">
              <div class="address-name">Aucune adresse dynamique</div>
              <div class="address-line">Les adresses client devront etre chargees depuis l API.</div>
            </div>
          </div>
        </div>

        <div id="acc-settings" class="acc-tab">
          <div class="acc-header"><h2>Paramètres</h2></div>
          <div class="settings-list">
            <div class="settings-section">
              <h4>Notifications</h4>
              <div class="setting-row"><div><div class="setting-label">Notifications e-mail</div><div class="setting-desc">Preference a charger depuis l API client.</div></div><label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
@endverbatim
