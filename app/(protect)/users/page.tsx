"use client";

import { useMemo, useState } from "react";
import { AdminUserAPI, AdminRoleAPI } from "./types";
import { useAllUsers } from "./hooks/use-all-users";
import { UserPageHeader } from "./components/UserPageHeader";
import { UserFilterBar } from "./components/UserFilterBar";
import { UserTable } from "./components/UserTable";
import { AddAdminDialog } from "./components/AddAdminDialog";
import { AdminDetailDialog } from "./components/AdminDetailDialog";
import { DeleteAdminDialog } from "./components/DeleteAdminDialog";

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<AdminRoleAPI | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUserAPI | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading } = useAllUsers();
  const users = data?.data ?? [];

  const filteredAdmins = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        fullName.includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        String(user.id).includes(normalizedSearch);
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchTerm]);

  const handleDetailClick = (admin: AdminUserAPI) => {
    setSelectedAdmin(admin);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (admin: AdminUserAPI) => {
    setSelectedAdmin(admin);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <UserPageHeader onAddClick={() => setIsAddOpen(true)} />
      <UserFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />
      <UserTable
        admins={filteredAdmins}
        onDetailClick={handleDetailClick}
        onDeleteClick={handleDeleteClick}
        isLoading={isLoading}
      />
      <AddAdminDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      <AdminDetailDialog
        admin={selectedAdmin}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
      <DeleteAdminDialog
        admin={selectedAdmin}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
}
