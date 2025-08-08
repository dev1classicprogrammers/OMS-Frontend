"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Download, AlertCircle, CheckCircle } from "lucide-react"
import type { Site } from "@/lib/api"

interface BulkImportProps {
  onImport: (sites: Omit<Site, "runningNumber">[]) => void
}

export function BulkImport({ onImport }: BulkImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<Omit<Site, "runningNumber">[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const downloadTemplate = () => {
    const headers = [
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

    const sampleData = [
      "TNB",
      "Sample Site 1",
      "",
      "FL001",
      "PRIMARY",
      "DA",
      "SELANGOR",
      "Zone A",
      "PE",
      "RTU",
      "CA01",
      "CID001",
      "",
      "DNP3",
      "1000",
      "1100",
      "NEW",
      "2024-01-15",
      "-",
      "Production",
      "Commissioned",
      "P1",
      "Active",
      "192.168.1.1",
      "CELCOM",
      "DIGI",
      "1500.00",
      "CENTRAL",
      "TNB-IT No. 4/2016",
      "3.1390",
      "101.6869",
    ]

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "site-import-template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const parseCSV = (csvText: string): string[][] => {
    const lines = csvText.split("\n").filter((line) => line.trim())
    return lines.map((line) => {
      const result = []
      let current = ""
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    })
  }

  const validateRow = (row: string[], rowIndex: number): string[] => {
    const rowErrors: string[] = []

    // Required fields validation (indices based on template)
    if (!row[0]?.trim()) rowErrors.push(`Row ${rowIndex + 1}: Client is required`)
    if (!row[1]?.trim()) rowErrors.push(`Row ${rowIndex + 1}: Site Name is required`)
    if (!row[4]?.trim()) rowErrors.push(`Row ${rowIndex + 1}: Priority Status is required`)
    if (!row[6]?.trim()) rowErrors.push(`Row ${rowIndex + 1}: State is required`)
    if (!row[8]?.trim()) rowErrors.push(`Row ${rowIndex + 1}: Station Category is required`)
    if (!row[9]?.trim()) rowErrors.push(`Row ${rowIndex + 1}: Monitoring Type is required`)
    if (!row[19]?.trim()) rowErrors.push(`Row ${rowIndex + 1}: Status is required`)
    if (!row[20]?.trim()) rowErrors.push(`Row ${rowIndex + 1}: RTU Status is required`)
    if (!row[22]?.trim()) rowErrors.push(`Row ${rowIndex + 1}: Site Status is required`)

    // Number validation
    if (row[26] && (isNaN(Number(row[26])) || Number(row[26]) < 0)) {
      rowErrors.push(`Row ${rowIndex + 1}: Pricing must be a valid positive number`)
    }
    if (row[29] && (isNaN(Number(row[29])) || Number(row[29]) < -90 || Number(row[29]) > 90)) {
      rowErrors.push(`Row ${rowIndex + 1}: GPS Latitude must be between -90 and 90`)
    }
    if (row[30] && (isNaN(Number(row[30])) || Number(row[30]) < -180 || Number(row[30]) > 180)) {
      rowErrors.push(`Row ${rowIndex + 1}: GPS Longitude must be between -180 and 180`)
    }

    // IP validation
    if (row[23] && !/^(\d{1,3}\.){3}\d{1,3}$/.test(row[23])) {
      rowErrors.push(`Row ${rowIndex + 1}: Invalid IP address format`)
    }

    return rowErrors
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith(".csv")) {
      setErrors(["Please select a CSV file"])
      return
    }

    setFile(selectedFile)
    setIsProcessing(true)
    setErrors([])
    setPreviewData([])

    try {
      const text = await selectedFile.text()
      const rows = parseCSV(text)

      if (rows.length < 2) {
        setErrors(["CSV file must contain at least a header row and one data row"])
        return
      }

      const headers = rows[0]
      const dataRows = rows.slice(1)
      const allErrors: string[] = []
      const validSites: Omit<Site, "runningNumber">[] = []

      dataRows.forEach((row, index) => {
        const rowErrors = validateRow(row, index)
        allErrors.push(...rowErrors)

        if (rowErrors.length === 0) {
          const site: Omit<Site, "runningNumber"> = {
            client: row[0] || "",
            siteName: row[1] || "",
            oldPeName: row[2] || "",
            flNumber: row[3] || "",
            priorityStatus: row[4] || "",
            projectOwner: row[5] || "",
            state: row[6] || "",
            subzone: row[7] || "",
            stationCategory: row[8] || "",
            monitoringType: row[9] || "",
            gateway: row[10] || "",
            circuitId: row[11] || "",
            caasdu: row[12] || "",
            protocol: row[13] || "",
            firstIoa: row[14] || "",
            lastIoa: row[15] || "",
            template: row[16] || "",
            installationDate: row[17] || "",
            simCardTerminationActivity: row[18] || "",
            status: row[19] || "",
            rtuStatus: row[20] || "",
            phase: row[21] || "",
            siteStatus: row[22] || "",
            loopbackIp: row[23] || "",
            apn1: row[24] || "",
            apn2: row[25] || "",
            pricing: row[26] ? Number.parseFloat(row[26]) : undefined,
            region: row[27] || "",
            contractNo: row[28] || "",
            gpsLat: row[29] ? Number.parseFloat(row[29]) : undefined,
            gpsLong: row[30] ? Number.parseFloat(row[30]) : undefined,
          }
          validSites.push(site)
        }
      })

      setErrors(allErrors)
      setPreviewData(validSites)
    } catch (error) {
      setErrors(["Error reading CSV file. Please check the file format."])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = () => {
    if (previewData.length > 0) {
      onImport(previewData)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Instructions</CardTitle>
          <CardDescription>Follow these steps to import sites from a CSV file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <span className="text-sm text-muted-foreground">
              Download the CSV template with sample data and required format
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csvFile">Select CSV File</Label>
            <Input id="csvFile" type="file" accept=".csv" onChange={handleFileChange} disabled={isProcessing} />
          </div>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Validation Errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.slice(0, 10).map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
                {errors.length > 10 && <li className="text-sm">... and {errors.length - 10} more errors</li>}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Preview Data ({previewData.length} valid records)
            </CardTitle>
            <CardDescription>Review the data before importing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Site Name</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Station Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Site Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 10).map((site, index) => (
                    <TableRow key={index}>
                      <TableCell>{site.client}</TableCell>
                      <TableCell>{site.siteName}</TableCell>
                      <TableCell>{site.state}</TableCell>
                      <TableCell>{site.stationCategory}</TableCell>
                      <TableCell>{site.status}</TableCell>
                      <TableCell>{site.siteStatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {previewData.length > 10 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  ... and {previewData.length - 10} more records
                </p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleImport} disabled={previewData.length === 0}>
                <Upload className="h-4 w-4 mr-2" />
                Import {previewData.length} Sites
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
