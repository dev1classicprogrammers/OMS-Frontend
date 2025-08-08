"use client"

import React, { useState } from "react"
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
import type { Site } from "@/lib/api"
import {
  CLIENT_OPTIONS,
  PRIORITY_STATUS_OPTIONS,
  PROJECT_OWNER_OPTIONS,
  STATE_OPTIONS,
  STATION_CATEGORY_OPTIONS,
  MONITORING_TYPE_OPTIONS,
  GATEWAY_OPTIONS,
  PROTOCOL_OPTIONS,
  TEMPLATE_OPTIONS,
  STATUS_OPTIONS,
  RTU_STATUS_OPTIONS,
  PHASE_OPTIONS,
  SITE_STATUS_OPTIONS,
  APN_OPTIONS,
  REGION_OPTIONS,
} from "@/lib/constants"

interface SiteFormProps {
  initialData?: Site
  onSubmit: (data: Omit<Site, "runningNumber" | "id">) => void
  isEditing?: boolean
  isSubmitting?: boolean
}

export function SiteForm({ initialData, onSubmit, isEditing = false, isSubmitting = false }: SiteFormProps) {
  const [formData, setFormData] = useState<Omit<Site, "runningNumber" | "id">>({
    client: initialData?.client || "",
    siteName: initialData?.siteName || "",
    oldPeName: initialData?.oldPeName || "",
    flNumber: initialData?.flNumber || "",
    priorityStatus: initialData?.priorityStatus || "",
    projectOwner: initialData?.projectOwner || "",
    state: initialData?.state || "",
    subzone: initialData?.subzone || "",
    stationCategory: initialData?.stationCategory || "",
    monitoringType: initialData?.monitoringType || "",
    gateway: initialData?.gateway || "",
    circuitId: initialData?.circuitId || "",
    caasdu: initialData?.caasdu || "",
    protocol: initialData?.protocol || "",
    firstIoa: initialData?.firstIoa || "",
    lastIoa: initialData?.lastIoa || "",
    template: initialData?.template || "",
    installationDate: initialData?.installationDate || "",
    simCardTerminationActivity: initialData?.simCardTerminationActivity || "",
    status: initialData?.status || "",
    rtuStatus: initialData?.rtuStatus || "",
    phase: initialData?.phase || "",
    siteStatus: initialData?.siteStatus || "",
    loopbackIp: initialData?.loopbackIp || "",
    apn1: initialData?.apn1 || "",
    apn2: initialData?.apn2 || "",
    pricing: initialData?.pricing || undefined,
    region: initialData?.region || "",
    contractNo: initialData?.contractNo || "",
    gpsLat: initialData?.gpsLat || undefined,
    gpsLong: initialData?.gpsLong || undefined,
    createdBy: initialData?.createdBy || "",
    lastUpdatedBy: initialData?.lastUpdatedBy || "",
    recordStatus: initialData?.recordStatus || "Active",
    createdAt: initialData?.createdAt || "",
    updatedAt: initialData?.updatedAt || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [installationDate, setInstallationDate] = useState<Date | null>(
    initialData?.installationDate ? new Date(initialData.installationDate) : null,
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // ALL fields are required
    if (!formData.client) newErrors.client = "Client is required"
    if (!formData.siteName.trim()) newErrors.siteName = "Site Name is required"
    if (!formData.oldPeName) newErrors.oldPeName = "Old PE Name is required"
    if (!formData.flNumber) newErrors.flNumber = "FL Number is required"
    if (!formData.priorityStatus) newErrors.priorityStatus = "Priority Status is required"
    if (!formData.projectOwner) newErrors.projectOwner = "Project Owner is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.subzone) newErrors.subzone = "Subzone is required"
    if (!formData.stationCategory) newErrors.stationCategory = "Station Category is required"
    if (!formData.monitoringType) newErrors.monitoringType = "Monitoring Type is required"
    if (!formData.gateway) newErrors.gateway = "Gateway is required"
    if (!formData.circuitId) newErrors.circuitId = "Circuit ID is required"
    if (!formData.caasdu) newErrors.caasdu = "CAASDU is required"
    if (!formData.protocol) newErrors.protocol = "Protocol is required"
    if (!formData.firstIoa) newErrors.firstIoa = "First IOA is required"
    if (!formData.lastIoa) newErrors.lastIoa = "Last IOA is required"
    if (!formData.template) newErrors.template = "Template is required"
    if (!installationDate) newErrors.installationDate = "Installation Date is required"
    if (!formData.simCardTerminationActivity) newErrors.simCardTerminationActivity = "SIM Card Termination Activity is required"
    if (!formData.status) newErrors.status = "Status is required"
    if (!formData.rtuStatus) newErrors.rtuStatus = "RTU Status is required"
    if (!formData.phase) newErrors.phase = "Phase is required"
    if (!formData.siteStatus) newErrors.siteStatus = "Site Status is required"
    if (!formData.loopbackIp) newErrors.loopbackIp = "Loopback IP is required"
    if (!formData.apn1) newErrors.apn1 = "APN1 is required"
    if (!formData.apn2) newErrors.apn2 = "APN2 is required"
    if (!formData.pricing) newErrors.pricing = "Pricing is required"
    if (!formData.region) newErrors.region = "Region is required"
    if (!formData.contractNo) newErrors.contractNo = "Contract No is required"
    if (!formData.gpsLat) newErrors.gpsLat = "GPS Latitude is required"
    if (!formData.gpsLong) newErrors.gpsLong = "GPS Longitude is required"
    if (!formData.createdBy) newErrors.createdBy = "Created By is required"
    if (!formData.lastUpdatedBy) newErrors.lastUpdatedBy = "Last Updated By is required"
    if (!formData.recordStatus) newErrors.recordStatus = "Record Status is required"

    // Number validation
    if (formData.pricing && (isNaN(formData.pricing) || formData.pricing < 0)) {
      newErrors.pricing = "Pricing must be a valid positive number"
    }
    if (formData.gpsLat && (isNaN(formData.gpsLat) || formData.gpsLat < -90 || formData.gpsLat > 90)) {
      newErrors.gpsLat = "GPS Latitude must be between -90 and 90"
    }
    if (formData.gpsLong && (isNaN(formData.gpsLong) || formData.gpsLong < -180 || formData.gpsLong > 180)) {
      newErrors.gpsLong = "GPS Longitude must be between -180 and 180"
    }

    // IP address validation
    if (formData.loopbackIp && !/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.loopbackIp)) {
      newErrors.loopbackIp = "Invalid IP address format"
    }

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
        installationDate: installationDate ? format(installationDate, "yyyy-MM-dd") : null,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Primary site identification details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isEditing && (
              <div className="space-y-2">
                <Label>Running Number</Label>
                <Input value={initialData?.runningNumber || ""} disabled />
                <p className="text-xs text-muted-foreground">Auto-generated, cannot be edited</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select value={formData.client} onValueChange={(value) => updateFormData("client", value)}>
                <SelectTrigger className={errors.client ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.client && <p className="text-xs text-red-500">{errors.client}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name *</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => updateFormData("siteName", e.target.value)}
                className={errors.siteName ? "border-red-500" : ""}
              />
              {errors.siteName && <p className="text-xs text-red-500">{errors.siteName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldPeName">Old PE Name (Relocated) *</Label>
              <Input
                id="oldPeName"
                value={formData.oldPeName}
                onChange={(e) => updateFormData("oldPeName", e.target.value)}
                className={errors.oldPeName ? "border-red-500" : ""}
              />
              {errors.oldPeName && <p className="text-xs text-red-500">{errors.oldPeName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="flNumber">FL Number *</Label>
              <Input
                id="flNumber"
                value={formData.flNumber}
                onChange={(e) => updateFormData("flNumber", e.target.value)}
                className={errors.flNumber ? "border-red-500" : ""}
              />
              {errors.flNumber && <p className="text-xs text-red-500">{errors.flNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priorityStatus">Priority Status *</Label>
              <Select
                value={formData.priorityStatus}
                onValueChange={(value) => updateFormData("priorityStatus", value)}
              >
                <SelectTrigger className={errors.priorityStatus ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select priority status" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priorityStatus && <p className="text-xs text-red-500">{errors.priorityStatus}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectOwner">Project Owner *</Label>
              <Select value={formData.projectOwner} onValueChange={(value) => updateFormData("projectOwner", value)}>
                <SelectTrigger className={errors.projectOwner ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select project owner" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_OWNER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectOwner && <p className="text-xs text-red-500">{errors.projectOwner}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
            <CardDescription>Geographic and regional details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {STATE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subzone">Subzone *</Label>
              <Input
                id="subzone"
                value={formData.subzone}
                onChange={(e) => updateFormData("subzone", e.target.value)}
                className={errors.subzone ? "border-red-500" : ""}
              />
              {errors.subzone && <p className="text-xs text-red-500">{errors.subzone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select value={formData.region} onValueChange={(value) => updateFormData("region", value)}>
                <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-xs text-red-500">{errors.region}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpsLat">GPS Latitude *</Label>
              <Input
                id="gpsLat"
                type="number"
                step="any"
                value={formData.gpsLat || ""}
                onChange={(e) =>
                  updateFormData("gpsLat", e.target.value ? Number.parseFloat(e.target.value) : undefined)
                }
                className={errors.gpsLat ? "border-red-500" : ""}
              />
              {errors.gpsLat && <p className="text-xs text-red-500">{errors.gpsLat}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpsLong">GPS Longitude *</Label>
              <Input
                id="gpsLong"
                type="number"
                step="any"
                value={formData.gpsLong || ""}
                onChange={(e) =>
                  updateFormData("gpsLong", e.target.value ? Number.parseFloat(e.target.value) : undefined)
                }
                className={errors.gpsLong ? "border-red-500" : ""}
              />
              {errors.gpsLong && <p className="text-xs text-red-500">{errors.gpsLong}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Technical Configuration */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Technical Configuration</CardTitle>
            <CardDescription>Station and monitoring setup</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stationCategory">Station Category *</Label>
              <Select
                value={formData.stationCategory}
                onValueChange={(value) => updateFormData("stationCategory", value)}
              >
                <SelectTrigger className={errors.stationCategory ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select station category" />
                </SelectTrigger>
                <SelectContent>
                  {STATION_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stationCategory && <p className="text-xs text-red-500">{errors.stationCategory}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monitoringType">Monitoring Type *</Label>
              <Select
                value={formData.monitoringType}
                onValueChange={(value) => updateFormData("monitoringType", value)}
              >
                <SelectTrigger className={errors.monitoringType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select monitoring type" />
                </SelectTrigger>
                <SelectContent>
                  {MONITORING_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.monitoringType && <p className="text-xs text-red-500">{errors.monitoringType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gateway">Gateway *</Label>
              <Select value={formData.gateway} onValueChange={(value) => updateFormData("gateway", value)}>
                <SelectTrigger className={errors.gateway ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select gateway" />
                </SelectTrigger>
                <SelectContent>
                  {GATEWAY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gateway && <p className="text-xs text-red-500">{errors.gateway}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="circuitId">Circuit ID *</Label>
              <Input
                id="circuitId"
                value={formData.circuitId}
                onChange={(e) => updateFormData("circuitId", e.target.value)}
                className={errors.circuitId ? "border-red-500" : ""}
              />
              {errors.circuitId && <p className="text-xs text-red-500">{errors.circuitId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="caasdu">CAASDU *</Label>
              <Input 
                id="caasdu" 
                value={formData.caasdu} 
                onChange={(e) => updateFormData("caasdu", e.target.value)}
                className={errors.caasdu ? "border-red-500" : ""}
              />
              {errors.caasdu && <p className="text-xs text-red-500">{errors.caasdu}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="protocol">Protocol *</Label>
              <Select value={formData.protocol} onValueChange={(value) => updateFormData("protocol", value)}>
                <SelectTrigger className={errors.protocol ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  {PROTOCOL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.protocol && <p className="text-xs text-red-500">{errors.protocol}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstIoa">1st IOA *</Label>
              <Input
                id="firstIoa"
                value={formData.firstIoa}
                onChange={(e) => updateFormData("firstIoa", e.target.value)}
                className={errors.firstIoa ? "border-red-500" : ""}
              />
              {errors.firstIoa && <p className="text-xs text-red-500">{errors.firstIoa}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastIoa">Last IOA *</Label>
              <Input
                id="lastIoa"
                value={formData.lastIoa}
                onChange={(e) => updateFormData("lastIoa", e.target.value)}
                className={errors.lastIoa ? "border-red-500" : ""}
              />
              {errors.lastIoa && <p className="text-xs text-red-500">{errors.lastIoa}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Template *</Label>
              <Select value={formData.template} onValueChange={(value) => updateFormData("template", value)}>
                <SelectTrigger className={errors.template ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.template && <p className="text-xs text-red-500">{errors.template}</p>}
            </div>

            <div className="space-y-2">
              <Label>Installation Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !installationDate && "text-muted-foreground",
                      errors.installationDate ? "border-red-500" : ""
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {installationDate ? format(installationDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={installationDate} onSelect={setInstallationDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.installationDate && <p className="text-xs text-red-500">{errors.installationDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="loopbackIp">Loopback IP *</Label>
              <Input
                id="loopbackIp"
                value={formData.loopbackIp}
                onChange={(e) => updateFormData("loopbackIp", e.target.value)}
                placeholder="192.168.1.1"
                className={errors.loopbackIp ? "border-red-500" : ""}
              />
              {errors.loopbackIp && <p className="text-xs text-red-500">{errors.loopbackIp}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Status and Operations */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Status and Operations</CardTitle>
            <CardDescription>Operational status and phase information</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => updateFormData("status", value)}>
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rtuStatus">RTU Status *</Label>
              <Select value={formData.rtuStatus} onValueChange={(value) => updateFormData("rtuStatus", value)}>
                <SelectTrigger className={errors.rtuStatus ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select RTU status" />
                </SelectTrigger>
                <SelectContent>
                  {RTU_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rtuStatus && <p className="text-xs text-red-500">{errors.rtuStatus}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteStatus">Site Status *</Label>
              <Select value={formData.siteStatus} onValueChange={(value) => updateFormData("siteStatus", value)}>
                <SelectTrigger className={errors.siteStatus ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select site status" />
                </SelectTrigger>
                <SelectContent>
                  {SITE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.siteStatus && <p className="text-xs text-red-500">{errors.siteStatus}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phase">Phase *</Label>
              <Select value={formData.phase} onValueChange={(value) => updateFormData("phase", value)}>
                <SelectTrigger className={errors.phase ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  {PHASE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.phase && <p className="text-xs text-red-500">{errors.phase}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="simCardTerminationActivity">Sim Card Termination Activity *</Label>
              <Input
                id="simCardTerminationActivity"
                value={formData.simCardTerminationActivity}
                onChange={(e) => updateFormData("simCardTerminationActivity", e.target.value)}
                className={errors.simCardTerminationActivity ? "border-red-500" : ""}
              />
              {errors.simCardTerminationActivity && <p className="text-xs text-red-500">{errors.simCardTerminationActivity}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordStatus">Record Status *</Label>
              <Select value={formData.recordStatus} onValueChange={(value) => updateFormData("recordStatus", value)}>
                <SelectTrigger className={errors.recordStatus ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select record status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.recordStatus && <p className="text-xs text-red-500">{errors.recordStatus}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Network and Contract */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Network and Contract</CardTitle>
            <CardDescription>Network configuration and contract details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apn1">APN 1 *</Label>
              <Select value={formData.apn1} onValueChange={(value) => updateFormData("apn1", value)}>
                <SelectTrigger className={errors.apn1 ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select APN 1" />
                </SelectTrigger>
                <SelectContent>
                  {APN_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.apn1 && <p className="text-xs text-red-500">{errors.apn1}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apn2">APN 2 *</Label>
              <Select value={formData.apn2} onValueChange={(value) => updateFormData("apn2", value)}>
                <SelectTrigger className={errors.apn2 ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select APN 2" />
                </SelectTrigger>
                <SelectContent>
                  {APN_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.apn2 && <p className="text-xs text-red-500">{errors.apn2}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricing">Pricing *</Label>
              <Input
                id="pricing"
                type="number"
                step="0.01"
                value={formData.pricing || ""}
                onChange={(e) =>
                  updateFormData("pricing", e.target.value ? Number.parseFloat(e.target.value) : undefined)
                }
                className={errors.pricing ? "border-red-500" : ""}
              />
              {errors.pricing && <p className="text-xs text-red-500">{errors.pricing}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractNo">Contract No *</Label>
              <Input
                id="contractNo"
                value={formData.contractNo}
                onChange={(e) => updateFormData("contractNo", e.target.value)}
                className={errors.contractNo ? "border-red-500" : ""}
              />
              {errors.contractNo && <p className="text-xs text-red-500">{errors.contractNo}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
      {isEditing && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Audit Information</CardTitle>
            <CardDescription>Record creation and modification details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Created By *</Label>
              <Input 
                value={formData.createdBy || ""} 
                onChange={(e) => updateFormData("createdBy", e.target.value)}
                className={errors.createdBy ? "border-red-500" : ""}
              />
              {errors.createdBy && <p className="text-xs text-red-500">{errors.createdBy}</p>}
            </div>
            <div className="space-y-2">
              <Label>Last Updated By *</Label>
              <Input 
                value={formData.lastUpdatedBy || ""} 
                onChange={(e) => updateFormData("lastUpdatedBy", e.target.value)}
                className={errors.lastUpdatedBy ? "border-red-500" : ""}
              />
              {errors.lastUpdatedBy && <p className="text-xs text-red-500">{errors.lastUpdatedBy}</p>}
            </div>
            <div className="space-y-2">
              <Label>Created At</Label>
              <Input value={formData.createdAt ? new Date(formData.createdAt).toLocaleString() : "N/A"} disabled />
            </div>
            <div className="space-y-2">
              <Label>Last Updated At</Label>
              <Input value={formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : "N/A"} disabled />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Site"
          ) : (
            "Add Site"
          )}
        </Button>
      </div>
    </form>
  )
}
