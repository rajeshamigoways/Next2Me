"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "../../components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/select"
import { Input } from "../../components/input"
import { motion } from "framer-motion"
import { ArrowUpDown, ArrowUp, ArrowDown, Grid, List } from "lucide-react"
import useAuthTokenVerification from "../../hooks/useAuthVerification"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Pagination from "@/app/components/pagination"
import Swal from "sweetalert2"
import Url from "../../Urls"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"
import AddUserForm from "@/app/components/AddUserForm"

import { Dialog, DialogContent } from "../../components/Dialog"
interface Employee {
  _id: string
  fullname: string
  username: string
  gender: string
  phone: string
  email: string
  address_head_office: string
  city: string
  state_province: string
  postal_zip_code: string
  start_date: string
  company: string
  branch: string
  createdAt: string
  updatedAt: string
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

export default function EmployeesTable() {
  useAuthTokenVerification()
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [employeeIdSearch, setEmployeeIdSearch] = useState("")
  const [fullNameSearch, setFullNameSearch] = useState("")
  const [emailSearch, setEmailSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All Departments")
  const [departments, setDepartments] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const [sortConfig, setSortConfig] = useState<{ key: keyof Employee; direction: "asc" | "desc" } | null>(null)
  const debouncedEmployeeIdSearch = useDebounce(employeeIdSearch, 500)
  const debouncedFullNameSearch = useDebounce(fullNameSearch, 500)
  const debouncedEmailSearch = useDebounce(emailSearch, 500)
  const [searchQuery, setSearchQuery] = useState({
    username: "",
    role: "all",
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          limit: String(limit),
          page: String(page),
          username: searchQuery.username || "",
          role: searchQuery.role || "all",
          roleId: "3", // Filter by roleId: 3 for employees
        }).toString()

        const response = await fetch(`${Url}/user/?${queryParams}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.status}`)
        }

        const data = await response.json()
console.log("fetch data here", data.users)
        setEmployees(
          data.users.map((employee, index) => ({
            ...employee,
            sNo: (page - 1) * limit + index + 1,
          })),
        )

        setTotalPages(data.totalPages || 1)
      } catch (error) {
        console.error("Error fetching employees:", error)
        // Use mock data for demonstration if needed
        setEmployees([])
        setDepartments(["IT", "HR", "Finance", "Marketing"])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [limit, page, searchQuery])

