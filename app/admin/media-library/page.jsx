import AdminShell from "@/components/layout/AdminShell";
import EmptyState from "@/components/ui/EmptyState";
import { ImageIcon } from "lucide-react";

export default function MediaLibraryPage() {
  return (
    <AdminShell title="Media Library">
      <EmptyState
        icon={ImageIcon}
        title="Your media lives here"
        description="Upload images and video once, then reuse them across the Hero, Banner, and Video blocks in the Homepage Builder."
      />
    </AdminShell>
  );
}
