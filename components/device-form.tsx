"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Device } from "@/lib/device-data"
import { apiService } from "@/lib/api"
import {
  PSU_TYPE_OPTIONS,
  BATTERY_DC_OPTIONS,
  BATTERY_BRAND_DC_CONVERTER_TYPE_OPTIONS,
  SPD_BRAND_OPTIONS,
  MCB_BRAND_OPTIONS,
  RCCB_BRAND_OPTIONS,
  ANTENNA_SUPPLIER_OPTIONS,
  METHOD_OF_INSTALLATION_OPTIONS,
  TYPE_OF_ENCLOSURE_OPTIONS,
  ENCLOSURE_INSTALLED_BY_OPTIONS,
  INSTALLER_TEAM_OPTIONS,
  TNB_CONTRACT_NO_OPTIONS,
  CONNECTIVITY_TYPE_OPTIONS,
  BREAKER_TYPE_OPTIONS,
} from "@/lib/device-constants"

interface DeviceFormProps {
  initialData?: Device
  onSubmit: (data: Omit<Device, "id">) => void
  isEditing?: boolean
  isSubmitting?: boolean
}

export function DeviceForm({ initialData, onSubmit, isEditing = false, isSubmitting = false }: DeviceFormProps) {
  // Add record status field to the form data
  const [formData, setFormData] = useState<Omit<Device, "id">>({
    client: initialData?.client || "",
    siteName: initialData?.siteName || "",
    sim1IpAddress: initialData?.sim1IpAddress || "",
    simIccidSim1: initialData?.simIccidSim1 || "",
    sim2IpAddress: initialData?.sim2IpAddress || "",
    simIccidSim2: initialData?.simIccidSim2 || "",
    psuType: initialData?.psuType || "",
    batteryDc: initialData?.batteryDc || "",
    batteryBrandDcConverterType: initialData?.batteryBrandDcConverterType || "",
    spdBrand: initialData?.spdBrand || "",
    mcbBrand: initialData?.mcbBrand || "",
    rccbBrand: initialData?.rccbBrand || "",
    antennaTypeQty: initialData?.antennaTypeQty || "",
    antennaSupplier: initialData?.antennaSupplier || "",
    serialNumberVA: initialData?.serialNumberVA || "",
    enclosureSn: initialData?.enclosureSn || "",
    relocatedSnEnclosure: initialData?.relocatedSnEnclosure || "",
    relocatedEnclosureDate: initialData?.relocatedEnclosureDate || "",
    methodOfInstallation: initialData?.methodOfInstallation || "",
    typeOfEnclosure: initialData?.typeOfEnclosure || "",
    enclosureInstalledBy: initialData?.enclosureInstalledBy || "",
    installerTeam: initialData?.installerTeam || "",
    tnbContractNo: initialData?.tnbContractNo || "",
    serialNumberRouter: initialData?.serialNumberRouter || "",
    connectivityType: initialData?.connectivityType || "",
    breakerType: initialData?.breakerType || "",
    siteRunningNumber: initialData?.siteRunningNumber || undefined,
    // Add audit fields
    createdBy: initialData?.createdBy || "",
    lastUpdatedBy: initialData?.lastUpdatedBy || "",
    recordStatus: initialData?.recordStatus || "Active",
    createdAt: initialData?.createdAt || "",
    updatedAt: initialData?.updatedAt || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [relocatedDate, setRelocatedDate] = useState<Date | null>(
    initialData?.relocatedEnclosureDate ? new Date(initialData.relocatedEnclosureDate) : null,
  )
  const [availableSites, setAvailableSites] = useState<Array<{ client: string; siteName: string }>>([])

  useEffect(() => {
    // Get sites from API
    const fetchSites = async () => {
      try {
        const response = await apiService.getSites()
        const sites = response.results.map((site) => ({
          client: site.client,
          siteName: site.siteName,
        }))
        setAvailableSites(sites)
      } catch (error) {
        console.error("Error fetching sites:", error)
      }
    }
    fetchSites()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // ALL fields are required
    if (!formData.client) newErrors.client = "Client is required"
    if (!formData.siteName) newErrors.siteName = "Site Name is required"
    if (!formData.sim1IpAddress) newErrors.sim1IpAddress = "SIM 1 IP Address is required"
    if (!formData.simIccidSim1) newErrors.simIccidSim1 = "SIM ICCID (SIM 1) is required"
    if (!formData.sim2IpAddress) newErrors.sim2IpAddress = "SIM 2 IP Address is required"
    if (!formData.simIccidSim2) newErrors.simIccidSim2 = "SIM ICCID (SIM 2) is required"
    if (!formData.psuType) newErrors.psuType = "PSU Type is required"
    if (!formData.batteryDc) newErrors.batteryDc = "Battery DC is required"
    if (!formData.batteryBrandDcConverterType) newErrors.batteryBrandDcConverterType = "Battery Brand DC Converter Type is required"
    if (!formData.spdBrand) newErrors.spdBrand = "SPD Brand is required"
    if (!formData.mcbBrand) newErrors.mcbBrand = "MCB Brand is required"
    if (!formData.rccbBrand) newErrors.rccbBrand = "RCCB Brand is required"
    if (!formData.antennaTypeQty) newErrors.antennaTypeQty = "Antenna Type Qty is required"
    if (!formData.antennaSupplier) newErrors.antennaSupplier = "Antenna Supplier is required"
    if (!formData.serialNumberVA) newErrors.serialNumberVA = "Serial Number VA is required"
    if (!formData.enclosureSn) newErrors.enclosureSn = "Enclosure SN is required"
    if (!formData.relocatedSnEnclosure) newErrors.relocatedSnEnclosure = "Relocated SN Enclosure is required"
    if (!relocatedDate) newErrors.relocatedEnclosureDate = "Relocated Enclosure Date is required"
    if (!formData.methodOfInstallation) newErrors.methodOfInstallation = "Method of Installation is required"
    if (!formData.typeOfEnclosure) newErrors.typeOfEnclosure = "Type of Enclosure is required"
    if (!formData.enclosureInstalledBy) newErrors.enclosureInstalledBy = "Enclosure Installed By is required"
    if (!formData.installerTeam) newErrors.installerTeam = "Installer Team is required"
    if (!formData.tnbContractNo) newErrors.tnbContractNo = "TNB Contract No is required"
    if (!formData.serialNumberRouter) newErrors.serialNumberRouter = "Serial Number Router is required"
    if (!formData.connectivityType) newErrors.connectivityType = "Connectivity Type is required"
    if (!formData.breakerType) newErrors.breakerType = "Breaker Type is required"
    if (!formData.createdBy) newErrors.createdBy = "Created By is required"
    if (!formData.lastUpdatedBy) newErrors.lastUpdatedBy = "Last Updated By is required"
    if (!formData.recordStatus) newErrors.recordStatus = "Record Status is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Clean up undefined values to prevent API errors
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === undefined ? null : value
        ])
      )
      
      const submitData = {
        ...cleanedData,
        relocatedEnclosureDate: relocatedDate ? format(relocatedDate, "yyyy-MM-dd") : null,
      }
      onSubmit(submitData)
    }
  }

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSiteSelection = (siteKey: string) => {
    const [client, siteName] = siteKey.split("|")
    const selectedSite = availableSites.find((site) => site.client === client && site.siteName === siteName)
    setFormData((prev) => ({
      ...prev,
      client,
      siteName,
      siteRunningNumber: undefined, // We'll need to get this from the API if needed
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Site Linking */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
            <CardDescription>Link this device to an existing site</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site">Site Selection</Label>
              <Select
                value={formData.client && formData.siteName ? `${formData.client}|${formData.siteName}` : ""}
                onValueChange={handleSiteSelection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {availableSites.map((site) => (
                    <SelectItem key={`${site.client}|${site.siteName}`} value={`${site.client}|${site.siteName}`}>
                      {site.client} - {site.siteName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Selected Client</Label>
              <Input value={formData.client} disabled />
            </div>
            <div className="space-y-2">
              <Label>Site Running Number</Label>
              <Input value={formData.siteRunningNumber || ""} disabled />
            </div>
          </CardContent>
        </Card>

        {/* SIM Configuration */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>SIM Configuration</CardTitle>
            <CardDescription>SIM card and IP address details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sim1IpAddress">SIM 1 IP Address</Label>
              <Input
                id="sim1IpAddress"
                value={formData.sim1IpAddress}
                onChange={(e) => updateFormData("sim1IpAddress", e.target.value)}
                placeholder="10.1.1.100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="simIccidSim1">SIM ICCID (SIM 1)</Label>
              <Input
                id="simIccidSim1"
                value={formData.simIccidSim1}
                onChange={(e) => updateFormData("simIccidSim1", e.target.value)}
                placeholder="8960123456789012345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sim2IpAddress">SIM 2 IP Address</Label>
              <Input
                id="sim2IpAddress"
                value={formData.sim2IpAddress}
                onChange={(e) => updateFormData("sim2IpAddress", e.target.value)}
                placeholder="10.1.1.101"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="simIccidSim2">SIM ICCID (SIM 2)</Label>
              <Input
                id="simIccidSim2"
                value={formData.simIccidSim2}
                onChange={(e) => updateFormData("simIccidSim2", e.target.value)}
                placeholder="8960123456789012346"
              />
            </div>
          </CardContent>
        </Card>

        {/* Power and Protection */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Power and Protection</CardTitle>
            <CardDescription>Power supply and protection equipment</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="psuType">PSU Type</Label>
              <Select value={formData.psuType} onValueChange={(value) => updateFormData("psuType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select PSU type" />
                </SelectTrigger>
                <SelectContent>
                  {PSU_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batteryDc">Battery / DC</Label>
              <Select value={formData.batteryDc} onValueChange={(value) => updateFormData("batteryDc", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select battery/DC type" />
                </SelectTrigger>
                <SelectContent>
                  {BATTERY_DC_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batteryBrandDcConverterType">Battery Brand / DC Converter Type</Label>
              <Select
                value={formData.batteryBrandDcConverterType}
                onValueChange={(value) => updateFormData("batteryBrandDcConverterType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand/type" />
                </SelectTrigger>
                <SelectContent>
                  {BATTERY_BRAND_DC_CONVERTER_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spdBrand">SPD Brand</Label>
              <Select value={formData.spdBrand} onValueChange={(value) => updateFormData("spdBrand", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select SPD brand" />
                </SelectTrigger>
                <SelectContent>
                  {SPD_BRAND_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mcbBrand">MCB Brand</Label>
              <Select value={formData.mcbBrand} onValueChange={(value) => updateFormData("mcbBrand", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select MCB brand" />
                </SelectTrigger>
                <SelectContent>
                  {MCB_BRAND_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rccbBrand">RCCB Brand</Label>
              <Select value={formData.rccbBrand} onValueChange={(value) => updateFormData("rccbBrand", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select RCCB brand" />
                </SelectTrigger>
                <SelectContent>
                  {RCCB_BRAND_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Antenna and Hardware */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Antenna and Hardware</CardTitle>
            <CardDescription>Antenna configuration and hardware serial numbers</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="antennaTypeQty">Antenna Type / QTY</Label>
              <Input
                id="antennaTypeQty"
                value={formData.antennaTypeQty}
                onChange={(e) => updateFormData("antennaTypeQty", e.target.value)}
                placeholder="Omni 2x"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="antennaSupplier">Antenna Supplier</Label>
              <Select
                value={formData.antennaSupplier}
                onValueChange={(value) => updateFormData("antennaSupplier", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {ANTENNA_SUPPLIER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumberVA">Serial Number VA</Label>
              <Input
                id="serialNumberVA"
                value={formData.serialNumberVA}
                onChange={(e) => updateFormData("serialNumberVA", e.target.value)}
                placeholder="VA2024001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enclosureSn">Enclosure S/N</Label>
              <Input
                id="enclosureSn"
                value={formData.enclosureSn}
                onChange={(e) => updateFormData("enclosureSn", e.target.value)}
                placeholder="ENC001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumberRouter">Serial Number Router</Label>
              <Input
                id="serialNumberRouter"
                value={formData.serialNumberRouter}
                onChange={(e) => updateFormData("serialNumberRouter", e.target.value)}
                placeholder="RTR001"
              />
            </div>
          </CardContent>
        </Card>

        {/* Installation Details */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Installation Details</CardTitle>
            <CardDescription>Installation method and contractor information</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="methodOfInstallation">Method Of Installation</Label>
              <Select
                value={formData.methodOfInstallation}
                onValueChange={(value) => updateFormData("methodOfInstallation", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select installation method" />
                </SelectTrigger>
                <SelectContent>
                  {METHOD_OF_INSTALLATION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeOfEnclosure">Type Of Enclosure</Label>
              <Select
                value={formData.typeOfEnclosure}
                onValueChange={(value) => updateFormData("typeOfEnclosure", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select enclosure type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OF_ENCLOSURE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enclosureInstalledBy">Enclosure Installed By</Label>
              <Select
                value={formData.enclosureInstalledBy}
                onValueChange={(value) => updateFormData("enclosureInstalledBy", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select installer" />
                </SelectTrigger>
                <SelectContent>
                  {ENCLOSURE_INSTALLED_BY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="installerTeam">Installer Team</Label>
              <Select value={formData.installerTeam} onValueChange={(value) => updateFormData("installerTeam", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select installer team" />
                </SelectTrigger>
                <SelectContent>
                  {INSTALLER_TEAM_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tnbContractNo">TNB Contract No</Label>
              <Select value={formData.tnbContractNo} onValueChange={(value) => updateFormData("tnbContractNo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contract number" />
                </SelectTrigger>
                <SelectContent>
                  {TNB_CONTRACT_NO_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Relocation and Connectivity */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Relocation and Connectivity</CardTitle>
            <CardDescription>Relocation details and connectivity configuration</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="relocatedSnEnclosure">Relocated SN Enclosure</Label>
              <Input
                id="relocatedSnEnclosure"
                value={formData.relocatedSnEnclosure}
                onChange={(e) => updateFormData("relocatedSnEnclosure", e.target.value)}
                placeholder="ENC001-R"
              />
            </div>

            <div className="space-y-2">
              <Label>Relocated Enclosure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !relocatedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {relocatedDate ? format(relocatedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={relocatedDate} onSelect={setRelocatedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="connectivityType">Connectivity Type</Label>
              <Select
                value={formData.connectivityType}
                onValueChange={(value) => updateFormData("connectivityType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select connectivity type" />
                </SelectTrigger>
                <SelectContent>
                  {CONNECTIVITY_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakerType">Breaker Type</Label>
              <Select value={formData.breakerType} onValueChange={(value) => updateFormData("breakerType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select breaker type" />
                </SelectTrigger>
                <SelectContent>
                  {BREAKER_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add record status field after the Relocation and Connectivity card */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Record Status</CardTitle>
            <CardDescription>Current status of this device record</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recordStatus">Record Status</Label>
              <Select value={formData.recordStatus} onValueChange={(value) => updateFormData("recordStatus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select record status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add audit information display in editing mode */}
        {isEditing && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Audit Information</CardTitle>
              <CardDescription>Record creation and modification details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Created By</Label>
                <Input value={formData.createdBy || "N/A"} disabled />
              </div>
              <div className="space-y-2">
                <Label>Created At</Label>
                <Input value={formData.createdAt ? new Date(formData.createdAt).toLocaleString() : "N/A"} disabled />
              </div>
              <div className="space-y-2">
                <Label>Last Updated By</Label>
                <Input value={formData.lastUpdatedBy || "N/A"} disabled />
              </div>
              <div className="space-y-2">
                <Label>Last Updated At</Label>
                <Input value={formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : "N/A"} disabled />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Device"
          ) : (
            "Add Device"
          )}
        </Button>
      </div>
    </form>
  )
}
