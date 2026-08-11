const { getDashboardStats } = require('../services/dashboardService');

async function getStats(req, res, next) {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStats };