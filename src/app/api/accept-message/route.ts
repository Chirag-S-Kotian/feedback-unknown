import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "You are not logged in",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;
  const { acceptMessage } = await request.json();
  try {
    const UpdatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessage,
      },
      {
        new: true,
      }
    );
    if (!UpdatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }
    const { error } = acceptMessageSchema.safeParse(acceptMessage);
    if (error) {
      return Response.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
    user.acceptMessages = acceptMessage;
    await user.save();
    return Response.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}
