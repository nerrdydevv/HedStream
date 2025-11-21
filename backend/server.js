/**
 * Hedera + Neuron DePIN IoT Streaming Backend
 * Express.js server with WebSocket support
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const IoTDeviceSimulator = require('./iotSimulator');
const HederaService = require('./hederaService');
const NeuronDePINService = require('./neuronService');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Services
const iotDevice = new IoTDeviceSimulator();
const hederaService = new HederaService();
const neuronService = new NeuronDePINService();

// Store recent data for new connections
const recentData = [];
const MAX_RECENT_DATA = 50;

// Initialize services
async function initializeServices() {
  try {
    // Initialize Hedera (if credentials provided)
    if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
      await hederaService.initialize(
        process.env.HEDERA_ACCOUNT_ID,
        process.env.HEDERA_PRIVATE_KEY
      );
    } else {
      console.log('⚠️  Hedera credentials not found. Running without blockchain recording.');
    }

    // Initialize Neuron DePIN
    await neuronService.initialize({
      deviceId: iotDevice.deviceId
    });

    console.log('✅ All services initialized');
  } catch (error) {
    console.error('❌ Service initialization error:', error.message);
  }
}

// Handle sensor data
async function handleSensorData(data) {
  console.log(`\n📊 New sensor reading:`);
  console.log(`   Temperature: ${data.temperature}°C`);
  console.log(`   Humidity: ${data.humidity}%`);
  console.log(`   Timestamp: ${data.timestamp}`);

  // Store in recent data
  recentData.push(data);
  if (recentData.length > MAX_RECENT_DATA) {
    recentData.shift();
  }

  let hederaResult = null;
  let neuronResult = null;

  // Stream to Neuron DePIN
  try {
    neuronResult = await neuronService.streamData(data);
  } catch (error) {
    console.error('Neuron streaming error:', error.message);
  }

  // Record to Hedera blockchain
  try {
    if (hederaService.client) {
      hederaResult = await hederaService.recordSensorData(data);
    }
  } catch (error) {
    console.error('Hedera recording error:', error.message);
  }

  // Prepare response with all data
  const response = {
    sensor: data,
    hedera: hederaResult,
    neuron: neuronResult,
    timestamp: new Date().toISOString()
  };

  // Broadcast to all WebSocket clients
  broadcastToClients(response);

  return response;
}

// Broadcast data to all connected WebSocket clients
function broadcastToClients(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket client connected');

  // Send recent data to new client
  ws.send(JSON.stringify({
    type: 'history',
    data: recentData
  }));

  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });
});

// REST API Endpoints

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    services: {
      hedera: hederaService.client ? 'connected' : 'not configured',
      neuron: neuronService.getStatus(),
      iot: {
        deviceId: iotDevice.deviceId,
        streaming: true
      }
    }
  });
});

// Get recent data
app.get('/api/recent', (req, res) => {
  res.json({
    data: recentData,
    count: recentData.length
  });
});

// Manual trigger (for testing)
app.post('/api/trigger', async (req, res) => {
  try {
    const data = iotDevice.generateData();
    const result = await handleSensorData(data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  await initializeServices();

  // Start IoT device streaming
  iotDevice.startStreaming(handleSensorData, 5000);

  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 WebSocket server ready`);
    console.log(`🔗 HTTP: http://localhost:${PORT}`);
    console.log(`🔗 WS: ws://localhost:${PORT}`);
    console.log(`\n⏳ Streaming sensor data every 5 seconds...\n`);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  iotDevice.stopStreaming();
  hederaService.close();
  neuronService.disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start the application
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
