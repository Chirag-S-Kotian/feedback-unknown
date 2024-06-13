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
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

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
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();

      //send verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          {
            status: 500,
          }
        );
      }
      return Response.json(
        {
          success: true,
          message: "User registered successfully.Please verify your email",
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
