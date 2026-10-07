// GTM Autoresearch in the browser. A port of audit(), applyOperations() and
// optimize() from audit.mjs that runs on a stripped container: names, IDs, types,
// trigger links, folder IDs, {{references}} and a hash of each element's settings.
// Scores match audit.mjs exactly (checked by test/auto.test.mjs). Nothing here can
// publish; the operati�N���$z{-���jםstColor(k)}` } }, ST[k][0]));
    add({ css: { background: 'var(--pass)', width: '5px', height: '5px' } }, 'Verified live'); add({ ln: 1, css: { borderTop: '2px dashed var(--gold)' } }, 'Seen live'); add({ ln: 1, css: { borderTop: '2px dashed var(--crit)' } }, 'Dead end');
  } else if (isAuto()) { add({ css: { background: 'rgba(92,225,164,.35)' } }, 'Folder added by the loop'); add({ css: { background: 'rgba(255,98,95,.25)' } }, 'No folder'); }
  else if (isFlow()) { add({ ln: 1, css: { borderTop: '2px dashed var(--gold)' } }, 'Delivered'); add({ ln: 1, css: { borderTop: '2px dotted var(--amber)' } }, 'Conditional'); add({ ln: 1, css: { borderTop: '2px dashed var(--crit)' } }, 'Dead end'); }
  else { add({ css: { border: '2px solid var(--crit)' } }, 'Fix first'); add({ css: { border: '2px solid var(--gold)' } }, 'Confirm'); add({ ln: 1, css: { borderTop: '2px dashed var(--gold)' } }, 'Identical pair'); }
  h('span', 'hint', S.view === '3d' ? 'Drag to orbit · shift-drag to pan · scroll to zoom · click a node to select' : 'Drag to pan · ctrl/⌘ + scroll or pinch to zoom · drag a node to move it · +/− and 0 on the keyboard', l);
}

/* ---------- intro ---------- */
function intro() {
  if (!G) return;
  const ns = [...nodeEls.values()].map(x => x.g), ds = [...nodeEls.values()].map(x => x.dot), es = [...edgeEls.values()].map(x => x.p).filter(p => !p.classList.contains('s-ok'));
  const tl = G.timeline();
  tl.from(ns, { opacity: 0, duration: 0.35, stagger: { amount: 0.9 }, clearProps: 'opacity' }, 0).from(ds, { attr: { r: 0 }, duration: 0.5, stagger: { amount: 0.9 }, ease: 'back.out(3)' }, 0)
    .from(es, { opacity: 0, duration: 0.8, stagger: { amount: 0.6 }, clearProps: 'opacity' }, 0.5).from('#deco > *', { opacity: 0, duration: 0.6, stagger: 0.03, clearProps: 'opacity' }, 0);
  // Throttled tabs and previews still end up showing everything.
  setTimeout(() => tl.progress(1), 2600);
}

