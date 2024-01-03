import React, { useState, useEffect } from "react";
import Axios from "axios";
import { format } from "date-fns";

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
    <div>
      <h1>Admin Page</h1>
      <label htmlFor="user">Sélectionner un utilisateur : </label>
      <select id="user" onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Sélectionner un utilisateur</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email}
          </option>
        ))}
      </select>

      {selectedUser && (
        <div>
          <div>
            <label htmlFor="searchClient">Rechercher un client : </label>
            <input type="text" id="searchClient" value={searchClientName} onChange={(e) => setSearchClientName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="filterTaskCode">Filter by Task Code:</label>
            <input type="text" id="filterTaskCode" value={filterTaskCode} onChange={(e) => setFilterTaskCode(e.target.value)} />
            <button onClick={filterAndCalculateTotal}>Filter & Calculate Total</button>
          </div>
          <h2>Tâches effectuées:</h2>
          {Object.keys(groupedTasks).map((date) => (
            <div key={date}>
              <h3>{date}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Nom du client</th>
                    <th>Devis N°</th>
                    <th>Nom de la tâche</th>
                    <th>Code de la tâche</th>
                    <th>Temps passé (heures)</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedTasks[date].map((task) => (
                    <tr key={task.id}>
                      <td>{task.client_name}</td>
                      <td>{task.devis_code}</td>
                      <td>{task.task_name}</td>
                      <td>{task.task_code}</td>
                      <td>{formatHoursAndMinutes(task.time_spent / 60)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
      {filterTaskCode && (
        <div>
          <p>
            Total Hours Spent on Task Code "{filterTaskCode}": {totalHours}
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminHomePage;
