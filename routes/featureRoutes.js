// const express = require("express");
// const router = express.Router();

// const {
//   createFeature,
//   getFeatureById,
//   updateFeature,
//   deleteFeature,
//   checkFeature,
//   getAllFeatures
// } = require("../controllers/featureController");

// const { protect } = require("../middleware/authMiddleware");
// const { isOrgAdmin } = require("../middleware/roleMiddleware");

// /* Org Admin routes */
// router.post("/", protect, isOrgAdmin, createFeature);
// router.put("/:id", protect, isOrgAdmin, updateFeature);
// router.delete("/:id", protect, isOrgAdmin, deleteFeature);

// /* End User / Org Admin check */
// router.get("/check", protect, checkFeature);
// router.get("/:id", protect, isOrgAdmin, getFeatureById);
// router.get("/", protect, isOrgAdmin, getAllFeatures);

// module.exports = router;





const express = require("express");
const router = express.Router();

const {
  createFeature,
  getFeatureById,
  updateFeature,
  deleteFeature,
  checkFeature,
  getAllFeatures
} = require("../controllers/featureController");

const { protect } = require("../middleware/authMiddleware");
const { isOrgAdmin } = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Features
 *   description: Feature Flag Management APIs
 */

/**
 * @swagger
 * /api/features:
 *   post:
 *     summary: Create a new feature flag (Org Admin only)
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               featureKey:
 *                 type: string
 *                 example: NEW_DASHBOARD
 *               enabled:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Feature created successfully
 */
router.post("/", protect, isOrgAdmin, createFeature);

/**
 * @swagger
 * /api/features/{id}:
 *   put:
 *     summary: Update feature flag (Org Admin only)
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feature ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Feature updated successfully
 *       404:
 *         description: Feature not found
 */
router.put("/:id", protect, isOrgAdmin, updateFeature);

/**
 * @swagger
 * /api/features/{id}:
 *   delete:
 *     summary: Delete feature flag (Org Admin only)
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feature ID
 *     responses:
 *       200:
 *         description: Feature deleted successfully
 *       404:
 *         description: Feature not found
 */
router.delete("/:id", protect, isOrgAdmin, deleteFeature);

/**
 * @swagger
 * /api/features/check:
 *   get:
 *     summary: Check if a feature is enabled for the logged-in user's organization
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: featureKey
 *         required: true
 *         schema:
 *           type: string
 *         description: Feature key to check
 *     responses:
 *       200:
 *         description: Feature status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 featureKey:
 *                   type: string
 *                 enabled:
 *                   type: boolean
 *       404:
 *         description: Feature not found
 */
router.get("/check", protect, checkFeature);

/**
 * @swagger
 * /api/features/{id}:
 *   get:
 *     summary: Get feature by ID (Org Admin only)
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feature ID
 *     responses:
 *       200:
 *         description: Feature details
 *       404:
 *         description: Feature not found
 */
router.get("/:id", protect, isOrgAdmin, getFeatureById);

/**
 * @swagger
 * /api/features:
 *   get:
 *     summary: Get all feature flags for the logged-in organization (Org Person only)
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of feature flags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 65d123abc456def789012345
 *                   featureKey:
 *                     type: string
 *                     example: NEW_DASHBOARD
 *                   enabled:
 *                     type: boolean
 *                     example: true
 *                   organization:
 *                     type: string
 *                     example: 65d123abc456def789099999
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-02-14T10:00:00.000Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-02-14T10:00:00.000Z
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Org Admin access required / End user
 *       500:
 *         description: Server error
 */
router.get("/", protect, getAllFeatures);

module.exports = router;

