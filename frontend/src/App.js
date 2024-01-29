import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./pages/private/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DevHomePage from "./pages/DevHomePage";
import Cookies from "js-cookie";
import GrapHomePage from "./pages/GraphHomePage";
import OfficeHomePage from "./pages/OfficeHomePage";
import PhotoHomePage from "./pages/PhotoHomePage";
import SocialNetworkHomePage from "./pages/SocialNetworkHomePage";
import SpaceManagementHomePage from "./pages/SpaceManagementHomePage";
import UpinkHomePage from "./pages/UpinkHomePage";
import AdminHomePage from "./pages/AdminHomePage";
import AdminClientsContainer from "./containers/AdminClientsContainer";
import AdminUsersContainer from "./containers/AdminUsersContainer";
import AdminUsersDetailsContainer from "./containers/AdminUsersDetailsContainer";
import AdminProjectsContainer from "./containers/AdminProjectsContainer";
import AdminProjectDetailsContainer from "./containers/AdminProjectDetailsContainer";
import { Avatar, Button, Card, CardBody, HStack, Stack, Text, List, ListItem } from "@chakra-ui/react";
import { Logo } from "./components/Logo";

function App() {
  const [user, setUser] = useState(Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null);
  const [loggedIn, setLoggedIn] = useState(Cookies.get("loggedIn") === "true");

  useEffect(() => {
    const authenticatedUser = Cookies.get("user");
    if (authenticatedUser) {
      const parsedUser = JSON.parse(authenticatedUser);
      setUser(parsedUser);
      setLoggedIn(true);
    }
  }, []);
  console.log(user);
  // Define the getDashboardRoute function here
  function getDashboardRoute(userJobId) {
    switch (userJobId) {
      case 1:
        return "/dev";
      case 2:
        return "/graphism";
      case 3:
        return "/social-network";
      case 4:
        return "/photo";
      case 5:
        return "/office";
      case 6:
        return "/space-management";
      case 7:
        return "/up-ink";
      case 8:
        return "/admin";
      default:
        return "/login";
    }
  }

  function handleLogout() {
    // Clear the user's authentication state and local storage
    setUser(null);
    Cookies.remove("user"); // Remove the user cookie
    Cookies.remove("loggedIn"); // Remove the user cookie
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
                      Bonjour <b>{user.prénom}</b> !{" "}
                    </Text>
                  </Stack>
                  <Stack direction={"column"} spacing={0} alignItems={"center"} w={"33%"}>
                    <List>
                      <ListItem>
                        <Stack direction={"row"} spacing={4} alignItems={"center"}>
                          <Avatar size={"sm"} name={user.nom + " " + user.prénom} color={"white"} backgroundColor={"#1a13a8"} src={user.picture} referrerPolicy="no-referrer" />

                          <Button variant={"outline"} onClick={handleLogout}>
                            {" "}
                            Disconnect{" "}
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
                  setLoggedIn(true);
                  // Store the authenticated user in local storage
                  Cookies.set("user", JSON.stringify(user));
                }}
                getDashboardRoute={getDashboardRoute}
                setLoggedIn={setLoggedIn}
              />
            }
          ></Route>
          <Route path="/dev" element={<PrivateRoute component={DevHomePage} loggedIn={loggedIn} user={user} />} />
          <Route path="/graphism" element={<PrivateRoute component={GrapHomePage} loggedIn={loggedIn} user={user} />} />
          <Route path="/office" element={<PrivateRoute component={OfficeHomePage} loggedIn={loggedIn} user={user} />} />
          <Route path="/photo" element={<PrivateRoute component={PhotoHomePage} loggedIn={loggedIn} user={user} />} />
          <Route path="/social-network" element={<PrivateRoute component={SocialNetworkHomePage} loggedIn={loggedIn} user={user} />} />
          <Route path="/space-management" element={<PrivateRoute component={SpaceManagementHomePage} loggedIn={loggedIn} user={user} />} />
          <Route path="/up-ink" element={<PrivateRoute component={UpinkHomePage} loggedIn={loggedIn} user={user} />} />
          <Route path="/admin" element={<PrivateRoute component={AdminHomePage} loggedIn={loggedIn} user={user} />}>
            <Route exact path="/admin" element={<Navigate to="/admin/clients" />} />
            <Route path="/admin/clients" element={<AdminClientsContainer />} />
            <Route path="/admin/users/:user_id" element={<AdminUsersDetailsContainer />} />
            <Route path="/admin/users" element={<AdminUsersContainer />} />
            <Route path="/admin/projects/:project_id" element={<AdminProjectDetailsContainer />} />
            <Route path="/admin/projects" element={<AdminProjectsContainer />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
