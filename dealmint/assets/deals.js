/* DealMint — SaaS Deals & Coupons. Curated by Chachi. */
/* All deals were verified against live deal aggregators on 2026-10-09.
   Deals change: always confirm on the source page before buying. */

const DEALS = [
  { name: "AudioHero", category: "Audio & Music", deal: "$105 lifetime", desc: "Royalty-free library: 300k+ music tracks and SFX for creators, with unlimited licensing.", source: "AppSumo", verified: "2026-10-09", url: "https://adithyashetty.com/appsumo-lifetime-deals/" },
  { name: "Musicsesame", category: "Audio & Music", deal: "$75 lifetime", desc: "Stock music library produced, owned and licensed directly by the Music Sesame studio.", source: "AppSumo", verified: "2026-10-09", url: "https://adithyashetty.com/appsumo-lifetime-deals/" },
  { name: "CandyIcons", category: "Design", deal: "$39 lifetime", desc: "Create royalty-free app icons with text using AI technology.", source: "AppSumo", verified: "2026-10-09", url: "https://adithyashetty.com/appsumo-lifetime-deals/" },
  { name: "Unlimphotos", category: "Design", deal: "$79 lifetime", desc: "12M+ royalty-free stock photos, lifetime access for one payment.", source: "AppSumo", verified: "2026-10-09", url: "https://adithyashetty.com/appsumo-lifetime-deals/" },
  { name: "1minAI Pro", category: "AI Tools", deal: "$40 lifetime (was $234)", desc: "Multi-model AI workspace. 82% off lifetime subscription on StackSocial.", source: "StackSocial", verified: "2026-10-09", url: "https://www.offers.com/stores/stack-social/" },
  { name: "AskAnyModel AI Pro", category: "AI Tools", deal: "$40 lifetime (was $499)", desc: "50+ AI models in one platform; compare up to 6 answers side by side; 500 monthly premium credits.", source: "StackSocial", verified: "2026-10-09", url: "https://www.dealnews.com/Stack-Social-Microsoft-Office-Deals-for-From-9-97/22206573.html" },
  { name: "Nichesss", category: "AI Tools", deal: "94% off", desc: "AI copywriting suite for blogs, ads and social content.", source: "AppSumo", verified: "2026-10-09", url: "https://bloggingbeats.com/best-appsumo-deals/" },
  { name: "Writecream", category: "AI Tools", deal: "96% off", desc: "AI writing assistant for long-form content and marketing copy.", source: "AppSumo", verified: "2026-10-09", url: "https://bloggingbeats.com/best-appsumo-deals/" },
  { name: "SE Ranking", category: "SEO", deal: "Lifetime deal (ends Nov 19, 2026)", desc: "All-in-one SEO platform: keyword research, competitor analysis, site audit.", source: "AppSumo", verified: "2026-10-09", url: "https://appsumo.envirogadget.com/" },
  { name: "Screpy", category: "SEO", deal: "71% off", desc: "SEO monitoring, audits and uptime tracking in one dashboard.", source: "AppSumo", verified: "2026-10-09", url: "https://bloggingbeats.com/best-appsumo-deals/" },
  { name: "SendFox", category: "Email Marketing", deal: "90% off", desc: "Email marketing built for content creators; lifetime tiers.", source: "AppSumo", verified: "2026-10-09", url: "https://bloggingbeats.com/best-appsumo-deals/" },
  { name: "Emailit", category: "Email Marketing", deal: "$39 lifetime", desc: "SMTP email delivery service for developers and teams.", source: "AppSumo", verified: "2026-10-09", url: "https://dealysoft.com/best-appsumo-lifetime-deals/" },
  { name: "Promo Amp", category: "Email Marketing", deal: "$49 lifetime", desc: "Email marketing with automation built for growth teams.", source: "AppSumo", verified: "2026-10-09", url: "https://dealysoft.com/best-appsumo-lifetime-deals/" },
  { name: "FeedBoss", category: "Social Media", deal: "$59 lifetime", desc: "AI agent that drafts LinkedIn posts in your voice from your profile and activity.", source: "AppSumo", verified: "2026-10-09", url: "https://adithyashetty.com/appsumo-lifetime-deals/" },
  { name: "Sociamonials", category: "Social Media", deal: "96% off", desc: "Social media management plus review/testimonial campaigns.", source: "AppSumo", verified: "2026-10-09", url: "https://bloggingbeats.com/best-appsumo-deals/" },
  { name: "LeadRocks", category: "Lead Gen", deal: "95% off", desc: "B2B lead database and contact enrichment for prospecting.", source: "AppSumo", verified: "2026-10-09", url: "https://bloggingbeats.com/best-appsumo-deals/" },
  { name: "Switchy", category: "Lead Gen", deal: "98% off", desc: "Smart link shortener with retargeting pixels and analytics.", source: "AppSumo", verified: "2026-10-09", url: "https://bloggingbeats.com/best-appsumo-deals/" },
  { name: "Closely", category: "Lead Gen", deal: "$69 lifetime", desc: "LinkedIn + email outreach automation for lead generation.", source: "AppSumo", verified: "2026-10-09", url: "https://dealysoft.com/best-appsumo-lifetime-deals/" },
  { name: "Chatbot Builder", category: "Lead Gen", deal: "$59 lifetime", desc: "No-code chatbot builder for lead capture and support.", source: "AppSumo", verified: "2026-10-09", url: "https://dealysoft.com/best-appsumo-lifetime-deals/" },
  { name: "TidyCal", category: "Scheduling", deal: "Under $39 lifetime (80% off)", desc: "Simple scheduling tool — manage appointments without monthly fees.", source: "AppSumo", verified: "2026-10-09", url: "https://appsumo.envirogadget.com/" },
  { name: "DarkMySite", category: "WordPress", deal: "$9 lifetime", desc: "WordPress dark-mode plugin with one-click toggle for visitors.", source: "AppSumo", verified: "2026-10-09", url: "https://adithyashetty.com/appsumo-lifetime-deals/" },
  { name: "WPSubscription", category: "WordPress", deal: "$79 lifetime", desc: "WooCommerce subscriptions plugin: recurring payments, renewals, split payments.", source: "AppSumo", verified: "2026-10-09", url: "https://adithyashetty.com/appsumo-lifetime-deals/" },
  { name: "Babbel Lifetime", category: "Education", deal: "$134.99 lifetime (55% off w/ code LEARN)", desc: "Lifetime access to Babbel's language-learning platform. Code verified live on Oct 9, 2026.", source: "StackSocial", verified: "2026-10-09", url: "https://www.dontpayfull.com/at/stacksocial.com" },
  { name: "Windows 11 Pro", category: "OS & Software", deal: "96% off lifetime license", desc: "Lifetime license incl. BitLocker, VM support and Remote Desktop. Ends Oct 30, 2026.", source: "StackSocial", verified: "2026-10-09", url: "https://www.dontpayfull.com/at/stacksocial.com" },
  { name: "Matt's Flights Premium", category: "Travel", deal: "$40 lifetime (was $197)", desc: "Flight deal alerts 3x/week, unlimited custom searches, 1-on-1 travel planning support.", source: "StackSocial", verified: "2026-10-09", url: "https://www.dealnews.com/Stack-Social-Microsoft-Office-Deals-for-From-9-97/22206573.html" },
  { name: "AppSumo Plus", category: "Marketplace", deal: "10% off every purchase + $100/yr credits", desc: "Membership: 10% off all purchases, $25 quarterly credits, early access to deals. Breaks even fast.", source: "AppSumo", verified: "2026-10-09", url: "https://www.groupon.com/coupons/appsumo" }
];

