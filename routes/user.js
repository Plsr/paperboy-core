const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// FIXME: Remove once work on the feature is done
router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      hashedPassword: hashedPassword,
    });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/me", verifyToken, (req, res) => {
  jwt.verify(req.token, "super-secret-key", (err, authData) => {
    if (err) return res.sendStatus(403);
    res.json({ authData });
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user) return res.status(401).end();

    if (await bcrypt.compare(password, user.hashedPassword)) {
      const exposedUser = {
        id: user.id,
        email: user.email,
      };

      jwt.sign(
        { exposedUser },
        "super-secret-key",
        { expiresIn: "30s" },
        (err, token) => {
          if (token) res.status(200).json({ token });
          if (error) res.status(500).json({ message: err.message });
        }
      );
    } else {
      res.status(401).end();
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

// TODO: Move somewhere more accessible as it will be needed by other
// parts of the server as well in the future
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return res.sendStatus(403);

  const token = bearerHeader.split(" ")[1];
  req.token = token;
  next();
}

module.exports = router;
