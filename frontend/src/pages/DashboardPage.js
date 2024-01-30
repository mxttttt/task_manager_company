import React from "react";
import { Container, Stack, Text, Heading } from "@chakra-ui/react";

import TaskFormContainer from "../containers/TaskFormContainer";
import TasksContainer from "../containers/TasksContainer";

function DashboardPage({ user }) {
  return (
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
  );
}

export default DashboardPage;
