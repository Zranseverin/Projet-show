// ─── DATA ───
let BOOKS = [];
let CATALOGUE_FILTERS = null;
let DELIVERY_OPTIONS = [];
let ADVERTISEMENTS = {};

// ─── API FRONT ───
const API_CONFIG = window.LIBRAIRIE_API || {};

function buildApiUrl(endpointKey, params = {}){
  const endpoints = API_CONFIG.endpoints || {};
  const parts = String(endpointKey || '').split('/');
  const endpoint = endpoints[endpointKey] || (endpoints[parts[0]] ? endpoints[parts[0]].replace(/\/$/, '') + '/' + parts.slice(1).join('/') : endpointKey);
  const base = (API_CONFIG.baseUrl || '').replace(/\/$/, '');
  const path = String(endpoint || '').startsWith('/') ? endpoint : '/' + endpoint;
  const url = new URL(base + path);
  Object.entries(params).forEach(([key,value])=>{
    if(value !== undefined && value !== null && value !== '') url.searchParams.set(key,value);
  });
  return url.toString();
}

async function fetchApi(endpointKey, params = {}, options = {}){
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), Number(API_CONFIG.timeout || 8000));
  const headers = { 'Accept': 'application/json', ...(options.headers || {}) };
  const fetchOptions = {
    method: options.method || 'GET',
    headers,
    signal: controller.signal
  };
  if(options.body !== undefined){
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    fetchOptions.headers['Content-Type'] = 'application/json';
  }
  try{
    const response = await fetch(buildApiUrl(endpointKey, params), fetchOptions);
    if(!response.ok){
      let message = 'API HTTP ' + response.status;
      try{
        const payload = await response.json();
        message = payload.message || message;
      } catch(error){}
      throw new Error(message);
    }
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
    format: book.format || book.type || 'Broché',
    old_price: book.old_price ? Number(book.old_price) : null,
    stock: Number(book.stock ?? book.stock_quantity ?? 0),
    isbn: book.isbn || '',
    description: book.description || '',
    publisher: book.publisher || book.editeur || '',
    publication_date: book.publication_date || book.published_at || book.date_de_parution || '',
    page_count: book.page_count || book.pages || '',
    dimensions: book.dimensions || '',
    translator: book.translator || book.traducteur || '',
    language: book.language || book.langue || '',
    collection: book.collection || '',
    available_formats: Array.isArray(book.available_formats || book.formats)
      ? (book.available_formats || book.formats).map(format=>({
          name: format.name || format.format || format.label || String(format),
          price: Number(format.price ?? price)
        }))
      : [],
    categories: Array.isArray(book.categories) ? book.categories : []
  };
}

