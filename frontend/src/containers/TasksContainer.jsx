import React, { useState, useEffect, useMemo } from "react";
import { Stack, Button, Card, HStack, Text } from "@chakra-ui/react";
import axios from "../axios/axios";
import moment from "moment";
import TaskTable from "../components/TaskTable";
import formatHoursAndMinutes from "../lib/helpers/formatHoursAndMinutes";
import parseTimeInput from "../lib/helpers/parseTimeInput";
import { useTasks } from "../providers/TasksProvider";
import { Header } from "../components/Header";

const currentDate = moment();
const formattedDate = currentDate.format("YYYY-MM-DD");

export default function TasksContainer({ user }) {
  //   const [userTask, setUserTask] = useState([]);
  //   const [previousUserTasks, setPreviousUserTasks] = useState([]);

  //   const [timeRemaining, setTimeRemaining] = useState({ hours: 7, minutes: 0 });

  //   const timeRemaining = useMemo(() => {}, []);s

  const { tasks, fetchTasks } = useTasks();

  const tasksToday = useMemo(() => tasks.filter((task) => moment(task.created_at).isSame(currentDate, "day")), [tasks]);
  const previousUserTasks = useMemo(() => tasks.filter((task) => !moment(task.created_at).isSame(currentDate, "day")), [tasks]);

  const uniqueDates = [...new Set(previousUserTasks.map((task) => moment(task.created_at).format("YYYY-MM-DD")))];

  const handleDeleteTask = (taskUniqueId) => {
    axios
      .delete(`/user_task/${taskUniqueId}`)
      .then(() => {
        fetchTasks();
      })
      .catch((error) => console.error("Error deleting the task:", error));
  };

  const totalCumulatedTime = useMemo(() => tasksToday.reduce((totalTime, task) => totalTime + parseFloat(task.time_spent), 0) / 60, [tasksToday]);
  const remainingTime = 7 - totalCumulatedTime;

  const markTaskAsDone = () => {
    axios
      .post("/task_done", {
        user_id: user.id,
        date: formattedDate,
      })
      .then(() => {
        fetchTasks();
      })
      .catch((error) => console.error("Error marking all tasks as completed:", error));
  };

  const handleMarkAsCompleted = (taskId) => {
    axios
      .post("/mark_task_completed", {
        task_id: taskId,
      })
      .then(() => {
        fetchTasks();
      })
      .catch((error) => console.error("Error marking task as completed:", error));
  };

  const activeUserTasks = tasksToday.filter((task) => task.completed === 0);

  return (
    <>
      {uniqueDates
        .filter((date) => previousUserTasks.some((task) => moment(task.created_at).isSame(date, "day") && !task.completed))
        .map((date) => (
          <Card display={"flex"} justifyContent={"center"} alignItems={"center"} key={uniqueDates.id}>
            <Stack direction={"row"} p={15}>
              <Header as={"h3"} size={"md"}>
                Tâches créées le {moment(date).format("DD/MM/YYYY")} :
              </Header>
            </Stack>
            <TaskTable
              userTasks={previousUserTasks.filter((task) => moment(task.created_at).isSame(date, "day") && !task.completed)}
              onDeleteTask={handleDeleteTask}
              onMarkAsCompleted={handleMarkAsCompleted}
            />
          </Card>
        ))}
      <Card backgroundColor={"white"} display={"flex"} alignItems={"center"}>
        <Stack direction={"row"} p={15}>
          <Header as={"h3"} size={"md"}>
            Tâches effectuées :
          </Header>
        </Stack>
        {/* La table existante pour les tâches effectuées */}
        <TaskTable userTasks={activeUserTasks} onDeleteTask={handleDeleteTask} onMarkAsCompleted={handleMarkAsCompleted} />
        <Text my={25}>
          Temps restant à effectuer: {remainingTime === 0 || remainingTime < 0 ? "Vous avez atteint votre quota horaire pour la journée." : formatHoursAndMinutes(remainingTime)}
        </Text>

        {(remainingTime === 0 || remainingTime < 0) && <Text>Total de votre journée : {formatHoursAndMinutes(totalCumulatedTime)}.</Text>}
      </Card>
      <HStack display={"flex"} justifyContent={"center"}>
        <Button onClick={markTaskAsDone}>Marquer toutes les tâches comme terminées</Button>
      </HStack>
    </>
  );
}
