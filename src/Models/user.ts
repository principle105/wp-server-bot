import { Schema, model } from "mongoose";
import { User } from "../Interfaces/Models";

const UserSchema = new Schema<User>({
  userID: { type: String, required: true },
  name: { type: String, required: true },
  discriminator: { type: String, required: true },
  avatar: { type: String, required: true },
  xp: { type: Number, default: 0 },
});

export default model<User>("User", UserSchema);
