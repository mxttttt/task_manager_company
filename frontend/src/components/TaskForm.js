import React from "react";

function TaskForm({ clients, clientDevis, tasks, taskData, handleClientChange, handleDevisChange, handleTaskChange, handleAddTask }) {
  return (
    <div>
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
        <input type="text" id="timeSpent" name="timeSpent" value={taskData.timeSpent} onChange={handleTaskChange} />
        <button type="button" onClick={handleAddTask}>
          Add Time Spent
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
