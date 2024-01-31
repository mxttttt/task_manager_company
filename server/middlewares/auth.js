function authMiddleware(req, res, next) {
  //check if path is not login
  if (req.path === "/api/login") {
    next();
    return;
  }
  //check if user have cookie
  const user = req.cookies.user;
  if (user) {
    next();
    return;
  }
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

module.exports = authMiddleware;
