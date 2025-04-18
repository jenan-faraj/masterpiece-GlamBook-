// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact');

// Contact routes
router.route('/')
  .get(contactController.getAllContacts)
  .post(contactController.createContact);

router.route('/:id')
  .get(contactController.getContactById)
  .put(contactController.updateContactStatus)
  .delete(contactController.deleteContact);

module.exports = router;