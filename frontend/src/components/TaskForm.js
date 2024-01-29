import React from "react";
import { Button, Container, Stack, Select, Input, FormLabel, FormControl } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
function TaskForm({ clients, clientProject, tasks, taskData, handleClientChange, handleProjectChange, handleTaskChange, handleAddTask }) {
  return (
    <Container width={"full"} maxW={"unset"}>
      <Stack spacing={4} mb={4} direction={"column"}>
        <h2>Ajouter une tache à votre journée :</h2>
        <Stack as={"form"} direction={"row"} width={"full"}>
          <FormControl>
            <FormLabel htmlFor="client">Client : </FormLabel>
            <Select id="client" name="clientId" onChange={handleClientChange}>
              <option value="">Client : </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.client_name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="projet">Projets : </FormLabel>
            <Select id="projet" name="projetId" onChange={handleProjectChange}>
              <option value="">Projets : </option>
              {clientProject.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.nom}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="task">Taches : </FormLabel>
            <Select id="task" name="taskId" onChange={handleTaskChange}>
              <option value="">Taches : </option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id} data-taskjobname={task.task_name}>
                  {task.task_name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="timeSpent">Temps : </FormLabel>
            <Input variant="outline" placeholder="Temps passé" type="text" id="timeSpent" name="timeSpent" value={taskData.timeSpent} onChange={handleTaskChange} />
          </FormControl>
          <FormControl display={"flex"} alignItems={"end"} justifyContent={"center"}>
            <Button backgroundColor={"lightgreen"} leftIcon={<CheckIcon />} variant={"outline"} type="button" onClick={handleAddTask}>
              Ajouter une tache
            </Button>
          </FormControl>
        </Stack>
      </Stack>
    </Container>
  );
}

export default TaskForm;
