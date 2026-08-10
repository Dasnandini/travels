"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function ClientLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("[Logout Error]:", error);
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      isLoading={loading}
      className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 gap-1.5"
    >
      <LogOut className="h-4 w-4 text-slate-400" />
      <span>Sign Out</span>
    </Button>
  );
}
