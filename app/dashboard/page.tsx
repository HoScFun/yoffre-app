import type { Metadata } from "next";
import DashboardView from "@/views/Dashboard";

export const metadata: Metadata = {
  title: "Mes offres",
  robots: { index: false },
};

export default function DashboardPage() {
  return <DashboardView />;
}
