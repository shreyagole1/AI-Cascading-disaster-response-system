/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * Targeted Emergency Alert & Multi-Channel Broadcast Center
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class AlertCenter {
  constructor(stateStore) {
    this.store = stateStore;
    this.selectedChannel = "ALL";
  }

  init() {
    this.render();
    this.store.subscribe(() => this.render());
  }

  setChannel(channel) {
    this.selectedChannel = channel;
    this.render();
  }

  speakAlert(text) {
    if (window.audioService) {
      window.audioService.speak(text);
    }
  }

  broadcastCustomAlert() {
    const titleEl = document.getElementById('broadcast-title');
    const reasonEl = document.getElementById('broadcast-reason');
    const actionEl = document.getElementById('broadcast-action');
    const channelEl = document.getElementById('broadcast-channel');
    const severityEl = document.getElementById('broadcast-severity');

    if (!titleEl || !titleEl.value.trim()) return;

    const newAlert = {
      id: `ALT-MANUAL-${Date.now().toString().slice(-4)}`,
      channel: channelEl ? channelEl.value : "CITIZEN",
      severity: severityEl ? severityEl.value : "CRITICAL",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: "Metropolitan Delta Area",
      title: titleEl.value.trim(),
      reason: reasonEl ? reasonEl.value.trim() : "Emergency operations mandate.",
      action: actionEl ? actionEl.value.trim() : "Follow official safety guidance.",
      affectedPop: 45000
    };

    this.store.updateState(s => {
      s.alerts.unshift(newAlert);
      s.timeline.unshift({
        time: newAlert.time,
        title: `Broadcast Issued: ${newAlert.title}`,
        detail: `Sent to ${newAlert.channel} channel with ${newAlert.severity} severity.`,
        type: "warn"
      });
    });

    if (window.audioService) {
      window.audioService.playSirenTone();
      window.audioService.speak(newAlert.title + ". " + newAlert.action);
    }

    titleEl.value = "";
    if (reasonEl) reasonEl.value = "";
    if (actionEl) actionEl.value = "";
  }

  render() {
    const s = this.store.getState();
    const listEl = document.getElementById('alerts-feed-list');
    if (!listEl) return;

    const filtered = this.selectedChannel === "ALL" 
      ? s.alerts 
      : s.alerts.filter(a => a.channel === this.selectedChannel);

    let html = "";
    filtered.forEach(a => {
      const isCrit = a.severity === "CRITICAL";
      const isHigh = a.severity === "HIGH";
      const badgeClass = isCrit ? "badge-crit" : isHigh ? "badge-high" : "badge-mod";

      html += `
        <div class="cmd-card ${isCrit ? 'glowing-crit' : ''}" style="margin-bottom: 14px; border-left: 4px solid ${isCrit ? '#ef4444' : isHigh ? '#f97316' : '#f59e0b'};">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge ${badgeClass}">${a.severity}</span>
              <span class="badge badge-blue">CHANNEL: ${a.channel}</span>
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${a.location}</span>
            </div>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${a.time}</span>
          </div>

          <h3 style="font-size: 15px; font-weight: 800; font-family: var(--font-display); color: #fff; margin-bottom: 6px;">
            ${a.title}
          </h3>

          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">
            <b>Cause / Trigger:</b> ${a.reason}
          </div>

          <div style="font-size: 12px; color: var(--text-primary); background: rgba(0, 0, 0, 0.25); padding: 8px 12px; border-radius: 4px; margin-bottom: 10px;">
            <b>Mandated Directive:</b> ${a.action}
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--text-muted);">
            <span>Target Population: <b>${a.affectedPop.toLocaleString()}</b></span>
            <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="window.alertCenter.speakAlert('${a.title}. ${a.action}')">
              🔊 Voice Announcement
            </button>
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;
  }
}

window.alertCenter = new AlertCenter(window.appState);
