/**
 * CareConnect AI - Elderly Care & Medication Management Platform
 * Complete frontend logic with localStorage persistence, audio synthesis,
 * speech recognition/synthesis, adherence tracking, vitals, and AI health companion.
 */

// ============================================================================
// 1. STATE & STORAGE INITIALIZATION
// ============================================================================

const todayDate = new Date();
const isoToday = todayDate.toISOString().slice(0, 10);

// Default Pre-seeded Medicines (Preserving existing compatibility & enriching fields)
const DEFAULT_MEDS = [
  {
    id: 1,
    name: "Amlodipine",
    dosage: "5 mg",
    type: "Tablet",
    time: "08:00",
    slot: "morning",
    instruction: "Take 1 tablet after breakfast with water",
    inventory: 24,
    doctor: "Dr. Meera Sharma",
    notes: "For blood pressure control. Do not take with grapefruit juice.",
    status: "taken",
    takenAt: "08:15 AM",
    date: isoToday
  },
  {
    id: 2,
    name: "Vitamin D3",
    dosage: "1000 IU",
    type: "Capsule",
    time: "08:00",
    slot: "morning",
    instruction: "Take with morning milk or breakfast",
    inventory: 14,
    doctor: "Dr. Meera Sharma",
    notes: "Supports bone density and calcium absorption.",
    status: "taken",
    takenAt: "08:16 AM",
    date: isoToday
  },
  {
    id: 3,
    name: "Metformin",
    dosage: "500 mg",
    type: "Tablet",
    time: "13:00",
    slot: "afternoon",
    instruction: "Take with lunch to reduce stomach upset",
    inventory: 18,
    doctor: "Dr. Rajesh Verma",
    notes: "For blood sugar management. Stay hydrated.",
    status: "pending",
    date: isoToday
  },
  {
    id: 4,
    name: "Atorvastatin",
    dosage: "10 mg",
    type: "Tablet",
    time: "20:30",
    slot: "night",
    instruction: "Take at bedtime with water",
    inventory: 4, // Trigger low stock refill alert!
    doctor: "Dr. Meera Sharma",
    notes: "For cholesterol management. Refill needed soon.",
    status: "pending",
    date: isoToday
  }
];

// Default Appointments
const DEFAULT_APPOINTMENTS = [
  {
    id: 1,
    doctor: "Dr. Meera Sharma",
    specialty: "Cardiologist",
    type: "In-person Clinic",
    date: getFutureDate(2),
    time: "10:30",
    location: "City Heart Care Clinic, Suite 304",
    purpose: "3-Month Blood Pressure Review & Routine ECG",
    notes: "Bring current medicine box and last 7 days BP readings."
  },
  {
    id: 2,
    doctor: "Dr. Rajesh Verma",
    specialty: "Ophthalmologist",
    type: "Hospital Consultation",
    date: getFutureDate(8),
    time: "11:00",
    location: "Apex Eye Care Hospital",
    purpose: "Annual Diabetic Retinal Screening",
    notes: "Pupil dilation scheduled; ask family member to accompany."
  },
  {
    id: 3,
    doctor: "Dr. Amit Patel",
    specialty: "General Physician",
    type: "In-person Clinic",
    date: getFutureDate(-14),
    time: "09:30",
    location: "Community Wellness Center",
    purpose: "Routine Blood Panel & Kidney Function Check",
    notes: "Completed. Creatinine and electrolytes were within normal range."
  }
];

// Default Vitals Log
const DEFAULT_VITALS = [
  {
    id: 1,
    date: isoToday,
    time: "08:10 AM",
    bpSystolic: 122,
    bpDiastolic: 80,
    glucose: 112,
    pulse: 72,
    weight: 68.5,
    notes: "Morning resting reading before breakfast"
  },
  {
    id: 2,
    date: getFutureDate(-1),
    time: "08:15 AM",
    bpSystolic: 124,
    bpDiastolic: 82,
    glucose: 116,
    pulse: 74,
    weight: 68.6,
    notes: "Fasting reading, patient slept well"
  },
  {
    id: 3,
    date: getFutureDate(-2),
    time: "08:30 AM",
    bpSystolic: 128,
    bpDiastolic: 84,
    glucose: 119,
    pulse: 76,
    weight: 68.4,
    notes: "Slight headache reported, resolved after hydration"
  }
];

// Default Caregiver Notes
const DEFAULT_CARE_NOTES = [
  {
    id: 1,
    author: "Sunita Rao (Caregiver)",
    date: "Today, 08:30 AM",
    text: "Ravi had a wholesome breakfast (oatmeal and apple). Took morning blood pressure and Vitamin D smoothly without difficulty."
  },
  {
    id: 2,
    author: "Anita Kumar (Daughter)",
    date: "Yesterday, 07:45 PM",
    text: "Visited dad for dinner. Checked pill organizer and ordered grocery supplies. Dad mentioned he feels energetic."
  }
];

// Default Live Activity Feed
const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    type: "taken",
    icon: "✅",
    text: "Ravi marked Vitamin D3 (1000 IU) as taken",
    time: "Today at 08:16 AM"
  },
  {
    id: 2,
    type: "taken",
    icon: "✅",
    text: "Ravi marked Amlodipine (5 mg) as taken",
    time: "Today at 08:15 AM"
  },
  {
    id: 3,
    type: "vital",
    icon: "🩺",
    text: "Caregiver Sunita logged Vitals: BP 122/80, Sugar 112 mg/dL",
    time: "Today at 08:10 AM"
  },
  {
    id: 4,
    type: "alert",
    icon: "⚠️",
    text: "Inventory Alert: Atorvastatin down to 4 pills remaining",
    time: "Yesterday at 09:00 PM"
  }
];

// Default Notifications
const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    type: "reminder",
    icon: "💊",
    title: "Afternoon Medicine Due Soon",
    message: "Metformin 500mg scheduled for 1:00 PM with lunch.",
    time: "Scheduled for 1:00 PM",
    read: false
  },
  {
    id: 2,
    type: "stock",
    icon: "📦",
    title: "Low Stock: Atorvastatin",
    message: "Only 4 pills left in your cabinet. Refill recommended.",
    time: "1 hour ago",
    read: false
  },
  {
    id: 3,
    type: "appointment",
    icon: "🩺",
    title: "Doctor Visit in 2 Days",
    message: "Appointment with Dr. Meera Sharma on Tuesday at 10:30 AM.",
    time: "Yesterday",
    read: true
  }
];

// Load or Seed Data
let medicines = loadFromStorage("cc_meds", DEFAULT_MEDS);
let appointments = loadFromStorage("cc_appointments", DEFAULT_APPOINTMENTS);
let vitals = loadFromStorage("cc_vitals", DEFAULT_VITALS);
let careNotes = loadFromStorage("cc_care_notes", DEFAULT_CARE_NOTES);
let activityFeed = loadFromStorage("cc_activity_log", DEFAULT_ACTIVITIES);
let notifications = loadFromStorage("cc_notifications", DEFAULT_NOTIFICATIONS);

// Active View State
let currentSelectedDate = isoToday;
let activeRole = localStorage.getItem("cc_role") || "senior"; // "senior" or "caregiver"
let currentFontSize = localStorage.getItem("cc_font_scale") || "large"; // "standard", "large", "xlarge"
let highContrastMode = localStorage.getItem("cc_high_contrast") === "true";
let aiVoiceEnabled = localStorage.getItem("cc_ai_voice") !== "false";
let currentMedFilter = "all";
let missedMedCandidateId = null;

// ============================================================================
// 2. HELPER UTILITIES
// ============================================================================

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch (e) {
    console.error("Storage load error:", e);
    return fallback;
  }
}

function saveState() {
  localStorage.setItem("cc_meds", JSON.stringify(medicines));
  localStorage.setItem("cc_appointments", JSON.stringify(appointments));
  localStorage.setItem("cc_vitals", JSON.stringify(vitals));
  localStorage.setItem("cc_care_notes", JSON.stringify(careNotes));
  localStorage.setItem("cc_activity_log", JSON.stringify(activityFeed));
  localStorage.setItem("cc_notifications", JSON.stringify(notifications));
}

function getFutureDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    return dateStr;
  }
}

