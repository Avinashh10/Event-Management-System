module.exports = function allowRoles(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.redirect('/403');
    }
    next();
  };
};
