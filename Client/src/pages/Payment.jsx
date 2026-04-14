import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Step 1: Create Razorpay order
            const orderResponse = await axios.post("/api/orders", {
                amount: amount, // Amount in rupees
                currency: "INR",
            });

            const { id: order_id, amount: order_amount, currency } = orderResponse.data;

            // Step 2: Open Razorpay Checkout
            const options = {
                key: "rzp_test_ddcESwKlOPrGjk", // Replace with your Razorpay Key ID
                amount: order_amount,
                currency: currency,
                name: "Your Company Name",
                description: "Test Transaction",
                order_id: order_id,
                handler: async function (response) {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
                        response;

                    // Step 3: Verify payment on the backend
                    const verifyResponse = await axios.post("http://localhost:8000/api/verify", {
                        order_id: razorpay_order_id,
                        payment_id: razorpay_payment_id,
                        signature: razorpay_signature,
                    });

                    if (verifyResponse.data.success) {
                        alert("Payment successful!");
                    } else {
                        alert("Payment verification failed!");
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Something went wrong while initiating the payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Make a Payment</h2>
            <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </div>
    );
};

export default Payment;
