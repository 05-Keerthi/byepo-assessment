const FeatureFlag = require("../models/FeatureFlag");
const User = require("../models/User");

/* CREATE FEATURE */
exports.createFeature = async (req, res) => {
  const feature = await FeatureFlag.create({
    featureKey: req.body.featureKey,
    enabled: req.body.enabled,
    organization: req.user.organization
  });

  res.status(201).json(feature);
};

/* GET FEATURE BY ID (Scoped to Org) */
exports.getFeatureById = async (req, res) => {
  try {
    const feature = await FeatureFlag.findOne({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!feature) {
      return res.status(404).json({
        message: "Feature not found in your organization"
      });
    }

    res.json(feature);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* UPDATE FEATURE (Scoped to Org) */
exports.updateFeature = async (req, res) => {
  const feature = await FeatureFlag.findOneAndUpdate(
    {
      _id: req.params.id,
      organization: req.user.organization
    },
    req.body,
    { new: true }
  );

//   console.log("Feature ID:", req.params.id);
//   console.log("User Org:", req.user.organization);

  if (!feature) {
    return res.status(404).json({ message: "Feature not found" });
  }

  res.json(feature);
};

/* DELETE FEATURE (Scoped to Org) */
exports.deleteFeature = async (req, res) => {
  const feature = await FeatureFlag.findOneAndDelete({
    _id: req.params.id,
    organization: req.user.organization
  });

  if (!feature) {
    return res.status(404).json({ message: "Feature not found" });
  }

  res.json({ message: "Deleted successfully" });
};

/* CHECK FEATURE (Scoped Automatically) */
exports.checkFeature = async (req, res) => {
  try {
    const { featureKey } = req.query;

    if (!featureKey) {
      return res.status(400).json({ message: "Feature key is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.user.organization) {
      return res.status(403).json({
        message: "User is not associated with any organization"
      });
    }

    const orgId =
      req.user.organization._id || req.user.organization;

    const feature = await FeatureFlag.findOne({
      featureKey,
      organization: orgId
    });

    if (!feature) {
      return res.status(404).json({
        message: "Feature not found in your organization"
      });
    }

    return res.json({
      featureKey,
      enabled: feature.enabled
    });

  } catch (error) {
  console.log("CHECK FEATURE ERROR:", error);
  return res.status(500).json({
    message: "Server error",
    error: error.message
  });
}
};

// ADD THIS IN featureController
exports.getAllFeatures = async (req, res) => {
  try {
    const features = await FeatureFlag.find({
      organization: req.user.organization
    });

    res.json(features);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

