import { model, Schema } from "mongoose";

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    users: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: false,
    },
    notes: {
        type: [Schema.Types.ObjectId],
        ref: "Note",
        required: false,
    },
    tasks: {
        type: [Schema.Types.ObjectId],
        ref: "Task",
        required: false,
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    image: {
        type: String,
        default: "/images/grupo-padrao.jpg",
    },
    code: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 5
    }
});

const Group = model("Group", groupSchema);

export default Group;
