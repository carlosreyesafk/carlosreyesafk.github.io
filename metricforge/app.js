/* MetricForge — 100% client-side SaaS unit economics suite. No backend, no tracking. */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const num = (id) => { const v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
  const fmt$ = (v) => '$' + Math.round(v).toLocaleString('en-US');
  const fmtPct = (v, d = 1) => v.toFixed(d) + '%';
  const state = {};

  function setBadge(el, level, label) {
    el.className = 'r-badge ' + level; // level: ok | warn | bad
    el.textContent = label;
  }

  /* ---------- 1. customer churn ---------- */
  function calcChurn() {
    const start = num('c_start'), lost = num('c_lost'), added = num('c_new');
    const out = $('c_out'), badge = $('c_badge'), insight = $('c_insight');
    if (start <= 0) { out.textContent = '–'; badge.className = 'r-badge'; badge.textContent = ''; insight.textContent = ''; $('c_net').textContent = '–'; return; }
    const churn = (lost / start) * 100;
    out.textContent = fmtPct(churn);
    state.churn = churn;
    const net = added - lost;
    $('c_net').textContent = (net >= 0 ? '+' : '') + net + ' customers';
    if (churn < 5) { setBadge(badge, 'ok', 'Excellent'); insight.textContent = 'Below 5% monthly — strong retention. Keep doing what you\'re doing and invest in growth.'; }
    else if (churn <= 10) { setBadge(badge, 'warn', 'Typical'); insight.textContent = 'In the typical SMB SaaS band. Find which cohort churns most — first-30-day churn is usually an onboarding problem.'; }
    else { setBadge(badge, 'bad', 'Critical'); insight.textContent = 'Above 10% monthly churn will eat almost any growth rate. Fix retention before spending another dollar on acquisition.'; }
  }

  /* ---------- 2. revenue churn + NRR ---------- */
  function calcRev() {
    const start = num('r_start'), churned = num('r_churned'), contract = num('r_contract'), expand = num('r_expand');
    const out = $('r_out'), badge = $('r_badge'), insight = $('r_insight');
    if (start <= 0) { out.textContent = '–'; badge.className = 'r-badge'; badge.textContent = ''; insight.textContent = ''; $('r_nrr').textContent = '–'; return; }
    const revChurn = ((churned + contract) / start) * 100;
    const nrr = ((start + expand - churned - contract) / start) * 100;
    out.textContent = fmtPct(revChurn);
    state.revChurn = revChurn; state.nrr = nrr;
    $('r_nrr').textContent = fmtPct(nrr);
    if (nrr >= 110) { setBadge(badge, 'ok', 'Excellent'); insight.textContent = 'NRR ≥ 110%: your existing base grows on its own. This is the profile investors pay premiums for.'; }
    else if (nrr >= 100) { setBadge(badge, 'warn', 'Good'); insight.textContent = 'NRR ≥ 100%: expansion offsets churn. Push expansion revenue (upsells, seats) to reach 110%+.'; }
    else { setBadge(badge, 'bad', 'Shrinking'); insight.textContent = 'NRR < 100%: your revenue base shrinks even with zero new sales. Expansion and retention are the emergency.'; }
  }

  /* ---------- 3. LTV ---------- */
  function calcLTV() {
    const arpa = num('l_arpa'), margin = num('l_margin') / 100, churnPct = num('l_churn');
    const out = $('l_out'), badge = $('l_badge'), insight = $('l_insight');
    if (arpa <= 0 || churnPct <= 0) { out.textContent = '–'; badge.className = 'r-badge'; badge.textContent = ''; insight.textContent = ''; $('l_life').textContent = '–'; return; }
    const ltv = (arpa * margin) / (churnPct / 100);
    const life = 100 / churnPct;
    out.textContent = fmt$(ltv);
    state.ltv = ltv; state.arpa = arpa; state.margin = margin;
    $('l_life').textContent = life.toFixed(1);
    setBadge(badge, 'ok', 'Computed');
    insight.textContent = 'Each customer is worth ' + fmt$(ltv) + ' over an average lifetime of ' + life.toFixed(1) + ' months. Compare against CAC below.';
  }

  /* ---------- 4. CAC ---------- */
  function calcCAC() {
    const spend = num('k_spend'), n = num('k_new');
    const out = $('k_out');
    if (n <= 0) { out.textContent = '–'; return; }
    const cac = spend / n;
    out.textContent = fmt$(cac) + ' / customer';
    state.cac = cac;
    calcLtvCac(); calcPayback();
  }

  /* ---------- 5. LTV:CAC ---------- */
  function calcLtvCac() {
    const out = $('lc_out'), badge = $('lc_badge'), insight = $('lc_insight');
    if (!state.ltv || !state.cac) { out.textContent = '–'; badge.className = 'r-badge'; badge.textContent = ''; insight.textContent = ''; return; }
    const r = state.ltv / state.cac;
    out.textContent = r.toFixed(2) + '×';
    state.ltvCac = r;
    if (r >= 3) { setBadge(badge, 'ok', 'Healthy'); insight.textContent = '≥ 3×: unit economics work. You can afford to invest more aggressively in acquisition.'; }
    else if (r >= 1) { setBadge(badge, 'warn', 'Watch'); insight.textContent = '1–3×: thin. Either lower CAC (better channels, self-serve) or raise LTV (pricing, retention) before scaling spend.'; }
    else { setBadge(badge, 'bad', 'Upside down'); insight.textContent = '< 1×: you lose money on every customer acquired. Do not scale — fix pricing or acquisition first.'; }
  }

  /* ---------- 6. CAC payback ---------- */
  function calcPayback() {
    const out = $('p_out'), badge = $('p_badge'), insight = $('p_insight');
    if (!state.cac || !state.arpa || !state.margin) { out.textContent = '–'; badge.className = 'r-badge'; badge.textContent = ''; insight.textContent = ''; return; }
    const monthly = state.arpa * state.margin;
    if (monthly <= 0) { out.textContent = '–'; return; }
    const pb = state.cac / monthly;
    out.textContent = pb.toFixed(1) + ' months';
    state.payback = pb;
    if (pb <= 12) { setBadge(badge, 'ok', 'Good'); insight.textContent = 'Recovered within a year — fundable payback profile for SMB SaaS.'; }
    else if (pb <= 18) { setBadge(badge, 'warn', 'Acceptable'); insight.textContent = '12–18 months: acceptable for higher-ACV products, heavy for low-ACV. Annual plans shorten this fast.'; }
    else { setBadge(badge, 'bad', 'Dangerous'); insight.textContent = '> 18 months: capital-intensive growth. Raise prices, sell annual, or cut CAC before scaling.'; }
  }

  /* ---------- 7. Quick Ratio ---------- */
  function calcQuick() {
    const n = num('q_new'), e = num('q_exp'), c = num('q_chu'), k = num('q_con');
    const out = $('q_out'), badge = $('q_badge'), insight = $('q_insight');
    const denom = c + k;
    if (denom <= 0) { out.textContent = '–'; badge.className = 'r-badge'; badge.textContent = ''; insight.textContent = ''; return; }
    const q = (n + e) / denom;
    out.textContent = q.toFixed(2) + '×';
    state.quick = q;
    if (q >= 4) { setBadge(badge, 'ok', 'Excellent'); insight.textContent = '≥ 4×: growing 4× faster than you shrink. Elite efficiency.'; }
    else if (q >= 2) { setBadge(badge, 'warn', 'Healthy'); insight.textContent = '2–4×: healthy growth efficiency. Push toward 4× with expansion revenue.'; }
    else { setBadge(badge, 'bad', 'Weak'); insight.textContent = '< 2×: churn is eating your growth. Below 1× you are shrinking despite new sales.'; }
  }

  /* ---------- 8. Magic Number ---------- */
  function calcMagic() {
    const arr = num('m_arr'), spend = num('m_spend');
    const out = $('m_out'), badge = $('m_badge'), insight = $('m_insight');
    if (spend <= 0) { out.textContent = '–'; badge.className = 'r-badge'; badge.textContent = ''; insight.textContent = ''; return; }
    const m = arr / spend;
    out.textContent = m.toFixed(2);
    state.magic = m;
    if (m >= 1) { setBadge(badge, 'ok', 'Efficient'); insight.textContent = '≥ 1.0: every $1 of S&M returns $1+ of ARR. Invest more.'; }
    else if (m >= 0.5) { setBadge(badge, 'warn', 'Moderate'); insight.textContent = '0.5–1.0: moderate efficiency. Optimize channels before increasing spend.'; }
    else { setBadge(badge, 'bad', 'Inefficient'); insight.textContent = '< 0.5: inefficient growth engine. Fix go-to-market before spending more.'; }
  }

  /* ---------- 9. Rule of 40 ---------- */
  function calcRule40() {
    const g = num('f_growth'), m = num('f_margin');
    const out = $('f_out'), badge = $('f_badge'), insight = $('f_insight');
    const r = g + m;
    out.textContent = (r >= 0 ? '+' : '') + r.toFixed(0) + '%';
    state.rule40 = r;
    if (r >= 40) { setBadge(badge, 'ok', 'Healthy'); insight.textContent = '≥ 40%: the classic healthy-SaaS profile. Growth and profitability in balance.'; }
    else if (r >= 0) { setBadge(badge, 'warn', 'Acceptable'); insight.textContent = '0–40%: acceptable, especially at scale — but one side needs work.'; }
    else { setBadge(badge, 'bad', 'Unsustainable'); insight.textContent = '< 0%: shrinking while unprofitable. This is the red zone.'; }
  }

  /* ---------- 10. Runway ---------- */
  function calcRunway() {
    const cash = num('w_cash'), burn = num('w_burn');
    const out = $('w_out'), badge = $('w_badge'), insight = $('w_insight');
    if (burn <= 0) { out.textContent = '–'; badge.className = 'r-badge'; badge.textContent = ''; insight.textContent = ''; $('w_date').textContent = '–'; return; }
    const rw = cash / burn;
    out.textContent = rw.toFixed(1) + ' months';
    state.runway = rw;
    const d = new Date(); d.setMonth(d.getMonth() + Math.floor(rw));
    $('w_date').textContent = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (rw >= 18) { setBadge(badge, 'ok', 'Comfortable'); insight.textContent = '≥ 18 months: comfortable. Use the time to reach default-alive, not default-dead.'; }
    else if (rw >= 12) { setBadge(badge, 'warn', 'Fine'); insight.textContent = '12–18 months: standard. Start fundraising conversations around month 9–12 of runway left.'; }
    else if (rw >= 6) { setBadge(badge, 'bad', 'Tight'); insight.textContent = '< 12 months: raise or cut burn now. Fundraising takes 3–6 months.'; }
    else { setBadge(badge, 'bad', 'Critical'); insight.textContent = '< 6 months: critical. Cut burn this week and treat fundraising as the full-time job.'; }
  }

  /* ---------- simulator (PRO) ---------- */
  function runSimulator() {
    if (!isPro()) return;
    const startM = num('s_mrr'), g = num('s_growth') / 100, c = num('s_churn') / 100;
    const pts = [startM];
    let cum = 0;
    for (let i = 1; i <= 12; i++) {
      const prev = pts[i - 1];
      const next = prev * (1 + g - c);
      pts.push(next);
      cum += prev * g;
    }
    $('s_m12').textContent = fmt$(pts[12]);
    $('s_arr').textContent = fmt$(pts[12] * 12);
    $('s_cum').textContent = fmt$(cum);
    drawChart(pts);
    state.sim = pts;
  }

  function drawChart(pts) {
    const cv = $('simChart'), ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height, pad = 46;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...pts) * 1.08, min = Math.min(...pts, pts[0]) * 0.92;
    const X = (i) => pad + (i / 12) * (W - pad * 2);
    const Y = (v) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
    // grid
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = '12px system-ui'; ctx.lineWidth = 1;
    for (let gLine = 0; gLine <= 4; gLine++) {
      const v = min + ((max - min) / 4) * gLine, y = Y(v);
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
      ctx.fillText('$' + Math.round(v / 1000) + 'k', 4, y + 4);
    }
    // area
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(124,93,250,.45)'); grad.addColorStop(1, 'rgba(124,93,250,0)');
    ctx.beginPath(); ctx.moveTo(X(0), Y(pts[0]));
    pts.forEach((v, i) => ctx.lineTo(X(i), Y(v)));
    ctx.lineTo(X(12), H - pad); ctx.lineTo(X(0), H - pad); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    // line
    ctx.beginPath(); ctx.moveTo(X(0), Y(pts[0]));
    pts.forEach((v, i) => ctx.lineTo(X(i), Y(v)));
    ctx.strokeStyle = '#7c5dfa'; ctx.lineWidth = 3; ctx.stroke();
    // dots + labels
    ctx.fillStyle = '#fff';
    pts.forEach((v, i) => { ctx.beginPath(); ctx.arc(X(i), Y(v), 3.5, 0, 7); ctx.fill(); });
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    for (let i = 0; i <= 12; i += 3) ctx.fillText('M' + i, X(i) - 8, H - pad + 20);
  }

  /* ---------- scorecard (PRO) ---------- */
  const SCORECARD_ROWS = [
    ['Customer churn', () => state.churn == null ? null : [fmtPct(state.churn), state.churn < 5 ? ['ok', 'Excellent'] : state.churn <= 10 ? ['warn', 'Typical'] : ['bad', 'Critical']]],
    ['Revenue churn', () => state.revChurn == null ? null : [fmtPct(state.revChurn), state.revChurn < 5 ? ['ok', 'Low'] : state.revChurn <= 10 ? ['warn', 'Watch'] : ['bad', 'High']]],
    ['Net Revenue Retention', () => state.nrr == null ? null : [fmtPct(state.nrr), state.nrr >= 110 ? ['ok', 'Excellent'] : state.nrr >= 100 ? ['warn', 'Good'] : ['bad', 'Shrinking']]],
    ['LTV', () => state.ltv == null ? null : [fmt$(state.ltv), ['ok', '—']]],
    ['CAC', () => state.cac == null ? null : [fmt$(state.cac), ['ok', '—']]],
    ['LTV : CAC', () => state.ltvCac == null ? null : [state.ltvCac.toFixed(2) + '×', state.ltvCac >= 3 ? ['ok', 'Healthy'] : state.ltvCac >= 1 ? ['warn', 'Watch'] : ['bad', 'Upside down']]],
    ['CAC payback', () => state.payback == null ? null : [state.payback.toFixed(1) + ' mo', state.payback <= 12 ? ['ok', 'Good'] : state.payback <= 18 ? ['warn', 'Acceptable'] : ['bad', 'Dangerous']]],
    ['Quick Ratio', () => state.quick == null ? null : [state.quick.toFixed(2) + '×', state.quick >= 4 ? ['ok', 'Excellent'] : state.quick >= 2 ? ['warn', 'Healthy'] : ['bad', 'Weak']]],
    ['Magic Number', () => state.magic == null ? null : [state.magic.toFixed(2), state.magic >= 1 ? ['ok', 'Efficient'] : state.magic >= 0.5 ? ['warn', 'Moderate'] : ['bad', 'Inefficient']]],
    ['Rule of 40', () => state.rule40 == null ? null : [(state.rule40 >= 0 ? '+' : '') + state.rule40.toFixed(0) + '%', state.rule40 >= 40 ? ['ok', 'Healthy'] : state.rule40 >= 0 ? ['warn', 'Acceptable'] : ['bad', 'Unsustainable']]],
    ['Runway', () => state.runway == null ? null : [state.runway.toFixed(1) + ' mo', state.runway >= 18 ? ['ok', 'Comfortable'] : state.runway >= 12 ? ['warn', 'Fine'] : ['bad', 'Tight']]],
  ];

  function renderScorecard() {
    if (!isPro()) return;
    const tb = $('scoreRows'); tb.innerHTML = '';
    let ok = 0, warn = 0, bad = 0, n = 0;
    SCORECARD_ROWS.forEach(([name, fn]) => {
      const r = fn();
      const tr = document.createElement('tr');
      if (!r) { tr.innerHTML = '<td>' + name + '</td><td class="muted">—</td><td class="muted">enter data above</td>'; }
      else {
        n++; const [val, [lvl, label]] = r;
        if (lvl === 'ok') ok++; else if (lvl === 'warn') warn++; else bad++;
        tr.innerHTML = '<td>' + name + '</td><td><strong>' + val + '</strong></td><td><span class="r-badge ' + lvl + '">' + label + '</span></td>';
      }
      tb.appendChild(tr);
    });
    const v = $('scoreVerdict');
    if (!n) v.innerHTML = 'Fill in the calculators above — your scorecard builds itself.';
    else {
      const score = Math.round(((ok + warn * 0.5) / n) * 100);
      v.innerHTML = '<strong>Unit-economics health: ' + score + '/100</strong> — ' + ok + ' strong · ' + warn + ' to watch · ' + bad + ' critical. Generated ' + new Date().toLocaleDateString('en-US') + '.';
    }
  }

  /* ---------- PRO / licensing ---------- */
  // SHA-256 hashes of issued license codes (codes themselves are kept offline).
  // Codes are issued manually after payment verification.
  const LICENSE_HASHES = [[
    '18a15067d84fde4d726229a190e08ede7a4bab502ac4f8d6828bd63dca6496ee',
    'fbe8f203b732403d0cf452d61a4764af2e1e9779679915db9b40d1c16045eb7c',
    '8ddb38d8da5c5b74405fee365b670498b2885086ebed82541551cc58ee7f6e58',
    'a5e9f33ecc42a81725c8ed6d073eac7ed4b81a5db42b18d3ffc741924d7f3a7e',
    '2920123cd12f8487c168bb54bafcee7421e6d0844d1ee389122f75cef125afd2',
    'e55ffe1dbeb056fd5e29cb2e72fcfc2fa352d2c773fb3b4f664e6a4313d2d7ea',
    '72cce074924beb9ae789d925489f0eec8998b6a8c834bdcb1582ab411875b0aa',
    '35d368252bf3a72670fe03ccfe676d63cf9e2b2356326c75984ae95e00f50203',
    '7ca7c00d5fb93643ae5d587dfe442efcc18201e25afa0c3f1fa14596e973b43f',
    '632c7acf8a135df16ea17f040ee63e4d92e4467585449f22494b979e4e7f9c37',
    '81a008bb38e910cef1afec7bd04f200a64e176fa3b34afa239653c1b49ddae2c',
    'cbcb3038516044318863addab98660993c7dd4c1c0faa528d8e0b36a03946d87',
    '916062596f3c2f3a438126d77ee410c15e7050e3746690badd1586cf747e84f3',
    '08a4258a3fa241fbd342536e8f6c2bf79b0a6a1bfc5ca0d855dd355e87484137',
    'd8b7ddfeadffcdbb644a17f8cd1ecc71c5553858adbd6d8091984500fbdf89fd',
    '0c2610a61bbe01f47744155eccce7e2de2f9f175c9b5e56290d2940061646897',
    'daa381d2754b172ee61228f89396fc9ddfd55ef91d1cacafec6fe10583298391',
    '8e9c8c221ebb0b1bef1edd4876edd7bb3fce5ccb79568f5a39c4244b2536fe75',
    '7c28bc4c9c9369a3a622c3095cc7d8a5d436f67c96e64127afdd6f3b0543ac66',
    'c0778e42bf1f7289d1a6e3b7aaf0c8cb1cb259d01dcf01da4ddd4c5ee72b04f6',
    '0e24175169fc2096eec868ecfc1adc98d8a0273caeb80de9c70f20a0fe2c6bbc',
    '35f73788989d05fd02decb695ec224e05f232b70e77c05da845d51a6877bdeaf',
    '33cdca9a737fb2600026bbdee16866f3287dd34c43f78bab1829e2a8bca0e46a',
    'c22c168112cb0f6c76749117683620f0dbcf50049df5af3e994d5b19036e890f',
    'd851ae0b98fd314b84784bbfb50a92333c8c4d20320b434a835c9651d554e588',
    '05dffd251604789e824530afe83981c58f87dcbeef8726ba07ca283db1d6624b',
    '66129a8b5b9e3f4b6f4e0904fad07b01d0a94d6fec1a99235c760fe8d698e29a',
    '3db92a5b9b46f9043bb839f4cd48feec50203de897cb21abcfa0451fce43d5e0',
    '3441dd5d4a9c2a5eb8bc166bd5873693e3e94bf1c0613435eb3905b2f50a28d0',
    'e068fb7199adc30ba2e31f5076bdd4b4c68b1e9dfd5c4077c535669165a7859c',
    '04c6d0dc9a7d4be5741c697e51d7381d0171b759feb9673c7d827beb181f31cc',
    'd3782a44b2de60f42c2f51d9ce0a3fca052bc75747652658bdec212ff42f0dfe',
    'f99f4c510c672fdd1534e522b264a6d6d0fc1bcbecc31917ed9128abbdf0b1fc',
    '974ab723c97383c9d429165c7930d52bd08c00ac2bbd737561fb67261a23724c',
    '5b87ade9525640e1f55426ec791109cabd509535adf6b2f15edb0e3e7b17b09d',
    '9f08061eca7718f5b2bc3e9e094f9a4377cafdc822a715248d60669a6be5225f',
    'ecb620c7b3424566f8f639c9d0bb873e6dafc1dbe82bf4d7c2e8fd6a7d7ccacb',
    'a8b0182287e51dc4bfa690a51203a45809dc111aeed26e3118a0857e023fed0b',
    '4a662b0dbfe199e251a630e224857095e2f65f759c0ec26e236af088f6ae14bb',
    '13ab8b60056a79c1eee0f1a731b841900f7ba03de2a83ba42c51dd6bea1fe4ac',
    '77b20bc830198c315f2d7ff6cbbc7284670b6e0740b8e8c06d06c39684a1eedd',
    '954491e098b32d5d4b48375d4bb306b16e7b9500368bf1a3018ac290872b3514',
    '117571a24fcef1a5a5d2d42eaa5b2e2559d226fc06b084e8a48585b3ba205503',
    'a26b2958b45604eb48ada14ccb302796ebb24f54eead0097d892aeb1782faf0e',
    'a61fac227bb447c6cd6da831aa8f776f28b092513adbf6e2b397f525a73fc72e',
    'dea675e9950b66d7a5a2a8a3d1e5e48f58af6aabeaf76cc285d5cd085d7d9a5b',
    'f41fd0bd669621f3d34505dd00c0961e1cf166ed2cfc328a33ed34f182a5dfd3',
    '71b47f31bea808173c86934d27c4caeeeccfaa68f71ee5d566b505844fb3b167',
    'ab9b4ab87dadb9e0ee423d37805a9bbac76a4f3eba3070554f01e1a7a3e1f191',
    'f5dee8e0da6a227149e23cb190b5f64ca5e4bcde0ed697c0ea902a88c2a40dcc',
    '7cb587bb6f7b27232fb3630e0d89e82e687e7edf008dadd51ff871bfe6de4f57',
    'c2aa4767d2440a181d02bab5bd9705d61066d3ede346228cbe334aaff60ce134',
    'b504a1cada24759ffb0f89f97feabfae7ca934df8053cbc47dbb88a634e040cb',
    '95468aa059bc44ed9c36a3f01fa49299f198c6551f70c2773b4888a8ba9098fd',
    '281700fb309b58e5b544ab04e0e5b236adc1224ee7b62e33832162ed0e06ecf6',
    '517d832b621e7eda6f58ebec7de5176e0f02839ed770e15b2a9c6c1d5785a504',
    'c5c63eeb4a5910a4c1ee2ab8fc5c78211d12367bbd3d6ab478a0d87633af16e9',
    '7c01ad4ec3dda81231cee542fd4d42cd31d06b1de4be080290e8e6c5761b90e1',
    '161190b12ad09ae2de51e78897c86b04d483ff7c435fef080180e1209eec9f9f',
    '441980bf67022ad01f90bdb8727d6d3be345e47754930357d1d75a60a9b1f935'
  ]];

  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str.trim().toUpperCase()));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function isPro() { return localStorage.getItem('mf_pro') === '1'; }

  function applyProUI() {
    const pro = isPro();
    document.querySelectorAll('.pro-locked').forEach(el => el.classList.toggle('unlocked', pro));
    document.querySelectorAll('.lock-overlay').forEach(el => el.style.display = pro ? 'none' : 'flex');
    $('proState').textContent = pro ? 'PRO ✓ lifetime' : 'Free plan';
    $('proState').classList.toggle('is-pro', pro);
    $('proBtn').textContent = pro ? 'PRO ✓ active' : 'Go Pro — $19';
    if (pro) { runSimulator(); renderScorecard(); }
  }

  async function tryUnlock() {
    const input = $('licenseInput'), msg = $('licenseMsg');
    const code = input.value.trim().toUpperCase();
    if (!/^MF-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
      msg.textContent = 'That doesn\'t look like a license code (format: MF-XXXX-XXXX).';
      msg.className = 'lic-msg err'; return;
    }
    msg.textContent = 'Verifying…'; msg.className = 'lic-msg';
    const h = await sha256(code);
    if (LICENSE_HASHES.includes(h)) {
      localStorage.setItem('mf_pro', '1');
      msg.textContent = '✓ Pro unlocked — lifetime. Welcome aboard.';
      msg.className = 'lic-msg ok';
      applyProUI();
    } else {
      msg.textContent = 'Code not recognized. Double-check it, or email chachiafk@gmail.com with your receipt.';
      msg.className = 'lic-msg err';
    }
  }

  /* ---------- modal ---------- */
  function openPro() { $('proModal').classList.add('open'); }
  function closePro() { $('proModal').classList.remove('open'); }

  /* ---------- wiring ---------- */
  function recalc() {
    calcChurn(); calcRev(); calcLTV(); calcCAC(); calcQuick(); calcMagic(); calcRule40(); calcRunway();
    if (isPro()) { runSimulator(); renderScorecard(); }
  }

  document.addEventListener('input', (e) => { if (e.target.matches('input[type=number]')) recalc(); });
  document.addEventListener('DOMContentLoaded', () => {
    recalc(); applyProUI();
    $('licenseBtn').addEventListener('click', tryUnlock);
    $('licenseInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
    $('proBtn').addEventListener('click', () => { isPro() ? document.querySelector('#pro').scrollIntoView({ behavior: 'smooth' }) : openPro(); });
    document.querySelectorAll('[data-open-pro]').forEach(b => b.addEventListener('click', openPro));
    $('proClose').addEventListener('click', closePro);
    $('proModal').addEventListener('click', (e) => { if (e.target === $('proModal')) closePro(); });
    $('proGoPay').addEventListener('click', closePro);
    $('printBtn').addEventListener('click', () => window.print());
    if (location.hash === '#pro') setTimeout(openPro, 400);
  });
})();
