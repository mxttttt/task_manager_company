import React from "react";
import TaskForm from "../components/TaskForm";
import axios from "../axios/axios";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import parseTimeInput from "../lib/helpers/parseTimeInput";

import moment from "moment";
const currentDate = moment();
const formattedDate = currentDate.format("YYYY-MM-DD");

export default function TaskFormContainer({ user }) {
  const [clients, setClients] = useState([]);
  const [clientProjects, setClientProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    taskId: "",
    taskName: "",
    taskCode: "",
    timeSpent: "",
    clientName: "",
    projectName: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchClients();
    fetchTasks();
  }, []);

  const fetchClientsProjects = (clientsId) => {
    axios
      .get(`/project?client_id=${clientsId}`)
      .then((response) => {
        setClientProjects(response.data);

        const selectedClient = clients.find((client) => client.id === parseInt(clientsId, 10));

        if (selectedClient) {
          setTaskData((prevTaskData) => ({
            ...prevTaskData,
            clientName: selectedClient.client_name,
          }));
        }
      })
      .catch((error) => console.error("Error fetching client's projects:", error));
  };

  const fetchClients = () => {
    axios
      .get("/clients?limit=100")
      .then((response) => setClients(response.data.clients))
      .catch((error) => console.error("Error fetching clients:", error));
  };

  const fetchTasks = () => {
    axios
      .get(`/tasks?user_job_id=${user.user_job_id}`)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };
  const handleClientChange = (event) => {
    const selectedClientId = event.target.value;

    if (selectedClientId) {
      fetchClientsProjects(selectedClientId);
    } else {
      setClientProjects([]);
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        clientName: "",
        projectName: "",
      }));
    }
  };

  const handleProjectChange = (event) => {
    const selectedProjectId = event.target.value;
    if (selectedProjectId) {
      const selectedProject = clientProjects.find((project) => project.id === parseInt(selectedProjectId, 10));

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
        // fetchUserTasks(); TODO
        // setTimeRemaining((prevTimeRemaining) => {
        //   const totalMinutes = prevTimeRemaining.hours * 60 + prevTimeRemaining.minutes;
        //   const updatedTotalMinutes = totalMinutes - timeSpent;
        //   const updatedHours = Math.floor(updatedTotalMinutes / 60);
        //   const updatedMinutes = updatedTotalMinutes % 60;
        //   return {
        //     hours: updatedHours,
        //     minutes: updatedMinutes,
        //   };
        // }); TODO
      })
      .catch((error) => console.error("Error posting time spent:", error));
  };

  return (
    <>
      {errorMessage && (
        <Alert status="error">
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
      <TaskForm
        clients={clients}
        clientProjects={clientProjects}
        tasks={tasks}
        taskData={taskData}
        handleClientChange={handleClientChange}
        handleProjectChange={handleProjectChange}
        handleTaskChange={handleTaskChange}
        handleAddTask={handleAddTask}
      />
    </>
  );
}
