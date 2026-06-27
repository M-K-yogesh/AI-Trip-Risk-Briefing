const { Op } = require('sequelize');
const { Generation } = require('../models');
const aiService = require('../services/aiService');

exports.generate = async (req, res) => {
  try {
    const {
      adminName,
      routeFrom,
      routeTo,
      season,
      vehicleType,
      duration,
      notes,
      selectedModel,
      lowTokenMode
    } = req.body;

    const userId = req.user.id;

    // Validate inputs
    if (!adminName || !routeFrom || !routeTo || !season || !vehicleType || !duration || !selectedModel) {
      return res.status(400).json({ error: 'All fields except additional notes are required.' });
    }



    // Call AI service and measure performance
    const startTime = Date.now();
    const result = await aiService.generateBriefing(
      { routeFrom, routeTo, season, vehicleType, duration, notes },
      selectedModel,
      !!lowTokenMode
    );
    const responseTimeMs = Date.now() - startTime;

    // Save history to MySQL
    const generation = await Generation.create({
      userId,
      adminName,
      routeFrom,
      routeTo,
      season,
      vehicleType,
      duration,
      notes,
      selectedModel: result.providerUsed,
      aiResponse: result.text,
      responseTimeMs
    });

    return res.status(201).json({
      message: 'Briefing generated successfully.',
      generation
    });

  } catch (error) {
    console.error('Generation Controller Error:', error);
    return res.status(500).json({ error: 'An error occurred during briefing generation. Please try again.' });
  }
};
