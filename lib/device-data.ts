export interface Device {
  id: string
  client: string
  siteName: string
  siteRunningNumber?: number
  sim1IpAddress?: string
  simIccidSim1?: string
  sim2IpAddress?: string
  simIccidSim2?: string
  psuType?: string
  batteryDc?: string
  batteryBrandDcConverterType?: string
  spdBrand?: string
  mcbBrand?: string
  rccbBrand?: string
  antennaTypeQty?: string
  antennaSupplier?: string
  serialNumberVA?: string
  enclosureSn?: string
  relocatedSnEnclosure?: string
  relocatedEnclosureDate?: string
  methodOfInstallation?: string
  typeOfEnclosure?: string
  enclosureInstalledBy?: string
  installerTeam?: string
  tnbContractNo?: string
  serialNumberRouter?: string
  connectivityType?: string
  breakerType?: string
  // Add audit fields
  createdBy?: string
  lastUpdatedBy?: string
  recordStatus: "Active" | "Inactive"
  createdAt?: string
  updatedAt?: string
}

export const mockDevices: Device[] = [
  {
    id: "dev-001",
    client: "TNB",
    siteName: "Substation Alpha",
    siteRunningNumber: 1001,
    sim1IpAddress: "10.1.1.100",
    simIccidSim1: "8960123456789012345",
    sim2IpAddress: "10.1.1.101",
    simIccidSim2: "8960123456789012346",
    psuType: "EXICOM",
    batteryDc: "Battery",
    batteryBrandDcConverterType: "ENERZELL",
    spdBrand: "CHINT",
    mcbBrand: "SCHNEIDER",
    rccbBrand: "SCHNEIDER",
    antennaTypeQty: "Omni 2x",
    antennaSupplier: "Nosairis",
    serialNumberVA: "VA2024001",
    enclosureSn: "ENC001",
    methodOfInstallation: "WM INSIDE PE",
    typeOfEnclosure: "TO BE CONFIRMED",
    enclosureInstalledBy: "Nosairis",
    installerTeam: "PRODATA",
    tnbContractNo: "TNB-IT No. 4/2016",
    serialNumberRouter: "RTR001",
    connectivityType: "Both",
    breakerType: "RMU",
    createdBy: "engineer@tnb.com",
    lastUpdatedBy: "technician@tnb.com",
    recordStatus: "Active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-25T14:15:00Z",
  },
  {
    id: "dev-002",
    client: "TNB",
    siteName: "Substation Beta",
    siteRunningNumber: 1002,
    sim1IpAddress: "10.1.2.100",
    simIccidSim1: "8960123456789012347",
    psuType: "MEANWELL",
    batteryDc: "DC Converter",
    batteryBrandDcConverterType: "30 VDC",
    spdBrand: "PHOENIX CONTACT",
    mcbBrand: "CHINT",
    rccbBrand: "HIMEL",
    antennaTypeQty: "Directional 1x",
    antennaSupplier: "Nosairis",
    serialNumberVA: "VA2024002",
    enclosureSn: "ENC002",
    methodOfInstallation: "WM OUTSIDE PPU",
    typeOfEnclosure: "TO BE CONFIRMED",
    enclosureInstalledBy: "TNB ICT",
    installerTeam: "SATRIA",
    tnbContractNo: "TNB-IT No. 52/2019",
    serialNumberRouter: "RTR002",
    connectivityType: "Cellular",
    breakerType: "VCB",
    createdBy: "admin@tnb.com",
    lastUpdatedBy: "admin@tnb.com",
    recordStatus: "Active",
    createdAt: "2023-11-25T09:00:00Z",
    updatedAt: "2023-12-01T16:30:00Z",
  },
  {
    id: "dev-003",
    client: "Global",
    siteName: "Distribution Center Gamma",
    siteRunningNumber: 1003,
    sim1IpAddress: "10.1.3.100",
    simIccidSim1: "8960123456789012348",
    sim2IpAddress: "10.1.3.101",
    simIccidSim2: "8960123456789012349",
    psuType: "EXICOM",
    batteryDc: "Battery",
    batteryBrandDcConverterType: "GENESIS",
    spdBrand: "CHINT",
    mcbBrand: "EPS",
    rccbBrand: "SCHNEIDER (40A)",
    antennaTypeQty: "Panel 4x",
    antennaSupplier: "Nosairis",
    serialNumberVA: "VA2024003",
    enclosureSn: "ENC003",
    relocatedSnEnclosure: "ENC003-R",
    relocatedEnclosureDate: "2024-01-15",
    methodOfInstallation: "SSWM",
    typeOfEnclosure: "TO BE CONFIRMED",
    enclosureInstalledBy: "Nosairis",
    installerTeam: "Swichtec",
    tnbContractNo: "TNB 1649/2020",
    serialNumberRouter: "RTR003",
    connectivityType: "Wired",
    breakerType: "CSU",
    createdBy: "global@admin.com",
    lastUpdatedBy: "maintenance@global.com",
    recordStatus: "Inactive",
    createdAt: "2024-02-10T11:45:00Z",
    updatedAt: "2024-02-20T08:20:00Z",
  },
]
