import { useRef, useState, useEffect } from "react";
import "../App.css";
import Axios from "axios";
import { withRouter } from "react-router";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";
// // A utiliser pour créer les comptes de tout le monde (à faire une seule fois)
// const salt = bcrypt.genSaltSync(10);
// console.log(salt);
// const hashedPassword2 = bcrypt.hashSync("6Zj4bD6kBQ7l", salt);
// console.log(hashedPassword2);

function LoginPage({ setUser, history, getDashboardRoute, setLoggedIn }) {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the user is already logged in
    if (Cookies.get("loggedIn") === "true") {
      const authenticatedUser = Cookies.get("user");
      if (authenticatedUser) {
        const parsedUser = JSON.parse(authenticatedUser);
        history.push(getDashboardRoute(parsedUser.user_job_id));
      }
    }
  }, [history, getDashboardRoute]);

  function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // Use Axios or another method to retrieve the user's salt from the database based on their email
    Axios.get("http://localhost:3002/user", {
      params: {
        email: enteredEmail,
      },
    })
      .then((response) => {
        if (response.data.length === 0) {
          setError("Email ou mot de passe incorrect ou vide");
        } else {
          const user = response.data[0]; // Assuming you get one user matching the email
          console.log(user);
          // Now, use the retrieved user's salt to hash the entered password
          const hashedPassword = bcrypt.hashSync(enteredPassword, user.salt);
          if (hashedPassword === user.password) {
            setError(null); // Clear error message
            console.log("Vous êtes connecté");
            history.push(getDashboardRoute(user.user_job_id));
            // Update the user state in the App component
            setUser(user);
            setLoggedIn(true);
            Cookies.set("loggedIn", "true");
            Cookies.set("user", JSON.stringify(user));
          } else {
            setError("Email ou mot de passe incorrect");
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setError("Une erreur s'est produite");
      });
  }

  return (
    <div className="LoginPage">
      <h1>Se connecter</h1>
      {error && <p className="error-message">{error}</p>} {/* Conditional rendering for error message */}
      <form onSubmit={submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={emailInputRef} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" ref={passwordInputRef} />
        </div>
        <button>Se connecter</button>
      </form>
    </div>
  );
}

export default withRouter(LoginPage);
