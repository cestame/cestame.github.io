// Minimal interactive behavior for the portfolio
(function(){
  const gallery = document.getElementById('gallery');
  const filter = document.getElementById('filter');
  const shuffleBtn = document.getElementById('shuffle');
  const ambientBtn = document.getElementById('ambientToggle');
  const copyEmailBtn = document.getElementById('copyEmail');

  const modal = document.getElementById('modal');
  const modalInner = modal.querySelector('.modal-inner');
  const modalMedia = modal.querySelector('.modal-media');
  const mTitle = modal.querySelector('.m-title');
  const mDesc = modal.querySelector('.m-desc');
  const mInfo = modal.querySelector('.m-info');
  const closeBtn = modal.querySelector('.close');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let items = Array.from(gallery.querySelectorAll('.card'));
  let currentIndex = -1;

  function showIndex(i){
    if(i<0 || i>=items.length) return;
    const el = items[i];
    const imgSrc = el.querySelector('img').src.replace(/\/(600|400)\//, '/900/');
    modalMedia.innerHTML = '';
    const img = document.createElement('img'); img.src = imgSrc; img.alt = el.dataset.title;
    modalMedia.appendChild(img);
    mTitle.textContent = el.dataset.title;
    mDesc.textContent = el.dataset.desc;
    mInfo.textContent = `${el.dataset.medium} — ${el.dataset.year}`;
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'flex';
    currentIndex = i;
    setTimeout(()=>{modalInner.focus?.()},120);
  }

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    modal.style.display = 'none';
    currentIndex = -1;
  }

  // Clicking a card opens modal
  gallery.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if(!card) return;
    items = filteredItems();
    const idx = items.indexOf(card);
    showIndex(idx);
  });

  // keyboard support for cards (Enter to open)
  gallery.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
      const card = e.target.closest('.card');
      if(card){ items = filteredItems(); const idx = items.indexOf(card); showIndex(idx); }
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

  prevBtn.addEventListener('click', ()=>{
    if(currentIndex>0) showIndex(currentIndex-1);
  });
  nextBtn.addEventListener('click', ()=>{
    if(currentIndex<items.length-1) showIndex(currentIndex+1);
  });

  document.addEventListener('keydown', e => {
    if(modal.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'Escape') closeModal();
      if(e.key === 'ArrowLeft') prevBtn.click();
      if(e.key === 'ArrowRight') nextBtn.click();
    }
  });

  function filteredItems(){
    const val = filter.value;
    if(val === 'all') return Array.from(gallery.querySelectorAll('.card'));
    return Array.from(gallery.querySelectorAll(`.card[data-medium="${val}"]`));
  }

  filter.addEventListener('change', ()=>{
    const val = filter.value;
    const all = Array.from(gallery.querySelectorAll('.card'));
    all.forEach(c => {
      c.style.display = (val === 'all' || c.dataset.medium === val) ? 'inline-block' : 'none';
    });
    // reset item ordering when filtering
    items = filteredItems();
  });

  shuffleBtn.addEventListener('click', ()=>{
    const nodes = Array.from(gallery.querySelectorAll('.card'));
    for(let i=nodes.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      gallery.insertBefore(nodes[j], nodes[i]);
    }
    // rebuild list
    items = filteredItems();
  });

  ambientBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('parchment');
    const pressed = document.body.classList.contains('parchment');
    ambientBtn.setAttribute('aria-pressed', String(pressed));
  });

  copyEmailBtn.addEventListener('click', async ()=>{
    const email = copyEmailBtn.dataset.email;
    try{
      await navigator.clipboard.writeText(email);
      copyEmailBtn.textContent = 'Copied!';
      setTimeout(()=>copyEmailBtn.textContent = email,1500);
    }catch(_){
      // fallback
      const a = document.createElement('a'); a.href = `mailto:${email}`; a.click();
    }
  });

  // small progressive enhancement: lazy-load higher-res on hover
  document.addEventListener('mouseover', e=>{
    const card = e.target.closest('.card');
    if(!card) return;
    const img = card.querySelector('img');
    const hi = img.src.replace(/\/(600|400)\//,'/900/');
    const preload = new Image(); preload.src = hi;
  });

})();
