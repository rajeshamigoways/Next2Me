"use client"
import { useState, useEffect } from "react"
import { Switch } from "../../../components/switch"
import { Button } from "../../../components/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/select"
import { Input } from "../../../components/input"

// import { toast } from "../../../components/"
import Url from "../../../Urls"
// import { getAllCountries } from "../../../../lib/countries"

export default function SystemSettings() {
  // Initial state with default values
  const [settings, setSettings] = useState({
    _id: null,
    darkMode: false,
    timezone: "",
    timezoneDisplay: "UTC+05:30", // Added for display purposes
    currency: "INR",
    currencySymbol: "₹",
    currencyPosition: "before",
    currencyDecimals: "2",
    decimalSeparator: ".",
    thousandSeparator: ",",
    taxDecimals: "2",
    quantityDecimals: "2",
    dateFormat: "MM-DD-YYYY",
    enableLanguages: false,
    fileSize: "80000",
    allowedFiles: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif",
    autoClose: "30",
  })

  const [countries, setCountries] = useState([])

  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Fetch existing settings on component mount
  useEffect(() => {
    fetchSettings()
    fetchCountries()
  }, [])

  // Apply dark mode effect
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [settings.darkMode])

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${Url}/systemsettings`)
      const data = await response.json()

      console.log("data here", data)
      if (data && data.length > 0) {
        const settingsData = data[0]
        // Initialize timezone display value
        setSettings({
          ...settingsData,
          timezoneDisplay: settingsData.timezone || "UTC+05:30",
        })
      }
      setIsLoaded(true)
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch countries from API
  const fetchCountries = async () => {
    try {
      const response = await fetch(`${Url}/countries`)

      const countrydata = await response.json()
      console.log("country data here", countrydata)
      if (countrydata && countrydata.length > 0) {
        setCountries(countrydata)
      }
    } catch (error) {
      console.error("Error fetching countries:", error)
    }
  }

  // Handle input changes
  const handleChange = (field, value) => {
    if (field === "timezone") {
      // Parse the combined timezone value
      const [countryId, timezoneIndex] = value.split(":")
      const country = countries.find((c) => c.id.toString() === countryId)

      if (country && country.timezones && country.timezones[Number.parseInt(timezoneIndex)]) {
        const timezone = country.timezones[Number.parseInt(timezoneIndex)]

        setSettings((prev) => ({
          ...prev,
          timezone: value, // Store the combined value for form submission
          timezoneDisplay: `${timezone.gmtOffsetName} - ${country.name}/${timezone.zoneName}`, // For display
        }))
      }
    } else if (field === "currency") {
      // Extract the currency code from the combined value
      const [countryId, currencyCode] = value.split(":")

      // Find the country to get the currency symbol
      const country = countries.find((c) => c.id.toString() === countryId)

      setSettings((prev) => ({
        ...prev,
        currency: currencyCode,
        currencySymbol: country?.currency_symbol || prev.currencySymbol,
      }))
    } else {
      setSettings((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  // Toggle dark mode
  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }))
  }

  // Save settings
  const saveSettings = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Create a copy of settings without the display-only fields
    const settingsToSave = { ...settings }
    delete settingsToSave.timezoneDisplay

    // Extract the actual timezone value if needed
    if (settings.timezone && settings.timezone.includes(":")) {
      const [countryId, timezoneIndex] = settings.timezone.split(":")
      const country = countries.find((c) => c.id.toString() === countryId)

      if (country && country.timezones && country.timezones[Number.parseInt(timezoneIndex)]) {
        settingsToSave.timezone = country.timezones[Number.parseInt(timezoneIndex)].gmtOffsetName
      }
    }

    console.log("here is the system settings", settingsToSave)
    try {
      const method = settingsToSave._id ? "PUT" : "POST"
      const url = settingsToSave._id ? `${Url}/systemsettings/${settingsToSave._id}` : `${Url}/systemsettings`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsToSave),
      })

      if (response.ok) {
        const data = await response.json()
        // Update the ID if it was a new record
        if (!settingsToSave._id && data.id) {
          setSettings((prev) => ({
            ...prev,
            id: data.id,
          }))
        }
        // toast({
        //   title: "Success",
        //   description: "Settings saved successfully!",
        //   variant: "success",
        // })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to save settings. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return <div className="w-full max-w-4xl mx-auto p-6 text-center">Loading settings...</div>
  }

  countries.map((ele)=>{
    ele.timezones.map((el:any)=>{
      console.log(el.gmtOffsetName, ele.name)
    })
  })
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-black rounded-lg shadow-sm border dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">System Settings</h2>

          <form className="space-y-6" onSubmit={saveSettings}>
            <div className="grid gap-6">
              {/* Dark Mode Switch */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="dark-mode">
                  Dark Mode
                </label>
                <div className="md:col-span-2">
                  <Switch checked={settings.darkMode} onChange={toggleTheme} id="dark-mode" />
                </div>
              </div>

              {/* Time Zone */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="timezone">
                  Time Zone <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select value={settings.timezone} onValueChange={(value) => handleChange("timezone", value)}>
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone">{settings.timezoneDisplay}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
  {countries.map((country) => (
    <SelectItem key={country.name} value={country.name}>
      {country.name} {country.timezones?.[0]?.gmtOffsetName || ""}
    </SelectItem>
  ))}
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
                  <Select value={settings.currency} onValueChange={(value) => handleChange("currency", value)}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={`${country.id}-${country.currency}`}
                          value={`${country.id}:${country.currency}`}
                        >
                          {`${country.name} (${country.currency})`}
                        </SelectItem>
                      ))}
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
                  <Input
                    id="currency-symbol"
                    label="currency-symbol"
                    value={settings.currencySymbol}
                    onChange={(e) => handleChange("currencySymbol", e.target.value)}
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground mt-1">Automatically set based on selected currency</p>
                </div>
              </div>

              {/* Currency Position */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="currency-position">
                  Currency Position <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select
                    value={settings.currencyPosition}
                    onValueChange={(value) => handleChange("currencyPosition", value)}
                  >
                    <SelectTrigger id="currency-position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before">Before the amount (e.g., $100)</SelectItem>
                      <SelectItem value="after">After the amount (e.g., 100$)</SelectItem>
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
                  <Select
                    value={settings.currencyDecimals}
                    onValueChange={(value) => handleChange("currencyDecimals", value)}
                  >
                    <SelectTrigger id="currency-decimals">
                      <SelectValue placeholder="Select decimals" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 (e.g., 100)</SelectItem>
                      <SelectItem value="1">1 (e.g., 100.0)</SelectItem>
                      <SelectItem value="2">2 (e.g., 100.00)</SelectItem>
                      <SelectItem value="3">3 (e.g., 100.000)</SelectItem>
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
                  <Input
                    id="decimal-separator"
                    value={settings.decimalSeparator}
                    onChange={(e) => handleChange("decimalSeparator", e.target.value)}
                    maxLength={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Character used to separate decimals (e.g., "." in 100.00)
                  </p>
                </div>
              </div>

              {/* Thousand Separator */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="thousand-separator">
                  Thousand Separator <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Input
                    id="thousand-separator"
                    value={settings.thousandSeparator}
                    onChange={(e) => handleChange("thousandSeparator", e.target.value)}
                    maxLength={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Character used to separate thousands (e.g., "," in 1,000.00)
                  </p>
                </div>
              </div>

              {/* Tax Decimals */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="tax-decimals">
                  Tax Decimals (%) <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Select value={settings.taxDecimals} onValueChange={(value) => handleChange("taxDecimals", value)}>
                    <SelectTrigger id="tax-decimals">
                      <SelectValue placeholder="Select decimals" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 (e.g., 18%)</SelectItem>
                      <SelectItem value="1">1 (e.g., 18.5%)</SelectItem>
                      <SelectItem value="2">2 (e.g., 18.50%)</SelectItem>
                      <SelectItem value="3">3 (e.g., 18.500%)</SelectItem>
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
                  <Select
                    value={settings.quantityDecimals}
                    onValueChange={(value) => handleChange("quantityDecimals", value)}
                  >
                    <SelectTrigger id="quantity-decimals">
                      <SelectValue placeholder="Select decimals" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 (e.g., 5)</SelectItem>
                      <SelectItem value="1">1 (e.g., 5.5)</SelectItem>
                      <SelectItem value="2">2 (e.g., 5.50)</SelectItem>
                      <SelectItem value="3">3 (e.g., 5.500)</SelectItem>
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
                  <Select value={settings.dateFormat} onValueChange={(value) => handleChange("dateFormat", value)}>
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM-DD-YYYY">MM-DD-YYYY (e.g., 02-15-2025)</SelectItem>
                      <SelectItem value="DD-MM-YYYY">DD-MM-YYYY (e.g., 15-02-2025)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (e.g., 2025-02-15)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enable Languages */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="enable-languages">
                  Enable Languages
                </label>
                <div className="md:col-span-2">
                  <Switch
                    id="enable-languages"
                    checked={settings.enableLanguages}
                    onChange={() => handleChange("enableLanguages", !settings.enableLanguages)}
                  />
                </div>
              </div>

              {/* File Max Size */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="file-size">
                  File Max Size <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="file-size"
                      type="number"
                      value={settings.fileSize}
                      onChange={(e) => handleChange("fileSize", e.target.value)}
                    />
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
                  <Input
                    id="allowed-files"
                    value={settings.allowedFiles}
                    onChange={(e) => handleChange("allowedFiles", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Comma-separated list of allowed file extensions</p>
                </div>
              </div>

              {/* Auto Close Ticket */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="auto-close">
                  Auto Close Ticket <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <Input
                    id="auto-close"
                    type="number"
                    value={settings.autoClose}
                    onChange={(e) => handleChange("autoClose", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">In Days</p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

