import React, { useState, useEffect} from "react";
import axios from "../axios/axios";
import { Box, Text, List, Stack } from "@chakra-ui/react";

import UserListHStack from "../components/UserListHStack";
import { Link } from "react-router-dom";

export default function AdminUsersContainer(){
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

    return(
        <Box>
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    Liste des utilisateurs
                  </Text>
                  {/* get all the users in a list of button */}
                  <Stack direction={"column"}>
                    <List spacing={3} mt={6}>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <UserListHStack
                            key={user.id}
                            user={user}
                            as={Link}
                            to={`/admin/users/${user.id}`}
                          />
                        ))
                      ) : (
                        <>
                          <UserListHStack />
                          <UserListHStack />
                          <UserListHStack />
                        </>
                      )}
                    </List>
                  </Stack>
                </Box>
    );
}