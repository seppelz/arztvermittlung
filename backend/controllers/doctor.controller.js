const Doctor = require('../models/doctor.model');

/**
 * Get doctor profile
 * @route GET /api/doctor/profile
 * @access Private
 */
exports.getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error getting doctor profile:', error);
    res.status(500).json({ message: 'Error retrieving doctor profile' });
  }
};

/**
 * Update doctor profile
 * @route POST /api/doctor/profile
 * @access Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      specialty,
      qualifications,
      otherQualifications,
      contact,
      availability,
      additionalInfo
    } = req.body;

    // Validate required fields
    if (!name || !specialty || !contact || !availability) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Find or create doctor profile
    let doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      doctor = new Doctor({
        userId: req.user.id,
        name,
        specialty,
        qualifications: qualifications || [],
        otherQualifications: otherQualifications || '',
        contact,
        availability,
        additionalInfo: additionalInfo || ''
      });
    } else {
      // Update existing profile
      doctor.name = name;
      doctor.specialty = specialty;
      doctor.qualifications = qualifications || doctor.qualifications;
      doctor.otherQualifications = otherQualifications || doctor.otherQualifications;
      doctor.contact = contact;
      doctor.availability = availability;
      doctor.additionalInfo = additionalInfo || doctor.additionalInfo;
    }

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ message: 'Error updating doctor profile' });
  }
};

/**
 * Delete doctor profile
 * @route DELETE /api/doctor/profile
 * @access Private
 */
exports.deleteProfile = async (req, res) => {
  try {
    const result = await Doctor.findOneAndDelete({ userId: req.user.id });
    
    if (!result) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    res.json({ message: 'Doctor profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor profile:', error);
    res.status(500).json({ message: 'Error deleting doctor profile' });
  }
}; 