// ─── DATA ───
let BOOKS = [
  {id:1,title:'Dune',author:'Frank Herbert',price:9.50,stars:5,reviews:142,emoji:'📘',cover:'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',bg:'linear-gradient(145deg,#2A5F8E,#1a3a5c)',format:'Poche'},
  {id:2,title:'1984',author:'George Orwell',price:7.90,stars:5,reviews:98,emoji:'📗',cover:'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',bg:'linear-gradient(145deg,#3D6B3A,#2A4A27)',format:'Poche'},
  {id:3,title:'Le Petit Prince',author:'Antoine de Saint-Exupéry',price:6.50,stars:5,reviews:314,emoji:'📙',cover:'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',bg:'linear-gradient(145deg,#B8860B,#7A5C00)',format:'Poche'},
  {id:4,title:"L'Alchimiste",author:'Paulo Coelho',price:8.20,stars:4,reviews:211,emoji:'📕',cover:'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg',bg:'linear-gradient(145deg,#8B3A3A,#5C2020)',format:'Poche'},
  {id:5,title:'Fondation',author:'Isaac Asimov',price:11.00,stars:5,reviews:88,emoji:'📓',cover:'https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg',bg:'linear-gradient(145deg,#5B3A8B,#3A1F5C)',format:'Broché'},
  {id:6,title:"L'Anomalie",author:'Hervé Le Tellier',price:9.00,stars:4,reviews:176,emoji:'📔',cover:'https://covers.openlibrary.org/b/isbn/9782070467939-L.jpg',bg:'linear-gradient(145deg,#1A6B6B,#0D4040)',format:'Poche'},
  {id:7,title:'Les Misérables',author:'Victor Hugo',price:12.50,stars:5,reviews:423,emoji:'📒',cover:'https://covers.openlibrary.org/b/isbn/9780451419439-L.jpg',bg:'linear-gradient(145deg,#2E4A7A,#182A50)',format:'Poche'},
  {id:8,title:'Sapiens',author:'Yuval Noah Harari',price:13.90,stars:5,reviews:567,emoji:'📚',cover:'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',bg:'linear-gradient(145deg,#4A3B2A,#2E2010)',format:'Broché'},
  {id:9,title:'Intermezzo',author:'Sally Rooney',price:22.00,stars:4,reviews:34,emoji:'📘',cover:'https://covers.openlibrary.org/b/isbn/9780374602635-L.jpg',bg:'linear-gradient(145deg,#456789,#2A3D50)',format:'Broché'},
  {id:10,title:'Le Royaume',author:'Emmanuel Carrère',price:10.20,stars:4,reviews:52,emoji:'📗',cover:'https://covers.openlibrary.org/b/isbn/9782070441427-L.jpg',bg:'linear-gradient(145deg,#3A6B3A,#1E3E1E)',format:'Poche'},
  {id:11,title:'Orbital',author:'Samantha Harvey',price:20.00,stars:5,reviews:18,emoji:'📙',cover:'https://covers.openlibrary.org/b/isbn/9780802163622-L.jpg',bg:'linear-gradient(145deg,#5A4A7B,#362955)',format:'Broché'},
  {id:12,title:'James',author:'Percival Everett',price:21.50,stars:5,reviews:29,emoji:'📕',cover:'https://covers.openlibrary.org/b/isbn/9780385550369-L.jpg',bg:'linear-gradient(145deg,#7B3A3A,#4E1E1E)',format:'Broché'},
];

// ─── API FRONT ───
const API_CONFIG = window.LIBRAIRIE_API || {};

function buildApiUrl(endpointKey, params = {}){
  const endpoints = API_CONFIG.endpoints || {};
  const endpoint = endpoints[endpointKey] || endpointKey;
  const base = (API_CONFIG.baseUrl || '').replace(/\/$/, '');
  const path = String(endpoint || '').startsWith('/') ? endpoint : '/' + endpoint;
  const url = new URL(base + path);
  Object.entries(params).forEach(([key,value])=>{
    if(value !== undefined && value !== null && value !== '') url.searchParams.set(key,value);
  });
  return url.toString();
}

