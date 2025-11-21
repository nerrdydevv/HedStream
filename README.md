# 🌡️ Hedera + Neuron DePIN IoT Streaming MVP

A hackathon-ready MVP that simulates IoT devices, streams data to Neuron DePIN network, records transactions on Hedera testnet, and displays live data visualization.

## 🚀 Features

- **IoT Device Simulator**: Generates temperature (20-30°C) and humidity (40-60%) data every 5 seconds
- **Neuron DePIN Integration**: Streams sensor data to DePIN network
- **Hedera Blockchain**: Records each sensor reading as a microtransaction on Hedera testnet
- **Real-time WebSocket**: Live data streaming to frontend
- **React Dashboard**: Beautiful charts with live updates using Recharts
- **Complete MVP**: Backend + Frontend ready to demo

## 📁 Project Structure

```
.
├── backend/
│   ├── server.js              # Express server with WebSocket
│   ├── iotSimulator.js        # IoT device simulator
│   ├── hederaService.js       # Hedera blockchain integration
│   ├── neuronService.js       # Neuron DePIN integration
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── App.js             # Main React component
    │   ├── App.css            # Styling
    │   └── index.js           # React entry point
    ├── public/
    │   └── index.html
    └── package.json
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 16+ installed
- Hedera testnet account (optional but recommended)
  - Get free testnet account at: https://portal.hedera.com/

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your Hedera credentials (optional)
# nano .env
```

**Important**: If you don't have Hedera credentials yet, the app will still work! It just won't record to blockchain.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## 🎯 Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm start
```

You should see:
```
✅ Hedera client initialized for testnet
✅ Neuron DePIN connection initialized
✅ All services initialized
🚀 Server running on port 3001
📡 WebSocket server ready
⏳ Streaming sensor data every 5 seconds...
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm start
```

Frontend will open automatically at `http://localhost:3000`

## 📊 What You'll See

### Backend Console
- IoT device ID
- Real-time sensor readings (temperature, humidity)
- Hedera transaction IDs
- Neuron DePIN streaming status

### Frontend Dashboard
- **Latest Reading Card**: Current temperature, humidity, timestamp, device ID
- **Hedera Transaction**: Live blockchain transaction status
- **Temperature Chart**: Real-time line chart
- **Humidity Chart**: Real-time line chart
- **Combined View**: Both metrics on same chart
- **Data Counter**: Total readings collected

## 🔑 Getting Hedera Testnet Credentials

1. Go to https://portal.hedera.com/
2. Sign up for free testnet account
3. Get your Account ID (format: `0.0.XXXXXX`)
4. Get your Private Key (starts with `302e...`)
5. Add to backend `.env` file:
   ```
   HEDERA_ACCOUNT_ID=0.0.XXXXXX
   HEDERA_PRIVATE_KEY=302e...
   ```

## 🛠️ Technology Stack

### Backend
- Node.js + Express.js
- WebSocket (ws)
- Hedera SDK (@hashgraph/sdk)
- Neuron DePIN SDK (simulated integration)

### Frontend
- React.js
- Recharts (live charts)
- WebSocket client
- CSS3 with gradients and animations

## 🎪 Hackathon Demo Tips

1. **Start backend first**, wait for "All services initialized"
2. **Open frontend** in browser
3. **Show live updates** - charts update every 5 seconds
4. **Highlight features**:
   - Live IoT simulation
   - Blockchain transactions on Hedera
   - DePIN network integration
   - Real-time visualization
5. **Check backend console** to show transaction IDs

## 🧪 Testing Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Get Recent Data
```bash
curl http://localhost:3001/api/recent
```

### Manual Trigger (test without waiting)
```bash
curl -X POST http://localhost:3001/api/trigger
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HEDERA_ACCOUNT_ID` | Your Hedera testnet account ID | Optional* |
| `HEDERA_PRIVATE_KEY` | Your Hedera private key | Optional* |
| `PORT` | Backend server port (default: 3001) | No |

*App works without Hedera credentials but won't record to blockchain

## 🐛 Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (need 16+)
- Make sure port 3001 is free
- Check .env file formatting

### Frontend won't connect
- Ensure backend is running first
- Check WebSocket URL in `App.js` (should be `ws://localhost:3001`)
- Check browser console for errors

### No Hedera transactions
- Verify credentials in `.env` file
- Check Hedera testnet status
- Ensure account has HBAR balance (get from faucet)

## 🌟 Next Steps / Enhancements

- [ ] Add authentication for production use
- [ ] Implement actual Neuron DePIN SDK integration
- [ ] Add data persistence (database)
- [ ] Multiple device support
- [ ] Historical data analysis
- [ ] Alert/notification system
- [ ] Mobile responsive improvements
- [ ] Deploy to cloud (Heroku, AWS, etc.)

## 📜 License

MIT License - feel free to use for your hackathon!

## 🤝 Contributing

Built for hackathons - fork, modify, and make it your own!

## 💡 Questions?

This is a MVP template. Customize it for your specific hackathon needs!

---

**Built with ❤️ for Hedera Community**
