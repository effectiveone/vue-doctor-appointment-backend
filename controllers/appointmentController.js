const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

async function getAppointmentsByDoctorId(req, res) {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id });
    const appointments = await Appointment.find({ doctorId: doctor._id });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error fetching appointments", success: false, error });
  }
}

async function getAppointmentsByUserId(req, res) {
  console.log("getAppointmentsByUserId", req.user.userId);
  try {
    const appointments = await Appointment.find({ userId: req.user.userId });
    console.log("appointments", appointments);
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error fetching appointments", success: false, error });
  }
}

async function addOrUpdateAppointment(req, res) {
  console.log("addOrUpdateAppointment_body", req.body);

  const { appointmentDate, appointmentTime } = req.body;
  const userId = req.user.userId;
  const doctorInfo = await Doctor.findOne({ _id: req.params.id });
  const doctorId = doctorInfo._id;
  try {
    const appointment = await Appointment.findOneAndUpdate(
      {
        userId: userId,
        doctorId: doctorId,
        date: appointmentDate,
        time: appointmentTime,
      },
      {
        userId: userId,
        doctorId: doctorId,
        doctorInfo: doctorInfo,
        date: appointmentDate,
        time: appointmentTime,
      },
      { new: true, upsert: true }
    );
    res.status(200).send({
      message: "Appointment added/updated successfully",
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error adding/updating appointment",
      success: false,
      error,
    });
  }
}

async function changeAppointmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(id, { status });

    const user = await User.findOne({ _id: appointment.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "appointment-status-changed",
      message: `Your appointment status has been ${status}`,
      onClickPath: "/appointments",
    });

    await user.save();

    res.status(200).send({
      message: "Appointment status updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error changing appointment status",
      success: false,
      error,
    });
  }
}

module.exports = {
  getAppointmentsByDoctorId,
  getAppointmentsByUserId,
  changeAppointmentStatus,
  addOrUpdateAppointment,
};
