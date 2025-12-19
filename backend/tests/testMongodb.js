import mongoose from 'mongoose';

const testMongodb = async () => {

    /*const DB_HOST = 'mongodb';
    const DB_PORT = 27017;
    const DB_AUTH = `${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@`; 
    //const DB_AUTH = ''; // Using empty string if you are running without auth (common for local dev)
    const DB_NAME = "";//'testdb'; */

    const MONGO_URI = process.env.MONGODB_URI;//`mongodb://${DB_AUTH}${DB_HOST}:${DB_PORT}/${DB_NAME}`;

    const TestSchema = new mongoose.Schema({
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    });
    const TestModel = mongoose.model('TestDocument' + Math.random(), TestSchema);

    async function runTest() {
        console.log('Attempting to connect to MongoDB...');
        try {
            await mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
            });

            console.log(`Successfully connected to MongoDB at: ${MONGO_URI}`);
            const testDoc = new TestModel({ message: 'MongoDB connection successful!' });
            await testDoc.save();
            console.log(`Saved document with ID: ${testDoc._id}`);
            const retrievedDoc = await TestModel.findOne({ _id: testDoc._id });

            if (retrievedDoc) {
                console.log('Successfully retrieved document:');
                console.log(`Message: ${retrievedDoc.message}`);
                console.log(`Timestamp: ${retrievedDoc.timestamp}`);
                console.log('MONGODB PERFECTO MongoDB test completed successfully!');
            } else {
                console.error('Error: Could not retrieve the document.');
            }
        } catch (error) {
            console.error('MongoDB Connection or Operation Failed:');
            console.error(error.message);
            console.error('\nEnsure the "mongodb" container is running and accessible.');
        } finally {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB.');
        }
    }

    runTest();

}

export { testMongodb }