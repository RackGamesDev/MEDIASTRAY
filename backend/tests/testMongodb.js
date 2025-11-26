// --- Mongoose MongoDB Test Script ---
// This script connects to the MongoDB container using the internal service name 
// and performs a simple save and retrieval operation.

import mongoose from 'mongoose';

// --- Configuration ---
// NOTE: Use the internal Docker service name 'mongodb' and the default port (27017).
// If your .env file defines MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD,
// use those credentials here.

const testMongodb = () => {

const DB_HOST = 'mongodb';
const DB_PORT = 27017;
// Replace 'testUser' and 'testPassword' with your actual MONGO_INITDB_ROOT_USERNAME/PASSWORD
// if you configured authentication in your Docker setup. Otherwise, the default is no auth.
const DB_AUTH = `${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@`; 
//const DB_AUTH = ''; // Using empty string if you are running without auth (common for local dev)
const DB_NAME = 'testdb'; 

const MONGO_URI = `mongodb://${DB_AUTH}${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// --- 1. Define a Schema and Model ---
const TestSchema = new mongoose.Schema({
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const TestModel = mongoose.model('TestDocument' + Math.random(), TestSchema);

// --- 2. Main Connection and Test Function ---
async function runTest() {
    console.log('Attempting to connect to MongoDB...');
    try {
        await mongoose.connect(MONGO_URI, {
            // These options are standard for modern Mongoose connections
            serverSelectionTimeoutMS: 5000, // Timeout after 5s if unable to connect
        });

        console.log(`\n✅ Successfully connected to MongoDB at: ${MONGO_URI}`);

        // --- A. Create a Document ---
        const testDoc = new TestModel({ message: 'MongoDB connection successful!' });
        await testDoc.save();
        console.log(`\n💾 Saved document with ID: ${testDoc._id}`);
        
        // --- B. Read the Document ---
        const retrievedDoc = await TestModel.findOne({ _id: testDoc._id });
        
        if (retrievedDoc) {
            console.log('\n🔎 Successfully retrieved document:');
            console.log(`   Message: ${retrievedDoc.message}`);
            console.log(`   Timestamp: ${retrievedDoc.timestamp}`);
            console.log('\n🌟 MongoDB test completed successfully! 🌟');
        } else {
            console.error('\n❌ Error: Could not retrieve the document.');
        }

    } catch (error) {
        console.error('\n❌ MongoDB Connection or Operation Failed:');
        // Log the full error to help diagnose networking or credential issues
        console.error(error.message);
        console.error('\nEnsure the "mongodb" container is running and accessible.');
    } finally {
        // Disconnect immediately after the test
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

runTest();

}

export {testMongodb}