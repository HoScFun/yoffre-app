import type { Metadata } from "next";
import AccountView from "@/views/Account";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false },
};

export default function AccountPage() {
  return <AccountView />;
}