function escapeHtml(value){
  return String(value ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

function escapeAttr(value){
  return String(value ?? '').replace(/"/g,'&quot;');
}

function normalizeAdvertisement(advertisement){
  if(!advertisement) return null;
  return {
    placement: advertisement.placement || '',
    label: advertisement.label || '',
    title: advertisement.title || '',
    subtitle: advertisement.subtitle || advertisement.description || '',
    image_url: advertisement.image_url || advertisement.image || '',
    button_text: advertisement.button_text || '',
    button_url: advertisement.button_url || advertisement.url || '',
    background: advertisement.background || '',
    button_background: advertisement.button_background || '',
    button_color: advertisement.button_color || '',
    is_active: advertisement.is_active !== false && advertisement.is_active !== 0
  };
}

function setAdText(root, selectors, value){
  const element = selectors.map(selector=>root.querySelector(selector)).find(Boolean);
  if(element && value !== undefined && value !== null) element.textContent = value;
}

function applyAdvertisement(placement, rootId){
  const root = document.getElementById(rootId);
  if(!root) return;

  const advertisement = normalizeAdvertisement(ADVERTISEMENTS[placement]);
  if(!advertisement){
    root.style.display = 'none';
    return;
  }
  if(!advertisement.is_active){
    root.style.display = 'none';
    return;
  }

  root.style.display = '';
  if(advertisement.background) root.style.background = advertisement.background;
  root.onclick = () => {
    if(advertisement.button_url){
      window.open(advertisement.button_url, '_blank', 'noopener');
      return;
    }
    showToast('Publicite : '+(advertisement.title || advertisement.label || 'Annonce'));
  };

  const image = root.querySelector('img');
  if(image && advertisement.image_url){
    image.src = advertisement.image_url;
    image.alt = advertisement.title || advertisement.label || 'Publicite';
  }

  setAdText(root, ['.ad-banner-tag', '.ad-card-brand', '.ad-sidebar-tag'], advertisement.label);
  setAdText(root, ['.ad-banner-title', '.ad-card-title', '.ad-sidebar-title'], advertisement.title);
  setAdText(root, ['.ad-banner-sub', '.ad-card-sub', '.ad-sidebar-sub'], advertisement.subtitle);

  const button = root.querySelector('.btn-primary, .ad-card-btn, .ad-sidebar-btn');
  if(button){
    button.style.display = advertisement.button_text ? '' : 'none';
    button.textContent = advertisement.button_text || '';
    if(advertisement.button_background) button.style.background = advertisement.button_background;
    if(advertisement.button_color) button.style.color = advertisement.button_color;
    button.onclick = (event) => {
      event.stopPropagation();
      if(advertisement.button_url){
        window.open(advertisement.button_url, '_blank', 'noopener');
        return;
      }
      showToast('Publicite : '+(advertisement.title || advertisement.label || 'Annonce'));
    };
  }
}

function renderAdvertisements(){
  applyAdvertisement('home_banner', 'adBanner1');
  applyAdvertisement('home_duo_left', 'adHomeDuoLeft');
  applyAdvertisement('home_duo_right', 'adHomeDuoRight');
  applyAdvertisement('catalog_sidebar', 'adCatalogSidebar');
  applyAdvertisement('sticky_bottom', 'adSticky');
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

let currentProduct = null;
let currentProductFormat = null;

function productPayload(book){
  return JSON.stringify(book).replace(/</g,'\\u003c').replace(/'/g,'&#39;');
}

function priceLabel(value){
  return Math.round(Number(value || 0)).toLocaleString('fr-FR')+' FCFA';
}

function formatDateFr(value){
  if(!value) return 'Non renseigné';
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function buildProductFormats(book){
  const apiFormats = Array.isArray(book.available_formats) ? book.available_formats : [];
  if(apiFormats.length > 0){
    return apiFormats.map(format=>({
      name: format.name || format.format || 'Format',
      price: Number(format.price ?? book.price)
    }));
  }

  const basePrice = Number(book.price || 0);
  const baseFormat = book.format || 'Poche';
  const multipliers = {
    'Poche': 1,
    'Broché': 1.45,
    'Broche': 1.45,
    'Ebook': 0.65,
    'Grand format': 1.75
  };
  return [...new Set([baseFormat, 'Poche', 'Broché', 'Ebook', 'Grand format'])].map(format=>({
    name: format,
    price: format === baseFormat ? basePrice : Math.round(basePrice * (multipliers[format] || 1) / 100) * 100
  }));
}

function renderProductPage(){
  const book = currentProduct || BOOKS[0];
  if(!book){
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if(el) el.textContent = value;
    };
    setText('productBreadcrumbTitle', 'Livre indisponible');
    setText('productTitle', 'Livre indisponible');
    setText('productAuthor', 'Catalogue API');
    setText('selPrice', priceLabel(0));
    setText('productStock', 'Aucun livre charge depuis l API');
    const addBtn = document.getElementById('productAddBtn');
    if(addBtn) addBtn.disabled = true;
    const formats = document.getElementById('productFormats');
    if(formats) formats.innerHTML = '<div class="fmt-option selected"><div class="fmt-name">Aucun format</div><div class="fmt-price">API requise</div></div>';
    const desc = document.getElementById('productDescription');
    if(desc) desc.innerHTML = '<p>Aucune fiche produit dynamique n est disponible pour le moment.</p>';
    return;
  }

  const title = book.title || 'Livre sans titre';
  const reviews = Number(book.reviews || 0);
  const stars = Math.max(1, Math.min(5, Math.round(Number(book.stars || 4))));
  const category = book.categories?.[0]?.name || 'Catalogue';
  const oldPrice = Number(book.old_price || 0);
  const productFormats = buildProductFormats(book);
  currentProductFormat = currentProductFormat && productFormats.some(format=>format.name === currentProductFormat.name)
    ? currentProductFormat
    : productFormats[0];
  const price = Number(currentProductFormat?.price ?? book.price ?? 0);
  const save = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const stock = Number(book.stock ?? 0);

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if(el) el.textContent = value;
  };
  const addBtn = document.getElementById('productAddBtn');
  if(addBtn) addBtn.disabled = false;

  setText('productBreadcrumbTitle', title);
  setText('productCategoryCrumb', category);
  setText('productTitle', title);
  setText('productAuthor', book.author || 'Auteur inconnu');
  setText('productStars', '★'.repeat(stars)+'☆'.repeat(5-stars));
  setText('productRating', Number(book.stars || 0).toFixed(1));
  setText('productReviewsLink', reviews+' avis clients');
  setText('selPrice', priceLabel(price));
  setText('productStock', stock > 0 ? `En stock — ${stock} exemplaire${stock > 1 ? 's' : ''}` : 'Stock indisponible');
  setText('productIsbn', book.isbn || 'Non renseigné');
  setText('productPublisher', book.publisher || 'Non renseigné');
  setText('productPublicationDate', formatDateFr(book.publication_date));
  setText('productPageCount', book.page_count ? `${book.page_count} pages` : 'Non renseigné');
  setText('productDimensions', book.dimensions || 'Non renseigné');
  setText('productTranslator', book.translator || 'Non renseigné');
  setText('productLanguage', book.language || 'Non renseigné');
  setText('productCollection', book.collection || 'Non renseigné');

  const coverFrame = document.getElementById('productCoverFrame');
  if(coverFrame) coverFrame.style.background = book.bg || 'linear-gradient(145deg,#2A5F8E,#1a3a5c)';

  const coverImg = document.getElementById('productCoverImg');
  const coverFallback = document.getElementById('productCoverFallback');
  if(coverImg){
    coverImg.alt = title;
    coverImg.style.display = book.cover ? '' : 'none';
    if(book.cover) coverImg.src = book.cover;
    coverImg.onerror = () => {
      coverImg.style.display = 'none';
      if(coverFallback) coverFallback.style.display = '';
    };
  }
  if(coverFallback){
    coverFallback.textContent = book.emoji || '📘';
    coverFallback.style.display = book.cover ? 'none' : '';
  }

  const formats = document.getElementById('productFormats');
  if(formats){
    formats.innerHTML = productFormats.map((format, index)=>`
      <div class="fmt-option ${format.name === currentProductFormat?.name || (!currentProductFormat && index === 0) ? 'selected' : ''}" onclick='selectFormat(this,${Number(format.price || 0)},${JSON.stringify(format.name).replace(/'/g,'&#39;')})'>
        <div class="fmt-name">${escapeHtml(format.name)}</div>
        <div class="fmt-price">${priceLabel(format.price)}</div>
      </div>
    `).join('');
  }

  const oldPriceEl = document.getElementById('productOldPrice');
  const saveEl = document.getElementById('productSave');
  if(oldPriceEl){
    oldPriceEl.style.display = oldPrice > price ? '' : 'none';
    oldPriceEl.textContent = priceLabel(oldPrice);
  }
  if(saveEl){
    saveEl.style.display = save > 0 ? '' : 'none';
    saveEl.textContent = `-${save} %`;
  }

  const desc = document.getElementById('productDescription');
  if(desc){
    const text = book.description || `Retrouvez ${title} dans notre catalogue.`;
    desc.innerHTML = `<p>${escapeHtml(text).replace(/\n+/g,'</p><p>')}</p>`;
  }
}

async function openProduct(book){
  const selectedBook = typeof book === 'object' ? book : BOOKS.find(b => String(b.id) === String(book));
  if(!selectedBook){
    showToast('Livre indisponible depuis l API');
    return;
  }
  currentProduct = enrichCartBook(selectedBook);
  currentProductFormat = null;
  showPage('product');
  renderProductPage();

  if(API_CONFIG.enabled && currentProduct?.id){
    try{
      const payload = await fetchApi('product/'+currentProduct.id);
      const apiBook = payload?.data || payload;
      currentProduct = normalizeApiBook(apiBook, 0);
      currentProductFormat = null;
      renderProductPage();
    } catch(error){
      console.warn('Detail produit indisponible, donnees catalogue conservees.', error);
    }
  }
}

function addCurrentProductToCart(){
  if(!currentProduct){
    showToast('Aucun livre a ajouter');
    return;
  }
  const selected = currentProductFormat || buildProductFormats(currentProduct)[0];
  addToCart({
    ...currentProduct,
    format: selected?.name || currentProduct.format,
    price: Number(selected?.price ?? currentProduct.price)
  });
}

function refreshBookViews(){
  renderCarousel(BOOKS.slice(0,6),'bs-carousel');
  renderCarousel(BOOKS.slice(6),'nv-carousel');
  renderCarousel(BOOKS.slice(0,8),'catalogue-carousel');
  renderCatalogue();
  renderHeroBooks();
  if(document.getElementById('page-product')?.classList.contains('active') && !currentProduct && BOOKS[0]){
    currentProduct = BOOKS[0];
    renderProductPage();
  }
  if(typeof runSearch === 'function'){
    runSearch(document.getElementById('searchPageInput')?.value || '');
  }
}

async function initApiContent(){
  if(!API_CONFIG.enabled || !API_CONFIG.baseUrl){
    renderDeliveryOptions();
    renderAdvertisements();
    return;
  }
  try{
    const payload = await fetchApi('books');
    const apiBooks = extractApiList(payload).map(normalizeApiBook);
    if(apiBooks.length > 0){
      BOOKS = apiBooks;
      refreshBookViews();
    }
  } catch(error){
    console.warn('API indisponible, aucun contenu statique charge.', error);
  }
  await initCatalogueFilters();
  await initDeliveryOptions();
  await initAdvertisements();
}

async function initAdvertisements(){
  try{
    const payload = await fetchApi('advertisements');
    const rawAdvertisements = payload?.data || payload || {};
    if(Array.isArray(rawAdvertisements)){
      ADVERTISEMENTS = rawAdvertisements.reduce((items, advertisement)=>{
        if(advertisement?.placement) items[advertisement.placement] = advertisement;
        return items;
      }, {});
    } else {
      ADVERTISEMENTS = rawAdvertisements;
    }
  } catch(error){
    console.warn('Publicites indisponibles.', error);
  }
  renderAdvertisements();
}

async function initDeliveryOptions(){
  try{
    const payload = await fetchApi('delivery_options');
    const options = extractApiList(payload);
    if(options.length > 0){
      DELIVERY_OPTIONS = options.map(option=>({
        code: option.code,
        name: option.name,
        description: option.description || '',
        price: Number(option.price || 0)
      }));
    }
  } catch(error){
    console.warn('Modes de livraison indisponibles.', error);
  }
  renderDeliveryOptions();
}

function renderDeliveryOptions(){
  const container = document.getElementById('shippingOptions');
  if(!container) return;
  if(DELIVERY_OPTIONS.length === 0){
    container.innerHTML = '<div class="shipping-empty">Aucun mode de livraison disponible depuis l API.</div>';
    renderCheckout();
    return;
  }
  container.innerHTML = DELIVERY_OPTIONS.map((option, index)=>`
    <label class="shipping-opt ${index === 0 ? 'selected' : ''}">
      <input type="radio" name="ship" value="${escapeAttr(option.code)}" data-price="${Number(option.price || 0)}" ${index === 0 ? 'checked' : ''} onchange="selectShipping(this)">
      <div class="shipping-opt-info"><div class="shipping-opt-name">${escapeHtml(option.name)}</div><div class="shipping-opt-desc">${escapeHtml(option.description || '')}</div></div>
      <div class="shipping-opt-price" style="color:${Number(option.price || 0) === 0 ? 'var(--green)' : 'var(--navy)'}">${Number(option.price || 0) === 0 ? 'Gratuit' : priceLabel(option.price)}</div>
    </label>
  `).join('');
  renderCheckout();
}

function selectShipping(input){
  input.closest('.checkout-form-section')?.querySelectorAll('.shipping-opt').forEach(option=>option.classList.remove('selected'));
  input.closest('.shipping-opt')?.classList.add('selected');
  renderCheckout();
}

async function initCatalogueFilters(){
  try{
    const payload = await fetchApi('filters');
    CATALOGUE_FILTERS = payload?.data || payload;
    renderCatalogueFilters();
  } catch(error){
    console.warn('Filtres catalogue indisponibles.', error);
  }
}

function renderFilterOptions(containerId, type, options){
  const container = document.getElementById(containerId);
  if(!container) return;
  if(!Array.isArray(options) || options.length === 0){
    container.innerHTML = '<div class="filter-option"><span class="fc">Aucune option</span></div>';
    return;
  }
  container.innerHTML = options.map((option, index)=>{
    const id = `${type}-${index}`;
    const value = type === 'category' ? (option.slug || option.name) : option.name;
    const count = option.books_count ?? option.count ?? 0;
    return `<div class="filter-option">
      <input type="checkbox" id="${id}" value="${escapeAttr(value)}" data-filter-type="${type}" onchange="applyCatalogueFilters()">
      <label for="${id}">${escapeHtml(option.name)}</label>
      <span class="fc">(${count})</span>
    </div>`;
  }).join('');
}

function renderCatalogueFilters(){
  if(!CATALOGUE_FILTERS) return;
  renderFilterOptions('catalogueCategoryFilters', 'category', CATALOGUE_FILTERS.categories || []);
  renderFilterOptions('catalogueAuthorFilters', 'author', CATALOGUE_FILTERS.authors || []);
  renderFilterOptions('catalogueFormatFilters', 'format', CATALOGUE_FILTERS.formats || []);
  renderHeaderCategories();
  renderHomeCategories();

  const min = Math.floor(Number(CATALOGUE_FILTERS.price?.min ?? 0));
  const max = Math.ceil(Number(CATALOGUE_FILTERS.price?.max ?? 50));
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  const priceRange = document.getElementById('priceRange');
  if(priceMin){
    priceMin.min = min;
    priceMin.max = max;
    priceMin.value = min;
  }
  if(priceMax){
    priceMax.min = min;
    priceMax.max = max;
    priceMax.value = max;
  }
  if(priceRange){
    priceRange.min = min;
    priceRange.max = max;
    priceRange.value = max;
  }
}

function categoryIcon(categoryName){
  const name = String(categoryName || '').toLowerCase();
  if(name.includes('science')) return '🚀';
  if(name.includes('romance')) return '💘';
  if(name.includes('thriller') || name.includes('polar')) return '🔪';
  if(name.includes('histoire')) return '🏛';
  if(name.includes('développement') || name.includes('developpement')) return '🌱';
  if(name.includes('jeunesse')) return '🧒';
  if(name.includes('bd') || name.includes('manga')) return '💬';
  if(name.includes('littérature') || name.includes('litterature')) return '✒';
  return '📚';
}

function renderHomeCategories(){
  const grid = document.getElementById('homeCategoryGrid');
  if(!grid) return;
  const categories = (CATALOGUE_FILTERS?.categories || []).slice(0, 6);
  if(categories.length === 0){
    grid.innerHTML = '<div class="genre-card" onclick="showPage(\'catalogue\')"><span class="gi">📚</span><div class="gl">Toutes les catégories</div><div class="gc">Voir le catalogue</div></div>';
    return;
  }

  grid.innerHTML = categories.map(category=>{
    const slug = category.slug || category.name;
    const count = Number(category.books_count || 0).toLocaleString('fr-FR');
    return `<div class="genre-card" onclick="openCatalogueCategory('${escapeAttr(slug)}')">
      <span class="gi">${categoryIcon(category.name)}</span>
      <div class="gl">${escapeHtml(category.name)}</div>
      <div class="gc">${count} titre${Number(category.books_count || 0) > 1 ? 's' : ''}</div>
    </div>`;
  }).join('');
}

function renderHeaderCategories(){
  const nav = document.getElementById('headerCategoryNav');
  if(!nav) return;
  const categories = (CATALOGUE_FILTERS?.categories || []).slice(0, 8);
  const categoryLinks = categories.map(category=>`
    <div class="nav-item" data-header-category="${escapeAttr(category.slug || category.name)}" onclick="openCatalogueCategory('${escapeAttr(category.slug || category.name)}')">
      ${escapeHtml(category.name)}
    </div>
  `).join('');

  nav.innerHTML = `
    <div class="nav-item active" data-header-category="" onclick="openCatalogueCategory()">Tous les livres</div>
    ${categoryLinks}
    <div class="nav-item" data-header-category="__promos" onclick="openCataloguePromos()">Promos</div>
  `;
}

function renderHeroBooks(){
  const mainBook = BOOKS[0];
  const secondBook = BOOKS[1];
  const thirdBook = BOOKS[2];
  const eyebrow = document.getElementById('heroEyebrow');
  const title = document.getElementById('heroTitle');
  const subtitle = document.getElementById('heroSubtitle');
  const mainCover = document.getElementById('heroMainBook');
  const sideOne = document.getElementById('heroSideBookOne');
  const sideTwo = document.getElementById('heroSideBookTwo');

  if(!mainBook){
    if(eyebrow) eyebrow.textContent = 'Catalogue dynamique';
    if(title) title.innerHTML = 'Aucun livre<br><em>charge</em>';
    if(subtitle) subtitle.textContent = 'Ajoutez des livres actifs dans l admin.';
    [mainCover, sideOne, sideTwo].forEach(el=>{ if(el) el.style.display='none'; });
    return;
  }

  if(eyebrow) eyebrow.textContent = 'Livre du moment';
  if(title) title.innerHTML = `${escapeHtml(mainBook.title)}`;
  if(subtitle) subtitle.textContent = `${mainBook.author} · ${priceLabel(mainBook.price)}`;

  const fillHeroCover = (root, book) => {
    if(!root) return;
    if(!book){
      root.style.display = 'none';
      return;
    }
    root.style.display = '';
    root.style.background = book.bg;
    root.onclick = () => openProduct(book);
    root.innerHTML = renderBookCover(book, root.classList.contains('hero-book-main') ? 'spine-ov' : 'sd-spine');
  };

  fillHeroCover(mainCover, mainBook);
  fillHeroCover(sideOne, secondBook);
  fillHeroCover(sideTwo, thirdBook);
}

function setHeaderActiveCategory(categorySlug = ''){
  document.querySelectorAll('#headerCategoryNav .nav-item').forEach(item=>{
    item.classList.toggle('active', (item.dataset.headerCategory || '') === categorySlug);
  });
}

function openCatalogueCategory(categorySlug = ''){
  showPage('catalogue');
  document.querySelectorAll('[data-filter-type="category"]').forEach(input=>{
    input.checked = categorySlug ? input.value === categorySlug : false;
  });
  setHeaderActiveCategory(categorySlug);
  renderCatalogue();
}

function openCataloguePromos(){
  showPage('catalogue');
  setHeaderActiveCategory('__promos');
  showToast('Promos affichées');
}

function selectedFilterValues(type){
  return Array.from(document.querySelectorAll(`[data-filter-type="${type}"]:checked`)).map(input=>input.value);
}

function filteredCatalogueBooks(){
  const categories = selectedFilterValues('category');
  const authors = selectedFilterValues('author');
  const formats = selectedFilterValues('format');
  const minPrice = Number(document.getElementById('priceMin')?.value || 0);
  const maxPrice = Number(document.getElementById('priceMax')?.value || Number.MAX_SAFE_INTEGER);

  return BOOKS.filter(book=>{
    const bookCategories = Array.isArray(book.categories) ? book.categories.map(cat=>cat.slug || cat.name) : [];
    if(categories.length && !categories.some(category=>bookCategories.includes(category))) return false;
    if(authors.length && !authors.includes(book.author)) return false;
    if(formats.length && !formats.includes(book.format)) return false;
    if(Number(book.price) < minPrice || Number(book.price) > maxPrice) return false;
    return true;
  });
}

function applyCatalogueFilters(){
  const selectedCategory = selectedFilterValues('category')[0] || '';
  setHeaderActiveCategory(selectedCategory);
  renderCatalogue();
}

function resetCatalogueFilters(){
  document.querySelectorAll('[data-filter-type]').forEach(input=>input.checked=false);
  if(CATALOGUE_FILTERS?.price){
    const min = Math.floor(Number(CATALOGUE_FILTERS.price.min ?? 0));
    const max = Math.ceil(Number(CATALOGUE_FILTERS.price.max ?? 50));
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceRange = document.getElementById('priceRange');
    if(priceMin) priceMin.value = min;
    if(priceMax) priceMax.value = max;
    if(priceRange) priceRange.value = max;
  }
  setHeaderActiveCategory('');
  renderCatalogue();
  showToast('Filtres réinitialisés');
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
  if(!Array.isArray(books) || books.length===0){
    c.innerHTML='<div class="empty-carousel">Aucun livre disponible depuis l API.</div>';
    return;
  }
  c.innerHTML=books.map(b=>`
    <div class="book-card" onclick='openProduct(${productPayload(b)})'>
      <div class="cover book-cover-box" style="background:${b.bg}">${renderBookCover(b,'sl')}</div>
      <div class="book-card-body">
        <div class="book-card-title">${b.title}</div>
        <div class="book-card-author">${b.author}</div>
        <div class="stars">${'★'.repeat(b.stars)}${'☆'.repeat(5-b.stars)}</div>
        <div class="rc">${b.reviews} avis</div>
        <div class="book-price">${priceLabel(b.price)}</div>
        <button class="add-btn-sm" onclick="event.stopPropagation();addToCart(${cartPayload(b)})">+ Ajouter au panier</button>
      </div>
    </div>`).join('');
}

// ─── RENDER CATALOGUE ───
function renderCatalogue(){
  const g=document.getElementById('catGrid');
  if(!g) return;
  const books = filteredCatalogueBooks();
  if(books.length===0){
    g.innerHTML='<div class="no-results"><div class="nr-icon">⌕</div><h3>Aucun livre dynamique</h3><p>Ajoutez des livres actifs dans l admin ou verifiez l API catalogue.</p></div>';
    const countEl=document.getElementById('catCount');
    if(countEl) countEl.textContent=0;
    const topCount=document.getElementById('catCountTop');
    if(topCount) topCount.textContent=0;
    return;
  }
  g.innerHTML=books.map((b,i)=>{
    const discount = [18,12,25,8,15][i % 5];
    const oldPrice = b.price * (1 + discount / 100);
    return `
    <div class="catalogue-book" onclick='openProduct(${productPayload(b)})'>
      <span class="product-badge">${i < 4 ? 'Offre du jour' : 'Livre populaire'}</span>
      <div class="cover book-cover-box" style="background:${b.bg}">${renderBookCover(b,'sl')}</div>
      <div class="catalogue-book-body">
        <div class="catalogue-book-title">${b.title}</div>
        <div class="catalogue-book-author">${b.author}</div>
        <div class="book-price">${priceLabel(b.price)}</div>
        <div class="market-old-price">${priceLabel(oldPrice)} <span>-${discount}%</span></div>
        <div class="stars">${'★'.repeat(b.stars)}${'☆'.repeat(5-b.stars)} <em>(${b.reviews})</em></div>
        <div class="market-delivery">Livraison rapide</div>
        <button class="add-btn-sm" onclick="event.stopPropagation();addToCart(${cartPayload(b)})">+ Ajouter</button>
      </div>
    </div>`;
  }).join('');
  document.getElementById('catCount').textContent=books.length;
  const topCount=document.getElementById('catCountTop');
  if(topCount) topCount.textContent=books.length;
}

function renderCartBookDemo(){
  const previewBooks = cart.slice(0, 5);
  if(!previewBooks.length) return '';

  return `<div class="cart-book-demo" aria-label="Démonstration animée des livres du panier">
    <div class="cart-demo-stage">
      ${previewBooks.map((book, index)=>`
        <button class="cart-demo-book book-cover-box" type="button" style="--i:${index};--total:${previewBooks.length};background:${book.bg}" onclick='openProduct(${productPayload(book)})' title="${escapeAttr(book.title)}">
          ${renderBookCover(book,'cart-demo-spine')}
        </button>
      `).join('')}
    </div>
    <div class="cart-demo-copy">
      <strong>Feuilleter votre sélection</strong>
      <span>Les couvertures de votre panier défilent en aperçu 3D.</span>
    </div>
  </div>`;
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
  const ship=sub>=35000?0:2500;
  const total=sub+ship;
  const cnt=getCount();
  title.textContent=`Mon panier (${cnt} article${cnt>1?'s':''})`;
  const items=cart.map(it=>`
    <div class="cart-item">
      <div class="cart-item-cover book-cover-box" style="background:${it.bg}" onclick='openProduct(${productPayload(it)})'>
        ${renderBookCover(it,'spine-mini')}
      </div>
      <div>
        <div class="cart-item-title" onclick='openProduct(${productPayload(it)})'>${it.title}</div>
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
        <div class="unit-price">${priceLabel(it.price)}/u</div>
        <div class="line-price">${priceLabel(it.price*it.qty)}</div>
      </div>
    </div>`).join('');
  container.innerHTML=`<div class="cart-layout">
    <div>
      <div class="cart-items-list">${items}</div>
      <div style="margin-top:18px">
        <button class="btn-primary" onclick="showPage('home')" style="background:transparent;color:var(--amber);border:1.5px solid var(--amber)">← Continuer mes achats</button>
      </div>
      ${renderCartBookDemo()}
    </div>
    <div class="order-summary">
      <div class="summary-title">Récapitulatif</div>
      <div class="summary-row"><span>Sous-total (${cnt} art.)</span><span>${priceLabel(sub)}</span></div>
      ${ship===0?`<div class="free-ship"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>Livraison offerte !</div>`:`<div style="font-size:12px;color:var(--muted);background:var(--sand);padding:7px 10px;border-radius:var(--radius);margin-bottom:10px">Plus que <strong style="color:var(--navy)">${priceLabel(35000-sub)}</strong> pour la livraison gratuite</div>`}
      <div class="summary-row"><span>Frais de livraison</span><span style="color:${ship===0?'var(--green)':'var(--navy)'}">${ship===0?'Gratuit':priceLabel(ship)}</span></div>
      <div class="promo-section"><div class="promo-row">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--light)" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
        <input class="promo-input" type="text" placeholder="Code promo" id="promoInput">
        <button class="promo-apply" onclick="applyPromo()">Appliquer</button>
      </div></div>
      <div class="summary-row total"><span>Total TTC</span><span>${priceLabel(total)}</span></div>
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
  const shipping=selectedShippingPrice();
  const total=sub+shipping;
  if(!items) return;
  if(cart.length===0){
    items.innerHTML='<p style="font-size:13px;color:var(--muted)">Panier vide</p>';
    return;
  }
  items.innerHTML=cart.map(it=>`
    <div class="cs-item">
      <div class="cs-cover book-cover-box" style="background:${it.bg}">${renderBookCover(it,'cs-mini-spine')}</div>
      <div class="cs-info"><div class="cs-title">${it.title}</div><div class="cs-sub">${it.format} × ${it.qty}</div></div>
      <div class="cs-price">${priceLabel(it.price*it.qty)}</div>
    </div>`).join('');
  document.getElementById('csSubtotal').textContent=priceLabel(sub);
  const shippingEl=document.getElementById('csShipping');
  if(shippingEl){
    shippingEl.textContent=shipping===0?'Gratuit':priceLabel(shipping);
    shippingEl.style.color=shipping===0?'var(--green)':'var(--navy)';
  }
  document.getElementById('csTotal').textContent=priceLabel(total);
  document.getElementById('checkoutTotal').textContent=priceLabel(total);
}

function selectedShippingPrice(){
  const selected=document.querySelector('input[name="ship"]:checked');
  return Number(selected?.dataset?.price || 0);
}

function selectedShippingMethod(){
  return document.querySelector('input[name="ship"]:checked')?.value || 'standard';
}

function selectedPaymentMethod(){
  return document.querySelector('input[name="pay"]:checked')?.value || 'card';
}

function paymentMethodLabel(method = selectedPaymentMethod()){
  const labels = {
    card: 'Carte bancaire',
    cash: 'Espèces',
    orange: 'Orange Money',
    mtn: 'MTN Mobile Money',
    moov: 'Moov Money',
    wave: 'Wave'
  };
  return labels[method] || method;
}

function shippingMethodLabel(method = selectedShippingMethod()){
  return DELIVERY_OPTIONS.find(option=>option.code === method)?.name || method;
}

function checkoutValue(id){
  return document.getElementById(id)?.value?.trim() || '';
}

function buildOrderPayload(){
  return {
    customer:{
      first_name: checkoutValue('checkoutFirstName'),
      last_name: checkoutValue('checkoutLastName'),
      email: checkoutValue('checkoutEmail'),
      phone: checkoutValue('checkoutPhone')
    },
    shipping:{
      address: checkoutValue('checkoutAddress'),
      address_extra: checkoutValue('checkoutAddressExtra'),
      postal_code: checkoutValue('checkoutPostalCode'),
      city: checkoutValue('checkoutCity'),
      country: checkoutValue('checkoutCountry') || 'France',
      method: selectedShippingMethod(),
      total: selectedShippingPrice()
    },
    payment:{
      method: selectedPaymentMethod(),
      reference: 'FRONT-' + Date.now().toString(36).toUpperCase()
    },
    items: cart.map(item=>({
      book_id: item.id,
      quantity: item.qty,
      format: item.format
    }))
  };
}

function validateCheckoutPayload(payload){
  if(cart.length===0) return 'Votre panier est vide.';
  if(!payload.customer.first_name) return 'Veuillez saisir le prenom.';
  if(!payload.customer.last_name) return 'Veuillez saisir le nom.';
  if(!payload.shipping.address) return 'Veuillez saisir l’adresse.';
  if(!payload.shipping.city) return 'Veuillez saisir la ville.';
  return '';
}

async function submitOrder(){
  const payload=buildOrderPayload();
  const validationError=validateCheckoutPayload(payload);
  if(validationError){
    showToast(validationError);
    return;
  }

  if(!API_CONFIG.enabled || !API_CONFIG.baseUrl){
    showToast('API commande non configuree.');
    return;
  }

  const btn=document.getElementById('submitOrderBtn');
  const original=btn?.innerHTML;
  if(btn){
    btn.disabled=true;
    btn.innerHTML='Paiement en cours...';
  }

  try{
    const response=await fetchApi('orders', {}, {method:'POST', body:payload});
    const order=response?.data || response;
    const createdAt=order.created_at ? new Date(order.created_at) : new Date();
    const total=Number(order.total || cart.reduce((s,i)=>s+i.price*i.qty,0)+selectedShippingPrice());

    lastOrderData={
      ref: order.reference,
      date: createdAt.toLocaleDateString('fr-FR', {day:'2-digit',month:'long',year:'numeric'})
        + ' a ' + createdAt.toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'}),
      items: cart.slice(),
      montantRecu: total,
      modePaiement: paymentMethodLabel(),
      modeLivraison: shippingMethodLabel(),
      fraisLivraison: selectedShippingPrice(),
      emetteur: {name:'Chapitre SARL', address:'12 rue de la Paix', city:'69001 Lyon, France', phone:'+33 1 23 45 67 89', email:'contact@chapitre.fr'},
      client: {
        name: `${payload.customer.first_name} ${payload.customer.last_name}`,
        address: payload.shipping.address,
        city: `${payload.shipping.postal_code} ${payload.shipping.city}, ${payload.shipping.country}`,
        phone: payload.customer.phone,
        email: payload.customer.email
      }
    };

    const orderCode=document.getElementById('orderCode');
    if(orderCode) orderCode.textContent=order.reference;
    cart=[];
    updateBadges();
    showPage('confirm');
  }catch(error){
    showToast(error.message || 'Impossible de passer la commande.');
  }finally{
    if(btn){
      btn.disabled=false;
      btn.innerHTML=original;
    }
  }
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
    <div class="sd-item" onclick='openProduct(${productPayload(b)})'>
      <div class="sd-emoji book-cover-box" style="background:${b.bg};border-radius:3px">${renderBookCover(b,'sd-spine')}</div>
      <div class="sd-text"><div class="sd-title">${b.title}</div><div class="sd-sub">${b.author} · ${priceLabel(b.price)}</div></div>
    </div>`).join('');
  dd.classList.add('open');
}
function closeDD(id){const dd=document.getElementById(id);if(dd) dd.classList.remove('open')}

// ─── FORMAT SELECTOR ───
function selectFormat(el,p,formatName){
  document.querySelectorAll('.fmt-option').forEach(f=>f.classList.remove('selected'));
  el.classList.add('selected');
  const price = Number(p || 0);
  currentProductFormat = {
    name: formatName || el.querySelector('.fmt-name')?.textContent?.trim() || currentProduct?.format || 'Poche',
    price
  };
  document.getElementById('selPrice').textContent=priceLabel(price);
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
  if(lastOrderData?.ref){
    const el=document.getElementById('orderCode');
    if(el) el.textContent=lastOrderData.ref;
    return;
  }
  const el=document.getElementById('orderCode');
  if(el) el.textContent='En attente API';
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
    statusSub = rendu > 0 ? 'Monnaie rendue : ' + priceLabel(rendu) : 'Aucun rendu';
  } else {
    statusClass = 'partial'; statusIcon = '&#8987;';
    statusLabel = 'Paiement partiel';
    statusSub = 'Reste a regler : ' + priceLabel(reste);
  }

  var rowsHtml = items.map(function(it) {
    var lineAmt = priceLabel(it.price * it.qty);
    var unitPrice = priceLabel(it.price);
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
      + '<td class="tr">' + unitPrice + '</td>'
      + '<td class="ta">' + lineAmt + '</td>'
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
    + '<div class="rcp-total-row"><span>Sous-total</span><span>' + priceLabel(subtotal) + '</span></div>'
    + '<div class="rcp-total-row"><span>Frais de livraison</span><span class="' + ((d.fraisLivraison || 0) === 0 ? 'c-green' : '') + '">' + ((d.fraisLivraison || 0) === 0 ? 'Gratuit' : priceLabel(d.fraisLivraison)) + '</span></div>'
    + '<div class="rcp-total-row grand"><span>Total TTC</span><span>' + priceLabel(total) + '</span></div>'
    + '</div></div>'

    + '<div class="rcp-pay-block">'
    + '<div class="rcp-pay-cell recu">'
    + '<div class="rpc-label">Montant recu</div>'
    + '<div class="rpc-val">' + priceLabel(recu) + '</div>'
    + '<div class="rpc-sub">' + d.modePaiement + (d.modeLivraison ? ' · ' + d.modeLivraison : '') + '</div>'
    + '</div>'
    + '<div class="rcp-pay-cell rendu">'
    + '<div class="rpc-label">Monnaie rendue</div>'
    + '<div class="rpc-val" style="color:' + (rendu > 0 ? 'var(--amber)' : 'var(--muted)') + '">' + priceLabel(rendu) + '</div>'
    + '<div class="rpc-sub">' + (rendu > 0 ? 'Rendu au client' : 'Aucune monnaie') + '</div>'
    + '</div>'
    + '<div class="rcp-pay-cell reste-cell">'
    + '<div class="rpc-label">Reste a payer</div>'
    + '<div class="rpc-val" style="color:' + (reste > 0 ? 'var(--red)' : 'var(--green)') + '">' + priceLabel(reste) + '</div>'
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
    + '<button class="btn-receipt amber" onclick="downloadReceipt()">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
    + 'Telecharger le recu</button>'
    + '<button class="btn-receipt primary" onclick="goHome()">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    + 'Retour boutique</button>'
    + '</div>';

  document.getElementById('receiptContent').innerHTML = html + actions;
  updateBadges();
}

function downloadReceipt(){
  const receipt = document.querySelector('.receipt-doc');
  if(!receipt || !lastOrderData){
    showToast('Aucun recu disponible');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Recu ${escapeHtml(lastOrderData.ref)}</title>
<style>
body{font-family:Arial,sans-serif;background:#f6f1e8;margin:0;padding:24px;color:#1c2b3a}
.receipt-doc{max-width:860px;margin:0 auto;background:white;padding:28px;border:1px solid #e5ded1}
.rcp-header,.rcp-parties,.rcp-pay-block{display:flex;justify-content:space-between;gap:20px}
.rcp-brand-logo,.rcp-title{font-weight:700;font-size:20px}
.rcp-party,.rcp-pay-cell{flex:1;border:1px solid #e5ded1;padding:14px;border-radius:8px}
.rcp-table{width:100%;border-collapse:collapse;margin-top:22px}
.rcp-table th,.rcp-table td{border-bottom:1px solid #e5ded1;padding:10px;text-align:left}
.tr,.ta{text-align:right}.tc{text-align:center}
.rcp-totals{display:flex;justify-content:flex-end;margin-top:18px}
.rcp-totals-inner{min-width:280px}
.rcp-total-row{display:flex;justify-content:space-between;padding:6px 0}
.grand{font-weight:700;font-size:18px;border-top:2px solid #e5ded1;margin-top:6px;padding-top:10px}
.rcp-status-bar{margin-top:18px;padding:12px;border-radius:8px;background:#eef7ee}
.rcp-book-cover,.rcp-footer-qr,.receipt-actions{display:none}
</style>
</head>
<body>${receipt.outerHTML}</body>
</html>`;

  const blob = new Blob([html], {type:'text/html;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `recu-${String(lastOrderData.ref).replace(/[^a-z0-9-]/gi,'_')}.html`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Recu telecharge');
}

function showReceipt() {
  if(lastOrderData){
    showPage('receipt');
    renderReceipt();
    return;
  }
  showToast('Aucun recu dynamique disponible');
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
  var ref = 'CHQ-' + Date.now().toString(36).toUpperCase().slice(-6);

  // Populate modal
  var badge = document.getElementById('qrBadge');
  badge.textContent = cfg.logo;
  badge.style.background = cfg.color;
  badge.style.color = cfg.textColor || 'white';

  document.getElementById('qrTitle').textContent = cfg.name;
  document.getElementById('qrSub').textContent = cfg.sub;
  document.getElementById('qrAmount').textContent = priceLabel(total);
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

function renderAccountDynamic(){
  const avatarCircle = document.querySelector('.avatar-circle');
  const avatarName = document.querySelector('.avatar-name');
  const avatarEmail = document.querySelector('.avatar-email');
  if(avatarCircle) avatarCircle.textContent = 'CL';
  if(avatarName) avatarName.textContent = 'Client';
  if(avatarEmail) avatarEmail.textContent = 'Connectez-vous pour voir vos donnees';

  const orderCount = document.querySelector('#acc-orders .acc-count');
  const ordersList = document.querySelector('.orders-list');
  if(orderCount) orderCount.textContent = '0 commande';
  if(ordersList){
    ordersList.innerHTML = '<div class="order-card"><div class="order-card-head"><div><div class="order-ref">Aucune commande dynamique</div><div class="order-date">Les commandes client devront etre chargees depuis l API.</div></div><span class="order-status">API</span></div></div>';
  }

  const wishlistCount = document.querySelector('#acc-wishlist .acc-count');
  const wishlistGrid = document.querySelector('.wishlist-grid');
  if(wishlistCount) wishlistCount.textContent = '0 livre';
  if(wishlistGrid){
    wishlistGrid.innerHTML = '<div class="wish-card"><div class="wish-body"><div class="wish-title">Aucune liste dynamique</div><div class="wish-author">Connecter la wishlist a une API client.</div></div></div>';
  }

  document.querySelectorAll('#acc-profile input').forEach(input=>{ input.value = ''; });
  const addressesGrid = document.querySelector('.addresses-grid');
  if(addressesGrid){
    addressesGrid.innerHTML = '<div class="address-card"><div class="address-name">Aucune adresse dynamique</div><div class="address-line">Les adresses client devront etre chargees depuis l API.</div></div>';
  }
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
    <div class="search-result-item" onclick='openProduct(${productPayload(b)})'>
      <div class="sri-cover book-cover-box" style="background:${b.bg}">${renderBookCover(b,'sml')}</div>
      <div class="sri-info">
        <div class="sri-title">${b.title}</div>
        <div class="sri-author">${b.author}</div>
        <div class="sri-stars">${'★'.repeat(b.stars)}${'☆'.repeat(5-b.stars)} <span style="color:var(--muted);font-size:12px">${b.reviews} avis</span></div>
        <div class="sri-synopsis">${escapeHtml(b.description || 'Description non renseignee.')}</div>
        <div class="sri-formats"><span class="sri-fmt">${b.format}</span>${b.price<10?'<span class="sri-fmt">Ebook dispo</span>':''}</div>
      </div>
      <div class="sri-cta">
        <div class="sri-price">${priceLabel(b.price)}</div>
        <div class="sri-price-sub">Prix poche</div>
        <button class="add-btn-sm" style="width:120px" onclick="event.stopPropagation();addToCart(${cartPayload(b)})">+ Ajouter</button>
      </div>
    </div>`).join('');
}

// ─── AUTHOR CAROUSEL ───
function renderAuthorCarousel(){
  const c=document.getElementById('author-carousel');
  if(!c) return;
  const authorName = currentProduct?.author || BOOKS[0]?.author || '';
  const authorBooks = authorName ? BOOKS.filter(book=>book.author === authorName) : BOOKS.slice(0, 8);
  renderAuthorProfile(authorName, authorBooks);
  if(authorBooks.length===0){
    c.innerHTML='<div class="empty-carousel">Aucun livre auteur disponible depuis l API.</div>';
    return;
  }
  c.innerHTML=authorBooks.map(b=>`
    <div class="book-card" onclick='openProduct(${productPayload(b)})'>
      <div class="cover book-cover-box" style="background:${b.bg}">${renderBookCover(b,'sl')}</div>
      <div class="book-card-body">
        <div class="book-card-title">${b.title}</div>
        <div class="book-card-author">${b.author}</div>
        <div class="stars">${'★'.repeat(b.stars)}${'☆'.repeat(5-b.stars)}</div>
        <div class="rc">${b.reviews} avis</div>
        <div class="book-price">${priceLabel(b.price)}</div>
        <button class="add-btn-sm" onclick="event.stopPropagation();addToCart(${cartPayload(b)})">+ Ajouter</button>
      </div>
    </div>`).join('');
}

function renderAuthorProfile(authorName, authorBooks){
  const name = authorName || 'Auteur dynamique';
  const initials = name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase() || 'AD';
  const nameEl = document.getElementById('authorName');
  const crumbEl = document.getElementById('authorBreadcrumbName');
  const avatarEl = document.getElementById('authorAvatar');
  const datesEl = document.getElementById('authorDates');
  const statsBooks = document.getElementById('authorBooksCount');
  const statsReviews = document.getElementById('authorReviewsCount');
  const statsRating = document.getElementById('authorRatingAverage');
  const bioEl = document.getElementById('authorBio');
  const categoryList = [...new Set(authorBooks.flatMap(book=>(book.categories || []).map(category=>category.name).filter(Boolean)))].slice(0, 4);

  if(nameEl) nameEl.textContent = name;
  if(crumbEl) crumbEl.textContent = name;
  if(avatarEl) avatarEl.textContent = initials;
  if(datesEl) datesEl.textContent = 'Auteur du catalogue';
  if(statsBooks) statsBooks.textContent = authorBooks.length;
  if(statsReviews) statsReviews.textContent = authorBooks.reduce((sum, book)=>sum + Number(book.reviews || 0), 0);
  if(statsRating){
    const avg = authorBooks.length ? authorBooks.reduce((sum, book)=>sum + Number(book.stars || 0), 0) / authorBooks.length : 0;
    statsRating.textContent = '★ '+avg.toFixed(1);
  }
  const genreContainer = document.getElementById('authorGenres');
  if(genreContainer){
    genreContainer.innerHTML = categoryList.length
      ? categoryList.map(category=>`<span class="genre-tag">${escapeHtml(category)}</span>`).join('')
      : '<span class="genre-tag">Catalogue</span>';
  }
  if(bioEl) bioEl.innerHTML = '<p>Les informations de cet auteur proviennent du catalogue dynamique. Ajoutez ou modifiez les livres dans l admin pour mettre cette page a jour.</p>';
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
  if(name==='product') renderProductPage();
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
renderHeroBooks();
renderAccountDynamic();
renderAuthorCarousel();
runSearch('');

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
