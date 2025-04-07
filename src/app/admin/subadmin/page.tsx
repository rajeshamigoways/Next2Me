"use client"
import { useEffect, useState } from "react";
import { Button } from "../../components/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/select";
import { Input } from "../../components/input";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash,faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import AddUserForm from "@/app/components/AddUserForm";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { Edit, Trash2, Shield } from "lucide-react"; 
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/app/components/pagination";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../../components/Dialog";
import Url from "../../Urls"

interface User {
  _id: string;
  sNo: number;
  username: string;
  email: string;
  createdAt: string;
  phone: number;
  role: string;
  role_id: string;
  roleName: string;
}

export default function UsersPage() {
  const { setValue, handleSubmit } = useForm();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [company, setCompany] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<{ username?: string; role?: string; company?: string }>({
    username: "",
    roleName:""
  });
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Added to store the selected user

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${Url}/rolesettings/`);
        const data = await response.json();
        setRoles(data.roles || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        limit: String(limit),
        page: String(page),
        username: searchQuery.username || "",
        role: searchQuery.role || "all",
        roleId : "2", // <-- filter by userType
      }).toString();
  
      const response = await fetch(`${Url}/user/?${queryParams}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
  
      const data = await response.json();
  
      setUsers(
        data.users.map((user: User, index: number) => ({
          ...user,
          sNo: (page - 1) * limit + index + 1,
        }))
      );
  
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
  
    fetchUsers();
  }, [searchQuery, page, limit]);

  useEffect(() => {
    let sorted = [...users];

    // Ensure Admin is first in the list
    sorted = sorted.sort((a, b) => {
      if (a.role === "Admin") return -1;
      if (b.role === "Admin") return 1;
      return 0;
    });

    if (sortColumn && sortDirection) {
      sorted.sort((a, b) => {
        let valA = a[sortColumn as keyof User];
        let valB = b[sortColumn as keyof User];

        if (sortColumn === "role") {
          valA = (a.roleName || "").toLowerCase();
          valB = (b.roleName || "").toLowerCase();
        }

        if (typeof valA === "string" && typeof valB === "string") {
          return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
          return sortDirection === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        }
      });
    }
console.log("its sorted user",sorted)
    setSortedUsers(sorted);
  }, [users, sortColumn, sortDirection]);

  // const handleSearch = () => {
  //   setPage(1); // Reset to first page when searching
  //   fetchUsers();
  // };
  const formatAddress = (address: {
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }) => {
    return `${address.city || ''}, ${address.state || ''}, ${address.country || ''} - ${address.postalCode || ''}`;
  };
  

  const handleSort = (key: keyof User | "sNo") => {
    if (["sNo", "username", "email", "phone", "roleId", "createdAt","address"].includes(key)) {
      setSortDirection(sortColumn === key && sortDirection === "asc" ? "desc" : "asc");
      setSortColumn(key);
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown size={16} className="inline-block text-gray-400 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp size={16} className="inline-block text-black ml-1" />
    ) : (
      <ArrowDown size={16} className="inline-block text-black ml-1" />
    );
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user); // Store user details for editing
    setIsModalOpen(true);
  };
  
  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!',
        });
        if (!result.isConfirmed) return;
  
      try {
        const response = await fetch(`${Url}/user/${userId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("User deleted successfully.");
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } else {
          toast.error("Failed to delete user.");
        }
      } catch (error) {
        toast.error("Error deleting user.");
        console.error(error);
      }
    
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2">
          <span>Show</span>
          <Select defaultValue="10" onValueChange={(value) => { setLimit(Number(value)); setPage(1); }}>
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
      <div className="flex justify-end items-center mb-6">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
  <motion.button
    onClick={() => {
      setSelectedUser(null); // ✅ Clear selected user
      setIsModalOpen(true);
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca] disabled:opacity-50"
  >
    New Sub Admin
  </motion.button>
</DialogTrigger>



  <DialogContent className="max-w-2xl">
  <DialogHeader>
              <VisuallyHidden>
                <DialogTitle>Hidden Title</DialogTitle>
              </VisuallyHidden>
            </DialogHeader>
            <AddUserForm closeModal={() => setIsModalOpen(false)} selectedUser={selectedUser} refreshUsers={fetchUsers}   title="Subadmin"
            usertype="subadmin"/>

  </DialogContent>
</Dialog>

        {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca] disabled:opacity-50"
            >
              New Sub Admin
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <VisuallyHidden>
                <DialogTitle>Hidden Title</DialogTitle>
              </VisuallyHidden>
            </DialogHeader>
            <AddUserForm closeModal={() => setIsModalOpen(false)} selectedUser={selectedUser} />
          </DialogContent>
        </Dialog> */}
      </div>
 
 
      <div className="flex justify-between items-center mb-6">
  {/* Left Side - Search Input */}
  <Input
    value={searchQuery.username}
    onChange={(e) => setSearchQuery({ ...searchQuery, username: e.target.value })}
    label="Search Username.."
    className="w-48 h-10" // Same width & height
  />

<Select
  onValueChange={(value) => {
    const selectedRole = roles.find((role) => role.roleName === value);
    console.log("selected role", selectedRole);
    setSearchQuery((prev) => ({
      ...prev,
      role: selectedRole?.roleName || "all",
    }));
  }}
>
  <SelectTrigger className="w-48 h-10">
    <SelectValue placeholder="Select Role" />
  </SelectTrigger>
  <SelectContent>
    {roles
      .filter((role) => role.roleName !== "ADMIN") // Exclude ADMIN
      .map((role) => (
        <SelectItem key={role._id} value={role.roleName}>
          {role.roleName}
        </SelectItem>
      ))}
  </SelectContent>
</Select>

</div>


      <div className="border rounded-md">
        {loading ? (
          <p className="text-center p-4">Loading users...</p>
        ) : sortedUsers.length === 0 ? (
          <p className="text-center p-4">No users found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("sNo")}>S.NO {renderSortIcon("sNo")}</TableHead>
                <TableHead onClick={() => handleSort("username")}>Name {renderSortIcon("username")}</TableHead>
                <TableHead onClick={() => handleSort("email")}>Email {renderSortIcon("email")}</TableHead>
                <TableHead onClick={() => handleSort("phone")}>Phone {renderSortIcon("phone")}</TableHead>
                <TableHead onClick={() => handleSort("roleId")}>Role {renderSortIcon("roleId")}</TableHead>
                <TableHead onClick={() => handleSort("address")}>Address {renderSortIcon("address")}</TableHead>
                <TableHead onClick={() => handleSort("createdAt")}>Created {renderSortIcon("createdAt")}</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {sortedUsers
  .filter(user => user.role?.roleName !== "ADMIN") // Exclude ADMIN users
  .map((user, index) => (
    <TableRow key={user._id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.role?.roleName}</TableCell>
      <TableCell>{formatAddress(user.address)}</TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <Button onClick={() => handleEdit(user)}   variant="ghost"
                        size="icon">
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button onClick={() => handleDelete(user._id)}   variant="ghost"
                        size="icon">
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </TableCell>
    </TableRow>
  ))}

            </TableBody>
          </Table>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      <ToastContainer />
    </div>
  );
}
