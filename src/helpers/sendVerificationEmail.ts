import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificaitonEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
) {}
