const BASE_URL = 'https://fleet-api.prd.eu.vn.cloud.tesla.com';

class TeslaApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async _fetch(endpoint, options = {}) {
    if (!this.token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
        let errorDetails = '';
        try {
            const errBody = await response.json();
            errorDetails = JSON.stringify(errBody);
        } catch(e) {}
        throw new Error(`Tesla API Error: ${response.status} ${response.statusText} ${errorDetails}`);
    }

    return response.json();
  }

  // Gets the list of vehicles
  async getVehicles() {
    return this._fetch('/api/1/vehicles');
  }

  // Get full vehicle data (state, climate, charge, etc)
  async getVehicleData(vehicleId) {
    return this._fetch(`/api/1/vehicles/${vehicleId}/vehicle_data`);
  }

  // Execute Command
  async executeCommand(vehicleId, command, payload = {}) {
    return this._fetch(`/api/1/vehicles/${vehicleId}/command/${command}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Specific Commands
  async honkHorn(vehicleId) {
    return this.executeCommand(vehicleId, 'honk_horn');
  }

  async flashLights(vehicleId) {
    return this.executeCommand(vehicleId, 'flash_lights');
  }

  async setDoorLock(vehicleId, lock) {
    const cmd = lock ? 'door_lock' : 'door_unlock';
    return this.executeCommand(vehicleId, cmd);
  }

  async setHvac(vehicleId, enable) {
    const cmd = enable ? 'auto_conditioning_start' : 'auto_conditioning_stop';
    return this.executeCommand(vehicleId, cmd);
  }

  // Export utility
  exportTelemetry(data) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `tesla_telemetry_${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const teslaApi = new TeslaApiService();
