"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DeviceForm } from "@/components/device-form"
import type { Device } from "@/lib/device-data"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserMenu } from "@/components/user-menu"

export default function NewDevicePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (deviceData: Omit<Device, "id">) => {
    setIsSubmitting(true)

    try {
      // Simulate API call - in real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("New device data:", deviceData)

      // Redirect back to devices list
      router.push("/devices")
    } catch (error) {
      console.error("Error creating device:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <h1 className="text-lg font-semibold">Add New Device</h1>
          </div>
        </div>
        <div className="ml-auto">
          <UserMenu />
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <p className="text-muted-foreground">Create a new device record for TNB network infrastructure</p>
        </div>

        <DeviceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
