const mongoose = require("mongoose");

const featureFlagSchema = new mongoose.Schema({
  featureKey: {
    type: String,
    required: true
  },

  enabled: {
    type: Boolean,
    default: false
  },

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("FeatureFlag", featureFlagSchema);
