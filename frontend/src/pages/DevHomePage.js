import React, { useState, useEffect } from "react";
import Axios from "axios";

function DevHomePage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [userTask, setUserTask] = useState([]); //get user task from user_task table by is user_id in user_task table
  const [taskData, setTaskData] = useState({ taskId: "0", taskName: "0", timeSpent: "0" });

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

  //handle changes for the task id and time spent and task name
  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    const selectedTask = tasks.find((task) => task.id === parseInt(value, 10));
    setTaskData((prevTaskData) => {
      return {
        ...prevTaskData,
        [name]: value,
        taskName: selectedTask ? selectedTask.task_name : prevTaskData.taskName,
      };
    });
  };
  console.log(taskData);

  const handleAddTask = () => {
    // Post the time spent on the selected task to your server
    Axios.post("http://localhost:3002/user_task", {
      user_id: user.id,
      user_email: user.email,
      task_id: taskData.taskId,
      task_name: taskData.taskName,
      time_spent: taskData.timeSpent,
    })
      .then((response) => {
        // Refresh the tasks list or perform other actions as needed
        console.log("Time spent on task has been posted successfully.");
        //get user tasks by is user_job_id in user_task table
        Axios.get(`http://localhost:3002/get/user_task?user_id=${user.id}`)
          .then((response) => {
            console.log(response.data.id);
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
  return (
    <div>
      <h1>Dev Home Page</h1>
      <h2>Tasks:</h2>
      <ul>
        {/* get user task from user_task table */}
        {userTask.map((task) => (
          <li key={task.id}>
            {task.task_name} - {task.time_spent} hours
            <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <h2>Add Time Spent on Task:</h2>
      <form>
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
