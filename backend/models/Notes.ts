import { Schema, model } from "mongoose";

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
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
        required: false,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: false,
    },
});

const Note = model("Note", noteSchema);

export default Note;
