"use client";

import { createTheme } from "@mui/material/styles";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Theme } from "@mui/material/styles";

export const plus = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const baselightTheme = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#4CAF50", // Green 500
      light: "#C8E6C9", // Green 100
      dark: "#388E3C", // Green 700
    },
    secondary: {
      main: "#707a82", // This can remain as is or be adjusted to complement the new primary color
      light: "#e7ecf0", // This can remain as is or be adjusted based on your design requirements
      dark: "#707a82", // This can remain as is or be adjusted to complement the new primary color
    },
    success: {
      main: "#81C784", // Light Green 400
      light: "#C8E6C9", // Light Green 100
      dark: "#388E3C", // Green 700, reused for consistency in success scenarios
      contrastText: "#ffffff",
    },
    info: {
      main: "#4dd0e1", // Cyan 300, adjusted to blend well with green tones
      light: "#b2ebf2", // Cyan 100, for a lighter infotone
      dark: "#00838f", // Cyan 700, for darker info scenarios
      contrastText: "#ffffff",
    },
    error: {
      main: "#fb977d", // This can remain as is for contrast
      light: "#ffede9", // This can remain as is for lighter error scenarios
      dark: "#fb977d", // This can remain as is for darker error messages
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f8c076", // This can remain as is for contrast
      light: "#fff6ea", // This can remain as is for lighter warning messages
      dark: "#f8c076", // This can remain as is for darker warning messages
      contrastText: "#ffffff",
    },
    grey: {
      100: "#F2F6FA",
      200: "#f0f5f9",
      300: "#DFE5EF",
      400: "#7C8FAC",
      500: "#5A6A85",
      600: "#111c2d",
    },
    text: {
      primary: "#111c2d",
      secondary: "#111c2d",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
    divider: "#e5eaef",
    background: {
      default: "#F0F5F9",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: plus.style.fontFamily,
    h1: {
      fontWeight: 600,
      fontSize: "2.25rem",
      lineHeight: "2.75rem",
      fontFamily: plus.style.fontFamily,
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.875rem",
      lineHeight: "2.25rem",
      fontFamily: plus.style.fontFamily,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: "1.75rem",
      fontFamily: plus.style.fontFamily,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.3125rem",
      lineHeight: "1.6rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: "1.6rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: "1.2rem",
    },
    button: {
      textTransform: "capitalize",
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "1.334rem",
    },
    body2: {
      fontSize: "0.75rem",
      letterSpacing: "0rem",
      fontWeight: 400,
      lineHeight: "1rem",
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow: "0 9px 17.5px rgb(0,0,0,0.05) !important",
        },
        ".rounded-bars .apexcharts-bar-series.apexcharts-plot-series .apexcharts-series path":
          {
            clipPath: "inset(0 0 5% 0 round 20px)",
          },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "18px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          borderRadius: "25px",
        },
        text: {
          padding: "5px 15px",
        },
      },
    },
  },
});

export { baselightTheme };
