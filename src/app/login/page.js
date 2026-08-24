"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
     * Frontend validation
     */
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * Call the real backend API
       */
      const data = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      /*
       * Store user + JWT using AuthContext
       */
      login(data.user, data.token);

      /*
       * Redirect to dashboard
       */
      router.push("/dashboard");
    } catch (err) {
      setError(
        err.message || "Unable to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#f0f4f9] px-4 py-8 sm:py-12">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[448px]">
          {/* Main Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-sm shadow-slate-200/60">
            {/* Header with App Logo & Title */}
            <div className="mb-8">
              {/* App Icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0b57d0] to-[#1a73e8] text-white shadow-sm shadow-blue-500/20">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-800 tracking-tight">
                    Business Profile Suite
                  </h2>
                  <p className="text-[11px] font-medium text-slate-400">
                    Post & Location Manager
                  </p>
                </div>
              </div>

              <h1 className="text-2xl font-normal text-slate-900 tracking-tight">
                Sign in
              </h1>

              <p className="mt-1.5 text-sm text-slate-600">
                to continue to Business Profile Suite
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-sm text-red-700">
                <svg
                  className="h-5 w-5 shrink-0 text-red-500 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs leading-relaxed font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email or phone"
                    autoComplete="email"
                    disabled={loading}
                    className="peer w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:border-[#0b57d0] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide */}
              <div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="peer w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:border-[#0b57d0] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between pt-6">
                <Link
                  href="/register"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[#0b57d0] hover:bg-blue-50/80 transition-colors"
                >
                  Create account
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-[#0b57d0] px-7 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-[#0842a0] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Material Footer */}
      <footer className="mx-auto w-full max-w-[448px] px-2 pt-6">
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <span>English (United States)</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:text-slate-800 transition">
              Help
            </span>
            <span className="cursor-pointer hover:text-slate-800 transition">
              Privacy
            </span>
            <span className="cursor-pointer hover:text-slate-800 transition">
              Terms
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
