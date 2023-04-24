const express = require("express");
const auth = require("../middlewares/auth");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

router.get(
  "/appointments/:id/",
  appointmentController.getAppointmentsByDoctorId
);

router.get(
  "/appointments",
  auth,
  appointmentController.getAppointmentsByUserId
);

router.put(
  "/appointments/:id",
  auth,
  appointmentController.addOrUpdateAppointment
);

module.exports = router;