function formatTime12(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

function escapeHTML(str) {
  return String(str || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function toast(msg, icon = "ℹ️") {
  const t = $("#toast");
  if (!t) return;
  t.innerHTML = `<span>${icon}</span> <span>${escapeHTML(msg)}</span>`;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2800);
}

function logActivity(text, type = "normal", icon = "📋") {
  const now = new Date();
  const timeLabel = `Today at ${now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  activityFeed.unshift({
    id: Date.now(),
    type,
    icon,
    text,
    time: timeLabel
  });
  if (activityFeed.length > 40) activityFeed.pop();
  saveState();
  renderActivityFeed();
}

// Web Audio API Gentle Sound Synthesizer (No external sound files required)
function playChime(type = "success") {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "success") {
      // Pleasant high double chime
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === "alert") {
      // Gentle reminder bell
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    }
  } catch (err) {
    // Audio synthesis not critical if blocked by browser policy
  }
}

// Text to Speech Helper for Elderly Accessibility
function speakText(text) {
  if (!("speechSynthesis" in window)) {
    toast("Voice speech is not supported in this browser.", "🔇");
    return;
  }
  window.speechSynthesis.cancel(); // Stop any pending speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Slightly slower, calm cadence for elderly users
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

// ============================================================================
// 3. ACCESSIBILITY & ROLE SWITCHER
// ============================================================================

function applyAccessibilitySettings() {
  document.body.classList.remove("font-scale-standard", "font-scale-large", "font-scale-xlarge");
  document.body.classList.add(`font-scale-` + currentFontSize);

  $("#fontStandardBtn")?.classList.toggle("active", currentFontSize === "standard");
  $("#fontLargeBtn")?.classList.toggle("active", currentFontSize === "large");
  $("#fontXLargeBtn")?.classList.toggle("active", currentFontSize === "xlarge");

  document.body.classList.toggle("high-contrast", highContrastMode);
  $("#contrastToggle")?.setAttribute("aria-pressed", highContrastMode ? "true" : "false");

  // Role
  document.body.classList.toggle("role-senior", activeRole === "senior");
  document.body.classList.toggle("role-caregiver", activeRole === "caregiver");
  $("#roleSeniorBtn")?.classList.toggle("active", activeRole === "senior");
  $("#roleCaregiverBtn")?.classList.toggle("active", activeRole === "caregiver");

  if ($("#currentRoleTag")) {
    $("#currentRoleTag").textContent = activeRole === "senior" ? "Senior Easy View" : "Caregiver & Family Portal";
  }

  if ($("#welcomeSub")) {
    $("#welcomeSub").textContent = activeRole === "senior"
      ? "Here is your simple daily medicine plan. Large buttons make it easy to record your medicines."
      : "Caregiver overview: Monitoring adherence, vitals, daily logs, and emergency contacts for Ravi.";
  }
}

function setFontSize(size) {
  currentFontSize = size;
  localStorage.setItem("cc_font_scale", size);
  applyAccessibilitySettings();
  toast(`Text size set to ${size === 'xlarge' ? 'Extra Large' : size === 'large' ? 'Large' : 'Standard'}`, "👁️");
}

function toggleHighContrast() {
  highContrastMode = !highContrastMode;
  localStorage.setItem("cc_high_contrast", highContrastMode ? "true" : "false");
  applyAccessibilitySettings();
  toast(highContrastMode ? "High contrast mode enabled" : "High contrast mode disabled", "🌓");
}

function switchRole(role) {
  activeRole = role;
  localStorage.setItem("cc_role", role);
  applyAccessibilitySettings();
  if (role === "caregiver") {
    switchTab("careteam");
  } else {
    switchTab("schedule");
  }
  toast(role === "senior" ? "Switched to Senior Easy View" : "Switched to Caregiver / Family Portal", "👤");
}

// ============================================================================
// 4. DAILY SCHEDULE RENDERING & TIMELINE
// ============================================================================

function renderSchedule() {
  // Determine date label
  const isSelectedToday = currentSelectedDate === isoToday;
  const targetDateObj = new Date(currentSelectedDate + "T00:00:00");
  const fullDateText = targetDateObj.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" });

  if ($("#scheduleFullDate")) $("#scheduleFullDate").textContent = fullDateText;
  if ($("#scheduleDateLabel")) {
    if (isSelectedToday) {
      $("#scheduleDateLabel").textContent = "Today";
    } else {
      const yesterdayStr = getFutureDate(-1);
      const tomorrowStr = getFutureDate(1);
      if (currentSelectedDate === yesterdayStr) $("#scheduleDateLabel").textContent = "Yesterday";
      else if (currentSelectedDate === tomorrowStr) $("#scheduleDateLabel").textContent = "Tomorrow";
      else $("#scheduleDateLabel").textContent = targetDateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
  }

  // Filter medicines for this date
  const dayMeds = medicines.map(m => {
    // If medicine has a specific date, match it, otherwise assume it's part of the daily recurring schedule
    return {
      ...m,
      currentStatus: m.date === currentSelectedDate ? (m.status || "pending") : (isSelectedToday ? (m.status || "pending") : "pending")
    };
  });

  // Render Slots
  const morningList = $("#morningMedsList");
  const afternoonList = $("#afternoonMedsList");
  const eveningList = $("#eveningMedsList");
  const nightList = $("#nightMedsList");

  const morningMeds = dayMeds.filter(m => getMedSlot(m) === "morning");
  const afternoonMeds = dayMeds.filter(m => getMedSlot(m) === "afternoon");
  const eveningMeds = dayMeds.filter(m => getMedSlot(m) === "evening");
  const nightMeds = dayMeds.filter(m => getMedSlot(m) === "night");

  if (morningList) morningList.innerHTML = morningMeds.length ? morningMeds.map(renderScheduleRow).join("") : renderEmptySlot("No morning medicines scheduled.");
  if (afternoonList) afternoonList.innerHTML = afternoonMeds.length ? afternoonMeds.map(renderScheduleRow).join("") : renderEmptySlot("No afternoon medicines scheduled.");
  if (eveningList) eveningList.innerHTML = eveningMeds.length ? eveningMeds.map(renderScheduleRow).join("") : renderEmptySlot("No evening medicines scheduled.");
  if (nightList) nightList.innerHTML = nightMeds.length ? nightMeds.map(renderScheduleRow).join("") : renderEmptySlot("No night medicines scheduled.");

  // Attach event handlers to schedule buttons
  attachScheduleEvents();

  // Update summary progress and next dose
  updateDailyProgress(dayMeds);
  updateUpcomingAppointmentSnippet();
}

function getMedSlot(med) {
  if (med.slot) return med.slot;
  if (!med.time) return "morning";
  const hour = parseInt(med.time.split(":")[0], 10);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

function renderScheduleRow(med) {
  const isTaken = med.currentStatus === "taken";
  const isMissed = med.currentStatus === "missed";
  const statusClass = isTaken ? "is-taken" : isMissed ? "is-missed" : "";

  const timeFormatted = formatTime12(med.time);
  const isLowStock = med.inventory !== undefined && med.inventory < 5;

  let actionsHtml = "";
  if (isTaken) {
    actionsHtml = `
      <div class="status-pill-badge taken">
        <span>✅ Taken at ${escapeHTML(med.takenAt || timeFormatted)}</span>
      </div>
      <button class="btn-undo" data-undo="${med.id}" title="Undo status">Undo</button>
    `;
  } else if (isMissed) {
    actionsHtml = `
      <div class="status-pill-badge missed">
        <span>⚠️ Missed: ${escapeHTML(med.missedReason || "Skipped")}</span>
      </div>
      <button class="btn-undo" data-undo="${med.id}" title="Undo status">Undo</button>
    `;
  } else {
    actionsHtml = `
      <button class="btn-take-big" data-take="${med.id}" aria-label="Mark ${escapeHTML(med.name)} as taken">
        <span>✓</span> <span>I TOOK THIS</span>
      </button>
      <button class="btn-missed-big" data-miss="${med.id}" aria-label="Mark ${escapeHTML(med.name)} as missed">
        <span>✕ Missed</span>
      </button>
    `;
  }

  return `
    <div class="med-schedule-row ${statusClass}" data-id="${med.id}">
      <div class="med-schedule-left">
        <div class="pill-badge-icon">
          ${getMedIcon(med.type)}
        </div>
        <div class="med-schedule-details">
          <div class="med-title-row">
            <span class="med-name-heading">${escapeHTML(med.name)}</span>
            <span class="dosage-pill">${escapeHTML(med.dosage || "")}</span>
            <span class="time-tag">⏰ ${escapeHTML(timeFormatted)}</span>
          </div>
          <p class="med-instructions">${escapeHTML(med.instruction || "Take as prescribed")}</p>
          <div class="inventory-tag ${isLowStock ? 'low' : ''}">
            📦 ${med.inventory !== undefined ? med.inventory : 30} pills remaining ${isLowStock ? '· Low stock!' : ''}
          </div>
        </div>
      </div>
      <div class="med-schedule-actions">
        ${actionsHtml}
        <button class="btn-speak-item" data-speak="${med.id}" title="Read this medicine out loud" aria-label="Listen">
          🔊
        </button>
      </div>
    </div>
  `;
}

function renderEmptySlot(message) {
  return `<div style="padding: 16px; color: var(--text-light); font-size: var(--font-sm); font-style: italic;">${escapeHTML(message)}</div>`;
}

function getMedIcon(type) {
  switch ((type || "").toLowerCase()) {
    case "capsule": return "💊";
    case "syrup": return "🥄";
    case "drops": return "💧";
    case "inhaler": return "💨";
    case "injection": return "💉";
    default: return "💊";
  }
}

function attachScheduleEvents() {
  // Mark Taken
  $$("[data-take]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.take);
      markMedicineTaken(id);
    });
  });

  // Mark Missed
  $$("[data-miss]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.miss);
      openMissedModal(id);
    });
  });

  // Undo
  $$("[data-undo]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.undo);
      undoMedicineStatus(id);
    });
  });

  // Speak Item
  $$("[data-speak]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.speak);
      const m = medicines.find(x => x.id === id);
      if (m) {
        speakText(`${m.name}, ${m.dosage}. Scheduled for ${formatTime12(m.time)}. ${m.instruction || ''}`);
      }
    });
  });
}

function updateDailyProgress(dayMeds) {
  const total = dayMeds.length;
  const taken = dayMeds.filter(m => m.currentStatus === "taken").length;
  const missed = dayMeds.filter(m => m.currentStatus === "missed").length;
  const pending = total - (taken + missed);
  const percent = total > 0 ? Math.round((taken / total) * 100) : 0;

  // Header progress
  if ($("#medicineCount")) $("#medicineCount").textContent = total;
  if ($("#takenCount")) $("#takenCount").textContent = taken;
  if ($("#pendingCount")) $("#pendingCount").textContent = pending;
  if ($("#pendingLabel")) $("#pendingLabel").textContent = `${pending} pending`;

  if ($("#progressStatusText")) {
    $("#progressStatusText").textContent = `${taken} of ${total} medicines taken (${percent}% completed)`;
  }
  if ($("#adherenceProgressFill")) {
    $("#adherenceProgressFill").style.width = `${percent}%`;
  }
  if ($("#adherenceProgressBar")) {
    $("#adherenceProgressBar").setAttribute("aria-valuenow", percent);
  }

  // Next Dose Banner
  const nextPending = dayMeds.find(m => m.currentStatus === "pending");
  if (nextPending) {
    if ($("#nextDoseTitle")) $("#nextDoseTitle").textContent = `Next: ${nextPending.name} (${nextPending.dosage})`;
    if ($("#nextDoseSubtitle")) $("#nextDoseSubtitle").textContent = `Scheduled for ${formatTime12(nextPending.time)} · ${nextPending.instruction || 'Due now'}`;
    if ($("#quickTakeNextBtn")) {
      $("#quickTakeNextBtn").onclick = () => markMedicineTaken(nextPending.id);
    }
  } else {
    if ($("#nextDoseTitle")) $("#nextDoseTitle").textContent = `All Medicines Completed! 🎉`;
    if ($("#nextDoseSubtitle")) $("#nextDoseSubtitle").textContent = `Great work staying on track today.`;
    if ($("#quickTakeNextBtn")) {
      $("#quickTakeNextBtn").onclick = () => toast("All scheduled medicines for today have already been completed!", "🎉");
    }
  }

  // Check low inventory for banner
  const lowStockItem = medicines.find(m => m.inventory !== undefined && m.inventory < 5);
  const banner = $("#alertBanner");
  if (lowStockItem && banner) {
    banner.style.display = "block";
    $("#alertBannerText").textContent = `Low Refill Alert: ${lowStockItem.name} has only ${lowStockItem.inventory} pills remaining.`;
    $("#alertBannerAction").onclick = () => {
      switchTab("medicines");
    };
  } else if (banner) {
    banner.style.display = "none";
  }
}

function updateUpcomingAppointmentSnippet() {
  const upcoming = appointments
    .filter(a => a.date >= isoToday)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  if ($("#appointmentCount")) $("#appointmentCount").textContent = upcoming.length;

  if (upcoming.length > 0) {
    const nextApt = upcoming[0];
    const daysUntil = Math.ceil((new Date(nextApt.date + "T00:00:00") - new Date(isoToday + "T00:00:00")) / (1000 * 60 * 60 * 24));
    const dayLabel = daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`;

    if ($("#nextVisitHint")) $("#nextVisitHint").textContent = `${nextApt.doctor.split(" ")[0]} (${dayLabel})`;
    if ($("#snippetAppointmentText")) {
      $("#snippetAppointmentText").textContent = `${nextApt.doctor} (${nextApt.specialty || 'Doctor'}) · ${formatDate(nextApt.date)} at ${formatTime12(nextApt.time)}`;
    }
  } else {
    if ($("#nextVisitHint")) $("#nextVisitHint").textContent = "No visits soon";
    if ($("#snippetAppointmentText")) $("#snippetAppointmentText").textContent = "No upcoming visits scheduled.";
  }
}

// Mark Medicine as Taken
function markMedicineTaken(id) {
  const med = medicines.find(m => m.id === id);
  if (!med) return;

  const now = new Date();
  const timeTakenStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  med.status = "taken";
  med.takenAt = timeTakenStr;
  med.date = currentSelectedDate;

  // Decrement pill inventory if available
  if (med.inventory !== undefined && med.inventory > 0) {
    med.inventory = med.inventory - 1;
  }

  saveState();
  renderSchedule();
  renderMedicineCabinet();
  renderAdherenceAnalytics();

  playChime("success");
  toast(`${med.name} marked as taken at ${timeTakenStr}!`, "✅");
  logActivity(`Ravi marked ${med.name} (${med.dosage}) as taken`, "taken", "✅");

  if (aiVoiceEnabled) {
    speakText(`Good job! You took ${med.name}.`);
  }
}

// Mark Medicine as Missed Dialog
function openMissedModal(id) {
  missedMedCandidateId = id;
  const med = medicines.find(m => m.id === id);
  if (!med) return;

  if ($("#missedMedName")) $("#missedMedName").textContent = `${med.name} (${med.dosage})`;
  $("#missedModal")?.showModal();
}

function confirmMedicineMissed() {
  if (!missedMedCandidateId) return;
  const med = medicines.find(m => m.id === missedMedCandidateId);
  if (!med) return;

  const selectedReason = document.querySelector('input[name="missedReason"]:checked')?.value || "Forgot / Skipped";

  med.status = "missed";
  med.missedReason = selectedReason;
  med.date = currentSelectedDate;

  saveState();
  renderSchedule();
  renderMedicineCabinet();
  renderAdherenceAnalytics();

  $("#missedModal")?.close();
  toast(`${med.name} recorded as missed (${selectedReason})`, "⚠️");
  logActivity(`Missed dose recorded for ${med.name}: ${selectedReason}`, "missed", "⚠️");

  // Send a high priority notification to caregiver feed
  notifications.unshift({
    id: Date.now(),
    type: "alert",
    icon: "⚠️",
    title: `Missed Dose: ${med.name}`,
    message: `Ravi missed ${med.name} (${selectedReason}).`,
    time: "Just now",
    read: false
  });
  saveState();
  renderNotifications();
}

function undoMedicineStatus(id) {
  const med = medicines.find(m => m.id === id);
  if (!med) return;

  const prevStatus = med.status;
  if (prevStatus === "taken" && med.inventory !== undefined) {
    med.inventory = med.inventory + 1; // restore pill
  }

  med.status = "pending";
  delete med.takenAt;
  delete med.missedReason;

  saveState();
  renderSchedule();
  renderMedicineCabinet();
  renderAdherenceAnalytics();

  toast(`Status for ${med.name} reset to pending`, "↺");
  logActivity(`Reset status for ${med.name}`, "normal", "↺");
}

function bulkTakeSlot(slot) {
  const slotMeds = medicines.filter(m => getMedSlot(m) === slot && m.status !== "taken");
  if (slotMeds.length === 0) {
    toast(`All ${slot} medicines are already marked as taken!`, "ℹ️");
    return;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  slotMeds.forEach(m => {
    m.status = "taken";
    m.takenAt = timeStr;
    m.date = currentSelectedDate;
    if (m.inventory !== undefined && m.inventory > 0) m.inventory -= 1;
  });

  saveState();
  renderSchedule();
  renderMedicineCabinet();
  renderAdherenceAnalytics();

  playChime("success");
  toast(`Marked ${slotMeds.length} ${slot} medicines as taken!`, "✅");
  logActivity(`Ravi completed all ${slot} medicines (${slotMeds.length} doses)`, "taken", "✅");
}

// ============================================================================
// 5. MEDICATION CABINET (CRUD & SEARCH)
// ============================================================================

function renderMedicineCabinet() {
  const grid = $("#medicationsGrid");
  if (!grid) return;

  const searchQuery = ($("#medSearchInput")?.value || "").toLowerCase().trim();

  const filtered = medicines.filter(m => {
    // Slot filter
    if (currentMedFilter === "morning" && getMedSlot(m) !== "morning") return false;
    if (currentMedFilter === "afternoon" && getMedSlot(m) !== "afternoon") return false;
    if (currentMedFilter === "evening" && getMedSlot(m) !== "evening") return false;
    if (currentMedFilter === "night" && getMedSlot(m) !== "night") return false;
    if (currentMedFilter === "low-stock" && (m.inventory === undefined || m.inventory >= 5)) return false;

    // Search query
    if (searchQuery) {
      const matchName = (m.name || "").toLowerCase().includes(searchQuery);
      const matchDosage = (m.dosage || "").toLowerCase().includes(searchQuery);
      const matchInst = (m.instruction || "").toLowerCase().includes(searchQuery);
      const matchDoctor = (m.doctor || "").toLowerCase().includes(searchQuery);
      return matchName || matchDosage || matchInst || matchDoctor;
    }
    return true;
  });

  // Update counts
  if ($("#countFilterAll")) $("#countFilterAll").textContent = medicines.length;
  if ($("#countFilterLow")) $("#countFilterLow").textContent = medicines.filter(m => m.inventory < 5).length;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
        <p style="font-size: var(--font-lg); font-weight: 700; color: var(--text-muted);">No medicines match your search or filter.</p>
        <button class="action-pill-btn primary" id="resetMedFilterBtn" style="margin-top: 14px;">Show All Medicines</button>
      </div>
    `;
    $("#resetMedFilterBtn")?.addEventListener("click", () => {
      currentMedFilter = "all";
      if ($("#medSearchInput")) $("#medSearchInput").value = "";
      $$(".filter-chip").forEach(c => c.classList.toggle("active", c.dataset.filter === "all"));
      renderMedicineCabinet();
    });
    return;
  }

  grid.innerHTML = filtered.map(m => {
    const isLow = m.inventory !== undefined && m.inventory < 5;
    return `
      <article class="med-card" data-id="${m.id}">
        <div>
          <div class="med-card-header">
            <div class="med-card-title-group">
              <div class="med-card-icon">${getMedIcon(m.type)}</div>
              <div>
                <h3 class="med-card-name">${escapeHTML(m.name)}</h3>
                <span class="med-card-dosage">${escapeHTML(m.dosage)} · ${escapeHTML(m.type || 'Tablet')}</span>
              </div>
            </div>
            <span class="med-card-badge">⏰ ${formatTime12(m.time)}</span>
          </div>

          <div class="med-card-body">
            <div class="med-meta-item">
              <span>📋</span>
              <span><strong>Routine:</strong> ${capitalize(getMedSlot(m))} (${escapeHTML(m.instruction || 'Take as prescribed')})</span>
            </div>
            <div class="med-meta-item">
              <span>👨‍⚕️</span>
              <span><strong>Prescriber:</strong> ${escapeHTML(m.doctor || 'Primary Physician')}</span>
            </div>
            <div class="med-meta-item">
              <span>📦</span>
              <span><strong>Supply:</strong> ${m.inventory !== undefined ? m.inventory : 30} pills remaining ${isLow ? '<span style="color:var(--accent-rose); font-weight:800;">(Low stock!)</span>' : ''}</span>
            </div>
            ${m.notes ? `<div class="med-notes-box">💡 ${escapeHTML(m.notes)}</div>` : ''}
          </div>
        </div>

        <div class="med-card-footer">
          <div class="med-card-actions">
            <button class="card-icon-btn" data-edit-med="${m.id}">✏️ Edit</button>
            <button class="card-icon-btn delete-btn" data-delete-med="${m.id}">🗑️ Delete</button>
          </div>
          <button class="card-icon-btn" data-speak-card="${m.id}">🔊 Listen</button>
        </div>
      </article>
    `;
  }).join("");

  // Attach CRUD action events
  $$("[data-edit-med]").forEach(b => {
    b.addEventListener("click", () => openMedicineModal(Number(b.dataset.editMed)));
  });

  $$("[data-delete-med]").forEach(b => {
    b.addEventListener("click", () => deleteMedicine(Number(b.dataset.deleteMed)));
  });

  $$("[data-speak-card]").forEach(b => {
    b.addEventListener("click", () => {
      const id = Number(b.dataset.speakCard);
      const m = medicines.find(x => x.id === id);
      if (m) speakText(`${m.name}, ${m.dosage}. Take ${m.instruction || 'as prescribed'} at ${formatTime12(m.time)}.`);
    });
  });
}

function openMedicineModal(editId = null) {
  const modal = $("#medicineModal");
  const form = $("#medicineModalForm");
  if (!modal || !form) return;

  form.reset();

  if (editId) {
    const med = medicines.find(m => m.id === editId);
    if (!med) return;
    $("#medModalTitle").textContent = "Edit Medicine";
    $("#editMedId").value = med.id;
    $("#medNameInput").value = med.name;
    $("#medDosageInput").value = med.dosage;
    $("#medTypeSelect").value = med.type || "Tablet";
    $("#medTimeInput").value = med.time;
    $("#medSlotSelect").value = getMedSlot(med);
    $("#medInstructionInput").value = med.instruction || "";
    $("#medInventoryInput").value = med.inventory !== undefined ? med.inventory : 30;
    $("#medDoctorInput").value = med.doctor || "";
    $("#medNotesInput").value = med.notes || "";
  } else {
    $("#medModalTitle").textContent = "Add Medicine";
    $("#editMedId").value = "";
    $("#medTimeInput").value = "08:00";
    $("#medInventoryInput").value = "30";
  }

  modal.showModal();
}

function saveMedicineForm(e) {
  e.preventDefault();
  const editId = $("#editMedId").value;
  const name = $("#medNameInput").value.trim();
  const dosage = $("#medDosageInput").value.trim();
  const type = $("#medTypeSelect").value;
  const time = $("#medTimeInput").value;
  const slot = $("#medSlotSelect").value;
  const instruction = $("#medInstructionInput").value.trim();
  const inventory = parseInt($("#medInventoryInput").value, 10) || 0;
  const doctor = $("#medDoctorInput").value.trim();
  const notes = $("#medNotesInput").value.trim();

  if (editId) {
    const med = medicines.find(m => m.id === Number(editId));
    if (med) {
      med.name = name;
      med.dosage = dosage;
      med.type = type;
      med.time = time;
      med.slot = slot;
      med.instruction = instruction;
      med.inventory = inventory;
      med.doctor = doctor;
      med.notes = notes;
      toast(`Updated ${name} successfully!`, "✏️");
      logActivity(`Medicine updated: ${name} (${dosage})`, "normal", "✏️");
    }
  } else {
    const newMed = {
      id: Date.now(),
      name,
      dosage,
      type,
      time,
      slot,
      instruction,
      inventory,
      doctor,
      notes,
      status: "pending",
      date: isoToday
    };
    medicines.push(newMed);
    toast(`Added ${name} to your medicine cabinet!`, "💊");
    logActivity(`New medicine added: ${name} (${dosage})`, "normal", "＋");
  }

  saveState();
  $("#medicineModal").close();
  renderSchedule();
  renderMedicineCabinet();
  renderAdherenceAnalytics();
}

function deleteMedicine(id) {
  const med = medicines.find(m => m.id === id);
  if (!med) return;

  const confirmed = window.confirm(`Are you sure you want to remove "${med.name}" from your medicine schedule?`);
  if (!confirmed) return;

  medicines = medicines.filter(m => m.id !== id);
  saveState();
  renderSchedule();
  renderMedicineCabinet();
  renderAdherenceAnalytics();

  toast(`Removed ${med.name} from schedule`, "🗑️");
  logActivity(`Deleted medicine: ${med.name}`, "normal", "🗑️");
}

function capitalize(s) {
  return String(s || "").charAt(0).toUpperCase() + String(s || "").slice(1);
}

// ============================================================================
// 6. DOCTOR APPOINTMENTS MANAGEMENT
// ============================================================================

function renderAppointments() {
  const upcomingContainer = $("#upcomingAppointmentsList");
  const pastContainer = $("#pastAppointmentsList");
  if (!upcomingContainer || !pastContainer) return;

  const upcoming = appointments
    .filter(a => a.date >= isoToday)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const past = appointments
    .filter(a => a.date < isoToday)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  if ($("#upcomingCount")) $("#upcomingCount").textContent = upcoming.length;

  // Render Upcoming
  if (upcoming.length === 0) {
    upcomingContainer.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted); background: var(--surface-card); border-radius: var(--radius-md);">No upcoming appointments scheduled.</div>`;
  } else {
    upcomingContainer.innerHTML = upcoming.map((apt, idx) => {
      const daysUntil = Math.ceil((new Date(apt.date + "T00:00:00") - new Date(isoToday + "T00:00:00")) / (1000 * 60 * 60 * 24));
      const countdownTag = daysUntil === 0 ? "TODAY" : daysUntil === 1 ? "TOMORROW" : `In ${daysUntil} days`;

      return `
        <article class="appointment-card ${idx === 0 ? 'upcoming-highlight' : ''}" data-id="${apt.id}">
          <div class="appointment-card-head">
            <div>
              <div class="appointment-specialty">${escapeHTML(apt.specialty || 'Physician')}</div>
              <h4 class="appointment-doctor-name">${escapeHTML(apt.doctor)}</h4>
            </div>
            <span class="apt-date-badge">${escapeHTML(countdownTag)}</span>
          </div>

          <div class="appointment-details">
            <div>🗓️ <strong>${formatDate(apt.date)}</strong> at <strong>${formatTime12(apt.time)}</strong> (${escapeHTML(apt.type || 'Clinic')})</div>
            ${apt.location ? `<div>📍 ${escapeHTML(apt.location)}</div>` : ''}
            ${apt.purpose ? `<div>🎯 <em>Purpose:</em> ${escapeHTML(apt.purpose)}</div>` : ''}
            ${apt.notes ? `<div class="apt-prep-box">⚠️ <strong>Preparation:</strong> ${escapeHTML(apt.notes)}</div>` : ''}
          </div>

          <div class="appointment-actions">
            <button class="action-pill-btn secondary small" data-download-ics="${apt.id}">📅 Add to Calendar</button>
            <div style="display:flex; gap:6px;">
              <button class="card-icon-btn" data-edit-apt="${apt.id}">✏️ Edit</button>
              <button class="card-icon-btn delete-btn" data-delete-apt="${apt.id}">🗑️ Delete</button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // Render Past
  if (past.length === 0) {
    pastContainer.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted); background: var(--surface-card); border-radius: var(--radius-md);">No past appointment records.</div>`;
  } else {
    pastContainer.innerHTML = past.map(apt => `
      <article class="appointment-card" data-id="${apt.id}">
        <div class="appointment-card-head">
          <div>
            <div class="appointment-specialty">${escapeHTML(apt.specialty || 'Physician')}</div>
            <h4 class="appointment-doctor-name">${escapeHTML(apt.doctor)}</h4>
          </div>
          <span style="font-size:11px; background:var(--surface-subtle); padding:2px 8px; border-radius:var(--radius-full); font-weight:700;">Completed</span>
        </div>
        <div class="appointment-details">
          <div>🗓️ ${formatDate(apt.date)} · ${formatTime12(apt.time)}</div>
          ${apt.purpose ? `<div>🎯 ${escapeHTML(apt.purpose)}</div>` : ''}
          ${apt.notes ? `<div style="font-size:11px; color:var(--text-light);">Visit Outcome: ${escapeHTML(apt.notes)}</div>` : ''}
        </div>
      </article>
    `).join("");
  }

  // Attach Appointment Events
  $$("[data-edit-apt]").forEach(b => {
    b.addEventListener("click", () => openAppointmentModal(Number(b.dataset.editApt)));
  });

  $$("[data-delete-apt]").forEach(b => {
    b.addEventListener("click", () => deleteAppointment(Number(b.dataset.deleteApt)));
  });

  $$("[data-download-ics]").forEach(b => {
    b.addEventListener("click", () => downloadIcsFile(Number(b.dataset.downloadIcs)));
  });
}

function openAppointmentModal(editId = null) {
  const modal = $("#appointmentModal");
  const form = $("#appointmentModalForm");
  if (!modal || !form) return;

  form.reset();

  if (editId) {
    const apt = appointments.find(a => a.id === editId);
    if (!apt) return;
    $("#aptModalTitle").textContent = "Edit Doctor Appointment";
    $("#editAptId").value = apt.id;
    $("#aptDoctorInput").value = apt.doctor;
    $("#aptSpecialtyInput").value = apt.specialty || "";
    $("#aptTypeSelect").value = apt.type || "In-person Clinic";
    $("#aptDateInput").value = apt.date;
    $("#aptTimeInput").value = apt.time;
    $("#aptLocationInput").value = apt.location || "";
    $("#aptPurposeInput").value = apt.purpose || "";
    $("#aptNotesInput").value = apt.notes || "";
  } else {
    $("#aptModalTitle").textContent = "Schedule Doctor Visit";
    $("#editAptId").value = "";
    $("#aptDateInput").value = getFutureDate(3);
    $("#aptTimeInput").value = "10:30";
  }

  modal.showModal();
}

function saveAppointmentForm(e) {
  e.preventDefault();
  const editId = $("#editAptId").value;
  const doctor = $("#aptDoctorInput").value.trim();
  const specialty = $("#aptSpecialtyInput").value.trim();
  const type = $("#aptTypeSelect").value;
  const date = $("#aptDateInput").value;
  const time = $("#aptTimeInput").value;
  const location = $("#aptLocationInput").value.trim();
  const purpose = $("#aptPurposeInput").value.trim();
  const notes = $("#aptNotesInput").value.trim();

  if (editId) {
    const apt = appointments.find(a => a.id === Number(editId));
    if (apt) {
      apt.doctor = doctor;
      apt.specialty = specialty;
      apt.type = type;
      apt.date = date;
      apt.time = time;
      apt.location = location;
      apt.purpose = purpose;
      apt.notes = notes;
      toast(`Appointment with ${doctor} updated!`, "🩺");
      logActivity(`Updated appointment: ${doctor} on ${formatDate(date)}`, "normal", "🩺");
    }
  } else {
    const newApt = {
      id: Date.now(),
      doctor,
      specialty,
      type,
      date,
      time,
      location,
      purpose,
      notes
    };
    appointments.push(newApt);
    toast(`Appointment with ${doctor} added!`, "🩺");
    logActivity(`Scheduled appointment: ${doctor} on ${formatDate(date)}`, "normal", "🩺");

    // Add notification
    notifications.unshift({
      id: Date.now(),
      type: "appointment",
      icon: "🩺",
      title: `New Visit Scheduled`,
      message: `${doctor} on ${formatDate(date)} at ${formatTime12(time)}`,
      time: "Just now",
      read: false
    });
  }

  saveState();
  $("#appointmentModal").close();
  renderAppointments();
  renderSchedule();
  renderNotifications();
}

function deleteAppointment(id) {
  const apt = appointments.find(a => a.id === id);
  if (!apt) return;

  if (!window.confirm(`Cancel and delete appointment with ${apt.doctor}?`)) return;

  appointments = appointments.filter(a => a.id !== id);
  saveState();
  renderAppointments();
  renderSchedule();
  toast(`Appointment cancelled`, "🗑️");
  logActivity(`Cancelled appointment with ${apt.doctor}`, "normal", "🗑️");
}

// Client-Side .ics Calendar File Generation
function downloadIcsFile(id) {
  const apt = appointments.find(a => a.id === id);
  if (!apt) return;

  const dtStr = (apt.date + "T" + apt.time).replace(/[-:]/g, "") + "00";
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CareConnect AI//Elderly Care Platform//EN",
    "BEGIN:VEVENT",
    `SUMMARY:Doctor Appointment: ${apt.doctor}`,
    `DESCRIPTION:${apt.purpose || 'Doctor Visit'} - Notes: ${apt.notes || ''}`,
    `LOCATION:${apt.location || 'Clinic'}`,
    `DTSTART:${dtStr}`,
    `DTEND:${dtStr}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `appointment-${apt.doctor.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast(`Downloaded calendar event for ${apt.doctor}`, "📅");
}

// ============================================================================
// 7. ADHERENCE ANALYTICS & VITALS LOG
// ============================================================================

function renderAdherenceAnalytics() {
  // Pre-calculated 7-day adherence dataset
  const past7Days = [];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate 7 days ending today
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const dayName = daysOfWeek[d.getDay()];

    let rate = 100;
    let scheduled = medicines.length;
    let taken = medicines.length;

    if (i === 0) {
      // Today
      const todaysTaken = medicines.filter(m => m.status === "taken").length;
      scheduled = medicines.length;
      taken = todaysTaken;
      rate = scheduled > 0 ? Math.round((taken / scheduled) * 100) : 100;
    } else if (i === 1) {
      // Yesterday: 100%
      rate = 100;
    } else if (i === 2) {
      // 2 days ago: 75%
      rate = 75;
      taken = Math.max(1, scheduled - 1);
    } else if (i === 3) {
      // 3 days ago: 100%
      rate = 100;
    } else if (i === 4) {
      // 4 days ago: 100%
      rate = 100;
    } else if (i === 5) {
      // 5 days ago: 100%
      rate = 100;
    } else {
      // 6 days ago: 80%
      rate = 80;
    }

    past7Days.push({
      date: iso,
      dayName: i === 0 ? "Today" : dayName,
      rate,
      scheduled,
      taken
    });
  }

  // Overall 7-day score calculation
  const totalRateSum = past7Days.reduce((acc, curr) => acc + curr.rate, 0);
  const avgAdherence = Math.round(totalRateSum / past7Days.length);

  if ($("#adherencePercentText")) $("#adherencePercentText").textContent = `${avgAdherence}%`;
  if ($("#adherenceCircleGauge")) {
    const deg = Math.round((avgAdherence / 100) * 360);
    $("#adherenceCircleGauge").style.background = `conic-gradient(var(--success) 0deg ${deg}deg, var(--border-light) ${deg}deg 360deg)`;
  }

  // Render 7-Day Chart Bars
  const barsContainer = $("#adherenceBarsContainer");
  if (barsContainer) {
    barsContainer.innerHTML = past7Days.map(item => {
      const barClass = item.rate >= 90 ? "full" : item.rate >= 50 ? "partial" : "zero";
      return `
        <div class="bar-column">
          <span class="bar-percent-label">${item.rate}%</span>
          <div class="bar-fill-wrap" title="${item.dayName} (${item.date}): ${item.rate}% compliance">
            <div class="bar-inner ${barClass}" style="height: ${Math.max(10, item.rate)}%;"></div>
          </div>
          <span class="bar-day-label">${item.dayName}</span>
        </div>
      `;
    }).join("");
  }

  // Render Vitals
  renderVitals();
}

function renderVitals() {
  const tbody = $("#vitalsTableBody");
  if (!tbody) return;

  if (vitals.length > 0) {
    const latest = vitals[0];
    if ($("#latestBpVal")) $("#latestBpVal").textContent = `${latest.bpSystolic} / ${latest.bpDiastolic}`;
    if ($("#latestSugarVal")) $("#latestSugarVal").textContent = `${latest.glucose} mg/dL`;
    if ($("#latestPulseVal")) $("#latestPulseVal").textContent = `${latest.pulse} bpm`;
    if ($("#latestWeightVal")) $("#latestWeightVal").textContent = `${latest.weight} kg`;
  }

  tbody.innerHTML = vitals.map(v => `
    <tr>
      <td><strong>${formatDate(v.date)}</strong> · <small style="color:var(--text-light);">${v.time}</small></td>
      <td><span style="font-weight:800; color:var(--accent-rose);">${v.bpSystolic}/${v.bpDiastolic}</span> mmHg</td>
      <td><span style="font-weight:800; color:var(--accent-amber);">${v.glucose}</span> mg/dL</td>
      <td><span style="font-weight:800; color:var(--accent-blue);">${v.pulse}</span> bpm</td>
      <td style="color:var(--text-muted); font-size:12px;">${escapeHTML(v.notes || 'Routine check')}</td>
    </tr>
  `).join("");
}

function saveVitalsForm(e) {
  e.preventDefault();
  const sys = parseInt($("#vitalBpSystolic").value, 10) || 120;
  const dia = parseInt($("#vitalBpDiastolic").value, 10) || 80;
  const sugar = parseInt($("#vitalSugarInput").value, 10) || 110;
  const pulse = parseInt($("#vitalPulseInput").value, 10) || 72;
  const weight = parseFloat($("#vitalWeightInput").value) || 68.5;
  const notes = $("#vitalNotesInput").value.trim();

  const now = new Date();
  const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const newVital = {
    id: Date.now(),
    date: isoToday,
    time: timeStr,
    bpSystolic: sys,
    bpDiastolic: dia,
    glucose: sugar,
    pulse,
    weight,
    notes
  };

  vitals.unshift(newVital);
  saveState();
  $("#vitalsModal").close();
  renderVitals();
  toast(`Logged Vitals: BP ${sys}/${dia}, Sugar ${sugar} mg/dL`, "🩺");
  logActivity(`Vitals recorded: BP ${sys}/${dia} mmHg, Pulse ${pulse} bpm`, "vital", "🩺");
}

// Generate Printable Doctor Summary
function printDoctorReport() {
  const printContainer = $("#printableDoctorReport");
  if (!printContainer) return;

  const activeMeds = medicines.map(m => `
    <li><strong>${escapeHTML(m.name)} (${escapeHTML(m.dosage)})</strong>: ${escapeHTML(m.instruction || 'As prescribed')} · Scheduled: ${formatTime12(m.time)} (Prescriber: ${escapeHTML(m.doctor || 'Physician')})</li>
  `).join("");

  const vitalsRows = vitals.slice(0, 5).map(v => `
    <tr>
      <td>${formatDate(v.date)} ${v.time}</td>
      <td>${v.bpSystolic}/${v.bpDiastolic} mmHg</td>
      <td>${v.glucose} mg/dL</td>
      <td>${v.pulse} bpm</td>
      <td>${v.weight} kg</td>
    </tr>
  `).join("");

  printContainer.innerHTML = `
    <div style="font-family:sans-serif; padding:20px; line-height:1.5;">
      <h1 style="color:#0f766e; border-bottom:2px solid #0f766e; padding-bottom:8px;">CareConnect AI — Senior Clinical Summary</h1>
      <p><strong>Patient Name:</strong> Ravi Kumar (Age 74) | <strong>Date of Report:</strong> ${formatDate(isoToday)}</p>
      <p><strong>Emergency Contact:</strong> Anita Kumar (Daughter) · +1 (555) 019-2834</p>
      <p><strong>7-Day Medication Adherence:</strong> 94% (High Consistency)</p>

      <h3 style="margin-top:20px; color:#0f766e;">Current Active Medications</h3>
      <ul>${activeMeds}</ul>

      <h3 style="margin-top:20px; color:#0f766e;">Recent Vitals History</h3>
      <table border="1" cellpadding="8" style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th>Date & Time</th><th>Blood Pressure</th><th>Glucose</th><th>Pulse</th><th>Weight</th>
          </tr>
        </thead>
        <tbody>${vitalsRows}</tbody>
      </table>

      <h3 style="margin-top:20px; color:#0f766e;">Upcoming Consultations</h3>
      <p>${appointments.filter(a => a.date >= isoToday).map(a => `${a.doctor} on ${formatDate(a.date)} at ${formatTime12(a.time)}`).join("<br>") || 'None'}</p>
      <p style="margin-top:30px; font-size:11px; color:#64748b;">Generated securely by CareConnect AI Elderly Management Platform.</p>
    </div>
  `;

  window.print();
}

// ============================================================================
// 8. CAREGIVER & FAMILY DASHBOARD
// ============================================================================

function renderActivityFeed() {
  const feed = $("#activityFeed");
  if (!feed) return;

  if (activityFeed.length === 0) {
    feed.innerHTML = `<div style="padding:16px; color:var(--text-light); text-align:center;">No recent care activities.</div>`;
    return;
  }

  feed.innerHTML = activityFeed.map(item => `
    <div class="feed-item ${item.type}">
      <span class="feed-icon">${item.icon || '📋'}</span>
      <div class="feed-content">
        <strong>${escapeHTML(item.text)}</strong>
        <small>${escapeHTML(item.time)}</small>
      </div>
    </div>
  `).join("");
}

function renderCareJournal() {
  const container = $("#journalEntriesList");
  if (!container) return;

  container.innerHTML = careNotes.map(note => `
    <article class="journal-card">
      <div class="journal-meta">
        <strong>${escapeHTML(note.author)}</strong>
        <span>${escapeHTML(note.date)}</span>
      </div>
      <p class="journal-text">${escapeHTML(note.text)}</p>
    </article>
  `).join("");
}

function saveCareNote(e) {
  e.preventDefault();
  const author = $("#careNoteAuthorInput").value;
  const text = $("#careNoteTextInput").value.trim();

  const now = new Date();
  const dateStr = `Today, ${now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;

  careNotes.unshift({
    id: Date.now(),
    author,
    date: dateStr,
    text
  });

  saveState();
  $("#careNoteModal").close();
  renderCareJournal();
  toast("Care note added to journal", "✍️");
  logActivity(`New care journal entry logged by ${author.split(" ")[0]}`, "normal", "✍️");
}

function triggerEmergencySos() {
  playChime("alert");
  toast("EMERGENCY PROTOCOL ACTIVATED: Alerting family & doctor", "🚨");
  logActivity("CRITICAL: Emergency SOS button pressed for Ravi Kumar", "alert", "🚨");

  notifications.unshift({
    id: Date.now(),
    type: "sos",
    icon: "🚨",
    title: "CRITICAL: SOS Emergency Triggered",
    message: "SOS alert activated. Anita and Sunita notified immediately.",
    time: "Just now",
    read: false
  });
  saveState();
  renderNotifications();

  speakText("Emergency alert sent to family members. Help is on the way.");
  $("#sosModal")?.showModal();
}

// ============================================================================
// 9. NOTIFICATIONS & REMINDER SIMULATION
// ============================================================================

function renderNotifications() {
  const badge = $("#notificationCount");
  const list = $("#notificationsList");

  const unreadCount = notifications.filter(n => !n.read).length;
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? "grid" : "none";
  }

  if (list) {
    if (notifications.length === 0) {
      list.innerHTML = `<div style="padding:24px; text-align:center; color:var(--text-light);">No notifications at this time.</div>`;
    } else {
      list.innerHTML = notifications.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}">
          <span class="notif-icon">${n.icon || '🔔'}</span>
          <div class="notif-info">
            <strong>${escapeHTML(n.title)}</strong>
            <p>${escapeHTML(n.message)}</p>
            <span class="notif-time">${escapeHTML(n.time)}</span>
          </div>
        </div>
      `).join("");
    }
  }
}

