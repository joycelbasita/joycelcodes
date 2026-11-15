/* ===== ClickBites – Optimized Build ===== */
const $ = (s, r = document) => r.querySelector(s);
const app = $("#app");
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
const uid = () => crypto.randomUUID();
const sha = async (s) =>
  [
    ...new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode("cb$" + s)
      )
    ),
  ]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
const rnd = (a, n) =>
  [...crypto.getRandomValues(new Uint32Array(n))]
    .map((v) => a[v % a.length])
    .join("");

const CODEA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789",
  KEY = "clickbites_v2",
  IDLE = 15 * 6e4;

let DB,
  S = {
    stars: 0,
    sms: "",
    otp: null,
    edit: null,
    newCode: null,
    load: true,
    shopTab: "Menu",
    modalStars: 5,
  };

let F = {
  cat: "All",
  price: "all",
  rate: "0",
  open: "",
  time: "",
  foodQ: "",
  shopsQ: "",
  sort: "relevance",
  view: "food",
  n: 8,
};

const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(DB));
  } catch (e) {}
};

const U = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=85`;

async function init() {
  try {
    DB = JSON.parse(localStorage.getItem(KEY));
  } catch (e) {}

  if (!DB) {
    const ph = await sha("admin123"),
      po = await sha("owner123");
    const cats = [
      "Rice Meals",
      "Noodles",
      "Snacks",
      "Drinks",
      "Desserts",
      "Filipino Food",
    ].map((name) => ({ id: uid(), name }));
    const cid = (n) => cats.find((c) => c.name === n).id;

    const SH = [
      ["Baybay Grill", "10:00 AM – 9:00 PM", "10:00", "21:00", "0900 123 4567", "Rueda St."],
      ["Tita’s Silog House", "6:00 AM – 8:00 PM", "06:00", "20:00", "0900 234 5678", "Magsaysay Blvd."],
      ["Kusina ni Lola", "9:00 AM – 8:00 PM", "09:00", "20:00", "0900 345 6789", "Nijaga St."],
      ["Milktea Avenue", "11:00 AM – 10:00 PM", "11:00", "22:00", "0900 456 7890", "Rueda St."],
      ["Burger Boss", "10:00 AM – 10:00 PM", "10:00", "22:00", "0900 567 8901", "Obrero St."],
      ["Morning Table", "7:00 AM – 3:00 PM", "07:00", "15:00", "0900 678 9012", "Magsaysay Blvd."],
      ["Daily Harvest", "8:00 AM – 6:00 PM", "08:00", "18:00", "0900 789 0123", "Nijaga St."],
    ];

    const users = [
        {
          id: uid(),
          email: "admin@clickbites.ph",
          pw: ph,
          name: "System Admin",
          role: "admin",
          mobile: "",
          ucid: null,
          active: true,
        },
      ],
      businesses = [];

    SH.forEach((s, i) => {
      const u = {
        id: uid(),
        email: `owner${i + 1}@demo.ph`,
        pw: po,
        name: s[0] + " Owner",
        role: "business_owner",
        mobile: "",
        ucid: null,
        active: true,
      };
      users.push(u);
      businesses.push({
        id: uid(),
        owner: u.id,
        name: s[0],
        hours: s[1],
        opens: s[2],
        closes: s[3],
        contact: s[4],
        address: s[5] + ", Calbayog City",
        desc: "A local food business serving the Calbayog City community.",
        link: "https://www.facebook.com/",
        img: "",
      });
    });

    const P = (i, c, name, price, desc, im) => ({
      id: uid(),
      bid: businesses[i].id,
      cat: cid(c),
      name,
      price,
      desc,
      img: U(im),
      active: true,
    });

    DB = {
      users,
      cats,
      businesses,
      ratings: [],
      codes: [],
      sends: {},
      saved: {},
      session: null,
      products: [
        P(0, "Rice Meals", "Chicken Inasal", 145, "Smoky grilled chicken served with rice.", "1532550907401-a500c9a57435"),
        P(4, "Snacks", "Classic Burger", 99, "Juicy classic burger with fresh toppings.", "1568901346375-23c9450c58cd"),
        P(1, "Noodles", "Pancit Special", 120, "Local favorite noodle dish for sharing.", "1569718212165-3a8278d5f624"),
        P(3, "Drinks", "Iced Milk Tea", 85, "Creamy iced milk tea.", "1558857563-b371033873b8"),
        P(2, "Filipino Food", "Lechon Kawali", 170, "Crispy pork belly with dipping sauce.", "1544025162-d76694265947"),
        P(5, "Desserts", "Pancake Stack", 110, "Fluffy pancakes with syrup drizzle.", "1528207776546-365bb710ee93"),
        P(6, "Desserts", "Fresh Fruit Bowl", 95, "Bowl of fresh seasonal fruit.", "1490474418585-ba9bad8fd0ea"),
        P(1, "Rice Meals", "Garlic Fried Rice", 75, "Fragrant garlic rice staple.", "1512058564366-18510be2db19"),
      ],
    };
    save();
  }

  if (!DB.users.some((u) => u.email === "customer@demo.ph")) {
    const u = {
      id: uid(),
      email: "customer@demo.ph",
      pw: await sha("customer123"),
      name: "Demo Customer",
      role: "normal_user",
      mobile: "09171234567",
      ucid: "CB-7K2M9QX4TP",
      active: true,
    };
    DB.users.push(u);
    const b = DB.businesses[0],
      now = Date.now() - 36e5,
      c = {
        id: uid(),
        bid: b.id,
        by: b.owner,
        code: "DEMO2K7X",
        ref: "Sample receipt",
        created: now - 6e4,
        expires: now + 864e5,
        usedAt: now,
        usedBy: u.id,
        voidedAt: null,
      };
    DB.codes.push(c);
    DB.ratings.push({
      id: uid(),
      uid: u.id,
      bid: b.id,
      ucid: u.ucid,
      score: 5,
      comment: "Tasty grilled chicken and friendly staff.",
      verified: true,
      at: now,
      codeId: c.id,
    });
    DB.saved[u.id] = DB.products.slice(0, 2).map((p) => p.id);
    save();
  }

  setTimeout(() => {
    S.load = false;
    render();
  }, 450);
  render();
}

/* ---------- Helpers ---------- */
function toast(msg, t = "") {
  const e = $("#toast");
  if (!e) return;
  e.textContent = msg;
  e.style.background = t === "er" ? "#B3261E" : "";
  e.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => e.classList.remove("show"), 3600);
}

const err = (m) => (toast(m, "er"), false);
const money = (n) => "₱" + Number(n).toFixed(0);
const fd = (t) =>
  new Date(t).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const cur = () => {
  const s = DB.session;
  if (!s) return null;
  const u = DB.users.find((x) => x.id === s.uid);
  if (!u || !u.active) {
    DB.session = null;
    return null;
  }
  if (u.role !== "normal_user" && Date.now() - s.last > IDLE) {
    DB.session = null;
    save();
    S.expired = true;
    return null;
  }
  return u;
};

const touch = () => {
  if (DB.session) {
    DB.session.last = Date.now();
    save();
  }
};

const dashPath = (u) =>
  u.role === "admin"
    ? "admin"
    : u.role === "business_owner"
      ? "owner"
      : "profile";

const bz = (id) => DB.businesses.find((b) => b.id === id);
const cat = (id) => DB.cats.find((c) => c.id === id);
const prod = (id) => DB.products.find((p) => p.id === id);
const myShop = () => DB.businesses.find((b) => b.owner === cur()?.id);
const bImg = (b) =>
  b.img || DB.products.find((p) => p.bid === b.id && p.img)?.img || "";
const catIcon = (n) =>
  ({
    "Rice Meals": "utensils",
    Noodles: "soup",
    Snacks: "sandwich",
    Drinks: "cup",
    Desserts: "cake",
  })[n] || "tag";

function avg(bid) {
  const r = DB.ratings.filter((x) => x.bid === bid && x.verified);
  return {
    n: r.length,
    a: r.length ? r.reduce((s, x) => s + x.score, 0) / r.length : 0,
  };
}

const rateHtml = (bid) => {
  const r = avg(bid);
  return r.n
    ? `<span class="stars">${icon("star")} ${r.a.toFixed(1)}</span> <span class="muted">(${r.n} verified)</span>`
    : `<span class="muted">No verified ratings yet</span>`;
};

const mins = (t) => {
  const [h, m] = t.split(":");
  return +h * 60 + +m;
};

const isOpen = (b, t) => {
  if (!b.opens || !b.closes) return false;
  const x = mins(t),
    o = mins(b.opens),
    c = mins(b.closes);
  return o <= c ? x >= o && x < c : x >= o || x < c;
};

const nowT = () => new Date().toTimeString().slice(0, 5);
const photo = (src, alt) =>
  src
    ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.style.visibility='hidden'">`
    : `<div class="ph" role="img" aria-label="${esc(alt)}">${icon("utensils")}</div>`;

const savedSet = () => new Set(DB.saved[cur()?.id || "guest"] || []);
const field = (l, i) => `<div class="field"><label>${l}</label>${i}</div>`;
const validPw = (p, c) =>
  p.length < 8
    ? "Password must be at least 8 characters."
    : p !== c
      ? "Passwords do not match."
      : "";
const validMob = (m) => /^(\+?63|0)9\d{9}$/.test(m.replace(/[\s-]/g, ""));

