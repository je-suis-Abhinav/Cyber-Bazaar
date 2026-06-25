const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");
const {uploadImage,} = require("../controllers/uploadController");
const adminOnly = require("../middleware/adminMiddleware");
router.post(
  "/",
  protect,adminOnly,
  upload.single("image"),
  uploadImage
);

module.exports = router;