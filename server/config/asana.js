require("dotenv").config();
const Asana = require("asana");
const e = require("express");

const client = Asana.ApiClient.instance;
const token = client.authentications["token"];
token.accessToken = process.env.ASANA_SECRET_TOKEN;

const projectsApiInstance = new Asana.ProjectsApi();
const sectionsApiInstance = new Asana.SectionsApi();

exports.projectsApiInstance = projectsApiInstance;
exports.sectionsApiInstance = sectionsApiInstance;
