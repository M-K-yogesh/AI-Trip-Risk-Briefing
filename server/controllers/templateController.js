const { Template } = require('../models');

exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.json({ templates });
  } catch (error) {
    console.error('Get Templates Error:', error);
    return res.status(500).json({ error: 'An error occurred fetching templates.' });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const { templateName, routeFrom, routeTo, season, vehicleType } = req.body;

    if (!templateName || !routeFrom || !routeTo || !season || !vehicleType) {
      return res.status(400).json({ error: 'All fields are required to create a template preset.' });
    }

    const template = await Template.create({
      templateName,
      routeFrom,
      routeTo,
      season,
      vehicleType
    });

    return res.status(201).json({
      message: 'Template preset created successfully.',
      template
    });
  } catch (error) {
    console.error('Create Template Error:', error);
    return res.status(500).json({ error: 'An error occurred saving template.' });
  }
};
