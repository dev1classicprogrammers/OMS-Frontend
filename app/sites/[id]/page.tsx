"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, MapPin, Settings, Network, FileText } from "lucide-react"
import Link from "next/link"
import { SiteForm } from "@/components/site-form"
import { apiService, type Site } from "@/lib/api"
import { DevicesList } from "@/components/devices-list"
import { useToast } from "@/hooks/use-toast"

export default function SiteDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [site, setSite] = useState<Site | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Start with false to prevent hydration issues
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Fetch site data from API
    const fetchSite = async () => {
      setIsLoading(true)
      try {
        const siteId = Number(params.id)
        const siteData = await apiService.getSite(siteId)
        setSite(siteData)
      } catch (error) {
        console.error("Error fetching site:", error)
        toast({
          title: "Error",
          description: "Failed to load site details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchSite()
    }
  }, [params.id, toast])

  const handleEdit = async (siteData: Omit<Site, "runningNumber">) => {
    setIsSubmitting(true)

    try {
      if (site) {
        const updatedSite = await apiService.updateSite(site.runningNumber, siteData)
        setSite(updatedSite)
        setIsEditing(false)
        
        toast({
          title: "Success",
          description: "Site updated successfully!",
        })
      }
    } catch (error) {
      console.error("Error updating site:", error)
      toast({
        title: "Error",
        description: "Failed to update site",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!site || !confirm("Are you sure you want to delete this site?")) return

    try {
      await apiService.deleteSite(site.runningNumber)
      
      toast({
        title: "Success",
        description: "Site deleted successfully!",
      })
      
      router.push("/")
    } catch (error) {
      console.error("Error deleting site:", error)
      toast({
        title: "Error",
        description: "Failed to delete site",
        variant: "destructive",
      })
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading site details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (mounted && !site) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sites
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Site Not Found</h2>
              <p className="text-muted-foreground mb-4">The requested site could not be found.</p>
              <Button asChild>
                <Link href="/">Return to Sites List</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel Edit
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Site #{site.runningNumber}</h1>
            <p className="text-muted-foreground">Update site information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Site Information</CardTitle>
            <CardDescription>Update the site details. Fields marked with * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <SiteForm initialData={site} onSubmit={handleEdit} isEditing={true} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sites
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Site #{site.runningNumber}</h1>
            <p className="text-muted-foreground">{site.siteName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Site
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Overview */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Client</p>
                <Badge variant={site.client === "TNB" ? "default" : "secondary"}>{site.client}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge
                  variant={
                    site.status === "Production" ? "default" : site.status === "O&M-Live" ? "secondary" : "outline"
                  }
                >
                  {site.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">RTU Status</p>
                <Badge variant={site.rtuStatus === "Commissioned" ? "default" : "secondary"}>{site.rtuStatus}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Site Status</p>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add audit information display in the site details view */}
        {/* Add this after the Status Overview card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Record Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Record Status</p>
              <Badge variant={site.recordStatus === "Active" ? "default" : "secondary"}>{site.recordStatus}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Created By</p>
              <p className="text-sm">{site.createdBy || "N/A"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{site.createdAt ? new Date(site.createdAt).toLocaleString() : "N/A"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Last Updated By</p>
              <p className="text-sm">{site.lastUpdatedBy || "N/A"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Last Updated At</p>
              <p className="text-sm">{site.updatedAt ? new Date(site.updatedAt).toLocaleString() : "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Site Name</p>
              <p className="font-medium">{site.siteName}</p>
            </div>
            {site.oldPeName && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Old PE Name</p>
                <p>{site.oldPeName}</p>
              </div>
            )}
            {site.flNumber && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">FL Number</p>
                <p>{site.flNumber}</p>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Priority Status</p>
              <Badge variant="outline">{site.priorityStatus}</Badge>
            </div>
            {site.projectOwner && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Project Owner</p>
                <p>{site.projectOwner}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">State</p>
              <p className="font-medium">{site.state}</p>
            </div>
            {site.subzone && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Subzone</p>
                <p>{site.subzone}</p>
              </div>
            )}
            {site.region && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Region</p>
                <p>{site.region}</p>
              </div>
            )}
            {(site.gpsLat || site.gpsLong) && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">GPS Coordinates</p>
                <p className="text-sm font-mono">
                  {site.gpsLat && `Lat: ${site.gpsLat}`}
                  {site.gpsLat && site.gpsLong && ", "}
                  {site.gpsLong && `Long: ${site.gpsLong}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Technical Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Station Category</p>
              <Badge variant="outline">{site.stationCategory}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Monitoring Type</p>
              <Badge variant="outline">{site.monitoringType}</Badge>
            </div>
            {site.gateway && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Gateway</p>
                <p>{site.gateway}</p>
              </div>
            )}
            {site.circuitId && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Circuit ID</p>
                <p className="font-mono">{site.circuitId}</p>
              </div>
            )}
            {site.protocol && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Protocol</p>
                <p>{site.protocol}</p>
              </div>
            )}
            {(site.firstIoa || site.lastIoa) && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">IOA Range</p>
                <p className="font-mono">
                  {site.firstIoa && `${site.firstIoa}`}
                  {site.firstIoa && site.lastIoa && " - "}
                  {site.lastIoa && `${site.lastIoa}`}
                </p>
              </div>
            )}
            {site.loopbackIp && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Loopback IP</p>
                <p className="font-mono">{site.loopbackIp}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Network & Contract */}
        <Card>
          <CardHeader>
            <CardTitle>Network & Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(site.apn1 || site.apn2) && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">APN Configuration</p>
                <div className="flex gap-2">
                  {site.apn1 && <Badge variant="outline">APN1: {site.apn1}</Badge>}
                  {site.apn2 && <Badge variant="outline">APN2: {site.apn2}</Badge>}
                </div>
              </div>
            )}
            {site.pricing && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Pricing</p>
                <p className="font-medium">RM {site.pricing.toFixed(2)}</p>
              </div>
            )}
            {site.contractNo && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Contract Number</p>
                <p className="font-mono">{site.contractNo}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Operational Details */}
        <Card>
          <CardHeader>
            <CardTitle>Operational Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {site.phase && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Phase</p>
                <Badge variant="outline">{site.phase}</Badge>
              </div>
            )}
            {site.template && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Template</p>
                <p>{site.template}</p>
              </div>
            )}
            {site.installationDate && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Installation Date</p>
                <p>{new Date(site.installationDate).toLocaleDateString()}</p>
              </div>
            )}
            {site.caasdu && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">CAASDU</p>
                <p className="font-mono">{site.caasdu}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Associated Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Associated Devices
          </CardTitle>
          <CardDescription>Network devices and hardware linked to this site</CardDescription>
        </CardHeader>
        <CardContent>
          <DevicesList siteRunningNumber={site.runningNumber} />
        </CardContent>
      </Card>
    </div>
  )
}