async function fetchApi(endpointKey, params = {}){
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), Number(API_CONFIG.timeout || 8000));
  try{
    const response = await fetch(buildApiUrl(endpointKey, params), {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    if(!response.ok) throw new Error('API HTTP ' + response.status);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function extractApiList(payload){
  if(Array.isArray(payload)) return payload;
  if(Array.isArray(payload?.data)) return payload.data;
  if(Array.isArray(payload?.books)) return payload.books;
  if(Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeApiBook(book, index){
  const author = typeof book.author === 'object' && book.author !== null
    ? (book.author.name || book.author.full_name || 'Auteur inconnu')
    : (book.author || book.author_name || 'Auteur inconnu');
  const price = Number(book.price ?? book.amount ?? book.prix ?? 0);
  const stars = Math.max(1, Math.min(5, Number(book.stars ?? book.rating ?? book.note ?? 4)));
  const palette = [
    'linear-gradient(145deg,#2A5F8E,#1a3a5c)',
    'linear-gradient(145deg,#3D6B3A,#2A4A27)',
    'linear-gradient(145deg,#8B3A3A,#5C2020)',
    'linear-gradient(145deg,#5B3A8B,#3A1F5C)'
  ];
  return {
    id: book.id ?? book.uuid ?? index + 1,
    title: book.title || book.titre || book.name || 'Livre sans titre',
    author,
    price: Number.isFinite(price) ? price : 0,
    stars,
    reviews: Number(book.reviews ?? book.review_count ?? book.avis ?? 0),
    emoji: book.emoji || '📘',
    cover: book.cover || book.cover_image || book.image || book.thumbnail || book.photo || '',
    bg: book.bg || book.cover_bg || book.background || palette[index % palette.length],
    format: book.format || book.type || 'Broché'
  };
}

function escapeAttr(value){
  return String(value ?? '').replace(/"/g,'&quot;');
}

function renderBookCover(book, spineClass = 'sl'){
  const cover = book.cover || book.cover_image || book.image || '';
  const fallback = `this.closest('.book-cover-box')?.classList.add('cover-failed');this.remove();`;
  if(cover){
    return `<img class="book-cover-img" src="${escapeAttr(cover)}" alt="${escapeAttr(book.title)}" loading="lazy" onerror="${fallback}"><span class="cover-fallback">${book.emoji || '📘'}</span><div class="${spineClass}"></div>`;
  }
  return `<span class="cover-fallback">${book.emoji || '📘'}</span><div class="${spineClass}"></div>`;
}

function enrichCartBook(book){
  const source = BOOKS.find(b => b.id === book.id) || BOOKS.find(b => b.title === book.title) || {};
  return {
    ...source,
    ...book,
    cover: book.cover || source.cover || '',
    bg: book.bg || source.bg || 'linear-gradient(145deg,#2A5F8E,#1a3a5c)',
    emoji: book.emoji || source.emoji || '📘',
    author: book.author || source.author || '',
    format: book.format || source.format || 'Poche'
  };
}

function cartPayload(book){
  return `{id:${book.id},title:${JSON.stringify(book.title)},author:${JSON.stringify(book.author)},format:${JSON.stringify(book.format)},price:${book.price},emoji:${JSON.stringify(book.emoji)},cover:${JSON.stringify(book.cover || '')},bg:${JSON.stringify(book.bg)}}`;
}

function refreshBookViews(){
  renderCarousel(BOOKS.slice(0,6),'bs-carousel');
  renderCarousel(BOOKS.slice(6),'nv-carousel');
  renderCarousel(BOOKS.slice(0,8),'catalogue-carousel');
  renderCatalogue();
  if(typeof runSearch === 'function'){
    runSearch(document.getElementById('searchPageInput')?.value || '');
  }
}

async function initApiContent(){
  if(!API_CONFIG.enabled || !API_CONFIG.baseUrl) return;
  try{
    const payload = await fetchApi('books');
    const apiBooks = extractApiList(payload).map(normalizeApiBook);
    if(apiBooks.length > 0){
      BOOKS = apiBooks;
      refreshBookViews();
    }
  } catch(error){
    console.warn('API indisponible, contenu demo conserve.', error);
  }
}

// ─── CART ───
let cart = [];
function getCount(){ return cart.reduce((s,i)=>s+i.qty,0); }
function updateBadges(){
  const n = getCount();
  document.querySelectorAll('.cart-badge').forEach(b=>b.textContent=n);
}
function addToCart(book){
  const item = enrichCartBook(book);
  const ex = cart.find(i=>i.id===item.id && i.format===item.format);
  if(ex){
    ex.qty++;
    if(!ex.cover && item.cover) ex.cover = item.cover;
  }
  else cart.push({...item,qty:1});
  updateBadges();
  showToast('"'+item.title+'" ajouté au panier');
}
function removeFromCart(id,fmt){
  cart=cart.filter(i=>!(i.id===id&&i.format===fmt));
  updateBadges(); renderCart();
}
function changeQty(id,fmt,d){
  const item=cart.find(i=>i.id===id&&i.format===fmt);
  if(!item) return;
  item.qty+=d;
  if(item.qty<=0) removeFromCart(id,fmt);
  else { updateBadges(); renderCart(); }
}

// ─── TOAST ───
let _tt;
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toastMsg').textContent=msg;
  t.classList.add('show');
  clearTimeout(_tt);
  _tt=setTimeout(()=>t.classList.remove('show'),3200);
}

// ─── PAGES ───
function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  window.scrollTo(0,0);
  if(name==='home'){
    renderCarousel(BOOKS.slice(0,6),'bs-carousel');
    renderCarousel(BOOKS.slice(6),'nv-carousel');
  }
  if(name==='catalogue'){
    renderCarousel(BOOKS.slice(0,8),'catalogue-carousel');
    renderCatalogue();
  }
  if(name==='cart') renderCart();
  if(name==='checkout') renderCheckout();
  if(name==='confirm') genOrderCode();
}

// ─── RENDER CAROUSEL ───
function renderCarousel(books,id){
  const c=document.getElementById(id);
  if(!c) return;
  c.innerHTML=books.map(b=>`
    <div class="book-card" onclick="showPage('product')">
      <div class="cover book-cover-box" style="background:${b.bg}">${renderBookCover(b,'sl')}</div>
      <div class="book-card-body">
        <div class="book-card-title">${b.title}</div>
        <div class="book-card-author">${b.author}</div>
        <div class="stars">${'★'.repeat(b.stars)}${'☆'.repeat(5-b.stars)}</div>
        <div class="rc">${b.reviews} avis</div>
        <div class="book-price">${b.price.toFixed(2).replace('.',',')} €</div>
        <button class="add-btn-sm" onclick="event.stopPropagation();addToCart(${cartPayload(b)})">+ Ajouter au panier</button>
      </div>
    </div>`).join('');
}

// ─── RENDER CATALOGUE ───
function renderCatalogue(){
  const g=document.getElementById('catGrid');
  if(!g) return;
  g.innerHTML=BOOKS.map((b,i)=>{
    const discount = [18,12,25,8,15][i % 5];
    const oldPrice = b.price * (1 + discount / 100);
    return `
    <div class="catalogue-book" onclick="showPage('product')">
      <span class="product-badge">${i < 4 ? 'Offre du jour' : 'Livre populaire'}</span>
      <div class="cover book-cover-box" style="background:${b.bg}">${renderBookCover(b,'sl')}</div>
      <div class="catalogue-book-body">
        <div class="catalogue-book-title">${b.title}</div>
        <div class="catalogue-book-author">${b.author}</div>
        <div class="book-price">${b.price.toFixed(2).replace('.',',')} €</div>
        <div class="market-old-price">${oldPrice.toFixed(2).replace('.',',')} € <span>-${discount}%</span></div>
        <div class="stars">${'★'.repeat(b.stars)}${'☆'.repeat(5-b.stars)} <em>(${b.reviews})</em></div>
        <div class="market-delivery">Livraison rapide</div>
        <button class="add-btn-sm" onclick="event.stopPropagation();addToCart(${cartPayload(b)})">+ Ajouter</button>
      </div>
    </div>`;
  }).join('');
  document.getElementById('catCount').textContent=BOOKS.length;
  const topCount=document.getElementById('catCountTop');
  if(topCount) topCount.textContent=BOOKS.length;
}

// ─── RENDER CART ───
function renderCart(){
  const container=document.getElementById('cartContent');
  const title=document.getElementById('cartTitle');
  if(cart.length===0){
    title.textContent='Mon panier';
    container.innerHTML=`<div class="empty-cart">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <h2>Votre panier est vide</h2>
      <p>Explorez notre catalogue et ajoutez vos livres préférés.</p>
      <button class="btn-primary" onclick="showPage('home')">Découvrir nos livres</button>
    </div>`;
    return;
  }
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const ship=sub>=35?0:4.90;
  const total=sub+ship;
  const cnt=getCount();
  title.textContent=`Mon panier (${cnt} article${cnt>1?'s':''})`;
  const items=cart.map(it=>`
    <div class="cart-item">
      <div class="cart-item-cover book-cover-box" style="background:${it.bg}" onclick="showPage('product')">
        ${renderBookCover(it,'spine-mini')}
      </div>
      <div>
        <div class="cart-item-title" onclick="showPage('product')">${it.title}</div>
        <div class="cart-item-author">${it.author}</div>
        <span class="cart-item-format">${it.format}</span>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${it.id},'${it.format}',-1)">−</button>
          <span class="qty-val">${it.qty}</span>
          <button class="qty-btn" onclick="changeQty(${it.id},'${it.format}',1)">+</button>
          <a class="remove-link" onclick="removeFromCart(${it.id},'${it.format}')">Supprimer</a>
        </div>
      </div>
      <div class="cart-item-price">
        <div class="unit-price">${it.price.toFixed(2).replace('.',',')} €/u</div>
        <div class="line-price">${(it.price*it.qty).toFixed(2).replace('.',',')} €</div>
      </div>
    </div>`).join('');
  container.innerHTML=`<div class="cart-layout">
    <div>
      <div class="cart-items-list">${items}</div>
      <div style="margin-top:18px">
        <button class="btn-primary" onclick="showPage('home')" style="background:transparent;color:var(--amber);border:1.5px solid var(--amber)">← Continuer mes achats</button>
      </div>
    </div>
    <div class="order-summary">
      <div class="summary-title">Récapitulatif</div>
      <div class="summary-row"><span>Sous-total (${cnt} art.)</span><span>${sub.toFixed(2).replace('.',',')} €</span></div>
      ${ship===0?`<div class="free-ship"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>Livraison offerte !</div>`:`<div style="font-size:12px;color:var(--muted);background:var(--sand);padding:7px 10px;border-radius:var(--radius);margin-bottom:10px">Plus que <strong style="color:var(--navy)">${(35-sub).toFixed(2).replace('.',',')} €</strong> pour la livraison gratuite</div>`}
      <div class="summary-row"><span>Frais de port</span><span style="color:${ship===0?'var(--green)':'var(--navy)'}">${ship===0?'Gratuit':ship.toFixed(2).replace('.',',')+' €'}</span></div>
      <div class="promo-section"><div class="promo-row">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--light)" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
        <input class="promo-input" type="text" placeholder="Code promo" id="promoInput">
        <button class="promo-apply" onclick="applyPromo()">Appliquer</button>
      </div></div>
      <div class="summary-row total"><span>Total TTC</span><span>${total.toFixed(2).replace('.',',')} €</span></div>
      <button class="btn-checkout" onclick="showPage('checkout')">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Passer la commande
      </button>
      <div class="payment-logos"><span class="pay-badge">VISA</span><span class="pay-badge">MASTERCARD</span><span class="pay-badge">PayPal</span><span class="pay-badge">CB</span></div>
      <div class="reassu-mini">
        <div class="reassu-row"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>Satisfait ou remboursé sous 14 jours</div>
        <div class="reassu-row"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Paiement 100% sécurisé</div>
      </div>
    </div>
  </div>`;
}

// ─── RENDER CHECKOUT SUMMARY ───
function renderCheckout(){
  const items=document.getElementById('csSummaryItems');
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  if(!items) return;
  if(cart.length===0){
    items.innerHTML='<p style="font-size:13px;color:var(--muted)">Panier vide</p>';
    return;
  }
  items.innerHTML=cart.map(it=>`
    <div class="cs-item">
      <div class="cs-cover book-cover-box" style="background:${it.bg}">${renderBookCover(it,'cs-mini-spine')}</div>
      <div class="cs-info"><div class="cs-title">${it.title}</div><div class="cs-sub">${it.format} × ${it.qty}</div></div>
      <div class="cs-price">${(it.price*it.qty).toFixed(2).replace('.',',')} €</div>
    </div>`).join('');
  document.getElementById('csSubtotal').textContent=sub.toFixed(2).replace('.',',')+'  €';
  document.getElementById('csTotal').textContent=sub.toFixed(2).replace('.',',')+' €';
  document.getElementById('checkoutTotal').textContent=sub.toFixed(2).replace('.',',')+' €';
}

// ─── SEARCH ───
function handleSearch(v,ddId){
  const dd=document.getElementById(ddId);
  if(!dd) return;
  if(v.trim().length<1){dd.classList.remove('open');return;}
  const q=v.toLowerCase();
  const res=BOOKS.filter(b=>b.title.toLowerCase().includes(q)||b.author.toLowerCase().includes(q)).slice(0,5);
  if(!res.length){dd.classList.remove('open');return;}
  dd.innerHTML=res.map(b=>`
    <div class="sd-item" onclick="showPage('product')">
      <div class="sd-emoji book-cover-box" style="background:${b.bg};border-radius:3px">${renderBookCover(b,'sd-spine')}</div>
      <div class="sd-text"><div class="sd-title">${b.title}</div><div class="sd-sub">${b.author} · ${b.price.toFixed(2).replace('.',',')} €</div></div>
    </div>`).join('');
  dd.classList.add('open');
}
function closeDD(id){const dd=document.getElementById(id);if(dd) dd.classList.remove('open')}

// ─── FORMAT SELECTOR ───
function selectFormat(el,p){
  document.querySelectorAll('.fmt-option').forEach(f=>f.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('selPrice').textContent=parseFloat(p).toFixed(2).replace('.',',')+' €';
}

// ─── TABS ───
function switchTab(btn,name){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-'+name).classList.add('active');
}

// ─── AUTH TABS ───
function switchAuthTab(btn,name){
  document.querySelectorAll('.auth-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('auth-'+name).classList.add('active');
}
function togglePw(id,btn){
  const inp=document.getElementById(id);
  inp.type=inp.type==='password'?'text':'password';
}
function loginAction(){showToast('Connexion réussie — Bienvenue !');setTimeout(()=>showPage('home'),800)}
function registerAction(){showToast('Compte créé avec succès !');setTimeout(()=>showPage('home'),800)}

// ─── PROMO ───
function applyPromo(){
  const v=document.getElementById('promoInput')?.value?.trim().toUpperCase();
  showToast(v==='CHAPITRE10'?'Code promo appliqué : −10 %':'Code promo invalide ou expiré');
}

// ─── ORDER CODE ───
function genOrderCode(){
  const codes='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r='CHQ-2025-';
  for(let i=0;i<5;i++) r+=codes[Math.floor(Math.random()*codes.length)];
  const el=document.getElementById('orderCode');
  if(el) el.textContent=r;
}



function goConfirm(){ showPage('confirm'); }
function goHome(){ showPage('home'); cart=[]; if(typeof updateBadges==='function') updateBadges(); }
// ─── RECU DE PAIEMENT ───
var lastOrderData = null;

function renderReceipt() {
  var d = lastOrderData;
  if (!d) return;
  var items = d.items;
  var subtotal = items.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
  var total = subtotal;
  var recu = d.montantRecu;
  var reste = Math.max(0, total - recu);
  var rendu = Math.max(0, recu - total);

  var statusClass, statusIcon, statusLabel, statusSub;
  if (reste <= 0) {
    statusClass = 'paid'; statusIcon = '&#10003;';
    statusLabel = 'Paiement integralement recu';
    statusSub = rendu > 0 ? 'Monnaie rendue : ' + rendu.toFixed(2).replace('.',',') + ' EUR' : 'Aucun rendu';
  } else {
    statusClass = 'partial'; statusIcon = '&#8987;';
    statusLabel = 'Paiement partiel';
    statusSub = 'Reste a regler : ' + reste.toFixed(2).replace('.',',') + ' EUR';
  }

  var rowsHtml = items.map(function(it) {
    var lineAmt = (it.price * it.qty).toFixed(2).replace('.',',');
    var unitPrice = it.price.toFixed(2).replace('.',',');
    return '<tr>'
      + '<td><div style="display:flex;align-items:center">'
      + '<div class="rcp-book-cover book-cover-box" style="background:' + it.bg + '">'
      + renderBookCover(it, 'rspine') + '</div>'
      + '<div class="rcp-book-info">'
      + '<div class="rcp-book-title">' + it.title + '</div>'
      + '<div class="rcp-book-author">' + it.author + '</div>'
      + '<span class="rcp-book-format">' + it.format + '</span>'
      + '</div></div></td>'
      + '<td class="tc">' + it.qty + '</td>'
      + '<td class="tr">' + unitPrice + ' EUR</td>'
      + '<td class="ta">' + lineAmt + ' EUR</td>'
      + '</tr>';
  }).join('');

  var html = '<div class="receipt-doc">'

    + '<div class="rcp-header">'
    + '<div><div class="rcp-brand-logo">'
    + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    + 'Chapitre</div>'
    + '<div class="rcp-brand-tagline">Votre librairie en ligne independante</div></div>'
    + '<div class="rcp-meta">'
    + '<div class="rcp-title">Recu de paiement</div>'
    + '<div class="rcp-num"># ' + d.ref + '</div>'
    + '<div class="rcp-date">' + d.date + '</div>'
    + '</div></div>'

    + '<div class="rcp-parties">'
    + '<div class="rcp-party">'
    + '<div class="rcp-party-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>Emetteur</div>'
    + '<div class="rcp-party-name">' + d.emetteur.name + '</div>'
    + '<div class="rcp-party-line">' + d.emetteur.address + '</div>'
    + '<div class="rcp-party-line">' + d.emetteur.city + '</div>'
    + '<div class="rcp-party-line">' + d.emetteur.phone + '</div>'
    + '<div class="rcp-party-line">' + d.emetteur.email + '</div>'
    + '</div>'
    + '<div class="rcp-party">'
    + '<div class="rcp-party-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Client</div>'
    + '<div class="rcp-party-name">' + d.client.name + '</div>'
    + '<div class="rcp-party-line">' + d.client.address + '</div>'
    + '<div class="rcp-party-line">' + d.client.city + '</div>'
    + '<div class="rcp-party-line">' + d.client.phone + '</div>'
    + '<div class="rcp-party-line">' + d.client.email + '</div>'
    + '</div></div>'

    + '<table class="rcp-table"><thead><tr>'
    + '<th>Designation</th><th class="tc">Qte</th>'
    + '<th class="tr">Prix unitaire</th><th class="tr">Montant</th>'
    + '</tr></thead><tbody>' + rowsHtml + '</tbody></table>'

    + '<div class="rcp-totals"><div class="rcp-totals-inner">'
    + '<div class="rcp-total-row"><span>Sous-total</span><span>' + subtotal.toFixed(2).replace('.',',') + ' EUR</span></div>'
    + '<div class="rcp-total-row"><span>Frais de port</span><span class="c-green">Gratuit</span></div>'
    + '<div class="rcp-total-row grand"><span>Total TTC</span><span>' + total.toFixed(2).replace('.',',') + ' EUR</span></div>'
    + '</div></div>'

    + '<div class="rcp-pay-block">'
    + '<div class="rcp-pay-cell recu">'
    + '<div class="rpc-label">Montant recu</div>'
    + '<div class="rpc-val">' + recu.toFixed(2).replace('.',',') + ' EUR</div>'
    + '<div class="rpc-sub">' + d.modePaiement + '</div>'
    + '</div>'
    + '<div class="rcp-pay-cell rendu">'
    + '<div class="rpc-label">Monnaie rendue</div>'
    + '<div class="rpc-val" style="color:' + (rendu > 0 ? 'var(--amber)' : 'var(--muted)') + '">' + rendu.toFixed(2).replace('.',',') + ' EUR</div>'
    + '<div class="rpc-sub">' + (rendu > 0 ? 'Rendu au client' : 'Aucune monnaie') + '</div>'
    + '</div>'
    + '<div class="rcp-pay-cell reste-cell">'
    + '<div class="rpc-label">Reste a payer</div>'
    + '<div class="rpc-val" style="color:' + (reste > 0 ? 'var(--red)' : 'var(--green)') + '">' + reste.toFixed(2).replace('.',',') + ' EUR</div>'
    + '<div class="rpc-sub">' + (reste > 0 ? 'Solde impaye' : 'Solde') + '</div>'
    + '</div></div>'

    + '<div class="rcp-status-bar ' + statusClass + '">'
    + '<span style="font-size:20px">' + statusIcon + '</span>'
    + '<div class="rcp-status-text">'
    + '<div class="rst-label">Statut du paiement</div>'
    + '<div>' + statusLabel + '</div>'
    + '<div style="font-size:12px;font-weight:400;opacity:.8;margin-top:2px">' + statusSub + '</div>'
    + '</div></div>'

    + '<div class="rcp-footer">'
    + '<div class="rcp-footer-note"><strong>Chapitre</strong> &middot; contact@chapitre.fr &middot; +33 1 23 45 67 89<br>'
    + 'Ce document tient lieu de recu officiel de paiement. Merci de le conserver.<br>'
    + 'Satisfait ou rembourse sous 14 jours &middot; SIRET : 123 456 789 00012</div>'
    + '<div class="rcp-footer-qr">&#129534;</div>'
    + '</div>'
    + '</div>';

  var actions = '<div class="receipt-actions">'
    + '<button class="btn-receipt outline" onclick="showPage(\'confirm\')">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>'
    + 'Retour</button>'
    + '<button class="btn-receipt outline" onclick="window.print()">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>'
    + 'Imprimer</button>'
    + '<button class="btn-receipt amber" onclick="showToast(\'Recu telecharge\')">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
    + 'Telecharger PDF</button>'
    + '<button class="btn-receipt primary" onclick="goHome()">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    + 'Retour boutique</button>'
    + '</div>';

  document.getElementById('receiptContent').innerHTML = html + actions;
  updateBadges();
}

function showReceipt() {
  var sub = cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var ref = 'CHQ-2025-';
  for (var i = 0; i < 5; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  var now = new Date();
  var dateStr = now.toLocaleDateString('fr-FR', {day:'2-digit',month:'long',year:'numeric'})
    + ' a ' + now.toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'});
  lastOrderData = {
    ref: ref,
    date: dateStr,
    items: cart.slice(),
    montantRecu: Math.ceil(sub) + (Math.ceil(sub) % 5 === 0 ? 5 : (5 - Math.ceil(sub) % 5)),
    modePaiement: 'Carte bancaire (CB)',
    emetteur: { name:'Chapitre SARL', address:'12 rue de la Paix', city:'69001 Lyon, France', phone:'+33 1 23 45 67 89', email:'contact@chapitre.fr' },
    client: { name:'Jean Dupont', address:'12 rue des Lilas', city:'75011 Paris, France', phone:'+33 6 12 34 56 78', email:'jean.dupont@exemple.com' }
  };
  showPage('receipt');
  renderReceipt();
}


// ─── MOT DE PASSE OUBLIE ───
function showForgotStep(n) {
  document.querySelectorAll('.forgot-step').forEach(function(s){ s.classList.remove('active'); });
  var el = document.getElementById('forgot-step' + n);
  if (el) el.classList.add('active');
}

function forgotStep1() {
  var email = document.getElementById('forgotEmail').value.trim();
  if (!email || !email.includes('@')) {
    document.getElementById('forgotEmail').style.borderColor = 'var(--red)';
    showToast('Veuillez saisir une adresse e-mail valide');
    return;
  }
  document.getElementById('forgotEmailDisplay').textContent = email;
  ['otp1','otp2','otp3','otp4','otp5','otp6'].forEach(function(id){ document.getElementById(id).value = ''; });
  showForgotStep(2);
  document.getElementById('otp1').focus();
}

function otpNext(el, nextId) {
  el.value = el.value.replace(/[^0-9]/g, '');
  if (el.value.length === 1 && nextId) {
    var next = document.getElementById(nextId);
    if (next) next.focus();
  }
}

function otpBack(e, el, prevId) {
  if (e.key === 'Backspace' && !el.value && prevId) {
    var prev = document.getElementById(prevId);
    if (prev) { prev.value = ''; prev.focus(); }
  }
}

function forgotStep2() {
  var code = ['otp1','otp2','otp3','otp4','otp5','otp6'].map(function(id){ return document.getElementById(id).value; }).join('');
  if (code.length < 6) { showToast('Veuillez saisir le code à 6 chiffres'); return; }
  // Simulation : tout code à 6 chiffres est accepté
  showForgotStep(3);
  document.getElementById('newPw').value = '';
  document.getElementById('confirmPw').value = '';
  document.getElementById('pwBar').style.width = '0%';
  document.getElementById('pwLabel').textContent = '';
}

function resendOtp() {
  var msg = document.getElementById('resendMsg');
  msg.style.display = 'block';
  setTimeout(function(){ msg.style.display = 'none'; }, 3000);
}

function checkPwStrength(val) {
  var bar = document.getElementById('pwBar');
  var label = document.getElementById('pwLabel');
  var score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  var colors = ['','var(--red)','var(--amber)','#5BA85A','var(--green)'];
  var labels = ['','Très faible','Faible','Bon','Excellent'];
  var widths = ['0%','25%','50%','75%','100%'];
  bar.style.width = widths[score] || '0%';
  bar.style.background = colors[score] || 'transparent';
  label.textContent = val.length > 0 ? labels[score] : '';
  label.style.color = colors[score] || 'var(--muted)';
}

function forgotStep3() {
  var pw = document.getElementById('newPw').value;
  var cpw = document.getElementById('confirmPw').value;
  if (pw.length < 8) { showToast('Le mot de passe doit contenir au moins 8 caractères'); return; }
  if (pw !== cpw) { showToast('Les mots de passe ne correspondent pas'); document.getElementById('confirmPw').style.borderColor = 'var(--red)'; return; }
  showForgotStep(4);
}


// Pub sticky
setTimeout(function(){
  var s = document.getElementById('adSticky');
  if(s) s.classList.add('visible');
}, 3000);


// ─── PAIEMENT MOBILE MONEY ───
var qrTimer = null;
var qrSeconds = 600;

var PAY_CONFIG = {
  orange: {
    name: 'Orange Money',
    color: '#FF6600',
    logo: 'OM',
    sub: 'Scannez avec votre app Orange Money',
    number: '+225 07 00 00 00 00',
    steps: [
      'Ouvrez votre application Orange Money',
      'Appuyez sur "Scanner un QR code"',
      'Visez le code ci-dessus et confirmez',
      'Entrez votre code PIN pour valider'
    ]
  },
  mtn: {
    name: 'MTN MoMo',
    color: '#FFCC00',
    textColor: '#1A1A1A',
    logo: 'MTN',
    sub: 'Scannez avec votre app MTN MoMo',
    number: '+225 05 00 00 00 00',
    steps: [
      'Ouvrez l\u2019application MTN MoMo',
      'Sélectionnez "Payer avec QR code"',
      'Scannez le QR code ci-dessus',
      'Confirmez avec votre PIN MoMo'
    ]
  },
  moov: {
    name: 'Moov Money (Flooz)',
    color: '#00AAFF',
    logo: 'MOV',
    sub: 'Scannez avec votre app Moov Money',
    number: '+225 01 00 00 00 00',
    steps: [
      'Ouvrez l\'application Moov Money',
      'Choisissez "Paiement QR"',
      'Pointez sur le QR code affiché',
      'Validez avec votre code secret Flooz'
    ]
  },
  wave: {
    name: 'Wave',
    color: '#1BC5BD',
    logo: 'W~',
    sub: 'Scannez avec votre app Wave — 0% de frais',
    number: '+225 07 12 34 56 78',
    steps: [
      'Ouvrez l\'application Wave',
      'Appuyez sur l\'icône Scanner',
      'Scannez le QR code ci-dessus',
      'Confirmez le paiement dans l\'app'
    ]
  }
};

function selectPay(type, el) {
  document.querySelectorAll('.pay-method').forEach(function(p){ p.classList.remove('selected'); });
  el.classList.add('selected');
  var cardFields = document.getElementById('cardFields');
  if (cardFields) cardFields.style.display = type === 'card' ? 'grid' : 'none';
}

function generateQrSvg(color, size) {
  size = size || 160;
  var cell = 8;
  var cells = Math.floor(size / cell);
  var svg = '';
  // Seed from color to get deterministic pattern
  var seed = color.split('').reduce(function(a,c){ return a + c.charCodeAt(0); }, 0);
  var rng = function(n) { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return Math.abs(seed % n); };

  // Draw background
  svg += '<rect width="' + size + '" height="' + size + '" fill="white"/>';

  // Draw data cells (skip finder pattern areas)
  for (var r = 0; r < cells; r++) {
    for (var c = 0; c < cells; c++) {
      // Skip finder pattern corners (top-left, top-right, bottom-left)
      var inTL = r < 9 && c < 9;
      var inTR = r < 9 && c >= cells - 9;
      var inBL = r >= cells - 9 && c < 9;
      if (!inTL && !inTR && !inBL && rng(2) === 0) {
        svg += '<rect x="' + (c*cell) + '" y="' + (r*cell) + '" width="' + cell + '" height="' + cell + '" fill="' + color + '"/>';
      }
    }
  }

  // Finder patterns (3 corners)
  function finder(x, y) {
    svg += '<rect x="' + x + '" y="' + y + '" width="' + (7*cell) + '" height="' + (7*cell) + '" fill="' + color + '" rx="2"/>';
    svg += '<rect x="' + (x+cell) + '" y="' + (y+cell) + '" width="' + (5*cell) + '" height="' + (5*cell) + '" fill="white"/>';
    svg += '<rect x="' + (x+2*cell) + '" y="' + (y+2*cell) + '" width="' + (3*cell) + '" height="' + (3*cell) + '" fill="' + color + '"/>';
  }
  finder(0, 0);
  finder((cells - 7) * cell, 0);
  finder(0, (cells - 7) * cell);

  // Center logo
  var cx = size/2 - 16, cy = size/2 - 16;
  svg += '<rect x="' + cx + '" y="' + cy + '" width="32" height="32" fill="white" rx="4"/>';
  svg += '<rect x="' + (cx+3) + '" y="' + (cy+3) + '" width="26" height="26" fill="' + color + '" rx="3"/>';

  return svg;
}

function openQr(type) {
  var cfg = PAY_CONFIG[type];
  if (!cfg) return;

  // Amount from cart
  var total = cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
  var xof = Math.round(total * 655.957);
  var ref = 'CHQ-' + Date.now().toString(36).toUpperCase().slice(-6);

  // Populate modal
  var badge = document.getElementById('qrBadge');
  badge.textContent = cfg.logo;
  badge.style.background = cfg.color;
  badge.style.color = cfg.textColor || 'white';

  document.getElementById('qrTitle').textContent = cfg.name;
  document.getElementById('qrSub').textContent = cfg.sub;
  document.getElementById('qrAmount').textContent = xof.toLocaleString('fr-FR') + ' FCFA  (' + total.toFixed(2).replace('.',',') + ' EUR)';
  document.getElementById('qrRef').textContent = 'Réf: ' + ref + '  ·  ' + cfg.number;

  // QR SVG
  document.getElementById('qrSvg').innerHTML = generateQrSvg(cfg.color, 160);

  // Steps
  document.getElementById('qrSteps').innerHTML = cfg.steps.map(function(s, i) {
    return '<div class="qr-step">'
      + '<span class="qr-step-num" style="background:' + cfg.color + '">' + (i+1) + '</span>'
      + '<span>' + s + '</span>'
      + '</div>';
  }).join('');

  // Confirm button
  var btn = document.getElementById('qrConfirmBtn');
  btn.style.background = cfg.color;
  btn.style.color = cfg.textColor || 'white';
  btn.textContent = 'J\'ai effectué le paiement';

  // Timer
  qrSeconds = 600;
  clearInterval(qrTimer);
  updateQrTimer();
  qrTimer = setInterval(updateQrTimer, 1000);

  // Open
  document.getElementById('qrModalOverlay').classList.add('open');
}

function updateQrTimer() {
  if (qrSeconds <= 0) {
    clearInterval(qrTimer);
    document.getElementById('qrTimerVal').textContent = 'Expiré';
    return;
  }
  var m = Math.floor(qrSeconds / 60);
  var s = qrSeconds % 60;
  document.getElementById('qrTimerVal').textContent = m + ':' + (s < 10 ? '0' : '') + s;
  qrSeconds--;
}

function closeQr() {
  clearInterval(qrTimer);
  document.getElementById('qrModalOverlay').classList.remove('open');
}

function qrSimulatePay() {
  closeQr();
  showPage('confirm');
  if (typeof genOrderCode === 'function') genOrderCode();
}

// ─── INIT ───
renderCarousel(BOOKS.slice(0,6),'bs-carousel');
renderCarousel(BOOKS.slice(6),'nv-carousel');
renderCarousel(BOOKS.slice(0,8),'catalogue-carousel');
renderCatalogue();
updateBadges();
initApiContent();

// ─── ACCOUNT TABS ───
function switchAccountTab(el,name){
  document.querySelectorAll('.account-nav-item').forEach(i=>i.classList.remove('active'));
  document.querySelectorAll('.acc-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('acc-'+name).classList.add('active');
}

// ─── SEARCH ───
function runSearch(q){
  const results=document.getElementById('searchResults');
  const countEl=document.getElementById('searchCount');
  const queryEl=document.getElementById('searchQuery');
  if(queryEl) queryEl.textContent='"'+(q||'tout')+ '"';
  const matches=q.trim()===''?BOOKS:BOOKS.filter(b=>
    b.title.toLowerCase().includes(q.toLowerCase())||
    b.author.toLowerCase().includes(q.toLowerCase())
  );
  if(countEl) countEl.textContent=matches.length;
  if(!results) return;
  if(matches.length===0){
    results.innerHTML=`<div class="no-results"><div class="nr-icon">🔍</div><h3>Aucun résultat trouvé</h3><p>Essayez avec d'autres mots-clés ou explorez notre <a onclick="showPage('catalogue')" style="color:var(--amber);cursor:pointer">catalogue complet</a>.</p></div>`;
    return;
  }
  results.innerHTML=matches.map(b=>`
    <div class="search-result-item" onclick="showPage('product')">
      <div class="sri-cover book-cover-box" style="background:${b.bg}">${renderBookCover(b,'sml')}</div>
      <div class="sri-info">
        <div class="sri-title">${b.title}</div>
        <div class="sri-author">${b.author}</div>
        <div class="sri-stars">${'★'.repeat(b.stars)}${'☆'.repeat(5-b.stars)} <span style="color:var(--muted);font-size:12px">${b.reviews} avis</span></div>
        <div class="sri-synopsis">Roman de référence du genre, traduit dans plus de 50 langues, primé au Hugo Award et Nebula Award.</div>
        <div class="sri-formats"><span class="sri-fmt">${b.format}</span>${b.price<10?'<span class="sri-fmt">Ebook dispo</span>':''}</div>
      </div>
      <div class="sri-cta">
        <div class="sri-price">${b.price.toFixed(2).replace('.',',')} €</div>
        <div class="sri-price-sub">Prix poche</div>
        <button class="add-btn-sm" style="width:120px" onclick="event.stopPropagation();addToCart(${cartPayload(b)})">+ Ajouter</button>
      </div>
    </div>`).join('');
}

// ─── AUTHOR CAROUSEL ───
function renderAuthorCarousel(){
  const c=document.getElementById('author-carousel');
  if(!c) return;
  const herbertBooks=[
    {id:1,title:'Dune',price:9.50,stars:5,reviews:142,emoji:'📘',cover:'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',bg:'linear-gradient(145deg,#2A5F8E,#1a3a5c)',format:'Poche'},
    {id:13,title:'Le Messie de Dune',price:9.90,stars:5,reviews:87,emoji:'📙',cover:'https://covers.openlibrary.org/b/isbn/9780593098233-L.jpg',bg:'linear-gradient(145deg,#3A6B7A,#1E3E4E)',format:'Poche'},
    {id:14,title:"Les Enfants de Dune",price:10.20,stars:5,reviews:64,emoji:'📗',cover:'https://covers.openlibrary.org/b/isbn/9780593098240-L.jpg',bg:'linear-gradient(145deg,#5A7B3A,#2E4E1E)',format:'Poche'},
    {id:15,title:"L'Empereur-Dieu de Dune",price:10.50,stars:4,reviews:48,emoji:'📕',cover:'https://covers.openlibrary.org/b/isbn/9780593098257-L.jpg',bg:'linear-gradient(145deg,#7A3A5A,#4E1E2E)',format:'Poche'},
    {id:16,title:'Les Hérétiques de Dune',price:10.90,stars:4,reviews:39,emoji:'📓',cover:'https://covers.openlibrary.org/b/isbn/9780593098264-L.jpg',bg:'linear-gradient(145deg,#3A3A7A,#1E1E4E)',format:'Poche'},
  ];
  c.innerHTML=herbertBooks.map(b=>`
    <div class="book-card" onclick="showPage('product')">
      <div class="cover book-cover-box" style="background:${b.bg}">${renderBookCover(b,'sl')}</div>
      <div class="book-card-body">
        <div class="book-card-title">${b.title}</div>
        <div class="book-card-author">Frank Herbert</div>
        <div class="stars">${'★'.repeat(b.stars)}${'☆'.repeat(5-b.stars)}</div>
        <div class="rc">${b.reviews} avis</div>
        <div class="book-price">${b.price.toFixed(2).replace('.',',')} €</div>
        <button class="add-btn-sm" onclick="event.stopPropagation();addToCart(${cartPayload({...b,author:'Frank Herbert'})})">+ Ajouter</button>
      </div>
    </div>`).join('');
}

// ─── OVERRIDE showPage to handle new pages ───
const _origShowPage=showPage;
showPage=function(name){
  _origShowPage(name);
  if(name==='home'){
    renderCarousel(BOOKS.slice(0,6),'bs-carousel');
    renderCarousel(BOOKS.slice(6),'nv-carousel');
  }
  if(name==='catalogue'){
    renderCarousel(BOOKS.slice(0,8),'catalogue-carousel');
    renderCatalogue();
  }
  if(name==='search') runSearch(document.getElementById('searchPageInput')?.value||'');
  if(name==='author') renderAuthorCarousel();
  // update product page author link to go to author page
};

// Link "product-author" to author page (onclick already coded in HTML)
document.querySelectorAll('.product-author').forEach(a=>{
  a.onclick=()=>showPage('author');
});

// Link login actions to account
loginAction=function(){showToast('Connexion réussie — Bienvenue, Jean !');setTimeout(()=>showPage('account'),800)};
registerAction=function(){showToast('Compte créé avec succès !');setTimeout(()=>showPage('account'),800)};

// Re-run init for new badges
updateBadges();
renderAuthorCarousel();
runSearch('science');

(() => {
  const pageByPath = {
    '/catalogue': 'catalogue',
    '/livre': 'product',
    '/panier': 'cart',
    '/connexion': 'login',
    '/commande': 'checkout',
    '/compte': 'account',
    '/recherche': 'search'
  };
  const initialPage = pageByPath[window.location.pathname];
  if (initialPage && typeof showPage === 'function') {
    showPage(initialPage);
  }
})();
