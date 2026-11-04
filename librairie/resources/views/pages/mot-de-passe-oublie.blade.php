@verbatim
<!-- PAGE MOT DE PASSE OUBLIÉ -->
<div id="page-forgot" class="page">
<div class="auth-page">
    <div class="auth-box">

      <div class="auth-logo">
        <span class="logo" style="font-size:26px">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Chapitre
        </span>
      </div>

      <!-- ÉTAPE 1 : saisie email -->
      <div id="forgot-step1" class="forgot-step active">
        <button class="forgot-back" onclick="showPage('login')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Retour à la connexion
        </button>
        <div class="forgot-icon" style="background:#EEF4FF">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B6BE0" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
        </div>
        <div class="forgot-title">Mot de passe oublié ?</div>
        <div class="forgot-sub">Entrez votre adresse e-mail, nous vous enverrons un code de vérification pour réinitialiser votre mot de passe.</div>
        <div class="field-group">
          <label for="forgotEmail">Adresse e-mail</label>
          <input type="email" id="forgotEmail" placeholder="nom@exemple.com" oninput="this.style.borderColor=''">
        </div>
        <button class="btn-auth" onclick="forgotStep1()">Envoyer le code</button>
        <div class="auth-footer">Vous souvenez-vous ? <a onclick="showPage('login')">Se connecter</a></div>
      </div>

      <!-- ÉTAPE 2 : saisie code OTP -->
      <div id="forgot-step2" class="forgot-step">
        <button class="forgot-back" onclick="showForgotStep(1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Modifier l'adresse e-mail
        </button>
        <div class="forgot-icon" style="background:#FFF8EC">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8832A" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div class="forgot-title">Vérifiez votre e-mail</div>
        <div class="forgot-sub">Nous avons envoyé un code à 6 chiffres à<br><strong id="forgotEmailDisplay"></strong></div>
        <div class="otp-wrap">
          <input class="otp-input" type="text" maxlength="1" id="otp1" oninput="otpNext(this,'otp2')" onkeydown="otpBack(event,this,'')">
          <input class="otp-input" type="text" maxlength="1" id="otp2" oninput="otpNext(this,'otp3')" onkeydown="otpBack(event,this,'otp1')">
          <input class="otp-input" type="text" maxlength="1" id="otp3" oninput="otpNext(this,'otp4')" onkeydown="otpBack(event,this,'otp2')">
          <input class="otp-input" type="text" maxlength="1" id="otp4" oninput="otpNext(this,'otp5')" onkeydown="otpBack(event,this,'otp3')">
          <input class="otp-input" type="text" maxlength="1" id="otp5" oninput="otpNext(this,'otp6')" onkeydown="otpBack(event,this,'otp4')">
          <input class="otp-input" type="text" maxlength="1" id="otp6" oninput="otpNext(this,'')"     onkeydown="otpBack(event,this,'otp5')">
        </div>
        <button class="btn-auth" onclick="forgotStep2()">Vérifier le code</button>
        <div class="resend-link">Vous n'avez pas reçu le code ? <a onclick="resendOtp()">Renvoyer</a></div>
        <div id="resendMsg" style="font-size:12px;color:var(--green);text-align:center;margin-top:8px;display:none">✓ Code renvoyé !</div>
      </div>

      <!-- ÉTAPE 3 : nouveau mot de passe -->
      <div id="forgot-step3" class="forgot-step">
        <div class="forgot-icon" style="background:var(--green-bg)">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div class="forgot-title">Nouveau mot de passe</div>
        <div class="forgot-sub">Choisissez un mot de passe sécurisé d'au moins 8 caractères.</div>
        <div class="field-group">
          <label>Nouveau mot de passe</label>
          <div class="password-wrap">
            <input type="password" id="newPw" placeholder="Min. 8 caractères" oninput="checkPwStrength(this.value)">
            <button class="toggle-pass" type="button" onclick="togglePw('newPw',this)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <div class="pw-strength"><div class="pw-strength-bar" id="pwBar" style="width:0%"></div></div>
          <div class="pw-strength-label" id="pwLabel"></div>
        </div>
        <div class="field-group">
          <label>Confirmer le mot de passe</label>
          <div class="password-wrap">
            <input type="password" id="confirmPw" placeholder="Répétez le mot de passe">
            <button class="toggle-pass" type="button" onclick="togglePw('confirmPw',this)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
        <button class="btn-auth" onclick="forgotStep3()">Réinitialiser le mot de passe</button>
      </div>

      <!-- ÉTAPE 4 : succès -->
      <div id="forgot-step4" class="forgot-step" style="text-align:center;padding:12px 0">
        <div class="forgot-icon" style="background:var(--green-bg)">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="forgot-title">Mot de passe modifié !</div>
        <div class="forgot-sub" style="margin-bottom:24px">Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.</div>
        <button class="btn-auth" onclick="showPage('login')">Se connecter</button>
      </div>

    </div>
  </div>
</div>
@endverbatim

