/**
 * AI CASCADING DISASTER RESPONSE SYSTEM
 * Interactive GIS Map Controller - NASHIK, MAHARASHTRA
 * "Predict the cascade. Prioritize the response. Protect every person."
 */

class MapController {
  constructor(stateStore) {
    this.store = stateStore;
    this.mainMap = null;
    this.miniMap = null;
    this.guardianMap = null;

    this.layers = {
      flood: null,
      infra: null,
      hospitals: null,
      shelters: null,
      roads: null,
      fleet: null,
      guardianRoute: null
    };

    this.layerVisibility = {
      flood: true,
      infra: true,
      hospitals: true,
      shelters: true,
      roads: true,
      fleet: true,
      cascading: true
    };
  }

  init() {
    this.initMainMap();
    this.initMiniMap();
    this.initGuardianMap();

    this.store.subscribe(() => {
      this.updateAllLayers();
    });
  }

  getTileLayer() {
    return L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    });
  }

  initMainMap() {
    const mapEl = document.getElementById('disaster-gis-map');
    if (!mapEl) return;

    // Center on Nashik (Godavari River corridor)
    this.mainMap = L.map('disaster-gis-map', {
      center: [19.9980, 73.7850],
      zoom: 13,
      zoomControl: true
    });

    this.getTileLayer().addTo(this.mainMap);

    this.layers.flood = L.layerGroup().addTo(this.mainMap);
    this.layers.roads = L.layerGroup().addTo(this.mainMap);
    this.layers.infra = L.layerGroup().addTo(this.mainMap);
    this.layers.hospitals = L.layerGroup().addTo(this.mainMap);
    this.layers.shelters = L.layerGroup().addTo(this.mainMap);
    this.layers.fleet = L.layerGroup().addTo(this.mainMap);
    this.layers.guardianRoute = L.layerGroup().addTo(this.mainMap);

    this.renderAllData(this.mainMap);
  }

  initMiniMap() {
    const miniEl = document.getElementById('dash-mini-map');
    if (!miniEl) return;

    this.miniMap = L.map('dash-mini-map', {
      center: [19.9980, 73.7850],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    this.getTileLayer().addTo(this.miniMap);
    this.renderAllData(this.miniMap, true);
  }

  initGuardianMap() {
    const gEl = document.getElementById('guardian-gis-map');
    if (!gEl) return;

    this.guardianMap = L.map('guardian-gis-map', {
      center: [20.0063, 73.7928],
      zoom: 13,
      zoomControl: true
    });

    this.getTileLayer().addTo(this.guardianMap);
    this.renderGuardianSafeRoute(this.guardianMap);
  }

  toggleLayer(layerName, isVisible) {
    this.layerVisibility[layerName] = isVisible;
    if (!this.mainMap) return;

    const layerMap = {
      flood: this.layers.flood,
      infra: this.layers.infra,
      hospitals: this.layers.hospitals,
      shelters: this.layers.shelters,
      roads: this.layers.roads,
      fleet: this.layers.fleet
    };

    const target = layerMap[layerName];
    if (target) {
      if (isVisible) {
        this.mainMap.addLayer(target);
      } else {
        this.mainMap.removeLayer(target);
      }
    }
  }

  renderAllData(mapInstance, isMini = false) {
    const s = this.store.getState();

    // 1. Render Flood Hazard Polygons (Nashik Zones)
    s.zones.forEach(z => {
      const color = z.risk === "CRITICAL" ? "#ef4444" : z.risk === "HIGH" ? "#f97316" : "#10b981";
      const circle = L.circle([z.lat, z.lng], {
        radius: isMini ? 1500 : 1300,
        color: color,
        fillColor: color,
        fillOpacity: isMini ? 0.25 : 0.35,
        weight: 2,
        dashArray: z.risk === "CRITICAL" ? '4, 4' : null
      });

      if (!isMini) {
        circle.bindPopup(`
          <div class="popup-header" style="color: ${color}">
            <i class="lucide-alert-triangle"></i> ${z.name}
          </div>
          <div class="popup-meta-row"><span>Risk Status:</span> <strong style="color: ${color}">${z.risk} (${z.riskScore}/100)</strong></div>
          <div class="popup-meta-row"><span>Godavari Inundation:</span> <strong>${z.waterDepthCm} cm</strong></div>
          <div class="popup-meta-row"><span>Population at Risk:</span> <strong>${z.pop.toLocaleString()}</strong></div>
          <div class="popup-meta-row"><span>Cascade Impact:</span> <strong>Holkar Bridge & District Hospital Transit</strong></div>
        `);
      }

      if (mapInstance === this.mainMap) this.layers.flood.addLayer(circle);
      else circle.addTo(mapInstance);
    });

    // 2. Render Nashik Roads
    s.roads.forEach(r => {
      let roadColor = "#10b981";
      let dashArray = null;

      if (r.status === "FLOODED") {
        roadColor = "#ef4444";
        dashArray = "6, 6";
      } else if (r.status === "CONGESTED") {
        roadColor = "#f59e0b";
      } else if (r.status === "EMERGENCY_CORRIDOR_ACTIVE") {
        roadColor = "#06b6d4";
        dashArray = "10, 4";
      }

      const poly = L.polyline(r.coords, {
        color: roadColor,
        weight: isMini ? 3 : 5,
        dashArray: dashArray,
        opacity: 0.9
      });

      if (!isMini) {
        poly.bindPopup(`
          <div class="popup-header" style="color: ${roadColor}">
            <i class="lucide-git-commit"></i> ${r.name}
          </div>
          <div class="popup-meta-row"><span>Status:</span> <strong>${r.status}</strong></div>
          <div class="popup-meta-row"><span>Failure Probability:</span> <strong>${r.failureProb}%</strong></div>
          <div class="popup-meta-row"><span>Water Depth:</span> <strong>${r.waterDepthCm} cm</strong></div>
          <div class="popup-meta-row"><span>Transit Time:</span> <strong>${r.currentTransitMin} min</strong> (Normal: ${r.normalTransitMin}m)</div>
          <div class="popup-meta-row"><span>Hospital Link:</span> <strong>Affects transit to Nashik Civil Hospital</strong></div>
        `);
      }

      if (mapInstance === this.mainMap) this.layers.roads.addLayer(poly);
      else poly.addTo(mapInstance);
    });

    // 3. Render Nashik Hospitals
    s.hospitals.forEach(h => {
      const iconHtml = `<div class="custom-marker marker-hospital" style="width: 28px; height: 28px;">🏥</div>`;
      const icon = L.divIcon({ html: iconHtml, className: '', iconSize: [28, 28] });
      const marker = L.marker([h.lat, h.lng], { icon });

      if (!isMini) {
        marker.bindPopup(`
          <div class="popup-header" style="color: #ec4899">
            <i class="lucide-cross"></i> ${h.name}
          </div>
          <div class="popup-meta-row"><span>ER Trauma Load:</span> <strong>${h.currentERLoad}/${h.capacityER} beds (${Math.round((h.currentERLoad/h.capacityER)*100)}%)</strong></div>
          <div class="popup-meta-row"><span>ICU Occupancy:</span> <strong>${h.currentICULoad}/${h.capacityICU} beds</strong></div>
          <div class="popup-meta-row"><span>Overload Risk:</span> <strong style="color: ${h.overloadProb > 75 ? '#ef4444' : '#10b981'}">${h.overloadProb}%</strong></div>
          <div class="popup-meta-row"><span>Status:</span> <strong>${h.status}</strong></div>
        `);
      }

      if (mapInstance === this.mainMap) this.layers.hospitals.addLayer(marker);
      else marker.addTo(mapInstance);
    });

    // 4. Render Nashik Shelters
    s.shelters.forEach(sh => {
      const iconHtml = `<div class="custom-marker marker-shelter" style="width: 26px; height: 26px;">🏠</div>`;
      const icon = L.divIcon({ html: iconHtml, className: '', iconSize: [26, 26] });
      const marker = L.marker([sh.lat, sh.lng], { icon });

      if (!isMini) {
        marker.bindPopup(`
          <div class="popup-header" style="color: #10b981">
            <i class="lucide-home"></i> ${sh.name}
          </div>
          <div class="popup-meta-row"><span>Occupancy:</span> <strong>${sh.occupancy} / ${sh.capacity} (${Math.round((sh.occupancy/sh.capacity)*100)}%)</strong></div>
          <div class="popup-meta-row"><span>Provisions:</span> <strong>${sh.suppliesDays} Days Remaining</strong></div>
          <div class="popup-meta-row"><span>Medical Staff:</span> <strong>${sh.medicalStaff} on duty</strong></div>
          <div class="popup-meta-row"><span>Status:</span> <strong style="color: #10b981">${sh.status}</strong></div>
        `);
      }

      if (mapInstance === this.mainMap) this.layers.shelters.addLayer(marker);
      else marker.addTo(mapInstance);
    });

    // 5. Render Emergency Fleet (NDRF Boats, 108 EMS Ambulances)
    s.fleet.forEach(f => {
      const iconEmoji = f.type === "ambulance" ? "🚑" : f.type === "boat" ? "🚤" : "🚒";
      const iconHtml = `<div class="custom-marker marker-ambulance" style="width: 26px; height: 26px;">${iconEmoji}</div>`;
      const icon = L.divIcon({ html: iconHtml, className: '', iconSize: [26, 26] });
      const marker = L.marker([f.lat, f.lng], { icon });

      if (!isMini) {
        marker.bindPopup(`
          <div class="popup-header" style="color: #f59e0b">
            ${iconEmoji} ${f.name}
          </div>
          <div class="popup-meta-row"><span>Status:</span> <strong>${f.status.toUpperCase()}</strong></div>
          <div class="popup-meta-row"><span>Mission / Target:</span> <strong>${f.target}</strong></div>
          <div class="popup-meta-row"><span>ETA:</span> <strong>${f.etaMin} minutes</strong></div>
        `);
      }

      if (mapInstance === this.mainMap) this.layers.fleet.addLayer(marker);
      else marker.addTo(mapInstance);
    });
  }

  renderGuardianSafeRoute(mapInstance) {
    if (!mapInstance) return;
    const s = this.store.getState();

    // User GPS pin in Nashik
    const userIconHtml = `<div class="custom-marker marker-citizen-gps" style="width: 32px; height: 32px; font-size: 16px;">📍</div>`;
    const userIcon = L.divIcon({ html: userIconHtml, className: '', iconSize: [32, 32] });
    L.marker([s.guardian.userLocation.lat, s.guardian.userLocation.lng], { icon: userIcon })
      .bindPopup(`<b>Your Location in Nashik</b><br>${s.guardian.userLocation.name}`)
      .addTo(mapInstance);

    // KTHM College Shelter S1 pin
    const shelter = s.shelters.find(sh => sh.id === "S1") || s.shelters[0];
    const shelterIconHtml = `<div class="custom-marker marker-shelter" style="width: 32px; height: 32px; font-size: 16px;">🏠</div>`;
    const shelterIcon = L.divIcon({ html: shelterIconHtml, className: '', iconSize: [32, 32] });
    L.marker([shelter.lat, shelter.lng], { icon: shelterIcon })
      .bindPopup(`<b>Recommended Shelter</b><br>${shelter.name}`)
      .addTo(mapInstance);

    // Safe Evacuation Route Polyline (Gangapur Bypass to KTHM Campus)
    const safeRouteCoords = [
      [s.guardian.userLocation.lat, s.guardian.userLocation.lng],
      [20.0075, 73.7820],
      [20.0080, 73.7740],
      [shelter.lat, shelter.lng]
    ];

    L.polyline(safeRouteCoords, {
      color: '#3b82f6',
      weight: 6,
      opacity: 0.9,
      dashArray: '8, 4'
    }).bindPopup("<b>Safe Evacuation Corridor (Gangapur Road Bypass)</b><br>Estimated time: 20 min").addTo(mapInstance);

    // Flooded Holkar Bridge / Godavari Road R12 (Hazard Red)
    const floodedR12Coords = [
      [20.002, 73.785],
      [20.007, 73.793],
      [20.012, 73.801]
    ];
    L.polyline(floodedR12Coords, {
      color: '#ef4444',
      weight: 5,
      dashArray: '6, 6',
      opacity: 0.85
    }).bindPopup("<b>CLOSED: Holkar Bridge & Godavari Riverfront</b><br>Water depth: 80cm").addTo(mapInstance);
  }

  updateAllLayers() {
    if (this.mainMap) {
      this.layers.flood.clearLayers();
      this.layers.roads.clearLayers();
      this.layers.infra.clearLayers();
      this.layers.hospitals.clearLayers();
      this.layers.shelters.clearLayers();
      this.layers.fleet.clearLayers();
      this.renderAllData(this.mainMap);
    }
  }
}

window.mapController = new MapController(window.appState);
