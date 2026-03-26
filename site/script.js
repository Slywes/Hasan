const blocks = ["Banner", "Hizmetler", "Portföy", "Blog", "İletişim"];
const templates = {
  "E-ticaret": ["Banner", "Hizmetler", "Portföy", "Blog", "İletişim"],
  "Portföy": ["Banner", "Portföy", "Blog", "İletişim"],
  "Blog": ["Banner", "Blog", "İletişim"],
  "Restoran": ["Banner", "Hizmetler", "Blog", "İletişim"],
  "Sağlık": ["Banner", "Hizmetler", "İletişim"],
  "Eğitim": ["Banner", "Hizmetler", "Blog", "İletişim"],
  "Kişisel Marka": ["Banner", "Portföy", "Blog", "İletişim"]
};

const state = {
  selectedBlocks: JSON.parse(localStorage.getItem("ws_builder_blocks") || "[\"Banner\",\"Hizmetler\",\"İletişim\"]"),
  info: {
    sector: "",
    audience: "",
    color: "#5b63f6",
    goal: "",
    slogan: ""
  }
};

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const canvas = document.getElementById("canvasBlocks");
const preview = document.getElementById("preview");
const aiSuggestions = document.getElementById("aiSuggestions");

function renderTemplates() {
  const container = document.getElementById("templates");
  Object.keys(templates).forEach((name) => {
    const button = document.createElement("button");
    button.textContent = name;
    button.onclick = () => {
      state.selectedBlocks = [...templates[name]];
      updateAll();
    };
    container.appendChild(button);
  });
}

function renderCanvas() {
  canvas.innerHTML = "";
  state.selectedBlocks.forEach((block, index) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.index = index;
    li.innerHTML = `<span>${block}</span><button class="btn btn-small" data-remove="${index}">Sil</button>`;

    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => li.classList.remove("dragging"));
    li.addEventListener("dragover", (e) => e.preventDefault());
    li.addEventListener("drop", () => {
      const dragIndex = +document.querySelector(".dragging")?.dataset.index;
      const dropIndex = index;
      if (Number.isInteger(dragIndex) && dragIndex !== dropIndex) {
        const [item] = state.selectedBlocks.splice(dragIndex, 1);
        state.selectedBlocks.splice(dropIndex, 0, item);
        updateAll();
      }
    });
    canvas.appendChild(li);
  });
}

function renderPreview() {
  preview.innerHTML = state.selectedBlocks.map((b) => `<section><h3>${b}</h3><p>${contentSuggestion(b)}</p></section>`).join("");
}

function contentSuggestion(block) {
  const slogan = state.info.slogan || "Dijital geleceğinizi bugün tasarlayın";
  const suggestions = {
    Banner: `${slogan} — Güçlü bir CTA: \"Hemen Başla\"`,
    Hizmetler: "Kart tabanlı servisler, kısa açıklama, ikonlu sunum.",
    Portföy: "Filtrelenebilir galeri + lightbox ile gerçekçi görseller.",
    Blog: "Başlık, özet ve ilgili bağlantılarla SEO uyumlu içerik akışı.",
    İletişim: "Form + harita + iletişim bilgisi ile hızlı dönüşüm."
  };
  return suggestions[block] || "Özelleştirilebilir blok";
}

function renderAI() {
  const color = state.info.color;
  const seoTitle = `${state.info.sector || "Profesyonel"} | ${state.info.goal || "Modern Web Deneyimi"}`;
  const seoDesc = `${state.info.audience || "Hedef kitlenize"} uygun, responsive ve hızlı açılan site deneyimi.`;

  aiSuggestions.innerHTML = `
    <p><strong>Başlık Önerisi:</strong> ${seoTitle}</p>
    <p><strong>Alt Metin:</strong> ${state.info.slogan || "Markanızı bir adım öne taşıyın."}</p>
    <p><strong>CTA Önerisi:</strong> Ücretsiz Demo Başlat</p>
    <p><strong>Renk/Font:</strong> Ana renk ${color}, Inter + System UI</p>
    <p><strong>Animasyon:</strong> Banner fade-in, kart hover scale</p>
    <p><strong>SEO Meta:</strong> ${seoDesc}</p>
  `;

  document.documentElement.style.setProperty("--accent", color);
  document.getElementById("seoOutput").textContent = `SEO Başlık: ${seoTitle} | SEO Açıklama: ${seoDesc}`;
}

function updateAll() {
  renderCanvas();
  renderPreview();
  renderAI();
}

document.querySelectorAll(".add-block").forEach((btn) => {
  btn.addEventListener("click", () => {
    const block = btn.dataset.block;
    state.selectedBlocks.push(block);
    updateAll();
  });
});

canvas.addEventListener("click", (e) => {
  const remove = e.target.dataset.remove;
  if (remove !== undefined) {
    state.selectedBlocks.splice(+remove, 1);
    updateAll();
  }
});

document.getElementById("saveDesign").addEventListener("click", () => {
  localStorage.setItem("ws_builder_blocks", JSON.stringify(state.selectedBlocks));
  alert("Tasarım kaydedildi. Bir sonraki girişte otomatik yüklenecek.");
});

document.getElementById("quickForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  state.info = Object.fromEntries(form.entries());
  state.selectedBlocks = ["Banner", "Hizmetler", "Portföy", "Blog", "İletişim"];
  updateAll();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(btn.dataset.scroll).scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("languageToggle").addEventListener("click", (e) => {
  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");
  const isTR = e.target.textContent === "EN";
  if (isTR) {
    title.textContent = "Modular AI Website Builder";
    subtitle.textContent = "Build modern websites with one-click AI generation or drag-and-drop AI-assisted editing.";
    e.target.textContent = "TR";
  } else {
    title.textContent = "Modüler AI Web Sitesi Oluşturucu";
    subtitle.textContent = "Tek tıkla otomatik site üretimi veya sürükle-bırak AI destekli tasarım ile kullanıcı odaklı modern web sayfaları oluşturun.";
    e.target.textContent = "EN";
  }
});

renderTemplates();
updateAll();
blocks;
