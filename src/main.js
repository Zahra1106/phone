// ---- product data -----------------------------------------------------
const products = [
  {
    name: "iPhone 12 · 128GB",
    grade: "A",
    battery: "92% health",
    specs: { RAM: "4GB", Storage: "128GB", Screen: "No marks", Camera: "12MP dual" },
    price: "Rs 68,500",
    was: "Rs 89,000",
    image: "/images/iphone12.jpeg", 
    image: "/video/iphone12.jpeg", 
  },
  {
    name: "Samsung S21 · 128GB",
    grade: "A",
    battery: "89% health",
    specs: { RAM: "8GB", Storage: "128GB", Screen: "No marks", Camera: "64MP triple" },
    price: "Rs 61,000",
    was: "Rs 78,000",
    image: "/video/samsungs21.jpeg", 
  },
  {
    name: "iPhone XR · 64GB",
    grade: "B",
    battery: "84% health",
    specs: { RAM: "3GB", Storage: "64GB", Screen: "Light wear", Camera: "12MP" },
    price: "Rs 39,900",
    was: "Rs 52,000",
    image: "/video/iphonexr.jpeg", 
  },
  {
    name: "Redmi Note 11 · 128GB",
    grade: "B",
    battery: "90% health",
    specs: { RAM: "6GB", Storage: "128GB", Screen: "Light wear", Camera: "50MP quad" },
    price: "Rs 26,500",
    was: "Rs 34,000",
    image: "/video/redmi.jpeg", 
  },
  {
    name: "Samsung A32 · 64GB",
    grade: "C",
    battery: "78% health",
    specs: { RAM: "4GB", Storage: "64GB", Screen: "Visible marks", Camera: "48MP quad" },
    price: "Rs 19,900",
    was: "Rs 27,000",
    image: "/video/samsung.jpeg", 
  },
  {
    name: "iPhone 11 · 64GB",
    grade: "C",
    battery: "80% health",
    specs: { RAM: "4GB", Storage: "64GB", Screen: "Visible marks", Camera: "12MP dual" },
    price: "Rs 44,000",
    was: "Rs 58,000",
    image: "/video/iphone11.jpeg", 
  },
];

const gradeLabel = { A: "Grade A · Like new", B: "Grade B · Excellent", C: "Grade C · Good" };

function miniPhoneSvg() {
  return `
    <svg viewBox="0 0 120 200" width="70">
      <rect x="6" y="6" width="108" height="188" rx="18" class="mini-phone-body"/>
      <rect x="18" y="26" width="84" height="150" rx="6" class="mini-phone-screen"/>
    </svg>`;
}

function productCard(p) {
  const specsHtml = Object.entries(p.specs)
    .map(([label, val]) => `<li><span>${label}</span>${val}</li>`)
    .join("");

  const waMessage = encodeURIComponent(`Hi, I'd like to order the ${p.name} (${gradeLabel[p.grade]}) listed at ${p.price}.`);

  return `
    <article class="p-card" data-grade="${p.grade}">
      <div class="p-card-top">
        <span class="grade-badge" data-grade="${p.grade}">${gradeLabel[p.grade]}</span>
        <span class="battery-pill">${p.battery}</span>
      </div>
      <div class="p-card-art"><img src="${p.image}" alt="${p.name}" /></div>
      <h3>${p.name}</h3>
      <ul class="p-specs">${specsHtml}</ul>
      <div class="p-card-foot">
        <span class="price">${p.price}<small>${p.was}</small></span>
        <a class="order-btn" href="https://wa.me/923000000000?text=${waMessage}" target="_blank" rel="noopener">Order now</a>
      </div>
    </article>`;
}

function renderGrid() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = products.map(productCard).join("");
}

function setupGradeFilter() {
  const filter = document.getElementById("gradeFilter");
  if (!filter) return;
  filter.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    filter.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    const grade = btn.dataset.grade;
    document.querySelectorAll(".p-card").forEach((card) => {
      const match = grade === "all" || card.dataset.grade === grade;
      card.classList.toggle("is-hidden", !match);
    });
  });
}

function setupNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

// one deliberate motion moment: stats count up when the hero scrolls into view
function setupStatCountUp() {
  const stats = document.querySelectorAll(".hero-stats dt");
  if (!stats.length || !("IntersectionObserver" in window)) return;

  const parseTarget = (text) => {
    const match = text.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, ""), 10) : null;
  };

  stats.forEach((el) => {
    const target = parseTarget(el.textContent);
    if (target === null) return;
    const suffix = el.textContent.replace(/[\d,]+/, "");
    el.dataset.full = el.textContent;
    el.textContent = "0" + suffix;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const duration = 900;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            el.textContent = value.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.disconnect();
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
  });
}

// ---- scroll-driven phone-reveal video intro (pure JS, no library) -----
// The pin itself is done with native CSS `position: sticky` (see
// .phone-intro-pin) so it never depends on any script loading. This
// function computes a 0→1 progress value from scroll position and ties
// the video's currentTime to it, easing smoothly toward the target time
// each frame (instead of snapping) so the scrub never feels jerky.
function setupPhoneIntro() {
  const section = document.getElementById("phoneIntro");
  const frame = document.getElementById("introVideoFrame");
  const video = document.getElementById("introVideo");
  const caption = document.getElementById("introCaption");
  if (!section || !frame || !video) return;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const windowT = (p, inFrom, inTo) => clamp((p - inFrom) / (inTo - inFrom), 0, 1);

  video.pause();

  function loop() {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;

    const duration = video.duration;
    if (duration && !Number.isNaN(duration)) {
      const target = progress * duration;
      if (Math.abs(video.currentTime - target) > 0.01) {
        video.currentTime = lerp(video.currentTime, target, 0.12);
      }
    }

    if (caption) {
      const capOut = windowT(progress, 0.6, 0.9);
      caption.style.opacity = String(1 - capOut);
      caption.style.transform = `translateX(-50%) translateY(${lerp(0, -16, capOut)}px)`;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

renderGrid();
setupGradeFilter();
setupNavToggle();
setupStatCountUp();
setupPhoneIntro();