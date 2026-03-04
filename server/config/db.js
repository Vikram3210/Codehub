import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connect to CodeHub MongoDB database
 * Uses MONGODB_URI_CODEHUB environment variable
 */
export const connectCodeHubDB = async () => {
  try {
    const MONGODB_URI_CODEHUB = process.env.MONGODB_URI_CODEHUB;
    
    if (!MONGODB_URI_CODEHUB) {
      throw new Error('MONGODB_URI_CODEHUB environment variable is not set');
    }

    // Ensure database name is specified in the connection string
    let connectionString = MONGODB_URI_CODEHUB;
    
    // Check if database name is already in the connection string
    if (!connectionString.includes('/CodeHub') && !connectionString.match(/\/[^\/\?]+(\?|$)/)) {
      // No database specified, add CodeHub
      if (connectionString.includes('/?')) {
        connectionString = connectionString.replace('/?', '/CodeHub?');
      } else if (connectionString.endsWith('/')) {
        connectionString = connectionString + 'CodeHub';
      } else {
        connectionString = connectionString + '/CodeHub';
      }
    }

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB Atlas (CodeHub)');
    console.log('📊 Database: CodeHub');
    
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB (CodeHub):', error.message);
    throw error;
  }
};

export default connectCodeHubDB;
