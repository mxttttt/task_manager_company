import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import { Box, Text, List, Stack, Heading, HStack, Wrap, WrapItem } from "@chakra-ui/react";

import UserListHStack from "../components/UserListHStack";
import { Link } from "react-router-dom";

export default function AdminUsersContainer() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the list of users from the server
    axios
      .get("/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <Box width={"full"} ml={"20px"}>
      <Heading size={"md"} color="blue.900" ml={"12px"}>
        <Text>Liste des utilisateurs</Text>
      </Heading>
      {/* get all the users in a list of button */}
      <Stack direction={"row"}>
        <Wrap spacing={3} mt={6}>
          {users.length > 0 ? (
            users.map((user) => (
              <WrapItem>
                <UserListHStack key={user.id} user={user} as={Link} to={`/admin/users/${user.id}`} />
              </WrapItem>
            ))
          ) : (
            <>
              <UserListHStack />
              <UserListHStack />
              <UserListHStack />
            </>
          )}
        </Wrap>
      </Stack>
    </Box>
  );
}
