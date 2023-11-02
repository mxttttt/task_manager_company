import React, { useState, useEffect } from "react";
import Axios from "axios";
import TaskForm from "../components/TaskForm";
import moment from "moment";
function DevHomePage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [userTask, setUserTask] = useState([]); // get user task from user_task table by user_id in user_task table
  const [taskData, setTaskData] = useState({
    taskId: "",
    taskName: "",
    taskCode: "",
    timeSpent: "",
    clientName: "",
    devisCode: "",
  });
  const [clients, setClients] = useState([]);
  const [clientDevis, setClientDevis] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  // get current date
  const currentDate = moment();
  const formattedDate = currentDate.format("YYYY-MM-DD");

  useEffect(() => {
    // Fetch tasks for the logged-in user
    Axios.get(`http://localhost:3002/tasks?user_job_id=${user.user_job_id}`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [user]);

  useEffect(() => {
    // Fetch tasks for the logged-in user
    Axios.get(`http://localhost:3002/get/user_task?user_id=${user.id}`)
      .then((response) => {
        setUserTask(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [user]);

  useEffect(() => {
    Axios.get("http://localhost:3002/clients")
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }, []);

  // handle changes for the task id and time spent and task name
  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    const selectedTask = tasks.find((task) => task.id === parseInt(value, 10));

    setTaskData((prevTaskData) => {
      return {
        ...prevTaskData,
        [name]: value,
        taskName: selectedTask ? selectedTask.task_name : prevTaskData.taskName,
        taskCode: selectedTask ? selectedTask.task_code : prevTaskData.taskCode,
      };
    });
  };

  // Function to parse time input like "2h45" to decimal hours
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
    // Check if any of the required fields are empty or zero
    if (!taskData.taskId || !taskData.timeSpent || taskData.timeSpent <= 0 || !taskData.clientName || !taskData.devisCode) {
      // Set the error message
      setErrorMessage("Vous devez remplir tous les champs !");
      return;
    }

    // Reset the error message if validation passes
    setErrorMessage("");
    // Parse the time input using the parseTimeInput function
    const timeSpent = parseTimeInput(taskData.timeSpent);
    // Post the time spent on the selected task to your server
    Axios.post("http://localhost:3002/user_task", {
      user_id: user.id,
      user_email: user.email,
      task_id: taskData.taskId,
      task_name: taskData.taskName,
      task_code: taskData.taskCode,
      time_spent: timeSpent,
      client: taskData.clientName,
      devis: taskData.devisCode,
      date: formattedDate,
    })
      .then((response) => {
        // get user tasks by user_id in user_task table
        Axios.get(`http://localhost:3002/get/user_task?user_id=${user.id}`)
          .then((response) => {
            setUserTask(response.data);
          })
          .catch((error) => {
            console.error("Error fetching tasks:", error);
          });
      })
      .catch((error) => {
        console.error("Error posting time spent:", error);
      });
  };

  const handleDeleteTask = (taskUniqueId) => {
    Axios.delete(`http://localhost:3002/user_task/${taskUniqueId}`)
      .then((response) => {
        // After deletion, update the user's task list by making a request to the server again
        Axios.get(`http://localhost:3002/get/user_task?user_id=${user.id}`)
          .then((response) => {
            setUserTask(response.data);
          })
          .catch((error) => {
            console.error("Error fetching tasks:", error);
          });
      })
      .catch((error) => {
        console.error("Error deleting the task:", error);
      });
  };

  const handleClientChange = (event) => {
    const selectedClientId = event.target.value;
    if (selectedClientId) {
      // Use the selected client's ID to fetch the related devis from the server
      Axios.get(`http://localhost:3002/devis?client_id=${selectedClientId}`)
        .then((response) => {
          setClientDevis(response.data);

          // Find the selected client in the clients array and get its name
          const selectedClient = clients.find((client) => client.id === parseInt(selectedClientId, 10));

          if (selectedClient) {
            setTaskData((prevTaskData) => ({
              ...prevTaskData,
              clientName: selectedClient.client_name,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching client's devis:", error);
        });
    } else {
      // Reset the list of devis when "Select a client" is chosen
      setClientDevis([]);
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        clientName: "",
        devisCode: "",
      }));
    }
  };

  const handleDevisChange = (event) => {
    const selectedDevisId = event.target.value;
    if (selectedDevisId) {
      // Find the selected devis in the client's devis array and get its code
      const selectedDevis = clientDevis.find((devis) => devis.id === parseInt(selectedDevisId, 10));

      if (selectedDevis) {
        setTaskData((prevTaskData) => ({
          ...prevTaskData,
          devisCode: selectedDevis.devis_code,
        }));
      }
    } else {
      // Clear the devis ID and code when no devis is selected
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        devisId: "",
        devisCode: "",
      }));
    }
  };

  function formatHoursAndMinutes(time) {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);

    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} heures`;
    } else {
      return `${hours} heures et ${minutes} minutes`;
    }
  }

  const totalWorkingHoursPerDay = 7;
  const calculateTotalTimeSpent = (tasks) => {
    return tasks.reduce((totalTime, task) => totalTime + parseFloat(task.time_spent), 0);
  };

  const totalTimeSpent = calculateTotalTimeSpent(userTask);
  const timeRemaining = totalWorkingHoursPerDay - totalTimeSpent;
  const totalFormatted = formatHoursAndMinutes(timeRemaining);
  const totalCumulatedTime = calculateTotalTimeSpent(userTask);

  const markTaskAsDone = () => {
    Axios.post("http://localhost:3002/task_done", { user_id: user.id, date: formattedDate })
      .then((response) => {
        // Mettez à jour l'état des tâches côté client pour refléter que toutes les tâches sont terminées.
        setUserTask((tasks) => tasks.map((task) => ({ ...task, completed: true })));
      })
      .catch((error) => {
        console.error("Error marking all tasks as completed:", error);
      });
  };
  const activeUserTasks = userTask.filter((task) => task.completed !== 1);
  return (
    <div>
      <h1>Dev Home Page</h1>
      <h2>Taches effectuées :</h2>
      <table>
        <thead>
          <tr>
            <th>Client : </th>
            <th>Devis n° : </th>
            <th>Tache : </th>
            <th>Code : </th>
            <th>Temps : </th>
            <th>Action : </th>
          </tr>
        </thead>
        <tbody>
          {activeUserTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.client_name}</td>
              <td>{task.devis_code}</td>
              <td>{task.task_name}</td>
              <td>{task.task_code}</td>
              <td>{formatHoursAndMinutes(task.time_spent)}</td>
              <td>
                <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p>Temps restant à effectué: {timeRemaining <= 0 ? "Vous avez atteint votre quota horaire pour la journée." : totalFormatted}</p>
      {timeRemaining <= 0 && <p>Total de votre journée : {formatHoursAndMinutes(totalCumulatedTime)} heures.</p>}

      <TaskForm
        clients={clients}
        clientDevis={clientDevis}
        tasks={tasks}
        taskData={taskData}
        handleClientChange={handleClientChange}
        handleDevisChange={handleDevisChange}
        handleTaskChange={handleTaskChange}
        handleAddTask={handleAddTask}
      />
      <button onClick={markTaskAsDone}>Marquer toutes les tâches comme terminées</button>
    </div>
  );
}

export default DevHomePage;
