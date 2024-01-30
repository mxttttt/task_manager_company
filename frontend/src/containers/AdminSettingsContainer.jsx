import React, { useState, useEffect, useMemo } from "react";
import axios from "../axios/axios";
import { Box, Text, Stack, List, Center, Button } from "@chakra-ui/react";

export default function AdminClientsContainer() {
  const [message, setMessage] = useState("");

  function handleClickToSyncClientAndProject() {
    axios
      .get("/asana/sync-client")
      .then((response) => {
        setMessage("Synchronisation des clients et des projets effectuée avec succès");
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
        setMessage("Erreur lors de la synchronisation des clients et des projets");
      });
  }

  return (
    <Box>
      <Text fontSize={"md"} fontWeight={"bold"} textAlign={"center"}>
        Paramètres
      </Text>
    </Box>
  );
}
