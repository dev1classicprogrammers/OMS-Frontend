const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Site {
  id?: number;
  runningNumber?: number; // Optional since it's auto-generated
  client: string;
  siteName: string;
  oldPeName?: string;
  flNumber?: string;
  priorityStatus: string;
  projectOwner?: string;
  state: string;
  subzone?: string;
  stationCategory: string;
  monitoringType: string;
  gateway?: string;
  circuitId?: string;
  caasdu?: string;
  protocol?: string;
  firstIoa?: string;
  lastIoa?: string;
  template?: string;
  installationDate?: string;
  simCardTerminationActivity?: string;
  status: string;
  rtuStatus: string;
  phase?: string;
  siteStatus: string;
  loopbackIp?: string;
  apn1?: string;
  apn2?: string;
  pricing?: number;
  region?: string;
  contractNo?: string;
  gpsLat?: number;
  gpsLong?: number;
  createdBy?: string;
  lastUpdatedBy?: string;
  recordStatus: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface Device {
  id: string;
  client: string;
  siteName: string;
  siteRunningNumber?: number;
  sim1IpAddress?: string;
  simIccidSim1?: string;
  sim2IpAddress?: string;
  simIccidSim2?: string;
  psuType?: string;
  batteryDc?: string;
  batteryBrandDcConverterType?: string;
  spdBrand?: string;
  mcbBrand?: string;
  rccbBrand?: string;
  antennaTypeQty?: string;
  antennaSupplier?: string;
  serialNumberVA?: string;
  enclosureSn?: string;
  relocatedSnEnclosure?: string;
  relocatedEnclosureDate?: string;
  methodOfInstallation?: string;
  typeOfEnclosure?: string;
  enclosureInstalledBy?: string;
  installerTeam?: string;
  tnbContractNo?: string;
  serialNumberRouter?: string;
  connectivityType?: string;
  breakerType?: string;
  createdBy?: string;
  lastUpdatedBy?: string;
  recordStatus: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Handle validation errors
      if (response.status === 400 && errorData) {
        const errorMessages = Object.entries(errorData)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ')
        throw new Error(`Validation error: ${errorMessages}`)
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Sites API
  async getSites(params?: Record<string, string>): Promise<ApiResponse<Site>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<ApiResponse<Site>>(`/sites/${queryString}`);
  }

  async getSite(id: number): Promise<Site> {
    return this.request<Site>(`/sites/${id}/`);
  }

  async createSite(siteData: Omit<Site, 'id' | 'runningNumber'>): Promise<Site> {
    return this.request<Site>('/sites/', {
      method: 'POST',
      body: JSON.stringify(siteData),
    });
  }

  async updateSite(id: number, siteData: Partial<Site>): Promise<Site> {
    return this.request<Site>(`/sites/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(siteData),
    });
  }

  async deleteSite(id: number): Promise<void> {
    return this.request<void>(`/sites/${id}/`, {
      method: 'DELETE',
    });
  }

  async getSiteStats(): Promise<any> {
    return this.request<any>('/sites/stats/');
  }

  async getSiteClients(): Promise<string[]> {
    const response = await this.request<{ clients: string[] }>('/sites/clients/');
    return response.clients;
  }

  async getSiteStates(): Promise<string[]> {
    const response = await this.request<{ states: string[] }>('/sites/states/');
    return response.states;
  }

  // Devices API
  async getDevices(params?: Record<string, string>): Promise<ApiResponse<Device>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<ApiResponse<Device>>(`/devices/${queryString}`);
  }

  async getDevice(id: string): Promise<Device> {
    return this.request<Device>(`/devices/${id}/`);
  }

  async createDevice(deviceData: Omit<Device, 'id'>): Promise<Device> {
    return this.request<Device>('/devices/', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  async updateDevice(id: string, deviceData: Partial<Device>): Promise<Device> {
    return this.request<Device>(`/devices/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(deviceData),
    });
  }

  async deleteDevice(id: string): Promise<void> {
    return this.request<void>(`/devices/${id}/`, {
      method: 'DELETE',
    });
  }

  async getDeviceStats(): Promise<any> {
    return this.request<any>('/devices/stats/');
  }

  async getDeviceClients(): Promise<string[]> {
    const response = await this.request<{ clients: string[] }>('/devices/clients/');
    return response.clients;
  }

  async getDeviceConnectivityTypes(): Promise<string[]> {
    const response = await this.request<{ connectivityTypes: string[] }>('/devices/connectivity_types/');
    return response.connectivityTypes;
  }

  async getDeviceBreakerTypes(): Promise<string[]> {
    const response = await this.request<{ breakerTypes: string[] }>('/devices/breaker_types/');
    return response.breakerTypes;
  }
}

export const apiService = new ApiService(); 