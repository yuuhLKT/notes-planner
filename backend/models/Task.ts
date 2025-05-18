import { model, Schema } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: function () { return !this.group; },
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: function () { return !this.user; },
    },
});

const Task = model("Task", taskSchema);

export default Task;
