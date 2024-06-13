import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const data = await request.json();
    const { username, email, password } = data;
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    //finding user by thier username
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }

    //finding user by thier email
    const existingUserByEmail = await UserModel.findOne({email});
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verifyCodeExpiry = new Date();
      verifyCodeExpiry.setMinutes(verifyCodeExpiry.getMinutes() + 5); 
    //checking if user already exists by thier email
    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "User Email already exists",
        },
        {
          status: 400,
        }
      );
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: Date;
        isVerified: boolean;
        isAcceptingMessage: boolean;
        messages: Message[];
      });
      const savedUser = await newUser.save();
      
      const updatedUser = await UserModel.findByIdAndUpdate(
        savedUser._id,
        {
          verifyCode,
          verifyCodeExpiry,
        },
        {
          new: true,
        }
      );
      await sendVerificationEmail(email, username, verifyCode);
      return Response.json(
        {
          success: true,
          message: "User registered successfully",
        },
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    console.error("Error registering user..", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
