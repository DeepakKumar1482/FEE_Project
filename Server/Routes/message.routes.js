const { Router } = require("express");
const { sendMessage, getMessage, getConversation } = require("../Controller/message.controller.js");
const authmiddleware = require("../middleware/authmiddleware.js");
const router = Router();

router.route('/sendMessage').post(authmiddleware, sendMessage);
router.route('/getMessage').post(authmiddleware, getMessage);
router.route('/getConversation').get(authmiddleware, getConversation);

module.exports = router