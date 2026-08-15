/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * Emergency Resource Allocation & Optimization Engine
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class ResourceManager {
  constructor(stateStore) {
    this.store = stateStore;
  }

  init() {
    this.render();
    this.store.subscribe(() => this.render());
  }

  render() {
    const s = this.store.getState();
    const container = document.getElementById('resources-view-container');
    if (!container) return;

    // Ambulances & Fleet Summary
    let fleetHtml = "";
    s.fleet.forEach(v => {
      const isAmbulance = v.type === "ambulance";
      const icon = isAmbulance ? "🚑" : v.type === "boat" ? "🚤" : "🚒";
      const statusColor = v.status === "available" ? "#10b981" : v.status === "en_route" ? "#06b6d4" : "#f59e0b";

      fleetHtml += `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${icon}</span>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: #fff;">${v.name}</div>
              <div style="font-size: 11px; color: var(--text-secondary);">Mission: ${v.target} (ETA: ${v.etaMin}m)</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge" style="background: ${statusColor}22; color: ${statusColor}; border: 1px solid ${statusColor}55;">
              ${v.status.toUpperCase()}
            </span>
            <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="window.resourceManager.reallocate('${v.id}')">
              Reassign
            </button>
          </div>
        </div>
      `;
    });

    // Hospitals Capacity Bars
    let hospHtml = "";
    s.hospitals.forEach(h => {
      const erPct = Math.round((h.currentERLoad / h.capacityER) * 100);
      const icuPct = Math.round((h.currentICULoad / h.capacityICU) * 100);
      const isCritical = h.overloadProb > 75;

      hospHtml += `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-left: 4px solid ${isCritical ? '#ef4444' : '#10b981'}; border-radius: var(--radius-sm); padding: 12px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <strong style="font-size: 13px; color: #fff;">${h.name}</strong>
            <span class="badge ${isCritical ? 'badge-crit' : 'badge-low'}">${h.status} (${h.overloadProb}% Overload)</span>
          </div>

          <div style="margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-secondary); margin-bottom: 2px;">
              <span>ER Trauma Capacity</span>
              <span><b>${h.currentERLoad}</b> / ${h.capacityER} beds (${erPct}%)</span>
            </div>
            <div style="height: 6px; background: var(--bg-primary); border-radius: 3px; overflow: hidden;">
              <div style="height: 100%; width: ${Math.min(100, erPct)}%; background: ${erPct > 90 ? '#ef4444' : erPct > 70 ? '#f59e0b' : '#10b981'};"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-secondary); margin-bottom: 2px;">
              <span>ICU Ventilator Capacity</span>
              <span><b>${h.currentICULoad}</b> / ${h.capacityICU} beds (${icuPct}%)</span>
            </div>
            <div style="height: 6px; background: var(--bg-primary); border-radius: 3px; overflow: hidden;">
              <div style="height: 100%; width: ${Math.min(100, icuPct)}%; background: ${icuPct > 85 ? '#ef4444' : '#06b6d4'};"></div>
            </div>
          </div>
        </div>
      `;
    });

    // Shelters Capacity
    let shelterHtml = "";
    s.shelters.forEach(sh => {
      const occPct = Math.round((sh.occupancy / sh.capacity) * 100);

      shelterHtml += `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <strong style="font-size: 13px; color: #fff;">${sh.name}</strong>
            <span class="badge badge-low">${sh.status}</span>
          </div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">
            Occupancy: <b>${sh.occupancy.toLocaleString()}</b> / ${sh.capacity.toLocaleString()} (${occPct}%) | Remaining: <b>${(sh.capacity - sh.occupancy).toLocaleString()}</b>
          </div>
          <div style="height: 6px; background: var(--bg-primary); border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
            <div style="height: 100%; width: ${occPct}%; background: ${occPct > 85 ? '#f59e0b' : '#10b981'};"></div>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); display: flex; gap: 14px;">
            <span>🍞 Supplies: <b>${sh.suppliesDays} Days</b></span>
            <span>👨‍⚕️ Medical Staff: <b>${sh.medicalStaff}</b></span>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px;">
        <!-- Left: Fleet & Autonomous Dispatch -->
        <div class="cmd-card">
          <div class="card-header">
            <span class="card-title"><i class="lucide-truck"></i> Emergency Fleet Deployment</span>
            <span class="badge badge-blue">AI Dispatch Optimizer Active</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${fleetHtml}
          </div>
        </div>

        <!-- Right: Medical & Shelters -->
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <div class="cmd-card">
            <div class="card-header">
              <span class="card-title"><i class="lucide-cross"></i> Hospital Trauma & ICU Surge Forecast</span>
            </div>
            ${hospHtml}
          </div>

          <div class="cmd-card">
            <div class="card-header">
              <span class="card-title"><i class="lucide-home"></i> Evacuation Shelters Network</span>
            </div>
            ${shelterHtml}
          </div>
        </div>
      </div>
    `;
  }

  reallocate(vehicleId) {
    this.store.updateState(s => {
      const v = s.fleet.find(f => f.id === vehicleId);
      if (v) {
        v.status = "en_route";
        v.target = "Sector 4 Emergency Evacuation";
        v.etaMin = 7;
        s.timeline.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Fleet Reassigned: ${v.name}`,
          detail: `AI Optimizer redirected unit to high-priority sector. New ETA: 7 min.`,
          type: "info"
        });
      }
    });
  }
}

window.resourceManager = new ResourceManager(window.appState);
