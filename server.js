import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(join(__dirname, '.')));

// Import your API handler
import submitNip05 from './api/submit-nip05.js';

// API route
app.post('/api/submit-nip05', async (req, res) => {
  try {
    await submitNip05(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/add-nip05.html', (req, res) => {
  res.sendFile(join(__dirname, 'add-nip05.html'));
});

// Handle .well-known routes
app.get('/.well-known/:path(*)', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Content-Type', 'application/json');
  const filePath = join(__dirname, '.well-known', req.params.path);
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
