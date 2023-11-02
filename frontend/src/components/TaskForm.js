import React from "react";

function TaskForm({ clients, clientDevis, tasks, taskData, handleClientChange, handleDevisChange, handleTaskChange, handleAddTask }) {
  return (
    <div>
      <h2>Ajouter une tache à votre journée :</h2>
      <form>
        <label htmlFor="client">Client : </label>
        <select id="client" name="clientId" onChange={handleClientChange}>
          <option value="">Client : </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.client_name}
            </option>
          ))}
        </select>
        <label htmlFor="devis">Devis n° : </label>
        <select id="devis" name="devisId" onChange={handleDevisChange}>
          <option value="">Devis n° : </option>
          {clientDevis.map((devis) => (
            <option key={devis.id} value={devis.id}>
              {devis.devis_code}
            </option>
          ))}
        </select>

        <label htmlFor="task">Taches : </label>
        <select id="task" name="taskId" onChange={handleTaskChange}>
          <option value="">Taches : </option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id} data-taskjobname={task.task_name}>
              {task.task_name}
            </option>
          ))}
        </select>
        <label htmlFor="timeSpent">Temps : </label>
        <input type="text" id="timeSpent" name="timeSpent" value={taskData.timeSpent} onChange={handleTaskChange} />
        <button type="button" onClick={handleAddTask}>
          Ajouter une tache
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
