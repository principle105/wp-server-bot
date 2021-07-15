import { User } from "discord.js";
import UserModel from "../Models/user";

export const getUserInfo = async (
    a: User,
    update: boolean = true,
    newData?: [string, any]
) => {
    let oldUser = await UserModel.findOne({ userID: a.id });
    // Copying the oldUser variable without linking
    let user = JSON.parse(JSON.stringify(oldUser));
    // Creating an account for the user if they do not have one already
    if (!oldUser) {
        let userData = {
            userID: a.id,
            name: a.username,
            discriminator: a.discriminator,
            avatar: a.avatar,
        };
        if (newData) userData[newData[0]] = newData[1];
        return await UserModel.create(userData);
    }
    if (
        a.username !== oldUser.name ||
        a.discriminator !== oldUser.discriminator ||
        a.avatar !== oldUser.avatar
    ) {
        // Updating user object to perform update query all at once
        user.name = a.username;
        user.discriminator = a.discriminator;
        user.avatar = a.avatar;
    }
    // Updating user in database if user object changes
    if (user !== oldUser && update)
        await UserModel.updateOne({ userID: a.id }, user);
    return user;
};
