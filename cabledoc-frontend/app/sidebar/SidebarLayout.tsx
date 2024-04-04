"use client";
import React, { useEffect, useState, FC, ReactNode } from "react";
import Navbar from "./Navbar"; // Passen Sie die Importpfade entsprechend an

import { useUserStore } from "../api/user"; // Passen Sie den Importpfad entsprechend an
import type { NavbarConfig } from "../../util/types/navbar"; // Passen Sie den Importpfad entsprechend an
import "./SidebarLayout.css"; // Passen Sie den Importpfad entsprechend an

import Sidebar from "@/app/sidebar/layout/sidebar/Sidebar";
import { applyTheme } from "./tailwindStyles"; // Stellen Sie sicher, dass der Importpfad korrekt ist

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
  const { user } = useUserStore();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [navProperties, setNavProperties] = useState<NavbarConfig>({
    navbar: {
      height: "16", // 64px
    },
    sidebar: {
      width: "56", // 14rem
      minWidth: "16",
    },
  });
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    // Hier könnte Logik eingefügt werden, falls Sie eine benutzerdefinierte Navigation oder einen Seitenwechsel benötigen,
    // z.B. wenn der Benutzerstatus ungültig ist. Dies könnte über eine globale Zustandsverwaltung oder Kontexte gehandhabt werden.
    // Beispiel: if (!user) { customNavigate('/login'); }
  }, [user]);

  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
    const el = document.getElementsByTagName("body")[0];
    if (!darkTheme) {
      el?.classList.add(applyTheme("dark")); // Verwenden Sie applyTheme für dark
    } else {
      el?.classList.remove(applyTheme("light")); // Verwenden Sie applyTheme für light
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  // Funktion zum Anwenden der Klassen basierend auf dem darkTheme-Zustand

  return (
    <>
      <div className={`${darkTheme ? "dark" : ""} flex min-h-screen`}>
        <Navbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          darkTheme={darkTheme}
          toggleTheme={toggleTheme}
          navProperties={navProperties}
        />
        <div className="flex flex-grow">
          <div className="shadow-2xl">
            <Sidebar
              darkTheme={darkTheme}
              isMobileSidebarOpen={isMobileSidebarOpen}
              onSidebarClose={(
                event: React.MouseEvent<HTMLElement, MouseEvent>
              ): void => {
                throw new Error("Function not implemented.");
              }}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
          <div className="flex flex-col mt-20 ml-6 items-center flex-grow">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;
