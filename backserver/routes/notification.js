const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create a new notification
router.post('/', notificationController.createNotification);

// Get all notifications
router.get('/', notificationController.getNotifications);

// Get a single notification by ID
router.get('/:id', notificationController.getNotification);

// Update a notification by ID
router.put('/:id', notificationController.updateNotification);

// Delete a notification by ID
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
