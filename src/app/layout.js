import { AuthProvider } from "@/context/AuthContext";

import "./globals.css";

export const metadata = {
  title: "GBP Post Manager",
  description: "AI-powered Google Business Profile post management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
