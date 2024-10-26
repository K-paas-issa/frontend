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
import React, { useEffect, useState } from "react";
import { Button, LoadingSpinner } from "../atom";
import { ReportHistory } from "@/api";
import { useReportHistoryApi } from "@/api";
import dayjs from "dayjs";

interface ReportHistoryDialogProps {
  id: string;
}

const ReportHistoryDialog = React.memo(({ id }: ReportHistoryDialogProps) => {
  const { isDialogOpen, dialogClose } = useDialogContext();
  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    const storedReports = localStorage.getItem("report");
    let codes = storedReports ? JSON.parse(storedReports) : [];
    if (codes) setCodes(codes);
  }, []);

  const {
    mutate: getReportHistory,
    data: reportHistoryData,
    error: reportHistoryError,
    isPending: reportHistoryLoading,
  } = useReportHistoryApi();

  useEffect(() => {
    if (codes.length > 0) {
      getReportHistory(codes);
    }
  }, [codes]);

  const [reportHistory, setReportHistory] = useState<ReportHistory[]>([]);

  useEffect(() => {
    if (reportHistoryData) {
      setReportHistory(reportHistoryData);
    }
  }, [reportHistoryData]);

  return (
    <Dialog open={isDialogOpen(id)} onOpenChange={() => dialogClose(id)}>
      <DialogContent>
        <DialogHeader className="mb-[0px]">
          <DialogTitle>나의 신고 내역</DialogTitle>
        </DialogHeader>
        {reportHistoryLoading && <LoadingSpinner />}
        {reportHistory && reportHistory.length > 0 ? (
          reportHistory.map((history, index) => (
            <div key={history.id}>
              <div className="text-gray_05 body2">
                <div>신고 날짜: {dayjs(history.reportedTime).format("YYYY.MM.DD HH:mm")}</div>
                <div>신고 위치: {history.streetAddress || "-"}</div>
                <div>
                  처리 상태:{" "}
                  <span
                    className={`${
                      history.isCheckedStatus == false
                        ? "text-risk_04"
                        : history.isCheckedStatus == true
                        ? "text-green"
                        : "text-gray_04"
                    }`}
                  >
                    {history.isCheckedStatus == false ? "실패" : history.isCheckedStatus == true ? "성공" : "대기중"}
                  </span>
                </div>
                {history.isCheckedStatus == false && <div>실패 사유: 이미지 검증에 실패했습니다.</div>}
              </div>
              {index !== reportHistory.length - 1 && <div className="h-[1px] w-full bg-gray_02 my-[10px]" />}
            </div>
          ))
        ) : reportHistoryError ? (
          <div className="text-center mb-[24px] text-gray_05 body2">신고 내역을 가져오지 못했습니다.</div>
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
