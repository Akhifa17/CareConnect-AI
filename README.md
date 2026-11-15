# CareConnect AI — Elderly Care & Medication Management Platform

CareConnect AI is an elderly-friendly, comprehensive, and responsive web platform designed to simplify daily medication routines, track health adherence, coordinate family caregivers, and provide intelligent AI-guided health assistance.

Built for the **AI Hackathon**, CareConnect AI focuses on accessibility, intuitive elderly design (large touch targets, high contrast, readable typography, and voice narration), and real-time family coordination.

---

## 🚀 Quick Start (Zero Build Required)

1. Open the project folder `careconnect_ai`.
2. Double-click **`index.html`** to open directly in any modern browser (Chrome, Edge, Safari, Firefox).
3. Alternatively, serve locally:
   ```bash
   python -m http.server 8080
   ```
   and navigate to `http://localhost:8080`.

> **Prototype Persistence**: All data is automatically persisted using browser `localStorage` (`cc_meds`, `cc_appointments`, `cc_vitals`, `cc_care_notes`, `cc_activity_log`, `cc_notifications`). It is pre-seeded with realistic senior care data for **Ravi Kumar** (74 years old).

---

## 🌟 Key Features Implemented

### 1. Elderly-Friendly Accessible Dashboard
- **Dynamic Font Scaling**: One-click font scaling controls (`A`, `A+`, `A++`) across the entire user interface for seniors with low vision.
- **High Contrast Mode**: Accessible contrast toggle (`🌓 High Contrast`) optimizing readability for cataract and low-vision conditions.
- **Voice Narration (Read Aloud)**: Integrates browser Text-to-Speech (`window.speechSynthesis`) to read today's entire medicine routine aloud.
- **Large Touch Targets**: All interactive elements and action buttons exceed 48px × 48px with clear iconography and explicit text labels.
- **Role Switcher**: Seamlessly toggle between **Senior Easy View** (simplified actions, large buttons) and **Caregiver / Family Portal** (full audit logs, vitals, analytics).

### 2. Medication Management (Full CRUD & Inventory Tracking)
- **Add Medicine**: Full modal form capturing Name, Dosage/Strength, Form (Tablet, Capsule, Syrup, Drops, Inhaler, Injection), Scheduled Time, Routine Slot (Morning, Afternoon, Evening, Night), Taking Instructions, Stock Inventory, Prescribing Doctor, and Warnings.
- **Edit Medicine**: Pre-filled modal to update dosages, times, or refill supplies.
- **Delete Medicine**: With safety confirmation to prevent accidental loss.
- **Pill Inventory & Low Refill Warnings**: Tracks remaining pills in real-time; automatically prompts a warning banner when a medication drops below 5 pills remaining.
- **Search & Filter**: Search by name or instruction, and filter by routine slot or low stock.

### 3. Mark Medicines as Taken or Missed (with Undo & History)
- **"✓ I TOOK THIS" (Mark Taken)**:
  - Big prominent green button.
  - Decrements pill stock inventory.
  - Automatically logs timestamp and adds an event to the Caregiver Activity Feed.
  - Synthesizes a pleasant audio chime (via Web Audio API) and voice positive reinforcement.
- **"✕ Missed" Button**:
  - Opens friendly reason modal ("Forgot / Away", "Felt nauseous", "Ran out / Needs refill", "Doctor advised skip").
  - Logs alert to family/caregiver feed.
- **Undo Option**: Allows resetting any dose status back to pending if clicked by mistake.

### 4. Daily Medication Schedule
- **Routine Time Blocks**: Grouped clearly by elderly daily routines:
  - 🌅 **Morning** (6:00 AM – 11:59 AM)
  - ☀️ **Afternoon** (12:00 PM – 4:59 PM)
  - 🌆 **Evening** (5:00 PM – 8:59 PM)
  - 🌙 **Night / Bedtime** (9:00 PM onwards)
- **Interactive Date Navigator**: Browse Yesterday, Today, Tomorrow, or jump back to Today.
- **Bulk Slot Action**: "✓ Take All Morning" allows seniors taking morning clusters to record all doses in a single click.
- **Daily Progress Bar**: Live visual meter showing completion percentage (e.g. "2 of 4 medicines taken (50%)") and current streak counter.

