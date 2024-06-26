import { Box, Typography, Button } from "@mui/material";

import Link from "next/link";

export const Upgrade = () => {
  return (
    <Box display={"flex"} alignItems="center" gap={2} sx={{ m: 3 }}>
      <>
        <Button
          color="primary"
          target="_blank"
          disableElevation
          component={Link}
          href="https://calypso.intern.telemaxx.de/cabledoc/"
          variant="contained"
          aria-label="logout"
          size="large"
          sx={{ width: "100%" }}
        >
          <p className="text-white">CableDoc 1.0</p>
        </Button>
      </>
    </Box>
  );
};
