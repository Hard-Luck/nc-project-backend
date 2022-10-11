import { Schema, model, connect } from "mongoose";
import users = require("../data/development-data/users.json");
interface IUser {
    password: string;
    email: string;
    username: string;
}

const userSchema = new Schema<IUser>({
    email: { type: "string", required: true },
    username: { type: "string", required: true },
    password: { type: "string", required: true },
})

const User = model<IUser>("User", userSchema);

async function seedUsers(): Promise<void> {
    await connect("mongodb://localhost:27017/project");

    for (const user of users) {
        const { username, email, password } = user;
        const newUser = new User({ username, email, password });
        await newUser.save();
    }

}
seedUsers().catch(err => console.error(err));