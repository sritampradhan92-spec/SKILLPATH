import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const app = express();

// CORS configuration for frontend domains
const allowedOrigins = [
  'https://stirring-sprinkles-636235.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-key'],
}));

app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'skillpath';
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret';

let client;
let registrationsCollection;
let dbConnected = false;

async function start() {
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

  app.delete('/api/registrations/:id', async (req, res) => {
    try {
      const id = req.params.id;
      console.log(`[DELETE] Processing delete request for ID: ${id}`);
      
      // Try multiple approaches to find and delete the record
      let deleteResult = null;
      
      // First, try as ObjectId (if it's a valid hex string)
      if (id.match(/^[0-9a-f]{24}$/i)) {
        try {
          console.log(`[DELETE] Attempting ObjectId format: ${id}`);
          deleteResult = await registrationsCollection.deleteOne({ _id: new ObjectId(id) });
          console.log(`[DELETE] ObjectId attempt result: ${deleteResult.deletedCount} deleted`);
          if (deleteResult.deletedCount === 1) {
            console.log(`[DELETE] Successfully deleted with ObjectId`);
            return res.json({ success: true, message: 'Deleted using ObjectId' });
          }
        } catch (e) {
          console.log(`[DELETE] ObjectId attempt failed:`, e.message);
        }
      }
      
      // Try as string id field
      console.log(`[DELETE] Attempting id field format: ${id}`);
      deleteResult = await registrationsCollection.deleteOne({ id: id });
      console.log(`[DELETE] id field attempt result: ${deleteResult.deletedCount} deleted`);
      if (deleteResult.deletedCount === 1) {
        console.log(`[DELETE] Successfully deleted with id field`);
        return res.json({ success: true, message: 'Deleted using id field' });
      }
      
      // Try as _id string
      console.log(`[DELETE] Attempting _id string format: ${id}`);
      deleteResult = await registrationsCollection.deleteOne({ _id: id });
      console.log(`[DELETE] _id string attempt result: ${deleteResult.deletedCount} deleted`);
      if (deleteResult.deletedCount === 1) {
        console.log(`[DELETE] Successfully deleted with _id string`);
        return res.json({ success: true, message: 'Deleted using _id string' });
      }
      
      // If nothing found
      console.log(`[DELETE] No registration found with ID: ${id}`);
      res.status(404).json({ error: 'Registration not found' });
    } catch (err) {
      console.error('[DELETE] Error:', err);
      res.status(500).json({ error: 'Failed to delete registration: ' + err.message });
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
