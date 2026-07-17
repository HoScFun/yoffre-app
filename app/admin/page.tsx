import type { Metadata } from "next";
import AdminView from "@/views/Admin";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false },
};

export default function AdminPage() {
  return <AdminView />;
}
