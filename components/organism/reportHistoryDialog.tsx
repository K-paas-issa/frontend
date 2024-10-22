"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ImageUploadBox,
} from "@/components/molecule";
import { useDialogContext } from "@/lib";
import React, { useEffect } from "react";
import { Button } from "../atom";
import { ReportHistory } from "@/api";

interface ReportHistoryDialogProps {
  id: string;
  reportHistory: ReportHistory[];
}

const ReportHistoryDialog = React.memo(({ id, reportHistory }: ReportHistoryDialogProps) => {
  const { isDialogOpen, dialogClose } = useDialogContext();

  return (
    <Dialog open={isDialogOpen(id)} onOpenChange={() => dialogClose(id)}>
      <DialogContent>
        <DialogHeader className="mb-[0px]">
          <DialogTitle>나의 신고 현황</DialogTitle>
        </DialogHeader>
        {reportHistory && reportHistory.length > 0 ? (
          reportHistory.map((history, index) => (
            <>
              <div key={history.id} className="text-gray_05 body2">
                <div>신고 날짜: {history.createdAt}</div>
                <div>신고 위치: {history.reportLocation}</div>
                <div>
                  처리 상태:{" "}
                  <span className={`${history.status == "접수 실패" ? "text-risk_04" : "text-green"}`}>
                    {history.status}
                  </span>
                </div>
                {history.status == "접수 실패" && <div>실패 사유: {history.message}</div>}
              </div>
              {index !== reportHistory.length - 1 && <div className="h-[1px] w-full bg-gray_02 my-[10px]" />}
            </>
          ))
        ) : (
          <div className="text-center mb-[24px] text-gray_05 body2">신고 내역이 없습니다.</div>
        )}

        <DialogFooter>
          <Button variant="sky" className="w-full mt-[24px]" onClick={() => dialogClose(id)}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ReportHistoryDialog.displayName = "ReportHistoryDialog";

export { ReportHistoryDialog };
