/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * Master Application Bootstrap & View Controller - NASHIK GODAVARI CASCADE
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class AppController {
  constructor() {
    this.currentView = "dashboard";
  }

  init() {
    console.log("Initializing AI Cascading Disaster Response System for Nashik...");

    // 1. Initialize Subsystems
    if (window.simEngine) window.simEngine.init();
    if (window.mapController) window.mapController.init();
    if (window.cascadeGraph) window.cascadeGraph.init();
    if (window.agentCoordinator) window.agentCoordinator.init();
    if (window.interventionsMatrix) window.interventionsMatrix.init();
    if (window.personGuardian) window.personGuardian.init();
    if (window.resourceManager) window.resourceManager.init();
    if (window.alertCenter) window.alertCenter.init();
    if (window.knowledgeRAG) window.knowledgeRAG.init();

    // 2. Setup Navigation Listeners
    this.setupNavigation();

    // 3. Setup Simulation UI Controls
    this.setupSimulationControls();

    // 4. Initial Render of Dashboard & HUD
    this.renderDashboard();
    this.renderHUD();

    // 5. Subscribe to State Changes
    window.appState.subscribe(() => {
      this.renderDashboard();
      this.renderHUD();
      this.renderSimulationStatus();
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view');
        this.navigateTo(targetView);
      });
    });
  }

  navigateTo(viewId) {
    this.currentView = viewId;

    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewId) link.classList.add('active');
      else link.classList.remove('active');
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      if (sec.id === `view-${viewId}`) sec.classList.add('active');
      else sec.classList.remove('active');
    });

    if (viewId === "map" && window.mapController && window.mapController.mainMap) {
      setTimeout(() => {
        window.mapController.mainMap.invalidateSize();
      }, 100);
    } else if (viewId === "guardian" && window.mapController && window.mapController.guardianMap) {
      setTimeout(() => {
        window.mapController.guardianMap.invalidateSize();
      }, 100);
    } else if (viewId === "dashboard" && window.mapController && window.mapController.miniMap) {
      setTimeout(() => {
        window.mapController.miniMap.invalidateSize();
      }, 100);
    } else if (viewId === "cascade" && window.cascadeGraph) {
      setTimeout(() => {
        window.cascadeGraph.renderGraph();
      }, 50);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  setupSimulationControls() {
    const rainSlider = document.getElementById('sim-rainfall-slider');
    const rainVal = document.getElementById('sim-rainfall-val');
    if (rainSlider && rainVal) {
      rainSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        rainVal.textContent = `${val} mm/h`;
        window.appState.setRainfall(val);
      });
    }

    const simSpeedBtns = document.querySelectorAll('.sim-speed-btn');
    simSpeedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        simSpeedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const speed = parseInt(btn.getAttribute('data-speed'));
        if (window.simEngine) window.simEngine.setSpeed(speed);
      });
    });
  }

  renderHUD() {
    const s = window.appState.getState();
    const hudThreat = document.getElementById('hud-threat-level');
    const hudTime = document.getElementById('hud-time-elapsed');
    const hudStatus = document.getElementById('hud-incident-status');

    if (hudThreat) {
      hudThreat.textContent = s.kpis.threatLevel;
      hudThreat.className = `badge ${s.kpis.threatLevel === 'CRITICAL' ? 'badge-crit' : s.kpis.threatLevel === 'HIGH' ? 'badge-high' : 'badge-low'}`;
    }
    if (hudTime) {
      hudTime.textContent = `T+ ${s.incident.timeElapsedMin} MIN`;
    }
    if (hudStatus) {
      hudStatus.textContent = "NASHIK GODAVARI - CRITICAL";
    }
  }

  renderDashboard() {
    const s = window.appState.getState();

    const kpiRisk = document.getElementById('kpi-overall-risk');
    const kpiRiskFill = document.getElementById('kpi-risk-fill');
    const kpiPop = document.getElementById('kpi-affected-pop');
    const kpiZones = document.getElementById('kpi-crit-zones');
    const kpiInfra = document.getElementById('kpi-crit-infra');
    const kpiHosp = document.getElementById('kpi-crit-hosp');
    const kpiRes = document.getElementById('kpi-avail-resources');
    const kpiAlerts = document.getElementById('kpi-active-alerts');

    if (kpiRisk) kpiRisk.textContent = `${s.kpis.overallRisk}%`;
    if (kpiRiskFill) {
      kpiRiskFill.style.width = `${s.kpis.overallRisk}%`;
      kpiRiskFill.style.background = s.kpis.overallRisk > 75 ? 'var(--risk-crit)' : s.kpis.overallRisk > 50 ? 'var(--risk-high)' : 'var(--risk-low)';
    }
    if (kpiPop) kpiPop.textContent = s.kpis.affectedPopulation.toLocaleString();
    if (kpiZones) kpiZones.textContent = `${s.kpis.criticalZonesCount} / ${s.zones.length}`;
    if (kpiInfra) kpiInfra.textContent = `${s.kpis.criticalInfraAtRisk} Assets`;
    if (kpiHosp) kpiHosp.textContent = `${s.kpis.hospitalsAtRiskCount} / ${s.hospitals.length}`;
    if (kpiRes) kpiRes.textContent = `${s.kpis.availableResourcesCount} / ${s.kpis.totalResourcesCount}`;
    if (kpiAlerts) kpiAlerts.textContent = `${s.alerts.length}`;

    // Priority Actions (Nashik Focus)
    const priorityListEl = document.getElementById('dashboard-priority-actions');
    if (priorityListEl) {
      const rec = s.interventions.find(i => i.isRecommended);
      const isExecuted = rec ? rec.executed : false;

      priorityListEl.innerHTML = `
        <!-- Priority Action #1 (Recommended 🥇) -->
        <div class="action-item-card rank-1">
          <div>
            <div class="action-header">
              <span class="action-rank-badge action-rank-1">PRIORITY 1 🥇 RECOMMENDED</span>
              <span class="badge ${isExecuted ? 'badge-low' : 'badge-crit'}">
                ${isExecuted ? 'ACTIVE IN FIELD' : 'IMMEDIATE ACTION'}
              </span>
            </div>
            <div class="action-title">${rec ? rec.title : 'Reserve Godavari Corridor R12 for NDRF & Emergency Fleet'}</div>
            <p class="action-desc">${rec ? rec.aiRationale : 'Preserves hospital access to Nashik Civil and prevents EMS gridlock.'}</p>
          </div>

          <div class="action-meta-grid">
            <div class="meta-item"><span class="meta-label">Risk Reduction</span><span class="meta-val green">-${rec ? rec.riskReductionPct : 73}%</span></div>
            <div class="meta-item"><span class="meta-label">Protected</span><span class="meta-val cyan">${rec ? rec.peopleProtected.toLocaleString() : '46,000'}</span></div>
            <div class="meta-item"><span class="meta-label">Time Saved</span><span class="meta-val green">+${rec ? rec.responseTimeImprovementMin : 30}m</span></div>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:8px;">
            ${isExecuted 
              ? `<span style="font-size:12px; color:var(--risk-low); font-weight:700;">✓ Authorized by Nashik Command Center</span>` 
              : `<button class="btn-danger" style="font-size:12px; padding:6px 12px;" onclick="window.interventionsMatrix.execute('${rec.id}')">
                   Authorize Priority Action
                 </button>`
            }
          </div>
        </div>

        <!-- Priority Action #2 -->
        <div class="action-item-card rank-2">
          <div>
            <div class="action-header">
              <span class="action-rank-badge action-rank-2">PRIORITY 2</span>
              <span class="badge badge-high">URGENT</span>
            </div>
            <div class="action-title">Activate Shelter S1 (KTHM College Ground & Auditorium)</div>
            <p class="action-desc">Direct 4,100 Ramkund/Panchavati evacuees via Gangapur Road bypass before dam release reaches 45k cusecs.</p>
          </div>
          <div class="action-meta-grid">
            <div class="meta-item"><span class="meta-label">Capacity</span><span class="meta-val cyan">6,000</span></div>
            <div class="meta-item"><span class="meta-label">ETA Clearance</span><span class="meta-val green">40 min</span></div>
            <div class="meta-item"><span class="meta-label">Medical Staff</span><span class="meta-val cyan">15 Staff</span></div>
          </div>
        </div>

        <!-- Priority Action #3 -->
        <div class="action-item-card rank-3">
          <div>
            <div class="action-header">
              <span class="action-rank-badge action-rank-3">PRIORITY 3</span>
              <span class="badge badge-mod">MONITOR</span>
            </div>
            <div class="action-title">Stage High-Capacity Dewatering Pumps at Satpur MSEDCL Yard</div>
            <p class="action-desc">Protect power feeder supplying ventilator grids at District Civil Hospital and Sahyadri.</p>
          </div>
          <div class="action-meta-grid">
            <div class="meta-item"><span class="meta-label">Substation Risk</span><span class="meta-val red">68%</span></div>
            <div class="meta-item"><span class="meta-label">Grid Health</span><span class="meta-val yellow">${s.incident.powerGridIntegrity}%</span></div>
            <div class="meta-item"><span class="meta-label">Unit Assigned</span><span class="meta-val cyan">NMC Engine F1</span></div>
          </div>
        </div>
      `;
    }

    // Prediction Horizon Timeline (Nashik Chain)
    const horizonGrid = document.getElementById('dash-horizon-grid');
    if (horizonGrid) {
      const road12 = s.roads.find(r => r.id === "R12");
      const hosp1 = s.hospitals.find(h => h.id === "H1");
      const executed = s.interventions.find(i => i.id === "INT-01" && i.executed);

      horizonGrid.innerHTML = `
        <div class="horizon-node active-now">
          <div class="horizon-dot"></div>
          <div class="horizon-time">NOW (T+${s.incident.timeElapsedMin}m)</div>
          <div class="horizon-impact">Godavari river stage +4.2m. Gangapur discharge: ${s.incident.damSpillwayRate.toLocaleString()} cusecs.</div>
          <div class="horizon-prob badge-crit">Overall Risk: ${s.kpis.overallRisk}%</div>
        </div>

        <div class="horizon-node">
          <div class="horizon-dot" style="border-color: ${executed ? 'var(--risk-low)' : 'var(--risk-crit)'};"></div>
          <div class="horizon-time">+30 MIN</div>
          <div class="horizon-impact">Holkar Bridge & Godavari Road R12 failure probability: ${executed ? '35% (Controlled)' : `${road12 ? road12.failureProb : 88}%`}</div>
          <div class="horizon-prob ${executed ? 'badge-low' : 'badge-crit'}">Failure: ${executed ? '35%' : `${road12 ? road12.failureProb : 88}%`}</div>
        </div>

        <div class="horizon-node">
          <div class="horizon-dot" style="border-color: ${executed ? 'var(--risk-low)' : 'var(--risk-high)'};"></div>
          <div class="horizon-time">+1 HOUR</div>
          <div class="horizon-impact">108 EMS transit latency to District Civil Hospital.</div>
          <div class="horizon-prob ${executed ? 'badge-low' : 'badge-high'}">Delay: ${executed ? '+5 min' : '+38 min'}</div>
        </div>

        <div class="horizon-node">
          <div class="horizon-dot" style="border-color: ${executed ? 'var(--risk-low)' : 'var(--risk-crit)'};"></div>
          <div class="horizon-time">+2 HOURS</div>
          <div class="horizon-impact">District Civil Hospital ICU & ER trauma saturation.</div>
          <div class="horizon-prob ${executed ? 'badge-low' : 'badge-crit'}">Overload: ${executed ? '46%' : `${hosp1 ? hosp1.overloadProb : 91}%`}</div>
        </div>
      `;
    }

    // Multi-Agent Ticker
    const tickerEl = document.getElementById('dash-agent-ticker');
    if (tickerEl) {
      let tHtml = "";
      const allThoughts = [];
      Object.keys(s.agents).forEach(k => {
        const ag = s.agents[k];
        if (ag.thoughts && ag.thoughts.length > 0) {
          allThoughts.push({ agent: ag.name, key: k, thought: ag.thoughts[0] });
        }
      });

      allThoughts.forEach(item => {
        tHtml += `
          <div class="ticker-item ${item.key}">
            <div class="ticker-icon">✓</div>
            <div class="ticker-content">
              <div style="display:flex; justify-content:space-between;">
                <span class="ticker-agent">${item.agent}</span>
                <span class="ticker-time">${item.thought.time}</span>
              </div>
              <div class="ticker-text">${item.thought.detail}</div>
            </div>
          </div>
        `;
      });
      tickerEl.innerHTML = tHtml;
    }

    // Incident Timeline Log
    const timeLogEl = document.getElementById('dash-timeline-log');
    if (timeLogEl) {
      let lHtml = "";
      s.timeline.slice(0, 5).forEach(t => {
        const color = t.type === "crit" ? "#ef4444" : t.type === "warn" ? "#f59e0b" : t.type === "success" ? "#10b981" : "#3b82f6";
        lHtml += `
          <div style="display:flex; gap:10px; margin-bottom:8px; font-size:12px;">
            <span style="font-family:var(--font-mono); color:${color}; font-weight:700; min-width:65px;">${t.time}</span>
            <div style="flex:1;">
              <strong style="color:#fff;">${t.title}</strong>
              <div style="color:var(--text-secondary); font-size:11px;">${t.detail}</div>
            </div>
          </div>
        `;
      });
      timeLogEl.innerHTML = lHtml;
    }
  }

  renderSimulationStatus() {
    const s = window.appState.getState();
    const btnPlay = document.getElementById('btn-sim-play');
    if (btnPlay) {
      btnPlay.innerHTML = s.incident.isRunning ? '⏸ Pause' : '▶ Play';
      btnPlay.className = s.incident.isRunning ? 'btn-secondary' : 'btn-primary';
    }
  }
}

window.appController = new AppController();

window.addEventListener('DOMContentLoaded', () => {
  window.appController.init();
});
