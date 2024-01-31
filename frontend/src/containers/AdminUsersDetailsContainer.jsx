import React, { useState, useEffect, useMemo } from "react";
import axios from "../axios/axios";
import {
  Box,
  Text,
  List,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Table,
  TableContainer,
  Thead,
  Tr,
  Td,
  Tbody,
  Th,
  Wrap,
  Input,
  Select,
  Button,
  Skeleton,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";
import TaskTable from "../components/TaskTable";

export default function AdminUsersDetailsContainer() {
  const [userTasks, setUserTasks] = useState([]);
  const [totalHours, setTotalHours] = useState("");
  const [searchClientName, setSearchClientName] = useState("");
  const [filterTaskCode, setFilterTaskCode] = useState("");
  const { user_id } = useParams();
  const [user, setUser] = useState();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [groupedTasks, setGroupedTasks] = useState({});

  const filteredUserTasks = useMemo(
    () =>
      userTasks.filter((task) => {
        // Filtrer les tâches en fonction du nom du client
        return task.client_name.toLowerCase().includes(searchClientName.toLowerCase());
      }),
    [searchClientName, userTasks]
  );
  useEffect(() => {
    // Fetch tasks for the selected user

    axios
      .get(`/admin/get/user_task?user_id=${user_id}`)
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
  }, [user_id]);

  useEffect(() => {
    //Get user from id
    axios
      .get(`/users/${user_id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [user_id]);

  useEffect(() => {
    // Filtrer les tâches en fonction de la date sélectionnée
    const filteredTasks = filteredUserTasks.filter((task) => {
      return task.date === format(selectedDate, "yyyy-MM-dd");
    });

    // Update groupedTasks based on the filtered tasks
    const updatedGroupedTasks = filteredTasks.reduce((groups, task) => {
      const date = task.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {});

    setGroupedTasks(updatedGroupedTasks);

    // Calculer le total des heures sur les tâches filtrées
    const total = filteredTasks.reduce((acc, task) => acc + parseFloat(task.time_spent), 0);
    const totalFormatted = formatHoursAndMinutes(total / 60);
    setTotalHours(totalFormatted);
  }, [selectedDate, filteredUserTasks]);

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

  const handleDateChange = (selectedDate) => {
    // Ensure that selectedDate is a Date object
    const dateObject = selectedDate instanceof Date ? selectedDate : format(new Date(selectedDate), "yyyy-MM-dd");

    setSelectedDate(dateObject);
  };

  return (
    <Box>
      <Stack direction={"row"}>
        <Stack direction={"column"}>
          <Stack width={"100%"} direction={"row"}>
            <Breadcrumb spacing="8px" mb={4}>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to={"/admin/users"}>
                  Utilisateurs
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>{user ? user.prénom : <Skeleton as={"span"} display={"block"} height={"1em"} width={"70px"}></Skeleton>}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Stack>
          <Stack direction={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"start"} mb={2}>
            <Stack direction={"column"}>
              <Text fontSize={"md"} fontWeight={"bold"}>
                Tâches de {user ? user.prénom : <Skeleton as={"span"} height={"1em"} width={"70px"}></Skeleton>}
              </Text>
              {/* Display selected date */}
              <Text fontSize={"md"} fontWeight={"bold"}>
                {format(selectedDate, "yyyy-MM-dd")}
              </Text>
              {/* Display tasks for the selected date */}
              {groupedTasks[selectedDate] ? (
                // <TableContainer>
                //   <Table variant={"simple"} mt={3}>
                //     <Thead>
                //       <Tr>
                //         <Th>Client</Th>
                //         <Th>Tâche</Th>
                //         <Th>Code</Th>
                //         <Th>Temps passé</Th>
                //       </Tr>
                //     </Thead>
                //     <Tbody>
                //       {groupedTasks[selectedDate].map((task) => (
                //         <Tr key={task.id}>
                //           <Td>{task.client_name}</Td>
                //           <Td>{task.task_name}</Td>
                //           <Td>{task.task_code}</Td>
                //           <Td>{formatHoursAndMinutes(task.time_spent / 60)}</Td>
                //         </Tr>
                //       ))}
                //     </Tbody>
                //   </Table>
                // </TableContainer>
                <TaskTable userTasks={groupedTasks[selectedDate]} />
              ) : (
                <Text color={"red"}>Aucune tâche effectuée à ce jour</Text>
              )}
            </Stack>

            <Stack width={"20%"} direction={"column"}>
              <Text fontSize={"md"} fontWeight={"bold"}>
                Filtres
              </Text>
              <List spacing={3} mt={4}>
                <Wrap spacing={3}>
                  <Input placeholder="Rechercher un client" type="text" id="searchClient" value={searchClientName} onChange={(e) => setSearchClientName(e.target.value)} />
                  <Select placeholder="Filtrer par code" value={filterTaskCode} onChange={(e) => setFilterTaskCode(e.target.value)}>
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
                    width={"min-content"}
                    colorScheme={"transparent"}
                    color={"black"}
                    _hover={{ outline: " solid 1px" }}
                    onClick={filterAndCalculateTotal}
                    size={"sm"}
                    borderRadius={"5px"}
                  >
                    Filter & Calculate Total
                  </Button>
                  <label htmlFor="selectDate">Rechercher par date : </label>
                  <Input type="date" id="selectDate" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} />
                </Wrap>
              </List>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
