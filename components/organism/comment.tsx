import React from "react";
import { Button } from "../atom";

export const Comment = ({
  content,
  createdAt,
  isWriter,
}: {
  content: string;
  createdAt: string;
  isWriter: boolean;
}) => {
  return (
    <div className="flex justify-between items-center border_gray_02 border-b py-[16px]">
      <div>
        <div className="body1 mb-[4px] w-full">{content}</div>
        <div className="body2 text-gray_04">{createdAt}</div>
      </div>
      {isWriter && <Button className="min-w-[60px] h-[40px] ml-[30px]">삭제</Button>}
    </div>
  );
};
