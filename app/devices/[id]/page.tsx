"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, HardDrive, Settings, Network, Zap } from "lucide-react"
import Link from "next/link"
import { DeviceForm } from "@/components/device-form"
import { mockDevices, type Device } from "@/lib/device-data"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function DeviceDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [device, setDevice] = useState<Device | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch device data
    const fetchDevice = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const deviceId = params.id as string
        const foundDevice = mockDevices.find((d) => d.id === deviceId)
        setDevice(foundDevice || null)
      } catch (error) {
        console.error("Error fetching device:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchDevice()
    }
  }, [params.id])

  const handleEdit = async (deviceData: Omit<Device, "id">) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      if (device) {
        const updatedDevice = { ...deviceData, id: device.id }
        setDevice(updatedDevice)
        setIsEditing(false)

        console.log("Updated device data:", updatedDevice)
      }
    } catch (error) {
      console.error("Error updating device:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!device || !confirm("Are you sure you want to delete this device?")) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("Deleted device:", device.id)
      router.push("/devices")
    } catch (error) {
      console.error("Error deleting device:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Device Details</h1>
          </div>
        </header>
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading device details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/devices">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Devices
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Device Not Found</h1>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Device Not Found</h2>
                <p className="text-muted-foreground mb-4">The requested device could not be found.</p>
                <Button asChild>
                  <Link href="/devices">Return to Devices List</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel Edit
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Edit Device</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="mb-6">
            <p className="text-muted-foreground">Update device information and configuration</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Edit Device Information</CardTitle>
              <CardDescription>Update the device details and configuration.</CardDescription>
            </CardHeader>
            <CardContent>
              <DeviceForm initialData={device} onSubmit={handleEdit} isEditing={true} isSubmitting={isSubmitting} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center justify-between flex-1">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/devices">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Devices
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Device Details</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Device
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Device Overview */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{device.serialNumberVA || device.serialNumberRouter || "Device"}</h2>
            <p className="text-muted-foreground">
              {device.client} - {device.siteName}
              {device.siteRunningNumber && ` (Site #${device.siteRunningNumber})`}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant={device.client === "TNB" ? "default" : "secondary"}>{device.client}</Badge>
            {device.connectivityType && <Badge variant="outline">{device.connectivityType}</Badge>}
          </div>
        </div>

        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Site Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Client</p>
              <Badge variant={device.client === "TNB" ? "default" : "secondary"}>{device.client}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Site Name</p>
              <p className="font-medium">{device.siteName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Site Running Number</p>
              <p className="font-medium">
                {device.siteRunningNumber ? (
                  <Link href={`/sites/${device.siteRunningNumber}`} className="text-blue-600 hover:underline">
                    #{device.siteRunningNumber}
                  </Link>
                ) : (
                  "-"
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Add audit information display in the device details view
        Add this after the Site Information card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Record Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Record Status</p>
              <Badge variant={device.recordStatus === "Active" ? "default" : "secondary"}>{device.recordStatus}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Created By</p>
              <p className="text-sm">{device.createdBy || "N/A"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{device.createdAt ? new Date(device.createdAt).toLocaleString() : "N/A"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Last Updated By</p>
              <p className="text-sm">{device.lastUpdatedBy || "N/A"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Last Updated At</p>
              <p className="text-sm">{device.updatedAt ? new Date(device.updatedAt).toLocaleString() : "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SIM Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                SIM Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {device.sim1IpAddress && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">SIM 1 IP Address</p>
                  <p className="font-mono">{device.sim1IpAddress}</p>
                </div>
              )}
              {device.simIccidSim1 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">SIM ICCID (SIM 1)</p>
                  <p className="font-mono text-sm">{device.simIccidSim1}</p>
                </div>
              )}
              {device.sim2IpAddress && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">SIM 2 IP Address</p>
                  <p className="font-mono">{device.sim2IpAddress}</p>
                </div>
              )}
              {device.simIccidSim2 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">SIM ICCID (SIM 2)</p>
                  <p className="font-mono text-sm">{device.simIccidSim2}</p>
                </div>
              )}
              {!device.sim1IpAddress && !device.simIccidSim1 && !device.sim2IpAddress && !device.simIccidSim2 && (
                <p className="text-muted-foreground">No SIM configuration data available</p>
              )}
            </CardContent>
          </Card>

          {/* Power and Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Power and Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {device.psuType && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">PSU Type</p>
                  <Badge variant="outline">{device.psuType}</Badge>
                </div>
              )}
              {device.batteryDc && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Battery / DC</p>
                  <p>{device.batteryDc}</p>
                </div>
              )}
              {device.batteryBrandDcConverterType && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Battery Brand / DC Converter Type</p>
                  <p>{device.batteryBrandDcConverterType}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                {device.spdBrand && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">SPD Brand</p>
                    <p className="text-sm">{device.spdBrand}</p>
                  </div>
                )}
                {device.mcbBrand && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">MCB Brand</p>
                    <p className="text-sm">{device.mcbBrand}</p>
                  </div>
                )}
                {device.rccbBrand && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">RCCB Brand</p>
                    <p className="text-sm">{device.rccbBrand}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hardware Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Hardware Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {device.serialNumberVA && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Serial Number VA</p>
                  <p className="font-mono font-medium">{device.serialNumberVA}</p>
                </div>
              )}
              {device.serialNumberRouter && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Serial Number Router</p>
                  <p className="font-mono font-medium">{device.serialNumberRouter}</p>
                </div>
              )}
              {device.enclosureSn && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Enclosure S/N</p>
                  <p className="font-mono">{device.enclosureSn}</p>
                </div>
              )}
              {device.antennaTypeQty && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Antenna Type / QTY</p>
                  <p>{device.antennaTypeQty}</p>
                </div>
              )}
              {device.antennaSupplier && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Antenna Supplier</p>
                  <p>{device.antennaSupplier}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Installation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Installation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {device.methodOfInstallation && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Method Of Installation</p>
                  <p>{device.methodOfInstallation}</p>
                </div>
              )}
              {device.typeOfEnclosure && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Type Of Enclosure</p>
                  <p>{device.typeOfEnclosure}</p>
                </div>
              )}
              {device.enclosureInstalledBy && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Enclosure Installed By</p>
                  <p>{device.enclosureInstalledBy}</p>
                </div>
              )}
              {device.installerTeam && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Installer Team</p>
                  <Badge variant="outline">{device.installerTeam}</Badge>
                </div>
              )}
              {device.tnbContractNo && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">TNB Contract No</p>
                  <p className="font-mono">{device.tnbContractNo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Relocation and Connectivity */}
        {(device.relocatedSnEnclosure ||
          device.relocatedEnclosureDate ||
          device.connectivityType ||
          device.breakerType) && (
          <Card>
            <CardHeader>
              <CardTitle>Relocation and Connectivity</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {device.relocatedSnEnclosure && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Relocated SN Enclosure</p>
                  <p className="font-mono">{device.relocatedSnEnclosure}</p>
                </div>
              )}
              {device.relocatedEnclosureDate && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Relocated Enclosure Date</p>
                  <p>{new Date(device.relocatedEnclosureDate).toLocaleDateString()}</p>
                </div>
              )}
              {device.connectivityType && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Connectivity Type</p>
                  <Badge variant="outline">{device.connectivityType}</Badge>
                </div>
              )}
              {device.breakerType && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Breaker Type</p>
                  <Badge variant="outline">{device.breakerType}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
