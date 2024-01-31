import React from "react";
import { HStack, Skeleton, SkeletonCircle, Button, Avatar } from "@chakra-ui/react";

const UserListHStack = ({ user, onClick, ...props }) => {
  if (!user) {
    return (
      <HStack {...props}>
        <SkeletonCircle size="10" />
        <Skeleton height="10px" width="100px" />
      </HStack>
    );
  }
  return (
    <HStack key={user.id} {...props}>
      <Button
        key={user.id}
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
        <Avatar size={"sm"} name={user.nom + " " + user.prénom} color={"white"} src={user.picture} mr={"15px"} />
        {user.prénom}
      </Button>
    </HStack>
  );
};

export default UserListHStack;
