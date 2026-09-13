// ===== CONFIG =====
// Вставьте сюда URL вашего развёрнутого Google Apps Script Web App (см. apps-script/Code.gs и SETUP.md)
// Используется формой заявки на главной (#booking) — единственной формой на сайте.
// Endpoint может быть любым (Apps Script, serverless-функция) — именно он пересылает
// заявку в мессенджер. НИКОГДА не вставляйте сюда токен Telegram-бота: это публичный код.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz6WtQhOt5k2CYBMQ-fJh1fQ22NJOqfTnSRS3_MTqm5zSDIXeUPzL8eArxVSSn7TgvK3g/exec";

function isAppsScriptConfigured() {
  return APPS_SCRIPT_URL.startsWith("http");
}

// ===== Язык страницы: /en/ задаёт <html lang="en">, остальные страницы русские =====
const LANG = document.documentElement.lang === "en" ? "en" : "ru";
const I18N = {
  ru: {
    slide: "Слайд",
    nameRequired: "Укажите, как к вам обращаться.",
    phoneIncomplete: "Введите номер телефона полностью.",
    notConfigured: "Форма пока не подключена. Напишите нам в WhatsApp — ответим сразу.",
    sending: "Отправляем…",
    sent: "Заявка отправлена! Мы свяжемся с вами в течение 30 минут.",
    failed: "Не удалось отправить заявку. Позвоните нам напрямую по телефону.",
    submit: "Отправить заявку"
  },
  en: {
    slide: "Slide",
    nameRequired: "Please tell us your name.",
    phoneIncomplete: "Please enter your full phone number.",
    notConfigured: "The form isn't connected yet. Message us on WhatsApp and we'll reply right away.",
    sending: "Sending…",
    sent: "Request sent! We'll contact you within 30 minutes.",
    failed: "Couldn't send your request. Please call us directly.",
    submit: "Send request"
  }
};
const t = key => I18N[LANG][key];

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Header scroll state =====
const header = document.getElementById("header");
if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  });
}

// ===== Mobile nav =====
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
if (burger && nav) {
  burger.addEventListener("click", () => nav.classList.toggle("is-open"));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("is-open")));
}

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll("[data-reveal]");
if (revealEls.length && typeof IntersectionObserver !== "undefined") {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: if no observer, show all immediately
  revealEls.forEach(el => el.classList.add("is-visible"));
}

// ===== Карусели (CSS scroll-snap + минимум JS на точки и стрелки) =====
document.querySelectorAll("[data-carousel]").forEach(carousel => {
  const track = carousel.querySelector(".carousel-track");
  if (!track) return;
  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  if (slides.length < 2) return;

  const dotsBox = carousel.querySelector(".carousel-dots");
  const prevBtn = carousel.querySelector(".carousel-arrow.prev");
  const nextBtn = carousel.querySelector(".carousel-arrow.next");

  const currentIndex = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    slides.forEach((slide, i) => {
      const mid = slide.offsetLeft - slides[0].offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  };

  const scrollToSlide = i => {
    const target = slides[Math.max(0, Math.min(slides.length - 1, i))];
    track.scrollTo({ left: target.offsetLeft - slides[0].offsetLeft, behavior: "smooth" });
  };

  const dots = dotsBox ? slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `${t("slide")} ${i + 1}`);
    dot.addEventListener("click", () => scrollToSlide(i));
    dotsBox.appendChild(dot);
    return dot;
  }) : [];

  const sync = () => {
    const i = currentIndex();
    dots.forEach((dot, di) => dot.classList.toggle("is-active", di === i));
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === slides.length - 1;
  };

  if (prevBtn) prevBtn.addEventListener("click", () => scrollToSlide(currentIndex() - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => scrollToSlide(currentIndex() + 1));

  let frame;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(sync);
  }, { passive: true });
  window.addEventListener("resize", sync);
  sync();
});

// ===== Телефон: маска +7 (___) ___-__-__ =====
function nationalPhoneDigits(value) {
  let rest = value.trim();
  if (rest.startsWith("+7")) rest = rest.slice(2);
  let digits = rest.replace(/\D/g, "");
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

function attachPhoneMask(input) {
  if (!input) return;
  const format = digits => {
    let out = "+7";
    if (digits.length) out += " (" + digits.slice(0, 3);
    if (digits.length >= 3) out += ") " + digits.slice(3, 6);
    if (digits.length >= 6) out += "-" + digits.slice(6, 8);
    if (digits.length >= 8) out += "-" + digits.slice(8, 10);
    return out;
  };
  input.addEventListener("focus", () => { if (!input.value) input.value = "+7 ("; });
  input.addEventListener("input", () => { input.value = format(nationalPhoneDigits(input.value)); });
  input.addEventListener("blur", () => { if (!nationalPhoneDigits(input.value)) input.value = ""; });
}

// ===== Форма заявки на главной (#booking) =====
const leadForm = document.getElementById("lead-form");
if (leadForm) {
  const leadName = document.getElementById("lead-name");
  const leadPhone = document.getElementById("lead-phone");
  const leadComment = document.getElementById("lead-comment");
  const leadStatus = document.getElementById("lead-status");
  const leadBtn = document.getElementById("lead-submit");
  const leadBtnText = leadBtn ? leadBtn.querySelector(".btn-text") : null;

  attachPhoneMask(leadPhone);

  const setLeadStatus = (type, message) => {
    if (!leadStatus) return;
    leadStatus.hidden = false;
    leadStatus.className = `form-status ${type}`;
    leadStatus.textContent = message;
  };

  leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (leadStatus) leadStatus.hidden = true;

    const name = leadName ? leadName.value.trim() : "";
    const digits = leadPhone ? nationalPhoneDigits(leadPhone.value) : "";

    if (!name) {
      setLeadStatus("error", t("nameRequired"));
      if (leadName) leadName.focus();
      return;
    }
    if (digits.length !== 10) {
      setLeadStatus("error", t("phoneIncomplete"));
      if (leadPhone) leadPhone.focus();
      return;
    }
    if (!isAppsScriptConfigured()) {
      setLeadStatus("error", t("notConfigured"));
      return;
    }

    if (leadBtn) leadBtn.disabled = true;
    if (leadBtnText) leadBtnText.textContent = t("sending");

    try {
      // no-cors + text/plain: обходим CORS-preflight, который Apps Script не обрабатывает
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          form: "lead-main",
          name: name,
          phone: "+7" + digits,
          comment: leadComment ? leadComment.value.trim() : "",
          submittedAt: new Date().toISOString(),
          source: "pureline-website",
          lang: LANG
        })
      });
      setLeadStatus("success", t("sent"));
      leadForm.reset();
    } catch (err) {
      console.error(err);
      setLeadStatus("error", t("failed"));
    } finally {
      if (leadBtn) leadBtn.disabled = false;
      if (leadBtnText) leadBtnText.textContent = t("submit");
    }
  });
}