function triggerSimulatedReminder(medicineId = null) {
  let med = null;
  if (medicineId) {
    med = medicines.find(m => m.id === medicineId);
  }
  if (!med) {
    med = medicines.find(m => m.status === "pending") || medicines[0];
  }
  if (!med) return;

  const modal = $("#reminderPopupModal");
  if (!modal) return;

  $("#reminderMedName").textContent = `${med.name} (${med.dosage})`;
  $("#reminderMedDetail").textContent = `${formatTime12(med.time)} · ${med.instruction || 'Take as prescribed'}`;

  // Hook button actions
  $("#reminderTakeNowBtn").onclick = () => {
    modal.close();
    markMedicineTaken(med.id);
  };

  $("#reminderSnoozeBtn").onclick = () => {
    modal.close();
    toast(`Snoozed reminder for ${med.name} by 10 minutes.`, "⏰");
    logActivity(`Snoozed dose reminder for ${med.name}`, "normal", "⏰");
  };

  $("#reminderSkipBtn").onclick = () => {
    modal.close();
    openMissedModal(med.id);
  };

  playChime("alert");
  modal.showModal();

  if (aiVoiceEnabled) {
    speakText(`Reminder: Time to take your ${med.name}, ${med.dosage}.`);
  }
}

// ============================================================================
// 10. AI HEALTHCARE ASSISTANT INTERFACE
// ============================================================================

