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
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    //finding user by thier email
    const existingUserVerifiedByEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });
    if (existingUserVerifiedByEmail) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    const verifyCode = Math.floor(100000 + Math.random() * 900000);
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
