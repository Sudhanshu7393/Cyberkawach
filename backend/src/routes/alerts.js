import express from 'express';
import { 
  getAlertsHistory, 
  getAlertConfig, 
  updateAlertConfig, 
  clearAlertsHistory,
  dispatchSecurityAlert 
} from '../services/alert_dispatcher.js';

const router = express.Router();

router.get('/history', (req, res) => {
  res.json({ success: true, alerts: getAlertsHistory() });
});

router.get('/config', (req, res) => {
  res.json({ success: true, config: getAlertConfig() });
});

router.post('/config', (req, res) => {
  const updated = updateAlertConfig(req.body);
  res.json({ success: true, config: updated, message: 'Alert notification preferences saved' });
});

router.post('/clear', (req, res) => {
  clearAlertsHistory();
  res.json({ success: true, message: 'Alert history cleared' });
});

router.post('/test-send', async (req, res) => {
  try {
    const testIncident = {
      user_id: req.body.user_id || 'USR_ROOT_AUTH',
      ip_address: req.body.ip_address || '45.142.122.9',
      country: req.body.country || 'RU',
      risk_score: 95.4,
      failed_login_count: 18,
      root_cause: 'Credential Stuffing & Auth Brute-Force Spray',
      timestamp: new Date().toISOString()
    };
    const alertResult = await dispatchSecurityAlert(testIncident);
    res.json({ 
      success: true, 
      alert: alertResult, 
      message: `Security warning dispatched to ${alertResult.targetEmail} and ${alertResult.targetPhone}` 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
