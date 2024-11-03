import dayjs from "dayjs";
import React from "react";

export const Comment = ({ content, createdAt }: { id: number; content: string; createdAt: string }) => {
  return (
    <div className="flex justify-between items-center border_gray_02 border-b py-[16px]">
      <div>
        <div className="body1 mb-[4px] w-full">{content}</div>
        <div className="body2 text-gray_04">{dayjs(createdAt).format("YYYY.MM.DD HH:mm")}</div>
      </div>
    </div>
  );
};
