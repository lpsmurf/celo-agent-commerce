// ---- country data: live USDT prices + local face, indicative FX (1 USDT ≈ local) ----
// Display meta per country. The ranked product list is fetched live from
// /api/celo/popular so it reflects real orders as they accrue.
const COUNTRIES = {
  NG:{label:"Nigeria",     cc:"NG", cur:"₦",   fx:1327, lang:"en",  fxText:"1 USDT ≈ ₦1,327"},
  KE:{label:"Kenya",       cc:"KE", cur:"KES", fx:129,  lang:"sw",  fxText:"1 USDT ≈ KES 129"},
  GH:{label:"Ghana",       cc:"GH", cur:"GH₵", fx:11.4, lang:"en",  fxText:"1 USDT ≈ GH₵11.4"},
  PH:{label:"Philippines", cc:"PH", cur:"₱",   fx:62.7, lang:"fil", fxText:"1 USDT ≈ ₱62.7"},
  BR:{label:"Brazil",      cc:"BR", cur:"R$",  fx:5.11, lang:"pt",  fxText:"1 USDT ≈ R$5,11"}
};
const CAT_LABEL = { mobile_data:"catData", airtime:"catAirtime", gift_card:"catGift" };
const popularCache = {}; // country -> API response (per session)

// ---- translations (marketing strings; agent/dev section stays English) ----
const T = {
  en:{ langBtn:"EN",
    freeWord:"FREE", badge:"first top-up*", h1a:"Claim free money.", h1b:"Top up your phone.",
    lede:"Airtime, data, gift cards and eSIMs — paid with stablecoins on Celo. No CELO for gas, no bank, no card.",
    ctaClaim:"Claim my free top-up", ctaShop:"Go to checkout",
    tcInline:"*First top-up free via the Self × Google Cloud faucet.", tcLink:"T&Cs apply",
    fxLabel:"Today's rate", popEyebrow:"Live prices",
    titleBought:"Most bought in {c}", titlePicks:"Popular in {c}",
    noteBought:"Ranked by real orders on the store.", notePicks:"Curated picks — the ranking goes live as orders come in.",
    catData:"Data", catAirtime:"Airtime", catGift:"Gift card",
    fromWord:"from", inUsdt:"in USDT",
    svcNote:"Prices are live from the store and settle in stablecoin — no hidden FX. The supplier minimum is about $0.55, so a small data bundle is often the best first buy. 175+ more countries are in the checkout.",
    stepsEyebrow:"Three taps", stepsTitle:"How it works",
    s1h:"Verify & claim", s1p:"Prove you're a real person with Self, then claim free USA₮ from the Google Cloud faucet. It lands in your Celo wallet.",
    s2h:"Pick your top-up", s2p:"Open the checkout, choose your country, network and bundle. MiniPay and Valora work out of the box.",
    s3h:"Pay & receive", s3p:"Pay in USA₮, USD₮ or USDC. Gas is paid in the stablecoin — you never need CELO. Your top-up arrives by email.",
    proofEyebrow:"Not a demo", proofTitle:"Already live on Celo mainnet",
    proofP:"The first end-to-end order ran on 13 Sep 2026: USA₮ paid over x402, swapped, bridged, and a gift card delivered by email — all on mainnet.",
    fPay:"Payment tx", fAgent:"Agent (ERC-8004)", fSettle:"Settled in",
    termsTitle:"Terms & conditions",
    termsBody:"“First top-up free” means the free USA₮ available to verified users from the Self × Google Cloud faucet is enough to cover a first small top-up. The faucet is operated by third parties (Self and Google Cloud); Celo Agent Commerce does not run it and cannot guarantee its availability, amount or eligibility, which are subject to their terms — typically one claim per verified person. Prices shown are live and may change; the supplier's minimum order is about US$0.55. Exchange rates are indicative and refreshed periodically. Products are fulfilled by Cryptorefills. Not available where prohibited." },
  sw:{ langBtn:"SW",
    freeWord:"BURE", badge:"malipo ya kwanza*", h1a:"Pata pesa za bure.", h1b:"Ongeza salio la simu.",
    lede:"Salio, data, kadi za zawadi na eSIM — hulipwa kwa sarafu-thabiti kwenye Celo. Huhitaji CELO kwa gesi, benki wala kadi.",
    ctaClaim:"Dai malipo yangu ya bure", ctaShop:"Nenda kwenye malipo",
    tcInline:"*Malipo ya kwanza ni bure kupitia bomba la Self × Google Cloud.", tcLink:"Masharti yanatumika",
    fxLabel:"Kiwango cha leo", popEyebrow:"Bei za sasa",
    titleBought:"Zinazonunuliwa zaidi {c}", titlePicks:"Maarufu nchini {c}",
    noteBought:"Zimepangwa kwa maagizo halisi ya duka.", notePicks:"Chaguo teule — orodha huanza kadri maagizo yanavyoingia.",
    catData:"Data", catAirtime:"Salio", catGift:"Kadi ya zawadi",
    fromWord:"kuanzia", inUsdt:"kwa USDT",
    svcNote:"Bei ni za moja kwa moja kutoka dukani na hulipwa kwa sarafu-thabiti — hakuna FX iliyofichwa. Kiwango cha chini cha muuzaji ni takriban $0.55, hivyo kifurushi kidogo cha data mara nyingi ndicho ununuzi bora wa kwanza. Nchi 175+ zaidi zipo kwenye malipo.",
    stepsEyebrow:"Hatua tatu", stepsTitle:"Jinsi inavyofanya kazi",
    s1h:"Thibitisha na udai", s1p:"Thibitisha kuwa wewe ni mtu halisi kwa Self, kisha dai USA₮ ya bure kutoka bomba la Google Cloud. Itafika kwenye pochi yako ya Celo.",
    s2h:"Chagua malipo yako", s2p:"Fungua malipo, chagua nchi, mtandao na kifurushi chako. MiniPay na Valora hufanya kazi moja kwa moja.",
    s3h:"Lipa na upokee", s3p:"Lipa kwa USA₮, USD₮ au USDC. Gesi hulipwa kwa sarafu-thabiti — huhitaji CELO kamwe. Malipo yako yatafika kwa barua pepe.",
    proofEyebrow:"Sio onyesho", proofTitle:"Tayari inafanya kazi kwenye Celo mainnet",
    proofP:"Agizo la kwanza kamili lilifanyika tarehe 13 Sep 2026: USA₮ ililipwa kupitia x402, ikabadilishwa, ikahamishwa, na kadi ya zawadi ikatumwa kwa barua pepe — yote kwenye mainnet.",
    fPay:"Muamala wa malipo", fAgent:"Wakala (ERC-8004)", fSettle:"Imelipwa kwa",
    termsTitle:"Masharti na vigezo",
    termsBody:"“Malipo ya kwanza ni bure” maana yake ni kwamba USA₮ ya bure inayopatikana kwa watumiaji waliothibitishwa kutoka bomba la Self × Google Cloud inatosha kugharamia malipo madogo ya kwanza. Bomba linaendeshwa na wahusika wengine (Self na Google Cloud); Celo Agent Commerce hailiendeshi na haiwezi kuhakikisha upatikanaji, kiasi au ustahiki wake, ambavyo viko chini ya masharti yao — kwa kawaida dai moja kwa kila mtu aliyethibitishwa. Bei zinazoonyeshwa ni za sasa na zinaweza kubadilika; kiwango cha chini cha muuzaji ni takriban US$0.55. Viwango vya ubadilishaji ni vya makadirio. Bidhaa hutolewa na Cryptorefills." },
  fil:{ langBtn:"FIL",
    freeWord:"LIBRE", badge:"unang top-up*", h1a:"Mag-claim ng libreng pera.", h1b:"Mag-top up ng load.",
    lede:"Load, data, gift card at eSIM — bayad gamit ang stablecoin sa Celo. Walang CELO para sa gas, walang bangko, walang card.",
    ctaClaim:"I-claim ang libreng top-up", ctaShop:"Pumunta sa checkout",
    tcInline:"*Libre ang unang top-up gamit ang Self × Google Cloud faucet.", tcLink:"May mga tuntunin",
    fxLabel:"Palitan ngayon", popEyebrow:"Live na presyo",
    titleBought:"Pinakabinibili sa {c}", titlePicks:"Sikat sa {c}",
    noteBought:"Nakaayos ayon sa tunay na mga order sa store.", notePicks:"Mga piling produkto — magiging live ang ranking pagdating ng mga order.",
    catData:"Data", catAirtime:"Load", catGift:"Gift card",
    fromWord:"mula", inUsdt:"sa USDT",
    svcNote:"Live ang mga presyo mula sa tindahan at binabayaran sa stablecoin — walang nakatagong FX. Ang minimum ng supplier ay mga $0.55, kaya madalas na ang maliit na data bundle ang pinakamahusay na unang bili. 175+ pang bansa ang nasa checkout.",
    stepsEyebrow:"Tatlong tap", stepsTitle:"Paano ito gumagana",
    s1h:"I-verify at i-claim", s1p:"Patunayan na totoong tao ka gamit ang Self, tapos mag-claim ng libreng USA₮ mula sa Google Cloud faucet. Dadating ito sa iyong Celo wallet.",
    s2h:"Pumili ng top-up", s2p:"Buksan ang checkout, piliin ang bansa, network at bundle mo. Gumagana ang MiniPay at Valora agad.",
    s3h:"Magbayad at tumanggap", s3p:"Magbayad sa USA₮, USD₮ o USDC. Ang gas ay bayad sa stablecoin — hindi mo kailangan ng CELO. Darating ang top-up mo sa email.",
    proofEyebrow:"Hindi demo", proofTitle:"Live na sa Celo mainnet",
    proofP:"Ang unang buong order ay noong 13 Sep 2026: USA₮ na binayad via x402, na-swap, na-bridge, at naihatid ang gift card sa email — lahat sa mainnet.",
    fPay:"Payment tx", fAgent:"Agent (ERC-8004)", fSettle:"Bayad sa",
    termsTitle:"Mga tuntunin at kundisyon",
    termsBody:"Ang ibig sabihin ng “libreng unang top-up” ay sapat ang libreng USA₮ na makukuha ng mga na-verify na user mula sa Self × Google Cloud faucet para sa isang maliit na unang top-up. Ang faucet ay pinapatakbo ng ibang partido (Self at Google Cloud); hindi ito pinapatakbo ng Celo Agent Commerce at hindi magagarantiya ang availability, halaga o pagiging kwalipikado nito, na nasa ilalim ng kanilang mga tuntunin — karaniwang isang claim bawat na-verify na tao. Ang mga presyo ay live at maaaring magbago; ang minimum ng supplier ay mga US$0.55. Ang palitan ay pagtantiya lamang. Ang mga produkto ay hatid ng Cryptorefills." },
  pt:{ langBtn:"PT",
    freeWord:"GRÁTIS", badge:"1ª recarga*", h1a:"Ganhe dinheiro grátis.", h1b:"Recarregue o celular.",
    lede:"Recarga, dados, vales-presente e eSIMs — pagos com stablecoins na Celo. Sem CELO para gás, sem banco, sem cartão.",
    ctaClaim:"Resgatar minha recarga grátis", ctaShop:"Ir para o checkout",
    tcInline:"*Primeira recarga grátis via faucet Self × Google Cloud.", tcLink:"Termos se aplicam",
    fxLabel:"Câmbio de hoje", popEyebrow:"Preços ao vivo",
    titleBought:"Mais comprados no {c}", titlePicks:"Populares no {c}",
    noteBought:"Classificado por pedidos reais na loja.", notePicks:"Seleção — o ranking fica ao vivo conforme os pedidos chegam.",
    catData:"Dados", catAirtime:"Crédito", catGift:"Vale-presente",
    fromWord:"a partir de", inUsdt:"em USDT",
    svcNote:"Os preços são ao vivo da loja e liquidados em stablecoin — sem câmbio oculto. O pedido mínimo do fornecedor é cerca de US$0,55, então um pacote pequeno de dados costuma ser a melhor primeira compra. Mais de 175 países estão no checkout.",
    stepsEyebrow:"Três toques", stepsTitle:"Como funciona",
    s1h:"Verifique e resgate", s1p:"Prove que você é uma pessoa real com o Self, depois resgate USA₮ grátis no faucet do Google Cloud. Ele cai na sua carteira Celo.",
    s2h:"Escolha sua recarga", s2p:"Abra o checkout, escolha seu país, operadora e pacote. MiniPay e Valora funcionam de imediato.",
    s3h:"Pague e receba", s3p:"Pague em USA₮, USD₮ ou USDC. O gás é pago na própria stablecoin — você nunca precisa de CELO. Sua recarga chega por e-mail.",
    proofEyebrow:"Não é demo", proofTitle:"Já no ar na mainnet da Celo",
    proofP:"O primeiro pedido completo foi em 13/09/2026: USA₮ pago via x402, trocado, transferido via bridge, e um vale-presente entregue por e-mail — tudo na mainnet.",
    fPay:"Transação", fAgent:"Agente (ERC-8004)", fSettle:"Liquidado em",
    termsTitle:"Termos e condições",
    termsBody:"“Primeira recarga grátis” significa que o USA₮ gratuito disponível para usuários verificados no faucet Self × Google Cloud é suficiente para cobrir uma primeira recarga pequena. O faucet é operado por terceiros (Self e Google Cloud); a Celo Agent Commerce não o opera e não pode garantir sua disponibilidade, valor ou elegibilidade, que estão sujeitos aos termos deles — normalmente um resgate por pessoa verificada. Os preços exibidos são ao vivo e podem mudar; o pedido mínimo do fornecedor é cerca de US$0,55. As taxas de câmbio são indicativas. Os produtos são fornecidos pela Cryptorefills." }
};

