"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Input } from "../../../../components/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/card";
import ModulesList from "../../data/modulelist";
import { motion } from "framer-motion";
import { useMenu } from "../../../../context/MenuContext";
import useAuthTokenVerification from "../../../../hooks/useAuthVerification";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const permissions = ["Add", "Edit", "Delete", "View"];

export default function RolesAndPrivileges() {
  const searchParams = useSearchParams();
  const roleName = searchParams.get("roleName") || ""; 
  const modules = searchParams.get("modules");

  useAuthTokenVerification();
  const { menuItems } = useMenu();

  const [state, setState] = useState({
    roleName: roleName,
    availableModules: menuItems.map((item) => ({ id: item.label, name: item.label })),
    assignedModules: [] as { id: string; name: string; permissions: string[] }[],
    error: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Errors state

  useEffect(() => {
    if (modules) {
      try {
        const decodedModules = decodeURIComponent(modules);
        const parsedModules = JSON.parse(decodedModules);
    
        console.log("Decoded Modules: ", parsedModules); // Logs the parsed modules
    
        // Make sure the modules are correctly set in the state
        setState((prevState) => {
          const assignedModuleIds = parsedModules.map((mod) => mod._id || mod.moduleName);
          const availableModules = prevState.availableModules.filter(
            (module) => !assignedModuleIds.includes(module.id) // Remove already assigned modules
          );
    
          const assignedModules = parsedModules.map((mod: any) => ({
            id: mod._id || mod.moduleName,
            name: mod.moduleName,
            permissions: permissions.filter((perm) => mod.permissions[perm.toLowerCase()] === 1),
          }));
    
          return {
            ...prevState,
            availableModules, // Available modules do not include assigned ones
            assignedModules,  // Assigned modules are pre-filled from the backend
          };
        });
      } catch (error) {
        console.error("Error parsing modules:", error);
      }
    }
  }, [modules, menuItems]); // Ensure this runs when the modules or menuItems change
  

  const handlePermissionChange = (moduleId: string, permission: string) => {
    setState((prev) => {
      const updatedAssignedModules = prev.assignedModules.map((mod) =>
        mod.id === moduleId
          ? {
              ...mod,
              permissions: mod.permissions.includes(permission)
                ? mod.permissions.filter((p) => p !== permission)
                : [...mod.permissions, permission],
            }
          : mod
      );
      return { ...prev, assignedModules: updatedAssignedModules };
    });
  };

  const handleSaveRoles = async () => {
    // Check if any assigned module has no permissions selected
    const newErrors: { [key: string]: string } = {};
    state.assignedModules.forEach((mod) => {
      if (mod.permissions.length === 0) {
        newErrors[mod.id] = "At least one permission must be selected for this module.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set the error messages
      return; // Don't proceed if there are errors
    }

    const formattedData = {
      roleName: state.roleName,
      accessModules: state.assignedModules.map((mod) => ({
        moduleName: mod.name,
        permissions: {
          add: mod.permissions.includes("Add") ? 1 : 0,
          edit: mod.permissions.includes("Edit") ? 1 : 0,
          delete: mod.permissions.includes("Delete") ? 1 : 0,
          view: mod.permissions.includes("View") ? 1 : 0,
        },
      })),
    };

    try {
      const responseCheck = await fetch(`http://localhost:5000/rolesettings/check/${state.roleName}`);
      const checkData = await responseCheck.json();

      if (checkData.exists) {
        const response = await fetch(`http://localhost:5000/rolesettings/${checkData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Role updated successfully!");
        } else {
          toast.error(data.message || "Failed to update role");
        }
      } else {
        const response = await fetch("http://localhost:5000/rolesettings/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Role saved successfully!");
        } else {
          toast.error(data.message || "Failed to save role");
        }
      }
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Server error");
    }
  };
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id.toString();
  
    setState((prev) => {
      const isMovingToAssigned = prev.availableModules.some((m) => m.id === activeId);
      const isMovingToAvailable = prev.assignedModules.some((m) => m.id === activeId);
  
      if (isMovingToAssigned) {
        // Move module from available to assigned
        const moduleToMove = prev.availableModules.find((m) => m.id === activeId)!;
        return {
          ...prev,
          availableModules: prev.availableModules.filter((m) => m.id !== activeId), // Remove module from available
          assignedModules: [
            ...prev.assignedModules,
            { ...moduleToMove, permissions: [] }, // Add module to assigned with empty permissions
          ],
        };
      }
  
      if (isMovingToAvailable) {
        // Move module from assigned to available
        const moduleToMove = prev.assignedModules.find((m) => m.id === activeId)!;
        return {
          ...prev,
          assignedModules: prev.assignedModules.filter((m) => m.id !== activeId), // Remove module from assigned
          availableModules: [
            ...prev.availableModules,
            { id: moduleToMove.id, name: moduleToMove.name }, // Add module back to available
          ],
        };
      }
  
      return prev;
    });
  }
  
  
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <ToastContainer autoClose={2000} />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles & Privileges Settings</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca] disabled:opacity-50"
          onClick={handleSaveRoles}
        >
          Save Roles
        </motion.button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Input
              label="Enter role name"
              value={state.roleName}
              onChange={(e) => setState((prev) => ({ ...prev, roleName: e.target.value.toUpperCase() }))}
            />
            {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
          </div>
        </CardContent>
      </Card>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext items={state.availableModules} strategy={verticalListSortingStrategy}>
                <ModulesList modules={state.availableModules} />
              </SortableContext>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Modules & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext items={state.assignedModules} strategy={verticalListSortingStrategy}>
                {state.assignedModules.length === 0 ? (
                  <p className="text-gray-500">No assigned modules.</p>
                ) : (
                  state.assignedModules.map((mod) => (
                    <div key={mod.id} className="p-3 border rounded-md mb-2">
                      <h3 className="font-semibold mb-2">{mod.name}</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {permissions.map((perm) => (
                          <label key={`${mod.id}-${perm}`} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={mod.permissions.includes(perm)}
                              onChange={() => handlePermissionChange(mod.id, perm)}
                              className="accent-[#4f46e5]"
                            />
                            <span>{perm}</span>
                          </label>
                        ))}
                      </div>
                      {errors[mod.id] && <p className="text-red-500 mt-2">{errors[mod.id]}</p>}
                    </div>
                  ))
                )}
              </SortableContext>
            </CardContent>
          </Card>
        </div>
      </DndContext>
    </div>
  );
}
