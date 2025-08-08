"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Upload, Download, Edit, Trash2 } from "lucide-react"
import { BulkImport } from "@/components/bulk-import"
import { apiService, type Site } from "@/lib/api"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserMenu } from "@/components/user-menu"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [clientFilter, setClientFilter] = useState("all")
  const [stateFilter, setStateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Start with false to prevent hydration issues
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const itemsPerPage = 10

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const matchesSearch =
        site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.runningNumber.toString().includes(searchTerm) ||
        site.flNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.circuitId?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesClient = clientFilter === "all" || site.client === clientFilter
      const matchesState = stateFilter === "all" || site.state === stateFilter
      const matchesStatus = statusFilter === "all" || site.status === statusFilter

      return matchesSearch && matchesClient && matchesState && matchesStatus
    })
  }, [sites, searchTerm, clientFilter, stateFilter, statusFilter])

  const paginatedSites = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredSites.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredSites, currentPage])

  const totalPages = Math.ceil(filteredSites.length / itemsPerPage)

  // Load sites from API
  useEffect(() => {
    loadSites()
  }, []) // Empty dependency array to run only once

  const loadSites = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.getSites()
      setSites(response.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sites')
      toast({
        title: "Error",
        description: "Failed to load sites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSite = async (runningNumber: number) => {
    try {
      await apiService.deleteSite(runningNumber)
      setSites(sites.filter((site) => site.runningNumber !== runningNumber))
      toast({
        title: "Success",
        description: "Site deleted successfully!",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete site. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkImport = async (importedSites: Omit<Site, "runningNumber">[]) => {
    try {
      setIsLoading(true)
      
      // Create sites one by one
      for (const siteData of importedSites) {
        await apiService.createSite(siteData)
      }
      
      toast({
        title: "Success",
        description: `Successfully imported ${importedSites.length} sites.`,
      })
      
      // Reload sites
      await loadSites()
      setIsBulkImportOpen(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to import sites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Running Number",
      "Client",
      "Site Name",
      "Old PE Name",
      "FL Number",
      "Priority Status",
      "Project Owner",
      "State",
      "Subzone",
      "Station Category",
      "Monitoring Type",
      "Gateway",
      "Circuit ID",
      "CAASDU",
      "Protocol",
      "1st IOA",
      "Last IOA",
      "Template",
      "Installation Date",
      "Sim Card Termination Activity",
      "Status",
      "RTU Status",
      "Phase",
      "Site Status",
      "Loopback IP",
      "APN 1",
      "APN 2",
      "Pricing",
      "Region",
      "Contract No",
      "GPS Lat",
      "GPS Long",
    ]

    const csvContent = [
      headers.join(","),
      ...sites.map((site) =>
        [
          site.runningNumber,
          site.client,
          `"${site.siteName}"`,
          `"${site.oldPeName || ""}"`,
          `"${site.flNumber || ""}"`,
          site.priorityStatus,
          site.projectOwner || "",
          site.state,
          `"${site.subzone || ""}"`,
          site.stationCategory,
          site.monitoringType,
          site.gateway || "",
          `"${site.circuitId || ""}"`,
          `"${site.caasdu || ""}"`,
          site.protocol || "",
          site.firstIoa || "",
          site.lastIoa || "",
          site.template || "",
          site.installationDate || "",
          site.simCardTerminationActivity || "",
          site.status,
          site.rtuStatus,
          site.phase || "",
          site.siteStatus,
          `"${site.loopbackIp || ""}"`,
          site.apn1 || "",
          site.apn2 || "",
          site.pricing || "",
          site.region || "",
          site.contractNo || "",
          site.gpsLat || "",
          site.gpsLong || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sites-export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Show loading state only after component has mounted
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Site Information</h1>
          </div>
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading sites...</p>
          </div>
        </div>
      </div>
    )
  }

  if (mounted && error) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Site Information</h1>
          </div>
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadSites}>Retry</Button>
          </div>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Site Information</h1>
          </div>
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Site Information</h1>
        </div>
        <div className="ml-auto">
          <UserMenu />
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">Manage network site locations and infrastructure</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Import Sites</DialogTitle>
                  <DialogDescription>Upload a CSV file to import multiple sites at once</DialogDescription>
                </DialogHeader>
                <BulkImport onImport={handleBulkImport} />
              </DialogContent>
            </Dialog>
            <Button asChild>
              <Link href="/sites/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sites Overview</CardTitle>
            <CardDescription>
              Total: {sites.length} sites | Filtered: {filteredSites.length} sites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by site name, running number, FL number, or circuit ID..."
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
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="SELANGOR">SELANGOR</SelectItem>
                  <SelectItem value="JOHOR">JOHOR</SelectItem>
                  <SelectItem value="PERAK">PERAK</SelectItem>
                  <SelectItem value="PAHANG">PAHANG</SelectItem>
                  <SelectItem value="KEDAH">KEDAH</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="O&M-Live">O&M-Live</SelectItem>
                  <SelectItem value="Pre-Production">Pre-Production</SelectItem>
                  <SelectItem value="DEC O&M-Live">DEC O&M-Live</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Running #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Site Name</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Station Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Site Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSites.map((site) => (
                    <TableRow key={site.runningNumber}>
                      <TableCell className="font-medium">{site.runningNumber}</TableCell>
                      <TableCell>
                        <Badge variant={site.client === "TNB" ? "default" : "secondary"}>{site.client}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{site.siteName}</TableCell>
                      <TableCell>{site.state}</TableCell>
                      <TableCell>{site.stationCategory}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            site.status === "Production"
                              ? "default"
                              : site.status === "O&M-Live"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {site.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            site.siteStatus === "Active"
                              ? "default"
                              : site.siteStatus === "Relocated"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {site.siteStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/sites/${site.runningNumber}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteSite(site.runningNumber)}>
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
                  {Math.min(currentPage * itemsPerPage, filteredSites.length)} of {filteredSites.length} results
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
