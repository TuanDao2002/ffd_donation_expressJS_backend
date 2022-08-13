const express = require("express");
const router = express.Router();

const addRowGoogleSheet = require("../controllers/addRowGoogleSheet");

router.route("/").post(addRowGoogleSheet);

module.exports = router
