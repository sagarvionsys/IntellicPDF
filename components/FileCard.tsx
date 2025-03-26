import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Chat } from "@prisma/client";
import { FileText, MessageSquare } from "lucide-react";

interface FileCardProps {
  file: any;
  maxQuestionsPerFile: number;
  userPlan: string;
}

export default function FileCard({
  file,
  maxQuestionsPerFile,
  userPlan,
}: FileCardProps) {
  const humanQuestions = file.chats?.filter(
    (chat: Chat) => chat.role === "HUMAN"
  );

  const hasReachedLimit =
    userPlan === "BASIC" && humanQuestions.length >= maxQuestionsPerFile;

  return (
    <Card key={file.id} className="p-3 shadow-sm border rounded-lg">
      <CardHeader className="p-2 pb-0">
        <CardTitle className="text-xs font-semibold truncate">
          {file.fileName}
        </CardTitle>
        <CardDescription className="text-[10px] text-gray-500">
          {(file.fileSize / 1024).toFixed(2)} KB | {humanQuestions.length} /{" "}
          {maxQuestionsPerFile} used
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex justify-between items-center mb-1">
          <Link
            href={`/pdf/${file.id}`}
            className="text-blue-600 text-[10px] underline flex items-center space-x-1"
          >
            <FileText className="h-3 w-3" />
            <span>View PDF</span>
          </Link>
        </div>

        {/* Question Limit Indicator */}
        <div className="h-[3px] bg-gray-200 rounded-full mb-1 relative">
          <div
            className={`h-full rounded-full ${
              hasReachedLimit ? "bg-red-600" : "bg-blue-600"
            }`}
            style={{
              width: `${(humanQuestions.length / maxQuestionsPerFile) * 100}%`,
            }}
          />
        </div>
        {hasReachedLimit && (
          <p className="text-[10px] text-red-500 mt-1">
            ⚠️ Limit reached (5 free questions)
          </p>
        )}

        {/* User's Asked Questions */}
        <h4 className="text-[10px] font-medium mb-1">Your Questions:</h4>
        <ul className="space-y-[2px] text-[10px]">
          {humanQuestions.length > 0 ? (
            humanQuestions.map((chat: Chat) => (
              <li key={chat.id} className="flex items-start space-x-1">
                <MessageSquare className="h-3 w-3 text-gray-500" />
                <span className="truncate">{chat.message}</span>
              </li>
            ))
          ) : (
            <p className="text-[10px] text-gray-400">No questions yet.</p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
