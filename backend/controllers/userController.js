const User = require("../models/User");


// =====================================================
// CREATE USER / SIGNUP
// =====================================================

const createUser = async (req, res) => {

    try {

        const {
            name,
            mobile,
            email,
            password,
            accountType
        } = req.body;


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (
            !name ||
            !mobile ||
            !email ||
            !password ||
            !accountType
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }


        // -------------------------------------------------
        // CHECK MOBILE
        // -------------------------------------------------

        if (mobile.length !== 10) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit mobile number."
            });

        }


        // -------------------------------------------------
        // CHECK EXISTING EMAIL
        // -------------------------------------------------

        const existingEmail =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (existingEmail) {

            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });

        }


        // -------------------------------------------------
        // CHECK EXISTING MOBILE
        // -------------------------------------------------

        const existingMobile =
            await User.findOne({
                mobile: mobile
            });


        if (existingMobile) {

            return res.status(409).json({
                success: false,
                message: "An account with this mobile number already exists."
            });

        }


        // -------------------------------------------------
        // CREATE USER
        // -------------------------------------------------

        const user =
            await User.create({

                name: name.trim(),

                mobile: mobile.trim(),

                email: email.toLowerCase().trim(),

                password: password,

                accountType: accountType

            });


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            user: {

                id: user._id,

                name: user.name,

                mobile: user.mobile,

                email: user.email,

                accountType: user.accountType

            }

        });

    } catch (error) {

        console.error(
            "Signup error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error while creating account."

        });

    }

};


module.exports = {
    createUser
};