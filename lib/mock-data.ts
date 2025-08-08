export interface Site {
  runningNumber: number
  client: string
  siteName: string
  oldPeName?: string
  flNumber?: string
  priorityStatus: string
  projectOwner?: string
  state: string
  subzone?: string
  stationCategory: string
  monitoringType: string
  gateway?: string
  circuitId?: string
  caasdu?: string
  protocol?: string
  firstIoa?: string
  lastIoa?: string
  template?: string
  installationDate?: string
  simCardTerminationActivity?: string
  status: string
  rtuStatus: string
  phase?: string
  siteStatus: string
  loopbackIp?: string
  apn1?: string
  apn2?: string
  pricing?: number
  region?: string
  contractNo?: string
  gpsLat?: number
  gpsLong?: number
  // Add audit fields
  createdBy?: string
  lastUpdatedBy?: string
  recordStatus: "Active" | "Inactive"
  createdAt?: string
  updatedAt?: string
}

export const mockSites: Site[] = [
  {
    runningNumber: 1001,
    client: "TNB",
    siteName: "Substation Alpha",
    oldPeName: "Old Alpha Station",
    flNumber: "FL001",
    priorityStatus: "PRIMARY",
    projectOwner: "DA",
    state: "SELANGOR",
    subzone: "Zone A1",
    stationCategory: "PE",
    monitoringType: "RTU",
    gateway: "CA01",
    circuitId: "CID001",
    caasdu: "CAASDU001",
    protocol: "DNP3",
    firstIoa: "1000",
    lastIoa: "1100",
    template: "NEW",
    installationDate: "2024-01-15",
    simCardTerminationActivity: "Terminated",
    status: "Production",
    rtuStatus: "Commissioned",
    phase: "P1",
    siteStatus: "Active",
    loopbackIp: "192.168.1.1",
    apn1: "CELCOM",
    apn2: "DIGI",
    pricing: 1500.0,
    region: "CENTRAL",
    contractNo: "TNB-IT-2024-001",
    gpsLat: 3.139,
    gpsLong: 101.6869,
    createdBy: "admin@tnb.com",
    lastUpdatedBy: "engineer@tnb.com",
    recordStatus: "Active",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    runningNumber: 1002,
    client: "TNB",
    siteName: "Substation Beta",
    flNumber: "FL002",
    priorityStatus: "CC",
    projectOwner: "DALCO",
    state: "JOHOR",
    subzone: "Zone B2",
    stationCategory: "PMU",
    monitoringType: "FTU",
    gateway: "CB02",
    circuitId: "CID002",
    protocol: "IEC101",
    firstIoa: "2000",
    lastIoa: "2200",
    template: "OLD",
    installationDate: "2023-11-20",
    simCardTerminationActivity: "Active",
    status: "O&M-Live",
    rtuStatus: "Commissioned",
    phase: "P3",
    siteStatus: "Active",
    loopbackIp: "192.168.2.1",
    apn1: "MAXIS",
    apn2: "-",
    pricing: 1200.0,
    region: "SOUTHERN",
    contractNo: "TNB-IT-2023-052",
    gpsLat: 1.4927,
    gpsLong: 103.7414,
    createdBy: "admin@tnb.com",
    lastUpdatedBy: "admin@tnb.com",
    recordStatus: "Active",
    createdAt: "2023-11-15T10:00:00Z",
    updatedAt: "2023-11-25T16:45:00Z",
  },
  {
    runningNumber: 1003,
    client: "Global",
    siteName: "Distribution Center Gamma",
    priorityStatus: "VVIP",
    projectOwner: "SBU AD",
    state: "PERAK",
    stationCategory: "SS",
    monitoringType: "RMU",
    gateway: "NA03",
    circuitId: "CID003",
    caasdu: "CAASDU003",
    protocol: "DNP3",
    firstIoa: "3000",
    lastIoa: "3300",
    template: "NEW",
    installationDate: "2024-02-10",
    simCardTerminationActivity: "Pending",
    status: "Pre-Production",
    rtuStatus: "Non-Commissioned",
    phase: "P5",
    siteStatus: "Active",
    apn1: "DIGI",
    pricing: 2000.0,
    region: "NORTHERN",
    contractNo: "GLB-2024-003",
    gpsLat: 4.5975,
    gpsLong: 101.0901,
    createdBy: "global@admin.com",
    lastUpdatedBy: "field@engineer.com",
    recordStatus: "Active",
    createdAt: "2024-02-05T09:30:00Z",
    updatedAt: "2024-02-15T11:20:00Z",
  },
  {
    runningNumber: 1004,
    client: "TNB",
    siteName: "Power Station Delta",
    flNumber: "FL004",
    priorityStatus: "-",
    state: "PAHANG",
    subzone: "Zone D4",
    stationCategory: "PPU",
    monitoringType: "VCB",
    gateway: "SA04",
    circuitId: "CID004",
    protocol: "DNP3",
    template: "NEW",
    simCardTerminationActivity: "Not Required",
    status: "DEC O&M-Live",
    rtuStatus: "Commissioned",
    phase: "P7B1",
    siteStatus: "Relocated",
    loopbackIp: "192.168.4.1",
    apn1: "CELCOM",
    apn2: "MAXIS",
    pricing: 1800.0,
    region: "EASTERN",
    contractNo: "TNB-IT-2023-004",
    gpsLat: 3.8126,
    gpsLong: 103.3256,
    createdBy: "admin@tnb.com",
    lastUpdatedBy: "maintenance@tnb.com",
    recordStatus: "Inactive",
    createdAt: "2023-12-01T07:15:00Z",
    updatedAt: "2024-01-05T13:10:00Z",
  },
  {
    runningNumber: 1005,
    client: "TNB",
    siteName: "Transmission Hub Echo",
    oldPeName: "Echo Legacy Hub",
    flNumber: "FL005",
    priorityStatus: "PRIMARY",
    projectOwner: "TTOM",
    state: "KEDAH",
    stationCategory: "SSU",
    monitoringType: "MRMU",
    gateway: "CA05",
    circuitId: "CID005",
    caasdu: "CAASDU005",
    protocol: "IEC101",
    firstIoa: "5000",
    lastIoa: "5500",
    template: "OLD",
    installationDate: "2023-09-15",
    simCardTerminationActivity: "Completed",
    status: "Production",
    rtuStatus: "Commissioned",
    phase: "TTOM 2024",
    siteStatus: "Active",
    loopbackIp: "192.168.5.1",
    apn1: "MAXIS",
    pricing: 2200.0,
    region: "NORTHERN",
    contractNo: "TNB-TTOM-2023-005",
    gpsLat: 6.1184,
    gpsLong: 100.3685,
    createdBy: "ttom@tnb.com",
    lastUpdatedBy: "ttom@tnb.com",
    recordStatus: "Active",
    createdAt: "2023-09-10T12:00:00Z",
    updatedAt: "2023-09-20T15:30:00Z",
  },
]
