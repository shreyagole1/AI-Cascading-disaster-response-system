/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * GPS Person Disaster Guardian (Citizen Safety Portal)
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class PersonGuardian {
  constructor(stateStore) {
    this.store = stateStore;
  }

  init() {
    this.render();
    this.store.subscribe(() => this.render());
  }

  setPreset(presetKey) {
    this.store.setCitizenPreset(presetKey);
  }

  triggerSOS() {
    this.store.triggerSOS();
    if (window.audioService) {
      window.audioService.playSirenTone();
    }
  }

  toggleChecklist(index) {
    this.store.updateState(s => {
      s.guardian.checklist[index].done = !s.guardian.checklist[index].done;
    });
  }

  render() {
    const s = this.store.getState();
    const g = s.guardian;

    // 1. Render Citizen Danger Status Banner
    const bannerEl = document.getElementById('guardian-status-banner');
    if (bannerEl) {
      const isDanger = g.dangerLevel.includes("DANGER") || g.dangerLevel.includes("HIGH");
      bannerEl.className = `citizen-status-banner ${isDanger ? 'danger' : 'safe'}`;

      bannerEl.innerHTML = `
        <div class="citizen-header-row">
          <div class="gps-live-tag">
            <span class="pulse-dot ${isDanger ? 'crit' : 'online'}"></span>
            <span>GPS ACTIVE: ${g.userLocation.name}</span>
          </div>
          <span class="badge ${isDanger ? 'badge-crit' : 'badge-low'}">${g.dangerLevel}</span>
        </div>

        <div class="status-headline">
          ${isDanger ? '🔴 ' + g.dangerReason : '🟢 ' + g.dangerReason}
        </div>

        <div class="status-sub-guidance">
          ${isDanger 
            ? '⚠️ <b>IMMEDIATE ACTION REQUIRED</b>: Do NOT attempt to cross Corridor R12. Move immediately along Highway R15 Safe Corridor to <b>' + g.recommendedShelter.name + '</b>.' 
            : '✅ You are currently on elevated ground outside the flood evacuation zone. Stay tuned for emergency broadcast updates.'
          }
        </div>
      `;
    }

    // 2. Render Turn-by-Turn Safe Navigation
    const routeListEl = document.getElementById('guardian-route-steps');
    if (routeListEl) {
      let stepsHtml = "";
      g.routeSteps.forEach((step, idx) => {
        stepsHtml += `
          <div class="route-step ${step.isAlert ? 'alert-reroute' : ''}">
            <div style="font-weight: 800; font-family: var(--font-mono); color: ${step.isAlert ? '#ef4444' : 'var(--accent-blue)'};">
              0${idx + 1}
            </div>
            <div style="flex: 1; line-height: 1.4;">
              ${step.text}
            </div>
          </div>
        `;
      });
      routeListEl.innerHTML = stepsHtml;
    }

    // 3. Render SOS Button State
    const sosContainer = document.getElementById('guardian-sos-wrap');
    if (sosContainer) {
      if (g.sosActive) {
        sosContainer.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.25); border: 2px solid var(--risk-crit); border-radius: var(--radius-md); padding: 14px; text-align: center;">
            <div style="font-size: 14px; font-weight: 800; color: #ef4444; margin-bottom: 4px;">
              🚨 DISTRESS BEACON ACTIVE & TRANSMITTING
            </div>
            <div style="font-size: 12px; color: #fff;">
              Rescue Boat B1 dispatched to your coordinates (${g.userLocation.lat}, ${g.userLocation.lng}). ETA: 6 minutes.
            </div>
          </div>
        `;
      } else {
        sosContainer.innerHTML = `
          <button class="btn-sos-panic" onclick="window.personGuardian.triggerSOS()">
            🚨 1-TAP SOS RESCUE BEACON
          </button>
        `;
      }
    }

    // 4. Render Checklist Items
    const checkEl = document.getElementById('guardian-checklist-wrap');
    if (checkEl) {
      let checkHtml = "";
      g.checklist.forEach((item, i) => {
        checkHtml += `
          <label class="checklist-item" onclick="window.personGuardian.toggleChecklist(${i})">
            <input type="checkbox" ${item.done ? 'checked' : ''} />
            <span style="color: ${item.done ? 'var(--text-muted)' : 'var(--text-primary)'}; text-decoration: ${item.done ? 'line-through' : 'none'};">
              ${item.text}
            </span>
          </label>
        `;
      });
      checkEl.innerHTML = checkHtml;
    }
  }
}

window.personGuardian = new PersonGuardian(window.appState);
