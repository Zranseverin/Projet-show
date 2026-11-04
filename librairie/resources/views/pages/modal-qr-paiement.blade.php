@verbatim
<!-- ═══ MODAL QR PAIEMENT ═══ -->
<div id="qrModalOverlay" class="qr-modal-overlay" onclick="if(event.target===this)closeQr()">
  <div class="qr-modal">
    <button class="qr-modal-close" onclick="closeQr()">✕</button>
    <div class="qr-logo-badge" id="qrBadge"></div>
    <div class="qr-title" id="qrTitle"></div>
    <div class="qr-sub" id="qrSub"></div>

    <!-- Montant -->
    <div class="qr-amount-badge">
      <div class="qab-label">Montant à payer</div>
      <div class="qab-val" id="qrAmount">—</div>
      <div class="qab-num" id="qrRef">Réf: —</div>
    </div>

    <!-- QR Code SVG généré -->
    <div class="qr-code-wrap">
      <svg class="qr-code-svg" id="qrSvg" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>

    <!-- Étapes -->
    <div class="qr-steps" id="qrSteps"></div>

    <!-- Timer -->
    <div class="qr-timer">Expire dans <span id="qrTimerVal">10:00</span></div>

    <!-- Bouton confirmer -->
    <button class="qr-confirm-btn" id="qrConfirmBtn" onclick="qrSimulatePay()"></button>
  </div>
</div>
@endverbatim
