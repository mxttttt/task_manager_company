import React, { useState, useEffect } from "react";
// import axios from "axios";
import axios from "../axios/axios";
import moment from "moment";
import { Button, Card, CardBody, Container, HStack, Stack, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import TaskForm from "../components/TaskForm";

function DevHomePage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [userTask, setUserTask] = useState([]);
  const [taskData, setTaskData] = useState({
    taskId: "",
    taskName: "",
    taskCode: "",
    timeSpent: "",
    clientName: "",
    projectName: "",
  });
  const [clients, setClients] = useState([]);
  const [clientProject, setClientProject] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const currentDate = moment();
  const formattedDate = currentDate.format("YYYY-MM-DD");
  const [timeRemaining, setTimeRemaining] = useState({ hours: 7, minutes: 0 });
  const [previousUserTasks, setPreviousUserTasks] = useState([]);
  useEffect(() => {
    fetchUserTasks();
    fetchTasks();
    fetchClients();
  }, [user]);
  const uniqueDates = [...new Set(previousUserTasks.map((task) => moment(task.created_at).format("YYYY-MM-DD")))];

  const fetchUserTasks = () => {
    axios
      .get(`/get/user_task?user_id=${user.id}`)
      .then((response) => {
        const today = moment();
        const todayDate = today.format("YYYY-MM-DD");

        // Separate tasks completed today and tasks completed on previous dates
        const tasksToday = response.data.filter((task) => moment(task.created_at).isSame(today, "day"));
        const tasksPreviousDates = response.data.filter((task) => !moment(task.created_at).isSame(today, "day"));

        setUserTask(tasksToday);

        setPreviousUserTasks(tasksPreviousDates);
      })
      .catch((error) => console.error("Error fetching user tasks:", error));
  };

  const fetchTasks = () => {
    axios
      .get(`/tasks?user_job_id=${user.user_job_id}`)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const fetchClients = () => {
    axios
      .get("/clients?limit=100")
      .then((response) => setClients(response.data.clients))
      .catch((error) => console.error("Error fetching clients:", error));
  };

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    const selectedTask = tasks.find((task) => task.id === parseInt(value, 10));

    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      [name]: value,
      taskName: selectedTask ? selectedTask.task_name : prevTaskData.taskName,
      taskCode: selectedTask ? selectedTask.task_code : prevTaskData.taskCode,
    }));
  };

  const parseTimeInput = (input) => {
    const regex = /(\d+)h(\d+)/;
    const match = regex.exec(input);

    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      return hours + minutes / 60;
    } else {
      return parseFloat(input);
    }
  };

  const handleAddTask = () => {
    const timeInHours = parseTimeInput(taskData.timeSpent);
    const timeSpent = timeInHours * 60;

    if (!taskData.taskId || !taskData.timeSpent || timeSpent <= 0 || !taskData.clientName || !taskData.projectName) {
      setErrorMessage("Vous devez remplir tous les champs !");
      return;
    }

    setErrorMessage("");

    axios
      .post("/user_task", {
        user_id: user.id,
        user_email: user.email,
        task_id: taskData.taskId,
        task_name: taskData.taskName,
        task_code: taskData.taskCode,
        time_spent: timeSpent,
        client: taskData.clientName,
        projet: taskData.projectName,
        date: formattedDate,
      })
      .then((response) => {
        fetchUserTasks();

        setTimeRemaining((prevTimeRemaining) => {
          const totalMinutes = prevTimeRemaining.hours * 60 + prevTimeRemaining.minutes;
          const updatedTotalMinutes = totalMinutes - timeSpent;

          const updatedHours = Math.floor(updatedTotalMinutes / 60);
          const updatedMinutes = updatedTotalMinutes % 60;

          return {
            hours: updatedHours,
            minutes: updatedMinutes,
          };
        });
      })
      .catch((error) => console.error("Error posting time spent:", error));
  };

  const handleDeleteTask = (taskUniqueId) => {
    axios
      .delete(`/user_task/${taskUniqueId}`)
      .then((response) => {
        fetchUserTasks();

        const deletedTask = userTask.find((task) => task.id === taskUniqueId);
        const deletedTimeSpent = deletedTask ? deletedTask.time_spent : 0;

        setTimeRemaining((prevTimeRemaining) => {
          const updatedHours = prevTimeRemaining.hours + Math.trunc(deletedTimeSpent / 60);
          const updatedMinutes = prevTimeRemaining.minutes + Math.round(deletedTimeSpent % 60);

          const adjustedHours = updatedMinutes >= 60 ? updatedHours + 1 : updatedHours;
          const adjustedMinutes = updatedMinutes >= 60 ? updatedMinutes - 60 : updatedMinutes;

          return {
            hours: adjustedHours,
            minutes: adjustedMinutes,
          };
        });
      })
      .catch((error) => console.error("Error deleting the task:", error));
  };

  const handleClientChange = (event) => {
    const selectedClientId = event.target.value;

    if (selectedClientId) {
      axios
        .get(`/project?client_id=${selectedClientId}`)
        .then((response) => {
          setClientProject(response.data);

          const selectedClient = clients.find((client) => client.id === parseInt(selectedClientId, 10));

          if (selectedClient) {
            setTaskData((prevTaskData) => ({
              ...prevTaskData,
              clientName: selectedClient.client_name,
            }));
          }
        })
        .catch((error) => console.error("Error fetching client's projects:", error));
    } else {
      setClientProject([]);
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        clientName: "",
        projectName: "",
      }));
    }
  };

  //TODO : A modifier pour afficher les projets du client selectionné
  const handleProjectChange = (event) => {
    const selectedProjectId = event.target.value;
    if (selectedProjectId) {
      const selectedProject = clientProject.find((project) => project.id === parseInt(selectedProjectId, 10));

      if (selectedProject) {
        setTaskData((prevTaskData) => ({
          ...prevTaskData,
          projectName: selectedProject.id,
        }));
      }
    } else {
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        projectName: "",
      }));
    }
  };

  const formatHoursAndMinutes = (hours, minutes) => {
    if (typeof hours === "object") {
      hours = hours.hours;
      minutes = hours.minutes;
    }

    if (hours === 0 && minutes === 0) {
      return "0 heure";
    } else if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else if (minutes === 0) {
      return `${hours} heure${hours !== 1 ? "s" : ""}`;
    } else {
      return `${hours} heure${hours !== 1 ? "s" : ""} et ${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
  };

  const calculateTotalTimeSpent = (tasks) => {
    return tasks.reduce((totalTime, task) => totalTime + parseFloat(task.time_spent), 0);
  };

  const totalCumulatedTime = calculateTotalTimeSpent(userTask) / 60;

  const markTaskAsDone = () => {
    axios
      .post("/task_done", {
        user_id: user.id,
        date: formattedDate,
      })
      .then((response) => {
        setUserTask((tasks) => tasks.map((task) => ({ ...task, completed: true })));
        setTimeRemaining({ hours: 7, minutes: 0 });
      })
      .catch((error) => console.error("Error marking all tasks as completed:", error));
  };

  const handleMarkAsCompleted = (taskId) => {
    axios
      .post("/mark_task_completed", {
        task_id: taskId,
      })
      .then((response) => {
        fetchUserTasks();
      })
      .catch((error) => console.error("Error marking task as completed:", error));
  };

  const activeUserTasks = userTask.filter((task) => task.completed === 0);

  return (
    <Container width={"full"} maxWidth={"none"} height={"80vh"} p={"20px"}>
      <Container height={"100%"} width={"full"} maxWidth={"unset"}>
        <Heading color={"#1a13a8"} paddingBottom={"15px"}>
          Dashboard <Text fontSize={"md"}>Développeur</Text>
        </Heading>
        <HStack>
          <Stack width={"full"}>
            {uniqueDates
              .filter((date) => previousUserTasks.some((task) => moment(task.created_at).isSame(date, "day") && !task.completed))
              .map((date) => (
                <Card display={"flex"} justifyContent={"center"} alignItems={"center"}>
                  <Heading as={"h3"} size={"md"} p={"15px"}>
                    Tâches créées le {moment(date).format("DD/MM/YYYY")} :
                  </Heading>

                  <TableContainer width={"full"} justifyContent={"center"} display={"flex"}>
                    <Table tablelayout="auto" width={"80%"} variant="simple">
                      <Thead width={"full"}>
                        <Tr width={"full"}>
                          <Th>Client : </Th>
                          <Th>Projets : </Th>
                          <Th>Tâche : </Th>
                          <Th>Code : </Th>
                          <Th>Temps : </Th>
                          <Th>Action : </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {previousUserTasks
                          .filter((task) => moment(task.created_at).isSame(date, "day") && !task.completed)
                          .map((task) => (
                            <Tr key={task.id} width={"full"}>
                              <Td>{task.client_name}</Td>
                              <Td>{task.nom}</Td>
                              <Td>{task.task_name}</Td>
                              <Td>{task.task_code}</Td>
                              <Td>{formatHoursAndMinutes(Math.floor(task.time_spent / 60), Math.round(task.time_spent % 60))}</Td>
                              <Td display={"flex"} justifyContent={"space-between"}>
                                <Button
                                  _hover={({ color: "black" }, { backgroundColor: "red.500" })}
                                  backgroundColor={"#D60620"}
                                  color={"white"}
                                  leftIcon={<DeleteIcon />}
                                  variant={"outline"}
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  Supprimer
                                </Button>
                                <Button backgroundColor={"lightgoldenrodyellow"} onClick={() => handleMarkAsCompleted(task.id)}>
                                  Terminer cette tâche
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Card>
              ))}

            <Card backgroundColor={"white"} display={"flex"} alignItems={"center"}>
              <Heading as={"h3"} size={"md"} p={"15px"}>
                Tâches effectuées :
              </Heading>
              {/* La table existante pour les tâches effectuées */}
              <TableContainer width={"full"} justifyContent={"center"} display={"flex"}>
                <Table tablelayout="auto" width={"80%"} variant="simple">
                  <Thead width={"full"}>
                    <Tr width={"full"}>
                      <Th>Client : </Th>
                      <Th>Projets : </Th>
                      <Th>Tâche : </Th>
                      <Th>Code : </Th>
                      <Th>Temps : </Th>
                      <Th>Action : </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {activeUserTasks.map((task) => (
                      <Tr key={task.id} width={"full"}>
                        <Td>{task.client_name}</Td>
                        <Td>{task.nom}</Td>
                        <Td>{task.task_name}</Td>
                        <Td>{task.task_code}</Td>
                        <Td>{formatHoursAndMinutes(Math.floor(task.time_spent / 60), Math.round(task.time_spent % 60))}</Td>
                        <Td>
                          <Button
                            _hover={({ color: "black" }, { backgroundColor: "red.500" })}
                            backgroundColor={"#D60620"}
                            color={"white"}
                            leftIcon={<DeleteIcon />}
                            variant={"outline"}
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Supprimer
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <p>
                Temps restant à effectuer:{" "}
                {timeRemaining.hours === 0 && timeRemaining.minutes === 0
                  ? "Vous avez atteint votre quota horaire pour la journée."
                  : formatHoursAndMinutes(timeRemaining.hours, timeRemaining.minutes)}
              </p>

              {timeRemaining.hours === 0 && timeRemaining.minutes === 0 && (
                <p>Total de votre journée : {formatHoursAndMinutes(Math.floor(totalCumulatedTime), Math.round((totalCumulatedTime % 1) * 60))}.</p>
              )}

              <TaskForm
                clients={clients}
                clientProject={clientProject}
                tasks={tasks}
                taskData={taskData}
                handleClientChange={handleClientChange}
                handleProjectChange={handleProjectChange}
                handleTaskChange={handleTaskChange}
                handleAddTask={handleAddTask}
              />
            </Card>
            <HStack display={"flex"} justifyContent={"center"}>
              <Button onClick={markTaskAsDone}>Marquer toutes les tâches comme terminées</Button>
            </HStack>
          </Stack>
        </HStack>
      </Container>
    </Container>
  );
}

export default DevHomePage;
