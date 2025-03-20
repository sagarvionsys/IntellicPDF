import { ApiResponse } from "@/utils/ApiResponse";
import withErrorHandler from "@/utils/withErrorHandler";
import { NextRequest } from "next/server";

export const POST = withErrorHandler(async (req: NextRequest) => {
  return ApiResponse("success", null, 200);
});
