# AI Cascading Disaster Response System — Nashik Operations

> **"Predict the cascade. Prioritize the response. Protect every person."**

An AI-powered emergency command and decision-support platform engineered to detect disasters, model complex multi-tier cascading impacts, deploy multi-agent reasoning, score and recommend field interventions, guide citizens through dynamic safe corridors, and provide real-time digital-twin simulations with explainable AI.

---

## 📍 Scenario Context: Nashik Godavari River & Gangapur Dam Flood Cascade

- **Location**: Nashik Metropolitan Area, Maharashtra, India
- **Primary Hazard**: Convective cloudburst over Trimbakeshwar / Western Ghats catchment (110 mm/hr)
- **Secondary Impact**: Gangapur Dam discharging 38,500+ cusecs into the Godavari River; River level cresting +4.2m at the iconic Dutondya Maruti idol.
- **Critical Inundation Sectors**:
  - **Zone A**: Ramkund, Panchavati & Saraf Bazar (90cm standing water)
  - **Zone B**: Old Nashik & Someshwar Lowlands (65cm standing water)
  - **Zone C**: Satpur & Ambad MIDC Industrial Basin (45cm standing water)
  - **Zone D**: Indira Nagar & Pathardi Uplands (Safe Sector)
- **Key Infrastructure Chokepoints**:
  - **Holkar Bridge (Godavari Road R12)**: 88% failure probability, hydraulic overtopping, closed by Nashik Police.
  - **Mumbai Naka & Trimbak Road (R14)**: Traffic volume +280%, delaying emergency medical transit.
  - **Satpur MSEDCL 220kV Main Substation (E4)**: Stormwater back-pressure threatening hospital power feeders.
- **Healthcare Response**:
  - **Nashik District Civil Hospital (H1)**: ER bed load at 94% (132/140 beds), ICU at 38/40 beds.
  - **Sahyadri Super Speciality (Mumbai Naka)** & **Apollo Hospitals (Panchavati)**: Pre-emptive trauma diversion centers.
- **Evacuation Shelters**:
  - **Shelter S1**: KTHM College Ground & Auditorium (Capacity: 6,000 evacuees)
  - **Shelter S2**: Mahatma Nagar Sports Complex (Capacity: 3,500 evacuees)
  - **Shelter S3**: Divyadaan Center, Panchavati (Capacity: 1,800 evacuees)
- **Emergency Deployment**:
  - NDRF Motor Rescue Boat Units (5th Battalion) stationed at Godavari Ghats.
  - 108 EMS Ambulances & NMC Fire & Rescue Squads.

---

## 🌟 Key Highlights & Core Innovation

1. **Cascading Impact Graph Engine (`/cascade`)**: Visualizes the multi-tier dependency chain:
   $$\text{Trimbak Downpour (110mm/h)} \to \text{Gangapur Dam (38.5k cusecs)} \to \text{Godavari River (+4.2m)} \to \text{Holkar Bridge Closed} \to \text{Mumbai Naka Gridlock} \to \text{108 EMS Delay} \to \text{District Civil Hospital Overload} \to \text{Regional Collapse}$$
2. **Multi-Agent AI System (`/agents`)**: 6 autonomous agents (*Hazard, Infrastructure, Healthcare, Evacuation, Resource, Coordinator*) monitoring real-time telemetry from IMD radar, Gangapur Dam sluice gates, and Nashik Police dispatch.
3. **Intervention Impact Scoring Matrix (`/interventions`)**: Ranks response strategies, recommending **Priority 1 🥇**: *Reserve Godavari Corridor R12 for Emergency & NDRF Rescue* (Score: 84/100, 73% Risk Reduction, 46,000 People Protected, +30 min saved).
4. **GPS Person Disaster Guardian (`/guardian`)**: Provides citizen safety with live danger detection in Ramkund/Panchavati, dynamic turn-by-turn safe routing to KTHM College via Gangapur Road, and 1-tap SOS beacon.
5. **Interactive GIS Map (`/map`)**: Full-screen Leaflet GIS map with 7 toggleable layers centered on Nashik and the Godavari River.
6. **Disaster Simulation Workbench (`/simulation`)**: Dynamic simulation with rainfall sliders, river stage controls, and presets (*Trimbakeshwar Cloudburst, Gangapur Dam High Release, Normal Recovery*).
7. **Targeted Alert Center (`/alerts`)**: Multi-channel emergency broadcasts with Web Audio sirens and speech synthesis voice announcements.
8. **RAG Knowledge Base (`/knowledge`)**: Grounded standard operating procedures (Maharashtra SDMA, Nashik Municipal Corporation Flood Manual, NDRF 5th Battalion Pune, DHS Maharashtra).

---

## 🚀 How to Open and Run

### Method 1: Double-Click from Desktop
1. Open the folder `ai-disaster-response-system` on your Desktop.
2. Double-click `index.html` to open it in Chrome, Edge, or any browser.

### Method 2: Browser URL Bar
Paste this into your browser address bar:
```text
file:///C:/Users/SHREYA%20GOLE/Desktop/ai-disaster-response-system/index.html
```

---

## 🛡️ Technology Stack

- **Core**: HTML5, Vanilla JavaScript (ES6+ Modular Architecture), CSS3 Command Center Design System.
- **Mapping**: Leaflet.js GIS with dark-theme tiles, vector polygons, and animated fleet tracking.
- **Visualization**: Interactive SVG Cascading Graph Engine with dynamic link physics and node drilldown.
- **Audio & Accessibility**: Web Audio API synthesized alarms and Web Speech API voice synthesis.
- **Typography & Icons**: Google Fonts (*Space Grotesk*, *Inter*, *JetBrains Mono*), Lucide Icons.