/* ---------- 3D (three.js, loaded on first use) ---------- */
const T3 = { ready: false, loading: false, active: false, scenes: new Map() };
function enter3d() {
  T3.active = true; legend(); apply();
  if (window.THREE) return start3d();
  const box = $('three'); box.querySelector('.notice') || h('div', 'notice', 'Loading 3D…', box);
  if (T3.loading) return; T3.loading = true;
  const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload = () => { box.querySelector('.notice')?.remove(); T3.active && start3d(); };
  s.onerror = () => { box.querySelector('.notice').textContent = 'The 3D view needs three.js from cdnjs.cloudflare.com, which did not load here. The 2D views have the same data.'; };
  document.head.append(s);
}
function leave3d() { T3.active = false; S.hover = null; T3.raf && cancelAnimationFrame(T3.raf); T3.raf = null; $('labels').textContent = ''; }
function positions3d() {
  const P = new Map(), planes = [];
  if (isLane()) {
    M.columns.forEach((_, ci) => { const list = M.nodes.filter(n => n.col === ci); list.forEach((n, r) => P.set(n.id, [(ci - (M.columns.length - 1) / 2) * 150, 0, (r - (list.length - 1) / 2) * 24])); });
  } else {
    const order = ['client', 'tag', 'trigger', 'variable'].filter(k => fam(k).length || (k === 'variable' && fam('builtin').length));
    order.forEach((k, li) => {
      const list = k === 'variable' ? [...fam('variable'), ...fam('builtin')] : fam(k), cols = Math.max(3, Math.ceil(Math.sqrt(list.length * 1.4))), rws = Math.ceil(list.length / cols), y = ((order.length - 1) / 2 - li) * 130;
      list.forEach((n, i) => P.set(n.id, [((i % cols) - (cols - 1) / 2) * 26, y, (Math.floor(i / cols) - (rws - 1) / 2) * 26]));
      planes.push({ y, w: cols * 26 + 30, d: rws * 26 + 30, label: label(k) });
    });
  }
  return { P, planes };
}
function start3d() {
  const THREE = window.THREE, box = $('three');
  if (!T3.renderer) {
    T3.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); T3.renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); box.append(T3.renderer.domElement);
    T3.camera = new THREE.PerspectiveCamera(45, 1, 1, 8000); T3.ray = new THREE.Raycaster(); T3.orbit = { theta: 0.75, phi: 1.05, r: 900, tx: 0, ty: 0, tz: 0 };
    controls3d(); new ResizeObserver(() => size3d()).observe(box);
  }
  if (!T3.scenes.has(S.tab)) T3.scenes.set(S.tab, scene3d());
  T3.cur = T3.scenes.get(S.tab); size3d();
  const o = T3.orbit; Object.assign(o, { tx: 0, ty: 0, tz: 0, r: T3.cur.radius, theta: 0.75, phi: isLane() ? 0.85 : 1.1 });
  if (G) { const tl = G.timeline(); tl.from(o, { r: o.r * 2.2, theta: o.theta + 1.2, duration: 1.6, ease: 'power3.out' }); setTimeout(() => tl.progress(1), 2200); }
  apply(); loop3d();
}
function scene3d() {
  const THREE = window.THREE, scene = new THREE.Scene(), { P, planes } = positions3d(), meshes = new Map(), geo = new THREE.SphereGeometry(4, 14, 10), halo = new THREE.SphereGeometry(7, 12, 8);
  M.nodes.forEach(n => {
    const p = P.get(n.id); if (!p) return;
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: hex(n.kind), transparent: true })); m.position.set(...p); m.userData.id = n.id; scene.add(m); meshes.set(n.id, m);
    const hc = isAudit() ? (PROBLEMS.includes(n.status) ? ST[n.status][2] : null) : n.risk === 'critical' ? 0xff625f : n.risk === 'review' ? 0xffe94a : null;
    if (hc != null) { const r = new THREE.Mesh(halo, new THREE.MeshBasicMaterial({ color: hc, wireframe: true, transparent: true, opacity: 0.55 })); r.position.set(...p); scene.add(r); m.userData.halo = r; }
  });
  planes.forEach(pl => {
    if (pl.y == null) return;
    const g = new THREE.PlaneGeometry(pl.w, pl.d), mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xffe94a, transparent: true, opacity: 0.03, side: THREE.DoubleSide, depthWrite: false }));
    mesh.rotation.x = -Math.PI / 2; mesh.position.y = pl.y - 6; scene.add(mesh);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: 0x353025 })); edges.rotation.x = -Math.PI / 2; edges.position.y = pl.y - 6; scene.add(edges);
  });
  const curve = (a, b) => {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
    if (!isLane()) return [A, B];
    const mid = A.clone().add(B).multiplyScalar(0.5); mid.y += 20 + A.distanceTo(B) * 0.22;
    return new THREE.QuadraticBezierCurve3(A, mid, B).getPoints(12);
  };
  const groups = {}, segs = new Map();
  M.edges.forEach(e => {
    const a = P.get(e.from), b = P.get(e.to); if (!a || !b) return;
    const pts = curve(a, b), arr = []; for (let i = 0; i < pts.length - 1; i++) arr.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
    segs.set(ekey(e), arr); const g = e.status || (e.kind === 'duplicate' ? 'dup' : 'base'); (groups[g] = groups[g] || []).push(...arr);
  });
  const COL = { ok: [0xffe94a, 0.55], dead: [0xff625f, 0.7], maybe: [0xffad58, 0.45], unknown: [0x5d574a, 0.5], idle: [0x353025, 0.6], base: [0x6b6352, 0.28], dup: [0xffe94a, 0.35] };
  const lines = Object.entries(groups).map(([g, arr]) => { const geom = new THREE.BufferGeometry(); geom.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); const l = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({ color: COL[g][0], transparent: true, opacity: COL[g][1] })); l.userData.base = COL[g][1]; scene.add(l); return l; });
  const hot = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xf7f2df })); scene.add(hot);
  let rad = 0; P.forEach(p => (rad = Math.max(rad, Math.hypot(...p)))); return { scene, meshes, lines, hot, segs, P, radius: Math.max(320, rad * 2.1) };
}
function size3d() { const box = $('three'), w = box.clientWidth, hgt = box.clientHeight; if (!T3.renderer || !w) return; T3.renderer.setSize(w, hgt); T3.camera.aspect = w / hgt; T3.camera.updateProjectionMatrix(); }
function apply3d(f, ok) {
  const c = T3.cur; if (!c) return;
  c.meshes.forEach((m, id) => { const vis = ok.has(id), on = !f || f.has(id); m.material.opacity = !vis ? 0.06 : on ? 1 : 0.14; m.scale.setScalar(id === S.sel ? 1.8 : 1); if (m.userData.halo) m.userData.halo.material.opacity = on && vis ? 0.55 : 0.05; });
  c.lines.forEach(l => (l.material.opacity = f ? l.userData.base * 0.25 : l.userData.base));
  const arr = []; if (f) M.edges.forEach(e => { if (f.has(e.from) && f.has(e.to)) arr.push(...(c.segs.get(ekey(e)) || [])); });
  c.hot.geometry.dispose(); c.hot.geometry = new window.THREE.BufferGeometry(); c.hot.geometry.setAttribute('position', new window.THREE.Float32BufferAttribute(arr, 3));
  const lab = $('labels'); lab.textContent = ''; T3.labels = [];
  const ids = f ? [...f].slice(0, 40) : [];
  ids.forEach(id => { if (!c.P.has(id)) return; const s = h('span', id === S.sel ? 'sel' : '', short(byId.get(id).name, 34), lab); T3.labels.push([id, s]); });
}
function fly3d(id) { const p = T3.cur && T3.cur.P.get(id); if (!p) return; const o = T3.orbit; if (G) G.to(o, { tx: p[0], ty: p[1], tz: p[2], r: Math.min(o.r, 380), duration: 0.9, ease: 'power2.inOut' }); else Object.assign(o, { tx: p[0], ty: p[1], tz: p[2] }); }
function loop3d() {
  if (!T3.active) return;
  const o = T3.orbit, cam = T3.camera, THREE = window.THREE;
  cam.position.set(o.tx + o.r * Math.sin(o.phi) * Math.cos(o.theta), o.ty + o.r * Math.cos(o.phi), o.tz + o.r * Math.sin(o.phi) * Math.sin(o.theta)); cam.lookAt(o.tx, o.ty, o.tz);
  T3.renderer.render(T3.cur.scene, cam);
  const w = T3.renderer.domElement.clientWidth, hgt = T3.renderer.domElement.clientHeight, v = new THREE.Vector3();
  (T3.labels || []).forEach(([id, s]) => { v.set(...T3.cur.P.get(id)).project(cam); s.style.display = v.z > 1 ? 'none' : ''; s.style.left = ((v.x + 1) / 2) * w + 'px'; s.style.top = ((1 - v.y) / 2) * hgt + 'px'; });
  T3.raf = requestAnimationFrame(loop3d);
}
function controls3d() {
  const c = T3.renderer.domElement, o = T3.orbit; let drag = null;
  const pick = e => { const r = c.getBoundingClientRect(); T3.ray.setFromCamera({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 }, T3.camera); const hit = T3.ray.intersectObjects([...T3.cur.meshes.values()])[0]; return hit && hit.object.userData.id; };
  c.addEventListener('pointerdown', e => { c.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, moved: false, pan: e.shiftKey || e.button === 2 }; });
  c.addEventListener('pointermove', e => {
    if (!drag) { const id = pick(e); if (id !== S.hover) { S.hover = id || null; c.style.cursor = id ? 'pointer' : 'grab'; apply(); } return; }
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.hypot(dx, dy) > 3) drag.moved = true; drag.x = e.clientX; drag.y = e.clientY;
    if (drag.pan) { const s = o.r / 900; o.tx -= (Math.sin(o.theta) * dx * -1 + 0) * s; o.tz -= Math.cos(o.theta) * dx * s; o.ty += dy * s; }
    else { o.theta += dx * 0.006; o.phi = Math.max(0.12, Math.min(Math.PI - 0.12, o.phi - dy * 0.006)); }
  });
  c.addEventListener('pointerup', e => { if (drag && !drag.moved) { const id = pick(e); if (id) select(id, false); else { S.route = null; select(null); } } drag = null; });
  c.addEventListener('pointerleave', () => { if (!drag && S.hover) { S.hover = null; c.style.cursor = 'grab'; apply(); } });
  c.addEventListener('contextmenu', e => e.preventDefault());
  c.addEventListener('wheel', e => { e.preventDefault(); o.r = Math.max(60, Math.min(5000, o.r * Math.exp(e.deltaY * 0.0012))); }, { passive: false });
}

