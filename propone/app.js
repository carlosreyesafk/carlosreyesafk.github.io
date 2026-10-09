/* PropOne — client-side proposal generator. Everything runs in the browser. */
(function(){
  "use strict";

  var $ = function(id){ return document.getElementById(id); };

  var fields = {
    fName: "pName", fTitle: "pTitle", fEmail: "pEmail",
    fClient: "pClient", fProject: "pProject",
    fProblem: "pProblem", fSolution: "pSolution",
    fTerms: "pTerms"
  };
  var defaults = {
    fName:"Your Name", fTitle:"Freelancer", fEmail:"you@example.com",
    fClient:"Your Client", fProject:"Project Title",
    fProblem:"Describe the client's problem in a line or two…",
    fSolution:"Describe your solution in a line or two…"
  };

  var isPro = localStorage.getItem("propone_pro") === "yes";
  var customColor = null;

  function esc(s){ return String(s||"").replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });}

  function money(n){ return "$" + Number(n||0).toLocaleString("en-US"); }

  function refresh(){
    Object.keys(fields).forEach(function(fid){
      var el = $(fid), target = $(fields[fid]);
      if(!el || !target) return;
      target.textContent = (el.value || "").trim() || defaults[fid];
    });

    // deliverables
    var rows = document.querySelectorAll("#deliverableRows .drow");
    var total = 0, html = "", count = 0;
    rows.forEach(function(r){
      var d = r.querySelector(".dDesc").value.trim();
      var p = parseFloat(r.querySelector(".dPrice").value) || 0;
      if(d || p){
        count++;
        total += p;
        html += '<div class="p-deliv"><strong>'+esc(d||("Deliverable "+count))+'</strong><span>'+money(p)+'</span></div>';
      }
    });
    $("pDelivs").innerHTML = html || '<div class="p-deliv"><strong>Add your deliverables on the left</strong><span>$0</span></div>';
    $("pTotal").textContent = money(total);

    // timeline + valid-until
    var weeks = parseInt($("fWeeks").value,10) || 4;
    $("pWeeks").textContent = weeks + (weeks===1?" week":" weeks");
    var validDays = parseInt($("fValid").value,10) || 14;
    var d = new Date(); d.setDate(d.getDate()+validDays);
    $("pValid").textContent = d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
    $("pDate").textContent = "Prepared " + new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

    // tier
    $("tierBadge").textContent = isPro ? "PRO" : "FREE";
    $("tierBadge").className = "badge" + (isPro ? " pro" : "");
    var wm = $("pWatermark");
    wm.textContent = isPro ? "" : "Made with PropOne · free plan";
    wm.classList.toggle("locked", !isPro);
    $("proHint").style.display = isPro ? "none" : "";

    if(isPro) saveDraft();
  }

  // theme + brand color
  function applyTheme(){
    var t = $("fTheme").value;
    var paper = $("paper");
    paper.className = "paper theme-" + t;
    if(customColor) paper.style.setProperty("--th", customColor);
    else paper.style.removeProperty("--th");
  }

  $("fTheme").addEventListener("change", function(){
    var opt = $("fTheme").selectedOptions[0];
    if(opt && opt.dataset.pro && !isPro){
      $("fTheme").value = "violet";
      openModal();
      alertUnlock("That theme is Pro-only. Unlock PropOne Pro for $19 — one time.");
      applyTheme(); return;
    }
    applyTheme(); refresh();
  });
  $("fColor").addEventListener("input", function(){
    customColor = $("fColor").value;
    $("paper").style.setProperty("--th", customColor);
    refresh();
  });

  // inputs -> refresh
  document.querySelectorAll("#propForm input, #propForm textarea, #propForm select")
    .forEach(function(el){ el.addEventListener("input", refresh); });

  // buttons
  $("btnPrint").addEventListener("click", function(){ window.print(); });
  $("btnClear").addEventListener("click", function(){
    $("propForm").reset();
    $("fWeeks").value = 4; $("fValid").value = 14;
    customColor = null;
    localStorage.removeItem("propone_draft");
    applyTheme(); refresh();
  });

  // draft autosave (Pro)
  function saveDraft(){
    var data = {};
    document.querySelectorAll("#propForm input, #propForm textarea, #propForm select").forEach(function(el){
      if(el.type === "color") return;
      data[el.id] = el.value;
    });
    var ds = [];
    document.querySelectorAll("#deliverableRows .drow").forEach(function(r){
      ds.push([r.querySelector(".dDesc").value, r.querySelector(".dPrice").value]);
    });
    data._delivs = ds;
    try{ localStorage.setItem("propone_draft", JSON.stringify(data)); }catch(e){}
  }
  function loadDraft(){
    var raw = null;
    try{ raw = localStorage.getItem("propone_draft"); }catch(e){}
    if(!raw || !isPro) return;
    try{
      var data = JSON.parse(raw);
      Object.keys(data).forEach(function(k){
        if(k === "_delivs") return;
        var el = $(k); if(el) el.value = data[k];
      });
      if(data._delivs){
        var rows = document.querySelectorAll("#deliverableRows .drow");
        data._delivs.forEach(function(pair, i){
          if(rows[i]){ rows[i].querySelector(".dDesc").value = pair[0]||""; rows[i].querySelector(".dPrice").value = pair[1]||""; }
        });
      }
    }catch(e){}
  }

  // ---- modal ----
  var modal = $("buyModal");
  function openModal(){ modal.hidden = false; }
  function closeModal(){ modal.hidden = true; }
  $("btnBuy").addEventListener("click", openModal);
  $("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", function(e){ if(e.target === modal) closeModal(); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeModal(); });

  document.querySelectorAll(".pay-tab").forEach(function(tab){
    tab.addEventListener("click", function(){
      document.querySelectorAll(".pay-tab").forEach(function(t){ t.classList.remove("active"); });
      tab.classList.add("active");
      var isPP = tab.dataset.tab === "paypal";
      $("pane-paypal").hidden = !isPP;
      $("pane-usdt").hidden = isPP;
    });
  });

  $("btnCopy").addEventListener("click", function(){
    var txt = $("usdtAddr").textContent.trim();
    function done(){ $("btnCopy").textContent = "Copied ✓"; setTimeout(function(){ $("btnCopy").textContent = "Copy"; }, 1500); }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(done).catch(function(){ fallback(); });
    } else fallback();
    function fallback(){
      var ta = document.createElement("textarea");
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try{ document.execCommand("copy"); }catch(e){}
      document.body.removeChild(ta); done();
    }
  });

  // ---- unlock code ----
  // Codes look like P1-XXXX-YYYY. Issued manually after payment; the site
  // verifies the checksum so random guesses don't unlock.
  function checksumValid(code){
    var m = /^P1-([A-Z0-9]{4})-([A-Z0-9]{4})$/.exec((code||"").trim().toUpperCase());
    if(!m) return false;
    var salt = "propone-19-salt-v1";
    var acc = 0;
    for(var i=0;i<m[1].length;i++) acc = (acc*31 + m[1].charCodeAt(i)) % 1296;
    for(var j=0;j<salt.length;j++) acc = (acc*7 + salt.charCodeAt(j)) % 1296;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var out = "";
    var tmp = acc;
    for(var k=0;k<4;k++){ out += chars[tmp % 36]; tmp = Math.floor(tmp/36); }
    return out === m[2];
  }
  function alertUnlock(msg){
    var m = $("unlockMsg");
    m.textContent = msg; m.className = "tiny-note err";
  }
  $("btnUnlock").addEventListener("click", function(){
    var code = $("unlockInput").value;
    var m = $("unlockMsg");
    if(checksumValid(code)){
      isPro = true;
      try{ localStorage.setItem("propone_pro", "yes"); }catch(e){}
      m.textContent = "Unlocked! Welcome to PropOne Pro.";
      m.className = "tiny-note ok";
      applyTheme(); refresh();
      setTimeout(closeModal, 1200);
    } else {
      m.textContent = "That code doesn't look right. Check it and try again — codes are issued by email after payment.";
      m.className = "tiny-note err";
    }
  });
  $("unlockInput").addEventListener("keydown", function(e){ if(e.key === "Enter") $("btnUnlock").click(); });

  // init
  loadDraft();
  applyTheme();
  refresh();
})();
