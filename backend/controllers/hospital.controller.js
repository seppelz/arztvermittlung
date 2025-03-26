const Hospital = require('../models/hospital.model');

/**
 * Get hospital profile
 * @route GET /api/hospital/profile
 * @access Private
 */
exports.getProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user.id });
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }
    
    res.json(hospital);
  } catch (error) {
    console.error('Error getting hospital profile:', error);
    res.status(500).json({ message: 'Error retrieving hospital profile' });
  }
};

/**
 * Update hospital profile
 * @route POST /api/hospital/profile
 * @access Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      type,
      address,
      contact,
      specialties,
      description,
      website
    } = req.body;

    // Validate required fields
    if (!name || !type || !address || !contact) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Find or create hospital profile
    let hospital = await Hospital.findOne({ userId: req.user.id });

    if (!hospital) {
      hospital = new Hospital({
        userId: req.user.id,
        name,
        type,
        address,
        contact,
        specialties: specialties || [],
        description: description || '',
        website: website || ''
      });
    } else {
      // Update existing profile
      hospital.name = name;
      hospital.type = type;
      hospital.address = address;
      hospital.contact = contact;
      hospital.specialties = specialties || hospital.specialties;
      hospital.description = description || hospital.description;
      hospital.website = website || hospital.website;
    }

    await hospital.save();
    res.json(hospital);
  } catch (error) {
    console.error('Error updating hospital profile:', error);
    res.status(500).json({ message: 'Error updating hospital profile' });
  }
}; 