/* ---------- GTM auto: the Autoresearch loop, run in the page ---------- */
const AU = { ci: null, st: null, data: null, model: null, origin: new Map(), fresh: new Set(), pick: null, running: false, sample: undefined, busy: false };
const KINDS = { tag: ['tag', 'tagId'], trigger: ['trigger', 'triggerId'], variable: ['variable', 'variableId'] };
function autoInit(ci) {
  if (ci == null && AU.st) return autoModel();
  const webIdx = D.containers.findIndex(c => /web/.test(c.meta.context));
  AU.ci = ci ?? (webIdx >= 0 ? webIdx : 0); AU.data = D.auto[AU.ci];
  AU.st = GTM_AUTO.start(AU.data); AU.pick = null; AU.fresh = new Set(); AU.origin = new Map();
  const fname = id => (AU.data.folder.find(f => f.folderId === id) || {}).name || 'No folder';
  Object.entries(KINDS).forEach(([k, [, idk]]) => AU.data[k].forEach(r => AU.origin.set(`a-${k}:${r[idk]}`, { folder: r.parentFolderId ? fname(r.parentFolderId) : 'No folder', name: r.name })));
  AU.model = null; autoModel();
}
function autoModel() {
  const c = AU.st.best, start = new Set(AU.data.folder.map(f => f.folderId));
  const fname = id => (c.folder.find(f => f.folderId === id) || {}).name || 'No folder';
  const prev = AU.model ? new Map(AU.model.nodes.map(n => [n.id, n])) : new Map();
  const nodes = [];
  Object.entries(KINDS).forEach(([k, [kind, idk]]) => c[k].forEach(r => {
    const id = `a-${k}:${r[idk]}`, n = prev.get(id) || { id, kind, ref: r[idk], type: r.type, findings: [], risk: null };
    n.name = r.name; n.folder = r.parentFolderId ? fname(r.parentFolderId) : 'No folder'; nodes.push(n);
  }));
  const used = new Set(nodes.map(n => n.folder));
  const cols = [...c.folder.filter(f => start.has(f.folderId)), ...c.folder.filter(f => !start.has(f.folderId))].map(f => f.name).filter(n => used.has(n));
  if (used.has('No folder')) cols.push('No folder');
  AU.fresh = new Set(c.folder.filter(f => !start.has(f.folderId)).map(f => f.name));
  const ko = { tag: 0, trigger: 1, variable: 2 };
  nodes.forEach(n => (n.col = cols.indexOf(n.folder)));
  nodes.sort((a, b) => a.col - b.col || ko[a.kind] - ko[b.kind] || a.name.localeCompare(b.name));
  if (AU.model) { AU.model.nodes = nodes; AU.model.columns = cols; }
  else AU.model = { meta: { name: 'GTM auto', publicId: AU.data.publicId }, nodes, edges: [], columns: cols };
  return AU.model;
}
function autoSide(block, box) {
  const b = block('Loop'), row = h('div', 'autorow', '', b);
  const run = h('button', 'primary', AU.st.done ? 'Run again' : 'Run loop', row), stp = h('button', '', 'Step one round', row), rst = h('button', '', 'Reset', row);
  run.id = 'auRun'; stp.id = 'auStep'; rst.id = 'auReset';
  run.onclick = () => { if (AU.st.done || AU.st.rounds.length) { autoInit(AU.ci); load(); } runLoop(); };
  stp.onclick = () => stepOnce(); rst.onclick = () => { stopLoop(); autoInit(AU.ci); load(); };
  const ask = h('button', 'askbtn', 'Ask Claude for the next round', b); ask.id = 'auAsk'; ask.hidden = !AU.sample; ask.onclick = askClaude;
  const msg = h('p', 'note', '', b); msg.id = 'auMsg'; msg.setAttribute('aria-live', 'polite');
  if (D.auto.length > 1) {
    const lab = h('label', 'pick', 'Container ', b), sel = h('select', '', '', lab);
    D.auto.forEach((a, i) => { const o = h('option', '', a.publicId || 'Container ' + (i + 1), sel); o.value = i; }); sel.value = AU.ci;
    sel.onchange = () => { stopLoop(); autoInit(+sel.value); load(); };
  }
  [stp, ask].forEach(x => (x.disabled = AU.st.done || AU.running)); run.disabled = AU.running;
  const d = block('Score by check'), dims = h('div', 'dims', '', d);
  GTM_AUTO.dims.forEach(k => {
    const base = AU.st.baseline.dimensions[k], now = AU.st.report.dimensions[k], r = h('div', 'dim', '', dims);
    h('span', '', DIM[k] || k, r); const bar = h('span', 'bar', '', r), bb = h('b', '', '', bar), mark = h('i', 'basemark', '', bar);
    bb.style.width = now + '%'; bb.style.background = now > base + 0.01 ? 'var(--pass)' : now >= 90 ? 'var(--pass)' : now >= 60 ? 'var(--gold)' : 'var(--crit)'; mark.style.left = base + '%';
    h('span', 'v', (now - base > 0.05 ? '+' + Math.round(now - base) : Math.round(now)), r);
  });
  h('p', 'note', `Total ${AU.st.baseline.score} → ${AU.st.report.score}. Light marks show the baseline.`, d).style.marginTop = '8px';
  const rb = block('Rounds');
  if (!AU.st.rounds.length) h('p', 'empty', 'No rounds yet.', rb);
  AU.st.rounds.forEach((r, i) => {
    const btn = h('button', 'rec ' + (r.accepted ? 'delivered' : 'critical') + (AU.pick === i ? ' on' : ''), `Round ${r.round} · ${r.accepted ? 'accepted' : 'rejected'}${r.score != null ? ' · ' + r.score : ''}${r.source === 'claude' ? ' · Claude' : ''}`, rb);
    h('small', '', r.why, btn); h('small', '', `${r.operations.length} operation${r.operations.length === 1 ? '' : 's'}. ${r.reason}`, btn);
    btn.onclick = () => { AU.pick = i; S.sel = null; select(null); side(); };
  });
  if (AU.st.done) h('p', 'note', AU.st.failures >= AU.st.maxFailures ? 'Stopped: too many rejected proposals.' : AU.st.plateau >= AU.st.plateauRounds ? 'Stopped: no improvement in two rounds.' : AU.st.rounds.length >= AU.st.maxRounds ? 'Stopped: round limit reached.' : 'Stopped: the proposer has no more ideas.', rb);
  const res = block('Candidate'), ops = AU.st.rounds.filter(r => r.accepted).flatMap(r => r.operations);
  h('p', 'note', ops.length ? `${ops.length} operations from ${AU.st.rounds.filter(r => r.accepted).length} accepted rounds, applied to a copy. Nothing was published or written to GTM.` : 'No accepted changes yet.', res);
  if (ops.length) {
    const row2 = h('div', 'autorow pair', '', res), cp = h('button', '', 'Copy operations (JSON)', row2), ex = h('button', 'primary', 'Export container (JSON)', row2);
    cp.onclick = () => copyOps(ops, cp); ex.onclick = () => exportPick(AU.st.rounds.filter(r => r.accepted).map(r => r.operations));
    const ix = h('p', 'note', 'Export asks for the original export file of ' + (AU.data.publicId || 'this container') + ', applies these operations to it in this browser and saves an importable container. The file is never uploaded; this page holds no tag settings or tokens of its own.', res); ix.id = 'auExportMsg';
  }
  const n = block('How the loop works');
  h('p', 'note', 'Audit the container → a proposer suggests one round of metadata-only operations (add folder, assign folder, rename) → apply them to a copy → audit again. A round is kept only if the score rises, no critical finding is added and no check goes down. The loop stops after two rounds without improvement, two rejected proposals, or eight rounds. Scores here are computed in the page from names, links and settings hashes, and match the plugin\'s audit exactly. Publishing is never part of the loop.', n);
  h('p', 'foot', `gtm-audit-pro · GTM Autoresearch · ${(D.generatedAt || '').slice(0, 10)}`, box);
}
function roundCard(box) {
  const r = AU.st.rounds[AU.pick], c = h('div', 'card', '', box), cur = AU.st.best;
  h('h3', '', `Round ${r.round}: ${r.accepted ? 'accepted' : 'rejected'}`, c); h('p', 'sub', `${r.source === 'claude' ? 'Proposed by Claude' : 'Heuristic proposer'} · ${r.operations.length} operations`, c);
  h('p', 'find', r.why, c); const p = h('p', 'find', r.reason, c); p.style.borderColor = r.accepted ? 'var(--pass)' : 'var(--crit)';
  const name = (k, id) => ((cur[k] || []).find(x => x[KINDS[k][1]] === id) || {}).name || id;
  const fname = id => ((cur.folder.find(f => f.folderId === id) || r.operations.find(o => o.op === 'addFolder' && o.id === id) || {}).name) || id;
  const ul = h('ul', 'skipped oplist', '', c);
  r.operations.slice(0, 80).forEach(o => h('li', '', o.op === 'addFolder' ? `Add folder "${o.name}"` : o.op === 'assignFolder' ? `${o.kind} ${name(o.kind, o.id)} → ${fname(o.folderId)}` : `Rename ${o.kind} ${o.id} → ${o.name}`, ul));
  if (r.operations.length > 80) h('li', '', `+${r.operations.length - 80} more`, ul);
  const back = h('button', 'link', 'Close', c); back.onclick = () => { AU.pick = null; select(null); side(); };
}
function relayout() {
  const from = new Map(S.pos); autoModel(); byId = new Map(M.nodes.map(n => [n.id, n]));
  adj = new Map(M.nodes.map(n => [n.id, { out: [], in: [] }]));
  M.nodes.forEach(n => nodeEls.get(n.id).g.classList.toggle('moved', AU.origin.get(n.id).folder !== n.folder));
  if (S.view !== 'auto') { rows(); return; }
  const L = layout('auto'); drawDeco(L); $('caption').textContent = L.caption; S.pos = L.pos; S.bounds = { W: L.W, H: L.H };
  if (G) { morph && morph.progress(1); const o = { t: 0 }; morph = G.to(o, { t: 1, duration: 0.9, ease: 'power3.inOut', onUpdate: () => place(from, L.pos, o.t) }); setTimeout(() => morph.progress(1), 1300); G.from('#deco > *', { opacity: 0, duration: 0.5, stagger: 0.01, clearProps: 'opacity' }); }
  else place(null, L.pos, 1);
  fit('all', true); rows();
}
function afterRound(entry) {
  if (entry.accepted) relayout();
  header(); side(); legend();
  const m = $('auMsg'); if (m) m.textContent = `Round ${entry.round} ${entry.accepted ? 'accepted' : 'rejected'}. ${entry.reason}`;
  $('live').textContent = `Round ${entry.round} ${entry.accepted ? 'accepted' : 'rejected'}`;
}
function stepOnce() {
  if (AU.st.done || AU.busy) return null;
  const p = GTM_AUTO.propose(AU.st, { vendor: AU.data.vendor });
  if (!p) { AU.st.done = true; side(); return null; }
  const e = GTM_AUTO.step(AU.st, p); afterRound(e); return e;
}
let loopTimer = null;
function stopLoop() { clearTimeout(loopTimer); loopTimer = null; AU.running = false; }
function runLoop() {
  if (!isAuto()) return; AU.running = true; side();
  const tick = () => { if (!AU.running || !isAuto()) return stopLoop(); const e = stepOnce(); if (!e || AU.st.done) { stopLoop(); side(); return; } loopTimer = setTimeout(tick, reduce ? 200 : 1500); };
  loopTimer = setTimeout(tick, 250);
}
function exportPick(rounds) {
  const ops = rounds.flat();
  const msg = $('auExportMsg'), say = t => { if (msg) msg.textContent = t; $('live').textContent = t; };
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json'; inp.hidden = true; document.body.append(inp);
  inp.onchange = () => {
    const f = inp.files && inp.files[0]; inp.remove(); if (!f) return;
    f.text().then(async text => {
      let full; try { full = JSON.parse(text); } catch (e) { return say('That file is not JSON. Choose the container export from GTM (Admin → Export container).'); }
      const problems = GTM_AUTO.sameInventory(full, AU.data);
      if (problems.length) return say('Not exported: ' + problems.join('; ') + '. Use the export this atlas was built from, or rebuild the atlas from the newer export.');
      let doc; try { doc = GTM_AUTO.exportContainer(full, rounds); } catch (e) { return say('Not exported: ' + e.message + '.'); }
      const name = `${AU.data.publicId || 'container'}-autoresearch-candidate.json`, data = JSON.stringify(doc, null, 2);
      const done = () => say(`Saved ${name}: ${ops.length} metadata changes on top of your export, every tag setting unchanged. Import it into a new workspace (Admin → Import container → Merge → Overwrite conflicting), review, then publish yourself.`);
      try {
        const dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null;
        if (dl) { await dl.save({ filename: name, data }); return done(); }
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); done();
      } catch (e) { say(e && e.code === 'declined' ? 'Save cancelled.' : e && e.code === 'rate_limited' ? 'A save prompt is already open.' : 'This view cannot save files; open the page in a browser or in Claude.'); }
    }, () => say('Could not read that file.'));
  };
  inp.click();
}
function copyOps(ops, btn) {
  const text = JSON.stringify({ operations: ops }, null, 2);
  const done = ok => { btn.textContent = ok ? 'Copied' : 'Copy failed: select and copy from the Changes view'; setTimeout(() => (btn.textContent = 'Copy operations (JSON)'), 2200); };
  try { navigator.clipboard.writeText(text).then(() => done(true), () => done(false)); } catch (e) { done(false); }
}
// Optional: Claude proposes the next round through the artifact runtime, when the page is opened in Claude.
(async () => {
  try { AU.sample = window.claude && window.claude.use ? await window.claude.use('sample') : null; } catch (e) { AU.sample = null; }
  const b = $('auAsk'); if (b) b.hidden = !AU.sample;
})();
async function askClaude() {
  if (!AU.sample || AU.busy || AU.st.done) return;
  const st = AU.st, c = st.best, m = $('auMsg'), btn = $('auAsk'); AU.busy = true; btn.disabled = true; m.textContent = 'Asking Claude for one round of operations…';
  const fname = id => (c.folder.find(f => f.folderId === id) || {}).name;
  const unfiled = Object.entries(KINDS).flatMap(([k, [, idk]]) => c[k].filter(r => !r.parentFolderId).map(r => `${k} ${r[idk]} "${r.name}"${k === 'tag' && AU.data.vendor[r[idk]] ? ' [' + AU.data.vendor[r[idk]] + ']' : ''}`)).slice(0, 140);
  const counts = {}; st.report.findings.forEach(f => (counts[f.dimension] = (counts[f.dimension] || 0) + 1));
  const maxId = Math.max(0, ...c.folder.map(f => +f.folderId || 0));
  const prompt = [
    'You propose ONE round of metadata-only cleanup for a Google Tag Manager container. Reply with JSON only: {"why":"one sentence","operations":[...]}.',
    'Allowed operations: {"op":"addFolder","id":"<numeric string greater than ' + maxId + '>","name":"..."}; {"op":"assignFolder","kind":"tag|trigger|variable","id":"<element id>","folderId":"<folder id>"}; {"op":"rename","kind":"tag|trigger|variable","id":"<element id>","name":"..."}.',
    'Rules: at most 100 operations; names must not contain { or }; variables that other elements reference cannot be renamed; the round is kept only if the audit score rises and no check goes down.',
    'Check scores now: ' + GTM_AUTO.dims.map(k => `${k} ${Math.round(st.report.dimensions[k])}`).join(', ') + '. Finding counts: ' + JSON.stringify(counts) + '.',
    'Folders: ' + (c.folder.map(f => `${f.folderId} "${f.name}"`).join('; ') || 'none') + '.',
    'Elements without a folder (' + unfiled.length + ' shown):\n' + unfiled.join('\n'),
    'Earlier rounds: ' + (st.rounds.map(r => `${r.round} ${r.accepted ? 'accepted' : 'rejected'} (${r.why})`).join('; ') || 'none') + '.',
  ].join('\n\n');
  try {
    const out = await AU.sample.json(prompt, { modelTier: 'default' });
    const ops = Array.isArray(out && out.operations) ? out.operations : [];
    const e = GTM_AUTO.step(st, { idea: 'claude-' + (st.rounds.length + 1), why: String((out && out.why) || 'Claude proposal').slice(0, 300), source: 'claude', operations: ops });
    afterRound(e);
  } catch (err) {
    m.textContent = err && err.code === 'not_granted' ? 'Claude is not available on this page.' : err && err.code === 'rate_limited' ? 'Claude is busy; try again in a minute.' : 'Claude did not return a usable proposal.';
    if (err && err.code === 'not_granted') { AU.sample = null; btn.hidden = true; }
  } finally { AU.busy = false; if ($('auAsk')) $('auAsk').disabled = AU.st.done; }
}

