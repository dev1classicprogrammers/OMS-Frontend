"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, HardDrive } from "lucide-react"
import { apiService, type Device } from "@/lib/api"
import Link from "next/link"

interface DevicesListProps {
  siteRunningNumber: number
}

export function DevicesList({ siteRunningNumber }: DevicesListProps) {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(false) // Start with false to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Fetch devices for this site from API
    const fetchDevices = async () => {
      setIsLoading(true)
      try {
        const response = await apiService.getDevices({ site_running_number: siteRunningNumber.toString() })
        setDevices(response.results)
      } catch (error) {
        console.error("Error fetching devices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevices()
  }, [siteRunningNumber])

  const handleDeleteDevice = (deviceId: string) => {
    if (confirm("Are you sure you want to delete this device?")) {
      setDevices(devices.filter((device) => device.id !== deviceId))
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading devices...</p>
        </div>
      </div>
    )
  }

  if (mounted && devices.length === 0) {
    return (
      <div className="text-center py-8">
        <HardDrive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Devices Found</h3>
        <p className="text-muted-foreground mb-4">No devices are currently linked to this site.</p>
        <Button asChild>
          <Link href="/devices/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Link>
        </Button>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {devices.length} device{devices.length !== 1 ? "s" : ""} linked to this site
        </p>
        <Button size="sm" asChild>
          <Link href="/devices/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial Number VA</TableHead>
              <TableHead>Router S/N</TableHead>
              <TableHead>Connectivity</TableHead>
              <TableHead>PSU Type</TableHead>
              <TableHead>Battery/DC</TableHead>
              <TableHead>Installer Team</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-mono text-sm">{device.serialNumberVA || "-"}</TableCell>
                <TableCell className="font-mono text-sm">{device.serialNumberRouter || "-"}</TableCell>
                <TableCell>
                  {device.connectivityType ? <Badge variant="outline">{device.connectivityType}</Badge> : "-"}
                </TableCell>
                <TableCell>{device.psuType || "-"}</TableCell>
                <TableCell>{device.batteryDc || "-"}</TableCell>
                <TableCell>{device.installerTeam || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/devices/${device.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteDevice(device.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/devices">View All Devices</Link>
        </Button>
      </div>
    </div>
  )
}
