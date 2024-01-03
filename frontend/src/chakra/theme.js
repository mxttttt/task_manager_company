import { extendTheme } from "@chakra-ui/react";
import "@fontsource-variable/dm-sans";

const theme = extendTheme({
  fonts: {
    heading: `'DM Sans Variable', sans-serif`,
    body: `'DM Sans Variable', sans-serif`,
  },
});

export default theme;
