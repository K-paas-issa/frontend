import React from "react";
import { Button } from "../atom";
import { SimpleAlarmDialog } from "./simpleAlarmDialog";
import { useDialogContext } from "@/lib";

export const Comment = ({
  id,
  content,
  createdAt,
  isWriter,
  onDelete,
}: {
  id: number;
  content: string;
  createdAt: string;
  isWriter: boolean;
  onDelete: () => void;
}) => {
  const { isDialogOpen, dialogOpen, dialogClose } = useDialogContext();

  const handleDeleteComment = () => {
    dialogClose(`deleteComment${id}`);

    setTimeout(() => {
      dialogOpen(`deleteComment${id}Success`);
    }, 100);
  };

  return (
    <div className="flex justify-between items-center border_gray_02 border-b py-[16px]">
      <div>
        <div className="body1 mb-[4px] w-full">{content}</div>
        <div className="body2 text-gray_04">{createdAt}</div>
      </div>
      {isWriter && (
        <Button className="min-w-[60px] h-[40px] ml-[30px]" onClick={() => dialogOpen(`deleteComment${id}`)}>
          삭제
        </Button>
      )}
      {isDialogOpen(`deleteComment${id}`) && (
        <SimpleAlarmDialog
          id={`deleteComment${id}`}
          title="알림"
          message={"댓글을 삭제하시겠습니까?"}
          options={
            <div className="w-full flex flex-col gap-[8px]">
              <Button variant="sky" className="w-full" onClick={handleDeleteComment}>
                삭제하기
              </Button>
              <Button variant="text" className="w-full" onClick={() => dialogClose(`deleteComment${id}`)}>
                취소
              </Button>
            </div>
          }
        />
      )}
      {isDialogOpen(`deleteComment${id}Success`) && (
        <SimpleAlarmDialog
          id={`deleteComment${id}Success`}
          title="알림"
          message={"댓글이 삭제되었습니다"}
          options={
            <Button variant="sky" className="w-full" onClick={() => dialogClose(`deleteComment${id}Success`)}>
              확인
            </Button>
          }
        />
      )}
    </div>
  );
};
