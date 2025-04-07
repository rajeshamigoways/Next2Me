"use client"

import { Button } from "../../../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/card"
import { Input } from "../../../components/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/tabs"
import { Bold, Italic, List, ListOrdered, Redo, Strikethrough, Undo } from "lucide-react"

export default function MessageTemplates() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Message Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="welcome" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="welcome" className="flex-1">
              Welcome Message
            </TabsTrigger>
            <TabsTrigger value="reminder" className="flex-1">
              Payment Reminder
            </TabsTrigger>
            <TabsTrigger value="notification" className="flex-1">
              Notification
            </TabsTrigger>
            <TabsTrigger value="support" className="flex-1">
              Support Reply
            </TabsTrigger>
          </TabsList>

          <TabsContent value="welcome" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Name</label>
              <Input value="Welcome Message" label="" />
            </div>

            <div className="border rounded-md">
              <div className="flex items-center gap-1 p-2 border-b">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Redo className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Strikethrough className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 min-h-[200px]">
                <div className="prose prose-sm max-w-none">
                  <h2>Welcome to {"{SITE_NAME}"}</h2>
                  <p>Hi {"{USER_NAME}"},</p>
                  <p>Welcome to our platform! We're excited to have you on board.</p>
                  <p>Here are a few things you can do to get started:</p>
                  <ul>
                    <li>Complete your profile</li>
                    <li>Explore our features</li>
                    <li>Connect with other members</li>
                  </ul>
                  <p>If you need any help, our support team is always here to assist you.</p>
                  <p>
                    Best regards,
                    <br />
                    {"{TEAM_NAME}"} Team
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-primary text-primary-foreground">Save Changes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

