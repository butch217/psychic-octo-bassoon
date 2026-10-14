const USD_NGN_REFERENCE = 1330; // approximate market reference, 14 Oct 2026; not a checkout quote
const CARRY1ST = "https://shop.carry1st.com/?aff=peter9j";
const COINS_LINK = "https://tolt.link/coins";
const products = [
  {
    id:"codm", game:"Call of Duty: Mobile", short:"COD POINTS", icon:"CP", iconClass:"icon-cod",
    description:"COD Points for in-game content and battle passes.",
    destination:"https://shop.carry1st.com/en/NG/product/codm-call-of-duty-mobile-cp-points-top-up-battle-pass/direct-topup?aff=peter9j",
    packages:[
      {label:"30 COD Points",price:660},{label:"80 COD Points",price:1650},{label:"420 COD Points",price:8200},
      {label:"880 COD Points",price:16500},{label:"2,400 COD Points",price:41000},{label:"5,000 COD Points",price:82500}
    ]
  },
  {
    id:"freefire",game:"Free Fire Diamonds",short:"FREE FIRE",icon:"FF",iconClass:"icon-ff",
    description:"Direct top-up diamonds for characters, skins and more.",
    destination:"https://shop.carry1st.com/en/NG/product/free-fire-direct-top-up-diamonds-global-sgm/direct-topup?aff=peter9j",
    packages:[
      {label:"100 Diamonds",price:1638},{label:"210 Diamonds",price:3276},{label:"530 Diamonds",price:8190},
      {label:"1,080 Diamonds",price:16380},{label:"2,200 Diamonds",price:32760}
    ]
  },
  {
    id:"ml",game:"Mobile Legends",short:"MLBB DIAMONDS",icon:"ML",iconClass:"icon-ml",
    description:"Diamonds for your Mobile Legends account.",
    destination:"https://shop.carry1st.com/en/NG/product/Mobile_Legends_Diamonds/direct-topup?aff=peter9j",
    packages:[
      {label:"14 Diamonds (13 + 1)",price:403},{label:"42 Diamonds (38 + 4)",price:1208},{label:"55 Diamonds (50 + 5)",price:1569},
      {label:"70 Diamonds (64 + 6)",price:1999},{label:"86 Diamonds (78 + 8)",price:1888},{label:"140 Diamonds (127 + 13)",price:3998}
    ]
  },
  {
    id:"pubg",game:"PUBG Mobile UC",short:"PUBG MOBILE",icon:"UC",iconClass:"icon-pubg",
    description:"UC bundles for Royale Pass, outfits and in-game items.",
    destination:"https://shop.carry1st.com/en/NG/product/pubg-mobile-uc-top-up-gm/direct-topup?aff=peter9j",
    packages:[
      {label:"300 + 25 UC",price:6340.64},{label:"600 + 60 UC",price:12693.24},{label:"1,500 + 300 UC",price:31751.04},
      {label:"3,000 + 850 UC",price:63514.04},{label:"6,000 + 2,100 UC",price:127040.04},{label:"12,000 + 4,200 UC",price:254092.04}
    ]
  }
];
let activeFilter = "all";
let currency = "NGN";
const formatPrice = value => currency === "NGN"
  ? new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:2}).format(value)
  : new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(value/USD_NGN_REFERENCE);
const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function renderProducts(){
  const list = products.filter(p=>activeFilter==="all" || (activeFilter==="COD" ? p.id==="codm" : activeFilter==="PUBG" ? p.id==="pubg" : p.game.includes(activeFilter)));
  document.getElementById("product-grid").innerHTML = list.map(p=>{
    const first = p.packages[0];
    return `<article class="product-card" data-product="${p.id}">
      <div class="product-icon ${p.iconClass}">${p.icon}</div>
      <span class="product-label">${p.short}</span><h3>${p.game}</h3><p class="desc">${p.description}</p>
      <label class="package-label" for="package-${p.id}">Choose package</label>
      <select class="package-select" id="package-${p.id}" aria-label="Choose ${p.game} package" data-package="${p.id}">${p.packages.map((x,i)=>`<option value="${i}">${escapeHTML(x.label)} — ${formatPrice(x.price)}</option>`).join("")}</select>
      <div class="price-line"><div><small>Selected price guide</small><strong data-price="${p.id}">${formatPrice(first.price)}</strong></div><div class="from"><small>Checkout</small><strong>Partner site</strong></div></div>
      <div class="card-actions"><a class="button" href="${p.destination}" target="_blank" rel="noopener noreferrer" data-buy="${p.id}">Continue to top-up ↗</a><a class="coin-icon" href="${COINS_LINK}" target="_blank" rel="noopener noreferrer" aria-label="Browse gaming coins">＋</a></div>
    </article>`;
  }).join("");
}
document.getElementById("product-grid").addEventListener("change",event=>{
  const select=event.target.closest("[data-package]");
  if(!select)return;
  const p=products.find(x=>x.id===select.dataset.package);
  const pack=p.packages[Number(select.value)];
  document.querySelector(`[data-price="${p.id}"]`).textContent=formatPrice(pack.price);
});
document.getElementById("currency").addEventListener("change",event=>{currency=event.target.value;renderProducts();});
document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===button));
  activeFilter=button.dataset.filter;renderProducts();
}));
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();