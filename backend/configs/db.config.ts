import mongoose from 'mongoose';

export const initDB = () => {
    async function connect() {
        await mongoose.connect(process.env.MONGO_URI);
    }
    connect()
        .then(() => {
            console.log('DB connected successfully');
        })
        .catch((err: unknown) => {
            if (err instanceof mongoose.mongo.MongoServerError) {
                console.log(err.errorResponse);
            }
        });
};
