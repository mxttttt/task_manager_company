import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
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
import { Button } from "@chakra-ui/react";

function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(Cookies.get("loggedIn") === "true");
  const history = useHistory();

  useEffect(() => {
    const authenticatedUser = Cookies.get("user");
    if (authenticatedUser) {
      const parsedUser = JSON.parse(authenticatedUser);
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
          <h1 className="logo">HopopTask</h1>
          <div className="bg-slate-100">
            {user ? (
              <div>
                <ul>
                  <li>
                    <Button variant={"outline"} onClick={handleLogout}>
                      {" "}
                      Disconnect{" "}
                    </Button>
                  </li>
                </ul>
              </div>
            ) : (
              // If the user is not authenticated, display the "Se connecter" link

              <Button variant={"outline"} as={"a"} href="/login" display={"flex"}>
                {" "}
                Se connecter{" "}
              </Button>
            )}
          </div>
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

          <PrivateRoute path="/dev" component={DevHomePage} loggedIn={loggedIn} user={user} />
          <PrivateRoute path="/office" component={OfficeHomePage} loggedIn={loggedIn} user={user} />
          <PrivateRoute path="/photo" component={PhotoHomePage} loggedIn={loggedIn} user={user} />
          <PrivateRoute path="/social-network" component={SocialNetworkHomePage} loggedIn={loggedIn} user={user} />
          <PrivateRoute path="/space-management" component={SpaceManagementHomePage} loggedIn={loggedIn} user={user} />
          <PrivateRoute path="/up-ink" component={UpinkHomePage} loggedIn={loggedIn} user={user} />
          <PrivateRoute path="/graphism" component={GrapHomePage} loggedIn={loggedIn} user={user} />
          <PrivateRoute path="/admin" component={AdminHomePage} loggedIn={loggedIn} user={user} />
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
