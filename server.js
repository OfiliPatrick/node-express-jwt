const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = require("./config");

const app = express();

app.get("/", (req, res) => {
  res.send({ msg: ok });
});

const PORT = process.env.PORT || 5000;

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    name: "pat",
    email: "pat@gmail.com",
  };

  jwt.sign({ userdet: user }, SECRET, { expiresIn: "30s" }, (err, token) => {
    res.json({
      tokendet: token,
    });
  });
});

const verifyAndSetToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const token = bearerHeader.split(" ")[1];
    req.clientToken = token;
    next();
  } else {
    res.status(404).json({ msg: "bad verify" });
  }
};

app.post("/api/profile", verifyAndSetToken, (req, res) => {
  jwt.verify(req.clientToken, "shhh", (err, authData) => {
    if (err) {
      res.status(404).json({ msg: "bad profile" });
    } else {
      res.status(200).json({ msg: "good profile", authData });
    }
  });
});

app.listen(PORT, () => {
  console.log(`server is good to go at PORT ${PORT}`);
});
