import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const app = express();

// Allow ALL CORS requests - no restrictions
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: '*',
}));

app.use(express.json());

// Explicit OPTIONS handler for preflight requests
app.options('*', cors());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'skillpath';
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret';

let client;
let registrationsCollection;
let dbConnected = false;

async function start() {
  console.log('🚀 SERVER v1.0.1 - NO AUTH CHECK ON DELETE - Starting...');
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not set — starting server without DB connection (will fallback to in-memory behavior).');
    // Keep a simple in-memory store as a fallback
    const inMemory = [];

    app.post('/api/registrations', async (req, res) => {
      const payload = req.body;
      const now = new Date();
      const doc = { id: Date.now().toString(), ...payload, createdAt: now };
      inMemory.unshift(doc);
      return res.status(201).json(doc);
    });

    app.get('/api/registrations', async (req, res) => {
      return res.json(inMemory);
    });

    app.delete('/api/registrations/:id', async (req, res) => {
      const id = req.params.id;
      const idx = inMemory.findIndex(d => String(d.id) === String(id));
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      inMemory.splice(idx, 1);
      return res.json({ success: true });
    });

    // Health endpoint
    app.get('/api/health', (_req, res) => {
      res.json({ dbConnected, usingMongo: false });
    });

    app.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT} (no MongoDB) - using in-memory store`);
    });

    return;
  }

  client = new MongoClient(MONGODB_URI);
  await client.connect();
  dbConnected = true;
  console.log('MongoDB connected successfully');
  const db = client.db(DB_NAME);
  registrationsCollection = db.collection('registrations');

  // Create indexes for faster queries
  await registrationsCollection.createIndex({ createdAt: -1 });

  app.post('/api/registrations', async (req, res) => {
    try {
      const payload = req.body;
      const now = new Date();
      const doc = { ...payload, createdAt: now, updatedAt: now };
      const result = await registrationsCollection.insertOne(doc);
      res.status(201).json({ id: result.insertedId.toString(), ...doc });
    } catch (err) {
      console.error('Insert error', err);
      res.status(500).json({ error: 'Failed to insert registration' });
    }
  });

  app.get('/api/registrations', async (req, res) => {
    try {
      const docs = await registrationsCollection.find({}).sort({ createdAt: -1 }).toArray();
      res.json(docs.map(d => ({ id: d._id.toString(), ...d })));
    } catch (err) {
      console.error('Fetch error', err);
      res.status(500).json({ error: 'Failed to fetch registrations' });
    }
  });

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ dbConnected, usingMongo: true, timestamp: new Date().toISOString() });
  });

  // Test endpoint to verify deployment
  app.get('/api/version', (_req, res) => {
    res.json({ version: 'v2-no-auth-delete', deployed: new Date().toISOString() });
  });

  // DELETE registration endpoint - NO AUTHENTICATION REQUIRED - FINAL VERSION v2
  app.delete('/api/registrations/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`🗑️  [DELETE v2] Received delete request for ID: ${id}`);
    
    try {
      // Strategy 1: Try as MongoDB ObjectId
      if (id.match(/^[0-9a-f]{24}$/i)) {
        const result = await registrationsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
          console.log(`✅ Deleted via ObjectId`);
          return res.json({ success: true });
        }
      }
      
      // Strategy 2: Try as _id string field
      const result2 = await registrationsCollection.deleteOne({ _id: id });
      if (result2.deletedCount > 0) {
        console.log(`✅ Deleted via _id string`);
        return res.json({ success: true });
      }
      
      // Strategy 3: Try as id field
      const result3 = await registrationsCollection.deleteOne({ id: id });
      if (result3.deletedCount > 0) {
        console.log(`✅ Deleted via id field`);
        return res.json({ success: true });
      }
      
      console.log(`❌ Not found`);
      res.status(404).json({ error: 'Not found' });
    } catch (err) {
      console.error(`❌ Delete error:`, err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