### 5. Doctor Appointment Management
- **Schedule Appointments**: Doctor name, specialty (Cardiology, Ophthalmology, etc.), visit type (In-person, Video call, Hospital), date, time, location, and preparation notes (e.g., fasting requirements, test reports).
- **Upcoming & Past Consultations**: Sorted chronologically with countdown badges ("TODAY", "In 2 days").
- **Add to Calendar (.ics Download)**: Client-side generation of standard iCalendar (`.ics`) files that can be imported directly into Google Calendar, Outlook, or Apple Calendar.
- **Edit & Cancel**: Update or cancel visits with immediate sync to the dashboard.

### 6. Family Member & Caregiver Dashboard
- **Care Team Roster**: Overview of Care Recipient (Ravi Kumar), Family Guardian (Anita Kumar - Daughter), Certified Caregiver (Sunita Rao), and Primary Cardiologist (Dr. Meera Sharma) with direct phone links.
- **Live Care Activity Feed**: Real-time audit log of all taken doses, missed alerts, vitals recordings, and doctor visit updates.
- **Caregiver Shift Journal**: Dedicated logging tool for daily caregiver notes, observations, meals, and mood.
- **Emergency SOS & Senior Medical ID**:
  - Prominent SOS button in header and family portal.
  - Instant one-tap calling shortcuts for Ambulance (108/911), Family, Caregiver, and Clinic.
  - First-responder Medical ID displaying blood type (O+), key allergies (Penicillin), and current conditions.
  - One-click "Send Emergency Alert to Family" simulation.

### 7. Medication Adherence Tracking & Vitals
- **7-Day Compliance Score**: Visual circular gauge displaying overall weekly adherence (e.g., 94% - Excellent Consistency).
- **7-Day History Bar Chart**: Color-coded daily completion bars (Green = 100%, Yellow = Partial, Red = Missed).
- **Senior Health Vitals Tracker**:
  - Log and track Blood Pressure (Systolic/Diastolic), Blood Glucose (mg/dL), Heart Rate (BPM), and Weight.
  - Normal vs. warning indicator tags.
  - Historical readings table.
- **Printable Doctor Summary**: Generates a clean, formatted clinical report ready for printing (`window.print()`) during medical visits.

### 8. Reminder Notifications System
- **Topbar Notification Bell**: Unread badge count and notification drawer.
- **Simulated Medication Reminder Popup**:
  - Triggered with "⏰ Test Reminder".
  - Features gentle ringing chime animation and audio alert.
  - One-click actions: "✅ I Took This Now", "⏰ Snooze (10 mins)", or "✕ Skip / Missed".
- **Automatic Reminder Check**: Background interval monitors schedule times and updates alert notifications.

### 9. AI Healthcare Assistant ("CareConnect Health Companion")
- **Voice Recognition (Speech-to-Text)**: Seniors can speak their questions using the microphone button (`webkitSpeechRecognition`).
- **Voice Read-Out (Text-to-Speech)**: Automatically speaks replies or provides per-message read buttons.
- **Quick Senior Prompt Chips**:
  - 💊 Check Drug Interactions
  - ⏰ What if I miss a dose?
  - 🍽️ Metformin & meal rules
  - 🔍 Pill Identifier Guide
  - 🩺 Questions for Dr. Meera
  - 💧 Water intake & hydration advice
- **Smart Healthcare Knowledge Engine**:
  - Checks interactions between active medications (Amlodipine, Metformin, Atorvastatin, Vitamin D3, NSAIDs, etc.).
  - Food rules (taking with food, avoiding grapefruit, breakfast milk).
  - Missed dose guidance (avoiding dangerous double-doses).
  - Pill shape and color identification helper.
  - Prominent safety disclaimer with emergency escalation.

---

## 🛠️ Technology Stack

- **Frontend**: Pure Semantic HTML5, Modular CSS3 (Custom Properties & Flexbox/Grid), Vanilla JavaScript (ES6+).
- **Audio & Speech**: Web Audio API (synthesizer), Web Speech API (`SpeechSynthesis` & `webkitSpeechRecognition`).
- **Persistence**: Browser `localStorage` (offline-first prototype).
- **No Dependencies**: Runs directly in the browser with 0 npm installs or external build tools.

---

## ⚙️ Testing & Resetting Demo Data

- To reset the platform back to fresh hackathon demo data at any time, click **"↺ Reset Demo Data"** in the footer.
- To export your current data as a JSON file, click **"💾 Backup Data"** in the footer.

---

## 🔒 Prototype Safety Notice

This application is a front-end prototype created for a hackathon demonstration. It simulates real-time family notifications and AI health assistance using client-side logic and localStorage. Do not enter confidential real-world patient records without production backend authentication, role-based access controls, and HIPAA/GDPR compliant storage.
