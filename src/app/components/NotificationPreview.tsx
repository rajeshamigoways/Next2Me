"use client"
import { Card } from "../components/card"
import { Bell, Mail, MessageSquare } from "lucide-react"

interface NotificationPreviewProps {
  type: "message" | "push" | "email"
  title: string
  content: string
  image: File | null
}

export function NotificationPreview({ type, title, content, image }: NotificationPreviewProps) {
  const renderMessagePreview = () => (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <MessageSquare className="w-5 h-5 mt-1" />
        <div>
          <h3 className="font-medium">{title || "Message Title"}</h3>
          <p className="text-sm text-muted-foreground">{content || "Message content will appear here"}</p>
        </div>
      </div>
    </div>
  )

  const renderPushPreview = () => (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Bell className="w-5 h-5 mt-1" />
        <div className="flex-1">
          <h3 className="font-medium">{title || "Push Notification Title"}</h3>
          <p className="text-sm text-muted-foreground">{content || "Push notification content will appear here"}</p>
          {image && (
            <div className="mt-2 rounded-md overflow-hidden">
              <img
                src={URL.createObjectURL(image) || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-32 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderEmailPreview = () => (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Mail className="w-5 h-5 mt-1" />
        <div className="flex-1">
          <Card className="p-4">
            <h3 className="font-medium">{title || "Email Subject"}</h3>
            <div
              className="mt-2 text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: content || "Email content will appear here" }}
            />
            {image && (
              <div className="mt-2 rounded-md overflow-hidden">
                <img
                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )

  return (
    <div className="rounded-lg border p-4">
      {type === "message" && renderMessagePreview()}
      {type === "push" && renderPushPreview()}
      {type === "email" && renderEmailPreview()}
    </div>
  )
}

