export type AdminRole = "admin" | "superAdmin";

export type AdminRoleAPI = "ADMIN" | "SUPER_ADMIN";

export type AdminUserAPI = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRoleAPI;
  lastLogin: string | null;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLogin: string;
  phone: string;
  line?: string;
  teams: string[];
};

export const adminUsers: AdminUser[] = [
  {
    id: "USR-001",
    firstName: "สมชาย",
    lastName: "ใจดี",
    name: "สมชาย ใจดี",
    email: "somchai@yoye.co",
    role: "superAdmin",
    lastLogin: "2026-02-23 09:15",
    phone: "089-123-4567",
    line: "somchai.line",
    teams: ["Events", "Finance"],
  },
  {
    id: "USR-002",
    firstName: "สมหญิง",
    lastName: "รักดี",
    name: "สมหญิง รักดี",
    email: "somying@yoye.co",
    role: "admin",
    lastLogin: "2026-02-22 17:48",
    phone: "081-222-4444",
    teams: ["Users"],
  },
  {
    id: "USR-003",
    firstName: "วิชัย",
    lastName: "มั่นคง",
    name: "วิชัย มั่นคง",
    email: "wichai@yoye.co",
    role: "admin",
    lastLogin: "2026-02-21 13:22",
    phone: "085-333-1111",
    line: "wichai.support",
    teams: ["Events", "Support"],
  },
  {
    id: "USR-004",
    firstName: "มานี",
    lastName: "สุขใจ",
    name: "มานี สุขใจ",
    email: "manee@yoye.co",
    role: "superAdmin",
    lastLogin: "2026-02-20 08:05",
    phone: "082-555-9999",
    teams: ["Finance", "Users"],
  },
];

export const roleBadge: Record<AdminRole, string> = {
  admin: "bg-blue-100 text-blue-800",
  superAdmin: "bg-purple-100 text-purple-800",
};
