import { useCommentApi, Comment as CommentType, useCreateCommentApi } from "@/api";
import { ArrowRight, Button, Input, LoadingSpinner, Send } from "@/components/atom";
import { Comment } from "@/components/organism";
import { SimpleAlarmDialog } from "@/components/organism";
import { useObserver } from "@/hooks";
import { useDialogContext } from "@/lib";
import { cn } from "@/lib/utils";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";

const DetailPage = () => {
  const { back } = useRouter();
  const { dialogOpen, isDialogOpen } = useDialogContext();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const administrativeDistrict = searchParams && searchParams.get("administrativeDistrict");
  const risk = searchParams && Number(searchParams.get("risk"));

  const scrollRef = useRef<HTMLDivElement>(null);

  const [commentList, setCommentList] = useState<CommentType[]>([]);

  const {
    data: commentListData,
    fetchNextPage,
    error: commentListError,
    refetch: commentRefetch,
  } = useCommentApi({
    id: Number(id),
    size: 10,
  });

  const refetchCommentList = () => {
    commentRefetch().then((response) => {
      if (response.data) {
        const commentList = response.data.pages[0].content.flatMap((page) => page);
        setCommentList(commentList);
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
        }
      }
    });
  };

  const {
    mutate: createComment,
    isSuccess: createCommentSuccess,
    error: createCommentError,
    isPending: createCommentPending,
  } = useCreateCommentApi({ id: Number(id) });

  useEffect(() => {
    if (commentListData) {
      const commentList = commentListData.pages.flatMap((page) => page.content);
      setCommentList(commentList);
    } else if (commentListError) {
      dialogOpen("getCommentListError");
    }
  }, [commentListData, commentListError, dialogOpen]);

  const [comment, setComment] = useState("");

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSendMessage = () => {
    if (comment === "") {
      dialogOpen("isCommentEmpty");
    } else {
      createComment({ content: comment });
      setComment("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (createCommentSuccess) {
      dialogOpen("uploadCommentSuccess");
    } else if (createCommentError) {
      dialogOpen("uploadCommentError");
    }
  }, [createCommentSuccess, createCommentError, dialogOpen]);

  const bottom = useRef<HTMLDivElement>(null);
  const onIntersect: IntersectionObserverCallback = async ([entry]) => {
    if (entry.isIntersecting) {
      await fetchNextPage();
    }
  };

  useObserver({
    target: bottom,
    onIntersect,
  });

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-[60px] flex items-center px-[16px] bg-blue/10">
        <div className="rotate-180 cursor-pointer" onClick={back}>
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
      <Suspense fallback={<LoadingSpinner />}>
        <div ref={scrollRef} className="h-[calc(100%-275px)] mx-[16px] overflow-auto">
          {commentList &&
            commentList.map((comment) => (
              <Comment key={comment.id} id={comment.id} content={comment.content} createdAt={comment.createdAt} />
            ))}
          {commentList.length >= 10 && <div ref={bottom} className="h-[2px]" />}
        </div>
      </Suspense>
      <div className="relative flex items-center gap-[8px] w-[98%] mx-auto mt-[20px]">
        <Input
          className="w-full h-[52px] bottom-[24px]"
          placeholder="댓글을 입력해주세요"
          value={comment}
          onChange={handleContentChange}
          disabled={createCommentPending}
          onKeyDown={handleKeyDown}
        />
        <div
          onClick={() => {
            if (!createCommentPending) handleSendMessage();
          }}
        >
          <Send />
        </div>
      </div>
      {isDialogOpen("getCommentListError") && (
        <SimpleAlarmDialog
          id="getCommentListError"
          title="알림"
          message={"댓글 목록을 가져오지 못했습니다."}
          options={
            <Button variant="sky" className="w-full">
              확인
            </Button>
          }
        />
      )}
      {isDialogOpen("isCommentEmpty") && (
        <SimpleAlarmDialog
          id="isCommentEmpty"
          title="알림"
          message={"내용을 입력해주세요."}
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
          message={"댓글이 등록되었습니다."}
          options={
            <Button
              variant="sky"
              className="w-full"
              onClick={() => {
                refetchCommentList();
              }}
            >
              확인
            </Button>
          }
        />
      )}
      {isDialogOpen("uploadCommentError") && (
        <SimpleAlarmDialog
          id="uploadCommentError"
          title="알림"
          message={"댓글 등록에 실패했습니다."}
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
