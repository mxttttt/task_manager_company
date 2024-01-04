import React, { useState, useEffect } from "react";
import Axios from "axios";
import { format } from "date-fns";
import {
  Button,
  Card,
  CardBody,
  Container,
  HStack,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  List,
  Wrap,
  Avatar,
  Input,
  Select,
} from "@chakra-ui/react";

function AdminHomePage() {
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [searchClientName, setSearchClientName] = useState("");
  const [filterTaskCode, setFilterTaskCode] = useState("");
  const [totalHours, setTotalHours] = useState("");

  useEffect(() => {
    // Fetch the list of users from the server
    Axios.get("http://localhost:3002/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch tasks for the selected user
    if (selectedUser) {
      Axios.get(`http://localhost:3002/admin/get/user_task?user_id=${selectedUser}`)
        .then((response) => {
          const tasksWithDate = response.data.map((task) => ({
            ...task,
            date: format(new Date(task.created_at), "yyyy-MM-dd"),
          }));
          setUserTasks(tasksWithDate);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    }
  }, [selectedUser]);

  const filteredUserTasks = userTasks.filter((task) => {
    // Filtrer les tâches en fonction du nom du client
    return task.client_name.toLowerCase().includes(searchClientName.toLowerCase());
  });

  const filterAndCalculateTotal = () => {
    // Filtrer les tâches en fonction du code de tâche
    const filteredTasks = filteredUserTasks.filter((task) => (filterTaskCode ? task.task_code === filterTaskCode : true));

    // Calculer le total des heures sur les tâches filtrées
    const total = filteredTasks.reduce((acc, task) => acc + parseFloat(task.time_spent), 0);
    const totalFormatted = formatHoursAndMinutes(total / 60);
    setTotalHours(totalFormatted);
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

  // Grouper les tâches par date
  const groupedTasks = filteredUserTasks.reduce((groups, task) => {
    const date = task.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  return (
    <Container width={"full"} maxWidth={"none"} height={"80vh"} p={"20px"}>
      <Container height={"100%"} width={"full"} maxWidth={"unset"}>
        <HStack display={"flex"} w={"min-content"} padding={"5px"} borderRadius={"5px"} direction={"row"}>
          <Heading color={"#1a13a8"}>
            Dashboard <Text fontSize={"md"}>Administrateur</Text>
          </Heading>
        </HStack>
        <Stack direction={"row"} spacing={5} mt={"20px"} height={"100%"}>
          <Card direction={"column"} width={"20%"} height={"100%"} borderRadius={"5px"}>
            <CardBody>
              <Text fontSize={"md"} fontWeight={"bold"}>
                Choisissiez un utilisateur
              </Text>
              {/* list user with List component */}
              <Stack direction={"column"}>
                <List spacing={3} mt={6}>
                  {users.map((user) => (
                    <Wrap key={user.id} spacing={3} mt={6}>
                      <Button
                        display={"flex"}
                        justifyContent={"left"}
                        width={"60%"}
                        colorScheme={"transparent"}
                        color={"black"}
                        _hover={{ outline: " solid 1px" }}
                        onClick={() => setSelectedUser(user.id)}
                        size={"sm"}
                        borderRadius={"5px"}
                      >
                        <Avatar size={"xs"} name={user.prénom} src={user.avatar} mr={2} />
                        {user.prénom}
                      </Button>
                    </Wrap>
                  ))}
                </List>
              </Stack>
            </CardBody>
          </Card>
          <Card direction={"column"} width={"60%"} height={"100%"} borderRadius={"5px"}>
            <CardBody>
              <Text fontSize={"md"} fontWeight={"bold"}>
                Tâches effectuées
              </Text>
              <TableContainer>
                <Table variant={"simple"} mt={6}>
                  <Thead>
                    <Tr>
                      <Th>Nom du client</Th>
                      <Th>Devis N°</Th>
                      <Th>Nom de la tâche</Th>
                      <Th>Code de la tâche</Th>
                      <Th>Temps passé (heures)</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredUserTasks.map((task) => (
                      <Tr key={task.id}>
                        <Td>{task.client_name}</Td>
                        <Td>{task.devis_code}</Td>
                        <Td>{task.task_name}</Td>
                        <Td>{task.task_code}</Td>
                        <Td>{formatHoursAndMinutes(task.time_spent / 60)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
          {/* Filter column by task code or client name */}
          <Card direction={"column"} width={"20%"} height={"100%"} borderRadius={"5px"}>
            <CardBody>
              <Text fontSize={"md"} fontWeight={"bold"}>
                Filter
              </Text>
              <Stack direction={"column"}>
                <List spacing={3} mt={6}>
                  <Wrap spacing={3} mt={6}>
                    <label htmlFor="searchClient">Rechercher un client : </label>
                    <Input type="text" id="searchClient" value={searchClientName} onChange={(e) => setSearchClientName(e.target.value)} />
                    <Select placeholder="Filter by Task Code" value={filterTaskCode} onChange={(e) => setFilterTaskCode(e.target.value)}>
                      {/* get the all the task from the db */}
                      {userTasks.map((task) => (
                        <option key={task.id} value={task.task_code}>
                          {task.task_code}
                        </option>
                      ))}
                    </Select>

                    <Button
                      display={"flex"}
                      justifyContent={"left"}
                      width={"60%"}
                      colorScheme={"transparent"}
                      color={"black"}
                      _hover={{ outline: " solid 1px" }}
                      onClick={filterAndCalculateTotal}
                      size={"sm"}
                      borderRadius={"5px"}
                    >
                      Filter & Calculate Total
                    </Button>
                  </Wrap>
                </List>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </Container>
    </Container>
  );
}

export default AdminHomePage;
