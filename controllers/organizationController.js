const Organization = require("../models/Organization");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

require("dotenv").config();

exports.createOrganization = async (req, res) => {
  try {
    const { name, adminEmail } = req.body;

    if (!name || !adminEmail) {
      return res.status(400).json({
        message: "Organization name and admin email are required"
      });
    }

    // Generate secret code
    const secretCode = crypto.randomBytes(4).toString("hex");

    // Create organization
    const org = await Organization.create({
      name,
      secretCode
    });

    const frontendUrl = process.env.FRONTEND_URL;

    // Send email to organization admin
    await sendEmail(
      adminEmail,
      "Your Organization Secret Code",
      `
        Hello,

        Your organization "${name}" has been created.

        Secret Code: ${secretCode}

        To register as Organization Admin, visit:
        ${frontendUrl}/admin-signup

        Use the secret code during signup.

        Regards,
        Feature Flag System
      `
    );

    res.status(201).json({
      message: "Organization created and secret code sent to admin email",
      organization: {
        _id: org._id,
        name: org.name
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


exports.getOrganizations = async (req, res) => {
  const orgs = await Organization.find();
  res.json(orgs);
};


exports.getOrganizationById = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);

    if (!org) {
      return res.status(404).json({
        message: "Organization not found"
      });
    }

    res.json(org);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const { name } = req.body;

    const org = await Organization.findById(req.params.id);

    if (!org) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    // Update only allowed fields
    if (name) org.name = name;

    await org.save();

    res.json({
      message: "Organization updated successfully",
      organization: org,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


exports.deleteOrganization = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);

    if (!org) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    await org.deleteOne();

    res.json({
      message: "Organization deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
