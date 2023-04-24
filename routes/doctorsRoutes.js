const express = require("express");
const auth = require("../middlewares/auth");
const doctorController = require("../controllers/doctorsController");

const router = express.Router();

router.get("/get-all-doctors", doctorController.getAllDoctors);
router.post("/profile", auth, doctorController.getDoctorInfoByUserId);
router.post("/:id/profile", doctorController.getDoctorInfoById);
router.put("/profile", auth, doctorController.updateDoctorProfile);

module.exports = router;
