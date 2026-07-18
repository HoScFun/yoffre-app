import type { Metadata } from "next";
import ResetPasswordView from "@/views/ResetPasswordView";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
