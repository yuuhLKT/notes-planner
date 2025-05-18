import { Request, Response, Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import User from "../models/User";
import { UserRequest, UserResponse } from "../types";

const userRouter = Router();

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.resolve(process.cwd(), '../frontend/public/images');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

userRouter.post("/", async (req: Request<UserRequest>, res: Response<UserResponse>) => {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });
    await user.save();

    res.status(201).json(user);
});

userRouter.get("/", async (req: Request, res: Response<UserResponse[]>) => {
    const users = await User.find();
    res.status(200).json(users);
});

userRouter.get("/:id", async (req: Request, res: Response<UserResponse>) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
});

userRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
});

userRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
});

userRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json(user);
});

userRouter.get("/:id/image", async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.image);
});

userRouter.put("/:id/image", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { image } = req.body;

    const user = await User.findByIdAndUpdate(id, { image }, { new: true });

    res.status(200).json(user);
});

userRouter.post("/:id/image", upload.single('image'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const imagePath = `/images/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(
            id,
            { image: imagePath },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: "Error uploading image" });
    }
});

export default userRouter;
