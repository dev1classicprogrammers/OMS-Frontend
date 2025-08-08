"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SiteForm } from "@/components/site-form"
import { apiService, type Site } from "@/lib/api"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserMenu } from "@/components/user-menu"
import { useToast } from "@/hooks/use-toast"

export default function NewSitePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (siteData: Omit<Site, "runningNumber" | "id">) => {
    setIsSubmitting(true)

    try {
      await apiService.createSite(siteData)
      
      toast({
        title: "Success",
        description: "Site created successfully!",
      })
      
      // Redirect back to sites list
      router.push("/")
    } catch (error) {
      console.error("Error creating site:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create site",
        variant: "destructive",
      })
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
            <Link href="/sites">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sites
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Add New Site</h1>
          </div>
        </div>
        <div className="ml-auto">
          <UserMenu />
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <p className="text-muted-foreground">Create a new site in the TNB network operations system</p>
        </div>

        <SiteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
