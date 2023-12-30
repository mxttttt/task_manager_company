import React from "react";
import {
  Button,
  Card,
  CardBody,
  Container,
  HStack,
  Stack,
  Text,
  Select,
  Input,
} from "@chakra-ui/react";
function TaskForm({
  clients,
  clientDevis,
  tasks,
  taskData,
  handleClientChange,
  handleDevisChange,
  handleTaskChange,
  handleAddTask,
}) {
  return (
    <Container margin={"auto"}>
      <Stack spacing={4} mb={4} direction={"row"} margin={"auto"}>
        <h2>Ajouter une tache à votre journée :</h2>
        <form>
          <label htmlFor="client">Client : </label>
          <Select id="client" name="clientId" onChange={handleClientChange}>
            <option value="">Client : </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.client_name}
              </option>
            ))}
          </Select>
          <label htmlFor="devis">Devis n° : </label>
          <Select id="devis" name="devisId" onChange={handleDevisChange}>
            <option value="">Devis n° : </option>
            {clientDevis.map((devis) => (
              <option key={devis.id} value={devis.id}>
                {devis.devis_code}
              </option>
            ))}
          </Select>

          <label htmlFor="task">Taches : </label>
          <Select id="task" name="taskId" onChange={handleTaskChange}>
            <option value="">Taches : </option>
            {tasks.map((task) => (
              <option
                key={task.id}
                value={task.id}
                data-taskjobname={task.task_name}
              >
                {task.task_name}
              </option>
            ))}
          </Select>
          <label htmlFor="timeSpent">Temps : </label>
          <Input
            variant="outline"
            placeholder="Temps passé"
            type="text"
            id="timeSpent"
            name="timeSpent"
            value={taskData.timeSpent}
            onChange={handleTaskChange}
          />
          <button type="button" onClick={handleAddTask}>
            Ajouter une tache
          </button>
        </form>
      </Stack>
    </Container>
  );
}

export default TaskForm;
