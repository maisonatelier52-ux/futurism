import { ToastProvider } from "@/components/ui/Toast";
import "./admin-globals.css";

export const metadata = {
  title: "Futurism Admin",
  description: "Futurism CMS Admin Panel",
};

export default function AdminRootLayout({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
