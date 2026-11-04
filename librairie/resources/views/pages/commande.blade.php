@verbatim
<!-- ═══════════════════════════════════════════
     PAGE COMMANDE (CHECKOUT)
═══════════════════════════════════════════ -->
<div id="page-checkout" class="page">
<div class="checkout-page">
    <h1>Passer la commande</h1>
    <div class="checkout-steps">
      <div class="step done"><div class="step-num">✓</div><div class="step-label">Panier</div></div>
      <div class="step-line"></div>
      <div class="step active"><div class="step-num">2</div><div class="step-label">Livraison</div></div>
      <div class="step-line"></div>
      <div class="step"><div class="step-num">3</div><div class="step-label">Paiement</div></div>
      <div class="step-line"></div>
      <div class="step"><div class="step-num">4</div><div class="step-label">Confirmation</div></div>
    </div>
    <div class="checkout-layout">
      <div>
        <!-- Adresse -->
        <div class="checkout-form-section">
          <h3>Adresse de livraison</h3>
          <div class="form-grid">
            <div class="fld"><label>Prénom</label><input id="checkoutFirstName" type="text" placeholder="Jean" required></div>
            <div class="fld"><label>Nom</label><input id="checkoutLastName" type="text" placeholder="Dupont" required></div>
            <div class="fld full"><label>E-mail</label><input id="checkoutEmail" type="email" placeholder="vous@exemple.com"></div>
            <div class="fld full"><label>Adresse</label><input id="checkoutAddress" type="text" placeholder="12 rue des Lilas" required></div>
            <div class="fld full"><label>Complément (optionnel)</label><input id="checkoutAddressExtra" type="text" placeholder="Appartement, étage…"></div>
            <div class="fld"><label>Code postal</label><input id="checkoutPostalCode" type="text" placeholder="00225"></div>
            <div class="fld"><label>Ville</label><input id="checkoutCity" type="text" placeholder="Abidjan" required></div>
            <div class="fld full"><label>Pays</label><select id="checkoutCountry"><option>Côte d'Ivoire</option><option>Burkina Faso</option><option>Mali</option><option>Sénégal</option><option>Togo</option></select></div>
            <div class="fld full"><label>Téléphone</label><input id="checkoutPhone" type="tel" placeholder="+225 07 XX XX XX XX"></div>
          </div>
        </div>
        <!-- Livraison -->
        <div class="checkout-form-section">
          <h3>Mode de livraison</h3>
          <div class="shipping-options" id="shippingOptions">
            <div class="secure-note">Chargement des modes de livraison...</div>
          </div>
        </div>
        <!-- Paiement -->
        <div class="checkout-form-section">
          <h3>Moyen de paiement</h3>
          <div class="payment-methods">

            <!-- ── Carte bancaire ── -->
            <label class="pay-method selected" onclick="selectPay('card',this)">
              <input type="radio" name="pay" value="card" checked>
              <div class="pay-method-logo" style="background:#1A3A5C"><span>CB</span></div>
              <div class="pay-method-detail">
                <div class="pmd-name">Carte bancaire</div>
                <div class="pmd-sub">Visa · Mastercard · CB</div>
              </div>
              <div class="pay-method-icons">
                <span class="pay-icon">VISA</span>
                <span class="pay-icon">MC</span>
              </div>
            </label>
            <div class="card-fields" id="cardFields">
              <div class="fld full"><label>Numéro de carte</label><input type="text" placeholder="1234 5678 9012 3456" maxlength="19"></div>
              <div class="fld"><label>Expiration</label><input type="text" placeholder="MM / AA" maxlength="7"></div>
              <div class="fld"><label>CVV</label><input type="text" placeholder="•••" maxlength="4"></div>
            </div>

            <!-- ── Espèces ── -->
            <label class="pay-method" onclick="selectPay('cash',this)">
              <input type="radio" name="pay" value="cash">
              <div class="pay-method-logo" style="background:#2D6A4F">ESP</div>
              <div class="pay-method-detail">
                <div class="pmd-name">Espèces</div>
                <div class="pmd-sub">Paiement à la livraison ou au retrait</div>
              </div>
            </label>

            <!-- ── Mobile Money ── -->
            <div class="pay-section-label">Mobile Money — Côte d'Ivoire</div>

            <!-- Orange Money -->
            <label class="pay-method" onclick="selectPay('orange',this)">
              <input type="radio" name="pay" value="orange">
              <div class="pay-method-logo" style="background:#FF6600">OM</div>
              <div class="pay-method-detail">
                <div class="pmd-name">Orange Money</div>
                <div class="pmd-sub">Paiement mobile sécurisé</div>
              </div>
              <button type="button" class="btn-sm" style="background:#FF6600;color:white;border:none;padding:5px 12px;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer" onclick="event.stopPropagation();openQr('orange')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Scanner
              </button>
            </label>

            <!-- MTN MoMo -->
            <label class="pay-method" onclick="selectPay('mtn',this)">
              <input type="radio" name="pay" value="mtn">
              <div class="pay-method-logo" style="background:#FFCC00;color:#1A1A1A">MTN</div>
              <div class="pay-method-detail">
                <div class="pmd-name">MTN Mobile Money</div>
                <div class="pmd-sub">MoMo — Paiement instantané</div>
              </div>
              <button type="button" class="btn-sm" style="background:#FFCC00;color:#1A1A1A;border:none;padding:5px 12px;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer" onclick="event.stopPropagation();openQr('mtn')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Scanner
              </button>
            </label>

            <!-- Moov Money -->
            <label class="pay-method" onclick="selectPay('moov',this)">
              <input type="radio" name="pay" value="moov">
              <div class="pay-method-logo" style="background:#00AAFF">MOV</div>
              <div class="pay-method-detail">
                <div class="pmd-name">Moov Money</div>
                <div class="pmd-sub">Flooz — Paiement rapide</div>
              </div>
              <button type="button" class="btn-sm" style="background:#00AAFF;color:white;border:none;padding:5px 12px;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer" onclick="event.stopPropagation();openQr('moov')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Scanner
              </button>
            </label>

            <!-- Wave -->
            <label class="pay-method" onclick="selectPay('wave',this)">
              <input type="radio" name="pay" value="wave">
              <div class="pay-method-logo" style="background:#1BC5BD">Wave</div>
              <div class="pay-method-detail">
                <div class="pmd-name">Wave</div>
                <div class="pmd-sub">0% de frais — Ultra rapide</div>
              </div>
              <button type="button" class="btn-sm" style="background:#1BC5BD;color:white;border:none;padding:5px 12px;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer" onclick="event.stopPropagation();openQr('wave')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Scanner
              </button>
            </label>

          </div>
        </div>
        <button class="btn-pay" id="submitOrderBtn" onclick="submitOrder()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Confirmer et payer — <span id="checkoutTotal">0 FCFA</span>
        </button>
        <div class="secure-note">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Paiement chiffré SSL 256 bits — Vos données sont protégées
        </div>
      </div>

      <div class="checkout-summary" id="checkoutSummary">
        <h3>Votre commande</h3>
        <div id="csSummaryItems"></div>
        <div class="cs-divider"></div>
        <div class="cs-row"><span>Sous-total</span><span id="csSubtotal">—</span></div>
        <div class="cs-row"><span>Frais de livraison</span><span id="csShipping" style="color:var(--green)">Gratuit</span></div>
        <div class="cs-row total"><span>Total TTC</span><span id="csTotal">—</span></div>
        <div class="secure-note" style="margin-top:14px">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Satisfait ou remboursé sous 14 jours
        </div>
      </div>
    </div>
  </div>
</div>
@endverbatim
