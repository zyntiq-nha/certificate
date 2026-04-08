const express = require("express");
const {
  createIntern,
  deleteIntern,
  getInterns,
  updateIntern
} = require("../controllers/internController");
const { requireAdminAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", requireAdminAuth, getInterns);
router.post("/", requireAdminAuth, createIntern);
router.put("/:id", requireAdminAuth, updateIntern);
router.delete("/:id", requireAdminAuth, deleteIntern);

module.exports = router;
