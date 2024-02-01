import React from "react";

import { Button, Card, CardBody, Container, Stack, Heading, List } from "@chakra-ui/react";

import { Link, Outlet } from "react-router-dom";

import { Header } from "../components/Header";

function AdminHomePage({ user }) {
  return (
    <Container width={"full"} maxWidth={"none"} height={"max-content"} p={"20px"}>
      <Container height={"full"} width={"full"} maxWidth={"unset"}>
        <Stack w={"min-content"} padding={"5px"} borderRadius={"5px"} spacing={0}>
          <Heading as={"h1"} color={"#1a13a8"}>
            Dashboard
          </Heading>
          <Header fontSize="md">{user.job_name}</Header>
        </Stack>
        <Stack direction={"row"} spacing={5} mt={"20px"} height={"max-content"}>
          <Card direction={"column"} width={"20%"} height={"min-content"} borderRadius={"5px"}>
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
                  <Button
                    as={Link}
                    to="/admin/settings"
                    display={"flex"}
                    justifyContent={"left"}
                    width={"60%"}
                    colorScheme={"transparent"}
                    color={"black"}
                    _hover={{ outline: " solid 1px" }}
                    size={"sm"}
                    borderRadius={"5px"}
                  >
                    Paramètres
                  </Button>
                </List>
              </Stack>
            </CardBody>
          </Card>
          <Card direction={"column"} width={"80%"} height={"100%"} borderRadius={"5px"} display={"flex"} alignItems={"left"} py={6}>
            <CardBody width={"full"} display={"flex"} justifyContent={"center"}>
              <Outlet />
            </CardBody>
          </Card>
        </Stack>
      </Container>
    </Container>
  );
}

export default AdminHomePage;
