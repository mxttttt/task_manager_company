import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import { Box, Text, List, Stack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Table, TableContainer, Thead, Tr, Td, Tbody, Th, Skeleton } from "@chakra-ui/react";
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";

export default function AdminProjectDetailsContainer() {
  const [projectTasks, setProjectTasks] = useState([]);
  const [filterTaskCode, setFilterTaskCode] = useState("");
  const { project_id } = useParams();
  const [project, setProject] = useState();

  useEffect(() => {
    // Fetch tasks for the selected project

    axios
      .get(`/admin/get/project_task/${project_id}`)
      .then((response) => {
        const tasksWithDate = response.data.map((task) => ({
          ...task,
          date: format(new Date(task.created_at), "yyyy-MM-dd"),
        }));
        setProjectTasks(tasksWithDate);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [project_id]);

  useEffect(() => {
    //Get project from id
    axios
      .get(`/projects/${project_id}`)
      .then((response) => {
        setProject(response.data);
      })
      .catch((error) => {
        console.error("Error fetching project:", error);
      });
  }, [project_id]);

  const formatHoursAndMinutes = (hours) => {
    let formattedTime = `${Math.floor(hours)}h`;

    const decimalHours = hours - Math.floor(hours);
    const minutes = Math.round(decimalHours * 60);

    if (minutes > 0) {
      formattedTime += ` ${minutes} minutes`;
    }

    return formattedTime;
  };

  return (
    <Box width={"full"}>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={"/admin"}>
            Admin
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={"/admin/projects"}>
            Projets
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={`/admin/projects/${project_id}`}>
            {project ? project.nom : <Skeleton as={"span"} display={"block"} height="10px" width="100px" />}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Text fontSize={"md"} fontWeight={"bold"}>
        {project ? project.nom : <Skeleton as={"span"} display={"block"} height="10px" width="100px" />}
      </Text>
      <Stack direction={"column"} width={"full"} display={"flex"}>
        <TableContainer width={"full"}>
          <Table variant="simple" width={"full"}>
            <Thead>
              <Tr>
                <Th>Client</Th>
                <Th>Code de tâche</Th>
                <Th>Temps passé</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {projectTasks.length > 0 ? (
                projectTasks.map((task) => (
                  <Tr key={task.id}>
                    <Td>{task.client_name}</Td>
                    <Td>{task.task_code}</Td>
                    <Td>{formatHoursAndMinutes(task.time_spent / 60)}</Td>
                    <Td>{task.date}</Td>
                  </Tr>
                ))
              ) : (
                <>
                  <Tr>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                  </Tr>
                  <Tr>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                  </Tr>
                  <Tr>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                    <Td>...</Td>
                  </Tr>
                </>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}
