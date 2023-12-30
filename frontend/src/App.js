import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./App.css";
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
import {
  Avatar,
  Button,
  Card,
  CardBody,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Logo } from "./components/Logo";

function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(Cookies.get("loggedIn") === "true");
  const history = useHistory();

  useEffect(() => {
    const authenticatedUser = Cookies.get("user");
    if (authenticatedUser) {
      const parsedUser = JSON.parse(authenticatedUser);
      console.log(parsedUser);
      setUser(parsedUser);
      setLoggedIn(true);
    }
  }, []);

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
            <Card
              width={"full"}
              className="flex"
              direction={"row"}
              justifyContent={"center"}
            >
              <CardBody>
                <HStack justifyContent={"space-around"} padding={"auto"}>
                  <Logo />
                  <Text>
                    Bonjour <b>{user.prénom}</b> !{" "}
                  </Text>
                  <div>
                    <div>
                      <ul>
                        <li>
                          <Stack
                            direction={"row"}
                            spacing={4}
                            alignItems={"center"}
                          >
                            <Avatar
                              size={"sm"}
                              name={user.nom + " " + user.prénom}
                              color={"white"}
                              backgroundColor={"#1a13a8"}
                              src="https://bit.ly/broken-link"
                            />
                            {console.log(user)}
                            <Button variant={"outline"} onClick={handleLogout}>
                              {" "}
                              Disconnect{" "}
                            </Button>
                          </Stack>
                        </li>
                      </ul>
                    </div>
                  </div>
                </HStack>
              </CardBody>
            </Card>
          ) : (
            <Text></Text>
          )}
        </div>
      </div>
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage
              setUser={(user) => {
                setUser(user);
                setLoggedIn(true);
                // Store the authenticated user in local storage
                Cookies.set("user", JSON.stringify(user));
              }}
              getDashboardRoute={getDashboardRoute}
              history={history}
              setLoggedIn={setLoggedIn}
            />
          </Route>

          <PrivateRoute
            path="/dev"
            component={DevHomePage}
            loggedIn={loggedIn}
            user={user}
          />
          <PrivateRoute
            path="/office"
            component={OfficeHomePage}
            loggedIn={loggedIn}
            user={user}
          />
          <PrivateRoute
            path="/photo"
            component={PhotoHomePage}
            loggedIn={loggedIn}
            user={user}
          />
          <PrivateRoute
            path="/social-network"
            component={SocialNetworkHomePage}
            loggedIn={loggedIn}
            user={user}
          />
          <PrivateRoute
            path="/space-management"
            component={SpaceManagementHomePage}
            loggedIn={loggedIn}
            user={user}
          />
          <PrivateRoute
            path="/up-ink"
            component={UpinkHomePage}
            loggedIn={loggedIn}
            user={user}
          />
          <PrivateRoute
            path="/graphism"
            component={GrapHomePage}
            loggedIn={loggedIn}
            user={user}
          />
          <PrivateRoute
            path="/admin"
            component={AdminHomePage}
            loggedIn={loggedIn}
            user={user}
          />
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