  const handleSort = (key: keyof Employee) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleDeleteEmployee = (id: string) => {
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
          const response = await fetch(`${Url}/employees/${id}`, {
            method: "DELETE",
          })

          if (response.ok) {
            toast.success("Employee deleted successfully")
            // Refresh the employee list
            setEmployees(employees.filter((employee) => employee._id !== id))
          } else {
            const error = await response.json()
            toast.error(`Error: ${error.error || "Failed to delete employee"}`)
          }
        } catch (error) {
          toast.error("Network error or server unreachable")
        }
      }
    })
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEmployee(null)
  }

  const refreshEmployees = () => {
    // This would trigger the useEffect to refetch employees
    setPage(1)
  }

  const renderSortIcon = (key: keyof Employee) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={16} className="inline-block text-gray-400 ml-1" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={16} className="inline-block text-black ml-1" />
    ) : (
      <ArrowDown size={16} className="inline-block text-black ml-1" />
    )
  }

  const sortedEmployees = [...employees].sort((a, b) => {
    if (!sortConfig) return 0

    const { key, direction } = sortConfig
    const order = direction === "asc" ? 1 : -1

    if (typeof a[key] === "string" && typeof b[key] === "string") {
      return order * a[key].localeCompare(b[key])
    }

    return 0
  })

  console.log("new selected employee", selectedEmployee)
  return (
    <div className="p-6">
      <ToastContainer autoClose={2000} />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <motion.button
            onClick={() => {
              handleAddEmployee()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca] disabled:opacity-50"
          >
            <span>+</span> New Employee
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input label="Employee ID" value={employeeIdSearch} onChange={(e) => setEmployeeIdSearch(e.target.value)} />
        <Input label="Full Name" value={fullNameSearch} onChange={(e) => setFullNameSearch(e.target.value)} />
        <Input label="Email" value={emailSearch} onChange={(e) => setEmailSearch(e.target.value)} />
        <div className="flex gap-2">
          <div className="flex-1">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Departments">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca] disabled:opacity-50"
          >
            Search
          </motion.button>
          {/* <Button className="bg-[#ff6b35] hover:bg-[#e85a2a] text-white">SEARCH</Button> */}
        </div>
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
          <span>entries</span>
        </div>

        <div className="text-right">
          <span>Search: </span>
        </div>
      </div>

      <div className="border rounded-md">
        {loading ? (
          <p className="text-center p-4">Loading Employees...</p>
        ) : sortedEmployees.length === 0 ? (
          <p className="text-center p-4">No Employees found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("fullname")}>Name {renderSortIcon("fullname")}</TableHead>
                <TableHead onClick={() => handleSort("branch")}>Department {renderSortIcon("branch")}</TableHead>
                <TableHead onClick={() => handleSort("username")}>
                  Team Members ID {renderSortIcon("username")}
                </TableHead>
                <TableHead onClick={() => handleSort("email")}>Email {renderSortIcon("email")}</TableHead>
                <TableHead onClick={() => handleSort("phone")}>Mobile {renderSortIcon("phone")}</TableHead>
                <TableHead onClick={() => handleSort("start_date")}>Join Date {renderSortIcon("start_date")}</TableHead>
                <TableHead onClick={() => handleSort("updatedAt")}>Last Login {renderSortIcon("updatedAt")}</TableHead>
                <TableHead>Status </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEmployees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {employee.fullname}
                      </div>
                      <div>
                        <div className="font-medium">{employee.fullname}</div>
                        <div className="text-xs text-gray-500">{employee.gender}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.branch}</TableCell>
                  <TableCell>{employee.username}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{new Date(employee.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(employee.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditEmployee(employee)}
                        aria-label="Edit employee"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEmployee(employee._id)}
                        aria-label="Delete employee"
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

      <div className="mt-4 text-sm text-gray-500">
        Showing 1 to {Math.min(limit, sortedEmployees.length)} of {sortedEmployees.length} entries
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <AddUserForm
            closeModal={closeModal}
            selectedUser={selectedEmployee}
            refreshUsers={refreshEmployees}
            apiEndpoint={`${Url}/user/`}
            title="Employee"
            usertype="employee"
            fields={[
              {
                name: "full_name",
                label: "Full Name",
                type: "text",
                required: true,
                validation: { minLength: 2 },
              },
              {
                name: "username",
                label: "Username",
                type: "text",
                required: true,
                validation: { minLength: 3 },
              },
              {
                name: "email",
                label: "Email",
                type: "email",
                required: true,
              },
              {
                name: "phone",
                label: "Phone",
                type: "tel",
                required: true,
                validation: { minLength: 10 },
              },
              {
                name: "gender",
                label: "Gender",
                type: "select",
                required: true,
                options: [
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ],
              },
              {
                name: "start_date",
                label: "Start Date",
                type: "date",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                validation: { minLength: 6 },
              },
              {
                name: "address_head_office",
                label: "Address",
                type: "text",
              },
              {
                name: "city",
                label: "City",
                type: "text",
              },
              {
                name: "state_province",
                label: "State/Province",
                type: "text",
              },
              {
                name: "postal_zip_code",
                label: "Postal/Zip Code",
                type: "text",
              },
              {
                name: "branch",
                label: "Branch",
                type: "select",
                required: true,
                options: [
                  { value: "HR", label: "HR" },
                  { value: "Finance", label: "Finance" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "Sales", label: "Sales" },
                  { value: "Engineering", label: "Engineering" },
                ],
              },
              {
                name: "company",
                label: "Company",
                type: "text",
              },
            ]}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

