const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const Organization = require("../models/Organization");

/* SIGNUP */
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (role !== "SUPER_ADMIN") {
      if (!organization) {
        return res.status(400).json({ message: "Organization is required" });
      }

      const orgExists = await Organization.findById(organization);
      if (!orgExists) {
        return res.status(400).json({ message: "Invalid organization ID" });
      }
    }

    if (role === "ORG_ADMIN") {

        const org = await Organization.findById(organization);

        if (!org) {
            return res.status(400).json({ message: "Invalid organization" });
        }

        if (org.secretCode !== req.body.secretCode) {
            return res.status(403).json({ message: "Invalid secret code" });
        }
        }


    const user = await User.create({
      name,
      email,
      password,
      role,
      organization: role === "SUPER_ADMIN" ? undefined : organization
    });

    // 🔹 Populate organization details
    await user.populate("organization");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      user: {
        message: "successfully created the account.",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


/* LOGIN */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("organization");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
         message: "Successfully logged in.",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* LOGOUT */
exports.logout = async (req, res) => {
  try {
    // req.user comes from protect middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Remove refresh token
    user.refreshToken = null;
    await user.save();

    res.json({
      message: "Logged out successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};
