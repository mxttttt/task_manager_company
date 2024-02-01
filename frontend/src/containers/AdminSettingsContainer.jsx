import React, { useState, useEffect, useMemo } from "react";
import axios from "../axios/axios";
import { Box, Text, Heading } from "@chakra-ui/react";
import { Header } from "../components/Header";

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
    <Box width={"full"} ml={"20px"}>
      <Header>Paramètres</Header>
    </Box>
  );
}
