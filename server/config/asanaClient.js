require("dotenv").config();
const Asana = require("asana");

const client = Asana.ApiClient.instance;
const token = client.authentications["token"];
token.accessToken = process.env.ASANA_SECRET_TOKEN;

const projectsApiInstance = new Asana.ProjectsApi();
const sectionsApiInstance = new Asana.SectionsApi();
const usersApiInstance = new Asana.UsersApi();

exports.projectsApiInstance = projectsApiInstance;
exports.sectionsApiInstance = sectionsApiInstance;
exports.usersApiInstance = usersApiInstance;
