const { Feedback, Generation } = require('../models');

exports.submitFeedback = async (req, res) => {
  try {
    const { generationId, rating, liked, comment } = req.body;
    const userId = req.user.id;

    if (!generationId || rating === undefined || liked === undefined) {
      return res.status(400).json({ error: 'Generation ID, rating (1-5), and liked status are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
    }

    // Verify the generation belongs to the user
    const generation = await Generation.findOne({
      where: { id: generationId, userId }
    });

    if (!generation) {
      return res.status(404).json({ error: 'Associated briefing record not found or access denied.' });
    }

    // Check if feedback already exists for this generation
    let feedback = await Feedback.findOne({ where: { generationId } });

    if (feedback) {
      // Update existing feedback
      feedback.rating = rating;
      feedback.liked = liked;
      feedback.comment = comment;
      await feedback.save();
    } else {
      // Create new feedback
      feedback = await Feedback.create({
        generationId,
        rating,
        liked,
        comment
      });
    }

    return res.status(201).json({
      message: 'Feedback submitted successfully.',
      feedback
    });
  } catch (error) {
    console.error('Submit Feedback Error:', error);
    return res.status(500).json({ error: 'An error occurred submitting feedback.' });
  }
};
