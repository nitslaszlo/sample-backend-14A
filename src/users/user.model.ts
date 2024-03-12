import { Schema, model } from "mongoose";
import IUser from "./user.interface";
import IAddress from "./address.interface";
// import addressSchema from "./address.schema";


const addressSchema = new Schema<IAddress>({
  city: String,
  country: String,
  street: String,
});

// If you have declared _id field explicitly in schema, you must initialize it explicitly
// If you have not declared it in schema, MongoDB will declare and initialize it

// All fields in a mongoose schema are optional by default.

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: String,
    password: String,
    address: addressSchema,
  },
  { versionKey: false }
);

const userModel = model<IUser>("User", userSchema);

export default userModel;
