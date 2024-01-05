import React, { useState, useEffect} from "react";
import axios from "../axios/axios";
import { Box, Text } from "@chakra-ui/react";


export default function AdminClientsContainer(){
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

    return(
        <Box>
                  {/* Content for Clients tab */}
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    Liste des clients
                  </Text>
                  {/* ... add more JSX for Clients tab */}
                </Box>
    );
}