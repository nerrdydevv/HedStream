import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './App.css';

function App() {
  const [sensorData, setSensorData] = useState([]);
  const [latestReading, setLatestReading] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [hederaStatus, setHederaStatus] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // WebSocket connection
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setConnectionStatus('Connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'history') {
        // Handle historical data
        const formattedHistory = data.data.map(reading => ({
          time: new Date(reading.timestamp).toLocaleTimeString(),
          temperature: reading.temperature,
          humidity: reading.humidity,
          fullTime: reading.timestamp
        }));
        setSensorData(formattedHistory);
      } else if (data.sensor) {
        // Handle new sensor reading
        const newReading = {
          time: new Date(data.sensor.timestamp).toLocaleTimeString(),
          temperature: data.sensor.temperature,
          humidity: data.sensor.humidity,
          fullTime: data.sensor.timestamp
        };

        setSensorData(prev => {
          const updated = [...prev, newReading];
          // Keep only last 50 readings
          return updated.slice(-50);
        });

        setLatestReading(data.sensor);

        // Update Hedera status if available
        if (data.hedera) {
          setHederaStatus(data.hedera);
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('Disconnected');
    };

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>🌡️ IoT Streaming Dashboard</h1>
        <div className="subtitle">Hedera + Neuron DePIN Integration</div>
        <div className={`status ${connectionStatus === 'Connected' ? 'connected' : 'disconnected'}`}>
          {connectionStatus}
        </div>
      </header>

      <main className="main-content">
        {/* Current Reading Card */}
        {latestReading && (
          <div className="current-reading">
            <h2>Latest Reading</h2>
            <div className="reading-grid">
              <div className="reading-card temperature">
                <div className="reading-label">Temperature</div>
                <div className="reading-value">{latestReading.temperature}°C</div>
              </div>
              <div className="reading-card humidity">
                <div className="reading-label">Humidity</div>
                <div className="reading-value">{latestReading.humidity}%</div>
              </div>
              <div className="reading-card timestamp">
                <div className="reading-label">Timestamp</div>
                <div className="reading-value timestamp-value">
                  {new Date(latestReading.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="reading-card device">
                <div className="reading-label">Device ID</div>
                <div className="reading-value device-id">
                  {latestReading.deviceId}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hedera Transaction Status */}
        {hederaStatus && hederaStatus.success && (
          <div className="hedera-status">
            <h3>🔗 Hedera Transaction</h3>
            <div className="transaction-info">
              <span className="tx-label">TX ID:</span>
              <span className="tx-value">{hederaStatus.transactionId}</span>
            </div>
            <div className="transaction-info">
              <span className="tx-label">Status:</span>
              <span className="tx-value success">{hederaStatus.status}</span>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="charts-container">
          <div className="chart-card">
            <h2>Temperature Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[15, 35]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff6b6b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Humidity Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[30, 70]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#4ecdc4"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card full-width">
            <h2>Combined View</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" domain={[15, 35]} />
                <YAxis yAxisId="right" orientation="right" domain={[30, 70]} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff6b6b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Temperature (°C)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#4ecdc4"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Counter */}
        <div className="data-counter">
          <strong>{sensorData.length}</strong> readings collected
        </div>
      </main>

      <footer className="footer">
        <p>Hackathon MVP - Hedera Testnet + Neuron DePIN</p>
      </footer>
    </div>
  );
}

export default App;
