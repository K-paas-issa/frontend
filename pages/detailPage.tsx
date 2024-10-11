import { ArrowRight, Button, Input, Send } from "@/components/atom";
import { Comment } from "@/components/organism";
import { SimpleAlarmDialog } from "@/components/organism/simpleAlarmDialog";
import { useDialogContext } from "@/lib";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const DetailPage = () => {
  const { dialogOpen, isDialogOpen } = useDialogContext();
  const searchParams = useSearchParams();
  const administrativeDistrict = searchParams && searchParams.get("administrative_district");
  const risk = searchParams && Number(searchParams.get("risk"));

  const [comment, setComment] = useState("");

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSendMessage = () => {
    if (comment === "") {
      dialogOpen("isCommentEmpty");
    } else {
      dialogOpen("uploadCommentSuccess");
    }
  };

  const handleDeleteComment = (id: number) => {
    dialogOpen(`deleteComment${id}`);
  };

  const commentTest = [
    {
      id: 1,
      content:
        "오물풍선 여기 겁나 많음오물풍선 여기 겁나 많음오물풍선 여기 겁나 많음오물풍선 여기 겁나 많음 오물풍선 여기겁나 많음 오물풍선 여기 겁나 많음 오물풍선 여기 겁나 많음 오물풍선 여기 겁나 많음 오물풍선 여기 겁나 많음오물풍선 여기 겁나 많음 오물풍선 여기 겁나 많음 오물풍선 여기 겁나 많음 오물풍선 여기 겁나 많음 오물풍선 여기겁나 많음 오물풍선 여기 겁나 많음",
      createdAt: "2024.01.01 15:30",
      isWriter: true,
    },
    {
      id: 2,
      content: "오물풍선 여기 많음",
      createdAt: "2024.01.01 15:30",
      isWriter: true,
    },
    {
      id: 3,
      content: "?",
      createdAt: "2024.01.01 15:30",
      isWriter: false,
    },
    {
      id: 4,
      content: "?",
      createdAt: "2024.01.01 15:30",
      isWriter: false,
    },

    {
      id: 5,
      content: "?",
      createdAt: "2024.01.01 15:30",
      isWriter: false,
    },
    {
      id: 6,
      content: "?",
      createdAt: "2024.01.01 15:30",
      isWriter: false,
    },
    {
      id: 7,
      content: "?",
      createdAt: "2024.01.01 15:30",
      isWriter: true,
    },
    {
      id: 8,
      content: "?",
      createdAt: "2024.01.01 15:30",
      isWriter: false,
    },
    {
      id: 9,
      content: "?",
      createdAt: "2024.01.01 15:30",
      isWriter: false,
    },
    {
      id: 10,
      content: "?",
      createdAt: "2024.01.01 15:30",
      isWriter: true,
    },
    {
      id: 11,
      content: "?",
      createdAt: "2024.01.01 15:30",
      isWriter: false,
    },
  ];

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-[60px] flex items-center px-[16px] bg-blue/10">
        <div className="rotate-180">
          <ArrowRight />
        </div>
        <div className="pt-[4px] m-auto subtitle1">커뮤니티</div>
      </div>
      <div className="flex flex-col items-center gap-[12px] mx-[16px] py-[24px]">
        <div>{administrativeDistrict}</div>
        <div className="flex items-center gap-[8px]">
          {risk && (
            <div
              className={cn(
                "w-[30px] h-[30px] rounded-full",
                risk >= 1 && risk < 25
                  ? "bg-risk_01"
                  : risk >= 25 && risk < 50
                  ? "bg-risk_02"
                  : risk >= 50 && risk < 75
                  ? "bg-risk_03"
                  : risk >= 75
                  ? "bg-risk_04"
                  : ""
              )}
            />
          )}
          위험도: {risk} %
        </div>
      </div>
      <div className="w-full h-[8px] bg-gray_01" />
      <div className="h-[calc(100%-275px)] mx-[16px] overflow-auto">
        {commentTest &&
          commentTest.map((comment) => (
            <Comment
              key={comment.id}
              id={comment.id}
              content={comment.content}
              createdAt={comment.createdAt}
              isWriter={comment.isWriter}
              onDelete={() => handleDeleteComment(comment.id)}
            />
          ))}
      </div>
      <div className="relative flex items-center gap-[8px] w-[98%] mx-auto mt-[20px]">
        <Input
          className="w-full h-[52px] bottom-[24px]"
          placeholder="댓글을 입력해주세요"
          onChange={handleContentChange}
        />
        <div onClick={handleSendMessage}>
          <Send />
        </div>
      </div>
      {isDialogOpen("isCommentEmpty") && (
        <SimpleAlarmDialog
          id="isCommentEmpty"
          title="알림"
          message={"내용을 입력해주세요"}
          options={
            <Button variant="sky" className="w-full">
              확인
            </Button>
          }
        />
      )}
      {isDialogOpen("uploadCommentSuccess") && (
        <SimpleAlarmDialog
          id="uploadCommentSuccess"
          title="알림"
          message={"댓글이 등록되었습니다"}
          options={
            <Button variant="sky" className="w-full">
              확인
            </Button>
          }
        />
      )}
    </div>
  );
};

export default DetailPage;
