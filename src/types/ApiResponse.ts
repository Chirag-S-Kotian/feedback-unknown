import { Message } from "@/model/User.model"; 

export interface ApiResponse{
    status: boolean;
    message: string;
    isAcceptingMessages?: boolean;

}