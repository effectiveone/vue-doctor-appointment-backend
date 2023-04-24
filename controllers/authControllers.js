const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const postLogin = async (req, res) => {
  console.log(req.body);
  try {
    console.log("login event came");
    const { mail, password } = req.body;

    const user = await User.findOne({ mail: mail.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      // send new token
      const token = jwt.sign(
        {
          userId: user._id,
          mail,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );

      return res.status(200).json({
        userId: user._id,
        type: user.type,
        token: token,
      });
    }

    return res.status(400).send("Invalid credentials. Please try again");
  } catch (err) {
    return res.status(500).send("Something went wrong. Please try again");
  }
};

const postRegister = async (req, res) => {
  try {
    const { mail, password, type } = req.body;
    console.log(req.body);

    console.log("user register request came");
    // check if user exists
    const userExists = await User.exists({ mail: mail.toLowerCase() });

    console.log(userExists);

    if (userExists) {
      return res.status(409).send("E-mail already in use.");
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user document and save in database
    const user = await User.create({
      mail: mail.toLowerCase(),
      password: encryptedPassword,
      type: type,
      isDoctor: type === "doctor",
      isPatient: type === "patient",
    });

    // create doctor document and save in database
    if (type === "doctor") {
      await Doctor.create({
        userId: user._id,
        firstName: "Jan",
        lastName: "Kowalski",
        phoneNumber: "555-123-456",
        website: "http://www.example.com",
        address: "ul. Przykładowa 1, 00-000 Warszawa",
        specialization: "Chirurgia ogólna",
        experience: "10 lat",
        feePerConsultation: 150,
        timings: [],
        status: "pending",
      });
    }

    // create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        mail,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      userDetails: {
        mail: user.mail,
        type: user.type,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error occured. Please try again");
  }
};

module.exports = {
  postLogin,
  postRegister,
};
