import React from "react";
import { Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import formatHoursAndMinutes from "../lib/helpers/formatHoursAndMinutes";

export default function TaskTable({ userTasks, onDeleteTask, onMarkAsCompleted }) {
  return (
    <TableContainer width={"full"} justifyContent={"center"} display={"flex"}>
      <Table tablelayout="auto" width={"80%"} variant="simple">
        <Thead width={"full"}>
          <Tr width={"full"}>
            <Th>Client : </Th>
            <Th>Projets : </Th>
            <Th>Tâche : </Th>
            <Th>Code : </Th>
            <Th>Temps : </Th>
            {onDeleteTask && onMarkAsCompleted ? <Th>Action : </Th> : null}
          </Tr>
        </Thead>
        <Tbody>
          {userTasks.map((task) => (
            <Tr key={task.id} width={"full"}>
              <Td>{task.client_name}</Td>
              <Td>{task.nom}</Td>
              <Td>{task.task_name}</Td>
              <Td>{task.task_code}</Td>
              <Td>{formatHoursAndMinutes(Math.floor(task.time_spent / 60), Math.round(task.time_spent % 60))}</Td>
              {onDeleteTask && onMarkAsCompleted ? (
                <Td display={"flex"} justifyContent={"space-between"}>
                  {onDeleteTask ? (
                    <Button
                      _hover={({ color: "black" }, { backgroundColor: "red.500" })}
                      backgroundColor={"#D60620"}
                      color={"white"}
                      leftIcon={<DeleteIcon />}
                      variant={"outline"}
                      onClick={() => onDeleteTask(task.id)}
                    >
                      Supprimer
                    </Button>
                  ) : null}
                  {onMarkAsCompleted ? (
                    <Button
                      _hover={({ color: "black" }, { backgroundColor: "lightgoldenrodyellow" })}
                      backgroundColor={"lightgoldenrodyellow"}
                      onClick={() => onMarkAsCompleted(task.id)}
                    >
                      Terminer cette tâche
                    </Button>
                  ) : null}
                </Td>
              ) : null}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
