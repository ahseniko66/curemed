const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../middleware/authMiddleware');
const { validateDiagnose, validateAppointment } = require('../middleware/validation');

router.post('/diagnose', validateDiagnose, resourceController.diagnoseAndRoute);
router.post('/', auth, validateAppointment, resourceController.createBooking);

router.get('/', auth, resourceController.getUserAppointments);      
router.get('/:id', auth, resourceController.getAppointmentById);   
router.put('/:id', auth, resourceController.updateAppointment);    
router.delete('/:id', auth, resourceController.deleteAppointment);  

module.exports = router;