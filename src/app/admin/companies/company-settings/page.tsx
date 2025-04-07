"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "../../../components/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/form"
import { Input } from "../../../components/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/select"
import { countries } from "../../../data/countries-tax"
import Url from "../../../Urls"

const formSchema = z.object({
  // General Information
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  registrationNumber: z.string().min(1, "Registration number is required"),

  // Company Information
  organizationType: z.string().min(1, "Please select organization type"),
  webUrl: z.string().url("Please enter a valid URL"),
  tax: z.string().min(2, "Tax is required"),
  taxNumber: z.string().max(30, "GST number cannot exceed 30 characters"),

  // Contact Details
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits").optional(),
  fax: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),

  // Web Details
  domainName: z.string().min(1, "Domain name is required"),
  domainProvider: z.string().min(1, "Domain provider is required"),

  // Bank Details
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  ifscCode: z.string().min(11, "IFSC code must be 11 characters").max(11),

  accountType: z.string().min(1, "Account type is required"),

  // Branch Details
  branches: z
    .array(
      z.object({
        branch_name: z.string().min(1, "Branch name is required"),
        branch_contact: z.string().min(1, "Contact information is required"),
        branch_link: z.string().url("Please enter a valid URL").optional(),
        branch_id: z.string().optional(),
      }),
    )
    .optional(),
})

