const express = require("express");
const router = express.Router();
const {User} = require("../db/index"); 
const jwt = require("jsonwebtoken");
require('dotenv').config();