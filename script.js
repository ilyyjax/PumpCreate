/* PumpCreate - script.js
   - Builds UI options dynamically
   - Updates SVG pumpkin parts
   - Randomizer, Download, localStorage
*/

(() => {
  // ======== Data (options stored as objects with id + render functions) ========
  const eyesOptions = [
    { id: 'eyes-round', name: 'Round', render: () => {
      return `<g transform="translate(0,0)">
        <ellipse cx="140" cy="170" rx="20" ry="24" fill="#111" />
        <ellipse cx="260" cy="170" rx="20" ry="24" fill="#111" />
        <circle cx="150" cy="162" r="5" fill="#fff" opacity="0.9"/>
        <circle cx="270" cy="162" r="5" fill="#fff" opacity="0.9"/>
      </g>`;
    }},
    { id: 'eyes-squint', name: 'Squint', render: () => {
      return `<g transform="translate(0,0)">
        <path d="M120 170 q20 -18 40 0" stroke="#111" stroke-width="10" stroke-linecap="round" fill="none"/>
        <path d="M260 170 q-20 -18 -40 0" stroke="#111" stroke-width="10" stroke-linecap="round" fill="none"/>
      </g>`;
    }},
    { id: 'eyes-star', name: 'Starry', render: () => {
      return `<g transform="translate(0,0)">
        <polygon points="140,150 146,162 160,164 148,174 150,188 140,180 130,188 132,174 120,164 134,162" fill="#111"/>
        <polygon points="260,150 266,162 280,164 268,174 270,188 260,180 250,188 252,174 240,164 254,162" fill="#111"/>
      </g>`;
    }},
    { id: 'eyes-glow', name: 'Glowing', render: () => {
      return `<g transform="translate(0,0)">
        <ellipse cx="140" cy="170" rx="24" ry="28" fill="#111" />
        <ellipse cx="260" cy="170" rx="24" ry="28" fill="#111" />
        <ellipse cx="140" cy="170" rx="10" ry="12" fill="#ffefbb" opacity="0.95"/>
        <ellipse cx="260" cy="170" rx="10" ry="12" fill="#ffefbb" opacity="0.95"/>
      </g>`;
    }},
  ];

  const noseOptions = [
    { id: 'nose-none', name: 'None', render: () => `` },
    { id: 'nose-triangle', name: 'Triangle', render: () => `<polygon points="200,178 188,200 212,200" fill="#111" />` },
    { id: 'nose-circle', name: 'Button', render: () => `<circle cx="200" cy="188" r="8" fill="#111" />` },
  ];

  const mouthOptions = [
    { id: 'mouth-smile', name: 'Smile', render: () => `<path d="M150 220 q50 40 100 0" stroke="#111" stroke-width="10" stroke-linecap="round" fill="none"/>` },
    { id: 'mouth-scary', name: 'Scary', render: () => `<path d="M140 230 q30 -40 120 0 q-40 30 -120 0" fill="#111" />` },
    { id: 'mouth-o', name: 'O', render: () => `<ellipse cx="200" cy="230" rx="28" ry="20" fill="#111"/>` },
    { id: 'mouth-teeth', name: 'Toothy', render: () => `<g fill="#111"><rect x="150" y="212" width="100" height="18" rx="6"/><path d="M160 212 v18 M180 212 v18 M200 212 v18 M220 212 v18" stroke="#fff" stroke-width="4"/></g>` }
  ];

  const accessoryOptions = [
    { id: 'acc-none', name: 'None', render: () => `` },
    { id: 'acc-hat', name: 'Witch Hat', render: () => `<g transform="translate(0,-10)"><path d="M110 100 q90 -60 180 0 q-80 -34 -160 0" fill="#2b1b3c"/><path d="M160 68 q40 -28 80 0 l-40 28z" fill="#3f2a4a"/></g>` },
    { id: 'acc-scarf', name: 'Scarf', render: () => `<g transform="translate(0,60)"><path d="M120 270 q80 30 160 -2 l-20 20 q-90 30 -140 0z" fill="#b44a2a"/></g>` },
    { id: 'acc-glasses', name: 'Glasses', render: () => `<g transform="translate(0,-2)"><rect x="110" y="150" width="60" height="32" rx="10" stroke="#222" stroke-width="6" fill="none"/><rect x="230" y="150" width="60" height="32" rx="10" stroke="#222" stroke-width="6" fill="none"/><path d="M170 166 h60" stroke="#222" stroke-width="6"/></g>` },
    { id: 'acc-leaf', name: 'Leaf', render: () => `<g transform="translate(260,70) rotate(20)"><path d="M0 0 q18 -6 26 4 q-8 12 -26 20 q-6 -8 -4 -24z" fill="#2f7a2f"/></g>` }
  ];

  const colorOptions = [
    { id:'col-orange', name:'Classic', value:'#F07C2B', stroke:'#d45f18' },
    { id:'col-dark', name:'Rust', value:'#d96a1f', stroke:'#9f4a0f' },
    { id:'col-pale', name:'Ghost White', value:'#f7f4ee', stroke:'#d2cdbf' },
    { id:'col-green', name:'Greenish', value:'#7fb86b', stroke:'#4f7a45' },
  ];

  const bgOptions = [
    { id:'bg-fall', name:'Leaves', apply: () => { document.body.className = 'bg-autumn'; setSVGBg('radial'); } },
    { id:'bg-night', name:'Night', apply: () => { document.body.className = 'bg-night'; setSVGBg('night'); } },
    { id:'bg-spooky', name:'Spooky', apply: () => { document.body.className = 'bg-spooky'; setSVGBg('spooky'); } },
  ];

  // ======= state =======
  const state = {
    eye: 0,
    nose: 0,
    mouth: 0,
    acc: 0,
    color: 0,
    bg: 0,
    soundOn: false
  };

  // ======= DOM refs =======
  const eyesOptionsEl = document.getElementById('eyesOptions');
  const noseOptionsEl = document.getElementById('noseOptions');
  const mouthOptionsEl = document.getElementById('mouthOptions');
  const accOptionsEl = document.getElementById('accOptions');
  const colorOptionsEl = document.getElementById('colorOptions');
  const bgOptionsEl = document.getElementById('bgOptions');

  const eyesGroup = document.getElementById('eyes');
  const noseGroup = document.getElementById('nose');
  const mouthGroup = document.getElementById('mouth');
  const accGroup = document.getElementById('accessoryGroup');
  const pumpShape = document.getElementById('pumpShape');
  const stem = document.getElementById('stem');

  const randomBtn = document.getElementById('randomBtn');
  const randomBtn2 = document.getElementById('randomBtn2');
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadBtn2 = document.getElementById('downloadBtn2');
  const soundToggle = document.getElementById('soundToggle');

  // tabs
  document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      const tab = t.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      document.getElementById('tab-' + tab).classList.remove('hidden');
    })
  });

  // ======= helpers: populate options =======
  function makeOptionNode(id, label, previewHTML) {
    const o = document.createElement('button');
    o.className = 'option';
    o.dataset.id = id;
    o.innerHTML = previewHTML || `<span>${label}</span>`;
    return o;
  }

  function populateOptions() {
    // eyes
    eyesOptions.forEach((opt,i) => {
      const btn = makeOptionNode(opt.id, opt.name, `<svg viewBox="0 0 64 64" class="icon">${opt.render().replace(/svg xmlns=".*?"/,'')}</svg>`);
      if(i===state.eye) btn.classList.add('active');
      btn.addEventListener('click', () => { state.eye = i; saveState(); renderFace(); updateActive(eyesOptionsEl, i); playTick(); });
      eyesOptionsEl.appendChild(btn);
    });
    // nose
    noseOptions.forEach((opt,i) => {
      const btn = makeOptionNode(opt.id, opt.name, `<svg viewBox="0 0 64 64" class="icon">${opt.render()}</svg>`);
      if(i===state.nose) btn.classList.add('active');
      btn.addEventListener('click', () => { state.nose = i; saveState(); renderFace(); updateActive(noseOptionsEl, i); playTick(); });
      noseOptionsEl.appendChild(btn);
    });
    // mouth
    mouthOptions.forEach((opt,i) => {
      const btn = makeOptionNode(opt.id, opt.name, `<svg viewBox="0 0 128 64" class="icon">${opt.render()}</svg>`);
      if(i===state.mouth) btn.classList.add('active');
      btn.addEventListener('click', () => { state.mouth = i; saveState(); renderFace(); updateActive(mouthOptionsEl, i); playTick(); });
      mouthOptionsEl.appendChild(btn);
    });

    // accessories
    accessoryOptions.forEach((opt,i) => {
      const btn = makeOptionNode(opt.id, opt.name, `<svg viewBox="0 0 64 64" class="icon">${opt.render()}</svg>`);
      if(i===state.acc) btn.classList.add('active');
      btn.addEventListener('click', () => { state.acc = i; saveState(); renderAccessory(); updateActive(accOptionsEl, i); playTick(); });
      accOptionsEl.appendChild(btn);
    });

    // colors
    colorOptions.forEach((opt,i) => {
      const swatch = `<div style="width:44px;height:44px;border-radius:8px;border:1px solid rgba(0,0,0,0.12);background:${opt.value}"></div>`;
      const btn = makeOptionNode(opt.id, opt.name, swatch);
      if(i===state.color) btn.classList.add('active');
      btn.addEventListener('click', () => { state.color = i; saveState(); applyColor(); updateActive(colorOptionsEl, i); playTick(); });
      colorOptionsEl.appendChild(btn);
    });

    // backgrounds
    bgOptions.forEach((opt,i) => {
      const preview = `<div style="width:44px;height:44px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;font-size:11px">${opt.name}</div>`;
      const btn = makeOptionNode(opt.id, opt.name, preview);
      if(i===state.bg) btn.classList.add('active');
      btn.addEventListener('click', () => { state.bg = i; saveState(); applyBG(); updateActive(bgOptionsEl, i); playTick(); });
      bgOptionsEl.appendChild(btn);
    });
  }

  function updateActive(container, index){
    const nodes = container.querySelectorAll('.option');
    nodes.forEach((n,i)=> n.classList.toggle('active', i===index));
  }

  // ======= render functions (face/accessory/color/bg) =======
  function renderFace(){
    // eyes
    eyesGroup.innerHTML = eyesOptions[state.eye].render();
    noseGroup.innerHTML = noseOptions[state.nose].render();
    mouthGroup.innerHTML = mouthOptions[state.mouth].render();
    // small transition
    animatePumpkinBounce();
  }

  function renderAccessory(){
    accGroup.innerHTML = accessoryOptions[state.acc].render();
    animatePumpkinBounce();
  }

  function applyColor(){
    const c = colorOptions[state.color];
    pumpShape.setAttribute('fill', c.value);
    pumpShape.setAttribute('stroke', c.stroke);
    stem.setAttribute('fill', shadeColor(c.value, -30));
  }

  function applyBG(){
    bgOptions[state.bg].apply();
  }

  // helper to set svg background details (simple)
  function setSVGBg(type){
    const bgRect = document.getElementById('bgRect');
    if(type==='night') {
      bgRect.setAttribute('fill', 'rgba(2,6,23,0.12)');
    } else if(type==='spooky'){
      bgRect.setAttribute('fill', 'rgba(18,6,12,0.12)');
    } else {
      bgRect.setAttribute('fill', 'transparent');
    }
  }

  // ======= randomize =======
  function randomizeAll() {
    state.eye = randIndex(eyesOptions);
    state.nose = randIndex(noseOptions);
    state.mouth = randIndex(mouthOptions);
    state.acc = randIndex(accessoryOptions);
    state.color = randIndex(colorOptions);
    state.bg = randIndex(bgOptions);
    saveState(); renderAll(); playRandomMelody();
  }

  function randIndex(arr){ return Math.floor(Math.random()*arr.length); }

  // ======= small UI animations / sound =======
  function animatePumpkinBounce(){
    const wrap = document.getElementById('pumpkinWrap');
    wrap.style.transition = 'transform 260ms ease';
    wrap.style.transform = 'scale(1.02)';
    setTimeout(()=>wrap.style.transform = '', 260);
  }

  // simple WebAudio tick
  let audioCtx;
  function ensureAudio(){
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  function playTick(){
    if(!state.soundOn) return;
    ensureAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(660, audioCtx.currentTime);
    g.gain.value = 0.0001;
    o.connect(g); g.connect(audioCtx.destination);
    g.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime+0.18);
    o.start(); o.stop(audioCtx.currentTime+0.2);
  }

  function playRandomMelody(){
    if(!state.soundOn) return;
    ensureAudio();
    // quick arpeggio
    const freqs=[440, 520, 660, 880];
    freqs.forEach((f,i) => {
      const t = audioCtx.currentTime + i*0.08;
      const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
      o.type='triangle'; o.frequency.value=f; g.gain.value=0.0001;
      o.connect(g); g.connect(audioCtx.destination);
      g.gain.exponentialRampToValueAtTime(0.03, t+0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t+0.08);
      o.start(t); o.stop(t+0.09);
    });
  }

  // ======= download SVG as PNG =======
  function downloadPumpkinPNG(filename = 'my-pumpkin.png') {
    const svg = document.getElementById('pumpkinSVG');
    // clone and inline computed styles for nicer export
    const cloned = svg.cloneNode(true);
    // compute size
    const width = 800, height = 840;
    cloned.setAttribute('width', width);
    cloned.setAttribute('height', height);
    cloned.setAttribute('viewBox', '0 0 400 420');

    const svgData = new XMLSerializer().serializeToString(cloned);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      // fill with transparent or a subtle glow background
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }, 'image/png');
    };
    img.onerror = () => { alert('Sorry — could not render pumpkin for download.'); };
    img.src = url;
  }

  // ======= localStorage handling =======
  function saveState(){
    localStorage.setItem('pumpcreate_v1', JSON.stringify(state));
  }
  function loadState(){
    const s = localStorage.getItem('pumpcreate_v1');
    if(s){
      try{ const parsed = JSON.parse(s); Object.assign(state, parsed); }catch(e){}
    }
  }

  // ======= helpers =======
  function shadeColor(hex, percent) {
    // simple shade hex by percent (-100..100)
    const f = hex.slice(1);
    const R = parseInt(f.substring(0,2),16);
    const G = parseInt(f.substring(2,4),16);
    const B = parseInt(f.substring(4,6),16);
    const t = percent < 0 ? 0 : 255;
    const p = Math.abs(percent)/100;
    const newR = Math.round((t - R) * p) + R;
    const newG = Math.round((t - G) * p) + G;
    const newB = Math.round((t - B) * p) + B;
    return `rgb(${newR},${newG},${newB})`;
  }

  function renderAll(){
    renderFace(); renderAccessory(); applyColor(); applyBG(); updateAllActive();
  }

  function updateAllActive(){
    updateActive(eyesOptionsEl, state.eye);
    updateActive(noseOptionsEl, state.nose);
    updateActive(mouthOptionsEl, state.mouth);
    updateActive(accOptionsEl, state.acc);
    updateActive(colorOptionsEl, state.color);
    updateActive(bgOptionsEl, state.bg);
    soundToggle.checked = state.soundOn;
  }

  // ======= falling leaves (simple particle effect) =======
  function startLeaves(){
    const layer = document.getElementById('leaf-layer');
    layer.style.position = 'absolute';
    layer.style.left = 0; layer.style.top = '80px';
    layer.style.right = 0; layer.style.pointerEvents = 'none';
    layer.style.height = '70vh';
    layer.style.zIndex = 1;

    const colors = ['#e07a2b','#c95b2b','#a65b2b','#ffd89b'];
    for(let i=0;i<14;i++){
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      const size = 12 + Math.random()*26;
      leaf.style.width = size+'px';
      leaf.style.height = (size*0.6)+'px';
      leaf.style.position = 'absolute';
      leaf.style.left = (Math.random()*100)+'%';
      leaf.style.top = (Math.random()*20)+'vh';
      leaf.style.transform = `rotate(${Math.random()*360}deg)`;
      leaf.style.opacity = 0.8;
      leaf.style.borderRadius = '40%';
      leaf.style.background = colors[Math.floor(Math.random()*colors.length)];
      leaf.style.boxShadow = '0 6px 14px rgba(0,0,0,0.25)';
      leaf.style.animation = `leafFall ${8 + Math.random()*10}s linear ${Math.random()*5}s infinite`;
      layer.appendChild(leaf);
    }

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes leafFall {
        0% { transform: translateY(-10vh) rotate(0deg); opacity:0; }
        10% { opacity:1; }
        50% { transform: translateY(40vh) rotate(180deg); }
        100% { transform: translateY(110vh) rotate(360deg); opacity:0; }
      }`;
    document.head.appendChild(style);
  }

  // ======= event wiring =======
  randomBtn.addEventListener('click', () => randomizeAll());
  randomBtn2.addEventListener('click', () => randomizeAll());

  downloadBtn.addEventListener('click', () => downloadPumpkinPNG());
  downloadBtn2.addEventListener('click', () => downloadPumpkinPNG());

  soundToggle.addEventListener('change', (e) => { state.soundOn = e.target.checked; saveState(); if(state.soundOn) playTick(); });

  // small keyboard shortcut (R random)
  window.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase()==='r') { randomizeAll(); }
    if(e.key.toLowerCase()==='s') { downloadPumpkinPNG(); }
  });

  // ======= initialization =======
  loadState();
  populateOptions();
  renderAll();
  startLeaves();

  // small entrance animation
  setTimeout(()=>document.getElementById('pumpkinWrap').classList.add('floating'), 600);

  // play tiny welcome flutter if sound on
  if(state.soundOn) setTimeout(playRandomMelody, 1200);

  // expose small helpers for dev (optional)
  window.pumpcreate = {
    state, randomizeAll, downloadPumpkinPNG, renderAll
  };
})();
