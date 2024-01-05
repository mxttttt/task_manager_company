import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import { Box, Stack, Table, Text, Thead, Tbody, Th, Tr, TableContainer, Td } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function AdminProjectsContainer() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch the list of projects from the server
    axios
      .get("/projects")
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);
  const formatHoursAndMinutes = (hours) => {
    let formattedTime = `${Math.floor(hours)}h`;

    const decimalHours = hours - Math.floor(hours);
    const minutes = Math.round(decimalHours * 60);

    if (minutes > 0) {
      formattedTime += ` ${minutes} minutes`;
    }

    return formattedTime;
  };

  return (
    <Box width={"full"}>
      <Text fontSize={"md"} fontWeight={"bold"}>
        Liste des projets
      </Text>
      <Stack direction={"column"} width={"full"} display={"flex"}>
        <TableContainer width={"full"}>
          <Table variant="simple" width={"full"}>
            <Thead>
              <Tr>
                <Th>Projet</Th>
                <Th>Client</Th>
                <Th>Temps Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Tr key={project.id}>
                    <Td>
                      <Link to={`/admin/projects/${project.id}`}>{project.nom}</Link>
                    </Td>
                    <Td>{project.client_name}</Td>
                    <Td>{formatHoursAndMinutes(project.time_spent / 60)}</Td>
                  </Tr>
                ))
              ) : (
                <>
                  <Tr>
                    <Th>...</Th>
                    <Th>...</Th>
                    <Th>...</Th>
                    <Th>...</Th>
                  </Tr>
                  <Tr>
                    <Th>...</Th>
                    <Th>...</Th>
                    <Th>...</Th>
                    <Th>...</Th>
                  </Tr>
                  <Tr>
                    <Th>...</Th>
                    <Th>...</Th>
                    <Th>...</Th>
                    <Th>...</Th>
                  </Tr>
                </>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}
