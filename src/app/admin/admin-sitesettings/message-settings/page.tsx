"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "../../../components/label";
import { Input } from "../../../components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/select";
import { Button } from "../../../components/button";

export default function MessageSettings() {
  const [useAlternateNumbers, setUseAlternateNumbers] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-black">
      <div className="max-w-[1200px] mx-auto p-6">
        <h1 className="text-xl font-normal text-[#333] dark:text-white mb-8 pb-4 border-b dark:border-gray-700">
          Message Settings
        </h1>

        <form className="bg-white dark:bg-[#121212] rounded-sm shadow-sm p-6">
          <div className="grid gap-6">
            {/* Sender ID */}
            <div className="space-y-2">
              <Input id="sender-id" label="Sender ID" required  />
            </div>

            {/* SMS Gateway */}
            <div className="space-y-2">
              <Label htmlFor="sms-gateway" className="text-sm font-medium text-[#333] dark:text-gray-300">
                SMS Gateway
              </Label>
              <Select defaultValue="twilio">
                <SelectTrigger >
                  <SelectValue placeholder="Select SMS gateway" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="nexmo">Nexmo</SelectItem>
                  <SelectItem value="plivo">Plivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* API Credentials */}
            <Input id="api-key" label="API Key" type="password" required   />
            <Input id="api-secret" label="API Secret" type="password" required  />
            <Input id="account-sid" label="Account SID" required  />

            {/* Default Sender Information */}
            <div className="space-y-2">
              <Label htmlFor="sender-number" className="text-sm font-medium text-[#333] dark:text-gray-300">
                Default Sender Number
              </Label>
              <Input id="sender-number" label="Sender Number" required  />
            </div>

            {/* Toggle for Alternate Numbers */}
            <div className="flex items-center gap-2">
              <Label htmlFor="alternate-numbers" className="text-sm font-medium text-[#333] dark:text-gray-300">
                Use Alternate Numbers
              </Label>
       
              <input
  type="checkbox"
  id="alternate-numbers"
  checked={useAlternateNumbers}
  onChange={(e) => setUseAlternateNumbers(e.target.checked)}
  className="w-10 h-5 rounded-full appearance-none bg-gray-300 dark:bg-white-700 transition-colors relative 
                  checked:bg-[#4f46e5] before:absolute before:left-1 before:top-1 before:w-3 before:h-3 
                  before:bg-white dark:before:bg-white-300 before:rounded-full before:transition-transform 
                  checked:before:translate-x-5"
/>

            </div>

            {/* Additional Numbers - Animated */}
            {useAlternateNumbers && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4"
              >
                <Input id="alt-sender-number" label="Alternate Sender Number" required  />
              </motion.div>
            )}

            {/* Message Template Selection */}
            <div className="space-y-2">
              <Label htmlFor="message-template" className="text-sm font-medium text-[#333] dark:text-gray-300">
                Default Message Template
              </Label>
              <Select defaultValue="general">
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="general">General Notification</SelectItem>
                  <SelectItem value="otp">OTP Verification</SelectItem>
                  <SelectItem value="marketing">Marketing Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-[#4f46e5] dark:bg-blue-600 text-white px-6 h-9 rounded">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
