"use client";

import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/tabs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import useAuthTokenVerification from "../../../hooks/useAuthVerification"

export default function EmailTemplates() {
  useAuthTokenVerification()
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  // Fetch email templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("http://localhost:5000/emailsettings/email-templates");
        const data = await response.json();
        setTemplates(data);
        if (data.length > 0) {
          setActiveTemplate(data[0]);
          setSubject(data[0].subject);
          setContent(data[0].content);
        }
      } catch (error) {
        console.error("Error fetching email templates:", error);
        toast.error("Failed to fetch email templates.");
      }
    };
    fetchTemplates();
  }, []);

  // Handle template selection
  const handleTemplateChange = (value: string) => {
    const template = templates.find((t) => t.id === value);
    if (template) {
      setActiveTemplate(template);
      setSubject(template.subject);
      setContent(template.content);
    }
  };

  // Handle saving changes and update the UI immediately
  const handleSave = async () => {
    if (!activeTemplate) return;

    try {
      const response = await fetch(`http://localhost:5000/emailsettings/email-templates/${activeTemplate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, content }),
      });

      if (response.ok) {
        toast.success("Template updated successfully!");

        // **Update the template in the state immediately**
        setTemplates((prevTemplates) =>
          prevTemplates.map((t) =>
            t.id === activeTemplate.id ? { ...t, subject, content } : t
          )
        );

        // Update active template state
        setActiveTemplate((prev) => (prev ? { ...prev, subject, content } : null));
      } else {
        toast.error("Failed to update template.");
      }
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("An error occurred while updating the template.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-bold mb-6">Email Templates</h1>

      {/* Tabs for selecting templates */}
      {templates.length > 0 ? (
        <Tabs value={activeTemplate?.id} onValueChange={handleTemplateChange}>
          <TabsList className="mb-4 flex gap-2">
            {templates.map((template) => (
              <TabsTrigger
                key={template.id}
                value={template.id}
                className="px-4 py-2 rounded-md transition-all 
                bg-white text-black data-[state=active]:bg-[#4f46e5] data-[state=active]:text-white"
              >
                {template.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Template Content */}
          {templates.map((template) => (
            <TabsContent key={template.id} value={template.id}>
              <div className="space-y-4">
                {/* Subject Input */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* TinyMCE Editor */}
                <Editor
                  apiKey="2f50ff6mha8xfiexeiz2sznmqp3mcj6ae2y96xjbb67cdgcd"
                  value={content}
                  onEditorChange={(newContent) => setContent(newContent)}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "wordcount",
                    ],
                    branding: false,
                    toolbar:
                      "undo redo | formatselect | bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | removeformat",
                    setup: (editor) => {
                      editor.on("init", () => {
                        editor.notificationManager.close();
                      });
                    },
                  }}
                />

                {/* Save Button */}
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSave} className="bg-[#4f46e5] text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p>Loading templates...</p>
      )}
    </div>
  );
}
