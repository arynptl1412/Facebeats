import mongoose from 'mongoose';
import 'dotenv/config'

const connectToDB = async () => {
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Database connection was Successfull.")
        })
        .catch(err => {
            throw err;
        })
}

export default connectToDB;