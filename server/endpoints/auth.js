const db = require("../config/db");
const databaseQuery = require("../utils/databaseQuery");
const bcrypt = require("bcrypt");

// // A utiliser pour créer les comptes de tout le monde (à faire une seule fois)
// const salt = bcrypt.genSaltSync(10);
// console.log(salt);
// const hashedPassword2 = bcrypt.hashSync("Yea8M52UaKJW", salt);
// console.log(hashedPassword2);

function registerAuth(app) {
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      //if no email or password provided
      res.status(400).json({
        success: false,
        message: "Bad request",
      });
      return;
    }
    const result = await databaseQuery(db, "SELECT users.*, job.role, job.job_name FROM users INNER JOIN job ON users.user_job_id = job.id WHERE email = ?", [email]);
    //if no result returned, then no user with this email exists
    if (result.length === 0) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    //if user exists, then compare the password with the hashed password in the database

    const user = result[0];
    const hashedPassword = bcrypt.hashSync(password, user.salt);
    if (hashedPassword !== user.password) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }
    //if password is correct, create a Cookie
    console.log(user);
    res
      .cookie("user", JSON.stringify({ email: user.email, picture: user.picture, nom: user.nom, prenom: user.prenom, user_role: user.role }), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
        domain: "localhost",
        // xhrFields: { withCredentials: true },
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in",
        user,
      });
  });

  app.post("/api/logout", (req, res) => {
    res.clearCookie("user").status(200).json({
      success: true,
    });
  });
}

module.exports = registerAuth;
