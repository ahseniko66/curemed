const Appointment = require('../models/Appointment');

const triageLogic = [
    {
        name: 'UMC Mother and Child Health Center',
        keywords: ['pregnant', 'pregnancy', 'baby', 'childbirth', 'maternity', 'prenatal', 'labor', 'delivery','child'],
        diagnosis: 'Obstetrics and specialized prenatal care suggested',
        coords: { lat:51.12631486484628, lng: 71.40579403276766 },
        address: 'Astana, Mother and Child Center'
    },
    {
        name: 'National Scientific Cardiac Surgery Center',
        keywords: ['chest pain', 'heart', 'cardiac', 'breath', 'shortness', 'pressure', 'heart attack', 'arrhythmia', 'palpitation'],
        diagnosis: 'Cardiac evaluation recommended',
        coords: { lat: 51.11877490752127, lng: 71.40330612655185 },
        address: 'Astana, Cardiac Center'
    },
    {
        name: 'National Institute of Traumatology and Orthopedics',
        keywords: ['broken', 'broke','fracture', 'leg', 'arm', 'bone', 'trauma', 'accident', 'sprain', 'dislocation', 'injury'],
        diagnosis: 'Traumatology and orthopedic care needed',
        coords: { lat: 51.159379723946465, lng: 71.47841489152694},
        address: 'Astana, Traumatology Institute'
       
    },
    {
        name: 'City Infectious Disease Hospital',
        keywords: ['fever', 'flu', 'cough', 'cold', 'infection', 'virus', 'covid', 'temperature', 'pneumonia', 'respiratory'],
        diagnosis: 'Infectious disease evaluation suggested',
        coords: { lat: 51.151892477546184, lng: 71.51056073383484},
        address: 'Astana, Infectious Disease Hospital'
    },
    {
        name: 'City Multidisciplinary Hospital #1',
        keywords: ['general', 'checkup', 'routine', 'sick', 'unwell', 'not feeling', 'headache', 'stomach', 'dizzy'],
        diagnosis: 'General medical evaluation suggested',
        coords: { lat: 51.14693911750649, lng: 71.52944348493763},
        address: 'Astana, Main City Hospital'
    },
    {
        name: 'Astana Vision Institute',
        keywords: ['eye', 'vision', 'blurry', 'blind', 'cataract', 'glaucoma', 'red eye', 'sight', 'cornea', 'glasses'],
        diagnosis: 'Ophthalmological examination and vision assessment needed',
        coords: { lat: 51.15207290052248, lng: 71.39191786802667 },
        address: 'Astana, Uly Dala Ave 8'
        
    },
    {
        name: 'City Dental Clinic',
        keywords: ['tooth', 'dental', 'gum', 'braces', 'wisdom tooth', 'cavity', 'filling', 'bleeding gums', 'mouth pain'],
        diagnosis: 'Dental consultation and oral health treatment suggested',
        coords: { lat: 51.16547224399639, lng: 71.43451708985768 },
        address: 'Astana, Respublika Ave'
       
    },
    {
        name: 'National Scientific Center for Oncology and Transplantology',
        keywords: ['cancer', 'tumor', 'oncology', 'biopsy', 'chemotherapy', 'radiation', 'transplant', 'leukemia', 'lump'],
        diagnosis: 'Specialized oncological screening or transplant consultation recommended',
        coords: { lat: 51.15630649885058, lng: 71.46888205121827},
        address: 'Astana, Kerey, Zhanibek Khandar St 3'
       
    },
];

