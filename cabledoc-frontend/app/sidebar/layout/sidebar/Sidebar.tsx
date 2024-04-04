import { useMediaQuery, Box, Drawer } from "@mui/material";
import Logo from "../shared/logo/Logo";
import SidebarItems from "./SidebarItems";
import { Upgrade } from "./Updrade";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
  darkTheme: boolean; // Variable für Dark-Modus
}

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  darkTheme,
  isSidebarOpen,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const darkBackgroundColor = darkTheme ? "#333" : "white";
  const darkTextColor = darkTheme ? "white" : "black";
  const sidebarWidth = "260px";

  const scrollbarStyle = `
    ::-webkit-scrollbar {
      width: 12px;
      margin: 2px 0; /* Oben und unten 2px Abstand */
    }
   
    ::-webkit-scrollbar-thumb {
      
      border-radius: 6px;
      border: 3px solid ${darkBackgroundColor};
    }
    
  `;

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          borderRadius: "14px",
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          onClose={onSidebarClose}
          variant={isMobileSidebarOpen ? "temporary" : "permanent"}
          PaperProps={{
            sx: {
              boxShadow: "0 9px 17.5px rgb(0,0,0,0.05)",
              backgroundColor: darkBackgroundColor, // Hintergrundfarbe anpassen
              color: darkTextColor, // Textfarbe anpassen
              width: sidebarWidth,
              boxSizing: "border-box",
              borderRight: 0,
              top: 20,
              left: 20,
              bottom: 20,
              borderRadius: "25px",
              height: "calc(100% - 40px)",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "12px",
                margin: "13px 0", // 2px Abstand über und unter der Scroll-Leiste
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
                margin: "13px 0",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "6px",
                border: `3px solid ${darkBackgroundColor}`,
                margin: "13px 0",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                margin: "13px 0",
              },
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: "100%",
            }}
          >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <Box pt={2} pl={3}>
              <Logo />
            </Box>
            <Box>
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
              <Upgrade />
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[15],
          "&::-webkit-scrollbar": {
            width: "12px",
            margin: "2px 0", // 2px Abstand über und unter der Scroll-Leiste
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "6px",
            border: `3px solid ${darkBackgroundColor}`,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box p={2}>
        <Logo />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems />
      <Upgrade />
    </Drawer>
  );
};

export default Sidebar;
