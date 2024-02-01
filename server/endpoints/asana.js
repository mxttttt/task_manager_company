const db = require("../config/db");
const databaseQuery = require("../utils/databaseQuery");

function registerAsana(app) {
  // /!\ Fetch all clients and sections of each client from asana

  app.get("/api/asana/sync-clients", async (req, res) => {
    try {
      const asana = require("../config/asanaClient");
      const workspaceId = process.env.ASANA_WORKSPACE_ID;
      const teamId = process.env.ASANA_TEAM_ID;
      const opts = {
        limit: 100,
        workspace: workspaceId,
        team: teamId,
        archived: false,
        opt_fields: "name",
      };

      // Récupérer tous les projets
      const projectsResult = await asana.projectsApiInstance.getProjects(opts);
      const projects = projectsResult.data;

      // Récupérer les sections de chaque projet

      const projectsWithSections = [];

      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];

        const project_gid = project.gid;
        // Verification de l'existance du client dans la base de donnée si le gid existe déja sinon l'ajouter en utilisant la fonction mysql duplicate

        await databaseQuery(db, "INSERT INTO client (gid_asana, client_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE client_name = ?", [project_gid, project.name, project.name]);
        const databaseClient = await databaseQuery(db, "SELECT id FROM client WHERE gid_asana = ?", [project_gid]);
        const sectionOpts = {
          opt_fields: "name",
        };
        const sectionsResult = await asana.sectionsApiInstance.getSectionsForProject(project_gid, sectionOpts);
        const sections = sectionsResult.data;
        for (let j = 0; j < sections.length; j++) {
          const section = sections[j];

          const section_gid = section.gid;
          // Verifier si la section est déja dans la base de donnée si oui l'update sinon l'ajouter en utilisant la fonction mysql duplicate
          await databaseQuery(db, "INSERT INTO projet (section_gid_asana, nom, id_client) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE nom = ?, id_client = ?", [
            section_gid,
            section.name,
            databaseClient[0].id,
            section.name,
            databaseClient[0].id,
          ]);
        }

        projectsWithSections.push({ ...project, sections });
      }

      // Envoyer la réponse au client une seule fois
      res.send(projectsWithSections);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des données." });
    }
  });

  // Fetch users email and photo 168x168 from asana
  app.get("/api/asana/sync-users", async (req, res) => {
    try {
      const asana = require("../config/asanaClient");
      const workspaceId = process.env.ASANA_WORKSPACE_ID;
      // const teamId = process.env.ASANA_ALL_TEAM_ID;
      const opts = {
        limit: 100,
        workspace: workspaceId,
        // team: teamId,
        opt_fields: "name, email, photo.image_128x128",
      };

      // Récupérer les emails et photos des utilisateurs
      const usersResult = await asana.usersApiInstance.getUsers(opts);
      const users = usersResult.data;

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        const user_email = user.email;
        const user_name = user.name;
        const user_photo = user.photo !== null ? user.photo["image_128x128"] : null;

        // Verifier si l'utilisateur est déja dans la base de donnée en fonction de son email si oui l'update sinon l'ajouter en utilisant la fonction mysql duplicate

        await databaseQuery(db, "UPDATE users SET picture= ?, name= ? WHERE email = ?", [user_photo, user_name, user_email]);
      }
      res.status(200).send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Une erreur s'est produite lors de la récupération des données." });
    }
  });
}

module.exports = registerAsana;
