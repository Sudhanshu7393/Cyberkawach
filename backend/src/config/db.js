import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../../data/predictions.json');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseKey.includes('your-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

function readLocalDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading local db file:', err.message);
    return [];
  }
}

function writeLocalDB(records) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local db file:', err.message);
  }
}

export const db = {
  isSupabase: isSupabaseConfigured,

  async insert(records) {
    const items = Array.isArray(records) ? records : [records];
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('predictions').insert(items).select();
        if (!error && data) return data;
        console.warn('Supabase insert failed, falling back to local DB:', error?.message);
      } catch (err) {
        console.warn('Supabase exception, falling back to local DB:', err.message);
      }
    }

    // Local DB fallback
    const current = readLocalDB();
    const withMetadata = items.map((item, idx) => ({
      id: item.id || `local_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 6)}`,
      created_at: item.created_at || new Date().toISOString(),
      ...item
    }));
    
    const updated = [...withMetadata, ...current].slice(0, 5000);
    writeLocalDB(updated);
    return withMetadata;
  },

  async getAll({ limit = 100, page = 1, anomalyOnly = false } = {}) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('predictions')
          .select('*')
          .order('created_at', { ascending: false });

        if (anomalyOnly) {
          query = query.eq('is_anomaly', true);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error } = await query.range(from, to);
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getAll error, using local fallback:', err.message);
      }
    }

    const all = readLocalDB();
    let filtered = anomalyOnly ? all.filter(r => r.is_anomaly === true) : all;
    filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    const from = (page - 1) * limit;
    return filtered.slice(from, from + limit);
  },

  async getStats() {
    let records = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('predictions').select('*').limit(2000);
        if (!error && data) records = data;
      } catch (err) {
        console.warn('Supabase getStats fallback:', err.message);
      }
    }

    if (!records.length) {
      records = readLocalDB();
    }

    const total = records.length;
    const anomalies = records.filter(r => r.is_anomaly === true);
    const critical = records.filter(r => (r.risk_score || 0) >= 80);
    const high = records.filter(r => (r.risk_score || 0) >= 60 && (r.risk_score || 0) < 80);
    const medium = records.filter(r => (r.risk_score || 0) >= 40 && (r.risk_score || 0) < 60);
    const low = records.filter(r => (r.risk_score || 0) < 40);

    const avgRisk = total > 0
      ? (records.reduce((acc, r) => acc + (Number(r.risk_score) || 0), 0) / total).toFixed(2)
      : '0.00';

    const countryMap = {};
    records.forEach(r => {
      const c = r.country || 'Unknown';
      if (!countryMap[c]) {
        countryMap[c] = { country: c, total: 0, anomalies: 0, avgRisk: 0, riskSum: 0 };
      }
      countryMap[c].total += 1;
      if (r.is_anomaly) countryMap[c].anomalies += 1;
      countryMap[c].riskSum += Number(r.risk_score) || 0;
    });

    const countryStats = Object.values(countryMap).map(c => ({
      ...c,
      avgRisk: Number((c.riskSum / c.total).toFixed(1))
    })).sort((a, b) => b.total - a.total).slice(0, 10);

    const timeline = [...records]
      .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
      .slice(-30)
      .map(r => ({
        time: (r.created_at || '').substring(11, 19) || 'N/A',
        timestamp: r.created_at,
        risk_score: Number(r.risk_score) || 0,
        is_anomaly: Boolean(r.is_anomaly),
        user_id: r.user_id,
        ip_address: r.ip_address,
        failed_logins: r.failed_login_count || 0
      }));

    return {
      total_activities: total,
      anomalies_detected: anomalies.length,
      anomaly_percentage: total > 0 ? ((anomalies.length / total) * 100).toFixed(1) : 0,
      critical_threats: critical.length,
      high_threats: high.length,
      medium_threats: medium.length,
      low_threats: low.length,
      avg_risk_score: Number(avgRisk),
      country_stats: countryStats,
      timeline
    };
  },

  async search({ query = '' }) {
    const q = query.trim().toLowerCase();
    let records = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .or(`user_id.ilike.%${q}%,ip_address.ilike.%${q}%,country.ilike.%${q}%`)
          .limit(100);
        if (!error && data) records = data;
      } catch (err) {
        console.warn('Supabase search fallback:', err.message);
      }
    }

    if (!records.length) {
      const all = readLocalDB();
      records = all.filter(r => 
        (r.user_id && r.user_id.toLowerCase().includes(q)) ||
        (r.ip_address && r.ip_address.toLowerCase().includes(q)) ||
        (r.country && r.country.toLowerCase().includes(q)) ||
        (r.device && r.device.toLowerCase().includes(q))
      );
    }

    records.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    const totalFound = records.length;
    const anomaliesFound = records.filter(r => r.is_anomaly).length;
    const avgRisk = totalFound > 0
      ? (records.reduce((acc, r) => acc + (Number(r.risk_score) || 0), 0) / totalFound).toFixed(2)
      : '0.00';

    return {
      query,
      total_records: totalFound,
      anomalies_count: anomaliesFound,
      avg_risk_score: Number(avgRisk),
      records
    };
  },

  async clearAll() {
    writeLocalDB([]);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('predictions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (err) {
        console.warn('Supabase clear error:', err.message);
      }
    }
    return true;
  }
};
