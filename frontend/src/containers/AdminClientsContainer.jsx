import React, { useState, useEffect, useMemo } from "react";
import axios from "../axios/axios";
import { Box, Text, Stack, List, Center, Button } from "@chakra-ui/react";
import { Link, useSearchParams } from "react-router-dom";

import ClientListHStack from "../components/ClientListHStack";

export default function AdminClientsContainer() {
  const [clients, setClients] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = useMemo(() => Number(searchParams.get("page")) || 1, [searchParams]);
  const [totalPages, setTotalPages] = useState();
  useEffect(() => {
    // Fetch the list of clients from the server
    axios
      .get("/clients?page=" + page)
      .then((response) => {
        setClients(response.data.clients);
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }, [page]);

  return (
    <Box>
      {/* Content for Clients tab */}
      <Text fontSize={"md"} fontWeight={"bold"} textAlign={"center"}>
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
        {/* Pagination Button Number */}
        <Center>
          <Stack direction={"row"} spacing={3} mt={6}>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                variant={"outline"}
                as={Link}
                key={index}
                to={`/admin/clients?page=${index + 1}`}
                px={6}
                color={index + 1 === page ? "white" : "black"}
                background={index + 1 === page ? "blue.900" : "transparent"}
                _hover={{ bg: "blue.900", color: "white" }}
              >
                {index + 1}
              </Button>
            ))}
          </Stack>
        </Center>
      </Stack>
    </Box>
  );
}
