/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * Intervention Impact Scoring & Decision Matrix Engine
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class InterventionMatrix {
  constructor(stateStore) {
    this.store = stateStore;
  }

  init() {
    this.render();
    this.store.subscribe(() => this.render());
  }

  render() {
    const s = this.store.getState();
    const container = document.getElementById('interventions-grid-container');
    if (!container) return;

    let html = "";

    s.interventions.forEach(item => {
      const isRec = item.isRecommended;
      const isExecuted = item.executed;

      html += `
        <div class="cmd-card ${isRec ? 'glowing-crit' : ''}" style="margin-bottom: 16px; border: 1px solid ${isRec ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-subtle)'};">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="badge ${isRec ? 'badge-crit' : 'badge-blue'}">${item.badge}</span>
                <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${item.id}</span>
                ${isExecuted ? '<span class="badge badge-low">EXECUTED & ACTIVE 🟢</span>' : ''}
              </div>
              <h3 style="font-size: 16px; font-weight: 800; font-family: var(--font-display); color: #fff;">
                ${item.title}
              </h3>
            </div>

            <!-- Total Intervention Score Circle -->
            <div style="display: flex; flex-direction: column; align-items: center; background: var(--bg-tertiary); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 8px 14px; min-width: 90px;">
              <span style="font-size: 9px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">IMPACT SCORE</span>
              <span style="font-size: 24px; font-weight: 900; font-family: var(--font-mono); color: ${item.score > 80 ? '#10b981' : item.score > 60 ? '#f59e0b' : '#ef4444'};">
                ${item.score}<span style="font-size: 12px; color: var(--text-muted);">/100</span>
              </span>
            </div>
          </div>

          <!-- Quantitative Impact Metrics Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; background: var(--bg-primary); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 12px;">
            <div>
              <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Risk Reduction</span>
              <div style="font-size: 16px; font-weight: 800; font-family: var(--font-mono); color: var(--risk-low);">
                -${item.riskReductionPct}%
              </div>
            </div>
            <div>
              <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">People Protected</span>
              <div style="font-size: 16px; font-weight: 800; font-family: var(--font-mono); color: #fff;">
                ${item.peopleProtected.toLocaleString()}
              </div>
            </div>
            <div>
              <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">EMS Transit Delta</span>
              <div style="font-size: 16px; font-weight: 800; font-family: var(--font-mono); color: ${item.responseTimeImprovementMin > 0 ? 'var(--accent-cyan)' : 'var(--risk-crit)'};">
                ${item.responseTimeImprovementMin > 0 ? `+${item.responseTimeImprovementMin} min saved` : `${item.responseTimeImprovementMin} min delay`}
              </div>
            </div>
            <div>
              <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Resource Requirement</span>
              <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-top: 2px;">
                ${item.resourceCost}
              </div>
            </div>
          </div>

          <!-- Trade-offs & Side-Effects -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; font-size: 12px;">
            <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid var(--risk-crit); padding: 8px 10px; border-radius: 4px;">
              <strong style="color: #ef4444; font-size: 11px;">Negative Trade-offs:</strong>
              <p style="color: var(--text-secondary); margin-top: 2px;">${item.negativeEffects}</p>
            </div>
            <div style="background: rgba(59, 130, 246, 0.08); border-left: 3px solid var(--accent-blue); padding: 8px 10px; border-radius: 4px;">
              <strong style="color: var(--accent-cyan); font-size: 11px;">Explainable AI Rationale:</strong>
              <p style="color: var(--text-secondary); margin-top: 2px;">${item.aiRationale}</p>
            </div>
          </div>

          <!-- Execution Action Bar -->
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            ${isExecuted 
              ? `<span style="font-size: 12px; color: var(--risk-low); font-weight: 700;">✓ Active Directive in Field Operations</span>` 
              : `<button class="${isRec ? 'btn-danger' : 'btn-secondary'}" onclick="window.interventionsMatrix.execute('${item.id}')">
                   ${isRec ? '🥇 Authorize & Execute Recommended Action' : 'Authorize Alternative Action'}
                 </button>`
            }
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  execute(intId) {
    this.store.executeIntervention(intId);
    if (window.audioService) {
      window.audioService.playAuthorizeTone();
    }
  }
}

window.interventionsMatrix = new InterventionMatrix(window.appState);
