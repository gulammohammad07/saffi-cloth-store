"use client";

import dynamic from "next/dynamic";

const SubAdminManager = dynamic(() => import("./SubAdminManager"), {
  ssr: false,
  loading: () => (
    <div aria-busy="true" className="h-48 rounded-2xl border border-[#1C1A17]/10 bg-white" />
  ),
});

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export default function SubAdminManagerClient({
  users,
  currentUserRole,
}: {
  users: AdminUser[];
  currentUserRole?: string;
}) {
  return <SubAdminManager users={users} currentUserRole={currentUserRole} />;
}
