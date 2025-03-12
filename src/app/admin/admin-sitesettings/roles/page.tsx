
"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/select";
import { Input } from "../../../components/input";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faShieldAlt } from "@fortawesome/free-solid-svg-icons";

import { Trash2, Settings, Edit, Shield, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"; 
import useAuthTokenVerification from "../../../hooks/useAuthVerification";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/app/components/pagination";
import Swal from 'sweetalert2';

interface AccessModule {
  moduleName: string;
  permissions: { add: number; edit: number; delete: number; view: number };
}

interface Role {
  _id: string;
  roleName: string;
  accessModules: AccessModule[];
  createdAt: string;
  sNo?: number; 
}

export default function RolesTable() {
  useAuthTokenVerification();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortConfig, setSortConfig] = useState<{ key: keyof Role; direction: "asc" | "desc" } | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/rolesettings/?limit=${limit}&page=${page}&searchQuery=${searchQuery}`
        );
        if (!response.ok) throw new Error("Failed to fetch roles");

        const data = await response.json();
        setRoles(data.roles);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [limit, page, searchQuery]);

  const handleSort = (key: keyof Role | "sNo") => { 
    if (["sNo", "roleName", "createdAt"].includes(key)) {
      setSortConfig((prev) => ({
        key,
        direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
      }));
    }
  };
  // const handleEditRole = (roleId: string) => {
  //   router.push(`/admin/roles/edit/${roleId}`);
  // }
  
  const sortedRoles = [...roles]
    .map((role, index) => ({
      ...role,
      sNo: (page - 1) * limit + index + 1, 
    }))
    .sort((a, b) => {
      if (!sortConfig) return 0; 

      const { key, direction } = sortConfig;
      const order = direction === "asc" ? 1 : -1;

      if (key === "sNo") {
        return order * ((a.sNo ?? 0) - (b.sNo ?? 0));
      } else if (key === "createdAt") {
        return order * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (a[key] && b[key]) {
        return order * a[key].localeCompare(b[key]);
      }
      return 0;
    });

  const renderSortIcon = (key: keyof Role) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={16} className="inline-block text-gray-400 ml-1" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={16} className="inline-block text-black ml-1" />
    ) : (
      <ArrowDown size={16} className="inline-block text-black ml-1" />
    );
  };

  const handleDeleteRole = async (roleId: string) => {
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
      const response = await fetch(`http://localhost:5000/rolesettings/${roleId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Error: ${data.message}`, { position: "top-center" });
        return;
      }

      toast.success("Role deleted successfully!", { position: "top-center" });
      setRoles((prevRoles) => prevRoles.filter((role) => role._id !== roleId));
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast.error("Failed to delete role.", { position: "top-center" });
    }
  };
  const filteredRoles = sortedRoles
  .filter((role) => role.roleName !== "ADMIN") // Exclude ADMIN role
  .filter((role) => role.roleName?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleEditRole = (role: Role) => {
    const queryParams = new URLSearchParams({
      roleId: role._id,
      roleName: role.roleName,
      modules: encodeURIComponent(JSON.stringify(role.accessModules)), // Explicitly encode the JSON string
    }).toString();
    console.log("Pushing route: ", `/admin/admin-sitesettings/roles/roles-settings?${queryParams}`);

    router.push(`/admin/admin-sitesettings/roles/roles-settings?${queryParams}`);
  };
  
  
  
  return (
    <div className="p-6">
      <ToastContainer autoClose={2000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Roles & Privileges Settings</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => router.push("/admin/admin-sitesettings/roles/roles-settings")}
          className="px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca] disabled:opacity-50"
        >
          New Roles
        </motion.button>
      </div>

      <div className="flex justify-between items-center mb-4">
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
        <div className="text-left pl-2">
  <Input 
    value={searchQuery} 
    onChange={(e) => setSearchQuery(e.target.value)} 
    className="w-[200px]" 
    label="Search roles..." 
  />
</div>

      </div>
 
      <div className="border rounded-md">
        {loading ? (
          <p className="text-center p-4">Loading roles...</p>
        ) : filteredRoles.length === 0 ? (
          <p className="text-center p-4">No roles found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("sNo")}>S.NO {renderSortIcon("sNo")}</TableHead>
                <TableHead onClick={() => handleSort("roleName")}>Role Name {renderSortIcon("roleName")}</TableHead>
                <TableHead>Modules Access</TableHead>
                <TableHead onClick={() => handleSort("createdAt")}>Created {renderSortIcon("createdAt")}</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role._id}>
                  <TableCell>{role.sNo}</TableCell>
                  <TableCell>{role.roleName}</TableCell>
                  <TableCell>{role.accessModules.map((mod) => mod.moduleName).join(", ")}</TableCell>
                  <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right flex gap-x-2">
          {/* Show shield icon for admin, otherwise show edit and delete */}
          {role.roleName === "ADMIN" ? (
            <Button>
 <FontAwesomeIcon icon={faShieldAlt}  />
            </Button>
 
) : (
  <>
<Button onClick={() => handleEditRole(role)}>
  <FontAwesomeIcon icon={faEdit} />
</Button>

    <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(role._id)}>
      <FontAwesomeIcon icon={faTrash}  />
    </Button>
  </>
)}

        </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      {/* Your Table and other components */}
    </div>
  );
}
