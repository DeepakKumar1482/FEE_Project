const { Router } = require("express");
const { createMessage } = require("../Controller/message.controller.js");
const router = Router();

router.route('/:receiver').post(createMessage);

module.exports = router