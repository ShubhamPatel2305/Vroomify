const express = require("express");
const router = express.Router();
const {User} = require("../db/index"); 
const jwt = require("jsonwebtoken");
const {sendOtpEmail} = require("../utilities/MailUtility")
require('dotenv').config();
const bcrypt = require("bcrypt");