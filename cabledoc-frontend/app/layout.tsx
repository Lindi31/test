"use client";

import "./globals.css";
import React, { useEffect } from "react";
import "@/app/sidebar/tailwindStyles";
import SidebarLayout from "@/app/sidebar/SidebarLayout";
import { ThemeProvider } from "@mui/material/styles";
import { baselightTheme } from "@/util/style/DefaultColors";
import { User } from "./api/user";
import { UserProvider } from "./api/usercontext";

interface RootLayoutProps {
  children: React.ReactNode;
  user: User; // User-Props hinzufügen
}

export default function RootLayout({ children, user }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ThemeProvider theme={baselightTheme}>
            <SidebarLayout>{children}</SidebarLayout>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
