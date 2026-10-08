import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// GET all predictions (paginated)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || 50, 10);
    const page = parseInt(req.query.page || 1, 10);
    const anomalyOnly = req.query.anomaly === 'true';

    const records = await db.getAll({ limit, page, anomalyOnly });
    res.json({
      success: true,
      count: records.length,
      page,
      data: records
    });
  } catch (error) {
    console.error('Fetch predictions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET aggregated stats & analytics
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear all history
router.post('/clear', async (req, res) => {
  try {
    await db.clearAll();
    res.json({ success: true, message: 'All prediction records cleared.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
