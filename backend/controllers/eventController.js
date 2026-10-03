const Event = require("../models/Event");


// =====================================================
// CREATE EVENT
// =====================================================

const createEvent = async (req, res) => {

    try {

        const {
            userId,
            eventName,
            eventType,
            eventDate,
            startTime,
            endTime,
            city,
            area,
            venueType,
            venuePreference,
            guestCount,
            budget,
            budgetFlexibility,
            guestType,
            services,
            eventTheme,
            eventMood,
            eventDescription
        } = req.body;


        // -------------------------------------------------
        // REQUIRED FIELD VALIDATION
        // -------------------------------------------------

        if (
            !userId ||
            !eventName ||
            !eventType ||
            !eventDate ||
            !startTime ||
            !endTime ||
            !city ||
            !guestCount ||
            budget === undefined ||
            budget === null
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide all required event details."

            });

        }


        // -------------------------------------------------
        // CREATE EVENT
        // -------------------------------------------------

        const event =
            await Event.create({

                userId,

                eventName:
                    eventName.trim(),

                eventType,

                eventDate,

                startTime,

                endTime,

                city:
                    city.trim(),

                area:
                    area
                        ? area.trim()
                        : "",

                venueType,

                venuePreference,

                guestCount:
                    Number(guestCount),

                budget:
                    Number(budget),

                budgetFlexibility,

                guestType,

                services:
                    Array.isArray(services)
                        ? services
                        : [],

                eventTheme:
                    eventTheme
                        ? eventTheme.trim()
                        : "",

                eventMood,

                eventDescription:
                    eventDescription
                        ? eventDescription.trim()
                        : ""

            });


        // -------------------------------------------------
        // SUCCESS RESPONSE
        // -------------------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Event created successfully.",

            event

        });

    } catch (error) {

        console.error(
            "Create event error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while creating event."

        });

    }

};


// =====================================================
// GET EVENT BY ID
// =====================================================

const getEventById = async (req, res) => {

    try {

        const event =
            await Event.findById(
                req.params.id
            );


        if (!event) {

            return res.status(404).json({

                success: false,

                message:
                    "Event not found."

            });

        }


        res.status(200).json({

            success: true,

            event

        });

    } catch (error) {

        console.error(
            "Get event error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while retrieving event."

        });

    }

};


// =====================================================
// UPDATE EVENT
// =====================================================

const updateEvent = async (req, res) => {

    try {

        const {
            eventName,
            eventType,
            eventDate,
            startTime,
            endTime,
            city,
            area,
            venueType,
            venuePreference,
            guestCount,
            budget,
            budgetFlexibility,
            guestType,
            services,
            eventTheme,
            eventMood,
            eventDescription
        } = req.body;


        const updatedEvent =
            await Event.findByIdAndUpdate(

                req.params.id,

                {

                    eventName,

                    eventType,

                    eventDate,

                    startTime,

                    endTime,

                    city,

                    area,

                    venueType,

                    venuePreference,

                    guestCount:
                        Number(guestCount),

                    budget:
                        Number(budget),

                    budgetFlexibility,

                    guestType,

                    services:
                        Array.isArray(services)
                            ? services
                            : [],

                    eventTheme,

                    eventMood,

                    eventDescription

                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!updatedEvent) {

            return res.status(404).json({

                success: false,

                message:
                    "Event not found."

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Event updated successfully.",

            event:
                updatedEvent

        });

    } catch (error) {

        console.error(
            "Update event error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while updating event."

        });

    }

};


module.exports = {

    createEvent,

    getEventById,

    updateEvent

};