const AI_KNOWLEDGE_BASE = [
  {
    keywords: ["interaction", "interactions", "together", "conflict", "mix", "drug"],
    response: "Let's review Ravi's current medications: **Amlodipine (5mg)**, **Metformin (500mg)**, **Vitamin D3 (1000 IU)**, and **Atorvastatin (10mg)**.\n\n• **Amlodipine & Atorvastatin**: Very safe and commonly prescribed together for cardiac health.\n• **Metformin & Vitamin D3**: Excellent combination. Long-term Metformin can sometimes deplete Vitamin B12, so routine blood checks are recommended.\n• **Grapefruit Caution**: Avoid large amounts of grapefruit juice while taking Amlodipine and Atorvastatin, as it can raise medication absorption unexpectedly.\n• **Painkillers Notice**: Avoid taking over-the-counter NSAIDs like Ibuprofen without consulting Dr. Meera, as they can interfere with blood pressure control."
  },
  {
    keywords: ["miss", "missed", "forgot", "late", "skip"],
    response: "If you realize you missed a scheduled medicine:\n\n1. **Within 2-3 hours**: Take the missed dose as soon as you remember.\n2. **Close to the next scheduled dose**: Skip the missed dose completely and continue your normal schedule.\n3. **Crucial Rule**: **Never take a double dose** to make up for a missed pill, as this can cause your blood pressure or blood sugar to drop too low.\n\nUse the 'Mark as Missed' button on your schedule so your care team and Dr. Meera can keep track."
  },
  {
    keywords: ["food", "meal", "breakfast", "lunch", "empty", "stomach", "eat", "milk"],
    response: "Here are the optimal food guidelines for Ravi's routine:\n\n• **Amlodipine (Morning)**: Can be taken with or after breakfast with a full glass of water.\n• **Vitamin D3 (Morning)**: Best absorbed when taken with dietary fats (like breakfast milk, eggs, or yogurt).\n• **Metformin (Afternoon)**: Always take **with lunch** or immediately after your first few bites. This significantly prevents common stomach upset or nausea.\n• **Atorvastatin (Bedtime)**: Can be taken with or without food at bedtime."
  },
  {
    keywords: ["hydrate", "water", "fluid", "hydration", "drink"],
    response: "Hydration is essential for seniors, especially when managing blood pressure and kidneys:\n\n• Aim for **6 to 8 glasses (approx. 1.5 to 2 liters)** of clean water daily unless Dr. Meera has specified a fluid restriction.\n• Spread water intake throughout the daytime rather than drinking large amounts right before sleep to prevent night-time awakenings.\n• Electrolyte balance: If you experience dizziness upon standing, sit down slowly and inform Sunita or Anita."
  },
  {
    keywords: ["doctor", "meera", "visit", "questions", "appointment", "clinic", "ask"],
    response: "Here is a personalized checklist to prepare for your upcoming visit with **Dr. Meera Sharma**:\n\n1. Show your 7-day Blood Pressure log (currently averaging 122/80 mmHg).\n2. Request a refill prescription for **Atorvastatin (10mg)** since the supply is down to 4 pills.\n3. Ask about routine HbA1c testing for your Metformin regimen.\n4. Mention any mild side effects, such as ankle swelling or morning fatigue.\n\nYou can click **'Print Doctor Summary'** in the Adherence tab to bring a printed sheet directly to your appointment!"
  },
  {
    keywords: ["pill", "identify", "color", "shape", "round", "white", "scored"],
    response: "Pill Identification Guide for your active medicines:\n\n• **Amlodipine 5mg**: Typically a small round, white tablet, often with a score mark across the middle.\n• **Metformin 500mg**: Larger white round or oblong tablet, stamped with dosage numbers.\n• **Vitamin D3 1000 IU**: Small translucent yellow/amber softgel capsule.\n• **Atorvastatin 10mg**: Small oval or round white film-coated tablet.\n\n*Always inspect your pharmacy packaging label or verify with your pharmacist before taking an unrecognized pill.*"
  },
  {
    keywords: ["emergency", "chest pain", "breath", "dizzy", "sos", "call"],
    response: "⚠️ **URGENT HEALTH ALERT**:\nIf Ravi or anyone experiences sudden chest tightness, shortness of breath, sudden facial drooping, speech difficulty, or severe weakness:\n\n1. **Press the red SOS HELP button** at the top right of this screen.\n2. **Call 108 / 911** or contact Anita immediately.\n3. Keep the patient seated upright and comfortable. Do not give food or drink while waiting for paramedics."
  }
];