export default function CompanyForm() {
  const [currentTab, setCurrentTab] = useState("company")
  const [gstLabel, setGstLabel] = useState("GST number")
  const [taxType, setTaxType] = useState("GST")
  const [isEditMode, setIsEditMode] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validates on every change
    shouldFocusError: false, // Prevent auto-focusing on errors
    defaultValues: {
      companyName: "",
      registrationNumber: "",
      phone: "",
      mobile: "",
      fax: "",
      address: "",
      organizationType: "",
      webUrl: "",
      tax: "GST",
      taxNumber: "",
      city: "",
      postalCode: "",
      state: "",
      country: "India", // Default to India
      domainName: "",
      domainProvider: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      accountType: "",
      branches: [
        {
          branch_name: "",
          branch_contact: "",
          branch_link: "",
          branch_id: "",
        },
      ],
    },
  })

  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      setIsEditMode(true)
      setClientId(id)
      fetchClientData(id)
    }
  }, [searchParams])

  const fetchClientData = async (id: string) => {
    try {
      const response = await fetch(`${Url}/companies/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch client data")
      }

      const clientData = await response.json()
      console.log("Original client data:", clientData)

      // Ensure branches have proper structure with branch_id
      const formattedBranches =
        clientData.branches?.map((branch) => {
          // Make sure each branch has a branch_id
          if (!branch.branch_id) {
            console.warn("Branch missing ID:", branch)
          }
          return branch
        }) || []

      // Convert snake_case to camelCase for form fields
      const formattedData = Object.keys(clientData).reduce((acc, key) => {
        // Convert snake_case to camelCase
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

        // Special handling for branches array
        if (key === "branches") {
          acc[key] = formattedBranches
        } else {
          acc[camelKey] = clientData[key]
        }
        return acc
      }, {})

      // Set tax type based on client data
      if (clientData.tax) {
        setTaxType(clientData.tax)
        const selectedCountry = countries.find((c) => c.country === clientData.country)
        if (selectedCountry) {
          setGstLabel(`${selectedCountry.tax} Number`)
        }
      }

      console.log("Formatted Data for form:", formattedData)
      // Reset form with client data
      form.reset(formattedData)
    } catch (error) {
      toast.error("Error fetching client data")
      console.error(error)
    }
  }

  const handleCountryChange = (country: string) => {
    console.log(country) // e.g., germany
    const selectedCountry = countries.find((c) => c.country === country) // Find the country object in the array

    if (selectedCountry) {
      setTaxType(selectedCountry.tax)
      setGstLabel(`${selectedCountry.tax} Number`)
    } else {
      // In case the country doesn't exist in the list
      console.log("Country not found.")
    }
  }

  const tabs = ["company", "contact", "web", "bank", "branches"]

  function handleNext() {
    const nextTab = getNextTab(currentTab)
    setCurrentTab(nextTab)
  }

  function getNextTab(currentTab: string) {
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex < tabs.length - 1) {
      return tabs[currentIndex + 1]
    }
    return currentTab
  }

  function getTabForField(fieldName: string) {
    const fieldToTabMap: { [key: string]: string } = {
      companyName: "company",
      registrationNumber: "company",
      organizationType: "company",
      webUrl: "company",
      tax: "company",
      taxNumber: "company",
      phone: "contact",
      mobile: "contact",
      fax: "contact",
      address: "contact",
      city: "contact",
      postalCode: "contact",
      state: "contact",
      country: "contact",
      domainName: "web",
      domainProvider: "web",
      hostingProvider: "web",
      bankName: "bank",
      accountNumber: "bank",
      ifscCode: "bank",
      branchName: "bank",
      accountType: "bank",
      branches: "branches",
    }

    return fieldToTabMap[fieldName] || "company"
  }

  function convertToSnakeCase(obj: Record<string, any>) {
    const snakeCaseObj: Record<string, any> = {}
    Object.keys(obj).forEach((key) => {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
      snakeCaseObj[snakeKey] = obj[key]
    })
    return snakeCaseObj
  }
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Process branches to ensure proper IDs
    const processedBranches = values.branches?.map((branch, index) => {
      // If it's an existing branch with an ID, keep the ID
      if ("branch_id" in branch && branch.branch_id) {
        return branch
      }
      // For new branches, generate a temporary ID (will be replaced by server)
      return {
        ...branch,
       
      }
    })

    // Add taxType to formatted values
    const formattedValues = convertToSnakeCase({
      ...values,
      branches: processedBranches,
      tax: taxType, // Add tax field based on taxType
    })

    console.log("here is the form values", formattedValues)

    try {
      const url = isEditMode ? `${Url}/companies/${clientId}` : `${Url}/companies/`

      console.log("URL HERE", url)
      const method = isEditMode ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success(isEditMode ? "Client updated successfully!" : "Client created successfully!")

        // Reset form and redirect back to clients list after a short delay
        setTimeout(() => {
          router.push("/admin/companies")
        }, 1500)
      } else {
        toast.error(`Error: ${data.message || "Something went wrong"}`)
      }
    } catch (error) {
      toast.error("Network error or server unreachable.")
    }
  }

  function handleValidationAndSubmit() {
    form.trigger().then(() => {
      const errors = form.formState.errors

      if (Object.keys(errors).length > 0) {
        // If there are errors, go to the tab of the first error field
        const firstErrorField = Object.keys(errors)[0]
        setCurrentTab(getTabForField(firstErrorField))
      } else {
        onSubmit(form.getValues())
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {" "}
      {/* Increased padding and max-width */}
      <h1 className="text-3xl font-bold mb-8">{isEditMode ? "Edit Company" : "New Company"}</h1>{" "}
      {/* Increased font size and margin */}
      <Form {...form}>
        <form className="space-y-8">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="company" className="text-[#4f46e5] hover:text-[#4f46e5] focus:text-[#4f46e5] text-lg">
                Company
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-[#4f46e5] hover:text-[#4f46e5] focus:text-[#4f46e5] text-lg">
                Contact
              </TabsTrigger>
              <TabsTrigger value="web" className="text-[#4f46e5] hover:text-[#4f46e5] focus:text-[#4f46e5] text-lg">
                Web
              </TabsTrigger>
              <TabsTrigger value="bank" className="text-[#4f46e5] hover:text-[#4f46e5] focus:text-[#4f46e5] text-lg">
                Bank
              </TabsTrigger>
              <TabsTrigger
                value="branches"
                className="text-[#4f46e5] hover:text-[#4f46e5] focus:text-[#4f46e5] text-lg"
              >
                Branches
              </TabsTrigger>
            </TabsList>

            {/* <TabsContent value="general" className="space-y-6">



</TabsContent> */}
            <TabsContent value="company" className="space-y-6">
              <FormField
                control={form.control}
                name="organizationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="private">Private Limited</SelectItem>
                        <SelectItem value="public">Public Limited</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="proprietorship">Proprietorship</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label="Enter company name" {...field} className="py-3 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Registration Number</FormLabel> */}
                    <FormControl>
                      <Input label="Enter registration number" {...field} className="py-3 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="webUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label="Enter company website URL" {...field} className="py-3 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleCountryChange(value) // Change the label when country changes
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country, index) => {
                          const key = `${country.country}-${index}` // Ensure unique keys

                          return (
                            <SelectItem key={key} value={country.country}>
                              {country.country}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label={gstLabel} maxLength={30} {...field} className="py-3 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Enter phone number" {...field} className="py-3 text-lg" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Enter mobile number" {...field} className="py-3 text-lg" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="fax"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label="Enter fax number" {...field} className="py-3 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label="Enter address" {...field} className="py-3 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Enter city" {...field} className="py-3 text-lg" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Enter postal code" {...field} className="py-3 text-lg" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Enter state" {...field} className="py-3 text-lg" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          handleCountryChange(value) // Change the label when country changes
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country, index) => {
                            const key = `${country.country}-${index}` // Ensure unique keys

                            return (
                              <SelectItem key={key} value={country.country}>
                                {country.country}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="web" className="space-y-6">
              <FormField
                control={form.control}
                name="domainName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label="Enter domain name" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="domainProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="godaddy">GoDaddy</SelectItem>
                        <SelectItem value="namecheap">Namecheap</SelectItem>
                        <SelectItem value="cloudflare">Cloudflare</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"sslProvider" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label="Enter SSL provider" {...field} className="py-3 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="bank" className="space-y-6">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label="Enter bank name" {...field} className="py-3 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label="Enter account number" {...field} className="py-3 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label="Enter IFSC code" maxLength={11} {...field} className="py-3 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="salary">Salary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="branches" className="space-y-6">
              {form.watch("branches")?.map((_, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-6 bg-gray-50">
                  <h3 className="text-xl font-semibold">Branch {index + 1}</h3>

                  <FormField
                    control={form.control}
                    name={`branches.${index}.branch_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input label="Enter branch name" {...field} className="py-3 text-lg" />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`branches.${index}.branch_contact`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input label="Enter branch contact information" {...field} className="py-3 text-lg" />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`branches.${index}.branch_link`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input label="Enter branch direction link" {...field} className="py-3 text-lg" />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const branches = [...(form.getValues("branches") || [])]
                        form.setValue(
                          "branches",
                          branches.filter((_, i) => i !== index),
                        )
                      }}
                    >
                      Remove Branch
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const branches = [...(form.getValues("branches") || [])]
                  branches.push({
                    branch_name: "",
                    branch_contact: "",
                    branch_link: "",
                    branch_id: "",
                  })
                  form.setValue("branches", branches)
                }}
              >
                Add Branch
              </Button>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between">
            {currentTab !== "company" && (
              <Button type="button" variant="outline" onClick={() => setCurrentTab(tabs[tabs.indexOf(currentTab) - 1])}>
                Previous
              </Button>
            )}
            {currentTab === "branches" ? (
              <Button type="button" className="bg-[#4f46e5] text-white" onClick={handleValidationAndSubmit}>
                {isEditMode ? "Update" : "Submit"}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
          <ToastContainer />
        </form>
      </Form>
    </div>
  )
}

