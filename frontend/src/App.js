import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./pages/private/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DevHomePage from "./pages/DevHomePage";
import Cookies from "js-cookie";

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
        return "/manager";
      case 3:
        return "/employee";
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
        <div className="container">
          <h1 className="logo">HopopTask</h1>
          <div className="navlinks">
            {user ? (
              <div>
                <ul>
                  <li>
                    <a href="/" onClick={handleLogout}>
                      Disconnect
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              // If the user is not authenticated, display the "Se connecter" link
              <a href="/login">Se connecter</a>
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
          {console.log("User from App:", user)}
          <PrivateRoute path="/dev" component={DevHomePage} loggedIn={loggedIn} user={user} />
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
