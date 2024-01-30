import React from "react";
import { Container, Stack, Text, Heading } from "@chakra-ui/react";

import TaskFormContainer from "../containers/TaskFormContainer";
import TasksContainer from "../containers/TasksContainer";
import { TasksProvider } from "../providers/TasksProvider";

function DashboardPage({ user }) {
  return (
    <TasksProvider user={user}>
      <Container width={"full"} maxWidth={"none"} height={"80vh"} p={"20px"}>
        <Container height={"100%"} width={"full"} maxWidth={"unset"}>
          <Heading color={"#1a13a8"} paddingBottom={"15px"}>
            Dashboard <Text fontSize={"md"}>{user.job_name}</Text>
          </Heading>

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
