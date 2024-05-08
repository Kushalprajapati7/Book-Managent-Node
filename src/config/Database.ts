import mongoose from 'mongoose';

class Database {
    private mongoURI: string;

    constructor(mongoURI: string) {
        this.mongoURI = mongoURI;
    }

    async connect(): Promise<void> {
        try {
            await mongoose.connect(this.mongoURI);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection failed:', error);
            process.exit(1);
        }
    }
}

export default Database;
