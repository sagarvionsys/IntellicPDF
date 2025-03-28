import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Chat, File } from "@prisma/client";
import { FileText, MessageSquare } from "lucide-react";
import { Badge } from "../ui/badge";

interface FileCardProps {
  files: any;
  maxQuestionsPerFile: number;
  userPlan: string;
}

export default function FileCards({
  files,
  maxQuestionsPerFile,
  userPlan,
}: FileCardProps) {
  const humanQuestions = files?.filter((chat: Chat) => chat.role === "HUMAN");

  const hasReachedLimit =
    userPlan === "BASIC" && humanQuestions.length >= maxQuestionsPerFile;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {files.length > 0 &&
          files?.map((file: any) => {
            const questionsCount = file.questions?.length || 0;
            const isLimitReached = questionsCount >= maxQuestionsPerFile;

            return (
              <Card
                key={file.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <Badge
                      variant={isLimitReached ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {questionsCount}/{maxQuestionsPerFile} Questions
                    </Badge>
                  </div>
                  <h3 className="font-medium truncate">{file.fileName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {(file.fileSize / 1024).toFixed(2)} KB • Uploaded{" "}
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    {file.questions?.length > 0 ? (
                      file.questions?.map((question: any) => (
                        <div
                          key={question.id}
                          className="flex items-start gap-2 text-sm"
                        >
                          <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm truncate">{question.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No questions yet
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/pdf/${file.id}`}
                    className="mt-4 inline-flex items-center text-xs text-primary hover:underline"
                  >
                    View Document →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
