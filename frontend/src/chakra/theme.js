import { extendTheme } from "@chakra-ui/react";
import "@fontsource-variable/dm-sans";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        bg: "gray.50",
      },
    },
  },
  fonts: {
    heading: `'DM Sans Variable', sans-serif`,
    body: `'DM Sans Variable', sans-serif`,
  },
});

export default theme;
