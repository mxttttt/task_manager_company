import React from "react";
import { HStack, Skeleton, SkeletonCircle, Button, Avatar } from "@chakra-ui/react";

const ClientListHStack = ({ client, onClick, ...props }) => {
  if (!client) {
    return (
      <HStack {...props} w={"min-content"}>
        <SkeletonCircle size="10" />
        <Skeleton height="10px" width="100px" />
      </HStack>
    );
  }
  return (
    <HStack key={client.id} {...props} w={"min-content"} display={"flex"} justifyContent={"space-between"} alignItems={"left"}>
      <Button
        key={client.id}
        display={"flex"}
        justifyContent={"left"}
        width={"min-content"}
        colorScheme={"transparent"}
        color={"black"}
        _hover={{ outline: " solid 1px" }}
        size={"sm"}
        borderRadius={"5px"}
        onClick={onClick}
      >
        <Avatar size={"sm"} name={client.client_name} backgroundColor={"blue.900"} color={"white"} src="" mr={"15px"} />
        {client.client_name}
      </Button>
    </HStack>
  );
};

export default ClientListHStack;