let current = { country:"NG", lang:"en" };

function fmt(str, c){ return str.replace("{c}", c); }

function paintServices(data){
  const c = COUNTRIES[current.country];
  const t = T[current.lang] || T.en;
  const host = document.getElementById("services");
  host.innerHTML = "";
  (data.items || []).forEach(s => {
    const el = document.createElement("div");
    el.className = "svc";
    el.innerHTML =
      '<div class="st"><span class="brand-tag"></span><span class="tag"></span></div>' +
      '<div class="get"></div>' +
      '<div class="pr"><span class="usdt"></span><span class="local"></span></div>';
    const localAmt = Math.round(s.usdt * c.fx);
    const sep = c.cur.length > 1 ? " " : "";
    const localStr = "≈ " + c.cur + sep + localAmt.toLocaleString("en-US") + (s.from ? "+" : "");
    el.querySelector(".brand-tag").textContent = s.brand;
    el.querySelector(".tag").textContent = t[CAT_LABEL[s.category]] || s.category;
    el.querySelector(".get").textContent = s.get;
    el.querySelector(".usdt").textContent = (s.from ? (t.fromWord + " ") : "") + "$" + Number(s.usdt).toFixed(2);
    el.querySelector(".local").innerHTML = '<span style="display:block">' + t.inUsdt + '</span>' + localStr;
    host.appendChild(el);
  });
  const bought = data.source === "orders";
  document.getElementById("pop-title").textContent = fmt(bought ? t.titleBought : t.titlePicks, c.label);
  document.getElementById("pop-note").textContent = bought ? t.noteBought : t.notePicks;
  document.getElementById("fx-rate").textContent = c.fxText;
}

