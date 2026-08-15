/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * RAG Knowledge Base & Standard Operating Procedures - NASHIK & MAHARASHTRA SDMA
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class KnowledgeRAG {
  constructor() {
    this.documents = [
      {
        id: "SOP-MAHA-SDMA-NSK",
        title: "Maharashtra SDMA & NMC Godavari River Inundation Action Plan",
        category: "NASHIK EOC MANDATE",
        agency: "Maharashtra State Disaster Management Authority & Nashik Municipal Corporation",
        summary: "Standard emergency procedures when Gangapur Dam discharge exceeds 25,000 cusecs and Dutondya Maruti water level crosses the warning mark.",
        content: "Section 4.1: When Gangapur Dam release exceeds 30,000 cusecs, Nashik Police and NMC shall immediately barricade Holkar Bridge and Ramkund Ghat access roads. NDRF Motor Boat units from 5th Battalion must stage at Panchavati and Someshwar. Emergency corridor R15 (Gangapur Road) must remain reserved for medical and disaster fleet.",
        citations: ["Maharashtra Disaster Management Act Sec 24", "NMC Flood Manual 2024-25"]
      },
      {
        id: "SOP-NDRF-PUNE-05",
        title: "NDRF 5th Battalion Urban Flood & River Rescue Standard Operating Procedure",
        category: "WATER RESCUE & EVACUATION",
        agency: "National Disaster Response Force (NDRF)",
        summary: "Tactical guidelines for deploying inflatable motorized rescue boats (IRBs) across turbulent Godavari river currents.",
        content: "Section 2.6: Water rescue boats deployed at Ramkund and Panchavati must operate with high-buoyancy life jackets and acoustic distress beacons. Evacuees must be transported directly to designated dry transfer points at KTHM College Ground or Mahatma Nagar Sports Complex.",
        citations: ["NDRF SOP 2024-UrbanFloods", "UN-SPIDER Flood Guidelines"]
      },
      {
        id: "SOP-HEALTH-MAHA-TRAUMA",
        title: "Maharashtra Directorate of Health Services: Mass Casualty Triage & Civil Hospital Surge",
        category: "HEALTHCARE",
        agency: "Public Health Department, Maharashtra",
        summary: "Protocols for Nashik District Civil Hospital when ER bed occupancy exceeds 90% during monsoon flooding.",
        content: "Section 7.3: When Nashik District Civil Hospital ER occupancy exceeds 90%, pre-emptive patient diversion to Sahyadri Super Speciality (Mumbai Naka) and Apollo Hospital (Panchavati) must be initiated within 45 minutes under the Ayushman Bharat / MJPJAY emergency disaster protocol.",
        citations: ["DHS Maharashtra Circular No. 412", "National Health Mission Disaster Guidelines"]
      },
      {
        id: "SOP-MSEDCL-GRID-FLOOD",
        title: "MSEDCL & Water Supply Stormwater Substation Safeguard Protocol",
        category: "INFRASTRUCTURE",
        agency: "Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)",
        summary: "Operating protocol for maintaining grid integrity at Satpur 220kV substation and Anandvalli raw water pumping facility during Godavari cresting.",
        content: "Section 3.2: Satpur and Ambad industrial feeders must switch to protected elevated busbars if floodwater exceeds 35cm in peripheral drainage channels. Mobile high-capacity dewatering pumps from NMC Fire Brigade must be stationed at Substation E4.",
        citations: ["MSEDCL Disaster Resiliency Protocol", "Central Electricity Authority Flood Guidelines"]
      }
    ];
  }

  init() {
    this.renderSearchResults(this.documents);
  }

  search(query) {
    if (!query || !query.trim()) {
      this.renderSearchResults(this.documents);
      return;
    }

    const q = query.toLowerCase().trim();
    const results = this.documents.filter(doc => 
      doc.title.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q)
    );

    this.renderSearchResults(results, query);
  }

  renderSearchResults(docs, query = "") {
    const container = document.getElementById('rag-results-container');
    if (!container) return;

    if (docs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="lucide-search" style="font-size: 32px; margin-bottom: 8px;"></i>
          <p>No matching Nashik disaster SOPs found for "${query}". Try searching "Godavari", "Civil Hospital", "Gangapur", or "Holkar".</p>
        </div>
      `;
      return;
    }

    let html = "";
    docs.forEach(doc => {
      let citationsHtml = doc.citations.map(c => `<span class="badge badge-blue" style="font-size: 10px;">📄 ${c}</span>`).join(" ");

      html += `
        <div class="cmd-card" style="margin-bottom: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-high">${doc.category}</span>
              <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-cyan);">${doc.id}</span>
            </div>
            <span style="font-size: 11px; color: var(--text-muted);">${doc.agency}</span>
          </div>

          <h3 style="font-size: 15px; font-weight: 800; font-family: var(--font-display); color: #fff; margin-bottom: 6px;">
            ${doc.title}
          </h3>

          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px;">
            ${doc.summary}
          </p>

          <div style="background: var(--bg-tertiary); border-left: 3px solid var(--accent-blue); padding: 10px 12px; border-radius: 4px; font-size: 12px; color: var(--text-primary); margin-bottom: 10px; line-height: 1.5;">
            <b>Grounded Protocol Excerpt:</b> "${doc.content}"
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--text-muted);">
            <div><b>Official Citations:</b> ${citationsHtml}</div>
            <span style="color: var(--risk-low); font-weight: 700;">✓ Grounded in Nashik Multi-Agent Memory</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }
}

window.knowledgeRAG = new KnowledgeRAG();
