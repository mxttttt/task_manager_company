import { useRef, useState, useEffect } from "react";
import "../App.css";
import Axios from "axios";
import { withRouter } from "react-router";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";
import { Box, Button, Checkbox, Container, FormControl, FormLabel, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { Logo } from "../components/Logo";
import { PasswordField } from "../components/PasswordField";
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
          // Now, use the retrieved user's salt to hash the entered password
          const hashedPassword = bcrypt.hashSync(enteredPassword, user.salt);
          if (hashedPassword === user.password) {
            setError(null); // Clear error message
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
    <Container
      maxW="lg"
      py={{
        base: "12",
        md: "24",
      }}
      px={{
        base: "0",
        sm: "8",
      }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack
            spacing={{
              base: "2",
              md: "3",
            }}
            textAlign="center"
          >
            <Heading
              size={{
                base: "xs",
                md: "sm",
              }}
            >
              Connectez-vous à votre compte
            </Heading>
          </Stack>
        </Stack>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={{
            base: "transparent",
            sm: "bg.surface",
          }}
          boxShadow={{
            base: "none",
            sm: "md",
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
        >
          <Stack spacing="6" as={"form"} onSubmit={submitHandler}>
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="email" type="email" ref={emailInputRef} />
              </FormControl>
              <PasswordField ref={passwordInputRef} />
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button variant="text" size="sm">
                Forgot password?
              </Button>
            </HStack>
            <Stack
              spacing={{
                base: "2",
                md: "3",
              }}
            >
              {error && <Text color="red.500">{error}</Text>}
            </Stack>
            <Button type="submit">Sign in</Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default withRouter(LoginPage);
