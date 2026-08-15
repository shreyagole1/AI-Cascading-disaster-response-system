/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * Mathematical Simulation Engine & Hydrology Cascade - NASHIK, MAHARASHTRA
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class SimulationEngine {
  constructor(stateStore) {
    this.store = stateStore;
    this.timerId = null;
    this.tickIntervalMs = 1500;
    this.tickCount = 0;
  }

  init() {
    this.start();
  }

  start() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => this.tick(), this.tickIntervalMs);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  setSpeed(speedMultiplier) {
    const baseMs = 1500;
    this.tickIntervalMs = Math.max(200, Math.floor(baseMs / speedMultiplier));
    this.store.setSimSpeed(speedMultiplier);
    this.start();
  }

  tick() {
    const s = this.store.getState();
    if (!s.incident.isRunning) return;

    this.tickCount++;

    this.store.updateState(state => {
      // 1. Progress time
      state.incident.timeElapsedMin += 1;

      // 2. Hydrology & Inundation Propagation (Nashik Godavari)
      const rainfall = state.incident.rainfallRate;
      const executedIntervention = state.interventions.find(i => i.id === "INT-01" && i.executed);
      const barrierExecuted = state.interventions.find(i => i.id === "INT-03" && i.executed);

      // Gangapur Dam discharge dynamic calculation
      state.incident.damSpillwayRate = Math.min(55000, Math.max(5000, Math.round(state.incident.damSpillwayRate + (rainfall > 80 ? 400 : -200))));

      // Godavari River surge level calculation at Dutondya Maruti
      const surgeDelta = (rainfall - 40) * 0.006 * (barrierExecuted ? 0.45 : 1.0);
      state.incident.riverSurgeLevel = Math.min(6.8, Math.max(0.8, state.incident.riverSurgeLevel + surgeDelta));

      // Zone A (Ramkund & Panchavati) water depths
      const zoneA = state.zones.find(z => z.id === "ZONE_A");
      if (zoneA) {
        zoneA.waterDepthCm = Math.min(140, Math.max(10, Math.round(zoneA.waterDepthCm + (rainfall > 60 ? 0.9 : -0.4))));
        zoneA.riskScore = Math.min(100, Math.round(zoneA.waterDepthCm * 0.9 + (rainfall * 0.15)));
        zoneA.risk = zoneA.riskScore > 80 ? "CRITICAL" : zoneA.riskScore > 50 ? "HIGH" : "MODERATE";
      }

      // Holkar Bridge & Godavari Road R12 Submersion
      const road12 = state.roads.find(r => r.id === "R12");
      if (road12) {
        if (!executedIntervention) {
          road12.waterDepthCm = Math.min(120, Math.max(10, Math.round(road12.waterDepthCm + (rainfall > 70 ? 1.3 : -0.3))));
          road12.failureProb = Math.min(99, Math.round(100 / (1 + Math.exp(-0.06 * (road12.waterDepthCm - 35)))));
          road12.currentTransitMin = Math.round(10 * (1 + (road12.failureProb / 18)));
          road12.status = road12.failureProb > 75 ? "FLOODED" : road12.failureProb > 40 ? "CONGESTED" : "OPEN";
        } else {
          road12.failureProb = 35;
          road12.currentTransitMin = 14;
          road12.status = "EMERGENCY_CORRIDOR_ACTIVE";
        }
      }

      // 3. Nashik District Civil Hospital Trauma Surge
      const hospital1 = state.hospitals.find(h => h.id === "H1");
      if (hospital1) {
        const detourFactor = road12 ? (road12.currentTransitMin / 10) : 1;
        const incomingPressure = Math.round((rainfall / 25) * detourFactor);

        if (!executedIntervention) {
          hospital1.currentERLoad = Math.min(hospital1.capacityER + 15, hospital1.currentERLoad + (incomingPressure > 3 ? 1 : 0));
          hospital1.overloadProb = Math.min(98, Math.round((hospital1.currentERLoad / hospital1.capacityER) * 92));
          hospital1.status = hospital1.overloadProb > 85 ? "CRITICAL SURGE" : hospital1.overloadProb > 60 ? "HIGH SURGE" : "MODERATE";
        } else {
          hospital1.currentERLoad = Math.max(75, hospital1.currentERLoad - 1);
          hospital1.overloadProb = Math.round((hospital1.currentERLoad / hospital1.capacityER) * 55);
          hospital1.status = hospital1.overloadProb > 70 ? "HIGH SURGE" : "SURGE CONTROLLED";
        }
      }

      // 4. Update Cascading Graph Node Probabilities
      state.cascadingNodes.forEach(node => {
        if (node.id === "N1") {
          node.riskScore = Math.min(100, Math.round(rainfall * 0.9));
        } else if (node.id === "N2") {
          node.riskScore = Math.min(100, Math.round((state.incident.damSpillwayRate / 45000) * 95));
          node.failureProb = Math.min(99, Math.round(node.riskScore * 0.98));
        } else if (node.id === "N3") {
          node.riskScore = Math.min(100, Math.round(state.incident.riverSurgeLevel * 22));
          node.failureProb = Math.min(99, Math.round(node.riskScore * 0.96));
        } else if (node.id === "N4") {
          node.riskScore = road12 ? road12.failureProb : 88;
          node.failureProb = road12 ? road12.failureProb : 88;
        } else if (node.id === "N6") {
          node.riskScore = executedIntervention ? 35 : Math.min(96, Math.round(road12.currentTransitMin * 2.0));
          node.failureProb = executedIntervention ? 28 : Math.min(94, Math.round(node.riskScore * 0.95));
        } else if (node.id === "N7") {
          node.riskScore = hospital1 ? hospital1.overloadProb : 91;
          node.failureProb = hospital1 ? hospital1.overloadProb : 91;
        }
      });

      // 5. Macro KPIs update
      if (!executedIntervention) {
        state.kpis.overallRisk = Math.min(96, Math.max(30, Math.round((rainfall * 0.38) + (road12 ? road12.failureProb * 0.36 : 30) + (hospital1 ? hospital1.overloadProb * 0.26 : 20))));
        state.kpis.threatLevel = state.kpis.overallRisk > 80 ? "CRITICAL" : state.kpis.overallRisk > 55 ? "HIGH" : "MODERATE";
      }

      // 6. NDRF Boats & 108 Fleet Patrol Movement
      state.fleet.forEach((vehicle, idx) => {
        if (vehicle.status === "en_route" || vehicle.status === "dispatched" || vehicle.status === "active") {
          const dLat = (Math.sin(this.tickCount * 0.4 + idx) * 0.0005);
          const dLng = (Math.cos(this.tickCount * 0.4 + idx) * 0.0005);
          vehicle.lat = Number((vehicle.lat + dLat).toFixed(4));
          vehicle.lng = Number((vehicle.lng + dLng).toFixed(4));
          if (vehicle.etaMin > 1) {
            vehicle.etaMin = Math.max(1, vehicle.etaMin - (this.tickCount % 4 === 0 ? 1 : 0));
          }
        }
      });

      // 7. Multi-Agent Periodic Live Thoughts Injection (Nashik)
      if (this.tickCount % 5 === 0) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        state.agents.hazard.thoughts.unshift({
          time: timeStr,
          step: "Godavari Hydrology",
          detail: `Gangapur discharge at ${state.incident.damSpillwayRate.toLocaleString()} cusecs. Godavari stage +${state.incident.riverSurgeLevel.toFixed(2)}m at Dutondya Maruti.`
        });
        if (state.agents.hazard.thoughts.length > 8) state.agents.hazard.thoughts.pop();

        state.agents.healthcare.thoughts.unshift({
          time: timeStr,
          step: "Nashik Civil ER Surge",
          detail: `Civil Hospital bed occupancy at ${hospital1.currentERLoad}/${hospital1.capacityER} (${hospital1.overloadProb}% overload risk).`
        });
        if (state.agents.healthcare.thoughts.length > 8) state.agents.healthcare.thoughts.pop();
      }
    });
  }

  loadScenario(scenarioKey) {
    this.store.updateState(state => {
      if (scenarioKey === "flash_flood") {
        state.incident.name = "Trimbakeshwar Cloudburst & Rapid Inundation";
        state.incident.rainfallRate = 135;
        state.incident.riverSurgeLevel = 4.8;
        state.incident.damSpillwayRate = 42000;
        state.kpis.overallRisk = 95;
        state.timeline.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: "Scenario Loaded: Trimbak Cloudburst (135 mm/hr)",
          detail: "Intense downpour in Western Ghats triggering rapid Godavari surge in Nashik.",
          type: "crit"
        });
      } else if (scenarioKey === "dam_release") {
        state.incident.name = "Gangapur Dam High Spillway Release";
        state.incident.rainfallRate = 85;
        state.incident.riverSurgeLevel = 5.4;
        state.incident.damSpillwayRate = 48500;
        state.kpis.overallRisk = 92;
        state.timeline.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: "Scenario Loaded: Gangapur Dam Release (48.5k cusecs)",
          detail: "Emergency sluice gates opened. Godavari riverfront completely submerged.",
          type: "warn"
        });
      } else if (scenarioKey === "normal_recovery") {
        state.incident.rainfallRate = 18;
        state.incident.riverSurgeLevel = 1.1;
        state.incident.damSpillwayRate = 4500;
        state.kpis.overallRisk = 30;
        state.timeline.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: "Scenario Reset: Normal Operating Conditions (Nashik)",
          detail: "Godavari water receded below danger mark. Holkar Bridge reopened.",
          type: "info"
        });
      }
    });
  }
}

window.simEngine = new SimulationEngine(window.appState);
