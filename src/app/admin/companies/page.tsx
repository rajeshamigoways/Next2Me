"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "../../components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/select"
import { Input } from "../../components/input"
import { motion } from "framer-motion"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import useAuthTokenVerification from "../../hooks/useAuthVerification"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Pagination from "@/app/components/pagination"
import Swal from "sweetalert2"
import Url from "../../Urls"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"

interface Client {
  _id: string
  company_id: string
  client_name: string
  name: string
  tax: string
  company_name: string
  tax_number: string
  phone: string
}
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function RolesTable() {
  useAuthTokenVerification()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: "asc" | "desc" } | null>(null)
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${Url}/companies/?limit=${limit}&page=${page}&searchQuery=${searchQuery}`)

        if (!response.ok) throw new Error("Failed to fetch clients")

        const data = await response.json()
        setClients(data.company)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("Error fetching clients:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [limit, page, debouncedSearchQuery])

  const handleSort = (key: keyof Client) => {
    if (["company_id", "company_name", "client_name", "tax", "tax_number", "phone"].includes(key)) {
      setSortConfig((prev) => ({
        key,
        direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
      }))
    }
  }

  const handleDeleteClient = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${Url}/companies/${id}`, {
            method: "DELETE",
          })

          if (response.ok) {
            toast.success("Client deleted successfully")
            // Refresh the client list
            setClients(clients.filter((client) => client._id !== id))
          } else {
            const error = await response.json()
            toast.error(`Error: ${error.error || "Failed to delete client"}`)
          }
        } catch (error) {
          toast.error("Network error or server unreachable")
        }
      }
    })
  }

  const handleEditClient = (id: string) => {
    router.push(`/admin/companies/company-settings?id=${id}`)
  }

  const renderSortIcon = (key: keyof Client) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={16} className="inline-block text-gray-400 ml-1" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={16} className="inline-block text-black ml-1" />
    ) : (
      <ArrowDown size={16} className="inline-block text-black ml-1" />
    )
  }

  const sortedClients = clients
    .map((client, index) => ({
      ...client,
      sNo: (page - 1) * limit + index + 1,
    }))
    .sort((a, b) => {
      if (!sortConfig) return 0

      const { key, direction } = sortConfig
      const order = direction === "asc" ? 1 : -1

      // Sorting logic for each field
      if (key === "company_id") {
        return order * a.company_id.localeCompare(b.company_id)
      } else if (key === "company_name") {
        return order * a.company_name.localeCompare(b.company_name)
      } else if (key === "tax") {
        return order * a.tax.localeCompare(b.tax)
      } else if (key === "tax_number") {
        return order * (Number.parseInt(a.tax_number, 10) - Number.parseInt(b.tax_number, 10))
      } else if (key === "phone") {
        return order * a.phone.localeCompare(b.phone)
      } else if (key === "name") {
        return order * a.name.localeCompare(b.name)
      }
      return 0
    })
  const filteredClients = sortedClients.filter((client) => {
    console.log("Search Query in filter:", searchQuery.toLowerCase(), client.company_name) // Debugging here
    return client.company_name?.toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
  })

  return (
    <div className="p-6">
      <ToastContainer autoClose={2000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Companies</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => router.push("/admin/companies/company-settings")}
          className="px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca] disabled:opacity-50"
        >
          New Company
        </motion.button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <Select
            defaultValue="10"
            onValueChange={(value) => {
              setLimit(Number(value))
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[70px] bg-white border-[#e0e0e0]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-left pl-2">
          <Input
            value={searchQuery}
            onChange={(e) => {
              const query = e.target.value
              console.log("Updated Search Query:", query) // Debugging here
              setSearchQuery(query) // Ensure this updates the search query state correctly
            }}
            className="w-[200px]"
            label="Search Clients..."
          />
        </div>
      </div>

      <div className="border rounded-md">
        {loading ? (
          <p className="text-center p-4">Loading Clients...</p>
        ) : filteredClients.length === 0 ? (
          <p className="text-center p-4">No Clients found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("company_id")}>Company ID {renderSortIcon("company_id")}</TableHead>
             
                <TableHead onClick={() => handleSort("company_name")}>
                  Company Name {renderSortIcon("company_name")}
                </TableHead>
                <TableHead onClick={() => handleSort("tax")}>Tax {renderSortIcon("tax")}</TableHead>
                <TableHead onClick={() => handleSort("tax_number")}>
                  Tax Number {renderSortIcon("tax_number")}
                </TableHead>
                <TableHead onClick={() => handleSort("phone")}>Phone {renderSortIcon("phone")}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client._id}>
                  <TableCell>{client.company_id}</TableCell>
                 
                  <TableCell>{client.company_name}</TableCell>
                  <TableCell>{client.tax}</TableCell>
                  <TableCell>{client.tax_number}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClient(client._id)}
                        aria-label="Edit client"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClient(client._id)}
                        aria-label="Delete client"
                        // className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}