function renderServices(){
  const cc = current.country;
  if (popularCache[cc]) { paintServices(popularCache[cc]); return; }
  paintServices({ items: [], source: "picks" });   // instant, no flash of stale data
  const opts = typeof AbortSignal !== "undefined" && AbortSignal.timeout ? { signal: AbortSignal.timeout(6000) } : {};
  fetch("/api/celo/popular?country=" + cc, opts)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => { popularCache[cc] = data; if (current.country === cc) paintServices(data); })
    .catch(() => {});
}

function applyLang(){
  const t = T[current.lang] || T.en;
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.getAttribute("data-i18n");
    if (t[key] != null) node.textContent = t[key];
  });
  document.documentElement.lang = current.lang === "fil" ? "fil" : current.lang;
  // language toggle labels
  const nativeBtn = document.getElementById("lang-native");
  const enBtn = document.getElementById("lang-en");
  const nativeLang = COUNTRIES[current.country].lang;
  nativeBtn.textContent = (T[nativeLang] || T.en).langBtn;
  nativeBtn.setAttribute("aria-pressed", String(current.lang === nativeLang));
  enBtn.setAttribute("aria-pressed", String(current.lang === "en"));
  nativeBtn.hidden = nativeLang === "en";
  renderServices();
}

function renderCountryTabs(){
  const host = document.getElementById("countries");
  host.innerHTML = "";
  Object.keys(COUNTRIES).forEach(code => {
    const c = COUNTRIES[code];
    const b = document.createElement("button");
    b.className = "country-tab";
    b.type = "button";
    b.setAttribute("aria-pressed", String(code === current.country));
    b.innerHTML = '<span class="name"></span><span class="cc"></span>';
    b.querySelector(".name").textContent = c.label;
    b.querySelector(".cc").textContent = c.cc;
    b.addEventListener("click", () => {
      current.country = code;
      current.lang = c.lang;           // switch to that country's native language
      current.manual = true;           // stop any in-flight geo detection from overriding
      renderCountryTabs();
      applyLang();
    });
    host.appendChild(b);
  });
}

