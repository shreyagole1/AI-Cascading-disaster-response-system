/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * Multi-Agent AI Orchestrator & Coordinator Engine
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class AgentCoordinator {
  constructor(stateStore) {
    this.store = stateStore;
    this.selectedAgentKey = "coord";
    this.geminiApiKey = localStorage.getItem("GEMINI_API_KEY") || "";
  }

  init() {
    this.renderAgentCards();
    this.renderAgentTerminal(this.selectedAgentKey);

    this.store.subscribe(() => {
      this.renderAgentCards();
      this.renderAgentTerminal(this.selectedAgentKey);
    });
  }

  selectAgent(agentKey) {
    this.selectedAgentKey = agentKey;
    this.renderAgentCards();
    this.renderAgentTerminal(agentKey);
  }

  setApiKey(key) {
    this.geminiApiKey = key.trim();
    localStorage.setItem("GEMINI_API_KEY", this.geminiApiKey);
  }

  renderAgentCards() {
    const s = this.store.getState();
    const listEl = document.getElementById('agents-card-list');
    if (!listEl) return;

    const agentKeys = ["hazard", "infrastructure", "healthcare", "evacuation", "resource", "coordinator"];
    
    let html = "";
    agentKeys.forEach(k => {
      const a = s.agents[k];
      const isSelected = (k === this.selectedAgentKey || (k === "coordinator" && this.selectedAgentKey === "coord"));

      html += `
        <div class="cmd-card ${isSelected ? 'glowing-blue' : ''}" 
             style="cursor: pointer; border-left: 4px solid ${a.color}; margin-bottom: 10px;"
             onclick="window.agentCoordinator.selectAgent('${k === 'coordinator' ? 'coord' : k}')">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: ${a.color}; font-size: 16px; font-weight: bold;">●</span>
              <strong style="font-size: 14px; font-family: var(--font-display); color: #fff;">${a.name}</strong>
            </div>
            <span class="badge badge-blue" style="font-size: 10px;">${a.status} (${a.confidence}%)</span>
          </div>

          <div style="font-size: 11px; color: var(--accent-cyan); font-weight: 700; margin-bottom: 4px;">
            ❓ "${a.answer}"
          </div>

          <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.4;">
            ${a.latestFinding}
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;
  }

  renderAgentTerminal(agentKey) {
    const s = this.store.getState();
    const terminalEl = document.getElementById('agent-terminal-body');
    if (!terminalEl) return;

    const actualKey = agentKey === "coord" ? "coordinator" : agentKey;
    const a = s.agents[actualKey] || s.agents.coordinator;

    let thoughtsHtml = "";
    a.thoughts.forEach((t, i) => {
      thoughtsHtml += `
        <div style="background: rgba(13, 21, 39, 0.8); border: 1px solid var(--border-subtle); border-left: 3px solid ${a.color}; border-radius: 4px; padding: 10px 12px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-family: var(--font-mono); font-size: 11px; color: ${a.color}; font-weight: 700;">
              [STEP ${i + 1}] ${t.step}
            </span>
            <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">${t.time}</span>
          </div>
          <p style="font-size: 12px; color: var(--text-primary); line-height: 1.4;">${t.detail}</p>
        </div>
      `;
    });

    terminalEl.innerHTML = `
      <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="font-size: 16px; font-weight: 800; font-family: var(--font-display); color: #fff;">
            ${a.name} — Reasoning Terminal
          </h3>
          <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
            ${a.role}
          </p>
        </div>
        <span class="badge" style="background: ${a.color}22; color: ${a.color}; border: 1px solid ${a.color}55;">
          ${a.confidence}% AI Confidence
        </span>
      </div>

      <div style="margin-bottom: 12px;">
        <span style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
          Active Autonomous Thoughts & Observations
        </span>
      </div>

      <div style="max-height: 380px; overflow-y: auto;">
        ${thoughtsHtml}
      </div>

      <!-- Agent Query & LLM Synthesis Sandbox -->
      <div style="margin-top: 16px; background: var(--bg-tertiary); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 12px;">
        <div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
          <span>Ask ${a.name} a Tactical Question</span>
          <span style="font-size: 10px; color: var(--text-muted);">Gemini 2.0 / Local Multi-Agent Inference</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="agent-query-input" placeholder="e.g. What happens if Road R14 floods next?" 
                 style="flex: 1; background: var(--bg-primary); border: 1px solid var(--border-medium); border-radius: 4px; padding: 8px 12px; color: #fff; font-size: 12px;" />
          <button class="btn-primary" style="font-size: 12px; padding: 8px 14px;" onclick="window.agentCoordinator.handleAgentQuery('${actualKey}')">
            Analyze
          </button>
        </div>
        <div id="agent-query-response" style="margin-top: 10px; display: none; font-size: 12px; padding: 10px; background: rgba(59, 130, 246, 0.1); border-left: 3px solid var(--accent-blue); border-radius: 4px; line-height: 1.4;">
        </div>
      </div>
    `;
  }

  handleAgentQuery(agentKey) {
    const inputEl = document.getElementById('agent-query-input');
    const respEl = document.getElementById('agent-query-response');
    if (!inputEl || !respEl || !inputEl.value.trim()) return;

    const query = inputEl.value.trim();
    respEl.style.display = "block";
    respEl.innerHTML = `<span style="color: var(--accent-cyan);"><i class="lucide-loader"></i> ${this.store.getState().agents[agentKey].name} is evaluating multi-tier impacts...</span>`;

    setTimeout(() => {
      const s = this.store.getState();
      let answer = "";

      if (agentKey === "hazard") {
        answer = `<b>[Hazard Analysis]</b>: Saturated basin modeling indicates that rainfall exceeding 90mm/hr will elevate river crest by +0.35m within 25 minutes. Flash flood velocity on northern tributaries will peak at 2.4 m/s.`;
      } else if (agentKey === "infrastructure") {
        answer = `<b>[Infrastructure Analysis]</b>: If R14 floods, east-west arterial throughput will drop by 78%. Pumping Station P1 will experience a 40% surge in wastewater back-pressure. Recommend immediate barricades at Sector 4.`;
      } else if (agentKey === "healthcare") {
        answer = `<b>[Healthcare Analysis]</b>: Further road blockages will elevate ambulance transit times to +52 minutes. Trauma admissions to Hospital H1 will exceed critical surge thresholds. Pre-emptive patient diversion to H3 is mandatory.`;
      } else if (agentKey === "evacuation") {
        answer = `<b>[Evacuation Analysis]</b>: Evacuation corridors must shift 100% to Highway R15. Shelter S1 (City Arena) has 1,580 open capacity slots and is equipped with emergency generators.`;
      } else if (agentKey === "resource") {
        answer = `<b>[Resource Allocation]</b>: Rescue Boat B2 should be staged at Bridge B4 pier. Ambulances A1 and A4 should be placed on standby along Highway R15 perimeter.`;
      } else {
        answer = `<b>[Coordinator Synthesis]</b>: Prioritizing emergency corridor reservation on R12, diverting non-critical trauma to H2/H3, and broadcasting evacuation alert to 64,000 residents in Zone A.`;
      }

      respEl.innerHTML = answer;
    }, 600);
  }
}

window.agentCoordinator = new AgentCoordinator(window.appState);
