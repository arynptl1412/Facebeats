import userModel from "../models/user.models.js";
import jsonwebtoken from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import blacklistModel from "../models/blacklist.models.js";
import redis from '../config/cache.js'

const jwt = jsonwebtoken;
const bcrypt = bcryptjs;

export const registerController = async (req, res) => {
    const { username, email, password, fullName, profilePic } = req.body;

    const isUserExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserExists) {
        return res.status(409).json({
            message: "User Already Exisits, " + (isUserExists.email == email ? "Email already Exists" : "Username already Exists.")
        })
    };

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        fullName,
        profilePic
    });

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.cookie("jwtToken", token);

    res.status(201).json({
        message: "User Created Succesfully.",
        user: {
            username,
            email,
            fullName,
            profilePic
        }
    });
}

export const loginController = async (req, res) => {
    const { username, email, password } = req.body;

    const isUserExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("+password")

    if (!isUserExists) {
        return res.status(404).json({
            message: "User Does not exist please register First."
        })
    }

    const user = isUserExists;

    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
        return res.status(409).json({
            message: "Password is Invalid"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: "2d" })

    res.cookie("jwtToken", token);

    res.status(200).json({
        message: "Logged in Successfullly.",
        user: {
            username,
            email,
            profile: user.profilePic
        }
    })

}

export const getUserController = async (req, res) => {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User fetched Successfully.",
        user
    })
}

export const logoutController = async (req, res) =>{
    const token = req.cookies.jwtToken;

    res.clearCookie("jwtToken");

    await redis.set(token, Date.now().toString());

    res.status(200).json({
        message: "Logout Succesfull."
    })

}
