const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");

async function getAllDoctors(req, res) {
  try {
    const doctors = await Doctor.find();
    res.status(200).send({
      success: true,
      message: "List of doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting list of doctors",
      success: false,
      error,
    });
  }
}

async function getDoctorInfoByUserId(req, res) {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
}

async function getDoctorInfoById(req, res) {
  try {
    let doctor = await Doctor.findOne({ _id: req.params.id });
    if (!doctor) {
      // Jeśli nie ma znalezionego doktora, a użytkownik jest doktorem
      let user = await User.findById(req.params.id);
      if (user.isDoctor) {
        doctor = await Doctor.findOne({ userId: req.params.id });
      }
    }
    if (doctor) {
      res.status(200).send({
        success: true,
        message: "Doctor info fetched successfully",
        data: doctor,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
}

async function updateDoctorProfile(req, res) {
  console.log(req.body);
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.userId },
      { ...req.body, feePerCunsultation: req.body.feePerConsultation }
    );
    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
}

module.exports = {
  getDoctorInfoByUserId,
  getDoctorInfoById,
  updateDoctorProfile,
  getAllDoctors,
};
