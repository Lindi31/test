import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cabledoc.app",
  appName: "cabledoc-frontend",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
