const { Router } = require("express");
const router = Router();

router.route("/orders").post(async (req, res) => {

    const { amount, currency } = req.body;

    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
}})
router.route("/verify").post(async (req, res) => {

    const { amount, currency } = req.body;

    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
}})

module.exports = router;