const express = require("express");

const {
    createEvent,
    getEventById,
    updateEvent
} = require("../controllers/eventController");


const router = express.Router();


// =====================================================
// CREATE EVENT
// POST /api/events
// =====================================================

router.post(
    "/",
    createEvent
);


// =====================================================
// GET EVENT BY ID
// GET /api/events/:id
// =====================================================

router.get(
    "/:id",
    getEventById
);


// =====================================================
// UPDATE EVENT
// PUT /api/events/:id
// =====================================================

router.put(
    "/:id",
    updateEvent
);


module.exports = router;