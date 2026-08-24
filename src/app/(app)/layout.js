"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext";

export default function AppLayout({ children }) {
  const router = useRouter();

  const { isAuthenticated, loading } = useAuth();

  /*
   * Redirect unauthenticated users
   * to the login page.
   */
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  /*
   * While AuthContext is checking localStorage,
   * show a loading state.
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader text="Checking authentication..." />
      </div>
    );
  }

  /*
   * Prevent protected page content from
   * flashing before redirect.
   */
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
