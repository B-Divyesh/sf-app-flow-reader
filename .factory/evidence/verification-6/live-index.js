(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const h of i.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&n(h)}).observe(document,{childList:!0,subtree:!0});function o(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=o(s);fetch(s.href,i)}})();function $(t,e,o){return{...t,updatedAt:new Date().toISOString(),steps:t.steps.map(n=>n.id===e?{...n,note:w(o,280)||void 0}:n)}}function R(t,e){return{...t,updatedAt:new Date().toISOString(),steps:t.steps.filter(o=>o.id!==e)}}function w(t,e=120){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function E(t){const e=[`# ${m(t.title)}`,"",`${t.steps.length}-step browser route.`,""];return t.steps.forEach((o,n)=>{e.push(`${n+1}. **${A(o.kind)}:** ${m(o.label)}`),o.url&&e.push(`   - Page: ${o.url}`),o.note&&e.push(`   - Note: ${m(o.note)}`)}),e.push("","_Created with App Flow Reader._",""),e.join(`
`)}function F(t){return`${JSON.stringify(t,null,2)}
`}function b(t,e){return`${w(t.title,70).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"app-route"}.${e}`}function m(t){return t.replace(/([\\`*_[\]<>#])/g,"\\$1")}function A(t){return{start:"Start",click:"Find",navigate:"Page change",note:"Note"}[t]}const k={id:"demo-expense-route",title:"Submit a monthly expense report",createdAt:"2026-08-28T09:15:00.000Z",updatedAt:"2026-08-28T09:18:00.000Z",steps:[{id:"demo-1",kind:"start",label:"Open Expenses from the main menu",url:"https://ledger.example/home",at:"2026-08-28T09:15:00.000Z",note:"The menu is on the left edge."},{id:"demo-2",kind:"click",label:"Choose New report",url:"https://ledger.example/expenses",at:"2026-08-28T09:15:24.000Z"},{id:"demo-3",kind:"click",label:"Select Monthly expenses",url:"https://ledger.example/expenses/new",at:"2026-08-28T09:16:31.000Z",note:"This is the second option under Report type."},{id:"demo-4",kind:"click",label:"Choose Review report",url:"https://ledger.example/expenses/new",at:"2026-08-28T09:17:42.000Z"},{id:"demo-5",kind:"navigate",label:"Choose Send to manager",url:"https://ledger.example/expenses/review",at:"2026-08-28T09:18:00.000Z",note:"A confirmation appears after sending."}]},T=document.querySelector("#app"),x=document.querySelector("#route-status");let a=structuredClone(k),u=null,r=0,f=null;const S="app-flow-reader:returned-license";j();p(!1);Z();addEventListener("popstate",()=>p(!0));document.addEventListener("click",t=>{const e=t.target instanceof Element?t.target.closest("a[data-route]"):null;!e||e.origin!==location.origin||(t.preventDefault(),history.pushState({},"",`${e.pathname}${e.search}${e.hash}`),p(!0))});function p(t){const e=U();if(f==="/demo"&&e!=="/demo"&&v(),e==="/demo"&&f!=="/demo"&&v(),f=e,B(e),T.innerHTML=`${L(e)}${e==="/"?q():e==="/demo"?P():e==="/privacy"?N():e==="/terms"?C():M()}${O()}`,document.querySelector("main")?.setAttribute("tabindex","-1"),D(),e==="/demo"&&I(),t){const o=document.querySelector("h1");o?.setAttribute("tabindex","-1"),o?.focus(),x.textContent=`${o?.textContent??"Page"} loaded`,scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"})}}function L(t){return`<header class="site-header">
    <a class="wordmark" href="/" data-route aria-label="App Flow Reader home">
      <svg aria-hidden="true" width="34" height="26" viewBox="0 0 34 26"><path d="M4 5h11l5 8h10M4 21h11l5-8"/><circle cx="4" cy="5" r="3"/><circle cx="4" cy="21" r="3"/><circle cx="30" cy="13" r="3"/></svg>
      <span>App Flow Reader</span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Open navigation</span><span></span><span></span></button>
    <nav id="site-nav" aria-label="Main navigation">
      <a href="/?demo=1" data-route ${t==="/demo"?'aria-current="page"':""}>Demo</a>
      <a href="/#how-it-works">How it works</a>
      <a href="/privacy" data-route ${t==="/privacy"?'aria-current="page"':""}>Privacy</a>
      <a class="nav-download" href="/downloads/app-flow-reader-chrome.zip" download>Download</a>
    </nav>
  </header>`}function q(){return`<main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="kicker">Browser extension for progressive low vision</p>
        <h1 id="hero-title">Follow saved routes through dense workplace apps</h1>
        <p class="lede">For people with progressive low vision who need one reliable path through dense workplace apps.</p>
        <div class="hero-actions">
          <a class="button primary" href="/?demo=1" data-route>Try it with sample data</a>
          <span>Follow a five-step expense route.</span>
        </div>
        <ul class="plain-facts" aria-label="Product facts">
          <li><strong>Private</strong><span>Routes stay on this device.</span></li>
          <li><strong>Offline</strong><span>The sample reader works after its first visit.</span></li>
          <li><strong>Free</strong><span>Reader and exports are free; covers cost $12 once.</span></li>
        </ul>
      </div>
      <div class="hero-map" aria-label="Illustration of a five-step expense route">
        <div class="paper-tab">ROUTE 05</div>
        <ol>
          <li><span>01</span><p>Open Expenses</p></li>
          <li><span>02</span><p>New report</p></li>
          <li><span>03</span><p>Monthly expenses</p></li>
          <li><span>04</span><p>Review report</p></li>
          <li><span>05</span><p>Send to manager</p></li>
        </ol>
      </div>
    </section>

    <section class="product-preview" aria-labelledby="preview-title">
      <div class="section-label"><span>01</span><p>Live preview</p></div>
      <div class="preview-copy"><h2 id="preview-title">Hear the current step and find its control</h2><p>The reader announces one instruction, outlines the matching page control, and waits for you.</p></div>
      <div class="browser-frame" aria-label="Example extension view">
        <div class="browser-bar"><span></span><span></span><span></span><p>northstar.example/team</p></div>
        <div class="mini-flow">
          <p class="eyebrow">Current route</p><h3>Submit monthly expenses</h3>
          <ol><li><b>1</b><span>Open Expenses<small>Start</small></span></li><li><b>2</b><span>Choose New report<small>Find</small></span></li><li><b>3</b><span>Select Monthly expenses<small>Find</small></span></li></ol>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="how" aria-labelledby="how-title">
      <div class="section-label"><span>02</span><p>How it works</p></div>
      <h2 id="how-title">Record once, then follow at your pace</h2>
      <ol class="how-list">
        <li><span>1</span><div><h3>Save a route</h3><p>Name the task, then record between three and ten steps.</p></div></li>
        <li><span>2</span><div><h3>Choose the route</h3><p>Your named routes stay together in the extension.</p></div></li>
        <li><span>3</span><div><h3>Follow each step</h3><p>Use large Back and Next controls while the page target stays outlined.</p></div></li>
      </ol>
    </section>

    <section class="boundaries" aria-labelledby="boundaries-title">
      <div><p class="kicker">Clear boundaries</p><h2 id="boundaries-title">It reads the route, not your private fields</h2></div>
      <ul><li>Password controls are ignored completely.</li><li>No screenshots or typed field values are stored.</li><li>Browser settings pages cannot be read.</li></ul>
    </section>

    <section class="supporter" aria-labelledby="supporter-title">
      <p class="kicker">Optional supporter license</p>
      <h2 id="supporter-title">Add notebook cover styles for $12 once</h2>
      <p>The route reader, exports, and every accessibility feature remain free. A supporter license adds three decorative cover styles in the extension.</p>
      <p>After checkout, an installed extension restores the returned token. You can also paste it into Supporter styles.</p>
      <a class="button secondary" data-supporter-checkout href="https://api.sociobot.in/api/v1/products/app-flow-reader/checkout">Buy supporter license (opens secure checkout)</a>
      ${Y()}
    </section>

    <section class="install" aria-labelledby="install-title">
      <p class="kicker">Use in Chrome, Edge, Brave, and similar browsers</p>
      <h2 id="install-title">Keep the route reader in your toolbar</h2>
      <p>Download the package, unzip it, then load the folder from the browser extensions page.</p>
      <a class="button primary" href="/downloads/app-flow-reader-chrome.zip" download>Download extension</a>
      <details><summary>Install from the downloaded folder</summary><ol><li>Open your browser’s extensions page.</li><li>Turn on the page’s <strong>Developer mode</strong> setting.</li><li>Choose <strong>Load unpacked</strong>, then choose the unzipped folder.</li></ol></details>
    </section>
  </main>`}function P(){const t=a.steps.map((e,o)=>`<li class="demo-step ${o===r?"current":""}" data-step-id="${e.id}" ${o===r?'aria-current="step"':""}>
    <span class="demo-number">${String(o+1).padStart(2,"0")}</span>
    <div class="demo-step-copy"><span class="step-kind">${e.kind==="navigate"?"Page change":e.kind==="start"?"Start":"Click"}</span><h2>${l(e.label)}</h2><p class="step-url">${l(new URL(e.url).pathname+new URL(e.url).search)}</p>${e.note?`<p class="note">${l(e.note)}</p>`:""}</div>
    <div class="step-actions"><button class="icon-button edit-note" type="button" aria-label="Edit note for ${l(e.label)}">Edit note</button><button class="icon-button remove-step" type="button" aria-label="Remove ${l(e.label)}">Remove</button></div>
  </li>`).join("");return`<div class="demo-banner" role="status"><strong>Demo</strong><span>Sample data. Nothing is saved.</span><button id="reset-demo" type="button">Reset demo</button><a class="start-real" href="/#install-title" aria-describedby="start-real-help">Start for real</a><span id="start-real-help" class="sr-only">Discard sample data and go to the extension download instructions.</span></div>
  <main id="main" class="demo-main">
    <header class="demo-heading"><div><p class="kicker">Sample route</p><h1>Follow the monthly expense route</h1><p>Use Back and Next to hear one step at a time. The current step has a thick outline.</p></div><div class="demo-tools"><button id="export-markdown" class="button primary" type="button">Export Markdown</button><button id="export-json" class="button secondary" type="button">Export JSON</button></div></header>
    <section class="demo-reader" aria-labelledby="reader-step"><p id="reader-position">Step ${r+1} of ${a.steps.length}</p><h2 id="reader-step">${l(a.steps[r]?.label??"Route complete")}</h2><p>${l(a.steps[r]?.note??"Complete this action, then choose Next.")}</p><div><button id="demo-back" type="button" ${r===0?"disabled":""}>Back</button><button id="demo-next" class="primary" type="button" ${r>=a.steps.length-1?"disabled":""}>Next</button></div></section>
    <section class="flow-sheet" aria-label="Monthly expense route"><div class="sheet-heading"><div><span>ROUTE / 05</span><h2>${l(a.title)}</h2></div><p>${a.steps.length} steps</p></div><ol id="demo-steps">${t}</ol></section>
    <div class="undo-bar" id="undo-bar" hidden><span>Step removed.</span><button id="undo-remove" type="button">Undo</button></div>
    <dialog id="note-dialog"><form method="dialog"><h2>Edit step note</h2><label for="step-note">Note</label><textarea id="step-note" rows="4" maxlength="280"></textarea><input id="note-step-id" type="hidden"><div><button value="cancel" type="submit">Cancel</button><button id="save-note" class="primary" value="default" type="submit">Save note</button></div></form></dialog>
    <p id="demo-announcement" class="sr-only" aria-live="polite"></p>
  </main>`}function N(){return'<main id="main" class="prose"><p class="kicker">Policy</p><h1>Privacy without a cloud account</h1><p class="updated">Effective 28 August 2026</p><h2>What the extension stores</h2><p>App Flow Reader stores route names, action labels, page addresses, notes, and timestamps on this device.</p><h2>What it does not collect</h2><p>The extension ignores password controls. It does not store screenshots or typed field values.</p><h2>Where route data goes</h2><p>Route data stays in your browser unless you export and share a file. The demo keeps changes only in memory.</p><h2>Supporter license checks</h2><p>The extension makes no background network request until you restore a supporter token. It then contacts only api.sociobot.in to check that token.</p><h2>Delete your data</h2><p>Select Delete route in the extension to remove that saved route.</p><h2>Questions</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></main>'}function C(){return'<main id="main" class="prose"><p class="kicker">Terms</p><h1>Terms for using App Flow Reader</h1><p class="updated">Effective 28 August 2026</p><h2>Use of the extension</h2><p>You may use App Flow Reader for browser tasks you are allowed to access. Review exported files before sharing them.</p><h2>Free reader</h2><p>The route reader, exports, and accessibility features are free. They do not require a supporter license.</p><h2>Supporter purchase</h2><p>The $12 supporter license is a one-time purchase for three decorative cover styles in the extension. Restore the returned token in the extension.</p><h2>No warranty</h2><p>The software is provided as is, without warranties. Keep a copy of any route you need to retain.</p><h2>Acceptable use</h2><p>Do not use the extension to collect private information from other people or to bypass access controls.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></main>'}function M(){return'<main id="main" class="not-found"><div class="lost-line" aria-hidden="true"><span>?</span></div><p class="kicker">404 / Path not recorded</p><h1>This step is not in the flow</h1><p>The address may have changed. Return to the first step.</p><a class="button primary" href="/" data-route>Return home</a></main>'}function O(){return'<footer class="site-footer"><div><a class="footer-mark" href="/" data-route>App Flow Reader</a><p>Follow saved routes through dense workplace apps.</p></div><nav aria-label="Footer navigation"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://hello-factory.sociobot.in" target="_blank" rel="noreferrer" aria-label="Built by Param Factory (opens in a new tab)">Built by Param Factory <span aria-hidden="true">↗</span></a></nav><p class="build">Version 1.1.0 · build 2026.08.29</p></footer>'}function D(){const t=document.querySelector(".nav-toggle");t?.addEventListener("click",()=>{const e=t.getAttribute("aria-expanded")==="true";t.setAttribute("aria-expanded",String(!e)),document.querySelector("#site-nav")?.classList.toggle("open",!e)})}function I(){document.querySelector("#reset-demo")?.addEventListener("click",()=>{v(),p(!1),d("Demo reset to five sample steps.")}),document.querySelector("#demo-back")?.addEventListener("click",()=>{r=Math.max(0,r-1),p(!1),d(`Step ${r+1} of ${a.steps.length}. ${a.steps[r]?.label}`),g()}),document.querySelector("#demo-next")?.addEventListener("click",()=>{r=Math.min(a.steps.length-1,r+1),p(!1),d(`Step ${r+1} of ${a.steps.length}. ${a.steps[r]?.label}`),g()}),document.querySelector("#export-markdown")?.addEventListener("click",()=>y(b(a,"md"),E(a),"text/markdown")),document.querySelector("#export-json")?.addEventListener("click",()=>y(b(a,"json"),F(a),"application/json")),document.querySelectorAll(".remove-step").forEach(t=>t.addEventListener("click",()=>{const e=t.closest("[data-step-id]").dataset.stepId;u=structuredClone(a),a=R(a,e),r=Math.min(r,Math.max(0,a.steps.length-1)),p(!1);const o=document.querySelector("#undo-bar");o&&(o.hidden=!1),d("Step removed. You can undo this change.")})),document.querySelector("#undo-remove")?.addEventListener("click",()=>{u&&(a=u),u=null,p(!1),d("Step restored.")}),document.querySelectorAll(".edit-note").forEach(t=>t.addEventListener("click",()=>{const e=t.closest("[data-step-id]").dataset.stepId,o=document.querySelector("#note-dialog");document.querySelector("#step-note").value=a.steps.find(n=>n.id===e)?.note??"",document.querySelector("#note-step-id").value=e,o.showModal(),document.querySelector("#step-note").focus()})),document.querySelector("#save-note")?.addEventListener("click",()=>{const t=document.querySelector("#step-note").value,e=document.querySelector("#note-step-id").value;a=$(a,e,t),setTimeout(()=>{p(!1),d("Step note saved.")},0)})}function U(){return location.pathname==="/"&&new URLSearchParams(location.search).get("demo")==="1"?"/demo":location.pathname==="/"?"/":location.pathname==="/demo"?"/demo":location.pathname==="/privacy"?"/privacy":location.pathname==="/terms"?"/terms":"/not-found"}function B(t){const e={"/":["App Flow Reader — Follow routes in workplace apps","Save and follow clear routes through dense workplace apps."],"/demo":["Demo — App Flow Reader","Follow a five-step expense route with isolated sample data."],"/privacy":["Privacy — App Flow Reader","How App Flow Reader keeps flow data in your browser."],"/terms":["Terms — App Flow Reader","Terms for using the App Flow Reader browser extension."],"/not-found":["Page not found — App Flow Reader","Return to App Flow Reader."]};document.title=e[t][0];const n=`https://app-flow-reader.sociobot.in${t==="/not-found"?location.pathname:t}`;document.querySelector('meta[name="description"]').content=e[t][1],document.querySelector('link[rel="canonical"]').href=n,c('meta[property="og:title"]',e[t][0]),c('meta[property="og:description"]',e[t][1]),c('meta[property="og:url"]',n),c('meta[name="twitter:title"]',e[t][0]),c('meta[name="twitter:description"]',e[t][1])}function y(t,e,o){const n=document.createElement("a");n.href=URL.createObjectURL(new Blob([e],{type:o})),n.download=t,n.click(),setTimeout(()=>URL.revokeObjectURL(n.href),0),d(`${t} downloaded.`)}function d(t){const e=document.querySelector("#demo-announcement")??x;e.textContent=t}function g(){requestAnimationFrame(()=>document.querySelector(".demo-step.current")?.scrollIntoView({block:"center",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}))}function j(){const t=new URLSearchParams(location.search),e=t.get("license");e&&(sessionStorage.setItem(S,e),t.delete("license"),history.replaceState({},"",`${location.pathname}${t.size?`?${t}`:""}${location.hash}`))}function Y(){const t=sessionStorage.getItem(S);return t?`<p class="returned-license" data-app-flow-reader-license-return="${l(t)}" role="status">Purchase complete. Your installed extension restores this token now. You can also copy it into Supporter styles: <code>${l(t)}</code></p>`:""}function v(){a=structuredClone(k),u=null,r=0}function c(t,e){document.querySelector(t).content=e}function l(t){return t.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e])}function Z(){"serviceWorker"in navigator&&addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")})}
//# sourceMappingURL=index-Btwexh82.js.map
