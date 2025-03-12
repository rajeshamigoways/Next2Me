"use client"

import type React from "react"

import { useState,useEffect } from "react"
import { Button } from "../../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card"
import { Checkbox } from "../../components/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/select"
import {Tabs, TabsList,TabsContent,TabsTrigger} from "../../components/tabs"
import { Input } from "../../components/input"
import { Label } from "../../components/label"
import { Textarea } from "../../components/textarea"
import { ImagePlus, Send } from "lucide-react"
import { NotificationPreview } from "../../components/NotificationPreview"

import { Bell, Mail, MessageSquare } from "lucide-react"

interface Client {
  _id: string;
  client_id: string;
  client_name: string;
  name: string;
  tax: string;
  company_name: string;
  tax_number: string;
  phone: string;
}
// Message templates based on notification type
const notificationTemplates = {
  message: [
    { id: "msg1", name: "Welcome Message", content: "Welcome to our platform! We're glad to have you here." },
    {
      id: "msg2",
      name: "Support Response",
      content: "Thank you for contacting our support team. We'll get back to you shortly.",
    },
  ],
  push: [
    { id: "push1", name: "New Update", content: "🎉 New features are available! Check them out now." },
    { id: "push2", name: "Reminder", content: "⏰ Don't forget about your upcoming appointment." },
  ],
  email: [
    { id: "email1", name: "Welcome Email", content: "<h1>Welcome!</h1><p>We're excited to have you join us.</p>" },
    { id: "email2", name: "Newsletter", content: "<h1>Monthly Newsletter</h1><p>Here's what's new this month...</p>" },
  ],
}

type NotificationType = "message" | "push" | "email"

export default function NotificationPage() {
  const [loading, setLoading] = useState(true);
      const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [notificationType, setNotificationType] = useState<NotificationType>("message")
  const [notificationData, setNotificationData] = useState({
    title: "",
    description: "",
    template: "",
    image: null as File | null,
  })
 useEffect(() => {
      const fetchClients = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5000/clients/`);
  
          if (!response.ok) throw new Error("Failed to fetch clients");
  
          const data = await response.json();
          setClients(data.client);
        } catch (error) {
          console.error("Error fetching clients:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchClients();
    }, []);
  
    // Update selectAll when selectedClients changes
    useEffect(() => {
      setSelectAll(clients.length > 0 && selectedClients.length === clients.length);
    }, [selectedClients, clients]);
   useEffect(() => {
        const fetchClients = async () => {
          try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/clients/`);
    
            if (!response.ok) throw new Error("Failed to fetch clients");
    
            const data = await response.json();
            setClients(data.client);
          } catch (error) {
            console.error("Error fetching clients:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchClients();
      }, []);
    
      // Update selectAll when selectedClients changes
      useEffect(() => {
        setSelectAll(clients.length > 0 && selectedClients.length === clients.length);
      }, [selectedClients, clients]);
    
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([])
    } else {
      setSelectedClients(clients.map((client) => client.id))
    }
    setSelectAll(!selectAll)
  }

  const handleClientSelect = (clientId: number) => {
    setSelectedClients((prev) => (prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNotificationData((prev) => ({ ...prev, image: file }))
    }
  }

  const handleTemplateChange = (template: string) => {
    const selectedTemplate = notificationTemplates[notificationType].find((t) => t.id === template)
    if (selectedTemplate) {
      setNotificationData((prev) => ({
        ...prev,
        template: template,
        description: selectedTemplate.content,
      }))
    }
  }

  const handleTypeChange = (type: NotificationType) => {
    setNotificationType(type)
    setNotificationData((prev) => ({
      ...prev,
      template: "",
      description: "",
    }))
  }

  const handleSendNotification = async () => {
    const notificationPayload = {
      type: notificationType,
      recipients: selectedClients,
      content: {
        title: notificationData.title,
        body: notificationData.description,
        image: notificationData.image,
      },
    }

    // Here you would implement the actual notification sending logic
    console.log("Sending notification:", notificationPayload)

    // Reset form after sending
    setNotificationData({
      title: "",
      description: "",
      template: "",
      image: null,
    })
    setSelectedClients([])
    setSelectAll(false)
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4" />
      case "push":
        return <Bell className="w-4 h-4" />
      case "email":
        return <Mail className="w-4 h-4" />
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Client List */}
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-[25px_1fr_1fr_1fr] items-center p-4 border-b">
                <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Select all clients" />
                <span className="font-medium">Name</span>
                <span className="font-medium">Phone</span>
                <span className="font-medium">Email</span>
              </div>
              {clients.map((client) => (
                <div key={client.id} className="grid grid-cols-[25px_1fr_1fr_1fr] items-center p-4 hover:bg-muted/50">
                  <Checkbox
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => handleClientSelect(client.id)}
                    aria-label={`Select ${client.name}`}
                  />
                  <span>{client.name}</span>
                  <span>{client.phone}</span>
                  <span>{client.email}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="message" onValueChange={(value) => handleTypeChange(value as NotificationType)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="message">Message</TabsTrigger>
                  <TabsTrigger value="push">Push</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="template">Message Template</Label>
                <Select value={notificationData.template} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTemplates[notificationType].map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder={`${notificationType.charAt(0).toUpperCase() + notificationType.slice(1)} title`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Content</Label>
                <Textarea
                  id="description"
                  value={notificationData.description}
                  onChange={(e) => setNotificationData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder={`Enter your ${notificationType} content here`}
                  rows={4}
                />
              </div>

              {(notificationType === "push" || notificationType === "email") && (
                <div className="space-y-2">
                  <Label htmlFor="image">Attach Image</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <ImagePlus className="w-4 h-4 mr-2" />
                      {notificationData.image ? "Change Image" : "Upload Image"}
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {notificationData.image && (
                    <p className="text-sm text-muted-foreground">Selected: {notificationData.image.name}</p>
                  )}
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleSendNotification}
                disabled={selectedClients.length === 0 || !notificationData.title || !notificationData.description}
              >
                {getNotificationIcon(notificationType)}
                <span className="ml-2">
                  Send {notificationType.charAt(0).toUpperCase() + notificationType.slice(1)}
                  {selectedClients.length > 0 && ` (${selectedClients.length} clients)`}
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationPreview
                type={notificationType}
                title={notificationData.title}
                content={notificationData.description}
                image={notificationData.image}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

