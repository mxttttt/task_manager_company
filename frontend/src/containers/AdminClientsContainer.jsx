import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import { Box, Text, Stack, List } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import ClientListHStack from "../components/ClientListHStack";

export default function AdminClientsContainer() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Fetch the list of clients from the server
    axios
      .get("/clients")
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }, []);

  return (
    <Box>
      {/* Content for Clients tab */}
      <Text fontSize={"md"} fontWeight={"bold"}>
        Liste des clients
      </Text>
      {/* get all the client in a list of button */}

      <Stack direction={"column"}>
        <List spacing={3} mt={6}>
          {clients.length > 0 ? (
            clients.map((client) => <ClientListHStack key={client.id} client={client} as={Link} to={`/admin/projects?id_client=${client.id}`} />)
          ) : (
            <>
              <ClientListHStack />
              <ClientListHStack />
              <ClientListHStack />
            </>
          )}
        </List>
      </Stack>
    </Box>
  );
}