let chatHistory = [
  {
    sender: "assistant",
    text: "Hello Ravi! I am your CareConnect Health Companion. I can help explain your medicines, check food rules, review potential drug interactions, or help prepare questions for Dr. Meera. How can I assist you today?",
    time: "8:00 AM"
  }
];

function renderChat() {
  const container = $("#chatMessages");
  if (!container) return;

  container.innerHTML = chatHistory.map((msg, idx) => {
    const isBot = msg.sender === "assistant";
    return `
      <div class="chat-bubble ${isBot ? 'assistant-bubble' : 'user-bubble'}">
        <div class="bubble-text">${formatMarkdown(msg.text)}</div>
        <div class="bubble-meta">
          <span>${escapeHTML(msg.time)}</span>
          ${isBot ? `<button class="btn-speak-bubble" data-speak-msg="${idx}" title="Listen to this reply">🔊 Read</button>` : ''}
        </div>
      </div>
    `;
  }).join("");

  container.scrollTop = container.scrollHeight;

  // Speak bubble handler
  $$("[data-speak-msg]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.speakMsg);
      const m = chatHistory[idx];
      if (m) speakText(m.text.replace(/[*_#]/g, ''));
    });
  });
}

function formatMarkdown(text) {
  let s = escapeHTML(text);
  // Bold **text**
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Bullet lists
  s = s.replace(/\n• (.*?)/g, '<br>• $1');
  // Newlines
  s = s.replace(/\n\n/g, '<br><br>');
  s = s.replace(/\n/g, '<br>');
  return s;
}

