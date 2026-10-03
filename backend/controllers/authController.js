const User = require("../models/User");
const Vendor = require("../models/Vendor");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        let vendorId = null;
        if (user.accountType === "vendor") {
            const vendor = await Vendor.findOne({
                $or: [
                    { user: user._id },
                    { "contact.email": user.email }
                ]
            }).sort({ createdAt: -1 });

            if (!vendor) {
                return res.status(403).json({
                    success: false,
                    message: "Vendor account found, but vendor registration is not completed."
                });
            }

            if (vendor.status !== "approved") {
                const message = vendor.status === "rejected"
                    ? "Your vendor application was rejected."
                    : "Your vendor application is still pending admin approval.";
                return res.status(403).json({ success: false, message });
            }

            vendorId = vendor._id;
        }

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                email: user.email,
                accountType: user.accountType,
                vendorId
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Server error while logging in." });
    }
};

module.exports = { loginUser };
