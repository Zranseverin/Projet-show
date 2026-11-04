@verbatim
<!-- INSCRIPTION -->
<div id="auth-inscription" class="auth-form">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
    <div class="field-group" style="margin:0"><label>Prénom</label><input type="text" placeholder="Jean"></div>
    <div class="field-group" style="margin:0"><label>Nom</label><input type="text" placeholder="Dupont"></div>
  </div>
  <div class="field-group">
    <label>Adresse e-mail</label>
    <input type="email" placeholder="nom@exemple.com">
  </div>
  <div class="field-group">
    <label>Mot de passe</label>
    <div class="password-wrap">
      <input type="password" id="regPw" placeholder="Min. 8 caractères">
      <button class="toggle-pass" type="button" onclick="togglePw('regPw',this)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
    </div>
    <div class="field-hint">Au moins 8 caractères, une majuscule et un chiffre.</div>
  </div>
  <div class="field-group">
    <label>Date de naissance</label>
    <input type="date">
  </div>
  <div class="auth-row" style="margin-bottom:16px">
    <label><input type="checkbox"> J'accepte les <a>CGV</a> et la <a>politique de confidentialité</a></label>
  </div>
  <div class="auth-row" style="margin-bottom:20px">
    <label><input type="checkbox"> Recevoir les offres et nouveautés par e-mail</label>
  </div>
  <button class="btn-auth" onclick="registerAction()">Créer mon compte</button>
  <div class="auth-footer">Déjà un compte ? <a onclick="switchAuthTab(document.querySelectorAll('.auth-tab')[0],'connexion')">Se connecter</a></div>
</div>
@endverbatim
