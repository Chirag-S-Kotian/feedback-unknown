import { NextAuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your Email:",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
            const user = await UserModel.findOne({ 
                $or:[
                    { email: credentials.identifier },
                    { username: credentials.identifier },
                ]
             });
            if (!user) {
              throw new Error("User not found");
            }
            const passwordMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (!passwordMatch) {
              throw new Error("Invalid password");
            }
            return { id: user._id, name: user.username };
  
        } catch (err:any) {
            throw new Error(err)  
        }
      },
    },
  ],
};
