"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "../../../components/label"
import { Input } from "../../../components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "../../../components/select"
import { Button } from "../../../components/button"



export default function EmailSettings() {
  const [useAlternateEmails, setUseAlternateEmails] = useState(false)

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-black">

      <div className="max-w-[1200px] mx-auto p-6">
        <h1 className="text-xl font-normal text-[#333] dark:text-white mb-8 pb-4 border-b dark:border-gray-700">
          Email Settings
        </h1>

        <form className="bg-white dark:bg-[#121212] rounded-sm shadow-sm p-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Input id="company-email" label="Company Email" required />
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <Label htmlFor="alternate-emails" className="text-sm font-medium text-[#333] dark:text-gray-300">
                Use Alternate Emails
              </Label>
              <input
                type="checkbox"
                id="alternate-emails"
                checked={useAlternateEmails}
                onChange={(e) => setUseAlternateEmails(e.target.checked)}
                className="w-10 h-5 rounded-full appearance-none bg-gray-300 dark:bg-white-700 transition-colors relative 
                  checked:bg-[#4f46e5] before:absolute before:left-1 before:top-1 before:w-3 before:h-3 
                  before:bg-white dark:before:bg-white-300 before:rounded-full before:transition-transform 
                  checked:before:translate-x-5"
              />
            </div>

            {/* Additional Inputs - Animated */}
            {useAlternateEmails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4"
              >
                <Input id="billing-email" label="Billing Email" required />
                <Input id="billing-name" label="Billing Name" required />
                <Input id="support-email" label="Support Email" required />
                <Input id="support-name" label="Support Name" required />
              </motion.div>
            )}

            {/* Email Protocol */}
            <div className="space-y-2">
              <Select defaultValue="SMTP">
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:text-white">
                  <SelectGroup>
                    <SelectItem value="SMTP">SMTP</SelectItem>
                    <SelectItem value="PHPMAIL">PHP MAIL</SelectItem>
                    <SelectItem value="SENDGRID">SENDGRID</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Other SMTP Settings */}
            <Input id="sendgrid-key" label="Send Grid Key" type="password" required />
            <Input id="smtp-host" label="SMTP HOST" required />
            <Input id="smtp-user" label="SMTP USER" required />
            <Input id="smtp-password" label="SMTP PASSWORD" required />
            <Input id="smtp-port" label="SMTP PORT" required />

            {/* Email Encryption */}
            <div className="space-y-2">
              <Label htmlFor="email-encryption" className="text-sm font-medium text-black dark:text-white">
                Email Encryption
              </Label>
              <Select defaultValue="ssl">
                <SelectTrigger className="h-9 border-[#e0e0e0]">
                  <SelectValue placeholder="Select encryption" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:text-white">
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="none">NONE</SelectItem>
                  <SelectItem value="TLS">TLS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-[#4f46e5] text-white px-6 h-9 rounded dark:bg-blue-600">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
