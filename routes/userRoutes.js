// const express = require("express");
// const router = express.Router();
// const { createEndUser, getUsers,  updateUser, deleteUser } = require("../controllers/userController");
// const { protect } = require("../middleware/authMiddleware");
// const { isOrgAdmin } = require("../middleware/roleMiddleware");

// router.post("/create-end-user", protect, isOrgAdmin, createEndUser);
// router.get("/:id", protect, isOrgAdmin, getUsers);
// router.get("/", protect, isOrgAdmin, getUsers);
// router.put("/:id", protect, isOrgAdmin, updateUser);
// router.delete("/:id", protect, isOrgAdmin, deleteUser);

// module.exports = router;


const express = require("express");
const router = express.Router();

const { createEndUser, getUsers,  updateUser, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { isOrgAdmin } = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management APIs (Organization Admin only)
 */

/**
 * @swagger
 * /api/users/create-end-user:
 *   post:
 *     summary: Create a new End User (Org Admin only)
 *     tags: [Users]
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
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Keerthana
 *               email:
 *                 type: string
 *                 example: keerthana@gmail.com
 *               password:
 *                 type: string
 *                 example: optionalPassword123
 *                 description: Optional. If not provided, password will be auto-generated.
 *     responses:
 *       201:
 *         description: End user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Validation error or user already exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/create-end-user", protect, isOrgAdmin, createEndUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users in your organization
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   organization:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

router.get("/", protect, isOrgAdmin, getUsers);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a specific user by ID (within your organization)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 698c35a90efdff05f56cb0b3
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 organization:
 *                   type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */

router.get("/:id", protect, isOrgAdmin, getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user (within your organization)
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put("/:id", protect, isOrgAdmin, updateUser);


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (within your organization)
 *     tags: [Users]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", protect, isOrgAdmin, deleteUser);


module.exports = router;
