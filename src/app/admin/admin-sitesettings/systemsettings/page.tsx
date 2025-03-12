"use client";
import { useState } from "react";
import { Switch } from "../../../components/switch";
import { Button } from "../../../components/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/select";
import { Input } from "../../../components/input";

export default function SystemSettings() {
  const [isDark, setIsDark] = useState(false);
  const [timezone, setTimezone] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [currencyPosition, setCurrencyPosition] = useState(null);
  const [currencyDecimals, setCurrencyDecimals] = useState(null);
  const [decimalSeparator, setDecimalSeparator] = useState(null);
  const [thousandSeparator, setThousandSeparator] = useState(null);
  const [taxDecimals, setTaxDecimals] = useState(null);
  const [quantityDecimals, setQuantityDecimals] = useState(null);
  const [dateFormat, setDateFormat] = useState(null);
  const [enableLanguages, setEnableLanguages] = useState(false);
  const [fileSize, setFileSize] = useState(null);
  const [allowedFiles, setAllowedFiles] = useState(null);
  const [autoClose, setAutoClose] = useState(null);


  const saveSettings = async (e) => {
    e.preventDefault()
    const data = {
      darkMode: isDark,
      timezone,
      currency,
      currencySymbol,
      currencyPosition,
      currencyDecimals,
      decimalSeparator,
      thousandSeparator,
      taxDecimals,
      quantityDecimals,
      dateFormat,
      enableLanguages,
      fileSize,
      allowedFiles,
      autoClose,
    };

  
    const response = await fetch("http://localhost:5000/systemsettings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(data);
    if (data) {
      alert("Settings saved successfully!");
    } else {
      alert("Failed to save settings!");
    }
  };

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDark((prevState) => {
      const newTheme = !prevState;
      if (newTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newTheme;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-black rounded-lg shadow-sm border dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">System Settings</h2>

          <form className="space-y-6">
            <div className="grid gap-6">
              {/* Dark Mode Switch */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="dark-mode">
                  Dark Mode
                </label>
                <div className="md:col-span-2">
                  <Switch checked={isDark} onChange={toggleTheme} />
                </div>
              </div>

              {/* Time Zone */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="timezone">
                  Time Zone <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select defaultValue="UTC+05:30">
                    <SelectTrigger>
                      <SelectValue placeholder="UTC+05:30 - Asia/Kolkata" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC+05:30">UTC+05:30 - Asia/Kolkata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Default Currency */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="currency">
                  Default Currency <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select defaultValue="INR">
                    <SelectTrigger>
                      <SelectValue placeholder="Indian Rupee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Currency Symbol */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="currency-symbol">
                  Currency Symbol <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select defaultValue="₹">
                    <SelectTrigger>
                      <SelectValue placeholder="₹ - Indian Rupee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="₹">₹ - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Determined by Default Currency</p>
                </div>
              </div>

              {/* Currency Position */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="currency-position">
                  Currency Position <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select defaultValue="before">
                    <SelectTrigger>
                      <SelectValue placeholder="Before the amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before">Before the amount</SelectItem>
                      <SelectItem value="after">After the amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Currency Decimals */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="currency-decimals">
                  Currency Decimals <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue placeholder="2" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Decimal Separator */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="decimal-separator">
                  Decimal Separator <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Input type="text" label="" defaultValue="." maxLength={1} />
                </div>
              </div>

              {/* Thousand Separator */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="thousand-separator">
                  Thousand Separator <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Input type="text" defaultValue="," maxLength={1} />
                </div>
              </div>

              {/* Tax Decimals */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="tax-decimals">
                  Tax Decimals (%) <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue placeholder="2" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity Decimals */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="quantity-decimals">
                  Quantity Decimals <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue placeholder="2" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Format */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="date-format">
                  Date Format <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select defaultValue="MM-DD-YYYY">
                    <SelectTrigger>
                      <SelectValue placeholder="02-15-2025" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM-DD-YYYY">MM-DD-YYYY</SelectItem>
                      <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enable Languages */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Enable Languages</label>
                <div className="md:col-span-2">
                  <Switch />
                </div>
              </div>

              {/* File Max Size */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="file-size">
                  File Max Size <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={80000} />
                    <span className="text-sm text-muted-foreground">KB</span>
                  </div>
                </div>
              </div>

              {/* Allowed Files */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="allowed-files">
                  Allowed Files <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Input type="text" defaultValue="pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif" />
                </div>
              </div>

              {/* Auto Close Ticket */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="auto-close">
                  Auto Close Ticket <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Input type="number" defaultValue={30} />
                  <p className="text-xs text-muted-foreground mt-1">In Days</p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit"   onClick={saveSettings}  className="bg-orange-500 hover:bg-orange-600 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
