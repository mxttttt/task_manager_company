import React, { useState, useEffect } from "react";
import Axios from "axios";

function DevHomePage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [userTask, setUserTask] = useState([]); //get user task from user_task table by is user_id in user_task table
  const [taskData, setTaskData] = useState({
    taskId: "0",
    taskName: "0",
    taskCode: "0", // Add taskCode to the state
    timeSpent: "0",
    clientName: "0",
    devisCode: "0",
  });
  const [clients, setClients] = useState([]);
  const [clientDevis, setClientDevis] = useState([]);

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
  //handle changes for the task id and time spent and task name
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

  const handleAddTask = () => {
    // Post the time spent on the selected task to your server
    Axios.post("http://localhost:3002/user_task", {
      user_id: user.id,
      user_email: user.email,
      task_id: taskData.taskId,
      task_name: taskData.taskName,
      task_code: taskData.taskCode,
      time_spent: taskData.timeSpent,
      client: taskData.clientName,
      devis: taskData.devisCode,
    })
      .then((response) => {
        //get user tasks by is user_job_id in user_task table
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
        // Après la suppression, mettez à jour la liste des tâches de l'utilisateur
        // en refaisant une requête au serveur
        Axios.get(`http://localhost:3002/get/user_task?user_id=${user.id}`)
          .then((response) => {
            setUserTask(response.data);
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des tâches :", error);
          });
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de la tâche :", error);
      });
  };

  const handleClientChange = (event) => {
    const selectedClientId = event.target.value;
    if (selectedClientId) {
      // Utilize the ID of the client selected to fetch the related devis from the server
      Axios.get(`http://localhost:3002/devis?client_id=${selectedClientId}`)
        .then((response) => {
          setClientDevis(response.data);

          // Find the selected client in the clients array and get its name
          const selectedClient = clients.find((client) => client.id === parseInt(selectedClientId, 10));
          console.log(selectedClient);

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
        clientId: "",
        clientName: "", // Clear the client name when no client is selected
        devisId: "", // Clear the devis ID when no client is selected
        devisCode: "", // Clear the devis code when no client is selected
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

  return (
    <div>
      <h1>Dev Home Page</h1>
      <h2>Tasks:</h2>
      <ul>
        {userTask.map((task) => (
          <li key={task.id}>
            {task.client_name} - {task.devis_code} - {task.task_name} - {task.task_code} - {task.time_spent} hours
            <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <h2>Add Time Spent on Task:</h2>
      <form>
        <label htmlFor="client">Select Client:</label>
        <select id="client" name="clientId" onChange={handleClientChange}>
          <option value="">Select a Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.client_name}
            </option>
          ))}
        </select>
        <label htmlFor="devis">Select Devis:</label>
        <select id="devis" name="devisId" onChange={handleDevisChange}>
          <option value="">Select a Devis</option>
          {clientDevis.map((devis) => (
            <option key={devis.id} value={devis.id}>
              {devis.devis_code}
            </option>
          ))}
        </select>

        <label htmlFor="task">Select Task:</label>
        <select id="task" name="taskId" onChange={handleTaskChange}>
          <option value="">Select a Task</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id} data-taskjobname={task.task_name}>
              {task.task_name}
            </option>
          ))}
        </select>
        <label htmlFor="timeSpent">Time Spent (in hours):</label>
        <input type="number" id="timeSpent" name="timeSpent" value={taskData.timeSpent} onChange={handleTaskChange} />
        <button type="button" onClick={handleAddTask}>
          Add Time Spent
        </button>
      </form>
    </div>
  );
}

export default DevHomePage;
