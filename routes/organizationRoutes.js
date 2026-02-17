// const express = require("express");
// const router = express.Router();

// const { createOrganization, getOrganizations, getOrganizationById, updateOrganization, deleteOrganization} = require("../controllers/organizationController");
// const { protect } = require("../middleware/authMiddleware");
// const { isSuperAdmin } = require("../middleware/roleMiddleware");

// router.post("/", protect, isSuperAdmin, createOrganization);
// router.get("/", protect, isSuperAdmin, getOrganizations);
// router.get("/:id", protect, isSuperAdmin, getOrganizationById);
// router.put("/:id", protect, isSuperAdmin, updateOrganization);
// router.delete("/:id", protect, isSuperAdmin, deleteOrganization);

// module.exports = router;




const express = require("express");
const router = express.Router();

const {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
} = require("../controllers/organizationController");

const { protect } = require("../middleware/authMiddleware");
const { isSuperAdmin } = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Organization Management APIs (Super Admin only)
 */

/**
 * @swagger
 * /api/orgs:
 *   post:
 *     summary: Create a new organization 
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - adminEmail
 *             properties:
 *               name:
 *                 type: string
 *                 example: TechCorp
 *               adminEmail:
 *                 type: string
 *                 example: admin@techcorp.com
 *     responses:
 *       201:
 *         description: Organization created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, isSuperAdmin, createOrganization);

/**
 * @swagger
 * /api/orgs:
 *   get:
 *     summary: Get all organizations 
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of organizations
 *       401:
 *         description: Unauthorized
 */
// router.get("/", protect, isSuperAdmin, getOrganizations);
router.get("/", getOrganizations);

/**
 * @swagger
 * /api/orgs/{id}:
 *   get:
 *     summary: Get a specific organization by ID (Super Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Organization ID
 *         schema:
 *           type: string
 *           example: 698b2ac49969e9ace4ecf56b
 *     responses:
 *       200:
 *         description: Organization details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 secretCode:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       404:
 *         description: Organization not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, isSuperAdmin, getOrganizationById);

/**
 * @swagger
 * /api/orgs/{id}:
 *   put:
 *     summary: Update organization (Super Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated TechCorp
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *       404:
 *         description: Organization not found
 */
router.put("/:id", protect, isSuperAdmin, updateOrganization);


/**
 * @swagger
 * /api/orgs/{id}:
 *   delete:
 *     summary: Delete organization (Super Admin only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *       404:
 *         description: Organization not found
 */
router.delete("/:id", protect, isSuperAdmin, deleteOrganization);


module.exports = router;