exports.diagnoseAndRoute = async (req, res, next) => {
    try {
        const { symptoms } = req.body;
        
        if (!symptoms || symptoms.trim().length < 3) {
            return res.status(400).json({
                success: false,
                error: "Please provide symptoms (at least 3 characters)"
            });
        }
        
        const input = symptoms.toLowerCase();
        console.log(`🔍 Analyzing symptoms: "${symptoms}"`);
        
        let result = {
            success: true,
            diagnosis: "General medical evaluation suggested.",
            hospitalName: "City Multidisciplinary Hospital #1",
            coords: { lat: 51.1283, lng: 71.4305 },
            address: "Astana, Main City Hospital",
            matchedKeywords: []
        };

        for (const category of triageLogic) {
            const foundKeywords = category.keywords.filter(keyword => 
                input.includes(keyword.toLowerCase())
            );
            
            if (foundKeywords.length > 0) {
                console.log(`✅ Matched: ${category.name} with keywords:`, foundKeywords);
                result.diagnosis = category.diagnosis;
                result.hospitalName = category.name; 
                result.coords = category.coords;
                result.address = category.address;
                result.matchedKeywords = foundKeywords;
                break; 
            }
        }
        
        console.log(`🏥 Final recommendation: ${result.hospitalName}`);
        res.json(result);
        
    } catch (err) {
        console.error("❌ Diagnose error:", err);
        next(err);
    }
};

exports.createBooking = async (req, res, next) => {
    try {
        const { hospitalName, age, gender, symptoms } = req.body;
        
        if (!hospitalName || !age || !gender) {
            return res.status(400).json({
                success: false,
                error: "Please provide hospitalName, age, and gender"
            });
        }
        
        const appointment = await Appointment.create({
            userId: req.user.id,
            hospitalName,
            age,
            gender,
            symptoms: symptoms || 'Not specified',
            appointmentDate: new Date(),
            appointmentTime: "09:00 AM"
        });
        
        console.log(`✅ Appointment created for ${hospitalName}`);
        res.status(201).json({ 
            success: true, 
            message: "Appointment created successfully",
            appointment 
        });
    } catch (err) {
        console.error("❌ Booking error:", err);
        next(err);
    }
};

exports.getUserAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        
        console.log(`📋 Found ${appointments.length} appointments for user ${req.user.id}`);
        res.json({ 
            success: true, 
            count: appointments.length,
            appointments 
        });
    } catch (err) {
        console.error("❌ Get appointments error:", err);
        next(err);
    }
};

exports.getAppointmentById = async (req, res, next) => {
    try {
        const appointment = await Appointment.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });
        
        if (!appointment) {
            console.log(`❌ Appointment ${req.params.id} not found for user ${req.user.id}`);
            return res.status(404).json({ 
                success: false, 
                error: "Appointment not found" 
            });
        }
        
        console.log(`✅ Found appointment: ${appointment.hospitalName}`);
        res.json({ 
            success: true, 
            appointment 
        });
    } catch (err) {
        console.error("❌ Get appointment by ID error:", err);
        next(err);
    }
};

exports.updateAppointment = async (req, res, next) => {
    try {
        const updated = await Appointment.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!updated) {
            console.log(`❌ Update failed: Appointment ${req.params.id} not found`);
            return res.status(404).json({ 
                success: false, 
                error: "Appointment not found or not authorized" 
            });
        }
        
        console.log(`✅ Updated appointment: ${updated.hospitalName}`);
        res.json({ 
            success: true, 
            message: "Appointment updated successfully",
            appointment: updated 
        });
    } catch (err) {
        console.error("❌ Update appointment error:", err);
        next(err);
    }
};

exports.deleteAppointment = async (req, res, next) => {
    try {
        const deleted = await Appointment.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.id 
        });
        
        if (!deleted) {
            console.log(`❌ Delete failed: Appointment ${req.params.id} not found`);
            return res.status(404).json({ 
                success: false, 
                error: "Appointment not found or not authorized" 
            });
        }
        
        console.log(`🗑️ Deleted appointment: ${deleted.hospitalName}`);
        res.json({ 
            success: true, 
            message: "Appointment deleted successfully" 
        });
    } catch (err) {
        console.error("❌ Delete appointment error:", err);
        next(err);
    }
};