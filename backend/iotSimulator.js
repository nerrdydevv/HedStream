/**
 * IoT Device Simulator
 * Generates sensor data every 5 seconds with realistic values
 */

class IoTDeviceSimulator {
  constructor() {
    this.deviceId = `IOT-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate random temperature between 20-30°C
   */
  generateTemperature() {
    return (20 + Math.random() * 10).toFixed(2);
  }

  /**
   * Generate random humidity between 40-60%
   */
  generateHumidity() {
    return (40 + Math.random() * 20).toFixed(2);
  }

  /**
   * Generate sensor data packet
   */
  generateData() {
    return {
      deviceId: this.deviceId,
      temperature: parseFloat(this.generateTemperature()),
      humidity: parseFloat(this.generateHumidity()),
      timestamp: new Date().toISOString(),
      unit_temp: '°C',
      unit_humidity: '%'
    };
  }

  /**
   * Start streaming data with callback
   */
  startStreaming(callback, interval = 5000) {
    console.log(`🔌 IoT Device ${this.deviceId} started streaming...`);
    
    // Send first data immediately
    callback(this.generateData());
    
    // Then send every interval
    this.intervalId = setInterval(() => {
      const data = this.generateData();
      callback(data);
    }, interval);
  }

  /**
   * Stop streaming
   */
  stopStreaming() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log(`🔌 IoT Device ${this.deviceId} stopped streaming.`);
    }
  }
}

module.exports = IoTDeviceSimulator;