document.getElementById("lang-en").addEventListener("click", () => { current.lang = "en"; current.manual = true; applyLang(); });
document.getElementById("lang-native").addEventListener("click", () => { current.lang = COUNTRIES[current.country].lang; current.manual = true; applyLang(); });

// Render immediately at the default (page must be correct at rest), then adjust.
renderCountryTabs();
applyLang();

// --- auto-detect country + language ---
// From the browser locale only: no IP-geolocation lookup, which would hand every
// visitor's IP to a third party (and the store's CSP blocks it anyway).
const SUPPORTED = Object.keys(COUNTRIES);
function pickFromLocale(){
  const langs = navigator.languages || (navigator.language ? [navigator.language] : []);
  for (const l of langs){
    const m = /-([A-Za-z]{2})\b/.exec(l || "");
    if (m && SUPPORTED.includes(m[1].toUpperCase())){
      const country = m[1].toUpperCase();
      const primary = (l.split("-")[0] || "").toLowerCase();
      return { country, lang: primary === "en" ? "en" : COUNTRIES[country].lang };
    }
  }
  return null;
}
function selectDetected(loc){
  if (current.manual) return;            // never override a manual choice
  current.country = loc.country;
  current.lang = loc.lang;
  renderCountryTabs();
  applyLang();
}
const fromLocale = pickFromLocale();
if (fromLocale) selectDetected(fromLocale);
