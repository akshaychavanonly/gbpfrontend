"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/locations": "Locations",
  "/posts": "Posts",
  "/posts/create": "Create Post",
  "/posts/preview": "Post Preview",
};

export default function Navbar() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }

    if (pathname.startsWith("/posts/") && pathname.includes("/edit")) {
      return "Edit Post";
    }

    return "GBP Post Manager";
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {getPageTitle()}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage your Google Business Profile posts
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* <Link
          href="/posts/create"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          + Create Post
        </Link> */}
      </div>
    </header>
  );
}
