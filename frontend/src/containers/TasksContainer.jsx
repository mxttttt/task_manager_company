import React, { useState, useEffect } from "react";
import { Heading, Button, Card, HStack } from "@chakra-ui/react";
import axios from "../axios/axios";
import moment from "moment";
import TaskTable from "../components/TaskTable";
import formatHoursAndMinutes from "../lib/helpers/formatHoursAndMinutes";

const currentDate = moment();
const formattedDate = currentDate.format("YYYY-MM-DD");

export default function TasksContainer({ user }) {
  const [userTask, setUserTask] = useState([]);
  const [previousUserTasks, setPreviousUserTasks] = useState([]);

  const [timeRemaining, setTimeRemaining] = useState({ hours: 7, minutes: 0 });

  useEffect(() => {
    fetchUserTasks();
  }, [user]);
  const uniqueDates = [...new Set(previousUserTasks.map((task) => moment(task.created_at).format("YYYY-MM-DD")))];

  const fetchUserTasks = () => {
    axios
      .get(`/get/user_task?user_id=${user.id}`)
      .then((response) => {
        const today = moment();
        const todayDate = today.format("YYYY-MM-DD");

        // Separate tasks completed today and tasks completed on previous dates
        const tasksToday = response.data.filter((task) => moment(task.created_at).isSame(today, "day"));
        const tasksPreviousDates = response.data.filter((task) => !moment(task.created_at).isSame(today, "day"));

        setUserTask(tasksToday);

        setPreviousUserTasks(tasksPreviousDates);
      })
      .catch((error) => console.error("Error fetching user tasks:", error));
  };

  const handleDeleteTask = (taskUniqueId) => {
    axios
      .delete(`/user_task/${taskUniqueId}`)
      .then((response) => {
        fetchUserTasks();

        const deletedTask = userTask.find((task) => task.id === taskUniqueId);
        const deletedTimeSpent = deletedTask ? deletedTask.time_spent : 0;

        setTimeRemaining((prevTimeRemaining) => {
          const updatedHours = prevTimeRemaining.hours + Math.trunc(deletedTimeSpent / 60);
          const updatedMinutes = prevTimeRemaining.minutes + Math.round(deletedTimeSpent % 60);

          const adjustedHours = updatedMinutes >= 60 ? updatedHours + 1 : updatedHours;
          const adjustedMinutes = updatedMinutes >= 60 ? updatedMinutes - 60 : updatedMinutes;

          return {
            hours: adjustedHours,
            minutes: adjustedMinutes,
          };
        });
      })
      .catch((error) => console.error("Error deleting the task:", error));
  };

  const calculateTotalTimeSpent = (tasks) => {
    return tasks.reduce((totalTime, task) => totalTime + parseFloat(task.time_spent), 0);
  };

  const totalCumulatedTime = calculateTotalTimeSpent(userTask) / 60;

  const markTaskAsDone = () => {
    axios
      .post("/task_done", {
        user_id: user.id,
        date: formattedDate,
      })
      .then((response) => {
        setUserTask((tasks) => tasks.map((task) => ({ ...task, completed: true })));
        setTimeRemaining({ hours: 7, minutes: 0 });
      })
      .catch((error) => console.error("Error marking all tasks as completed:", error));
  };

  const handleMarkAsCompleted = (taskId) => {
    axios
      .post("/mark_task_completed", {
        task_id: taskId,
      })
      .then((response) => {
        fetchUserTasks();
      })
      .catch((error) => console.error("Error marking task as completed:", error));
  };

  const activeUserTasks = userTask.filter((task) => task.completed === 0);

  return (
    <>
      {uniqueDates
        .filter((date) => previousUserTasks.some((task) => moment(task.created_at).isSame(date, "day") && !task.completed))
        .map((date) => (
          <Card display={"flex"} justifyContent={"center"} alignItems={"center"} key={uniqueDates.id}>
            <Heading as={"h3"} size={"md"} p={"15px"}>
              Tâches créées le {moment(date).format("DD/MM/YYYY")} :
            </Heading>

            <TaskTable
              userTasks={previousUserTasks.filter((task) => moment(task.created_at).isSame(date, "day") && !task.completed)}
              onDeleteTask={handleDeleteTask}
              onMarkAsCompleted={handleMarkAsCompleted}
            />
          </Card>
        ))}
      <Card backgroundColor={"white"} display={"flex"} alignItems={"center"}>
        <Heading as={"h3"} size={"md"} p={"15px"}>
          Tâches effectuées :
        </Heading>
        {/* La table existante pour les tâches effectuées */}
        <TaskTable userTasks={activeUserTasks} onDeleteTask={handleDeleteTask} onMarkAsCompleted={handleMarkAsCompleted} />
        <p>
          Temps restant à effectuer:{" "}
          {timeRemaining.hours === 0 && timeRemaining.minutes === 0
            ? "Vous avez atteint votre quota horaire pour la journée."
            : formatHoursAndMinutes(timeRemaining.hours, timeRemaining.minutes)}
        </p>

        {timeRemaining.hours === 0 && timeRemaining.minutes === 0 && (
          <p>Total de votre journée : {formatHoursAndMinutes(Math.floor(totalCumulatedTime), Math.round((totalCumulatedTime % 1) * 60))}.</p>
        )}
      </Card>
      <HStack display={"flex"} justifyContent={"center"}>
        <Button onClick={markTaskAsDone}>Marquer toutes les tâches comme terminées</Button>
      </HStack>
    </>
  );
}
