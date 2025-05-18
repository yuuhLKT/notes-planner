import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: "/images/padrao.png",
    },
    groups: {
        type: [Schema.Types.ObjectId],
        ref: "Group",
        required: false,
    },
});

const User = model("User", userSchema);

export default User;
