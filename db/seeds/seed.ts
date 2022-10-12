import { Schema, model, connect, connection } from "mongoose";
import users = require("../data/development-data/users.json");

const databaseUrl: string = "mongodb://localhost:27017/project"
interface IUser {
    password: string;
    email: string;
    username: string;
}

const userSchema = new Schema<IUser>({
    email: { type: "string", required: true, unique: true },
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true, unique: true },
})

const User = model<IUser>("User", userSchema);

async function seedUsers(databaseUrl: string): Promise<void> {
    await connect(databaseUrl);

    for (const user of users) {
        const { username, email, password } = user;
        const newUser = new User({ username, email, password });
        await newUser.save();
    }
    await connection.close();
}
seedUsers(databaseUrl).then().catch(err => console.error(err));