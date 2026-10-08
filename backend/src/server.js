import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logsRouter from './routes/logs.js';
import predictionsRouter from './routes/predictions.js';
import searchRouter from './routes/search.js';
import urlScannerRouter from './routes/url_scanner.js';
import { isSupabaseConfigured } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: isSupabaseConfigured ? 'Supabase Connected' : 'Local Persistent Storage',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/logs', logsRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/search', searchRouter);
app.use('/api/url', urlScannerRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log('  🚀 CyberKawach Security Backend Active');
  console.log('  📡 Port: http://localhost:' + PORT);
  console.log('  💾 Storage Mode: ' + (isSupabaseConfigured ? 'Supabase Cloud DB' : 'Local Persistent JSON Storage'));
  console.log('====================================================');
});
