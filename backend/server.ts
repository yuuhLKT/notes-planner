import cors from "cors";
import express from "express";
import connectDB from "./db";
import groupRouter from "./routes/groupRouter";
import noteRouter from "./routes/noteRouter";
import taskRouter from "./routes/taskRouter";
import userRouter from "./routes/userRouter";

const app = express();

app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/users", userRouter);
app.use("/notes", noteRouter);
app.use("/groups", groupRouter);
app.use("/tasks", taskRouter);


connectDB();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

