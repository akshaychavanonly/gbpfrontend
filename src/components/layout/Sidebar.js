"use client";

import { useState } from "react";
import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import {
  logoutUser,
} from "@/services/authService";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },

  {
    name: "Locations",
    href: "/locations",
  },

  {
    name: "Posts",
    href: "/posts",
  },

  {
    name: "Create Post",
    href: "/posts/create",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const {
    user,
    token,
    logout,
  } = useAuth();

  const [
    logoutLoading,
    setLogoutLoading,
  ] = useState(false);

  /*
   * Logout
   */
  const handleLogout = async () => {
    if (logoutLoading) {
      return;
    }

    setLogoutLoading(true);

    try {
      /*
       * Tell backend that the user
       * is logging out.
       */
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      /*
       * Even if the backend logout
       * request fails, clear local
       * authentication.
       *
       * Otherwise the user could become
       * stuck in a logged-in state.
       */
      console.error(
        "Logout API error:",
        error
      );
    } finally {
      /*
       * Remove:
       *
       * gbpUser
       * gbpToken
       */
      logout();

      setLogoutLoading(false);

      /*
       * Replace instead of push so
       * pressing Back doesn't immediately
       * return to the authenticated page.
       */
      router.replace("/login");
    }
  };

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    /*
     * Handle Create Post separately.
     *
     * Otherwise /posts/create would also
     * mark "Posts" as active.
     */
    if (href === "/posts") {
      return pathname === "/posts";
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="border-b border-slate-200 px-6 py-6">
        <Link href="/dashboard">
          <h1 className="text-xl font-bold text-slate-900">
            GBP Post Manager
          </h1>
        </Link>

        <p className="mt-1 text-xs text-slate-500">
          AI-powered post management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const active =
              isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logged-in User */}
      <div className="border-t border-slate-200 p-4">

        <div className="mb-4 rounded-lg bg-slate-50 p-3">

          <p className="text-sm font-semibold text-slate-900">
            {user?.name ||
              "Business User"}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {user?.email ||
              "No email available"}
          </p>

        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {logoutLoading
            ? "Logging out..."
            : "Logout"}
        </button>

      </div>
    </aside>
  );
}