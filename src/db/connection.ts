import mongoose from 'mongoose';

export default class Connection {

    async connect(): Promise<mongoose.Mongoose> {
        try {
            const connection = await mongoose.connect(<string>process.env.MONGO_URI);
            console.log('Connected to the database');
            return connection
        } catch (e) {
            console.error('Disconnected from the database');
            await mongoose?.connection?.close();
            throw e;
        }
    }
}
