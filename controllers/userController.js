const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

require("dotenv").config();

exports.createEndUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔹 Auto-generate password if not provided
    let generatedPassword = password;

    if (!generatedPassword) {
      generatedPassword = crypto.randomBytes(4).toString("hex"); 
      // example: a9f3c2d1
    }

    const user = await User.create({
      name,
      email,
      password: generatedPassword,
      role: "END_USER",
      organization: req.user.organization
    });

    const frontendUrl = process.env.FRONTEND_URL;

    // 🔹 Send email with credentials
    await sendEmail(
      email,
      "Your Account Credentials",
      `
        Hello ${name},

        Your account has been created.

        Email: ${email}
        Password: ${generatedPassword}

        Please login and change your password.
        To Login as End-user, visit:
        ${frontendUrl}

        Regards,
        Feature Flag System
      `
    );

    res.status(201).json({
      message: "End user created and credentials sent via email",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/* GET USERS (All or By ID) */
exports.getUsers = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 If ID is provided → Get single user
    if (id) {
      const user = await User.findOne({
        _id: id,
        organization: req.user.organization
      }).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found in your organization"
        });
      }

      return res.json(user);
    }

    // 🔹 If NO ID → Get all users
    const users = await User.find({
      organization: req.user.organization
    }).select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found in your organization",
      });
    }

    // Prevent updating role (security)
    if (req.body.role) {
      return res.status(400).json({
        message: "Role cannot be updated",
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found in your organization",
      });
    }

    await user.deleteOne();

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
