import { connect, connection } from "mongoose";
import { environment } from "../utils/config"

async function connectDB() {
    try {
        if (environment.MONGODB_URI) {
            const db = await connect(environment.MONGODB_URI);
            if (db.connections[0].readyState === 1) { //hover readyState to status
                console.log('Connected to MongoDB', db.connection.db.databaseName);
            }
        } else {
            console.log('Please add your Mongo URI to .env.local');
        }
    } catch (error) {
        console.log('Catch error in connectDB', error);
    }
}

connection.on('connected', () => {
    console.log('Mongoose is connected')
})

connection.on('error', (error) => {
    console.log('Mongoose connection error: ', error)
})

export default connectDB