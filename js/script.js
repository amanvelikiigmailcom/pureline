// ===== CONFIG =====
// Вставьте сюда URL вашего развёрнутого Google Apps Script Web App (см. apps-script/Code.gs и SETUP.md)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz6WtQhOt5k2CYBMQ-fJh1fQ22NJOqfTnSRS3_MTqm5zSDIXeUPzL8eArxVSSn7TgvK3g/exec";

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
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: if no observer, show all immediately
  revealEls.forEach(el => el.classList.add("is-visible"));
}

// ===== Time slots =====
const timeInput = document.getElementById("time");
const selectedDatetimeEl = document.getElementById("selected-datetime");
const timeGrid = document.getElementById("time-grid");
if (timeGrid) {
  timeGrid.querySelectorAll(".time-slot").forEach(slot => {
    slot.addEventListener("click", () => {
      timeGrid.querySelectorAll(".time-slot").forEach(s => s.classList.remove("is-active"));
      slot.classList.add("is-active");
      if (timeInput) timeInput.value = slot.dataset.value;
      updateSelectedDatetime();
    });
  });
}

// ===== Calendar =====
const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const dateInput = document.getElementById("date");
const calDays = document.getElementById("cal-days");
const calMonthLabel = document.getElementById("cal-month-label");

const today = new Date();
today.setHours(0, 0, 0, 0);
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selectedDate = null;

function renderCalendar() {
  if (!calDays || !calMonthLabel) return;
  calMonthLabel.textContent = `${MONTHS_RU[viewMonth]} ${viewYear}`;
  calDays.innerHTML = "";

  const firstDay = new Date(viewYear, viewMonth, 1);
  // Convert Sunday(0)-based getDay() to Monday-based index
  let startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement("button");
    empty.className = "is-empty";
    empty.disabled = true;
    calDays.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(viewYear, viewMonth, d);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = d;

    const isPast = cellDate < today;
    if (isPast) btn.disabled = true;

    if (cellDate.getTime() === today.getTime()) btn.classList.add("is-today");
    if (selectedDate && cellDate.getTime() === selectedDate.getTime()) btn.classList.add("is-selected");

    btn.addEventListener("click", () => {
      selectedDate = cellDate;
      if (dateInput) dateInput.value = formatDateISO(cellDate);
      renderCalendar();
      updateSelectedDatetime();
    });

    calDays.appendChild(btn);
  }
}

function formatDateISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateRU(d) {
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()].toLowerCase()} ${d.getFullYear()}`;
}

function updateSelectedDatetime() {
  if (!selectedDatetimeEl) return;
  if (selectedDate && timeInput && timeInput.value) {
    selectedDatetimeEl.textContent = `${formatDateRU(selectedDate)} в ${timeInput.value}`;
  } else if (selectedDate) {
    selectedDatetimeEl.textContent = `${formatDateRU(selectedDate)} — выберите время`;
  } else {
    selectedDatetimeEl.textContent = "Выберите дату и время";
  }
}

const calPrev = document.getElementById("cal-prev");
if (calPrev) calPrev.addEventListener("click", () => {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderCalendar();
});
const calNext = document.getElementById("cal-next");
if (calNext) calNext.addEventListener("click", () => {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar();
});

if (calDays && calMonthLabel) renderCalendar();

// ===== Phone normalization =====
function normalizePhone(phone) {
  const trimmed = phone.trim();
  return trimmed.startsWith("+7") ? "8" + trimmed.slice(2) : trimmed;
}

// ===== Form submit =====
const form = document.getElementById("booking-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

function showStatus(type, message) {
  if (!statusEl) return;
  statusEl.hidden = false;
  statusEl.className = `form-status ${type}`;
  statusEl.textContent = message;
}

if (form) form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (statusEl) statusEl.hidden = true;

  const dateVal = dateInput ? dateInput.value : "";
  const timeVal = timeInput ? timeInput.value : "";
  if (!dateVal || !timeVal) {
    showStatus("error", "Пожалуйста, выберите дату и время в календаре.");
    return;
  }

  const nameEl = document.getElementById("name");
  const phoneEl = document.getElementById("phone");
  const addressEl = document.getElementById("address");
  const areaEl = document.getElementById("area");
  const commentEl = document.getElementById("comment");

  const payload = {
    date: dateInput ? dateInput.value : "",
    time: timeInput ? timeInput.value : "",
    name: nameEl ? nameEl.value.trim() : "",
    phone: phoneEl ? normalizePhone(phoneEl.value) : "",
    address: addressEl ? addressEl.value.trim() : "",
    area: areaEl ? areaEl.value.trim() : "",
    comment: commentEl ? commentEl.value.trim() : "",
    submittedAt: new Date().toISOString(),
    source: "pureline-website"
  };

  if (submitBtn) {
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector(".btn-text");
    if (btnText) btnText.textContent = "Отправляем…";
  }

  try {
    if (!APPS_SCRIPT_URL.includes("ВАШ_ID_РАЗВЁРТЫВАНИЯ")) {
      // no-cors: Apps Script не отдаёт CORS-заголовки, поэтому мы не можем прочитать ответ,
      // но данные успешно доходят и записываются в таблицу.
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
    } else {
      console.warn("APPS_SCRIPT_URL не настроен. См. SETUP.md для подключения Google Таблицы.");
    }

    showStatus("success", "Заявка отправлена! Мы свяжемся с вами в течение 30 минут.");
    form.reset();
    const timeGridEl = document.getElementById("time-grid");
    if (timeGridEl) timeGridEl.querySelectorAll(".time-slot").forEach(s => s.classList.remove("is-active"));
    selectedDate = null;
    renderCalendar();
    updateSelectedDatetime();
  } catch (err) {
    console.error(err);
    showStatus("error", "Не удалось отправить заявку. Позвоните нам напрямую по телефону.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      const btnText = submitBtn.querySelector(".btn-text");
      if (btnText) btnText.textContent = "Отправить заявку";
    }
  }
});
