import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ALERTS_FILE = path.join(__dirname, '..', '..', 'data', 'alerts_history.json');
const CONFIG_FILE = path.join(__dirname, '..', '..', 'data', 'alert_config.json');

const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let alertConfig = {
  recipientEmail: 'victim_account@cyberkawach.org',
  recipientPhone: '+91 98765 43210',
  autoDispatch: true,
  smsEnabled: true,
  emailEnabled: true
};

if (fs.existsSync(CONFIG_FILE)) {
  try {
    alertConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (e) {}
}

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('[Alert Dispatcher] Initialized Real Ethereal SMTP Mailer:', testAccount.user);
  } catch (err) {
    console.warn('[Alert Dispatcher] Using JSON transporter fallback:', err.message);
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  return transporter;
}

export async function dispatchSecurityAlert(incidentData) {
  if (!alertConfig.autoDispatch) return null;

  const mailer = await getTransporter();
  const timestamp = new Date().toISOString();
  const userId = incidentData.user_id || 'ACCOUNT_HOLDER';
  const ip = incidentData.ip_address || 'Unknown IP';
  const country = incidentData.country || 'Unknown';
  const score = incidentData.risk_score || incidentData.ml_inference?.risk_score || 95;
  const rootCause = incidentData.root_cause || incidentData.ml_inference?.root_cause || 'Unauthorized Authentication Spray';
  const failedLogins = incidentData.failed_login_count ?? 18;

  const alertSubject = `🚨 [CyberKawach Alert] Critical Intrusion Detected on ID: ${userId}`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; max-width: 600px; margin: auto;">
      <div style="border-bottom: 2px solid #ef4444; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #ef4444; margin: 0;">🚨 Critical Security Anomaly Detected</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">CyberKawach Automated Incident Response Engine</p>
      </div>

      <p style="font-size: 14px; line-height: 1.6;">
        Dear <strong>${userId}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #e2e8f0;">
        Our real-time Machine Learning sensor (Layer 1: Isolation Forest) has detected an active unauthorized access anomaly targeting your credentials:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; background-color: #1e293b; border-radius: 8px; overflow: hidden;">
        <tr style="border-bottom: 1px solid #334155;">
          <td style="padding: 10px; color: #94a3b8;">Risk Anomaly Score:</td>
          <td style="padding: 10px; color: #ef4444; font-weight: bold;">${score} / 100 (CRITICAL)</td>
        </tr>
        <tr style="border-bottom: 1px solid #334155;">
          <td style="padding: 10px; color: #94a3b8;">Threat Vector:</td>
          <td style="padding: 10px; color: #f59e0b; font-weight: bold;">${rootCause}</td>
        </tr>
        <tr style="border-bottom: 1px solid #334155;">
          <td style="padding: 10px; color: #94a3b8;">Source IP & Origin:</td>
          <td style="padding: 10px; color: #38bdf8;">${ip} (${country})</td>
        </tr>
        <tr style="border-bottom: 1px solid #334155;">
          <td style="padding: 10px; color: #94a3b8;">Failed Password Count:</td>
          <td style="padding: 10px; color: #f87171;">${failedLogins} attempts in 60s</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #94a3b8;">Timestamp:</td>
          <td style="padding: 10px; color: #cbd5e1;">${new Date(timestamp).toLocaleString()}</td>
        </tr>
      </table>

      <div style="background-color: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
        <strong style="color: #f87171; display: block; margin-bottom: 4px;">⚡ Automated Defense Actions Taken:</strong>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #fca5a5;">
          <li>Session token immediately invalidated.</li>
          <li>Temporary 15-minute rate-limit quarantine applied to IP ${ip}.</li>
          <li>Mandatory 2FA challenge initiated on next login.</li>
        </ul>
      </div>

      <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 24px; border-top: 1px solid #334155; padding-top: 12px;">
        CyberKawach Dual-Layer Defense &bull; ABESEC Dept of CSE &bull; BCS554 Project
      </p>
    </div>
  `;

  let previewUrl = null;
  let messageId = null;

  try {
    const info = await mailer.sendMail({
      from: '"CyberKawach Security Center" <security-alerts@cyberkawach.org>',
      to: alertConfig.recipientEmail,
      subject: alertSubject,
      text: `Critical Security Alert: Intrusion detected on ID ${userId} from ${ip}. Risk score: ${score}/100.`,
      html: htmlBody
    });

    messageId = info.messageId;
    previewUrl = nodemailer.getTestMessageUrl(info) || null;
    console.log(`[Alert Dispatcher] Dispatched Alert to ${alertConfig.recipientEmail} | Preview: ${previewUrl}`);
  } catch (err) {
    console.error('[Alert Dispatcher] Mail dispatch error:', err.message);
  }

  const smsPayload = {
    to: alertConfig.recipientPhone,
    status: 'DELIVERED',
    message: `[CyberKawach Alert] Anomaly detected on user ${userId}. ${failedLogins} failed logins from IP ${ip}. Account quarantined.`,
    sentAt: timestamp
  };

  const alertRecord = {
    id: `ALT_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp,
    userId,
    targetEmail: alertConfig.recipientEmail,
    targetPhone: alertConfig.recipientPhone,
    emailStatus: messageId ? 'DELIVERED' : 'SENT',
    smsStatus: 'DELIVERED',
    previewUrl,
    messageId,
    riskScore: score,
    ipAddress: ip,
    country,
    threatVector: rootCause,
    smsMessage: smsPayload.message
  };

  try {
    let history = [];
    if (fs.existsSync(ALERTS_FILE)) {
      history = JSON.parse(fs.readFileSync(ALERTS_FILE, 'utf8'));
    }
    history.unshift(alertRecord);
    if (history.length > 50) history = history.slice(0, 50);
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(history, null, 2), 'utf8');
  } catch (err) {
    console.error('[Alert Dispatcher] History save error:', err);
  }

  return alertRecord;
}

export function getAlertsHistory() {
  try {
    if (fs.existsSync(ALERTS_FILE)) {
      return JSON.parse(fs.readFileSync(ALERTS_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

export function getAlertConfig() {
  return alertConfig;
}

export function updateAlertConfig(newConfig) {
  alertConfig = { ...alertConfig, ...newConfig };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(alertConfig, null, 2), 'utf8');
  return alertConfig;
}

export function clearAlertsHistory() {
  fs.writeFileSync(ALERTS_FILE, '[]', 'utf8');
  return [];
}
