/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * Reactive Global State Management Store - NASHIK GODAVARI FLOOD CASCADE
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class AppStateStore {
  constructor() {
    this.listeners = new Set();

    // Core Simulation & Incident State - Nashik Scenario
    this.state = {
      incident: {
        id: "INC-2026-NSK-GODAVARI-04",
        name: "Nashik Godavari River & Gangapur Dam Cascade",
        locationName: "Nashik Metropolitan Area, Maharashtra",
        type: "flood",
        intensity: 88,
        rainfallRate: 110, // mm/hr in Trimbak catchment
        durationHours: 8,
        riverSurgeLevel: 4.2, // meters above Dutondya Maruti baseline
        damSpillwayRate: 38500, // cusecs from Gangapur Dam
        powerGridIntegrity: 74, // %
        windSpeed: 38, // km/h
        status: "ACTIVE - CRITICAL (NMC/NDRF OPS)",
        timeElapsedMin: 42,
        simSpeed: 1,
        isRunning: true,
        audioAlerts: true,
        voiceAnnounce: true
      },

      // High Level Macro KPIs
      kpis: {
        overallRisk: 89, // %
        affectedPopulation: 168000,
        criticalZonesCount: 3,
        criticalInfraAtRisk: 7,
        hospitalsAtRiskCount: 3,
        availableResourcesCount: 22,
        totalResourcesCount: 30,
        activeAlertsCount: 16,
        threatLevel: "CRITICAL"
      },

      // Geographic Impact Zones (Nashik City & Godavari Basin)
      zones: [
        { 
          id: "ZONE_A", 
          name: "Zone A - Ramkund & Panchavati Riverbank", 
          risk: "CRITICAL", 
          riskScore: 94, 
          pop: 72000, 
          waterDepthCm: 90, 
          lat: 20.0063, 
          lng: 73.7928, 
          bounds: [[20.000, 73.785], [20.015, 73.805]] 
        },
        { 
          id: "ZONE_B", 
          name: "Zone B - Old Nashik & Someshwar Lowlands", 
          risk: "HIGH", 
          riskScore: 86, 
          pop: 54000, 
          waterDepthCm: 65, 
          lat: 19.9950, 
          lng: 73.7780, 
          bounds: [[19.988, 73.770], [20.005, 73.788]] 
        },
        { 
          id: "ZONE_C", 
          name: "Zone C - Satpur & Ambad MIDC Basin", 
          risk: "HIGH", 
          riskScore: 78, 
          pop: 32000, 
          waterDepthCm: 45, 
          lat: 19.9550, 
          lng: 73.7450, 
          bounds: [[19.940, 73.730], [19.970, 73.760]] 
        },
        { 
          id: "ZONE_D", 
          name: "Zone D - Indira Nagar & Pathardi Uplands", 
          risk: "LOW", 
          riskScore: 16, 
          pop: 95000, 
          waterDepthCm: 5, 
          lat: 19.9650, 
          lng: 73.7950, 
          bounds: [[19.950, 73.780], [19.980, 73.810]] 
        }
      ],

      // Road Network & Status (Nashik Corridors)
      roads: [
        { 
          id: "R12", 
          name: "Corridor R12 (Godavari Riverfront Road & Holkar Bridge)", 
          status: "FLOODED", 
          failureProb: 88, 
          waterDepthCm: 80, 
          normalTransitMin: 10, 
          currentTransitMin: 45, 
          coords: [[20.002, 73.785], [20.007, 73.793], [20.012, 73.801]], 
          emsCorridor: false 
        },
        { 
          id: "R15", 
          name: "Highway R15 (Gangapur-Trimbak Elevated Bypass)", 
          status: "OPEN", 
          failureProb: 14, 
          waterDepthCm: 0, 
          normalTransitMin: 15, 
          currentTransitMin: 19, 
          coords: [[19.985, 73.765], [20.000, 73.760], [20.020, 73.755]], 
          emsCorridor: true 
        },
        { 
          id: "R14", 
          name: "Arterial R14 (Mumbai Naka & Trimbak Road)", 
          status: "CONGESTED", 
          failureProb: 58, 
          waterDepthCm: 30, 
          normalTransitMin: 14, 
          currentTransitMin: 36, 
          coords: [[19.988, 73.782], [19.998, 73.788], [20.008, 73.792]], 
          emsCorridor: false 
        },
        { 
          id: "R18", 
          name: "Connector R18 (Nashik-Pune NH-60 Link)", 
          status: "OPEN", 
          failureProb: 20, 
          waterDepthCm: 10, 
          normalTransitMin: 12, 
          currentTransitMin: 15, 
          coords: [[19.965, 73.795], [19.975, 73.810], [19.985, 73.825]], 
          emsCorridor: false 
        }
      ],

      // Hospitals in Nashik
      hospitals: [
        { 
          id: "H1", 
          name: "Nashik District Civil Hospital", 
          lat: 19.9995, 
          lng: 73.7885, 
          capacityER: 140, 
          currentERLoad: 132, 
          capacityICU: 40, 
          currentICULoad: 38, 
          overloadProb: 91, 
          status: "CRITICAL SURGE", 
          backupPower: true 
        },
        { 
          id: "H2", 
          name: "Sahyadri Super Speciality Hospital (Mumbai Naka)", 
          lat: 19.9880, 
          lng: 73.7820, 
          capacityER: 95, 
          currentERLoad: 62, 
          capacityICU: 30, 
          currentICULoad: 19, 
          overloadProb: 44, 
          status: "MODERATE", 
          backupPower: true 
        },
        { 
          id: "H3", 
          name: "Apollo Hospitals (Wani House / Panchavati)", 
          lat: 20.0150, 
          lng: 73.8050, 
          capacityER: 160, 
          currentERLoad: 78, 
          capacityICU: 50, 
          currentICULoad: 22, 
          overloadProb: 24, 
          status: "NORMAL", 
          backupPower: true 
        },
        { 
          id: "H4", 
          name: "Panchavati Urban Healthcare Center", 
          lat: 20.0080, 
          lng: 73.7960, 
          capacityER: 50, 
          currentERLoad: 47, 
          capacityICU: 12, 
          currentICULoad: 11, 
          overloadProb: 84, 
          status: "HIGH SURGE", 
          backupPower: false 
        }
      ],

      // Shelters in Nashik
      shelters: [
        { 
          id: "S1", 
          name: "Shelter S1 (KTHM College Ground & Auditorium)", 
          lat: 20.0085, 
          lng: 73.7680, 
          capacity: 6000, 
          occupancy: 4120, 
          suppliesDays: 6, 
          medicalStaff: 15, 
          status: "OPEN" 
        },
        { 
          id: "S2", 
          name: "Shelter S2 (Mahatma Nagar Sports Complex)", 
          lat: 19.9850, 
          lng: 73.7620, 
          capacity: 3500, 
          occupancy: 2240, 
          suppliesDays: 5, 
          medicalStaff: 10, 
          status: "OPEN" 
        },
        { 
          id: "S3", 
          name: "Shelter S3 (Divyadaan Center, Panchavati)", 
          lat: 20.0190, 
          lng: 73.8120, 
          capacity: 1800, 
          occupancy: 640, 
          suppliesDays: 7, 
          medicalStaff: 6, 
          status: "OPEN" 
        }
      ],

      // Emergency Response Fleet (NDRF, SDRF, 108 Ambulances)
      fleet: [
        { id: "A1", type: "ambulance", name: "108 EMS Unit A1 (Nashik Civil)", status: "en_route", lat: 19.9960, lng: 73.7850, target: "District Civil Hospital", etaMin: 12, speedKmh: 35 },
        { id: "A2", type: "ambulance", name: "108 EMS Unit A2 (Panchavati)", status: "dispatched", lat: 20.0050, lng: 73.7920, target: "Ramkund Flood Rescue", etaMin: 6, speedKmh: 40 },
        { id: "A3", type: "ambulance", name: "108 EMS Unit A3 (Mumbai Naka)", status: "available", lat: 19.9880, lng: 73.7820, target: "Sahyadri Standby", etaMin: 0, speedKmh: 0 },
        { id: "A4", type: "ambulance", name: "108 EMS Unit A4 (Gangapur)", status: "busy", lat: 20.0070, lng: 73.7710, target: "KTHM Shelter Triage", etaMin: 4, speedKmh: 15 },
        { id: "B1", type: "boat", name: "NDRF Motor Rescue Boat B1", status: "active", lat: 20.0065, lng: 73.7930, target: "Godavari Ghat Evacuation", etaMin: 3, speedKmh: 18 },
        { id: "B2", type: "boat", name: "SDRF Flood Rescue Boat B2", status: "active", lat: 19.9980, lng: 73.7820, target: "Holkar Bridge Strand", etaMin: 8, speedKmh: 20 },
        { id: "F1", type: "fire", name: "NMC Fire & Rescue Engine F1", status: "deployed", lat: 19.9620, lng: 73.7510, target: "Satpur MSEDCL Substation", etaMin: 5, speedKmh: 28 }
      ],

      // Critical Infrastructure (Nashik)
      infrastructure: [
        { id: "E4", name: "Satpur MSEDCL 220kV Main Substation", type: "power", lat: 19.9620, lng: 73.7510, status: "AT RISK (68%)", operational: 78 },
        { id: "P1", name: "Gangapur Dam Spillway Sluice Controller", type: "water", lat: 20.0400, lng: 73.6800, status: "DISCHARGING 38,500 CUSECS", operational: 95 },
        { id: "B4", name: "Historic Holkar Bridge (Godavari River)", type: "bridge", lat: 20.0040, lng: 73.7890, status: "WATER OVERTOPPING (+4.2m)", operational: 35 },
        { id: "W2", name: "Nilwandi / Anandvalli Water Filtration Plant", type: "utility", lat: 20.0120, lng: 73.7650, status: "SECURE (PUMPS ACTIVE)", operational: 94 }
      ],

      // Cascading Impact Dependency Network (Nashik Hydrology Chain)
      cascadingNodes: [
        {
          id: "N1",
          name: "Trimbakeshwar Heavy Downpour (110mm/h)",
          level: "PRIMARY HAZARD",
          riskScore: 96,
          failureProb: 100,
          ttiMin: 0,
          confidence: "Very High (99%)",
          tier: 1,
          x: 120,
          y: 200,
          category: "meteorology",
          explanation: "Severe monsoon cloudburst over Western Ghats catchment draining directly into Gangapur Dam reservoir.",
          dependents: ["N2", "N3"]
        },
        {
          id: "N2",
          name: "Gangapur Dam Discharge (38.5k cusecs)",
          level: "SECONDARY IMPACT",
          riskScore: 92,
          failureProb: 95,
          ttiMin: 20,
          confidence: "High (94%)",
          tier: 2,
          x: 320,
          y: 120,
          category: "hydrology",
          explanation: "Reservoir level reached 98.4% full storage capacity; emergency spillway gates opened to prevent dam structural overtopping.",
          dependents: ["N4", "N9"]
        },
        {
          id: "N3",
          name: "Godavari River Surge (+4.2m Dutondya Maruti)",
          level: "SECONDARY IMPACT",
          riskScore: 90,
          failureProb: 92,
          ttiMin: 25,
          confidence: "High (91%)",
          tier: 2,
          x: 320,
          y: 280,
          category: "utility",
          explanation: "Godavari water level overtops Dutondya Maruti idol chest line by 4.2m, flooding Ramkund, Panchavati, and Saraf Bazar.",
          dependents: ["N4"]
        },
        {
          id: "N4",
          name: "Holkar Bridge & Godavari Road (R12) Submersion",
          level: "CRITICAL INFRASTRUCTURE",
          riskScore: 90,
          failureProb: 88,
          ttiMin: 35,
          confidence: "Very High (96%)",
          tier: 3,
          x: 540,
          y: 200,
          category: "transport",
          explanation: "Water depth on R12 reaches 80cm. Holkar Bridge closed by Nashik Police. Impassable for standard ambulances.",
          dependents: ["N5", "N6"]
        },
        {
          id: "N5",
          name: "Mumbai Naka & Trimbak Road Gridlock",
          level: "TERTIARY DISRUPTION",
          riskScore: 82,
          failureProb: 84,
          ttiMin: 45,
          confidence: "High (88%)",
          tier: 4,
          x: 740,
          y: 120,
          category: "transport",
          explanation: "Traffic diverted from flooded ghats causes massive vehicular congestion across Mumbai Naka junction.",
          dependents: ["N6"]
        },
        {
          id: "N6",
          name: "108 EMS Ambulance Transit Delay (+38m)",
          level: "TERTIARY DISRUPTION",
          riskScore: 88,
          failureProb: 85,
          ttiMin: 55,
          confidence: "High (92%)",
          tier: 4,
          x: 740,
          y: 280,
          category: "healthcare",
          explanation: "Emergency transit from Panchavati flood sectors to District Civil Hospital delayed from 10m to 48m.",
          dependents: ["N7"]
        },
        {
          id: "N7",
          name: "Nashik District Civil Hospital ER Saturation",
          level: "SYSTEMIC FAILURE",
          riskScore: 94,
          failureProb: 91,
          ttiMin: 75,
          confidence: "Very High (95%)",
          tier: 5,
          x: 940,
          y: 200,
          category: "healthcare",
          explanation: "ER trauma admissions hit 132/140 beds (94%); ICU at 95% capacity with incoming flood victim backlog.",
          dependents: ["N8"]
        },
        {
          id: "N8",
          name: "Nashik Regional Healthcare Degradation",
          level: "SYSTEMIC FAILURE",
          riskScore: 96,
          failureProb: 78,
          ttiMin: 120,
          confidence: "High (89%)",
          tier: 6,
          x: 1140,
          y: 200,
          category: "critical",
          explanation: "Critical threshold where trauma response delays result in preventable casualties across the Godavari belt.",
          dependents: []
        },
        {
          id: "N9",
          name: "Satpur MSEDCL Grid & Pumping Stress",
          level: "CRITICAL INFRASTRUCTURE",
          riskScore: 78,
          failureProb: 72,
          ttiMin: 50,
          confidence: "Moderate (80%)",
          tier: 3,
          x: 540,
          y: 60,
          category: "bridge",
          explanation: "Drainage runoff in Ambad/Satpur industrial corridor threatening MSEDCL feeder substation.",
          dependents: ["N5"]
        }
      ],

      // Multi-Agent Activity & Thought Feed (Nashik Focus)
      agents: {
        hazard: {
          name: "Hazard Agent",
          role: "IMD Doppler Radar, Gangapur Dam & Godavari Hydrology",
          icon: "cloud-rain",
          status: "ACTIVE",
          color: "#06b6d4",
          answer: "What is happening in Nashik?",
          latestFinding: "Gangapur Dam discharging 38,500 cusecs. Godavari River stage +4.2m above Dutondya Maruti. Ramkund inundated.",
          confidence: 97,
          thoughts: [
            { time: "10:35", step: "Catchment Analysis", detail: "IMD Doppler radar shows continuous cloudburst over Trimbakeshwar hills (110 mm/hr)." },
            { time: "10:38", step: "Dam Hydrology", detail: "Gangapur reservoir at 98.4% storage; irrigation department increased discharge to 38,500 cusecs." },
            { time: "10:42", step: "Ghat Water Level", detail: "Godavari water submerged Dutondya Maruti waist level. Upgraded alert to RED WARNING." }
          ]
        },
        infrastructure: {
          name: "Infrastructure Agent",
          role: "Holkar Bridge, Road Network & MSEDCL Substation Modeling",
          icon: "building-2",
          status: "ACTIVE",
          color: "#f59e0b",
          answer: "What infrastructure is at risk in Nashik?",
          latestFinding: "Holkar Bridge submerged & closed. Godavari Riverfront Road R12 under 80cm water. Satpur Substation at 68% risk.",
          confidence: 93,
          thoughts: [
            { time: "10:36", step: "Bridge Inspection", detail: "Holkar Bridge water clearance breached; structural foundation under heavy hydraulic pressure." },
            { time: "10:39", step: "Road R12 Failure", detail: "Panchavati-Ramkund riverfront corridor completely impassable for standard traffic." },
            { time: "10:43", step: "Power Substation", detail: "Positioned NMC Fire Engine F1 to erect sandbag barriers at Satpur MSEDCL 220kV yard." }
          ]
        },
        healthcare: {
          name: "Healthcare Agent",
          role: "Nashik Civil Hospital, Sahyadri & 108 EMS Fleet Modeling",
          icon: "cross",
          status: "ACTIVE",
          color: "#ec4899",
          answer: "How will healthcare response be affected in Nashik?",
          latestFinding: "Nashik District Civil Hospital ER at 94% capacity. EMS transit delayed +38 min via normal routes.",
          confidence: 94,
          thoughts: [
            { time: "10:37", step: "Civil Hospital Surge", detail: "District Civil Hospital ER bed occupancy at 132/140 beds. ICU at 38/40." },
            { time: "10:40", step: "Ambulance Routing", detail: "108 ambulances isolated from Ramkund sector due to Holkar Bridge closure." },
            { time: "10:44", step: "Triage Diversion", detail: "Directing non-critical trauma to Sahyadri Super Speciality and Apollo Hospital." }
          ]
        },
        evacuation: {
          name: "Evacuation Agent",
          role: "Godavari Ghat Evacuation & Shelter S1 (KTHM) / S2 (Mahatma Nagar)",
          icon: "navigation",
          status: "ACTIVE",
          color: "#10b981",
          answer: "Where should Nashik residents go?",
          latestFinding: "Diverted Ramkund/Panchavati evacuees to KTHM College Ground & Mahatma Nagar Complex via Gangapur Bypass.",
          confidence: 95,
          thoughts: [
            { time: "10:38", step: "Population Extraction", detail: "22,000 residents in direct Ramkund floodway requiring emergency evacuation." },
            { time: "10:41", step: "Corridor Selection", detail: "Routing traffic exclusively through elevated Gangapur-Trimbak Highway R15." },
            { time: "10:44", step: "Shelter Allocation", detail: "Assigned 4,120 evacuees to KTHM College Ground and 2,240 to Mahatma Nagar Complex." }
          ]
        },
        resource: {
          name: "Resource Allocation Agent",
          role: "NDRF, SDRF Boats, NMC Fire & 108 Fleet Deployment",
          icon: "truck",
          status: "ACTIVE",
          color: "#8b5cf6",
          answer: "Where should limited resources be deployed in Nashik?",
          latestFinding: "NDRF Boat B1 deployed to Ramkund Ghat; SDRF Boat B2 positioned at Holkar Bridge; 108 Ambulances on standby.",
          confidence: 91,
          thoughts: [
            { time: "10:39", step: "NDRF Fleet Status", detail: "2 NDRF motor rescue boats operational; 1 NMC flood rescue team on site." },
            { time: "10:42", step: "Optimization Solve", detail: "Assigned Boat B1 to extract 14 stranded pilgrims near Godavari Ghat." },
            { time: "10:45", step: "Hospital Support", detail: "Stationed 108 EMS Units A1 & A3 on Highway R15 emergency corridor." }
          ]
        },
        coordinator: {
          name: "Coordinator Agent",
          role: "Central NMC / EOC Synthesis & Action Planning",
          icon: "shield-alert",
          status: "ACTIVE",
          color: "#ef4444",
          answer: "What should responders in Nashik do first?",
          latestFinding: "Priority 1: Reserve Godavari R12 for NDRF/EMS boats & activate KTHM Shelter S1. Divert trauma to Sahyadri.",
          confidence: 96,
          thoughts: [
            { time: "10:40", step: "Conflict Resolution", detail: "Balanced civilian evacuation with high-priority trauma transport conduits." },
            { time: "10:43", step: "Intervention Impact", detail: "Emergency Corridor on R12 scores 84/100 (73% risk reduction, 46k protected)." },
            { time: "10:46", step: "Directives Issued", detail: "Issued 4 prioritized tactical orders to Nashik Police, NMC, and NDRF." }
          ]
        }
      },

      // Intervention Decision Matrix (Nashik Focus)
      interventions: [
        {
          id: "INT-01",
          title: "Reserve Godavari Corridor R12 for Emergency & NDRF Rescue",
          badge: "RECOMMENDED 🥇",
          isRecommended: true,
          score: 84,
          riskReductionPct: 73,
          peopleProtected: 46000,
          responseTimeImprovementMin: 30,
          resourceCost: "LOW (Nashik Traffic Police + NDRF)",
          negativeEffects: "Minor civilian detour (+8 min via Gangapur Bypass)",
          aiRationale: "Preserves vital trauma access to District Civil Hospital while clearing stranded vehicles along Godavari ghats. Maximum casualty reduction.",
          status: "READY",
          executed: false
        },
        {
          id: "INT-02",
          title: "Total Barricade & Closure of All Godavari River Bridges",
          badge: "OPTION B",
          isRecommended: false,
          score: 55,
          riskReductionPct: 42,
          peopleProtected: 19000,
          responseTimeImprovementMin: -15,
          resourceCost: "LOW (NMC Barricades)",
          negativeEffects: "Severe EMS delay (+45 min to District Civil Hospital)",
          aiRationale: "Prevents civilian bridge crossing accidents but starves Civil Hospital of incoming trauma patients, precipitating hospital failure.",
          status: "READY",
          executed: false
        },
        {
          id: "INT-03",
          title: "Deploy Rapid Mobile Sandbag Berms at Satpur MSEDCL Yard",
          badge: "OPTION C",
          isRecommended: false,
          score: 76,
          riskReductionPct: 64,
          peopleProtected: 34000,
          responseTimeImprovementMin: 15,
          resourceCost: "HIGH (NMC Fire & MSEDCL Engineering Crew)",
          negativeEffects: "Requires 40 minutes for full deployment",
          aiRationale: "Safeguards power supply to hospital ventilator grids and municipal water pumps in Anandvalli.",
          status: "READY",
          executed: false
        },
        {
          id: "INT-04",
          title: "Pre-Emptive Patient Transfer from Civil Hospital to Sahyadri & Apollo",
          badge: "OPTION D",
          isRecommended: false,
          score: 81,
          riskReductionPct: 70,
          peopleProtected: 38000,
          responseTimeImprovementMin: 18,
          resourceCost: "MEDIUM (Private Hospital Coordination)",
          negativeEffects: "Transfers require specialized ventilator ambulances",
          aiRationale: "Relieves Civil Hospital ICU before reaching 100% saturation. Highly synergistic with Intervention #1.",
          status: "READY",
          executed: false
        }
      ],

      // Citizen Person Guardian State (Nashik Citizen Perspective)
      guardian: {
        userLocation: { name: "Zone A - Ramkund Ghat, Panchavati, Nashik", lat: 20.0063, lng: 73.7928 },
        dangerLevel: "CRITICAL DANGER",
        dangerColor: "#ef4444",
        dangerReason: "You are inside the Godavari River Inundation Zone (Water rising +15cm/hr from Gangapur Dam discharge)",
        avoidRoads: ["Holkar Bridge Road R12", "Ramkund Ghat Lowline Underpass"],
        recommendedShelter: { id: "S1", name: "Shelter S1 (KTHM College Ground)", distKm: 1.6, walkTimeMin: 20 },
        nearestHospital: { id: "H2", name: "Sahyadri Super Speciality Hospital", distKm: 3.2 },
        routeSteps: [
          { text: "Head North-West on Panchavati Karanja towards Gangapur Road", icon: "arrow-up", isAlert: false },
          { text: "WARNING: Do NOT approach Holkar Bridge. Water depth is 80cm.", icon: "alert-triangle", isAlert: true },
          { text: "Turn Left onto Gangapur-Trimbak Highway R15 Safe Elevated Corridor", icon: "corner-up-right", isAlert: false },
          { text: "Proceed 900m to Safe Haven Shelter S1 (KTHM College Auditorium Entrance)", icon: "check-circle", isAlert: false }
        ],
        sosActive: false,
        sosDispatched: false,
        checklist: [
          { text: "Aadhaar Card, emergency medical prescriptions & waterproof pouch", done: true },
          { text: "Flashlight & smartphone fully charged", done: true },
          { text: "2L bottled drinking water & dry biscuits / ORS packets", done: false },
          { text: "Emergency whistle & high-visibility cloth", done: false }
        ]
      },

      // Targeted Alerts Center (Nashik Stakeholders)
      alerts: [
        {
          id: "ALT-NSK-01",
          channel: "CITIZEN",
          severity: "CRITICAL",
          time: "10:44 AM",
          location: "Ramkund, Panchavati & Saraf Bazar, Nashik",
          title: "URGENT GODAVARI FLOOD EVACUATION ORDER",
          reason: "Gangapur Dam discharge increased to 38,500 cusecs. Godavari River stage +4.2m.",
          action: "Evacuate immediately to KTHM College Ground (Shelter S1) via Gangapur Road. Avoid Holkar Bridge.",
          affectedPop: 72000
        },
        {
          id: "ALT-NSK-02",
          channel: "AMBULANCE",
          severity: "CRITICAL",
          time: "10:42 AM",
          location: "Holkar Bridge & Godavari Riverfront",
          title: "108 EMS TACTICAL REROUTE DIRECTIVE",
          reason: "Holkar Bridge closed by Nashik Police due to hydraulic overtopping.",
          action: "Divert all emergency transports through Gangapur-Trimbak Elevated Bypass R15.",
          affectedPop: 24
        },
        {
          id: "ALT-NSK-03",
          channel: "HOSPITAL",
          severity: "HIGH",
          time: "10:39 AM",
          location: "Nashik District Civil Hospital",
          title: "CODE YELLOW TRAUMA SURGE ACTIVATION",
          reason: "ER bed capacity reached 94% with 45+ inbound flood casualties reported.",
          action: "Deploy auxiliary triage tents, call on-duty surgeons, divert stable cases to Sahyadri/Apollo.",
          affectedPop: 140
        },
        {
          id: "ALT-NSK-04",
          channel: "AUTHORITY",
          severity: "CRITICAL",
          time: "10:36 AM",
          location: "Satpur MSEDCL Substation & Anandvalli Plant",
          title: "POWER GRID & PUMP PROTECTION MANDATE",
          reason: "Stormwater inflow in Satpur MIDC basin approaching transformer yard.",
          action: "Position NMC Fire Engine F1 with high-discharge dewatering pumps at Substation E4.",
          affectedPop: 168000
        }
      ],

      // Historical Incident Timeline Log (Nashik)
      timeline: [
        { time: "09:45 AM", title: "Heavy Downpour in Trimbak Hills", detail: "IMD registers 110mm/hr cloudburst in Gangapur Dam catchment area.", type: "start" },
        { time: "10:05 AM", title: "Gangapur Dam Spillway Opened", detail: "Irrigation Dept initiates 38,500 cusecs emergency water discharge.", type: "warn" },
        { time: "10:18 AM", title: "Godavari River Reaches Danger Mark", detail: "Dutondya Maruti chest line breached (+4.2m). Ramkund Ghat flooded.", type: "crit" },
        { time: "10:28 AM", title: "Holkar Bridge Inundation & Closure", detail: "Infrastructure Agent flags 88% failure risk. Nashik Police shuts bridge.", type: "crit" },
        { time: "10:36 AM", title: "108 Ambulances Rerouted", detail: "Evacuation Agent reroutes fleet via Gangapur-Trimbak Bypass R15.", type: "info" },
        { time: "10:42 AM", title: "District Civil Hospital Surge", detail: "ER bed load hits 94%; Coordinator Agent prepares trauma diversion.", type: "crit" },
        { time: "10:46 AM", title: "Response Plan Authorized", detail: "Priority 1 Intervention (R12 Emergency Corridor) executed.", type: "success" }
      ]
    };
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error("State listener error:", err);
      }
    }
  }

  updateState(updater) {
    if (typeof updater === "function") {
      updater(this.state);
    } else {
      Object.assign(this.state, updater);
    }
    this.notify();
  }

  setRainfall(mmPerHour) {
    this.updateState(s => {
      s.incident.rainfallRate = mmPerHour;
    });
  }

  toggleSimulation() {
    this.updateState(s => {
      s.incident.isRunning = !s.incident.isRunning;
    });
  }

  setSimSpeed(speed) {
    this.updateState(s => {
      s.incident.simSpeed = speed;
    });
  }

  executeIntervention(intId) {
    this.updateState(s => {
      const target = s.interventions.find(i => i.id === intId);
      if (target) {
        target.executed = true;
        target.status = "EXECUTED / ACTIVE IN NASHIK";
        
        s.kpis.overallRisk = Math.max(25, s.kpis.overallRisk - target.riskReductionPct * 0.5);
        s.kpis.affectedPopulation = Math.max(10000, s.kpis.affectedPopulation - target.peopleProtected);
        
        if (intId === "INT-01") {
          const r12 = s.roads.find(r => r.id === "R12");
          if (r12) {
            r12.status = "EMERGENCY_CORRIDOR_ACTIVE";
            r12.currentTransitMin = 14;
            r12.emsCorridor = true;
          }
          const h1 = s.hospitals.find(h => h.id === "H1");
          if (h1) {
            h1.overloadProb = 46;
            h1.status = "SURGE CONTROLLED";
          }
        }

        s.timeline.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Intervention Executed: ${target.title}`,
          detail: `Risk reduced by ${target.riskReductionPct}%. Response time improved by ${target.responseTimeImprovementMin} min in Nashik.`,
          type: "success"
        });
      }
    });
  }

  setCitizenPreset(presetKey) {
    this.updateState(s => {
      if (presetKey === "zone_a") {
        s.guardian.userLocation = { name: "Zone A - Ramkund Ghat, Panchavati, Nashik", lat: 20.0063, lng: 73.7928 };
        s.guardian.dangerLevel = "CRITICAL DANGER";
        s.guardian.dangerColor = "#ef4444";
        s.guardian.dangerReason = "You are inside the Godavari Floodplain (Water depth 90cm, Gangapur discharge 38.5k cusecs)";
      } else if (presetKey === "zone_b") {
        s.guardian.userLocation = { name: "Zone B - Old Nashik & Someshwar", lat: 19.9950, lng: 73.7780 };
        s.guardian.dangerLevel = "HIGH RISK";
        s.guardian.dangerColor = "#f97316";
        s.guardian.dangerReason = "Godavari water overtopping riverbank; Holkar Bridge closed";
      } else {
        s.guardian.userLocation = { name: "Zone D - Indira Nagar Uplands, Nashik", lat: 19.9650, lng: 73.7950 };
        s.guardian.dangerLevel = "SAFE ZONE";
        s.guardian.dangerColor = "#10b981";
        s.guardian.dangerReason = "High elevation area in South Nashik. No flood risk detected.";
      }
    });
  }

  triggerSOS() {
    this.updateState(s => {
      s.guardian.sosActive = true;
      s.guardian.sosDispatched = true;
      s.timeline.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: "SOS Beacon Activated by Citizen in Nashik",
        detail: `NDRF Rescue Boat B1 dispatched to ${s.guardian.userLocation.name}. Estimated arrival: 5 mins.`,
        type: "crit"
      });
      s.alerts.unshift({
        id: `ALT-SOS-${Date.now().toString().slice(-4)}`,
        channel: "CITIZEN",
        severity: "CRITICAL",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: s.guardian.userLocation.name,
        title: "EMERGENCY SOS RESCUE DISPATCHED (NASHIK)",
        reason: "Distress beacon received at Godavari riverbank.",
        action: "Stay on upper temple floor or elevated platform. NDRF Rescue Boat B1 en route.",
        affectedPop: 1
      });
    });
  }
}

window.appState = new AppStateStore();
