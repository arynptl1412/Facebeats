import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    url:{
        type: String,
        required: true
    },
    posterURL:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    mood:{
        type: String,
        enum:{
            values:["sad", "happy", "surprised"]
        }
    }
})

const songModel = mongoose.model("songs", songSchema);

export default songModel;