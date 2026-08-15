/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * Interactive Cascading Impact Network Graph (SVG + Physics & Drill-Down)
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class CascadeGraph {
  constructor(stateStore) {
    this.store = stateStore;
    this.container = null;
    this.svg = null;
    this.selectedNodeId = "N4"; // Default to Road R12
    this.whatIfActive = false;
  }

  init() {
    this.container = document.getElementById('cascade-svg-wrap');
    if (!this.container) return;

    this.renderGraph();
    this.renderInspector(this.selectedNodeId);

    this.store.subscribe(() => {
      this.renderGraph();
      this.renderInspector(this.selectedNodeId);
    });
  }

  selectNode(nodeId) {
    this.selectedNodeId = nodeId;
    this.renderGraph();
    this.renderInspector(nodeId);
  }

  toggleWhatIf() {
    this.whatIfActive = !this.whatIfActive;
    this.renderGraph();
    this.renderInspector(this.selectedNodeId);
  }

  renderGraph() {
    const s = this.store.getState();
    const wrap = document.getElementById('cascade-svg-wrap');
    if (!wrap) return;

    const width = wrap.clientWidth || 950;
    const height = wrap.clientHeight || 550;

    let svgHtml = `
      <svg class="cascade-svg-canvas" viewBox="0 0 1280 440" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="grad-crit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b111e" />
            <stop offset="100%" stop-color="#1c0a10" />
          </linearGradient>
          <linearGradient id="grad-high" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3a1e0f" />
            <stop offset="100%" stop-color="#1a0f07" />
          </linearGradient>
          <linearGradient id="grad-mod" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38290e" />
            <stop offset="100%" stop-color="#191307" />
          </linearGradient>
          <linearGradient id="grad-low" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f2b20" />
            <stop offset="100%" stop-color="#071711" />
          </linearGradient>

          <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
    `;

    // 1. Draw Connecting Links between dependent nodes
    s.cascadingNodes.forEach(node => {
      node.dependents.forEach(depId => {
        const targetNode = s.cascadingNodes.find(n => n.id === depId);
        if (targetNode) {
          const isCrit = (node.failureProb > 80 && targetNode.failureProb > 75) && !this.whatIfActive;
          const linkClass = isCrit ? "cascade-link active-crit" : "cascade-link";

          const x1 = node.x + 85;
          const y1 = node.y + 40;
          const x2 = targetNode.x - 85;
          const y2 = targetNode.y + 40;
          const cx1 = x1 + (x2 - x1) * 0.5;
          const cy1 = y1;
          const cx2 = x1 + (x2 - x1) * 0.5;
          const cy2 = y2;

          svgHtml += `
            <path d="M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}" 
                  class="${linkClass}" fill="none" />
          `;
        }
      });
    });

    // 2. Draw Nodes
    s.cascadingNodes.forEach(node => {
      let prob = node.failureProb;
      let riskScore = node.riskScore;

      // Apply What-If reduction to downstream nodes if active
      if (this.whatIfActive && (node.id === "N4" || node.id === "N5" || node.id === "N6" || node.id === "N7" || node.id === "N8")) {
        prob = Math.max(18, Math.round(node.failureProb * 0.35));
        riskScore = Math.max(22, Math.round(node.riskScore * 0.4));
      }

      const isSelected = node.id === this.selectedNodeId;
      const riskClass = prob > 80 ? "crit" : prob > 50 ? "high" : prob > 25 ? "mod" : "low";
      const badgeFill = prob > 80 ? "#ef4444" : prob > 50 ? "#f97316" : prob > 25 ? "#f59e0b" : "#10b981";

      svgHtml += `
        <g class="graph-node ${riskClass} ${isSelected ? 'selected' : ''}" 
           transform="translate(${node.x - 85}, ${node.y})" 
           onclick="window.cascadeGraph.selectNode('${node.id}')">
          
          <rect class="node-rect" width="170" height="80" rx="8" />
          
          <!-- Header Tier Badge -->
          <rect x="8" y="8" width="80" height="14" rx="3" fill="rgba(255,255,255,0.06)" />
          <text x="12" y="19" fill="#94a3b8" font-size="8" font-family="var(--font-mono)" font-weight="700">
            ${node.level}
          </text>

          <!-- Failure Probability Badge -->
          <rect class="node-prob-badge" x="120" y="8" width="42" height="15" rx="3" fill="${badgeFill}" />
          <text x="141" y="19" fill="#ffffff" font-size="9" font-family="var(--font-mono)" font-weight="800" text-anchor="middle">
            ${prob}%
          </text>

          <!-- Node Title Text -->
          <text class="node-title-text" x="10" y="44">
            ${this.truncate(node.name, 22)}
          </text>

          <!-- Subtext Time-to-impact -->
          <text class="node-sub-text" x="10" y="64">
            TTI: +${node.ttiMin}m | Conf: ${node.confidence.split(' ')[0]}
          </text>

          <!-- Interactive selection ring -->
          ${isSelected ? `<rect x="-3" y="-3" width="176" height="86" rx="10" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="4,2" />` : ''}
        </g>
      `;
    });

    svgHtml += `</svg>`;
    wrap.innerHTML = svgHtml;
  }

  renderInspector(nodeId) {
    const s = this.store.getState();
    const inspectorEl = document.getElementById('cascade-inspector-body');
    if (!inspectorEl) return;

    const node = s.cascadingNodes.find(n => n.id === nodeId) || s.cascadingNodes[3];
    let prob = node.failureProb;
    let riskScore = node.riskScore;

    if (this.whatIfActive && (node.id === "N4" || node.id === "N5" || node.id === "N6" || node.id === "N7" || node.id === "N8")) {
      prob = Math.max(18, Math.round(node.failureProb * 0.35));
      riskScore = Math.max(22, Math.round(node.riskScore * 0.4));
    }

    const badgeClass = prob > 80 ? "badge-crit" : prob > 50 ? "badge-high" : "badge-mod";

    inspectorEl.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <span class="badge ${badgeClass}">${node.level}</span>
        <span class="badge badge-blue">NODE ID: ${node.id}</span>
      </div>

      <h3 style="font-size: 16px; font-weight: 800; font-family: var(--font-display); color: #fff; margin-bottom: 8px;">
        ${node.name}
      </h3>

      <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">
        ${node.explanation}
      </p>

      <div class="detail-kpi-grid">
        <div class="detail-kpi-box">
          <span style="font-size: 10px; color: var(--text-muted);">FAILURE PROBABILITY</span>
          <span class="detail-kpi-val" style="color: ${prob > 75 ? '#ef4444' : '#10b981'}">${prob}%</span>
        </div>
        <div class="detail-kpi-box">
          <span style="font-size: 10px; color: var(--text-muted);">TIME TO IMPACT (TTI)</span>
          <span class="detail-kpi-val" style="color: var(--accent-cyan);">+${node.ttiMin} min</span>
        </div>
        <div class="detail-kpi-box">
          <span style="font-size: 10px; color: var(--text-muted);">CONFIDENCE LEVEL</span>
          <span class="detail-kpi-val" style="font-size: 14px; color: #fff;">${node.confidence}</span>
        </div>
        <div class="detail-kpi-box">
          <span style="font-size: 10px; color: var(--text-muted);">DOWNSTREAM TARGETS</span>
          <span class="detail-kpi-val" style="font-size: 14px; color: var(--accent-blue);">${node.dependents.length} Systems</span>
        </div>
      </div>

      <!-- Explainable AI Section -->
      <div class="xai-reasoning-box">
        <div class="xai-header">
          <i class="lucide-brain"></i> Explainable AI Diagnostic Factors
        </div>
        <div class="xai-factor-list">
          <div class="xai-factor-item">
            <span>Precipitation Exceeds 80mm/h</span>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color: #ef4444; font-family: var(--font-mono); font-size:10px;">+42%</span>
              <div class="xai-weight-bar"><div class="xai-weight-fill" style="width: 85%;"></div></div>
            </div>
          </div>
          <div class="xai-factor-item">
            <span>Basin Elevation Depression (21m)</span>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color: #f97316; font-family: var(--font-mono); font-size:10px;">+28%</span>
              <div class="xai-weight-bar"><div class="xai-weight-fill" style="width: 65%;"></div></div>
            </div>
          </div>
          <div class="xai-factor-item">
            <span>Culvert Drainage Capacity Saturation</span>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color: #f59e0b; font-family: var(--font-mono); font-size:10px;">+19%</span>
              <div class="xai-weight-bar"><div class="xai-weight-fill" style="width: 50%;"></div></div>
            </div>
          </div>
          <div class="xai-factor-item">
            <span>Historical Storm Inundation Match</span>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color: #10b981; font-family: var(--font-mono); font-size:10px;">+11%</span>
              <div class="xai-weight-bar"><div class="xai-weight-fill" style="width: 30%;"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive What-If Branch Simulation -->
      <div class="what-if-box" style="margin-top: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 12px; font-weight: 700; color: #fff;">
            <i class="lucide-git-branch"></i> "What-If" Intervention Simulator
          </span>
          <button class="btn-secondary" style="font-size: 11px; padding: 4px 10px;" onclick="window.cascadeGraph.toggleWhatIf()">
            ${this.whatIfActive ? 'Reset Simulation' : 'Simulate Intervention'}
          </button>
        </div>
        <p style="font-size: 11px; color: var(--text-secondary); margin-top: 6px;">
          ${this.whatIfActive 
            ? '🟢 <b>Intervention Applied</b>: Road R12 reserved for Emergency Fleet & P1 pump boosted. Downstream cascade risks suppressed by 65%.' 
            : 'Simulate deploying sandbag berms & reserving R12 for emergency vehicles to observe immediate suppression of downstream hospital overload.'}
        </p>
      </div>
    `;
  }

  truncate(str, len) {
    return str.length > len ? str.slice(0, len) + '...' : str;
  }
}

window.cascadeGraph = new CascadeGraph(window.appState);
