import React, { useState, createContext, useEffect } from "react";
import axios from "../axios/axios";
const TasksContext = createContext({ tasks: [], fetchTasks: () => {}, isLoading: false, error: null });

const TasksProvider = ({ children, user }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = () => {
    axios
      .get(`/get/user_task?user_id=${user.id}`)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };
  return <TasksContext.Provider value={{ tasks, fetchTasks, isLoading: false, error: null }}>{children}</TasksContext.Provider>;
};

const useTasks = () => {
  const context = React.useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
export { TasksProvider, useTasks };
