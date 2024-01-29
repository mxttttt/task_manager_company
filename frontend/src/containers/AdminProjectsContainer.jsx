import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import { Box, Stack, Table, Text, Thead, Tbody, Th, Tr, TableContainer, Td, Skeleton, Checkbox, Input, List, Button, Wrap, Select, useQuery } from "@chakra-ui/react";
import { Link, useSearchParams } from "react-router-dom";

export default function AdminProjectsContainer() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedProject, setSelectedProject] = useState(new Set());
  // const [searchClientName, setSearchClientName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  console.log(searchParams);
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

    // Fetch the list of clients from the server
    axios
      .get("/clients")
      .then((response) => {
        setClients(response.data.clients);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }, []);

  const handleCheckboxChange = (projectId) => {
    setSelectedProject((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(projectId)) {
        newSelected.delete(projectId);
      } else {
        newSelected.add(projectId);
      }
      return newSelected;
    });
  };

  const formatHoursAndMinutes = (hours) => {
    let formattedTime = `${Math.floor(hours)}h`;

    const decimalHours = hours - Math.floor(hours);
    const minutes = Math.round(decimalHours * 60);

    if (minutes > 0) {
      formattedTime += ` ${minutes} minutes`;
    }

    return formattedTime;
  };

  const filterProjects = (projects) => {
    return projects.filter((project) => {
      const clientName = project.client_name.toLowerCase();
      const projectName = project.nom.toLowerCase();
      const searchClientId = searchParams.get("id_client") || "";

      const searchQueryStr = searchParams.get("q") ?? "";
      let result = true;
      if (searchClientId !== "") result = result && project.id_client === parseInt(searchClientId, 10);
      if (searchQueryStr !== "") result = result && (clientName.includes(searchQueryStr.toLowerCase()) || projectName.includes(searchQueryStr.toLowerCase()));
      return result;
    });
  };

  const calculateCumulativeTime = () => {
    const totalTime = Array.from(selectedProject).reduce((total, projectId) => {
      const project = projects.find((p) => p.id === projectId);
      return total + (project ? project.time_spent : 0);
    }, 0);
    return formatHoursAndMinutes(totalTime / 60);
  };

  return (
    <Box width={"auto"}>
      <Text textAlign={"center"} fontSize={"md"} fontWeight={"bold"} pb={3}>
        Liste des projets
      </Text>
      <Stack direction={"row"} display={"flex"} width={"auto"} justifyContent={"space-around"} alignItems={"start"} mb={2}>
        <Stack direction={"column"} display={"flex"} width={"min-content"}>
          <TableContainer width={"full"}>
            <Table variant="simple" width={"full"}>
              <Thead>
                <Tr>
                  <Th>Selectionné</Th>
                  <Th>Projet</Th>
                  <Th>Client</Th>
                  <Th>Temps Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {projects.length > 0 ? (
                  filterProjects(projects).map((project) => (
                    <Tr key={project.id}>
                      <Td>
                        <Checkbox isChecked={selectedProject.has(project.id)} onChange={() => handleCheckboxChange(project.id)} />
                      </Td>
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
                      <Skeleton as={Td} height={"20px"} />
                      <Skeleton as={Td} height={"20px"} />
                      <Skeleton as={Td} height={"20px"} />
                    </Tr>
                    <Tr>
                      <Skeleton as={Td} height={"20px"} />
                      <Skeleton as={Td} height={"20px"} />
                      <Skeleton as={Td} height={"20px"} />
                    </Tr>
                  </>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
        {/* <Stack direction={"column"} width={"20%"}>
          <Center>
            <Text fontSize={"md"} fontWeight={"bold"}>
              Temps cumulé
            </Text>
          </Center>
          <Center>
            <Text fontSize={"md"} fontWeight={"bold"}>
              {calculateCumulativeTime()}
            </Text>
          </Center>
        </Stack> */}
        <Stack width={"max-content"} direction={"column"}>
          <List spacing={3} mt={2}>
            <Wrap spacing={3} mt={2}>
              <Text fontSize={"md"} fontWeight={"bold"}>
                Temps cumulé
              </Text>
              <Text fontSize={"md"} fontWeight={"400"}>
                {calculateCumulativeTime()}
              </Text>
            </Wrap>
          </List>
        </Stack>
      </Stack>
      <Stack direction={"row"} display={"flex"} justifyContent={"center"}>
        <Stack direction={"column"}>
          <Button onClick={() => setShowFilters(!showFilters)} mt={4} mb={4}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          {showFilters && (
            <>
              <Input
                type="text"
                placeholder="Rechercher un projet"
                value={searchParams.get("q") ?? ""}
                onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), q: e.target.value })}
                mb={4}
              />

              <Text fontSize={"md"} fontWeight={"bold"}>
                Filtrer par client
              </Text>
              <Select
                placeholder="Filtrer par client"
                value={searchParams.get("id_client") ?? ""}
                onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), id_client: e.target.value })}
              >
                {/* get the all the client from the db */}
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.client_name}
                  </option>
                ))}
              </Select>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
