/**
 * Hedera Service
 * Handles interaction with Hedera Testnet
 */

const {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  Hbar,
  AccountBalanceQuery
} = require('@hashgraph/sdk');

class HederaService {
  constructor() {
    this.client = null;
    this.operatorId = null;
    this.operatorKey = null;
  }

  /**
   * Initialize Hedera client with testnet credentials
   */
  async initialize(accountId, privateKey) {
    try {
      this.operatorId = AccountId.fromString(accountId);
      this.operatorKey = PrivateKey.fromString(privateKey);

      // Create client for Hedera testnet
      this.client = Client.forTestnet();
      this.client.setOperator(this.operatorId, this.operatorKey);

      // Set default max transaction fee
      this.client.setDefaultMaxTransactionFee(new Hbar(2));

      console.log('✅ Hedera client initialized for testnet');
      
      // Check balance
      await this.checkBalance();
      
      return true;
    } catch (error) {
      console.error('❌ Hedera initialization error:', error.message);
      throw error;
    }
  }

  /**
   * Check account balance
   */
  async checkBalance() {
    try {
      const balance = await new AccountBalanceQuery()
        .setAccountId(this.operatorId)
        .execute(this.client);
      
      console.log(`💰 Account balance: ${balance.hbars.toString()}`);
      return balance.hbars.toString();
    } catch (error) {
      console.error('Error checking balance:', error.message);
      return null;
    }
  }

  /**
   * Create microtransaction with sensor data in memo
   * Sends a tiny amount to self with data in memo field
   */
  async recordSensorData(sensorData) {
    try {
      if (!this.client) {
        throw new Error('Hedera client not initialized');
      }

      // Convert sensor data to compact JSON for memo
      const memoData = JSON.stringify({
        t: sensorData.temperature,
        h: sensorData.humidity,
        ts: sensorData.timestamp,
        d: sensorData.deviceId
      });

      // Create microtransaction (sending 0.001 HBAR to self)
      const transaction = await new TransferTransaction()
        .addHbarTransfer(this.operatorId, new Hbar(-0.001))
        .addHbarTransfer(this.operatorId, new Hbar(0.001))
        .setTransactionMemo(memoData)
        .execute(this.client);

      // Get receipt
      const receipt = await transaction.getReceipt(this.client);
      
      console.log(`📝 Transaction recorded: ${transaction.transactionId.toString()}`);

      return {
        success: true,
        transactionId: transaction.transactionId.toString(),
        status: receipt.status.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Hedera transaction error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Close the client connection
   */
  close() {
    if (this.client) {
      this.client.close();
      console.log('Hedera client closed');
    }
  }
}

module.exports = HederaService;
