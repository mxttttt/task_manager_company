const registerAuth = require("./endpoints/auth");
const registerAsana = require("./endpoints/asana");
const registerProject = require("./endpoints/project");
const registerUserTasks = require("./endpoints/userTasks");
const registerClient = require("./endpoints/client");
const registerTask = require("./endpoints/task");
const registerUser = require("./endpoints/user");

const cookieParser = require("cookie-parser");
const express = require("express");

const cors = require("cors");

const app = express();

const PORT = 3002;
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//MIDLLEWARES
const authMiddleware = require("./middlewares/auth");

app.use(authMiddleware);

// Register the login endpoint
registerAuth(app);

// Register the user endpoint
registerUser(app);

// Register the task endpoint
registerTask(app);

// Register the client endpoint
registerClient(app);

// Register the userTasks endpoint
registerUserTasks(app);

// Register the project endpoint
registerProject(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

registerAsana(app);
