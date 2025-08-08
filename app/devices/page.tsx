"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Upload, Download, Edit, Trash2 } from "lucide-react"
import { mockDevices, type Device } from "@/lib/device-data"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserMenu } from "@/components/user-menu"
import Link from "next/link"

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices)
  const [searchTerm, setSearchTerm] = useState("")
  const [clientFilter, setClientFilter] = useState("all")
  const [connectivityFilter, setConnectivityFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch =
        device.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.serialNumberVA?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.serialNumberRouter?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesClient = clientFilter === "all" || device.client === clientFilter
      const matchesConnectivity = connectivityFilter === "all" || device.connectivityType === connectivityFilter

      return matchesSearch && matchesClient && matchesConnectivity
    })
  }, [devices, searchTerm, clientFilter, connectivityFilter])

  const paginatedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredDevices.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredDevices, currentPage])

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage)

  const handleDeleteDevice = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id))
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Device Information</h1>
        </div>
        <div className="ml-auto">
          <UserMenu />
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">Manage network hardware and configuration details</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Button asChild>
              <Link href="/devices/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Devices Overview</CardTitle>
            <CardDescription>
              Total: {devices.length} devices | Filtered: {filteredDevices.length} devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by site name, client, or serial numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="TNB">TNB</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
              <Select value={connectivityFilter} onValueChange={setConnectivityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Connectivity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Wired">Wired</SelectItem>
                  <SelectItem value="Cellular">Cellular</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Site Running #</TableHead>
                    <TableHead>Site Name</TableHead>
                    <TableHead>Serial Number VA</TableHead>
                    <TableHead>Router S/N</TableHead>
                    <TableHead>Connectivity</TableHead>
                    <TableHead>PSU Type</TableHead>
                    <TableHead>Battery/DC</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <Badge variant={device.client === "TNB" ? "default" : "secondary"}>{device.client}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">#{device.siteRunningNumber || "-"}</TableCell>
                      <TableCell className="font-medium">{device.siteName}</TableCell>
                      <TableCell className="font-mono text-sm">{device.serialNumberVA || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">{device.serialNumberRouter || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{device.connectivityType || "-"}</Badge>
                      </TableCell>
                      <TableCell>{device.psuType || "-"}</TableCell>
                      <TableCell>{device.batteryDc || "-"}</TableCell>
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredDevices.length)} of {filteredDevices.length} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