/* ---------- wiring ---------- */
$('q').oninput = e => { S.q = e.target.value.toLowerCase().trim(); apply(); };
$('kind').onchange = e => { S.kind = e.target.value; apply(); };
$('risk').onchange = e => (isAudit() ? setRisk(e.target.value) : (S.risk = e.target.value, apply()));
$('trace').onchange = e => { S.trace = e.target.value; apply(); };
$('zoomIn').onclick = () => (S.view === '3d' ? (T3.orbit.r *= 0.8) : zoomBy(1.25));
$('zoomOut').onclick = () => (S.view === '3d' ? (T3.orbit.r *= 1.25) : zoomBy(0.8));
$('fit').onclick = () => (S.view === '3d' ? Object.assign(T3.orbit, { tx: 0, ty: 0, tz: 0, r: T3.cur.radius }) : fit('all', true));
$('reset').onclick = () => { S.q = ''; S.kind = 'all'; S.risk = 'all'; S.trace = 'near'; S.route = null; S.pinned.clear(); $('q').value = ''; $('kind').value = 'all'; $('risk').value = 'all'; $('trace').value = 'near'; select(null); setView(homeView(), true); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') { S.route = null; select(null); } else if (e.key === '/' && !e.target.matches('input,select,textarea')) { e.preventDefault(); $('q').focus(); } });
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (S.view !== 'schedule' && S.view !== '3d') mini(); }, 150); });
tabs();
const hv = location.hash.slice(1), byType = t => TABS.findIndex(x => x.type === t);
if (['flow', 'audit', 'auto'].includes(hv) && byType(hv) >= 0) { S.tab = byType(hv); S.view = hv; }
else S.view = ['structured', 'spatial', 'axonometric', 'schedule', '3d'].includes(hv) ? hv : null;
load(); select(null);
})();

