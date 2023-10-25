import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import DevHomePage from "./pages/DevHomePage";

function App() {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const authenticatedUser = localStorage.getItem("user");
    if (authenticatedUser) {
      setUser(JSON.parse(authenticatedUser));
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
    localStorage.removeItem("user");
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
        <Route
          path="/login"
          render={(props) => (
            <LoginPage
              setUser={(user) => {
                setUser(user);
                // Store the authenticated user in local storage
                localStorage.setItem("user", JSON.stringify(user));
              }}
              getDashboardRoute={getDashboardRoute}
              history={props.history}
            />
          )}
        />
        <Route path="/dev" component={DevHomePage} />
      </Router>
    </div>
  );
}

export default App;
