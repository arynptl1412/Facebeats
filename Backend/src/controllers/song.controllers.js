import songModel from "../models/song.models.js";
import NodeID3 from 'node-id3'
import storageService from '../services/storage.services.js'

const uploadSong = async (req, res) => {
    const songBuffer = req.file.buffer;

    const mood = req.body;

    const tags = id3.read(songBuffer);

    const [songFile, posterFile] = await Promise.all([

        storageService.uploadFile({
            buffer: songBuffer,
            filename: tags.title + ".mp3",
            folder: "/facebeats/songs"
        }),

        storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            filename: tags.title + "jpeg",
            folder: "/facebeats/posters"
        })

    ])



    const song = songModel.create({
        title: tags.title,
        url: songFile.url,
        posterURL: posterFile.url,
        mood: mood
    })

    res.status(201).json({
        message: "The song is Uploaded Successfully.",

    })

}

const getSong = async (req, res) => {
    const { mood } = req.query;

    const song = await songModel.aggregate([
        { $match: { mood } },
        { $sample: { size: 1 } }
    ]);

    res.status(200).json({
        message: "Song Fetched Successfully.",
        song
    })
}

export { uploadSong };