exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Super Admin only" });
  }
  next();
};

exports.isOrgAdmin = (req, res, next) => {
  if (req.user.role !== "ORG_ADMIN") {
    return res.status(403).json({ message: "Organization Admin only" });
  }
  next();
};
