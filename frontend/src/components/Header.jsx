import React from "react";

import { Heading } from "@chakra-ui/react";

export const Header = ({ fontSize = "xl", children }) => (
  <Heading
    as={"h2"}
    zIndex={"1"}
    position={"relative"}
    fontSize={fontSize}
    color="blue.900"
    ml={"12px"}
    width={"max-content"}
    _before={{
      zIndex: "-1",
      content: '""',
      width: "100%",
      height: "40%",
      backgroundColor: "orange.900",
      position: "absolute",
      left: "5px",
      top: "50%",
      opacity: "0.6",
      borderRadius: "90px",
    }}
  >
    {children}
  </Heading>
);
