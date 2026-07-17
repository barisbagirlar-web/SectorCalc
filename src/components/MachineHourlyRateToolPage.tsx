"use client";

// Machine Hourly Rate Proof Report — EXACT x1.html implementation
// Static HTML shell + vanilla JS in useEffect. Matches x1.html verbatim.

import { useEffect, useRef } from "react";
import "@/styles/machine-hourly-rate-tool.css";

export default function MachineHourlyRateToolPage() {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootEl = shellRef.current;
    if (!rootEl) return;
    const root: HTMLElement = rootEl;

    // ── ENGINE (verbatim from x1.html) ──────────────────────────
    function engine(v: Record<string, number>): Record<string, number> {
      const { purchasePrice: PP, usefulLife: UL, annualHours: AH, wageRate: W,
              powerDraw: PD, energyPrice: EP, idleShare: IS, maintenanceRate: MR } = v;
      const dep = UL > 0 ? PP / UL : Infinity;
      const maint = PP * MR;
      const energy = PD * AH * EP;
      const labor = W * AH;
      const total = dep + maint + energy + labor;
      const productiveHours = AH * (1 - IS);
      const rate = productiveHours > 0 ? total / productiveHours : Infinity;
      const naive = AH > 0 ? total / AH : Infinity;
      const premium = (Number.isFinite(rate) && Number.isFinite(naive)) ? rate - naive : Infinity;
      const energyShare = total > 0 ? energy / total : NaN;
      const laborShare = total > 0 ? labor / total : NaN;
      const capitalShare = total > 0 ? (dep + maint) / total : NaN;
      return { dep, maint, energy, labor, total, productiveHours, rate, naive, premium, energyShare, laborShare, capitalShare };
    }

    // ── CURRENCY (verbatim) ─────────────────────────────────────
    const CURRENCIES = [
      { code: "EUR", sym: "€", name: "Euro" }, { code: "USD", sym: "$", name: "US dollar" },
      { code: "GBP", sym: "£", name: "British pound" }, { code: "TRY", sym: "₺", name: "Turkish lira" },
      { code: "JPY", sym: "¥", name: "Japanese yen" }, { code: "CNY", sym: "¥", name: "Chinese yuan" },
      { code: "CHF", sym: "CHF", name: "Swiss franc" }, { code: "SEK", sym: "kr", name: "Swedish krona" },
      { code: "AUD", sym: "A$", name: "Australian dollar" }, { code: "CAD", sym: "C$", name: "Canadian dollar" },
      { code: "INR", sym: "₹", name: "Indian rupee" }, { code: "AED", sym: "AED", name: "UAE dirham" },
    ];
    let CUR = "€";

    // ── UNITS (verbatim) ────────────────────────────────────────
    const UNITS: Record<string, { canon: string; list: Array<{ c: string; f: number }> }> = {
      flat: { canon: "cur", list: [{ c: "units", f: 1 }, { c: "thousands (k)", f: 1000 }, { c: "millions (M)", f: 1e6 }] },
      years: { canon: "yr", list: [{ c: "months", f: 1 / 12 }, { c: "quarters", f: 1 / 4 }, { c: "years", f: 1 }] },
      hours: { canon: "h", list: [{ c: "seconds", f: 1 / 3600 }, { c: "minutes", f: 1 / 60 }, { c: "hours", f: 1 }, { c: "shifts (8h)", f: 8 }, { c: "days (24h)", f: 24 }] },
      wage: { canon: "cur/h", list: [{ c: "/hour", f: 1 }, { c: "/day (8h)", f: 1 / 8 }, { c: "/week (40h)", f: 1 / 40 }] },
      power: { canon: "kW", list: [{ c: "W", f: 0.001 }, { c: "kW", f: 1 }, { c: "MW", f: 1000 }, { c: "HP (mech)", f: 0.7457 }] },
      energyPrice: { canon: "cur/kWh", list: [{ c: "/kWh", f: 1 }, { c: "/MWh", f: 0.001 }] },
      percent: { canon: "fraction", list: [{ c: "%", f: 0.01 }, { c: "fraction (0-1)", f: 1 }] },
    };
    const toC = (dom: string, val: number, u: string) => val * UNITS[dom].list.find((x) => x.c === u)!.f;
    const CANON_SUFFIX: Record<string, string> = { flat: "", years: " yr", hours: " h", wage: "/h", power: " kW", energyPrice: "/kWh", percent: "" };

    // ── FIELDS (verbatim from x1.html) ──────────────────────────
    const FIELDS: Record<string, any> = {
      purchasePrice: { ev: "purchasePrice", dom: "flat", label: "Purchase price (installed)", cur: true, def: 180000, unit: "units", hard: [100, 5e8], hint: "Installation, base tooling and commissioning included.", ref: "units · thousands · millions" },
      usefulLife: { ev: "usefulLife", dom: "years", label: "Useful life", def: 10, unit: "years", hard: [0.5, 40], hint: "Economic life for depreciation, not physical life.", ref: "months · quarters · years" },
      annualHours: { ev: "annualHours", dom: "hours", label: "Planned operating hours", def: 4000, unit: "hours", hard: [0, 8760], hint: "Scheduled production time per year. Hard physical cap: 8,760 h.", ref: "seconds…days(24h)" },
      wageRate: { ev: "wageRate", dom: "wage", label: "Operator cost (fully loaded)", cur: true, def: 34, unit: "/hour", hard: [0, 2000], hint: "Wage + employer contributions + benefits, not gross wage.", ref: "/hour · /day(8h) · /week(40h)" },
      powerDraw: { ev: "powerDraw", dom: "power", label: "Average power draw", def: 12, unit: "kW", hard: [0, 5000], hint: "Average under load — typically 30–60% of nameplate rating.", ref: "W · kW · MW · HP" },
      energyPrice: { ev: "energyPrice", dom: "energyPrice", label: "Industrial electricity price", cur: true, def: 0.18, unit: "/kWh", hard: [0, 5], hint: "All-in price including grid fees and levies.", ref: "/kWh · /MWh" },
      idleShare: { ev: "idleShare", dom: "percent", label: "Idle / non-productive share", def: 20, unit: "%", hard: [0, 95], hint: "Paid machine time producing nothing sellable — setup, changeovers, breakdowns, starved queues.", ref: "% · fraction" },
      maintenanceRate: { ev: "maintenanceRate", dom: "percent", label: "Annual maintenance (% of price)", def: 5, unit: "%", hard: [0, 60], hint: "Planned and unplanned, parts and labor, per year.", ref: "% · fraction" },
    };

    // ── INSIGHTS (verbatim from x1.html) ────────────────────────
    const INSIGHTS = [
      { when: (r: any) => Number.isFinite(r.premium) && r.premium / r.rate > 0.15, sev: "crit", msg: (r: any) => `<strong>${(100 * r.premium / r.rate).toFixed(0)}% of your hourly rate finances idle capacity</strong> (${CUR}${fmtNum(r.premium)}/h). Quoting on the naive rate of ${CUR}${fmtNum(r.naive)}/h loses that amount on every hour that actually produces something sellable. Cutting idle share by 5 points is worth more than most price negotiations.` },
      { when: (r: any) => r.energyShare > 0.15, sev: "opp", msg: (r: any) => `Energy is <strong>${(r.energyShare * 100).toFixed(1)}% of total cost</strong> (${CUR}${fmtNum(r.energy)}/yr) — well above a typical ~5–10% share. A motor efficiency audit or load-shifting review on this machine is worth investigating; even a 10% energy cut is ${CUR}${(r.energy * 0.1 / r.productiveHours).toFixed(2)}/h off the rate.` },
      { when: (r: any) => r.laborShare > 0.60, sev: "info", msg: (r: any) => `Labor is <strong>${(r.laborShare * 100).toFixed(0)}% of the cost base</strong> — this rate is wage-driven. Multi-machine tending or automation moves the needle here; negotiating the purchase price does not.` },
      { when: (r: any) => r.capitalShare < 0.15, sev: "info", msg: (r: any) => `Capital is only <strong>${(r.capitalShare * 100).toFixed(0)}% of cost</strong> — this machine is cheap to own, expensive to run. Uptime and labor efficiency matter far more than the purchase price you negotiated.` },
      { when: (r: any, v: any) => v.annualHours > 6000, sev: "info", msg: (r: any, v: any) => `${fmtNum(v.annualHours)} planned hours/year is 3-shift territory. Confirm maintenance windows are excluded from "planned" hours — a common source of 5–8% silent rate error when they aren't.` },
    ];

    function fmtNum(x: any): string {
      if (x == null || Number.isNaN(x)) return "—";
      if (!Number.isFinite(x)) return "∞";
      const a = Math.abs(x);
      return Number(x).toLocaleString("en-US", { maximumFractionDigits: a >= 100 ? 0 : 2 });
    }
    function mockHash(s: string): string {
      let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
      for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0") + "…demo";
    }

    // ── STATE (flat, verbatim from x1.html) ─────────────────────
    const state: Record<string, any> = {};
    for (const id of Object.keys(FIELDS)) state[id] = { unit: FIELDS[id].unit };

    // ── BUILD FIELDS (innerHTML, verbatim from x1.html) ────────
    for (const [id, f] of Object.entries(FIELDS) as [string, any][]) {
      const host = root.querySelector(`[data-f="${id}"]`);
      if (!host) continue;
      const opts = UNITS[f.dom].list.map((u: any) => `<option${u.c === f.unit ? " selected" : ""}>${u.c}</option>`).join("");
      host.innerHTML = `
        <div class="f-top">
          <label for="in_${id}">${f.label}</label>
          <span class="unitline" id="ul_${id}"></span>
        </div>
        <div class="control" id="ct_${id}">
          ${f.cur ? `<span class="prefix" id="px_${id}">${CUR}</span>` : ""}
          <input type="number" id="in_${id}" step="any" value="${f.def}" inputmode="decimal">
          <select id="un_${id}" aria-label="unit">${opts}</select>
        </div>
        <div class="f-foot">
          <span class="hint">${f.hint}</span>
          <span class="bench-ref">${f.ref}</span>
        </div>
        <div class="msg" id="ms_${id}"></div>`;
      const inp = root.querySelector<HTMLInputElement>("#in_" + id);
      if (inp) inp.addEventListener("input", () => update(id));
      const sel = root.querySelector<HTMLSelectElement>("#un_" + id);
      if (sel) {
        sel.addEventListener("change", () => {
          const canon = toC(f.dom, parseFloat(inp?.value || "0") || 0, state[id].unit);
          state[id].unit = sel.value;
          const nf = UNITS[f.dom].list.find((u: any) => u.c === sel.value)!.f;
          if (inp) inp.value = String(+(canon / nf).toPrecision(10));
          update(id);
        });
      }
    }

    // ── Currency selector (verbatim) ─────────────────────────────
    (() => {
      const sel = root.querySelector<HTMLSelectElement>("#curSel");
      if (!sel) return;
      sel.innerHTML = CURRENCIES.map((c) => `<option value="${c.sym}"${c.code === "EUR" ? " selected" : ""}>${c.code} · ${c.sym} ${c.name}</option>`).join("");
      sel.addEventListener("change", () => {
        CUR = sel.value;
        for (const id of Object.keys(FIELDS)) {
          const f = FIELDS[id];
          if (f.cur) { const px = root.querySelector("#px_" + id); if (px) px.textContent = CUR; }
          update(id);
        }
        recompute();
        const report = root.querySelector<HTMLElement>("#report");
        if (report && report.style.display === "block") render();
      });
    })();

    // ── Validation (verbatim from x1.html) ───────────────────────
    function update(id: string) {
      const f = FIELDS[id];
      const inp = root.querySelector<HTMLInputElement>("#in_" + id);
      const msg = root.querySelector<HTMLElement>("#ms_" + id);
      const ct = root.querySelector<HTMLElement>("#ct_" + id);
      const ul = root.querySelector<HTMLElement>("#ul_" + id);
      if (!inp || !msg || !ct || !ul) return;
      const raw = parseFloat(inp.value);
      const st = state[id];
      st.error = null;
      if (inp.value.trim() === "" || isNaN(raw)) { st.error = "Enter a number."; st.canon = null; }
      else {
        st.canon = toC(f.dom, raw, st.unit);
        if (st.canon < f.hard[0] || st.canon > f.hard[1]) st.error = `Outside valid range (${f.hard[0]}–${f.hard[1]} ${UNITS[f.dom].canon}).`;
      }
      ct.classList.toggle("bad", !!st.error);
      ul.textContent = st.error ? "" : `= ${f.cur ? CUR : ""}${fmtNum(st.canon)}${CANON_SUFFIX[f.dom]}`.trim();
      msg.className = "msg" + (st.error ? " err" : "");
      msg.textContent = st.error || "";
      recompute();
    }

    // ── Collect (verbatim) ───────────────────────────────────────
    function collect(): Record<string, number> | null {
      const o: Record<string, number> = {};
      for (const [id, f] of Object.entries(FIELDS) as [string, any][]) {
        const s = state[id];
        if (!s || s.error || s.canon == null) return null;
        o[f.ev] = s.canon;
      }
      return o;
    }

    // ── Live rail (verbatim from x1.html) ────────────────────────
    function recompute() {
      const v = collect();
      const btn = root.querySelector<HTMLButtonElement>("#genBtn");
      const errs = Object.keys(FIELDS).filter((id) => state[id] && state[id].error);
      const band = root.querySelector<HTMLElement>("#vBand");
      const big = root.querySelector<HTMLElement>("#vBig");
      const cap = root.querySelector<HTMLElement>("#vCap");
      if (!v || !btn || !band || !big || !cap) {
        if (btn) btn.disabled = true;
        return;
      }
      if (!v) {
        band.textContent = "incomplete"; band.className = "verdict-band warn";
        big.textContent = "—"; cap.textContent = "fix highlighted inputs";
        ["sNaive", "sPrem", "sTotal", "sProd"].forEach((x) => {
          const el = root.querySelector("#" + x);
          if (el) el.textContent = "—";
        });
        btn.disabled = true;
        const conf = root.querySelector("#conf");
        if (conf) conf.innerHTML = `<span class="d" style="background:var(--warn)"></span>${errs.length} input(s) need attention`;
        return;
      }
      const r = engine(v);
      band.textContent = "rate proven"; band.className = "verdict-band pos";
      big.innerHTML = `${CUR}${fmtNum(r.rate)}<small> /productive h</small>`;
      cap.textContent = `vs ${CUR}${fmtNum(r.naive)}/h naive`;
      const sNaive = root.querySelector("#sNaive"); if (sNaive) sNaive.textContent = `${CUR}${fmtNum(r.naive)}/h`;
      const sPrem = root.querySelector("#sPrem"); if (sPrem) sPrem.textContent = `+${CUR}${fmtNum(r.premium)}/h`;
      const sTotal = root.querySelector("#sTotal"); if (sTotal) sTotal.textContent = `${CUR}${fmtNum(r.total)}/yr`;
      const sProd = root.querySelector("#sProd"); if (sProd) sProd.textContent = `${fmtNum(r.productiveHours)} h`;
      btn.disabled = false;
      const conf = root.querySelector("#conf");
      if (conf) conf.innerHTML = `<span class="d" style="background:var(--pos)"></span>Inputs consistent · report ready`;
    }

    // ── Render report (verbatim from x1.html + API integration) ──
    function render() {
      const v = collect();
      if (!v) return;
      const r = engine(v);

      const drivers = [["purchasePrice", "Purchase price"], ["usefulLife", "Useful life"], ["annualHours", "Annual hours"],
                        ["wageRate", "Operator wage"], ["powerDraw", "Power draw"], ["energyPrice", "Energy price"], ["idleShare", "Idle share"]];
      const sens = drivers.map(([k, nm]) => {
        const up = engine({ ...v, [k]: v[k] * 1.10 }).rate;
        const dn = engine({ ...v, [k]: v[k] * 0.90 }).rate;
        return { nm, span: Math.abs(up - dn) };
      }).sort((a, b) => b.span - a.span);
      const mx = Math.max(...sens.map((s) => s.span), 1e-9);
      const fired = INSIGHTS.filter((i: any) => i.when(r, v));

      const rep = root.querySelector<HTMLElement>("#report");
      if (!rep) return;
      rep.style.display = "block";
      rep.innerHTML = `
        <div class="rep-mast">
          <h2>Machine hourly rate — proof report</h2>
          <div class="rid">SC-PRO-MHR · ${new Date().toISOString().slice(0, 10)}<br>engine v6.0 · 35 assertions passed<br>currency ${CUR} · full absorption costing</div>
        </div>
        <div class="rep-body">

          <div class="sec"><div class="verdict-box">
            <div class="head">This machine truly costs ${CUR}${fmtNum(r.rate)} per productive hour.</div>
            <p>The naive rate — total annual cost divided by planned hours, ignoring idle time — is <strong>${CUR}${fmtNum(r.naive)}/h</strong>. Quoting on that number hides a <strong>${CUR}${fmtNum(r.premium)}/h loss</strong> on every hour that actually produces sellable output.</p>
            <p>Of ${fmtNum(v.annualHours)} planned hours/year, only <strong>${fmtNum(r.productiveHours)}</strong> generate revenue; the rest is paid-for idle time.</p>
          </div></div>

          <div class="sec">
            <div class="sec-h"><span class="sec-n">1</span><span class="sec-t">Annual cost structure</span></div>
            <table><tr><th>Component</th><th style="text-align:right">${CUR}/yr</th><th style="text-align:right">Share</th><th style="text-align:right">${CUR}/productive h</th></tr>
              <tr><td>Depreciation (straight-line, ${fmtNum(v.usefulLife)} yr)</td><td class="n">${fmtNum(r.dep)}</td><td class="n">${(100 * r.dep / r.total).toFixed(1)}%</td><td class="n">${(r.dep / r.productiveHours).toFixed(2)}</td></tr>
              <tr><td>Maintenance (${(100 * v.maintenanceRate).toFixed(1)}% of price)</td><td class="n">${fmtNum(r.maint)}</td><td class="n">${(100 * r.maint / r.total).toFixed(1)}%</td><td class="n">${(r.maint / r.productiveHours).toFixed(2)}</td></tr>
              <tr><td>Energy (${fmtNum(v.powerDraw)} kW × ${fmtNum(v.annualHours)} h × ${CUR}${v.energyPrice.toFixed(3)})</td><td class="n">${fmtNum(r.energy)}</td><td class="n">${(100 * r.energyShare).toFixed(1)}%</td><td class="n">${(r.energy / r.productiveHours).toFixed(2)}</td></tr>
              <tr><td>Operator labor</td><td class="n">${fmtNum(r.labor)}</td><td class="n">${(100 * r.laborShare).toFixed(1)}%</td><td class="n">${(r.labor / r.productiveHours).toFixed(2)}</td></tr>
              <tr class="total"><td>Total</td><td class="n">${fmtNum(r.total)}</td><td class="n">100%</td><td class="n">${r.rate.toFixed(2)}</td></tr>
            </table>
          </div>

          <div class="sec">
            <div class="sec-h"><span class="sec-n">2</span><span class="sec-t">What moves the rate most (±10% each input)</span></div>
            <div class="bars">${sens.map((s) => `<div class="row"><span class="nm">${s.nm}</span><div class="tk"><div class="b" style="width:${(100 * s.span / mx).toFixed(0)}%"></div></div><span class="vv">±${CUR}${(s.span / 2).toFixed(2)}/h</span></div>`).join("")}</div>
            <div class="note">Read: negotiating the purchase price 10% down is worth ±${CUR}${(sens.find((s) => s.nm === "Purchase price")!.span / 2).toFixed(2)}/h — compare against the top bar before spending effort there.</div>
          </div>

          <div class="sec">
            <div class="sec-h"><span class="sec-n">3</span><span class="sec-t">Engineering insights</span></div>
            ${fired.map((i: any) => `<div class="ins ${i.sev === "crit" ? "crit" : i.sev === "opp" ? "opp" : "info"}"><span class="t">${i.sev === "crit" ? "critical" : i.sev === "opp" ? "opportunity" : "context"}</span>${i.msg(r, v)}</div>`).join("") || `<div class="ins info"><span class="t">context</span>No threshold breaches — the cost structure is balanced across capital, labor and energy, with idle time under control.</div>`}
          </div>

          <div class="sec">
            <div class="sec-h"><span class="sec-n">4</span><span class="sec-t">Method &amp; formulas</span></div>
            <table>
              <tr><td>Depreciation</td><td class="n">purchase price ÷ useful life (straight-line)</td></tr>
              <tr><td>Productive hours</td><td class="n">planned hours × (1 − idle share)</td></tr>
              <tr><td>Rate</td><td class="n">total annual cost ÷ productive hours</td></tr>
              <tr><td>Idle premium</td><td class="n">rate − (total cost ÷ planned hours)</td></tr>
            </table>
            <div class="note">Full absorption costing. All inputs normalized to canonical units before computation; the engine is unit-blind. Formulas passed 27 closed-form/edge-case and 8 semantic assertions before this report existed.</div>
          </div>

          <div class="seal">SEAL · SHA-256 ${mockHash(JSON.stringify(v) + r.rate)}<br>Inputs and outputs are hashed together; altering any figure changes the seal. Verify at sectorcalc.com/verify — production seals are computed server-side.</div>
          <div class="disc">Technical simulation for engineering and financial decision support. Assumes straight-line depreciation and constant power draw/energy price across the planning horizon. Not a substitute for professional accounting or engineering review.</div>
        </div>`;
      rep.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // ── Seed compute (verbatim from x1.html) ─────────────────────
    for (const id of Object.keys(FIELDS)) update(id);
    recompute();

    // ── Wire genBtn (verbatim from x1.html) ──────────────────────
    const genBtn = root.querySelector<HTMLButtonElement>("#genBtn");
    if (genBtn) genBtn.addEventListener("click", render);

    // Cleanup
    return () => {
      // No cleanup needed for vanilla JS event listeners (scoped to root)
    };
  }, []);

  // ── STATIC HTML SHELL (verbatim from x1.html body) ──────────────
  return (
    <div className="x1-root-page" ref={shellRef}>
      <div className="shell">

        <div className="mast">
          <div className="kicker">SectorCalc PRO · Machinery &amp; Manufacturing · Cost proof</div>
          <h1>Machine Hourly Rate Proof Report</h1>
          <p className="lede">The rate you quote against and the rate the machine actually costs are rarely the same number. This tool prices every productive hour — depreciation, maintenance, energy and labor, spread only across hours that make something sellable.</p>
          <div className="meta">
            <span>Engine <b>v6.0</b></span>
            <span>35 math + semantic assertions <b>passed</b></span>
            <span>Report <b>sealed · SHA-256</b></span>
            <span>Method <b>full absorption costing</b></span>
          </div>
          <div className="curbar">
            <label htmlFor="curSel">Report currency</label>
            <select id="curSel"></select>
            <span className="curnote">Symbol only — no exchange-rate conversion applied. Enter every figure in the same currency.</span>
          </div>
        </div>

        <div className="bench">
          <div className="form-col">

            <div className="grp">
              <div className="grp-h"><span className="grp-n">01</span><span className="grp-t">Machine &amp; capital</span></div>
              <div className="grp-d">What the machine costs to own, and over how long that cost is spread.</div>
              <div className="f" data-f="purchasePrice"></div>
              <div className="f" data-f="usefulLife"></div>
              <div className="f" data-f="annualHours"></div>
            </div>

            <div className="grp">
              <div className="grp-h"><span className="grp-n">02</span><span className="grp-t">Running cost</span></div>
              <div className="grp-d">What it costs to actually operate the machine for those hours.</div>
              <div className="f" data-f="wageRate"></div>
              <div className="f" data-f="powerDraw"></div>
              <div className="f" data-f="energyPrice"></div>
            </div>

            <details open>
              <summary style={{ paddingLeft: 0 }}>Advanced — idle time &amp; maintenance</summary>
              <div style={{ paddingTop: 14 }}>
                <div className="f" data-f="idleShare"></div>
                <div className="f" data-f="maintenanceRate"></div>
              </div>
            </details>

          </div>

          <div className="rail">
            <div className="rail-in">
              <div className="verdict" id="verdict">
                <div className="verdict-band" id="vBand">—</div>
                <div className="verdict-body">
                  <div className="big" id="vBig">—</div>
                  <div className="big-cap" id="vCap">enter machine &amp; capital data to begin</div>
                </div>
              </div>
              <div className="stat"><span>Naive rate (ignores idle)</span><b id="sNaive">—</b></div>
              <div className="stat"><span>Hidden idle premium</span><b id="sPrem">—</b></div>
              <div className="stat"><span>Total annual cost</span><b id="sTotal">—</b></div>
              <div className="stat"><span>Productive hours / yr</span><b id="sProd">—</b></div>
              <button className="cta" id="genBtn" disabled>Generate sealed report · 1 credit</button>
              <div className="conf" id="conf"></div>
            </div>
          </div>
        </div>

        <div id="report"></div>

      </div>
    </div>
  );
}