const CATEGORIES = ["All", ...new Set(DEALS.map(d => d.category))];

function renderCategories() {
  const bar = document.getElementById("catBar");
  bar.innerHTML = "";
  CATEGORIES.forEach(c => {
    const b = document.createElement("button");
    b.className = "cat" + (c === "All" ? " active" : "");
    b.textContent = c;
    b.onclick = () => {
      document.querySelectorAll(".cat").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      state.cat = c;
      render();
    };
    bar.appendChild(b);
  });
}

const state = { q: "", cat: "All" };

function render() {
  const grid = document.getElementById("grid");
  const q = state.q.trim().toLowerCase();
  const list = DEALS.filter(d =>
    (state.cat === "All" || d.category === state.cat) &&
    (!q || (d.name + " " + d.desc + " " + d.deal).toLowerCase().includes(q))
  );
  document.getElementById("count").textContent =
    list.length + (list.length === 1 ? " deal" : " deals") + " · verified 2026-10-09";
  grid.innerHTML = list.length ? "" : "<p class='empty'>No deals match. Try another search or category.</p>";
  list.forEach(d => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      "<div class='tags'><span class='tag'>" + d.category + "</span>" +
      "<span class='vbadge'>✓ Verified " + d.verified + "</span></div>" +
      "<h3>" + d.name + "</h3>" +
      "<p class='deal'>" + d.deal + "</p>" +
      "<p class='desc'>" + d.desc + "</p>" +
      "<p class='src'>via " + d.source + "</p>" +
      "<a class='btn' href='" + d.url + "' target='_blank' rel='noopener nofollow'>Verify & Get Deal →</a>";
    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  render();
  document.getElementById("search").addEventListener("input", e => {
    state.q = e.target.value;
    render();
  });
  document.getElementById("year").textContent = new Date().getFullYear();
});
