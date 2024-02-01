import React from "react";
import { Container, Stack, Heading } from "@chakra-ui/react";

import TaskFormContainer from "../containers/TaskFormContainer";
import TasksContainer from "../containers/TasksContainer";
import { TasksProvider } from "../providers/TasksProvider";
import { Header } from "../components/Header";

function DashboardPage({ user }) {
  return (
    <TasksProvider user={user}>
      <Container width={"full"} maxWidth={"none"} height={"80vh"} p={"20px"}>
        <Container height={"100%"} width={"full"} maxWidth={"unset"}>
          <Stack w={"min-content"} py={"15px"} borderRadius={"5px"} spacing={0}>
            <Heading as={"h1"} color={"#1a13a8"}>
              Dashboard
            </Heading>
            <Header fontSize="md">{user.job_name}</Header>
          </Stack>
          <Stack width={"full"}>
            <TasksContainer user={user} />
            <TaskFormContainer user={user} />
          </Stack>
        </Container>
      </Container>
    </TasksProvider>
  );
}

export default DashboardPage;