function handleUserMessage(queryText) {
  const text = (queryText || $("#userChatMessage")?.value || "").trim();
  if (!text) return;

  if ($("#userChatMessage")) $("#userChatMessage").value = "";

  const now = new Date();
  const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  // Add User Message
  chatHistory.push({
    sender: "user",
    text,
    time: timeStr
  });
  renderChat();

  // Find match or generate compassionate response
  const lower = text.toLowerCase();
  let matchedResponse = null;

  for (const item of AI_KNOWLEDGE_BASE) {
    if (item.keywords.some(k => lower.includes(k))) {
      matchedResponse = item.response;
      break;
    }
  }

  if (!matchedResponse) {
    if (lower.includes("hello") || lower.includes("hi")) {
      matchedResponse = "Hello Ravi! You are doing wonderful with your morning routine today. Do you have any questions about your medicines, lunch schedule, or doctor visit?";
    } else {
      matchedResponse = `Thank you for asking. Regarding "${text}":\n\nFor Ravi's care routine, it is always best to maintain regular timings and take medicines with sufficient water. Always consult Dr. Meera Sharma if you experience any unusual symptoms or need dosage modifications.\n\nWould you like me to check drug interactions or prepare a note for your caregiver?`;
    }
  }

  // Simulate brief thinking delay for realistic feeling
  setTimeout(() => {
    chatHistory.push({
      sender: "assistant",
      text: matchedResponse,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    });
    renderChat();

    if (aiVoiceEnabled) {
      speakText(matchedResponse.replace(/[*_#•]/g, ''));
    }
  }, 400);
}

// Voice Speech-to-Text Recognition using Web Speech API
function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    toast("Speech recognition is not supported in this browser. Please type your question.", "🔇");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const micBtn = $("#voiceInputMicBtn");
  if (micBtn) micBtn.classList.add("recording");
  toast("Listening... Speak your question clearly.", "🎙️");

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if ($("#userChatMessage")) $("#userChatMessage").value = transcript;
    toast(`Heard: "${transcript}"`, "🎙️");
    handleUserMessage(transcript);
  };

  recognition.onerror = () => {
    if (micBtn) micBtn.classList.remove("recording");
    toast("Could not recognize voice. Please try again.", "⚠️");
  };

  recognition.onend = () => {
    if (micBtn) micBtn.classList.remove("recording");
  };

  recognition.start();
}

// ============================================================================
// 11. NAVIGATION & TABS
// ============================================================================

function switchTab(tabId) {
  $$(".nav-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
  });

  $$(".page-view").forEach(page => {
    page.classList.toggle("active", page.id === tabId);
  });

  // Render content specific to the tab
  if (tabId === "schedule") renderSchedule();
  else if (tabId === "medicines") renderMedicineCabinet();
  else if (tabId === "appointments") renderAppointments();
  else if (tabId === "adherence") renderAdherenceAnalytics();
  else if (tabId === "careteam") {
    renderActivityFeed();
    renderCareJournal();
  } else if (tabId === "assistant") renderChat();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================================
// 12. INITIALIZATION & GLOBAL EVENT BINDING
// ============================================================================

function init() {
  // Update Real-Time Clock
  const updateClock = () => {
    const now = new Date();
    const timeFormatted = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) +
      " · " + now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    if ($("#liveTime")) $("#liveTime").textContent = timeFormatted;
  };
  updateClock();
  setInterval(updateClock, 30000);

  // Apply visual preferences
  applyAccessibilitySettings();

  // Accessibility Controls
  $("#fontStandardBtn")?.addEventListener("click", () => setFontSize("standard"));
  $("#fontLargeBtn")?.addEventListener("click", () => setFontSize("large"));
  $("#fontXLargeBtn")?.addEventListener("click", () => setFontSize("xlarge"));
  $("#contrastToggle")?.addEventListener("click", toggleHighContrast);

  $("#voiceNarrationBtn")?.addEventListener("click", () => {
    const medsList = medicines.map(m => `${m.name}, ${m.dosage} at ${formatTime12(m.time)}`).join(". ");
    speakText(`Good day Ravi. Here is your daily plan. You have ${medicines.length} scheduled medicines. ${medsList}. Have a safe day!`);
  });

  // Role Switcher
  $("#roleSeniorBtn")?.addEventListener("click", () => switchRole("senior"));
  $("#roleCaregiverBtn")?.addEventListener("click", () => switchRole("caregiver"));

  // Emergency SOS
  $("#sosHeaderBtn")?.addEventListener("click", triggerEmergencySos);
  $("#openSosModalBtn")?.addEventListener("click", () => $("#sosModal")?.showModal());
  $("#closeSosModalBtn")?.addEventListener("click", () => $("#sosModal")?.close());
  $("#broadcastSosAlertBtn")?.addEventListener("click", () => {
    toast("Broadcast notification sent to Anita Kumar & Sunita Rao!", "📢");
    logActivity("Emergency broadcast sent to family contacts", "alert", "📢");
    $("#sosModal")?.close();
  });

  // Call actions
  $$(".call-action-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const phone = btn.dataset.phone;
      if (phone) window.location.href = `tel:${phone}`;
    });
  });

  // Top alert banner close
  $("#alertBannerClose")?.addEventListener("click", () => {
    const b = $("#alertBanner");
    if (b) b.style.display = "none";
  });

  // Test Reminder Button
  $("#triggerReminderTestBtn")?.addEventListener("click", () => triggerSimulatedReminder());
  $("#triggerSampleDoseAlertBtn")?.addEventListener("click", () => triggerSimulatedReminder());

  // Notifications Bell & Modal
  $("#notificationsBtn")?.addEventListener("click", () => $("#notificationsModal")?.showModal());
  $("#closeNotifModalBtn")?.addEventListener("click", () => $("#notificationsModal")?.close());
  $("#markAllNotifsReadBtn")?.addEventListener("click", () => {
    notifications.forEach(n => n.read = true);
    saveState();
    renderNotifications();
    toast("All notifications marked as read.", "✓");
  });

  // Tab Navigation
  $$(".nav-tab").forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  $$("[data-goto]").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.goto));
  });

  // Date Navigator in Schedule
  $("#prevDayBtn")?.addEventListener("click", () => {
    const cur = new Date(currentSelectedDate + "T00:00:00");
    cur.setDate(cur.getDate() - 1);
    currentSelectedDate = cur.toISOString().slice(0, 10);
    renderSchedule();
  });

  $("#nextDayBtn")?.addEventListener("click", () => {
    const cur = new Date(currentSelectedDate + "T00:00:00");
    cur.setDate(cur.getDate() + 1);
    currentSelectedDate = cur.toISOString().slice(0, 10);
    renderSchedule();
  });

  $("#todayResetBtn")?.addEventListener("click", () => {
    currentSelectedDate = isoToday;
    renderSchedule();
    toast("Jumped to Today's schedule", "🗓️");
  });

  $("#speakScheduleBtn")?.addEventListener("click", () => {
    const medsToday = medicines.map(m => `${m.name}, ${m.dosage} at ${formatTime12(m.time)}. ${m.status === 'taken' ? 'Already taken.' : 'Pending.'}`).join(". ");
    speakText(`Here is your schedule for today: ${medsToday}`);
  });

  // Bulk Slot Take
  $("#bulkTakeMorningBtn")?.addEventListener("click", () => bulkTakeSlot("morning"));
  $("#bulkTakeAfternoonBtn")?.addEventListener("click", () => bulkTakeSlot("afternoon"));
  $("#bulkTakeEveningBtn")?.addEventListener("click", () => bulkTakeSlot("evening"));
  $("#bulkTakeNightBtn")?.addEventListener("click", () => bulkTakeSlot("night"));

  // Medication Modals & Forms
  $("#addNewMedBtn")?.addEventListener("click", () => openMedicineModal());
  $("#addMedicineScheduleBtn")?.addEventListener("click", () => openMedicineModal());
  $("#closeMedModalBtn")?.addEventListener("click", () => $("#medicineModal")?.close());
  $("#cancelMedBtn")?.addEventListener("click", () => $("#medicineModal")?.close());
  $("#medicineModalForm")?.addEventListener("submit", saveMedicineForm);

  // Search & Filters in Medicine Cabinet
  $("#medSearchInput")?.addEventListener("input", renderMedicineCabinet);
  $("#clearSearchBtn")?.addEventListener("click", () => {
    if ($("#medSearchInput")) {
      $("#medSearchInput").value = "";
      renderMedicineCabinet();
    }
  });

  $$(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      $$(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentMedFilter = chip.dataset.filter;
      renderMedicineCabinet();
    });
  });

  // Missed Modal
  $("#closeMissedModalBtn")?.addEventListener("click", () => $("#missedModal")?.close());
  $("#cancelMissedBtn")?.addEventListener("click", () => $("#missedModal")?.close());
  $("#confirmMissedBtn")?.addEventListener("click", confirmMedicineMissed);

  // Appointments Modals & Forms
  $("#addNewAppointmentBtn")?.addEventListener("click", () => openAppointmentModal());
  $("#closeAptModalBtn")?.addEventListener("click", () => $("#appointmentModal")?.close());
  $("#cancelAptBtn")?.addEventListener("click", () => $("#appointmentModal")?.close());
  $("#appointmentModalForm")?.addEventListener("submit", saveAppointmentForm);

  // Vitals Modals & Forms
  $("#logVitalsBtn")?.addEventListener("click", () => $("#vitalsModal")?.showModal());
  $("#logVitalsHeaderBtn")?.addEventListener("click", () => $("#vitalsModal")?.showModal());
  $("#closeVitalsModalBtn")?.addEventListener("click", () => $("#vitalsModal")?.close());
  $("#cancelVitalsBtn")?.addEventListener("click", () => $("#vitalsModal")?.close());
  $("#vitalsModalForm")?.addEventListener("submit", saveVitalsForm);

  // Print Report
  $("#exportReportBtn")?.addEventListener("click", printDoctorReport);

  // Caregiver Notes & Journal
  $("#addCareNoteBtn")?.addEventListener("click", () => $("#careNoteModal")?.showModal());
  $("#newJournalEntryBtn")?.addEventListener("click", () => $("#careNoteModal")?.showModal());
  $("#closeCareNoteModalBtn")?.addEventListener("click", () => $("#careNoteModal")?.close());
  $("#cancelCareNoteBtn")?.addEventListener("click", () => $("#careNoteModal")?.close());
  $("#careNoteModalForm")?.addEventListener("submit", saveCareNote);

  $("#clearLogBtn")?.addEventListener("click", () => {
    if (window.confirm("Clear activity history?")) {
      activityFeed = [];
      saveState();
      renderActivityFeed();
      toast("Activity feed cleared", "✓");
    }
  });

  $("#viewSeniorMedicalIdBtn")?.addEventListener("click", () => {
    $("#sosModal")?.showModal();
  });

  // AI Healthcare Assistant Events
  $("#sendChatBtn")?.addEventListener("click", () => handleUserMessage());
  $("#userChatMessage")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleUserMessage();
  });

  $("#voiceInputMicBtn")?.addEventListener("click", startVoiceRecognition);

  $$(".prompt-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.dataset.prompt;
      if (prompt) handleUserMessage(prompt);
    });
  });

  $("#toggleAiVoiceOutput")?.addEventListener("click", () => {
    aiVoiceEnabled = !aiVoiceEnabled;
    localStorage.setItem("cc_ai_voice", aiVoiceEnabled ? "true" : "false");
    $("#aiVoiceIcon").textContent = aiVoiceEnabled ? "🔊" : "🔇";
    $("#aiVoiceLabel").textContent = aiVoiceEnabled ? "Voice Out: ON" : "Voice Out: OFF";
    toast(aiVoiceEnabled ? "Voice read-out turned ON" : "Voice read-out turned OFF", "🔊");
  });

  $("#clearChatBtn")?.addEventListener("click", () => {
    chatHistory = [
      {
        sender: "assistant",
        text: "Chat cleared. How can I assist you with Ravi's medications or health today?",
        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      }
    ];
    renderChat();
  });

  // Pill Identifier tool button
  $("#identifyPillBtn")?.addEventListener("click", () => {
    const shape = $("#pillShapeSelect")?.value || "round";
    const color = $("#pillColorSelect")?.value || "white";
    let match = "We could not find an exact match in Ravi's current active medicines.";
    if (color === "white" && shape === "round") {
      match = "Matches **Amlodipine (5mg)**: Round white scored tablet. Take 1 tablet in the morning after breakfast.";
    } else if (color === "white" && shape === "oval") {
      match = "Matches **Metformin (500mg)**: White oblong/oval tablet. Take with lunch.";
    } else if (color === "yellow" || shape === "capsule") {
      match = "Matches **Vitamin D3 (1000 IU)**: Amber/yellow softgel capsule. Take with morning milk or food.";
    }
    handleUserMessage(`Identify pill: ${color} ${shape}`);
    setTimeout(() => {
      chatHistory.push({
        sender: "assistant",
        text: `🔍 **Pill Identifier Result:**\n${match}`,
        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      });
      renderChat();
    }, 500);
  });

  // Footer: Reset Demo Data
  $("#resetDemoDataBtn")?.addEventListener("click", () => {
    if (window.confirm("Reset prototype to fresh hackathon demo data?")) {
      medicines = JSON.parse(JSON.stringify(DEFAULT_MEDS));
      appointments = JSON.parse(JSON.stringify(DEFAULT_APPOINTMENTS));
      vitals = JSON.parse(JSON.stringify(DEFAULT_VITALS));
      careNotes = JSON.parse(JSON.stringify(DEFAULT_CARE_NOTES));
      activityFeed = JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES));
      notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
      saveState();
      renderSchedule();
      renderMedicineCabinet();
      renderAppointments();
      renderAdherenceAnalytics();
      renderNotifications();
      renderCareJournal();
      renderActivityFeed();
      toast("Prototype reset to clean demo data!", "↺");
    }
  });

  // Footer: Backup Data JSON
  $("#backupDataBtn")?.addEventListener("click", () => {
    const backupObj = { medicines, appointments, vitals, careNotes, activityFeed, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `careconnect-backup-${isoToday}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Backup JSON file exported!", "💾");
  });

  // Initial renders
  renderSchedule();
  renderMedicineCabinet();
  renderAppointments();
  renderAdherenceAnalytics();
  renderNotifications();
  renderActivityFeed();
  renderCareJournal();
  renderChat();
}

// Kick off when DOM is ready
document.addEventListener("DOMContentLoaded", init);
