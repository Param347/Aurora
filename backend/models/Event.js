const mongoose = require("mongoose");


// =====================================================
// EVENT SCHEMA
// =====================================================

const eventSchema = new mongoose.Schema(
    {

        // -------------------------------------------------
        // USER WHO CREATED THE EVENT
        // -------------------------------------------------

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // -------------------------------------------------
        // EVENT BASICS
        // -------------------------------------------------

        eventName: {
            type: String,
            required: true,
            trim: true
        },

        eventType: {
            type: String,
            required: true,
            trim: true
        },

        eventDate: {
            type: String,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },


        // -------------------------------------------------
        // LOCATION & VENUE
        // -------------------------------------------------

        city: {
            type: String,
            required: true,
            trim: true
        },

        area: {
            type: String,
            trim: true,
            default: ""
        },

        venueType: {
            type: String,
            trim: true,
            default: ""
        },

        venuePreference: {
            type: String,
            trim: true,
            default: ""
        },


        // -------------------------------------------------
        // GUESTS & BUDGET
        // -------------------------------------------------

        guestCount: {
            type: Number,
            required: true,
            min: 1
        },

        budget: {
            type: Number,
            required: true,
            min: 0
        },

        budgetFlexibility: {
            type: String,
            trim: true,
            default: ""
        },

        guestType: {
            type: String,
            trim: true,
            default: ""
        },


        // -------------------------------------------------
        // SERVICES
        // -------------------------------------------------

        services: {
            type: [String],
            default: []
        },


        // -------------------------------------------------
        // EVENT STYLE
        // -------------------------------------------------

        eventTheme: {
            type: String,
            trim: true,
            default: ""
        },

        eventMood: {
            type: String,
            trim: true,
            default: ""
        },

        eventDescription: {
            type: String,
            trim: true,
            default: ""
        }

    },

    {
        timestamps: true
    }
);


// =====================================================
// EXPORT MODEL
// =====================================================

module.exports =
    mongoose.model(
        "Event",
        eventSchema
    );