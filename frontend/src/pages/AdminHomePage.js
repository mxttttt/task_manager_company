import React from "react";

import {
  Button,
  Card,
  CardBody,
  Container,
  HStack,
  Stack,
  Text,
  Heading,
  List,
  Box,
} from "@chakra-ui/react";

import AdminClientsContainer from "../containers/AdminClientsContainer";
import AdminUsersContainer from "../containers/AdminUsersContainer";
import AdminUsersDetailsContainer from "../containers/AdminUsersDetailsContainer";
import AdminProjectsContainer from "../containers/AdminProjectsContainer";
import AdminProjectDetailsContainer from "../containers/AdminProjectDetailsContainer";
import { Switch, Route, Link, Redirect } from "react-router-dom";

function AdminHomePage() {
  return (
    <Container
      width={"full"}
      maxWidth={"none"}
      height={"max-content"}
      p={"20px"}
    >
      <Container height={"full"} width={"full"} maxWidth={"unset"}>
        <HStack
          display={"flex"}
          w={"min-content"}
          padding={"5px"}
          borderRadius={"5px"}
          direction={"row"}
        >
          <Heading color={"#1a13a8"}>
            Dashboard <Text fontSize={"md"}>Administrateur</Text>
          </Heading>
        </HStack>
        <Stack direction={"row"} spacing={5} mt={"20px"} height={"max-content"}>
          <Card
            direction={"column"}
            width={"33%"}
            height={"min-content"}
            borderRadius={"5px"}
          >
            <CardBody>
              <Stack direction={"column"}>
                <List spacing={3} my={6}>
                  <Button
                    as={Link}
                    to="/admin/clients"
                    display={"flex"}
                    justifyContent={"left"}
                    width={"60%"}
                    colorScheme={"transparent"}
                    color={"black"}
                    _hover={{ outline: " solid 1px" }}
                    size={"sm"}
                    borderRadius={"5px"}
                  >
                    Clients
                  </Button>
                  <Button
                    as={Link}
                    to="/admin/users"
                    display={"flex"}
                    justifyContent={"left"}
                    width={"60%"}
                    colorScheme={"transparent"}
                    color={"black"}
                    _hover={{ outline: " solid 1px" }}
                    size={"sm"}
                    borderRadius={"5px"}
                  >
                    Utilisateurs
                  </Button>
                  <Button
                    as={Link}
                    to="/admin/projects"
                    display={"flex"}
                    justifyContent={"left"}
                    width={"60%"}
                    colorScheme={"transparent"}
                    color={"black"}
                    _hover={{ outline: " solid 1px" }}
                    size={"sm"}
                    borderRadius={"5px"}
                  >
                    Projets
                  </Button>
                </List>
              </Stack>
            </CardBody>
          </Card>
          <Card
            direction={"column"}
            width={"66%"}
            height={"100%"}
            borderRadius={"5px"}
            display={"flex"}
            alignItems={"center"}
            py={6}
          >
            <CardBody width={"full"} display={"flex"} justifyContent={"center"}>
              <Switch>
                <Route exact path="/admin">
                  <Redirect from="/admin" to="/admin/clients" />
                </Route>

                <Route path="/admin/clients">
                  <AdminClientsContainer />
                </Route>
                <Route path="/admin/users/:user_id">
                  <AdminUsersDetailsContainer />
                </Route>
                <Route path="/admin/users">
                  <AdminUsersContainer />
                </Route>
                <Route path="/admin/projects/:project_id">
                  <AdminProjectDetailsContainer />
                </Route>
                <Route path="/admin/projects">
                  <AdminProjectsContainer />
                </Route>
              </Switch>
            </CardBody>
          </Card>
          <Stack direction={"column"} width={"33%"}></Stack>
        </Stack>
      </Container>
    </Container>
  );
}

export default AdminHomePage;