/* ---------- report export (Markdown file, PDF via the browser's print dialog) ---------- */
(function reportExports() {
  const R = JSON.parse(document.getElementById('atlas-data').textContent).report, $ = id => document.getElementById(id); if (!R) return;
  const say = t => { $('live').textContent = t; const m = $('repMsg'); if (m) m.textContent = t; };
  async function save(name, data, type) {
    try {
      const dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null;
      if (dl) { await dl.save({ filename: name, data }); return say('Saved ' + name); }
    } catch (e) { if (e && e.code === 'declined') return say('Save cancelled.'); }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type })); a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); say('Saved ' + name);
  }
  $('repMd').onclick = () => save(R.name + '.md', R.md, 'text/markdown');
  $('repPdf').onclick = () => {
    const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;width:0;height:0;border:0;right:0;bottom:0'; f.setAttribute('aria-hidden', 'true');
    f.onload = () => { try { f.contentWindow.focus(); f.contentWindow.print(); say('Choose "Save as PDF" in the print dialog.'); } catch (e) { save(R.name + '.html', R.html, 'text/html'); say('Printing is blocked here; saved the print-ready HTML instead. Open it and Save as PDF.'); } setTimeout(() => f.remove(), 60000); };
    f.srcdoc = R.html; document.body.append(f);
  };
})();
