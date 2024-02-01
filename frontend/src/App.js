import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./pages/private/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Cookies from "js-cookie";
import AdminHomePage from "./pages/AdminHomePage";
import AdminClientsContainer from "./containers/AdminClientsContainer";
import AdminUsersContainer from "./containers/AdminUsersContainer";
import AdminUsersDetailsContainer from "./containers/AdminUsersDetailsContainer";
import AdminProjectsContainer from "./containers/AdminProjectsContainer";
import AdminProjectDetailsContainer from "./containers/AdminProjectDetailsContainer";
import AdminSettingsContainer from "./containers/AdminSettingsContainer";
import { Avatar, Button, Card, CardBody, HStack, Stack, Text, List, ListItem } from "@chakra-ui/react";
import { Logo } from "./components/Logo";
import axios from "./axios/axios";

function App() {
  const [user, setUser] = useState(Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null);

  // Define the getDashboardRoute function here
  function getDashboardRoute(userRole) {
    if (userRole === "admin") {
      return "/admin";
    } else if (userRole === "user") {
      return "/dashboard";
    } else {
      return "/login";
    }
  }

  function handleLogout() {
    axios.post("/logout").then((response) => {
      if (response.data.success) {
        setUser(null);
      }
    });
  }

  return (
    <div className="App">
      <div className="navbar">
        <div className="flex justify-between w-full p-3 px-4">
          {user ? (
            <Card width={"full"} display={"flex"} direction={"row"} justifyContent={"center"}>
              <CardBody>
                <HStack display={"flex"} justifyContent={"space-around"} padding={"auto"}>
                  <Stack direction={"column"} spacing={0} alignItems={"center"} w={"33%"}>
                    <Logo />
                  </Stack>
                  <Stack direction={"column"} spacing={0} alignItems={"center"} w={"33%"}>
                    <Text>
                      Bonjour <b>{user.prenom}</b> !{" "}
                    </Text>
                  </Stack>
                  <Stack direction={"column"} spacing={0} alignItems={"center"} w={"33%"}>
                    <List>
                      <ListItem>
                        <Stack direction={"row"} spacing={4} alignItems={"center"}>
                          <Avatar size={"sm"} name={user.nom + " " + user.prenom} color={"white"} backgroundColor={"#1a13a8"} src={user.picture} referrerPolicy="no-referrer" />

                          <Button variant={"outline"} onClick={handleLogout}>
                            {" "}
                            Déconnexion{" "}
                          </Button>
                        </Stack>
                      </ListItem>
                    </List>
                  </Stack>
                </HStack>
              </CardBody>
            </Card>
          ) : (
            <Text></Text>
          )}
        </div>
      </div>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <LoginPage
                setUser={(user) => {
                  setUser(user);

                  // Store the authenticated user in local storage
                  Cookies.set("user", JSON.stringify(user)); // TODO : API have to put it and check if it's ok
                }}
                getDashboardRoute={getDashboardRoute}
              />
            }
          ></Route>
          <Route path="/dashboard" element={<PrivateRoute component={DashboardPage} user={user} />} />
          <Route path="/admin" element={<PrivateRoute component={AdminHomePage} user={user} />}>
            <Route exact path="/admin" element={<Navigate to="/admin/clients" />} />
            <Route path="/admin/clients" element={<AdminClientsContainer />} />
            <Route path="/admin/users/:user_id" element={<AdminUsersDetailsContainer />} />
            <Route path="/admin/users" element={<AdminUsersContainer />} />
            <Route path="/admin/projects/:project_id" element={<AdminProjectDetailsContainer />} />
            <Route path="/admin/projects" element={<AdminProjectsContainer />} />
            <Route path="/admin/settings" element={<AdminSettingsContainer />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
