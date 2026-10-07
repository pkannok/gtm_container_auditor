// GTM Autoresearch in the browser. A port of audit(), applyOperations() and
// optimize() from audit.mjs that runs on a stripped container: names, IDs, types,
// trigger links, folder IDs, {{references}} and a hash of each element's settings.
// Scores match audit.mjs exactly (checked by test/auto.test.mjs). Nothing here can
// publish; the operations are metadata only (rename, addFolder, assignFolder).
var GTM_AUTO = (function () {
  'use strict';
  var groups = { tag: 'tagId', trigger: 'triggerId', variable: 'variableId', folder: 'folderId' };
  var dims = ['references', 'duplicates', 'naming', 'hygiene', 'legacy', 'folders'];
  var builtinTriggers = { '2147479553': 1, '2147479572': 1, '2147479573': 1 };
  var internalVariables = { _event: 1 };
  var clone = function (x) { return JSON.parse(JSON.stringify(x)); };
  // Stripped rows carry their references in row.refs; full export rows are scanned like audit.mjs does.
  var refs = function (row) {
    var out = [], scan = function (v) { if (typeof v === 'string') v.replace(/\{\{([^{}]+)\}\}/g, function (_, n) { out.push(n); }); else if (v && typeof v === 'object') Object.keys(v).forEach(function (k) { scan(v[k]); }); };
    if (typeof row.refs === 'string') scan(row.refs); else scan(row);
    return out;
  };
  var seqMatch = function (r, tag) { return r.tagName === tag.name || r.tagName === tag.tagId; };

  function audit(c) {
    var findings = [];
    var add = function (dimension, severity, kind, row, id, message) { findings.push({ dimension: dimension, severity: severity, kind: kind, id: row[id], name: row.name, message: message }); };
    var triggerIds = {}, variableNames = {}, folderIds = {}, usedTriggers = {}, usedVariables = {};
    c.trigger.forEach(function (t) { triggerIds[t.triggerId] = 1; });
    c.variable.concat(c.builtInVariable).forEach(function (v) { variableNames[v.name] = 1; });
    c.folder.forEach(function (f) { folderIds[f.folderId] = 1; });
    c.tag.forEach(function (tag) {
      (tag.firingTriggerId || []).concat(tag.blockingTriggerId || []).forEach(function (id) {
        usedTriggers[id] = 1;
        if (!triggerIds[id] && !builtinTriggers[id]) add('references', 'critical', 'tag', tag, 'tagId', 'Unresolved trigger ID ' + id);
      });
      var sequenced = c.tag.some(function (t) { return (t.setupTag || []).concat(t.teardownTag || []).some(function (s) { return seqMatch(s, tag); }); });
      if (!tag.paused && !(tag.firingTriggerId || []).length && !sequenced) add('hygiene', 'review', 'tag', tag, 'tagId', 'No firing trigger; review intended use');
      if (tag.type === 'ua') add('legacy', 'review', 'tag', tag, 'tagId', 'Universal Analytics tag; review migration');
    });
    Object.keys(groups).forEach(function (key) {
      var id = groups[key], seen = {};
      c[key].forEach(function (row) {
        if (key !== 'folder') {
          refs(row).forEach(function (name) {
            usedVariables[name] = 1;
            if (!variableNames[name] && !internalVariables[name]) add('references', 'critical', key, row, id, 'Unresolved variable ' + name);
          });
          if (!row.parentFolderId) add('folders', 'info', key, row, id, 'No folder assigned');
          else if (!folderIds[row.parentFolderId]) add('references', 'critical', key, row, id, 'Unresolved parent folder');
          if (seen[row.sig]) add('duplicates', 'review', key, row, id, 'Configuration matches ' + seen[row.sig] + '; confirm whether intentional');
          else seen[row.sig] = row[id];
        }
        var n = row.name.trim();
        if (!n || /^(tag|trigger|variable)\s*\d+$/i.test(n)) add('naming', 'info', key, row, id, 'Generic or empty name');
      });
    });
    c.trigger.forEach(function (t) { if (!usedTriggers[t.triggerId]) add('hygiene', 'review', 'trigger', t, 'triggerId', 'No tag references this trigger; review before removal'); });
    c.variable.forEach(function (v) { if (!usedVariables[v.name]) add('hygiene', 'review', 'variable', v, 'variableId', 'No configuration reference found; external use not verified'); });
    var size = Math.max(1, c.tag.length + c.trigger.length + c.variable.length), scores = {};
    dims.forEach(function (d) { scores[d] = Math.max(0, 100 - 100 * findings.filter(function (f) { return f.dimension === d; }).length / size); });
    var total = 0; dims.forEach(function (d) { total += scores[d]; });
    return { score: Math.round(total / dims.length * 100) / 100, dimensions: scores, findings: findings, criticalCount: findings.filter(function (f) { return f.severity === 'critical'; }).length };
  }

  function applyOperations(input, operations) {
    var c = clone(input);
    if (!Array.isArray(operations) || operations.length > 100) throw Error('Expected at most 100 operations');
    operations.forEach(function (op) {
      if (!op || ['rename', 'assignFolder', 'addFolder'].indexOf(op.op) < 0) throw Error('Unsupported mutation operation');
      if (op.op === 'addFolder') {
        if (typeof op.id !== 'string' || !/^\d+$/.test(op.id) || typeof op.name !== 'string' || !op.name.trim() || c.folder.some(function (f) { return f.folderId === op.id; })) throw Error('Invalid new folder');
        c.folder.push({ folderId: op.id, name: op.name }); return;
      }
      if (!Object.prototype.hasOwnProperty.call(groups, op.kind)) throw Error('Invalid component kind');
      var row = c[op.kind].filter(funßžvÚÚ$z{-®éÜj×   drift.triggers.forEach(x => { const n = tagNode(x.tagId); issue(n, 'drifted', x.message); if (n) n.issues = n.issues.filter(i => !(i.status === 'orphaned' && /firing trigger/i.test(i.message))); });
    drift.changed.forEach(x => issue(tagNode(x.tagId), 'drifted', `Settings differ in version ${drift.liveVersion}: ${[x.detail, x.keys.filter(k => !(x.detail ?? '').includes(k)).join(', ')].filter(Boolean).join('; ')}.`));
    drift.removed.forEach(x => issue(tagNode(x.tagId), 'drifted', `Not in published version ${drift.liveVersion}.`));
    for (const a of drift.added) {
      const n = node('wtag:live-' + a.tagId, { kind: 'wtag', col: 2, ref: a.tagId, name: a.name, type: a.type, folder: null, side: 'web', ghost: true, vendor: a.vendor });
      issue(n, 'drifted', `Added after the export: tag ${a.tagId} exists only in published version ${drift.liveVersion}. Fires on ${a.events.join(', ')}.`);
      const seenLive = ev && a.events.some(e => ev.events.has(e)) && ev.requests.some(q => a.hosts.some(h => q.host === h || q.host.endsWith('.' + h)));
      if (seenLive) { n.live = 'fired'; n.evidence.push(`${a.vendor} requests seen during the scan (${a.hosts.join(', ')}).`); }
      else if (ev) n.evidence.push(a.events.some(e => ev.events.has(e)) ? `No ${a.vendor} request seen.` : `The scan never reached ${a.events.join(' or ')}.`);
      if (!['Custom HTML'].includes(a.vendor)) edge(n.id, dest(a.vendor).id, 'delivers', n.live ? 'ok' : 'idle');
    }
  }

  /* endpoint, server side and flow */
  const liveSst = ev ? [...new Set(ev.requests.filter(q => q.path === '/data' || /\/g\/collect$/.test(q.path)).filter(q => !/google|doubleclick/.test(q.host)).map(q => q.host))] : [];
  if (flow) {
    const sIdx = { client: 4, variable: 5, builtin: 5, trigger: 6, tag: 7 };
    if (sg) {
      for (const g of sg.nodes) {
        if (g.kind === 'builtin' && !sg.edges.some(e => e.to === g.id && e.kind === 'reads')) continue;
        const n = node('s' + g.id, { kind: { client: 'client', variable: 'svariable', builtin: 'builtin', trigger: 'strigger', tag: 'stag' }[g.kind], col: sIdx[g.kind], ref: g.ref, name: g.name, type: g.type, folder: g.folder, side: 'server', paused: g.paused });
        fromFindings(n, g.findings);
        if (g.paused) issue(n, 'paused', 'Paused.');
      }
      for (const e of sg.edges) {
        if (e.kind === 'reads') edge('s' + e.to, 's' + e.from, 'reads');
        else if (e.kind === 'fires') edge('s' + e.to, 's' + e.from, 'fires');
        else if (e.kind === 'blocks') edge('s' + e.to, 's' + e.from, 'blocks');
      }
    }
    const S = cv(server);
    const fid = id => id.replace(/^stg:/, 'stag:').replace(/^str:/, 'strigger:').replace(/^cl:/, 'sclient:').replace(/^wtg:/, 'wtag:');
    for (const t of S.tag ?? []) { const n = nodes.get('stag:' + t.tagId); if (n) edge(n.id, dest(platformOf(S, t)).id, 'delivers', 'idle'); }
    // Endpoints: what the export sends to, and what the site actually sends to.
    for (const h of flow.meta.hosts) {
      const n = node('ep:' + h, { kind: 'endpoint', col: 3, ref: h, name: h, type: 'server endpoint (export)', side: 'edge' });
      if (liveSst.length && !liveSst.includes(h)) issue(n, 'drifted', `The export sends here; the live site sends to ${liveSst.join(', ')} instead.`);
    }
    for (const h of liveSst) {
      if (flow.meta.hosts.includes(h)) continue;
      const n = node('ep:' + h, { kind: 'endpoint', col: 3, ref: h, name: h, type: 'server endpoint (live)', side: 'edge', ghost: true, live: 'fired' });
      issue(n, 'drifted', `Not in the export. Every server request in the scan went here.`);
    }
    const counts = new Map();
    if (ev) for (const q of ev.requests.filter(q => liveSst.includes(q.host))) { const k = q.path === '/data' ? `data:${q.postEvent}` : `ga4:${q.q?.en ?? '?'}`; counts.set(k, (counts.get(k) ?? 0) + 1); }
    for (const r of flow.routes) {
      const wt = nodes.get(fid(r.webTag)); if (!wt) continue;
      const host = flow.nodes.find(n => n.id === r.endpoint)?.ref;
      const firedLive = wt.live === 'fired';
      const st = r.status === 'dead-end' ? 'dead' : r.status === 'delivered' ? (firedLive ? 'ok' : 'idle') : 'maybe';
      edge(wt.id, 'ep:' + host, 'sends', st);
      for (const h of liveSst) if (firedLive) edge(wt.id, 'ep:' + h, 'sends', r.status === 'dead-end' ? 'dead' : 'ok');
      const cl = r.client && nodes.get(fid(r.client));
      if (cl) { edge('ep:' + host, cl.id, 'routes', st); for (const h of liveSst) edge('ep:' + h, cl.id, 'routes', firedLive ? 'ok' : 'idle'); }
      for (const m of r.matched) if (cl) edge(cl.id, fid(m.id), 'matches', m.certainty === 'yes' ? st : 'maybe');
      if (r.status === 'dead-end') {
        const k = r.transport === 'data' ? `data:${r.event}` : `ga4:${r.event}`, hits = counts.get(k) ?? 0;
        issue(wt, 'broken', `Sends "${r.event}" to the server, but no server trigger matches it, so nothing is forwarded.${hits ? ` Confirmed live: ${hits} "${r.event}" request${hits > 1 ? 's' : ''} reached ${liveSst.join(', ')} during the scan.` : ''}`);
        if (cl) issue(cl, 'broken', `Claims "${r.event}" from ${wt.name}, but no server trigger matches it.`);
      }
      if (firedLive) for (const t of r.tags) { const sn = nodes.get(fid(t.id)); if (sn && t.certainty === 'yes') { sn.live = 'fired'; sn.evidence.includes('Reached by live traffic (inferred from the web request).') || sn.evidence.push('Reached by live traffic (inferred from the web request).'); } }
    }
    for (const f of flow.findings) {
      const n = nodes.get(fid(f.target)); if (!n) continue;
      if (/^No event from this web container reaches/.test(f.message) || /^No web tag in this container sends/.test(f.message) || /no active server tag uses/.test(f.message)) issue(n, 'orphaned', f.message);
      else if (/^Can fire \d+ times/.test(f.message)) issue(n, 'duplicate', f.message);
    }
    const byTransport = t => [...new Set(flow.routes.filter(r => (t === 'data' ? r.transport !== 'ga4' : r.transport === 'ga4') && r.client).map(r => fid(r.client)))];
    for (const [k, c] of counts) {
      const [kind, evn] = k.split(':');
      for (const id of byTransport(kind)) { const cl = nodes.get(id); if (cl) { cl.live = 'fired'; cl.evidence.push(`${c} "${evn}" request${c > 1 ? 's' : ''} seen during the scan.`); } }
    }
  }

  /* outside GTM */
  if (ev) {
    const gtmVendors = new Set([...vendorOf.values(), ...(drift?.added ?? []).map(a => a.vendor)]);
    for (const o of outsideGtm(ev, gtmVendors).filter(o => !o.alsoInGtm)) {
      const n = node('out:' + o.vendor, { kind: 'outside', col: 2, ref: o.hosts[0], name: `${o.vendor} (outside GTM)`, type: 'page code', side: 'web', live: 'fired' });
      issue(n, 'outside', `Loads from the page's own code, not from GTM: ${o.hosts.join(', ')}. Changes to the container do not affect it.`);
      edge(n.id, dest(o.vendor).id, 'delivers', 'ok');
    }
  }

  /* resolve each node's headline status */
  for (const n of nodes.values()) {
    n.issues.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
    n.status = n.issues[0]?.status ?? 'ok';
    if (n.status === 'ok' && !n.live && ev && n.kind === 'wtag') n.status = 'untested';
  }
  // Order rows within each lane: problems first, then by connections.
  const list = [...nodes.values()], rank = n => STATUS_ORDER.indexOf(n.status);
  for (let c = 0; c < COLS.length; c++) list.filter(n => n.col === c).sort((a, b) => rank(a) - rank(b) || (a.ghost ? 0 : 1) - (b.ghost ? 0 : 1) || a.name.localeCompare(b.name)).forEach((n, i) => (n.row = i));
  const counts = Object.fromEntries(STATUS_ORDER.map(s => [s, list.filter(n => n.status === s).length]));
  const any = Object.fromEntries(STATUS_ORDER.map(s => [s, list.filter(n => n.issues.some(i => i.status === s)).length]));
  return {
    meta: { name: `${W.container?.publicId ?? 'Web'}${server ? ' + ' + (cv(server).container?.publicId ?? 'Server') : ''}`, publicId: 'Audit', context: 'audit' },
    columns: COLS, nodes: list.sort((a, b) => a.col - b.col || a.row - b.row), edges,
    summary: { counts, any, total: list.length },
    drift: drift && { liveVersion: drift.liveVersion, exportedAt: drift.exportedAt, counts: drift.counts, added: drift.added.length, listeners: drift.listeners.map(l => l.label), paused: drift.paused.length, changed: drift.changed.length, triggers: drift.triggers.length, removed: drift.removed.length, endpoint: liveSst },
    scan: ev && { scannedAt: ev.scannedAt, pages: ev.pages, runs: ev.runs, events: [...ev.events].filter(e => !e.startsWith('(server)')) },
  };
}
