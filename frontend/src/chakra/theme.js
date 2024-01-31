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
  sizes: {
    sm: "0.6rem",
    md: "0.8rem",
    "2md": "0.9rem",
    lg: "1rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    "4xl": "2.25rem",
  },

  fonts: {
    heading: `'DM Sans Variable', sans-serif`,
    body: `'DM Sans Variable', sans-serif`,
  },
  colors: {
    blue: {
      50: "#1a13a81a",
      100: "#1a13a833",
      200: "#1a13a84D",
      300: "#1a13a866",
      400: "#1a13a880",
      500: "#1a13a899",
      600: "#1a13a8B3",
      700: "#1a13a8CC",
      800: "#1a13a8E6",
      900: "#1a13a8FF",
    },
  },
});

export default theme;
