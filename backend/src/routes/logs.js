import express from 'express';
import axios from 'axios';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { db } from '../config/db.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

// Upload Single Log
router.post('/upload', async (req, res) => {
  try {
    const logRecord = req.body;
    
    // Call Python ML microservice
    let mlData;
    try {
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, logRecord, { timeout: 5000 });
      mlData = mlResponse.data;
    } catch (mlErr) {
      console.error('ML service error:', mlErr.message);
      return res.status(502).json({
        error: 'ML Prediction Service Unavailable',
        message: 'Ensure the Python FastAPI service is running on port 8000.'
      });
    }

    const { is_anomaly, risk_score, severity, threat_reasons, decision_score } = mlData;

    // Save to Database
    const savedRecord = {
      user_id: logRecord.user_id || 'USR_0001',
      ip_address: logRecord.ip_address || '192.168.1.1',
      country: logRecord.country || 'US',
      browser: logRecord.browser || 'Chrome',
      device: logRecord.device || 'Windows 11',
      login_hour: parseInt(logRecord.login_hour ?? 12, 10),
      country_change_flag: parseInt(logRecord.country_change_flag ?? 0, 10),
      download_mb: parseFloat(logRecord.download_mb || 0),
      upload_mb: parseFloat(logRecord.upload_mb || 0),
      session_duration_sec: parseInt(logRecord.session_duration_sec || 0, 10),
      failed_login_count: parseInt(logRecord.failed_login_count || 0, 10),
      requests_per_minute: parseInt(logRecord.requests_per_minute || 15, 10),
      is_anomaly: Boolean(is_anomaly),
      risk_score: parseFloat(risk_score),
      severity: severity || (risk_score >= 80 ? 'CRITICAL' : risk_score >= 60 ? 'HIGH' : risk_score >= 40 ? 'MEDIUM' : 'LOW'),
      threat_reasons: JSON.stringify(threat_reasons || []),
      decision_score: decision_score ?? 0,
      created_at: new Date().toISOString()
    };

    const inserted = await db.insert(savedRecord);

    return res.status(200).json({
      success: true,
      data: inserted[0] || savedRecord,
      ml_inference: {
        is_anomaly,
        risk_score,
        severity,
        threat_reasons
      }
    });
  } catch (error) {
    console.error('Upload single log failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload CSV File
router.post('/upload-csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded.' });
    }

    const rows = [];
    const stream = Readable.from(req.file.buffer.toString('utf-8'));

    stream
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', async () => {
        try {
          if (!rows.length) {
            return res.status(400).json({ error: 'CSV file is empty.' });
          }

          const formattedLogs = rows.slice(0, 500).map(r => ({
            user_id: r.user_id || 'USR_UNKNOWN',
            ip_address: r.ip_address || '127.0.0.1',
            country: r.country || 'US',
            browser: r.browser || 'Unknown',
            device: r.device || 'Unknown',
            login_hour: parseInt(r.login_hour || 12, 10),
            country_change_flag: parseInt(r.country_change_flag || 0, 10),
            download_mb: parseFloat(r.download_mb || 0),
            upload_mb: parseFloat(r.upload_mb || 0),
            session_duration_sec: parseInt(r.session_duration_sec || 0, 10),
            failed_login_count: parseInt(r.failed_login_count || 0, 10),
            requests_per_minute: parseInt(r.requests_per_minute || 15, 10),
            timestamp: r.timestamp || new Date().toISOString()
          }));

          const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict-batch`, { logs: formattedLogs });
          const { results, anomalies_detected } = mlResponse.data;

          const toSave = results.map(item => ({
            user_id: item.user_id,
            ip_address: item.ip_address,
            country: item.country,
            browser: item.browser,
            device: item.device,
            login_hour: item.login_hour,
            country_change_flag: item.country_change_flag,
            download_mb: item.download_mb,
            upload_mb: item.upload_mb,
            session_duration_sec: item.session_duration_sec,
            failed_login_count: item.failed_login_count,
            requests_per_minute: item.requests_per_minute,
            is_anomaly: Boolean(item.is_anomaly),
            risk_score: item.risk_score,
            severity: item.severity,
            threat_reasons: JSON.stringify(item.threat_reasons || []),
            created_at: item.timestamp || new Date().toISOString()
          }));

          const inserted = await db.insert(toSave);

          res.json({
            success: true,
            total_processed: toSave.length,
            anomalies_detected,
            results: inserted.slice(0, 50)
          });
        } catch (innerErr) {
          console.error('Batch processing error:', innerErr.message);
          res.status(500).json({ error: innerErr.message });
        }
      });
  } catch (err) {
    console.error('CSV upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Generate Simulated Sample Traffic
router.post('/generate-sample', async (req, res) => {
  try {
    const count = parseInt(req.query.count || req.body.count || 20, 10);
    const anomalyRatio = parseFloat(req.query.ratio || req.body.ratio || 0.25);

    const mlResponse = await axios.post(
      `${ML_SERVICE_URL}/generate-sample-traffic?count=${count}&anomaly_ratio=${anomalyRatio}`
    );

    const { logs, anomalies_detected } = mlResponse.data;

    const toSave = logs.map(item => ({
      user_id: item.user_id,
      ip_address: item.ip_address,
      country: item.country,
      browser: item.browser,
      device: item.device,
      login_hour: item.login_hour,
      country_change_flag: item.country_change_flag,
      download_mb: item.download_mb,
      upload_mb: item.upload_mb,
      session_duration_sec: item.session_duration_sec,
      failed_login_count: item.failed_login_count,
      requests_per_minute: item.requests_per_minute,
      is_anomaly: Boolean(item.is_anomaly),
      risk_score: item.risk_score,
      severity: item.severity,
      threat_reasons: JSON.stringify(item.threat_reasons || []),
      created_at: item.timestamp || new Date().toISOString()
    }));

    const inserted = await db.insert(toSave);

    res.json({
      success: true,
      message: `Generated and evaluated ${count} sample network events.`,
      anomalies_detected,
      items: inserted
    });
  } catch (error) {
    console.error('Sample generation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
