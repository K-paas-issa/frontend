"use client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, ImageUploadBox } from "@/components/molecule";
import { useDialogContext } from "@/lib";
import React, { useEffect } from "react";
import { Button } from "../atom";

interface ReportHistoryDialogProps {
  id: string;
}

const ReportHistoryDialog = React.memo(({ id }: ReportHistoryDialogProps) => {
  const { isDialogOpen, dialogClose } = useDialogContext();

  return (
    <Dialog open={isDialogOpen(id)} onOpenChange={() => dialogClose(id)}>
      <DialogContent>
        <DialogHeader className="mb-[24px]">
          <DialogTitle>나의 신고 현황</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="sky" className="w-full" onClick={() => dialogClose(id)}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ReportHistoryDialog.displayName = "ReportHistoryDialog";

export { ReportHistoryDialog };