function webp(file) {
  return new Promise((ok, no) => {
    const r = new FileReader();
    r.onerror = no;
    r.onload = () => {
      const i = new Image();
      i.onerror = no;
      i.onload = () => {
        const s = Math.min(1, 640 / Math.max(i.width, i.height)),
          c = document.createElement("canvas");
        c.width = i.width * s;
        c.height = i.height * s;
        c.getContext("2d").drawImage(i, 0, 0, c.width, c.height);
        ok(c.toDataURL("image/webp", 0.75));
      };
      i.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

function productCard(p) {
  const b = bz(p.bid),
    sv = savedSet().has(p.id),
    openNow = b ? isOpen(b, nowT()) : false;
  
  return `<article class="food-card" tabindex="0" aria-label="View ${esc(p.name)}">
    <div class="food-photo" data-act="quickview" data-id="${p.id}">
      ${photo(p.img, p.name)}
      <span class="tag">${esc(cat(p.cat)?.name)}</span>
      <span class="status-badge ${openNow ? "open" : "closed"}">${openNow ? "OPEN" : "CLOSED"}</span>
      <button class="heart ${sv ? "saved" : ""}" data-act="save" data-id="${p.id}" aria-label="Save ${esc(p.name)}">
        ${icon("heart")}
      </button>
    </div>
    <div class="food-info">
      <div class="food-meta">
        <span>${esc(b ? b.name : "")}</span>
        <span>${rateHtml(p.bid)}</span>
      </div>
      <h3 data-act="quickview" data-id="${p.id}" style="cursor:pointer;">${esc(p.name)}</h3>
      <p class="food-desc">${esc(p.desc)}</p>
      <div class="food-footer">
        <span class="price">${money(p.price)}</span>
        <button class="view-link" data-act="quickview" data-id="${p.id}">View Item</button>
      </div>
    </div>
  </article>`;
}

function shopCard(b) {
  const im = bImg(b);
  const openNow = isOpen(b, nowT());

  return `
    <article
      class="shop-strip"
      data-go="shop/${b.id}"
      tabindex="0"
      aria-label="View ${esc(b.name)}">

      <div class="shop-photo">
        ${
          im
            ? `<img
                class="shop-avatar"
                src="${esc(im)}"
                alt="${esc(b.name)}"
                loading="lazy"
                onerror="this.style.visibility='hidden'">`
            : `<div class="shop-avatar ph">
                ${icon("store")}
              </div>`
        }

        <span class="status-badge ${openNow ? "open" : "closed"}">
          ${openNow ? "OPEN" : "CLOSED"}
        </span>
      </div>

      <div class="grow">
        <div>
          <h3 style="margin:0 0 4px">
            ${esc(b.name)}
          </h3>

          <div class="muted" style="font-size:12px; margin-bottom:6px;">
            ${esc(b.address || "Calbayog City, Samar")}
          </div>

          <div>
            ${rateHtml(b.id)}
          </div>
        </div>

        <div class="shop-strip-footer">
          <span class="view-link" style="width:100%;">
            View shop
          </span>
        </div>
      </div>
    </article>
  `;
}
const pageTitle = (eyebrow, title, sub = "") =>
  `<div class="section-head"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2>${sub ? `<p class="muted" style="margin:0">${sub}</p>` : ""}</div></div>`;
const emptyBox = (ic, t, p, btn = "") =>
  `<div class="empty"><div class="emoji">${icon(ic)}</div><h3>${t}</h3><p class="muted">${p}</p>${btn}</div>`;
const skeleton = () =>
  `<div class="food-grid">${'<div class="sk"></div>'.repeat(8)}</div>`;

/* ---------- Discovery Pages ---------- */
function home() {
  const u = cur();
  const greeting = u ? `<div class="eyebrow" style="margin-bottom:6px; font-weight:1000; color:var(--navy);font-size: clamp(15px, 1.3vw, 19px);">Hello, ${esc(u.name || u.email)}! 👋</div>` : "";

  return `<section class="hero"><div class="container"><div class="hero-panel"><div class="hero-copy">${greeting}<div class="eyebrow">Your city, your flavors</div><h1>Discover local food in <span style="color:var(--lavender)">Calbayog City.</span></h1><p>Find neighborhood food spots, explore their menus, and support the people behind your favorite local flavors.</p>

  <form class="searchbox" data-form="homeSearch" style="position:relative;">
    <span class="search-icon">${icon("search")}</span>
    <input name="q" id="homeSearchInput" autocomplete="off" placeholder="Search shops or food..." aria-label="Search shops or food">
    <button class="btn btn-primary" type="submit">Search</button>
    <div id="homeSearchSuggestions" class="suggestions-dropdown" style="display:none;"></div>
  </form>

  <div class="hero-actions" style="margin-top:15px"><button class="btn btn-primary" data-go="search">Explore food</button><button class="btn btn-ghost" data-go="shops">Browse all shops</button></div></div><div class="hero-image" role="img" aria-label="A delicious local meal"></div></div></div></section>
<section class="section"><div class="container">${pageTitle("Browse by craving", "Popular categories", "A quick way to discover something you will love.")}<div class="category-row">${[...DB.cats.slice(0, 5), { name: "All" }].map((c) => `<button class="category ${F.cat === c.name ? "selected" : ""}" data-act="cat" data-id="${esc(c.name)}"><span class="emoji">${icon(c.name === "All" ? "grid" : catIcon(c.name))}</span><strong>${c.name === "All" ? "All categories" : esc(c.name)}</strong></button>`).join("")}</div></div></section>`;
}

function prodPass(p) {
  const b = bz(p.bid);
  if (!b || !p.active) return false;
  const q = F.foodQ.toLowerCase(),
    c = cat(p.cat)?.name;
  if (F.cat !== "All" && c !== F.cat) return false;
  if (F.price === "low" && p.price >= 100) return false;
  if (F.price === "mid" && (p.price < 100 || p.price > 150)) return false;
  if (F.price === "high" && p.price <= 150) return false;
  
  return (
    bizOK(b) && (!q || `${p.name} ${b.name}`.toLowerCase().includes(q))
  );
}

function bizOK(b) {
  if (F.rate !== "0") {
    const r = avg(b.id);
    if (!r.n || r.a < +F.rate) return false;
  }
  if (F.open === "now" && !isOpen(b, nowT())) return false;
  if (F.open === "at" && (!F.time || !isOpen(b, F.time))) return false;
  return true;
}

function searchPage() {
  const L = DB.products.filter(prodPass);
  if (F.sort === "price") L.sort((a, b) => a.price - b.price);
  if (F.sort === "rating") L.sort((a, b) => avg(b.bid).a - avg(a.id).a);

  const isFiltered = F.foodQ !== "" || F.cat !== "All" || F.price !== "all" || F.rate !== "0" || F.open !== "";

  const chips = [];
  if (F.cat !== "All") chips.push(["cat", F.cat]);
  if (F.price !== "all")
    chips.push([
      "price",
      { low: "Under ₱100", mid: "₱100–₱150", high: "Above ₱150" }[F.price],
    ]);
  if (F.rate !== "0") chips.push(["rate", F.rate + "★ and up"]);
  if (F.open)
    chips.push([
      "open",
      F.open === "now" ? "Open now" : "Open at " + (F.time || "…"),
    ]);
  if (F.foodQ) chips.push(["q", "“" + F.foodQ + "”"]);

  const sel = (v, cur_) => (v === cur_ ? "selected" : "");
  const results = S.load
    ? skeleton()
    : L.length
      ? `<div class="food-grid" style="grid-template-columns:repeat(auto-fill, minmax(clamp(200px, 22vw, 260px), 1fr))">${L.slice(0, F.n).map(productCard).join("")}</div>${L.length > F.n ? `<p style="text-align:center;margin-top:18px"><button class="btn btn-ghost" data-act="more">Load more</button></p>` : ""}`
      : `<div class="empty"><div class="emoji">${icon("search")}</div><h3>No food found</h3><p class="muted">Try another keyword or clear one or more filters.</p><div class="chips" style="justify-content:center">${DB.cats
          .slice(0, 4)
          .map(
            (c) =>
              `<button data-act="cat" data-id="${esc(c.name)}">${esc(c.name)}</button>`,
          )
          .join("")}</div><button class="btn btn-soft" data-act="clear">Clear filters</button></div>`;

  return `<section class="section"><div class="container">
<div style="margin-bottom: 14px; display: ${isFiltered ? "flex" : "none"}; align-items: center;">
  <button class="btn" type="button" data-act="resetFoodSearch" title="Reset Search & Restore Original UI" style="background: var(--navy); color: #fff; width: 42px; height: 42px; border-radius: 12px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(211, 84, 0, 0.3); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
    ${icon("bold-arrow-left", "icon-lg")}
  </button>
</div>

<form class="searchbox" data-form="search" style="max-width:none;margin-bottom:22px;position:relative;">
  <span class="search-icon">${icon("search")}</span>
  <input name="q" id="searchInput" value="${esc(F.foodQ)}" autocomplete="off" placeholder="Try burger, rice meals, or a food item..." aria-label="Search food">
  <button class="btn btn-primary" type="submit">Search</button>
  <div id="searchSuggestions" class="suggestions-dropdown" style="display:none;"></div>
</form>

<aside class="panel filters-top-bar" style="margin-bottom: 22px;">
  <div class="results-head" style="margin-bottom: 12px;">
    <h3 style="margin:0; font-size:15px; display:flex; align-items:center; gap:6px;">${icon("tag")} Filters</h3>
    <button class="link" data-act="clear" style="font-size:13px;">Clear all</button>
  </div>
  <div class="filter-grid">
    <div class="field" style="margin:0;">
      <label for="fCat">Category</label>
      <select id="fCat" data-f="cat">
        <option value="All" ${sel("All", F.cat)}>All Categories</option>
        ${DB.cats.map((c) => `<option value="${esc(c.name)}" ${sel(c.name, F.cat)}>${esc(c.name)}</option>`).join("")}
      </select>
    </div>
    <div class="field" style="margin:0;">
      <label for="fPrice">Price range</label>
      <select id="fPrice" data-f="price">
        <option value="all">Any price</option>
        <option value="low" ${sel("low", F.price)}>Under ₱100</option>
        <option value="mid" ${sel("mid", F.price)}>₱100–₱150</option>
        <option value="high" ${sel("high", F.price)}>Above ₱150</option>
      </select>
    </div>
    <div class="field" style="margin:0;">
      <label for="fRate">Minimum rating (verified)</label>
      <select id="fRate" data-f="rate">
        <option value="0">Any rating</option>
        <option value="5" ${sel("5", F.rate)}>5</option>
        <option value="4" ${sel("4", F.rate)}>4</option>
        <option value="3" ${sel("3", F.rate)}>3</option>
        <option value="2" ${sel("2", F.rate)}>2</option>
        <option value="1" ${sel("1", F.rate)}>1</option>
      </select>
    </div>
    <div class="field" style="margin:0;">
      <label for="fOpen">Operating hours</label>
      <select id="fOpen" data-f="open">
        <option value="">Any time</option>
        <option value="now" ${sel("now", F.open)}>Open now</option>
        <option value="at" ${sel("at", F.open)}>Open at…</option>
      </select>
    </div>
    ${F.open === "at" ? `<div class="field" style="margin:0;"><label>Select Time</label><input type="time" data-f="time" value="${F.time}"></div>` : ""}
  </div>
</aside>

<div>
  <div class="results-head">
    <div><strong>${L.length} results</strong><div class="muted" style="font-size:12px">${F.foodQ ? `For “${esc(F.foodQ)}”` : "Local food in Calbayog City"}</div></div>
    <select data-f="sort" class="field" style="margin:0;width:auto;padding:8px 12px;border:1px solid var(--line);border-radius:9px;font-size:13px;"><option value="relevance">Sort: Recommended</option><option value="price" ${sel("price", F.sort)}>Price: low to high</option><option value="rating" ${sel("rating", F.sort)}>Highest rated</option></select>
  </div>
  ${chips.length ? `<div class="chips" style="margin-bottom:16px;">${chips.map((c) => `<button data-act="unchip" data-id="${c[0]}">${esc(c[1])} ×</button>`).join("")}</div>` : ""}
  ${results}
</div>
</div></section>`;
}
function shopsLocationMap(shopCount) {
  const mapURL =
    "https://www.google.com/maps?q=12.0667,124.6000&z=13&output=embed";

  const directionsURL =
    "https://www.google.com/maps/dir/?api=1&destination=12.0667,124.6000";

  return `
    <aside class="shops-location-map">
      <div class="shops-map-header">
        <div class="shops-map-icon">📍</div>

        <div class="shops-map-heading">
          <h3>Explore Local Shops</h3>
          <p>Discover food spots in your city</p>
        </div>
      </div>

      <div class="shops-map-frame">
        <iframe
          src="${mapURL}"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          title="Map of Calbayog City, Samar">
        </iframe>
      </div>

      <div class="shops-map-location">
        <span class="shops-map-dot"></span>

        <div>
          <strong>Calbayog City, Samar</strong>
          <small>${shopCount} local shops listed</small>
        </div>
      </div>

      <a
        class="shops-map-directions"
        href="${directionsURL}"
        target="_blank"
        rel="noopener noreferrer">
        View Location on Google Maps →
      </a>

      <div class="shops-map-footer">
        Support local. Eat local. Love local.
      </div>
    </aside>
  `;
}
function shopsPage() {
  const q = F.shopsQ.toLowerCase();

  const L = DB.businesses.filter(
    (b) =>
      bizOK(b) &&
      (
        !q ||
        b.name.toLowerCase().includes(q) ||
        (b.address || "").toLowerCase().includes(q)
      )
  );

  if (F.sort === "rating") {
    L.sort((a, b) => avg(b.id).a - avg(a.id).a);
  }

  const isFiltered = F.shopsQ !== "";

  return `
    <section class="section">
      <div class="container">

        <div class="shops-page-layout">

          <!-- LEFT SIDE: SHOP LIST -->
          <div class="shops-list-content">

            <div style="
              margin-bottom:14px;
              display:${isFiltered ? "flex" : "none"};
              align-items:center;
            ">
              <button
                class="btn"
                type="button"
                data-act="resetShopsSearch"
                title="Reset Search"
                style="
                  background:var(--navy);
                  color:#fff;
                  width:42px;
                  height:42px;
                  border-radius:12px;
                  padding:0;
                  display:inline-flex;
                  align-items:center;
                  justify-content:center;
                  border:none;
                  cursor:pointer;
                ">
                ${icon("bold-arrow-left", "icon-lg")}
              </button>
            </div>

            <form
              class="searchbox"
              data-form="searchShops"
              style="
                max-width:none;
                margin-bottom:22px;
                position:relative;
              ">

              <span class="search-icon">
                ${icon("search")}
              </span>

              <input
                name="q"
                id="shopsSearchInput"
                value="${esc(F.shopsQ)}"
                autocomplete="off"
                placeholder="Search shops by name or address..."
                aria-label="Search shops">

              <button class="btn btn-primary" type="submit">
                Search
              </button>

              <div
                id="shopsSearchSuggestions"
                class="suggestions-dropdown"
                style="display:none;">
              </div>
            </form>

            <div class="results-head">
              <div>
                <strong>${L.length} local shops found</strong>
              </div>
            </div>

            ${
              L.length
                ? `<div class="food-grid">
                    ${L.map(shopCard).join("")}
                  </div>`
                : emptyBox(
                    "store",
                    "No shops found",
                    "Try searching for a different shop name or clear search.",
                    `<button class="btn btn-soft" data-act="clear">Clear search</button>`
                  )
            }

          </div>

          <!-- RIGHT SIDE: ONE SHARED LOCATION MAP -->
          <div class="shops-map-sidebar">
            ${shopsLocationMap(DB.businesses.filter(bizOK).length)}
          </div>

        </div>

      </div>
    </section>
  `;
}
function individualShopLocationMap(shop) {
  const address = shop.address
    ? `${shop.address}, Calbayog City, Samar, Philippines`
    : "Calbayog City, Samar, Philippines";

  const mapQuery = encodeURIComponent(address);

  const mapURL =
    `https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`;

  const directionsURL =
    `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  return `
    <div class="individual-shop-location">

      <div class="individual-map-header">
        <div class="individual-map-icon">📍</div>

        <div>
          <h3>Find This Shop</h3>
          <p>Visit us in Calbayog City, Samar</p>
        </div>
      </div>

      <div class="individual-map-frame">
        <iframe
          src="${mapURL}"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          title="Location of ${esc(shop.name)}">
        </iframe>
      </div>

      <div class="individual-map-details">
        <span class="individual-map-dot"></span>

        <div>
          <strong>${esc(shop.name)}</strong>
          <small>${esc(address)}</small>
        </div>
      </div>

      <a
        href="${directionsURL}"
        target="_blank"
        rel="noopener noreferrer"
        class="individual-map-directions">
        Get Directions →
      </a>

    </div>
  `;
}
function shopPage(id) {
  const b = bz(id);
  if (!b)
    return emptyBox(
      "store",
      "Shop not found",
      "This listing may have been removed.",
      `<button class="btn btn-primary" data-go="home">Back home</button>`
    );

  if (S.shopTab === "Overview") S.shopTab = "Menu";

  const P = DB.products.filter((p) => p.bid === b.id && p.active),
    R = DB.ratings
      .filter((r) => r.bid === b.id && r.verified)
      .sort((a, c) => c.at - a.at),
    im = bImg(b),
    t = S.shopTab;

  const u = cur();
  const backTarget = u && u.role === "business_owner" ? "owner" : "shops";

  const menu = P.length
    ? `<div class="food-grid">${P.map(productCard).join("")}</div>`
    : emptyBox(
        "utensils",
        "No products listed yet",
        "This shop has not added its menu."
      );
  const info = `<p>${icon("store")} ${esc(b.address || "Address not set")}<br>${icon("phone")} ${esc(b.contact || "—")}<br>${icon("clock")} ${esc(b.hours || "—")}</p>`;

  const body =
    t === "Reviews"
      ? `<div class="panel"><div class="results-head"><div><h3 style="margin:0">Customer feedback</h3><div>${rateHtml(b.id)}</div></div><button class="btn btn-primary" data-go="review/${b.id}">Write a review</button></div><div class="notice">Verified Purchase feedback is linked to a valid receipt code issued by this shop.</div>${R.length ? R.map((r) => `<div class="rev"><span class="stars">${icon("star")} ${r.score}</span> <span class="vp">${icon("shield")} Verified Purchase</span><p>${esc(r.comment || "")}</p><span class="muted">${new Date(r.at).toLocaleDateString()}</span></div>`).join("") : `<p class="muted">No verified feedback yet.</p>`}</div>`
      : t === "About"
        ? `<div class="panel"><h3>About ${esc(b.name)}</h3><p>${esc(b.desc)}</p>${info}</div>`
        : menu;

  return `<section class="section">
    <div class="container">
      <div style="margin-bottom: 16px;">
        <button class="btn shop-back-btn" type="button" data-go="${backTarget}" aria-label="Go back">
          ${icon("bold-arrow-left", "icon-lg")}
        </button>
      </div>

      <div class="shop-cover">${photo(im, b.name + " cover photo")}</div>
      <div class="shop-title-row" style="background:#ffffff; border-radius:12px; padding:22px 28px; box-shadow:0 2px 10px rgba(0,0,0,0.06); margin-top:-30px; position:relative; z-index:2; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="eyebrow" style="font-size:13px; font-weight:700; letter-spacing:0.5px; margin-bottom:2px;">Local business</div>
          <h2 style="margin:4px 0; font-size:28px; font-weight:800; line-height:1.2;">${esc(b.name)}</h2>
          <div class="muted">${rateHtml(b.id)}</div>
        </div>
        <button class="btn btn-primary" data-act="visit" data-id="${b.id}" style="font-size:13px; flex-shrink:0;">Visit main page ${icon("store")}</button>
      </div>
           <div class="shop-content-layout">

        <div class="shop-content-main">
          <div class="tabs">
            ${["Menu", "Reviews", "About"].map((x) =>
              `<button class="${t === x ? "active" : ""}" data-act="stab" data-id="${x}">${x}</button>`
            ).join("")}
          </div>

          <div class="shop-content-body">
            ${body}
          </div>
        </div>

        <aside class="shop-location-sidebar">
          ${individualShopLocationMap(b)}
        </aside>

      </div>
    </div>
  </section>`;
}

function updNav() {
  const u = cur(),
    el = $("#navActions");
  if (!el) return;

  const [page] = (location.hash.slice(1) || "home").split("/");

  if (u && (page === "admin" || (page === "owner" && page !== "profile") || page === "shop")) {
    el.innerHTML = "";
    return;
  }

  if (u && page === "profile" && u.role !== "normal_user") {
    el.innerHTML = "";
    return;
  }

  if (u) {
    let accountDisplay = "";
    if (u.role === "normal_user") {
      const avatarContent = u.avatar
        ? `<img src="${esc(u.avatar)}" alt="Profile">`
        : icon("user");
      accountDisplay = `<button class="btn btn-ghost topbar-profile-btn" data-go="${dashPath(u)}" aria-label="" style="padding:4px; display:inline-flex; align-items:center; justify-content:center; border-radius:50%;">
        <span class="topbar-avatar">${avatarContent}</span>
      </button>`;
    } else {
      accountDisplay = `<button class="btn btn-ghost" data-go="${dashPath(u)}">Dashboard</button>`;
    }
    el.innerHTML = `${accountDisplay}`;
  } else {
    el.innerHTML = `<button class="btn btn-primary" data-go="login">Log in</button><button class="btn btn-ghost" data-go="signup">Sign up</button>`;
  }
}
/* ---------- QuickView Modal ---------- */
function openQuickView(id) {
  const p = prod(id),
    b = p && bz(p.bid);
  if (!p || !b) return;

  S.modalStars = 5;
  const modal = $("#quickViewModal");
  const modalBody = $("#modalBody");
  const u = cur(); // Get the currently logged-in user session
  const R = DB.ratings
    .filter((r) => r.bid === b.id && r.verified)
    .sort((a, c) => c.at - a.at);

  const starButtons = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<button type="button" data-act="modalStar" data-id="${n}" style="background:none; border:none; font-size:16px; cursor:pointer; padding:0 1px; color:${
          n <= S.modalStars ? "#f59e0b" : "#cbd5e1"
        };">★</button>`
    )
    .join("");

  // Show finished reviews for everyone, but place the small login button inline after the period if not logged in
  let reviewInputSection = "";
  if (u && u.role === "normal_user") {
    reviewInputSection = `
      <form class="modal-review-form" data-form="reviewModal" data-bid="${b.id}" style="margin-top: 10px; margin-bottom: 12px;">
        <details class="modal-review-details" style="background: #fdf8f6; border: 1px solid #f2e2d0; border-radius: 10px; padding: 10px;">
          <summary style="font-size: 12px; font-weight: 700; cursor: pointer; color: var(--navy); display: flex; justify-content: space-between; align-items: center;">
            <span>▼ Write Verified Review</span>
            <span id="modalStarGroup" style="display: inline-flex; align-items: center;">
              ${starButtons} (<span id="modalStarNum">${S.modalStars}</span>/5)
            </span>
          </summary>
          <div style="display: flex; gap: 8px; margin-top: 8px; margin-bottom: 8px;">
            <input name="vc" maxlength="12" placeholder="Enter In-Store Receipt Code" style="flex: 1; padding: 7px 10px; font-size: 12px; border: 1px solid var(--line); border-radius: 8px;" required>
            <span class="pill" style="font-size: 10px; align-self: center;">Required</span>
          </div>
          <textarea name="cm" placeholder="How was your actual dining experience?" style="width: 100%; height: 55px; font-size: 12px; padding: 8px; border: 1px solid var(--line); border-radius: 8px; resize: none; margin-bottom: 8px;"></textarea>
          <div class="err" id="modalEr" style="font-size: 11px; margin-bottom: 6px;"></div>
          <button class="btn btn-primary btn-small" style="width: 100%; border-radius: 8px;">Submit Verified Review</button>
        </details>
      </form>
    `;
  } else {
    reviewInputSection = `
      <div style="background: #fdf8f6; border: 1px solid #f2e2d0; border-radius: 10px; padding: 10px; margin-top: 10px; margin-bottom: 12px; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: var(--navy); font-weight: 600; line-height: 1.5;">
          Want to submit a verified review? Please log in to your account. 
          <button class="btn btn-primary btn-small" data-act="modalLogin" style="border-radius: 6px; font-size: 10px; padding: 2px 8px; margin-left: 4px; display: inline-flex; vertical-align: baseline;">Log in</button>
        </p>
      </div>
    `;
  }

  const reviewsContent = `
    <div class="modal-reviews-section" style="border-top: 1px solid var(--line); padding-top: 12px; margin-top: 12px;">
      <div class="modal-reviews-head" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <strong style="font-size: 13px; color: var(--navy);">Verified Customer Reviews</strong>
        <span style="font-size: 12px;" class="muted">${rateHtml(b.id)}</span>
        <span class="pill" style="margin-left: auto; font-size: 10px; background: #e3f4e4; color: #1b6b25;">In-Store Protected</span>
      </div>

      ${reviewInputSection}

      <div class="modal-review-list" style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
        ${
          R.length
            ? R.map(
                (r) => {
                  const reviewUser = DB.users.find((x) => x.id === r.uid);
                  const displayName = reviewUser ? reviewUser.name : "Verified Customer";
                  const avatarHtml = reviewUser && reviewUser.avatar
                    ? `<img src="${esc(reviewUser.avatar)}" alt="${esc(displayName)}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">`
                    : `<div style="width:24px; height:24px; border-radius:50%; background:var(--lavender-pale); display:grid; place-items:center; font-size:11px;">${icon("user")}</div>`;

                  return `
          <div class="modal-rev-item" style="background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 8px 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                ${avatarHtml}
                <span>${esc(displayName)} <span class="vp" style="font-size: 9px; padding: 1px 5px;">Verified Customer</span></span>
              </span>
              <span class="stars" style="font-size: 12px;">★ ${Number(r.score).toFixed(1)}</span>
            </div>
            <p style="margin: 4px 0 2px; font-size: 11px; color: #4b5563;">${esc(r.comment || "No comment provided.")}</p>
            <span class="muted" style="font-size: 10px;">${new Date(r.at).toISOString().split("T")[0]}</span>
          </div>
        `;
                }
              ).join("")
            : `<p class="muted" style="font-size: 11px; text-align: center; padding: 8px 0;">No verified reviews yet.</p>`
        }
      </div>
    </div>
  `;

  modalBody.innerHTML = `
    <div class="modal-hero">
      ${photo(p.img, p.name)}
      <span class="tag">${esc(cat(p.cat)?.name)}</span>
    </div>
    <div class="modal-content">
      <div class="modal-header-row">
        <h2>${esc(p.name)}</h2>
        <span class="modal-price">${money(p.price)}</span>
      </div>
      <p class="muted" style="margin: 0 0 14px; font-size: 13px;">${esc(p.desc)}</p>
      
      <div class="modal-shop-card">
        <h4>${icon("store")} ${esc(b.name)}</h4>
        <div class="modal-shop-info">
          <div>📍 ${esc(b.address || "Calbayog City")}</div>
          <div>📞 ${esc(b.contact || "N/A")}</div>
          <div>⏰ ${esc(b.hours || "Hours not set")}</div>
          <div style="margin-top: 6px;">
            <button type="button" class="link" data-act="viewShopDetails" data-id="${b.id}" style="font-size: 12px; border: none; background: none; cursor: pointer; padding: 0;">View Shop →</button>
          </div>
        </div>
      </div>

      ${reviewsContent}
    </div>
  `;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}



function closeModal() {
  const modal = $("#quickViewModal");
  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
}

/* ---------- Auth Flow ---------- */
function auth(type, arg) {
  const C = {
    signup: [
      "Create your account",
      "One page for everyone. Shop owners and admins: enter your email and password to continue.",
      "Continue",
    ],
    login: [
      "Welcome back",
      "Log in to continue exploring local food.",
      "Log in",
    ],
    otp: [
      "Verify your mobile number",
      "Enter the 6-digit code sent to your phone. It is valid for 5 minutes.",
      "Verify code",
    ],
    forgot: [
      "Reset your password",
      "We will send password reset instructions to your registered email.",
      "Send reset link",
    ],
    reset: [
      "Choose a new password",
      "Create a new password and confirm it below.",
      "Save new password",
    ],
  }[type];

  const inp = (n, l, t = "text", ph = "") =>
    field(
      l,
      t === "password"
        ? `<div class="password-wrap">
             <input name="${n}" type="password" placeholder="${ph}">
             <button type="button" class="password-toggle" data-act="togglePassword" aria-label="Show password">Show</button>
           </div>`
        : `<input name="${n}" type="${t}" placeholder="${ph}">`
    );

  let f = "";
  if (type === "signup")
    f =
      inp("name", "Full name (new customers)", "text", "Enter your full name") +
      inp("e", "Email address", "email", "you@example.com") +
      inp("m", "Mobile number (new customers)", "tel", "09XX XXX XXXX") +
      inp("p", "Password", "password", "At least 8 characters") +
      inp("c", "Confirm password (new customers)", "password", "Re-enter password") +
      `<label class="checkline"><input type="checkbox" name="t"> I agree to the Terms and Privacy Policy (new customers).</label>`;

  if (type === "login")
    f =
      inp("e", "Email address", "email", "you@example.com") +
      inp("p", "Password", "password", "Enter your password") +
      `<div style="text-align:right;margin-bottom:15px"><a class="link" href="#forgot">Forgot password?</a></div>`;

  if (type === "otp")
    f = !S.otp
      ? ""
      : `<div class="mail">Demo SMS to <b>${esc(S.otp.mobile)}</b>: your ClickBites code is <b>${S.sms}</b></div>` +
        inp("o", "6-digit verification code", "text", "123456") +
        `<button class="btn btn-ghost btn-small" type="button" data-act="resend">Resend code</button>`;

  if (type === "forgot")
    f = field("Registered mobile number", `<input name="m" type="tel" placeholder="09XX XXX XXXX">`);

  if (type === "reset" || type === "reset-sms")
    f =
      inp("p", "New password", "password", "At least 8 characters") +
      inp("c", "Confirm new password", "password", "Re-enter new password");

  const mail =
    type === "forgot" && S.otp && S.otp.purpose === "forgot"
      ? `<div class="mail">Demo SMS to <b>${esc(S.otp.mobile)}</b>: your password reset code is <b>${S.sms}</b></div>`
      : "";

  const foot = {
    signup: `Already have an account? <a class="link" href="#login">Log in</a>`,
    login: `New to ClickBites? <a class="link" href="#signup">Create an account</a><br>Demo: admin@clickbites.ph / admin123 · owner1@demo.ph / owner123 · customer@demo.ph / customer123`,
    otp: `Wrong number? <a class="link" href="#signup">Go back</a>`,
    forgot: `Remembered it? <a class="link" href="#login">Log in</a>`,
    reset: `<a class="link" href="#login">Back to log in</a>`,
  }[type];

  return `<section class="container"><div class="auth-wrap"><aside class="auth-aside"><div><div class="brand"><span class="brand-mark"><img src="logo.jpg" alt=""></span><span>Click<span style="color:var(--lavender)">Bites</span></span></div><h2 style="margin-top:35px">Support local.<br>Eat local.<br>Love local.</h2><p>Discover the food and people that make Calbayog City special.</p></div><div class="art">${icon("utensils")}</div><small>Food discovery starts here.</small></aside><div class="auth-card"><div class="eyebrow">ClickBites account</div><h2>${C[0]}</h2><p class="muted">${C[1]}</p><form data-form="${type}" ${type === "reset" ? `data-token="${esc(arg)}"` : ""} novalidate>${f}<div class="err" id="er"></div><button class="btn btn-primary" style="width:100%;margin-top:5px" ${type === "otp" && !S.otp ? "disabled" : ""}>${C[2]}</button></form>${mail}<p class="form-note" style="margin-top:18px">${foot}</p></div></div></section>`;
}

function sendOtp(purpose, mobile, payload) {
  const now = Date.now(),
    L = (DB.sends[mobile] || []).filter((t) => now - t < 36e5);
  if (S.otp && S.otp.mobile === mobile && now - S.otp.sent < 6e4)
    return err(`Please wait ${Math.ceil((6e4 - (now - S.otp.sent)) / 1e3)}s before requesting a new code.`);
  if (L.length >= 3)
    return err("Too many codes requested for this number. Try again in an hour.");
  const code = rnd("0123456789", 6);
  L.push(now);
  DB.sends[mobile] = L;
  save();
  S.otp = { purpose, mobile, code, exp: now + 3e5, tries: 0, sent: now, payload };
  S.sms = code;
  go("otp");
}

async function login(e, p) {
  const u = DB.users.find((x) => x.email === e);
  if (!u || u.pw !== (await sha(p))) return "Invalid email or password.";
  if (!u.active)
    return "This account is suspended. Please contact the administrator.";
  DB.session = { uid: u.id, last: Date.now() };
  save();
  updNav();
  go(dashPath(u));
  return "";
}

/* ---------- Review Page ---------- */
function reviewPage(id) {
  const u = cur(),
    b = bz(id) || DB.businesses[0],
    ex = u && DB.ratings.find((r) => r.uid === u.id && r.bid === b.id);
  S.stars = ex ? ex.score : 0;
  const stars = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<button type="button" data-act="star" data-id="${n}" class="${n <= S.stars ? "active" : ""}" aria-label="Rate ${n} stars">★</button>`
    )
    .join("");

  return `<section class="section"><div class="container" style="max-width:850px">${pageTitle("Share your experience", ex ? "Edit your review" : "Review a local shop", "Verified feedback helps people discover trusted local businesses.")}<div class="grid-two"><form class="panel" data-form="review">${field("Choose a shop", `<select name="b" data-act="pickshop">${DB.businesses.map((s) => `<option value="${s.id}" ${s.id === b.id ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select>`)}<label style="font-weight:700">Your rating</label><div class="review-stars">${stars}</div>${field("Comment (optional)", `<textarea name="cm" maxlength="500" placeholder="What was your experience?">${esc(ex?.comment)}</textarea>`)}${ex ? `<div class="notice">You already rated this shop. You can edit your rating without a new code.</div>` : field("Verification code from receipt", `<input name="vc" maxlength="12" autocomplete="off" style="text-transform:uppercase" placeholder="Enter 8-character code">`)}<div class="err" id="er"></div><button class="btn btn-primary">${ex ? "Save changes" : "Submit review"}</button>${u ? "" : `<p class="form-note">You need to <a class="link" href="#login">log in</a> as a customer to submit feedback.</p>`}</form><aside class="panel"><h3>How verified reviews work</h3><p>01 · Visit a participating shop.</p><p>02 · Keep your receipt with the verification code.</p><p>03 · Sign in to your account.</p><p>04 · Enter the code and submit your rating.</p><div class="notice">The server checks your account, the shop, code expiry and single-use status. A successful review gets a Verified Purchase label.</div></aside></div></div></section>`;
}

function submitReview(f) {
  const u = cur(),
    E = (m) => ($("#er").textContent = m) && false;
  if (!u) return go("login") || toast("Please log in to review a shop.", "er");
  if (u.role !== "normal_user")
    return E("Only customer accounts can submit feedback.");
  const bid = f.b.value,
    comment = f.cm.value.trim(),
    ex = DB.ratings.find((r) => r.uid === u.id && r.bid === bid);
  if (!S.stars) return E("Please choose a star rating.");
  if (ex) {
    ex.score = S.stars;
    ex.comment = comment;
    save();
    toast("Your review was updated.");
    return go("shop/" + bid);
  }
  const raw = f.vc.value.trim().toUpperCase().replace(/\s/g, ""),
    now = Date.now();
  if (!u.ucid) return E("Your account has no Unique Customer ID.");
  if (!raw) return E("Please enter the code from your receipt.");
  u.fails = (u.fails || []).filter((t) => now - t < 36e5);
  if (u.fails.length >= 3)
    return E(`Too many wrong codes. Try again in ${Math.ceil((36e5 - (now - u.fails[0])) / 6e4)} minute(s).`);
  const c = DB.codes.find((x) => x.code === raw);
  const why = !c
    ? "That code does not exist."
    : c.bid !== bid
      ? "That code was issued by a different shop."
      : c.voidedAt
        ? "That code was voided by the shop."
        : c.usedAt
          ? "That code was already used."
          : c.expires < now
            ? "That code has expired (codes last 24 hours)."
            : "";
  if (why) {
    u.fails.push(now);
    save();
    return E(why + " Nothing was saved and the code stays unused.");
  }
  c.usedAt = now;
  c.usedBy = u.id;
  DB.ratings.push({
    id: uid(),
    uid: u.id,
    bid,
    ucid: u.ucid,
    score: S.stars,
    comment,
    verified: true,
    at: now,
    codeId: c.id,
  });
  save();
  toast("Verified feedback saved. Thank you!");
  S.shopTab = "Reviews";
  go("shop/" + bid);
}

function profilePage(tab = "profile") {
  const u = cur(),
    sv = DB.products.filter((p) => savedSet().has(p.id) && bz(p.bid)),
    R = DB.ratings.filter((r) => r.uid === u.id);

  const T = [["profile", "My profile", "user"]];
  if (u.role === "normal_user") {
    T.push(["saved", "Saved food", "heart"]);
    T.push(["feedback", "My feedback", "review"]);
  }
  T.push(["password", "Change password", "settings"]);

  let h = "";

  if (tab === "profile") {
    const photoSection = u.role === "admin" ? `
      <div class="profile-avatar">
        ${u.avatar ? `<img src="${esc(u.avatar)}" alt="Profile picture">` : icon("user")}
      </div>
    ` : `
      <div class="profile-avatar-wrapper" style="position:relative; display:inline-block;">
        <div class="profile-avatar">
          ${u.avatar ? `<img src="${esc(u.avatar)}" alt="Profile picture">` : icon("user")}
        </div>
        <label class="profile-badge-upload" title="Upload photo" style="position:absolute; bottom:0; right:0; background:var(--navy); color:#fff; border-radius:50%; width:28px; height:28px; display:grid; place-items:center; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.2);">
          +
          <input type="file" id="profilePhotoInput" accept="image/*" hidden>
        </label>
      </div>
    `;

    h = `<div class="panel">
<div class="profile-header" style="align-items:center; gap:16px;">
  ${photoSection}
  <div>
    <h3 style="margin-bottom:4px">${esc(u.name || u.email)}</h3>
    <p class="muted" style="margin:0">
      ${u.ucid ? `Customer ID: <b>${u.ucid}</b>` : ""}
    </p>
    ${u.role !== "admin" && u.avatar ? `
      <div class="profile-photo-actions" style="margin-top:8px;">
        <button type="button" class="link" data-act="removeAvatar" style="font-size:12px; color:#b3261e; background:none; border:none; cursor:pointer; padding:0;">Remove photo</button>
      </div>
    ` : ""}
  </div>
</div>
</div>
      <form data-form="profile" style="margin-top:20px;">
        ${field("Full name", `<input name="n" value="${esc(u.name)}">`)}
        ${field("Email address", `<input name="e" type="email" value="${esc(u.email)}">`)}
        ${u.role === "normal_user" ? field("Mobile number", `<input name="m" value="${esc(u.mobile)}">`) : ""}
        ${field("Current password (needed to change email or mobile)", `<input name="cp" type="password">`)}
        <div class="err" id="er"></div>
        <button class="btn btn-primary">Save profile</button>
      </form>
    </div>`;
  } else if (tab === "saved" && u.role === "normal_user") {
    h = `<div class="panel">
      <h3>Saved food (${sv.length})</h3>
      ${
        sv.length
          ? `<div class="food-grid" style="grid-template-columns:repeat(auto-fill, minmax(220px, 1fr))">${sv.map(productCard).join("")}</div>`
          : `<p class="muted">Tap the heart on any food to save it.</p><button class="btn btn-soft btn-small" data-go="search">Explore food</button>`
      }
    </div>`;
  } else if (tab === "feedback" && u.role === "normal_user") {
    h = `<div class="panel">
      <h3>My feedback</h3>
      ${
        R.length
          ? R.map(
              (r) => `<div class="rev">
                <b>${esc(bz(r.bid)?.name || "(removed shop)")}</b> 
                <span class="stars">${icon("star")} ${r.score}</span> 
                <span class="status verified">${r.verified ? "Verified" : "Pending"}</span>
                <p>${esc(r.comment)}</p>
                <span class="muted">${fd(r.at)}</span> · <a class="link" href="#review/${r.bid}">Edit</a>
              </div>`
            ).join("")
          : `<p class="muted">You have not reviewed a shop yet.</p><button class="btn btn-soft btn-small" data-go="review">Review a shop</button>`
      }
    </div>`;
  } else if (tab === "password") {
    h = `<div class="panel">
      <h3>Change password</h3>
      <form data-form="pw">
        ${field("Current password", `<input name="o" type="password">`)}
        ${field("New password", `<input name="p" type="password">`)}
        ${field("Confirm new password", `<input name="c" type="password">`)}
        <div class="err" id="er2"></div>
        <button class="btn btn-ghost">Change password</button>
      </form>
    </div>`;
  }

  const accountTypeTitle = 
    u.role === "admin" ? "Admin Account" :
    u.role === "business_owner" ? "Business Owner Account" : 
    "Customer Account";

  const backButtonHtml = u.role !== "normal_user" ? `
    <div style="margin-bottom: 14px;">
      <button class="btn" type="button" data-go="${dashPath(u)}" aria-label="Back to dashboard" style="background: var(--navy); color: #fff; width: 42px; height: 42px; border-radius: 12px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(211, 84, 0, 0.3); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
        ${icon("bold-arrow-left", "icon-lg")}
      </button>
    </div>
  ` : "";

  return `<section class="container dashboard">
    ${side("profile", T, tab)}
    <div class="dash-main">
      ${backButtonHtml}
      ${h}
    </div>
  </section>`;
}

/* ---------- Dashboards ---------- */
const side = (base, items, tab) =>
  `<aside class="sidebar"><div class="brand"><span class="brand-mark"><img src="logo.jpg" alt=""></span><span>ClickBites</span></div>${items.map(([k, l, ic]) => `<a href="#${base}/${k}" class="${tab === k ? "active" : ""}">${icon(ic)} ${l}</a>`).join("")}<a href="#" class="out" data-act="logout">${icon("logout")} Log out</a></aside>`;

const stat = (l, v, s = "") =>
  `<div class="stat"><span>${l}</span><strong>${v}</strong><span>${s}</span></div>`;

const cstat = (c) =>
  c.usedAt
    ? "used"
    : c.voidedAt
      ? "voided"
      : c.expires < Date.now()
        ? "expired"
        : "unused";

const table = (head, rows, empty) =>
  `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.join("") || `<tr><td colspan="${head.length}" class="muted">${empty}</td></tr>`}</tbody></table></div>`;

const dashHead = (eyebrow, title, sub, btn = "") =>
  `<div class="dash-header"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2><p class="muted" style="margin:0">${sub}</p></div>${btn}</div>`;

const codeForm = () =>
  `<div class="panel">
    <h3>Generate receipt code</h3>
    <p class="muted">One code per genuine customer transaction. Write it on the receipt or let the customer scan the QR code. Valid 24 hours, single use.</p>
    <form data-form="code">
      <button class="btn btn-primary">Generate code</button>
    </form>
    ${
      S.newCode
        ? `<div style="margin-top:18px; text-align:center; padding:16px; background:var(--cream); border:1px dashed var(--line); border-radius:12px;">
            <div class="codebig" style="margin-bottom:0;">${S.newCode}</div>
           </div>`
        : ""
    }
  </div>`;

function ownerDash(tab = "dashboard") {
  const b = myShop(),
    T = [
      ["dashboard", "Dashboard", "chart"],
      ["shop", "My shop", "store"],
      ["products", "Products", "list"],
      ["codes", "Verification codes", "receipt"],
      ["reviews", "Reviews", "review"],
      ["settings", "Settings", "settings"],
    ];
  if (!b)
    return emptyBox(
      "store",
      "No shop linked",
      "Please contact the administrator."
    );
  const P = DB.products.filter((p) => p.bid === b.id),
    C = DB.codes
      .filter((c) => c.bid === b.id)
      .sort((a, c) => c.created - a.created),
    R = DB.ratings.filter((r) => r.bid === b.id && r.verified);
  let h = "";
  if (tab === "dashboard")
    h = `<div class="stats">${stat("Average rating", avg(b.id).n ? avg(b.id).a.toFixed(1) + " ★" : "—", "Verified feedback only")}${stat("Verified reviews", R.length)}${stat("Products", P.length, P.filter((p) => p.active).length + " published")}${stat("Unused codes", C.filter((c) => cstat(c) === "unused").length)}</div><div class="grid-two">${codeForm()}<div class="panel"><h3>Recent products</h3>${table(
      ["Product", "Price", "Status"],
      P.slice(0, 5).map(
        (p) =>
          `<tr><td>${esc(p.name)}</td><td>${money(p.price)}</td><td><span class="status">${p.active ? "Published" : "Hidden"}</span></td></tr>`
      ),
      "No products yet."
    )}<button class="btn btn-soft btn-small" style="margin-top:12px" data-go="owner/products">Manage products</button></div></div>`;
  
    if (tab === "shop")
    h = `<div class="panel"><form data-form="shop">${[
      ["name", "Shop name"],
      ["address", "Address"],
      ["contact", "Contact"],
      ["hours", "Hours (display text)"],
      ["link", "Main page link (https://…)"],
    ]
      .map(([k, l]) => field(l, `<input name="${k}" value="${esc(b[k])}">`))
      .join("")}<div class="row">${field("Opens", `<input name="opens" type="time" value="${b.opens}">`)}${field("Closes", `<input name="closes" type="time" value="${b.closes}">`)}</div>${field("Description", `<textarea name="desc">${esc(b.desc)}</textarea>`)}${field("Cover image (compressed to WebP; leave empty to keep)", `<input name="i" type="file" accept="image/*">`)}<div class="err" id="er"></div><button class="btn btn-primary">Save shop</button></form></div>`;
  if (tab === "products") {
    const e = prod(S.edit);
    h = `<div class="panel"><h3>${e ? "Edit" : "Add"} product</h3><form data-form="product">${field("Product name", `<input name="n" value="${esc(e?.name)}">`)}${field("Description", `<textarea name="d">${esc(e?.desc)}</textarea>`)}<div class="row">${field("Price (₱)", `<input name="p" type="number" min="0" step="0.01" value="${e ? e.price : ""}">`)}${field("Category", `<select name="c">${DB.cats.map((c) => `<option value="${c.id}" ${e?.cat === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select>`)}</div>${field("Photo (compressed to WebP)" + (e ? " – leave empty to keep current" : ""), `<input name="i" type="file" accept="image/*">`)}<div class="err" id="er"></div><button class="btn btn-primary">${e ? "Save product" : "Add product"}</button> ${e ? `<button type="button" class="btn btn-ghost" data-act="canceledit">Cancel</button>` : ""}</form></div><div class="panel" style="margin-top:18px">${table(
      ["Product", "Category", "Price", "Status", "Action"],
      P.map(
        (p) =>
          `<tr><td>${esc(p.name)}</td><td>${esc(cat(p.cat)?.name)}</td><td>${money(p.price)}</td><td><span class="status">${p.active ? "Published" : "Hidden"}</span></td><td><button class="btn btn-ghost btn-small" data-act="editp" data-id="${p.id}">Edit</button> <button class="btn btn-ghost btn-small" data-act="togp" data-id="${p.id}">${p.active ? "Hide" : "Show"}</button> <button class="btn btn-danger btn-small" data-act="delp" data-id="${p.id}">Delete</button></td></tr>`
      ),
      "No products yet."
    )}</div>`;
  }
  if (tab === "codes")
    h = `${codeForm()}<div class="panel" style="margin-top:18px">${table(
      ["Code", "Reference", "Status", "Created", "Expires", "Used", ""],
      C.map((c) => {
        const s = cstat(c);
        return `<tr><td><b>${c.code}</b></td><td>${esc(c.ref)}</td><td><span class="status ${s}">${s}</span></td><td>${fd(c.created)}</td><td>${fd(c.expires)}</td><td>${c.usedAt ? fd(c.usedAt) : "—"}</td><td>${s === "unused" ? `<button class="btn btn-danger btn-small" data-act="voidc" data-id="${c.id}">Void</button>` : ""}</td></tr>`;
      }),
      "No codes yet."
    )}<p class="form-note">The customer's identity is never shown to the shop.</p></div>`;
  if (tab === "reviews")
    h = `<div class="panel"><h3>Verified feedback</h3><div>${rateHtml(b.id)}</div>${
      R.length
        ? R.sort((a, c) => c.at - a.at)
            .map(
              (r) => {
                const reviewUser = DB.users.find((x) => x.id === r.uid);
                const displayName = reviewUser ? reviewUser.name : "Verified Customer";
                const avatarHtml = reviewUser && reviewUser.avatar
                  ? `<img src="${esc(reviewUser.avatar)}" alt="${esc(displayName)}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">`
                  : `<div style="width:24px; height:24px; border-radius:50%; background:var(--lavender-pale); display:grid; place-items:center; font-size:11px;">${icon("user")}</div>`;

                return `<div class="rev">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                      ${avatarHtml}
                      <span>${esc(displayName)} <span class="vp" style="font-size: 9px; padding: 1px 5px; margin-left: 6px;">Verified Purchase</span></span>
                    </span>
                    <span class="stars">${icon("star")} ${r.score}</span>
                  </div>
                  <p style="margin: 6px 0;">${esc(r.comment)}</p>
                  <span class="muted">${fd(r.at)}</span>
                </div>`;
              }
            )
            .join("")
        : `<p class="muted">No verified feedback yet.</p>`
    }</div>`;
  if (tab === "settings")
    h = `<div class="panel"><h3>Account settings</h3><p class="muted">Change your name, email or password from your profile.</p><button class="btn btn-primary" data-go="profile">Open profile</button></div>`;
  return `<section class="container dashboard">${side("owner", T, tab)}<div class="dash-main">${dashHead("Business owner portal", esc(b.name), "Manage your listing and help customers find you.", `<button class="btn btn-primary" data-go="shop/${b.id}">View public shop</button>`)}${h}</div></section>`;

}

function adminDash(tab = "dashboard") {
  const T = [
    ["dashboard", "Dashboard", "chart"],
    ["shops", "Shops & owners", "store"],
    ["users", "Users", "users"],
    ["categories", "Categories", "tag"],
    ["reviews", "Reviews", "review"],
    ["settings", "Settings", "settings"],
  ];
  const shopRows = (acts) =>
    DB.businesses.map(
      (b) =>
        `<tr><td>${esc(b.name)}</td><td>${esc(DB.users.find((u) => u.id === b.owner)?.email)}</td><td>${esc(b.address)}</td><td>${rateHtml(b.id)}</td><td><button class="btn btn-ghost btn-small" data-go="shop/${b.id}">View</button>${acts ? ` <button class="btn btn-ghost btn-small" data-act="addr" data-id="${b.id}">Edit location</button> <button class="btn btn-danger btn-small" data-act="delb" data-id="${b.id}">Remove</button>` : ""}</td></tr>`
    );
  const heads = ["Shop", "Owner", "Location", "Rating", "Action"];
  let h = "";
  if (tab === "dashboard") {
    const userCount = DB.users.filter((u) => u.role === "normal_user").length;
    const ownerCount = DB.users.filter((u) => u.role === "business_owner").length;
    const shopCount = DB.businesses.length;
    const reviewCount = DB.ratings.length;
    const categoryCount = DB.cats.length;

    const totalUsers = Math.max(1, userCount + ownerCount);
    const userDeg = (userCount / totalUsers) * 360;

    h = `
      <div class="stats-chart-grid">
        <div class="chart-panel">
          <h3>Users Distribution</h3>
          <div class="pie-container" style="background: conic-gradient(#d35400 0deg ${userDeg}deg, #e67e22 ${userDeg}deg 360deg);"></div>
          <div class="pie-legend">
            <div class="pie-legend-item">
              <div class="pie-legend-left"><span class="pie-color-box" style="background:#d35400;"></span> Customers</div>
              <strong>${userCount}</strong>
            </div>
            <div class="pie-legend-item">
              <div class="pie-legend-left"><span class="pie-color-box" style="background:#e67e22;"></span> Business Owners</div>
              <strong>${ownerCount}</strong>
            </div>
          </div>
        </div>

        <div class="chart-panel">
          <h3>Platform Metrics Overview</h3>
          <div class="pie-container" style="background: conic-gradient(#3b82f6 0deg 120deg, #10b981 120deg 240deg, #f59e0b 240deg 360deg);"></div>
          <div class="pie-legend">
            <div class="pie-legend-item">
              <div class="pie-legend-left"><span class="pie-color-box" style="background:#3b82f6;"></span> Local Shops</div>
              <strong>${shopCount}</strong>
            </div>
            <div class="pie-legend-item">
              <div class="pie-legend-left"><span class="pie-color-box" style="background:#10b981;"></span> Feedback Entries</div>
              <strong>${reviewCount}</strong>
            </div>
            <div class="pie-legend-item">
              <div class="pie-legend-left"><span class="pie-color-box" style="background:#f59e0b;"></span> Categories</div>
              <strong>${categoryCount}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="results-head">
          <h3>Local shop listings</h3>
          <button class="btn btn-primary btn-small" data-go="admin/shops">+ Add owner account</button>
        </div>
        ${table(heads, shopRows(false), "No shops.")}
      </div>`;
  }
  if (tab === "shops")
    h = `<div class="admin-form-panel">
      <h3>Create business owner account</h3>
      <p class="muted" style="font-size:13px; margin-bottom:16px;">Set up a new owner profile and associate their local business listing instantly.</p>
      <form data-form="owner">
        <div class="row" style="margin-bottom:12px;">
          ${field("Owner name", `<input name="n" placeholder="e.g. Juan Dela Cruz">`)}
          ${field("Owner email", `<input name="e" type="email" placeholder="owner@demo.ph">`)}
          ${field("Initial password (min 8)", `<input name="p" type="password" placeholder="••••••••">`)}
        </div>
        <div class="row" style="margin-bottom:16px;">
          ${field("Business name", `<input name="b" placeholder="e.g. Calbayog Grill">`)}
          ${field("Business address / location", `<input name="a" placeholder="e.g. Rueda St., Calbayog City">`)}
        </div>
        <div class="err" id="er"></div>
        <button class="btn btn-primary" style="padding: 10px 24px; border-radius: 12px;">Create owner &amp; shop</button>
      </form>
    </div>
    <div class="panel">
      <div class="results-head">
        <h3 style="margin:0;">Registered local shops</h3>
      </div>
      ${table(heads, shopRows(true), "No shops.")}
    </div>`;

  if (tab === "users")
    h = `<div class="panel">${table(
      ["User", "Role", "UCID", "Status", "Action"],
      DB.users
        .filter((u) => u.role !== "admin")
        .map(
          (u) =>
            `<tr><td>${esc(u.name || "—")}<br><span class="muted">${esc(u.email)}</span></td><td>${u.role.replace("_", " ")}</td><td>${u.ucid || "—"}</td><td><span class="status ${u.active ? "verified" : "suspended"}">${u.active ? "Active" : "Suspended"}</span></td><td><button class="btn btn-ghost btn-small" data-act="editu" data-id="${u.id}">Edit</button> <button class="btn ${u.active ? "btn-danger" : "btn-soft"} btn-small" data-act="togu" data-id="${u.id}">${u.active ? "Suspend" : "Reactivate"}</button></td></tr>`
        ),
      "No users yet."
    )}</div>`;

  if (tab === "categories")
    h = `<div class="admin-form-panel" style="margin-bottom: 20px;">
      <h3>Add New Category</h3>
      <p class="muted" style="font-size:13px; margin-bottom:14px;">Create product categories to organize local menu items across shops.</p>
      <form data-form="catForm" style="display:flex; gap:14px; align-items:flex-end; flex-wrap:wrap;">
        <div class="field" style="margin:0; flex:1; min-width:240px;">
          <label>Category name</label>
          <input name="n" placeholder="e.g. Bakery & Pastries" style="height: 44px;">
        </div>
        <button class="btn btn-primary" style="height: 44px; padding: 0 24px; border-radius: 12px; flex-shrink:0;">Add Category</button>
      </form>
    </div>
    <div class="panel" style="margin-top: 0;">
      <div class="results-head">
        <h3 style="margin:0;">Existing Categories</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="text-align: left; width: 40%;">Category</th>
              <th style="text-align: left; width: 30%;">Products</th>
              <th style="text-align: right; width: 30%;"><span style="display: inline-block; transform: translateX(-45px);">Action</span></th>
            </tr>
          </thead>
          <tbody>
            ${
              DB.cats.map(
                (c) =>
                  `<tr>
                    <td style="text-align: left;"><strong>${esc(c.name)}</strong></td>
                    <td style="text-align: left;"><span class="pill">${DB.products.filter((p) => p.cat === c.id).length} items</span></td>
                    <td style="text-align: right;"><button class="btn btn-ghost btn-small" data-act="renc" data-id="${c.id}">Rename</button> <button class="btn btn-danger btn-small" data-act="delc" data-id="${c.id}">Delete</button></td>
                  </tr>`
              ).join("") || `<tr><td colspan="3" class="muted" style="text-align: center;">No categories.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>`;

  if (tab === "reviews")
    h = `<div class="panel"><h3>Moderation</h3>${DB.ratings.length ? DB.ratings.map((r) => `<div class="rev"><b>${esc(bz(r.bid)?.name)}</b> <span class="stars">${icon("star")} ${r.score}</span> <span class="muted">${r.ucid}</span><p>${esc(r.comment)}</p><button class="btn btn-danger btn-small" data-act="delr" data-id="${r.id}">Remove</button></div>`).join("") : `<p class="muted">No feedback to moderate.</p>`}</div>`;
  if (tab === "settings")
    h = `<div class="panel"><h3>Account settings</h3><button class="btn btn-primary" data-go="profile">Open profile</button></div>`;
  return `<section class="container dashboard">${side("admin", T, tab)}<div class="dash-main"><div class="dash-header" style="justify-content: flex-end; margin-bottom: 12px;"><span class="pill">Administrator</span></div>${h}</div></section>`;

}

function icon(name, extraClass = "") {
  const paths = {
    "bold-arrow-left": '<path d="M19 12H5M12 19l-7-7 7-7" stroke-width="2.8"/>',
    "arrow-left": '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    utensils:
      '<path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10a2.5 2.5 0 0 0 9.5-2.5V3M7 10v11M17 3c-2 2-3 4.2-3 7v2h3v9M17 3v9"/>',
    soup: '<path d="M4 11h16a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7ZM3 21h18M8 3v4M12 2v5M16 3v4"/>',
    sandwich:
      '<path d="M4 10a8 8 0 0 1 16 0v1H4v-1ZM4 14h16l-2 5H6l-2-5ZM7 11v3M12 11v3M17 11v3"/>',
    cup: '<path d="M5 4h12l-1 17H7L5 4ZM4 4h14M17 7h2a2 2 0 0 1 0 4h-2M9 2v2M13 2v2"/>',
    cake: '<path d="M4 12h16v8H4zM4 12c0-2 2-3 4-1 2-3 5-3 7 0 2-2 5-1 5 1M8 16v1M12 16v1M16 16v1M12 2v3M10 5h4"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    heart:
      '<path d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.8 2.4Z"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V10Z"/>',
    store:
      '<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    phone:
      '<path d="M7 3H4a1 1 0 0 0-1 1c0 9 8 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 3a14 14 0 0 1-6-6l3-2-2-5Z"/>',
    shield:
      '<path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    chart: '<path d="M4 20V4M4 20h17M8 16v-4M13 16V7M18 16v-7"/>',
    settings:
      '<circle cx="12" cy="12" r="3"/><path d="M19 13.5a7 7 0 0 0 0-3l2-1.5-2-3.4-2.4 1a8 8 0 0 0-2.6-1.5L13.5 2h-4L9 5.1a8 8 0 0 0-2.6 1.5L4 5.6 2 9l2 1.5a7 7 0 0 0 0 3L2 15l2 3.4 2.4-1A8 8 0 0 0 9 19.9l.5 3.1h4l.5-3.1a8 8 0 0 0 2.6-1.5l2.4 1 2-3.4Z"/>',
    users:
      '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2"/>',
    tag: '<path d="M20 13 13 20 3 10V3h7l10 10Z"/><circle cx="7.5" cy="7.5" r="1"/>',
    review:
      '<path d="M4 4h16v13H9l-5 4V4Z"/><path d="m12 7 1.3 2.6 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4L12 7Z"/>',
    flag: '<path d="M5 21V4M5 4c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>',
    logout: '<path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    receipt:
      '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  };
  return `<svg class="icon-svg ${extraClass}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.utensils}</svg>`;
}

/* ---------- Router & Navigation ---------- */
const redir = (p) => location.replace("#" + p);

function go(p) {
  if (location.hash.slice(1) === p) render();
  else location.hash = p;
}

function updNav() {
  const u = cur(),
    el = $("#navActions");
  if (!el) return;

  const [page] = (location.hash.slice(1) || "home").split("/");

  if (u && (page === "admin" || (page === "owner" && page !== "profile") || page === "shop")) {
    el.innerHTML = "";
    return;
  }

  if (u && page === "profile" && u.role !== "normal_user") {
    el.innerHTML = "";
    return;
  }

  if (u) {
    let accountDisplay = "";
    if (u.role === "normal_user") {
      const avatarContent = u.avatar
        ? `<img src="${esc(u.avatar)}" alt="Profile">`
        : icon("user");
      accountDisplay = `<button class="topbar-profile-btn" data-go="${dashPath(u)}" aria-label="My Account" style="padding:0; border:none; background:transparent; box-shadow:none; display:inline-flex; align-items:center;">
        <span class="topbar-avatar">${avatarContent}</span>
      </button>`;
    } else {
      accountDisplay = `<button class="btn btn-ghost" data-go="${dashPath(u)}">Dashboard</button>`;
    }
    el.innerHTML = `${accountDisplay}`;
  } else {
    el.innerHTML = `<button class="btn btn-primary" data-go="login">Log in</button><button class="btn btn-ghost" data-go="signup">Sign up</button>`;
  }
}

function render() {
  const [page0, arg] = (location.hash.slice(1) || "home").split("/");
  let page = page0;
  const u = cur();

  document.body.classList.toggle("admin-view", page === "admin" || (page === "profile" && u?.role === "admin") || (page === "shop" && u?.role === "admin"));
  document.body.classList.toggle("owner-view", page === "owner" || (page === "profile" && u?.role === "business_owner") || (page === "shop" && u?.role === "business_owner"));
  document.body.classList.toggle("dashboard-view", page === "admin" || page === "owner" || page === "profile" || page === "review");

  const V = {
    home,
    search: searchPage,
    shops: shopsPage,
    shop: () => shopPage(arg),
    signup: () => auth("signup"),
    login: () => auth("login"),
    otp: () => auth("otp"),
    forgot: () => auth("forgot"),
    reset: () => auth("reset", arg),
    profile: () => profilePage(arg),
    review: () => reviewPage(arg),
    owner: () => ownerDash(arg),
    admin: () => adminDash(arg),
    "reset-sms": () => auth("reset-sms"),
  };
  
  if (!V[page]) page = "home";
  if (["profile", "owner", "admin"].includes(page) && !u) {
    toast(
      S.expired
        ? "Session expired. Please log in again."
        : "Please log in first.",
      "er"
    );
    S.expired = false;
    return redir("login");
  }

  if (
    (page === "owner" && u?.role !== "business_owner") ||
    (page === "admin" && u?.role !== "admin")
  ) {
    toast("That page is not available for your role.", "er");
    return redir(dashPath(u));
  }

  if (["login", "signup", "forgot"].includes(page) && u)
    return redir(dashPath(u));

  touch();
  updNav();

  try {
    app.innerHTML = V[page]();
  } catch (e) {
    console.error(e);
    app.innerHTML = emptyBox(
      "flag",
      "Something went wrong",
      esc(e.message),
      `<button class="btn btn-primary" data-go="home">Back home</button>`
    );
  }

  document
    .querySelectorAll("[data-page]")
    .forEach((a) => a.classList.toggle("active", a.dataset.page === page));

  $("#mainNav")?.classList.remove("open");
  window.scrollTo({ top: 0 });
}

window.addEventListener("hashchange", render);

/* ---------- Event Action Handlers ---------- */
const role = (r) => {
  const u = cur();
  if (!u || u.role !== r) {
    go("login");
    return null;
  }
  touch();
  return u;
};

const ACT = {
  removeAvatar() {
    const u = cur();
    if (!u) return;

    delete u.avatar;
    save();
    render();
    toast("Profile picture removed.");
  },
  togglePassword: (id, button) => {
    const input = button.parentElement.querySelector("input");
    if (input.type === "password") {
      input.type = "text";
      button.textContent = "Hide";
      button.setAttribute("aria-label", "Hide password");
    } else {
      input.type = "password";
      button.textContent = "Show";
      button.setAttribute("aria-label", "Show password");
    }
  },
  quickview(id) {
    openQuickView(id);
  },
  closeModal() {
    closeModal();
  },
  modalLogin() {
    closeModal();
    go("login");
  },
  viewShopDetails(id) {
    closeModal();
    S.shopTab = "Overview";
    go("shop/" + id);
  },
  modalStar(id) {
    S.modalStars = +id;
    document.querySelectorAll("[data-act=modalStar]").forEach((btn) => {
      btn.style.color = +btn.dataset.id <= S.modalStars ? "#f59e0b" : "#cbd5e1";
    });
    const numEl = $("#modalStarNum");
    if (numEl) numEl.textContent = S.modalStars;
  },
  save(id) {
    const scrollPosition = window.scrollY;
    const k = cur()?.id || "guest";
    const s = new Set(DB.saved[k] || []);

    s.has(id) ? s.delete(id) : s.add(id);
    DB.saved[k] = [...s];
    save();

    toast(
      s.has(id)
        ? "Saved to your favorites."
        : "Removed from saved items."
    );

    render();
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  },
  cat(id) {
    F.cat = id;
    F.foodQ = "";
    F.n = 8;
    go("search");
  },
  pickSuggestion(id, el) {
    const name = el ? el.dataset.name : id;
    F.cat = "All";
    F.foodQ = name;
    F.n = 8;

    const inputEl = $("#searchInput");
    if (inputEl) inputEl.value = name;
    const box = $("#searchSuggestions");
    if (box) box.style.display = "none";
    go("search");
  },
  pickShopSuggestion(id, el) {
    const name = el ? el.dataset.name : id;
    F.shopsQ = name;

    const inputEl = $("#shopsSearchInput");
    if (inputEl) inputEl.value = name;
    
    const box = $("#shopsSearchSuggestions");
    if (box) box.style.display = "none";
    go("shops");
  },
  resetFoodSearch() {
    F.foodQ = "";
    F.cat = "All";
    F.price = "all";
    F.rate = "0";
    F.open = "";
    F.time = "";
    F.n = 8;
    render();
  },
  resetShopsSearch() {
    F.shopsQ = "";
    render();
  },
  more() {
    F.n += 8;
    render();
  },
  clear() {
    F = {
      ...F,
      cat: "All",
      price: "all",
      rate: "0",
      open: "",
      time: "",
      foodQ: "",
      shopsQ: "",
      n: 8,
    };
    render();
  },
  unchip(id) {
    if (id === "cat") F.cat = "All";
    if (id === "price") F.price = "all";
    if (id === "rate") F.rate = "0";
    if (id === "open") {
      F.open = "";
      F.time = "";
    }
    if (id === "q") {
      F.foodQ = "";
      const inputEl = $("#searchInput");
      if (inputEl) inputEl.value = "";
    }
    render();
  },
  visit(id) {
    const b = bz(id);
    if (!b?.link) return toast("This shop has not added a main page link yet.");
    window.open(b.link, "_blank", "noopener,noreferrer");
  },
  stab(id) {
    const scrollPos = window.scrollY;
    S.shopTab = id;
    render();
    window.scrollTo({ top: scrollPos, behavior: "instant" });
  },
  star(id) {
    S.stars = +id;
    document
      .querySelectorAll("[data-act=star]")
      .forEach((b) => b.classList.toggle("active", +b.dataset.id <= S.stars));
  },
  resend() {
    if (S.otp) sendOtp(S.otp.purpose, S.otp.mobile, S.otp.payload);
  },
  logout() {
    DB.session = null;
    save();
    toast("You have been logged out.");
    go("home");
  },
  editp(id) {
    if (!role("business_owner")) return;
    S.edit = id;
    render();
    window.scrollTo({ top: 0 });
  },
  canceledit() {
    S.edit = null;
    render();
  },
  togp(id) {
    if (!role("business_owner")) return;
    const p = prod(id);
    if (p?.bid === myShop()?.id) {
      p.active = !p.active;
      save();
      render();
    }
  },
  delp(id) {
    if (!role("business_owner")) return;
    const p = prod(id);
    if (p?.bid === myShop()?.id && confirm("Delete this product?")) {
      DB.products = DB.products.filter((x) => x.id !== id);
      save();
      render();
    }
  },
  voidc(id) {
    if (!role("business_owner")) return;
    const c = DB.codes.find((x) => x.id === id);
    if (c?.bid === myShop()?.id && cstat(c) === "unused") {
      c.voidedAt = Date.now();
      S.newCode = null;
      save();
      render();
    }
  },
  addr(id) {
    if (!role("admin")) return;
    const b = bz(id),
      a = prompt("Business address / location", b.address);
    if (a !== null) {
      b.address = a.trim();
      save();
      render();
    }
  },
  delb(id) {
    if (
      !role("admin") ||
      !confirm("Remove this listing with its products, codes and feedback?")
    )
      return;
    DB.businesses = DB.businesses.filter((b) => b.id !== id);
    DB.products = DB.products.filter((p) => p.bid !== id);
    DB.ratings = DB.ratings.filter((r) => r.bid !== id);
    DB.codes = DB.codes.filter((c) => c.id !== id);
    save();
    render();
  },
  editu(id) {
    if (!role("admin")) return;
    const u = DB.users.find((x) => x.id === id),
      n = prompt("Full name", u.name);
    if (n !== null) {
      u.name = n.trim();
      save();
      render();
    }
  },
  togu(id) {
    if (!role("admin")) return;
    const u = DB.users.find((x) => x.id === id);
    u.active = !u.active;
    save();
    render();
  },
  renc(id) {
    if (!role("admin")) return;
    const c = cat(id),
      n = prompt("Rename category", c.name);
    if (n?.trim()) {
      c.name = n.trim();
      save();
      render();
    }
  },
  delc(id) {
    if (!role("admin")) return;
    const n = DB.products.filter((p) => p.cat === id).length;
    if (n)
      return err(
        `Cannot delete: ${n} product(s) (active or inactive) still use this category.`
      );
    DB.cats = DB.cats.filter((c) => c.id !== id);
    save();
    render();
  },
  delr(id) {
    if (!role("admin")) return;
    DB.ratings = DB.ratings.filter((r) => r.id !== id);
    save();
    render();
  },
};

const FORMS = {
  homeSearch(f) {
    const q = f.q.value.trim();
    if (!q) return;
    F.foodQ = q;
    F.n = 8;
    const box = $("#homeSearchSuggestions");
    if (box) box.style.display = "none";
    go("search");
  },
  search(f) {
    F.foodQ = f.q.value.trim();
    F.n = 8;
    const box = $("#searchSuggestions");
    if (box) box.style.display = "none";
    go("search");
  },
  searchShops(f) {
    F.shopsQ = f.q.value.trim();
    const box = $("#shopsSearchSuggestions");
    if (box) box.style.display = "none";
    go("shops");
  },
  reviewModal(f) {
    const bid = f.dataset.bid;
    const vc = f.vc.value.trim().toUpperCase();
    const cm = f.cm.value.trim();
    const u = cur();
    const erEl = $("#modalEr");

    if (!u) {
      if (erEl) erEl.textContent = "Please log in to submit a review.";
      return;
    }

    if (!vc) {
      if (erEl) erEl.textContent = "Please enter your receipt code.";
      return;
    }

    const c = DB.codes.find((x) => x.code === vc);
    if (!c || c.bid !== bid || c.usedAt || c.voidedAt) {
      if (erEl) erEl.textContent = "Invalid, expired, or already used receipt code.";
      return;
    }

    c.usedAt = Date.now();
    c.usedBy = u.id;
    DB.ratings.push({
      id: uid(),
      uid: u.id,
      bid,
      ucid: u.ucid || "CB-USER",
      score: S.modalStars || 5,
      comment: cm,
      verified: true,
      at: Date.now(),
      codeId: c.id
    });

    save();
    toast("Verified review submitted!");
    openQuickView(DB.products.find(p => p.bid === bid)?.id);
  },
  async signup(f) {
    const E = (m) => ($("#er").textContent = m),
      e = f.e.value.trim().toLowerCase(),
      p = f.p.value;
    if (!e || !p) return E("Enter your email and password.");
    const ex = DB.users.find((u) => u.email === e);
    if (ex) {
      if (ex.role === "normal_user")
        return E("This email is already registered. Please log in.");
      const m = await login(e, p);
      return m && E(m);
    }
    const m = f.m.value.replace(/[\s-]/g, "");
    if (!f.name.value.trim()) return E("Please enter your full name.");
    if (!validMob(m)) return E("Enter a valid PH mobile number (09XXXXXXXXX).");
    const v = validPw(p, f.c.value);
    if (v) return E(v);
    if (!f.t.checked) return E("Please accept the Terms and Privacy Policy.");
    S.pend = { e, name: f.name.value.trim(), m, pw: await sha(p) };
    sendOtp("signup", m);
  },
  async "reset-sms"(f) {
    const E = (m) => ($("#er").textContent = m);
    const v = validPw(f.p.value, f.c.value);
    if (v) return E(v);

    if (!S.resetUid) return E("Session invalid. Please restart password recovery.");

    const u = DB.users.find((x) => x.id === S.resetUid);
    if (u) {
      u.pw = await sha(f.p.value);
      if (DB.session?.uid === u.id) DB.session = null;
      save();
    }

    S.resetUid = null;
    toast("Password updated successfully. Please log in.");
    go("login");
  },
  async login(f) {
    const m = await login(f.e.value.trim().toLowerCase(), f.p.value);
    if (m) $("#er").textContent = m;
  },
  otp(f) {
    const o = S.otp,
      E = (m) => ($("#er").textContent = m);
    if (!o) return;
    if (Date.now() > o.exp)
      return E("That code has expired. Please resend a new one.");
    if (o.tries >= 5)
      return E("Too many incorrect attempts. Request a new code.");
    if (f.o.value.trim() !== o.code) {
      o.tries++;
      return E(`Incorrect code. ${5 - o.tries} attempt(s) left.`);
    }
    if (o.purpose === "signup") {
      const p = S.pend,
        u = {
          id: uid(),
          email: p.e,
          pw: p.pw,
          name: p.name,
          role: "normal_user",
          mobile: p.m,
          ucid: "CB-" + rnd(CODEA, 10),
          active: true,
        };
      DB.users.push(u);
      DB.session = { uid: u.id, last: Date.now() };
      toast("Account created. Your Unique Customer ID is " + u.ucid);
    } else if (o.purpose === "forgot") {
      S.resetUid = o.payload.uid;
      S.otp = null;
      save();
      toast("Code verified. Please set your new password.");
      return go("reset-sms");
    } else {
      Object.assign(cur(), o.payload);
      toast("Contact details updated.");
      S.otp = null;
      save();
      go(dashPath(cur()));
    }
    S.otp = null;
    save();
    go(dashPath(cur()));
  },
  async forgot(f) {
    const E = (m) => ($("#er").textContent = m);
    const mobile = f.m.value.trim().replace(/[\s-]/g, "");
    
    if (!validMob(mobile)) return E("Enter a valid PH mobile number (09XXXXXXXXX).");
    
    const u = DB.users.find((x) => x.mobile === mobile);
    if (!u) {
      toast("If that mobile number is registered, an SMS code has been sent.");
      return;
    }

    sendOtp("forgot", mobile, { uid: u.id });
  },
  async reset(f) {
    const E = (m) => ($("#er").textContent = m),
      v = validPw(f.p.value, f.c.value);
    if (v) return E(v);
    const h = await sha(f.dataset.token),
      rr = DB.resets?.find((x) => x.h === h);
    if (!rr || rr.used || rr.exp < Date.now())
      return E("This reset link is expired or already used. Please request a new one.");
    const u = DB.users.find((x) => x.id === rr.uid);
    u.pw = await sha(f.p.value);
    rr.used = true;
    if (DB.session?.uid === u.id) DB.session = null;
    save();
    toast("Password updated. Please log in.");
    go("login");
  },
  async profile(f) {
    const u = cur(),
      E = (m) => ($("#er").textContent = m),
      e = f.e.value.trim().toLowerCase(),
      m = u.role === "normal_user" ? f.m.value.replace(/[\s-]/g, "") : "";
    u.name = f.n.value.trim();
    const chg = e !== u.email || (u.role === "normal_user" && m !== u.mobile);
    if (!chg) {
      save();
      updNav(); // <-- Updates the topbar name instantly
      render();
      return toast("Profile saved.");
    }
    if ((await sha(f.cp.value)) !== u.pw)
      return E("Enter your current password to change your email or mobile number.");
    if (e !== u.email && DB.users.some((x) => x.id !== u.id && x.email === e))
      return E("That email is already used.");
    if (u.role === "normal_user") {
      if (!validMob(m)) return E("Enter a valid PH mobile number.");
      return sendOtp("change", m, { email: e, mobile: m });
    }
    u.email = e;
    save();
    updNav(); // <-- Updates the topbar name instantly
    render();
    toast("Profile saved.");
  },
  async pw(f) {
    const u = cur(),
      E = (m) => ($("#er2").textContent = m);
    if ((await sha(f.o.value)) !== u.pw)
      return E("Current password is incorrect.");
    const v = validPw(f.p.value, f.c.value);
    if (v) return E(v);
    u.pw = await sha(f.p.value);
    save();
    toast("Password changed.");
    f.reset();
  },
  review: submitReview,
  async shop(f) {
    if (!role("business_owner")) return;
    const b = myShop(),
      E = (m) => ($("#er").textContent = m),
      v = (k) => f[k].value.trim();
    if (!v("name")) return E("Shop name is required.");
    if (v("link") && !/^https?:\/\//i.test(v("link")))
      return E("The link must start with http:// or https://");
    if (f.i.files[0]) {
      try {
        b.img = await webp(f.i.files[0]);
      } catch (x) {
        return E("That image could not be read.");
      }
    }
    [
      "name",
      "address",
      "contact",
      "hours",
      "link",
      "opens",
      "closes",
      "desc",
    ].forEach((k) => (b[k] = v(k)));
    save();
    toast("Shop saved.");
    render();
  },
  async product(f) {
    if (!role("business_owner")) return;
    const b = myShop(),
      E = (m) => ($("#er").textContent = m),
      e = prod(S.edit),
      file = f.i.files[0];
    if (!f.n.value.trim() || !f.d.value.trim())
      return E("Enter a name and a description.");
    if (f.p.value === "" || +f.p.value < 0) return E("Enter a valid price.");
    if (!e && !file) return E("Please add a product photo.");
    let img = e ? e.img : "";
    if (file) {
      try {
        img = await webp(file);
      } catch (x) {
        return E("That image could not be read.");
      }
    }
    const d = {
      name: f.n.value.trim(),
      desc: f.d.value.trim(),
      price: +f.p.value,
      cat: f.c.value,
      img,
    };
    if (e && e.bid === b.id) Object.assign(e, d);
    else DB.products.push({ id: uid(), bid: b.id, active: true, ...d });
    S.edit = null;
    save();
    toast("Product saved. It now appears in the public menu.");
    render();
  },
  code() {
    const u = role("business_owner"),
      b = myShop();
    if (!u || !b) return;
    let c;
    do {
      c = rnd(CODEA, 8);
    } while (DB.codes.some((x) => x.code === c));
    DB.codes.push({
      id: uid(),
      bid: b.id,
      by: u.id,
      code: c,
      ref: "",
      created: Date.now(),
      expires: Date.now() + 864e5,
      usedAt: null,
      usedBy: null,
      voidedAt: null,
    });
    S.newCode = c;
    save();
    render();
  },
  async owner(f) {
    if (!role("admin")) return;
    const E = (m) => ($("#er").textContent = m),
      e = f.e.value.trim().toLowerCase();
    if (!f.n.value.trim() || !e || !f.b.value.trim())
      return E("Owner name, email and business name are required.");
    if (DB.users.some((u) => u.email === e))
      return E("That email already has an account.");
    if (f.p.value.length < 8)
      return E("Initial password must be at least 8 characters.");
    const u = {
      id: uid(),
      email: e,
      pw: await sha(f.p.value),
      name: f.n.value.trim(),
      role: "business_owner",
      mobile: "",
      ucid: null,
      active: true,
    };
    DB.users.push(u);
    DB.businesses.push({
      id: uid(),
      owner: u.id,
      name: f.b.value.trim(),
      hours: "",
      opens: "",
      closes: "",
      contact: "",
      address: f.a.value.trim(),
      desc: "",
      link: "",
      img: "",
    });
    save();
    toast("Owner account and shop created.");
    render();
  },
  catForm(f) {
    if (!role("admin")) return;
    const n = f.n.value.trim();
    if (!n) return;
    if (DB.cats.some((c) => c.name.toLowerCase() === n.toLowerCase()))
      return err("That category already exists.");
    DB.cats.push({ id: uid(), name: n });
    save();
    render();
  },
};

/* ---------- Event Listeners ---------- */
document.addEventListener("input", (e) => {
  if (e.target.id === "homeSearchInput" || (e.target.name === "q" && e.target.closest('[data-form="homeSearch"]'))) {
    const val = e.target.value.trim().toLowerCase();
    const box = $("#homeSearchSuggestions");
    if (!box) return;

    if (!val) {
      box.style.display = "none";
      box.innerHTML = "";
      return;
    }

    const matchedFood = DB.products.filter(p => p.active && p.name.toLowerCase().startsWith(val));
    const matchedShops = DB.businesses.filter(b => b.name.toLowerCase().startsWith(val) || (b.address && b.address.toLowerCase().includes(val)));

    let html = "";
    if (matchedFood.length > 0) {
      html += matchedFood.map(p => 
        `<div class="suggestion-item" data-act="pickSuggestion" data-name="${esc(p.name)}">
          <span>${esc(p.name)}</span>
        </div>`
      ).join("");
    }

    if (matchedShops.length > 0) {
      html += matchedShops.map(b => 
        `<div class="suggestion-item" data-go="shop/${b.id}" style="display:flex; flex-direction:column; align-items:flex-start; gap:1px;">
          <strong style="font-size:13px; color:var(--navy);">${esc(b.name)}</strong>
          <small class="muted" style="font-size:10px;">📍 ${esc(b.address || "Calbayog City")}</small>
        </div>`
      ).join("");
    }

    if (html) {
      box.innerHTML = html;
      box.style.display = "block";
    } else {
      box.style.display = "none";
    }
  }

  if (e.target.id === "searchInput" || (e.target.name === "q" && e.target.closest('[data-form="search"]'))) {
    const val = e.target.value.trim().toLowerCase();
    const box = $("#searchSuggestions");
    if (!box) return;

    if (!val) {
      box.style.display = "none";
      box.innerHTML = "";
      return;
    }

    const matches = DB.products.filter(p => p.active && p.name.toLowerCase().startsWith(val));
    if (matches.length > 0) {
      box.innerHTML = matches.map(p => 
        `<div class="suggestion-item" data-act="pickSuggestion" data-name="${esc(p.name)}">${esc(p.name)}</div>`
      ).join("");
      box.style.display = "block";
    } else {
      box.style.display = "none";
    }
  }

  if (e.target.id === "shopsSearchInput" || (e.target.name === "q" && e.target.closest('[data-form="searchShops"]'))) {
    const val = e.target.value.trim().toLowerCase();
    const box = $("#shopsSearchSuggestions");
    if (!box) return;

    if (!val) {
      box.style.display = "none";
      box.innerHTML = "";
      return;
    }

    const matches = DB.businesses.filter(b => 
      b.name.toLowerCase().startsWith(val) || (b.address && b.address.toLowerCase().includes(val))
    );

    if (matches.length > 0) {
      box.innerHTML = matches.map(b => 
        `<div class="suggestion-item" data-act="pickShopSuggestion" data-name="${esc(b.name)}" style="display:flex; flex-direction:column; align-items:flex-start; padding:8px 12px; gap:2px;">
          <strong style="font-size:14px; color:var(--navy);">${esc(b.name)}</strong>
          <small class="muted" style="font-size:11px; display:flex; align-items:center; gap:4px;">
            📍 ${esc(b.address || "Calbayog City")}
          </small>
        </div>`
      ).join("");
      box.style.display = "block";
    } else {
      box.style.display = "none";
    }
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest("#mobileMenu"))
    return $("#mainNav").classList.toggle("open");
  
  if (e.target.matches("#quickViewModal")) {
    closeModal();
    return;
  }

  const homeBox = $("#homeSearchSuggestions");
  if (homeBox && !e.target.closest('[data-form="homeSearch"]')) {
    homeBox.style.display = "none";
  }

  const foodBox = $("#searchSuggestions");
  if (foodBox && !e.target.closest('[data-form="search"]')) {
    foodBox.style.display = "none";
  }

  const shopsBox = $("#shopsSearchSuggestions");
  if (shopsBox && !e.target.closest('[data-form="searchShops"]')) {
    shopsBox.style.display = "none";
  }

  const a = e.target.closest("[data-act]");
  if (a && ACT[a.dataset.act]) {
    e.preventDefault();
    e.stopPropagation();
    return ACT[a.dataset.act](a.dataset.id, a);
  }
  const g = e.target.closest("[data-go]");
  if (g) {
    e.preventDefault();
    closeModal();
    go(g.dataset.go);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

document.addEventListener("submit", (e) => {
  const fn = FORMS[e.target.dataset.form];
  if (fn) {
    e.preventDefault();
    fn(e.target);
  }
});

document.addEventListener("change", (e) => {
  const t = e.target;
  
  if (t.id === "profilePhotoInput") {
    const file = t.files?.[0];
    const u = cur();

    if (!file || !u) return;

    if (!file.type.startsWith("image/")) {
      toast("Please select an image file.", "er");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast("Choose an image smaller than 5 MB.", "er");
      t.value = "";
      return;
    }

    webp(file)
      .then((imageData) => {
        u.avatar = imageData;
        save();
        render();
        toast("Profile picture updated.");
      })
      .catch(() => {
        toast("Could not load that image. Try another.", "er");
      });

    return;
  }

  if (t.name === "category") {
    F.cat = t.value;
    F.foodQ = "";
    F.n = 8;
    render();
  } else if (t.dataset.f === "cat") {
    F.cat = t.value;
    F.foodQ = "";

    const inputEl = $("#searchInput");
    if (inputEl) inputEl.value = "";

    const box = $("#searchSuggestions");
    if (box) {
      box.style.display = "none";
      box.innerHTML = "";
    }

    render();
  } else if (t.dataset.f) {
    F[t.dataset.f] = t.value;
    if (t.dataset.f === "open" && t.value !== "at") F.time = "";
    F.n = 8;
    render();
  } else if (t.dataset.act === "pickshop") go("review/" + t.value);
});

document.addEventListener("keydown", (e) => {
  const activeInput = document.activeElement;
  if (!activeInput || !["homeSearchInput", "searchInput", "shopsSearchInput"].includes(activeInput.id)) return;
  
  const boxId = activeInput.id === "homeSearchInput" ? "homeSearchSuggestions" :
                activeInput.id === "searchInput" ? "searchSuggestions" : "shopsSearchSuggestions";
  const box = $(`#${boxId}`);
  if (!box || box.style.display === "none") return;

  const items = box.querySelectorAll(".suggestion-item");
  if (!items.length) return;

  let currentIndex = Array.from(items).findIndex(item => item.classList.contains("highlighted"));

  if (e.key === "ArrowDown" || e.key === "PageDown") {
    e.preventDefault();
    if (currentIndex < items.length - 1) currentIndex++;
    else currentIndex = 0;
  } else if (e.key === "ArrowUp" || e.key === "PageUp") {
    e.preventDefault();
    if (currentIndex > 0) currentIndex--;
    else currentIndex = items.length - 1;
  } else if (e.key === "Enter" && currentIndex >= 0) {
    e.preventDefault();
    items[currentIndex].click();
    return;
  } else {
    return;
  }

  items.forEach((item, idx) => {
    item.classList.toggle("highlighted", idx === currentIndex);
    if (idx === currentIndex) {
      item.scrollIntoView({ block: "nearest" });
    }
  });
});

init();