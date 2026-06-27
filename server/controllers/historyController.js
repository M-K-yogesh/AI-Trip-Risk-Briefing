const { Generation, Feedback } = require('../models');

exports.getAllHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await Generation.findAll({
      where: { userId },
      include: [
        {
          model: Feedback,
          as: 'feedback',
          attributes: ['id', 'rating', 'liked', 'comment', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ history });
  } catch (error) {
    console.error('Get History Error:', error);
    return res.status(500).json({ error: 'An error occurred fetching history.' });
  }
};

exports.getHistoryById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const generation = await Generation.findOne({
      where: { id, userId },
      include: [
        {
          model: Feedback,
          as: 'feedback'
        }
      ]
    });

    if (!generation) {
      return res.status(404).json({ error: 'Briefing history not found or access denied.' });
    }

    return res.json({ generation });
  } catch (error) {
    console.error('Get History By ID Error:', error);
    return res.status(500).json({ error: 'An error occurred fetching the briefing details.' });
  }
};

exports.deleteHistoryById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Securely verify ownership of generation before deletion
    const generation = await Generation.findOne({
      where: { id, userId }
    });

    if (!generation) {
      return res.status(404).json({ error: 'Briefing record not found or access denied.' });
    }

    // Explicitly delete associated Feedback first to prevent Foreign Key constraints failure in MySQL
    await Feedback.destroy({
      where: { generationId: id }
    });

    // Delete the Generation
    await Generation.destroy({
      where: { id, userId }
    });

    return res.json({ message: 'Briefing safety report deleted successfully.' });
  } catch (error) {
    console.error('Delete History Error:', error);
    return res.status(500).json({ error: 'An error occurred deleting the briefing.' });
  }
};

exports.clearAllHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all generation IDs for this dispatcher
    const userGenerations = await Generation.findAll({
      where: { userId },
      attributes: ['id']
    });

    const genIds = userGenerations.map(g => g.id);

    if (genIds.length > 0) {
      // Explicitly delete all associated Feedbacks first to prevent constraint errors
      await Feedback.destroy({
        where: { generationId: genIds }
      });

      // Delete all Generations
      await Generation.destroy({
        where: { userId }
      });
    }

    return res.json({ message: 'All briefing safety logs cleared successfully.' });
  } catch (error) {
    console.error('Clear All History Error:', error);
    return res.status(500).json({ error: 'An error occurred clearing the history logs.' });
  }
};
