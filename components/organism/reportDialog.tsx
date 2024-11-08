"use client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, ImageUploadBox } from "@/components/molecule";
import { useDialogContext } from "@/lib";
import React, { useEffect } from "react";
import { Button } from "../atom";

interface ReportDialogProps {
  id: string;
  error?: boolean;
  onReport: () => void;
  selectedImage: string | ArrayBuffer | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

const ReportDialog = React.memo(({ id, onReport, selectedImage, onImageUpload, onImageRemove }: ReportDialogProps) => {
  const { isDialogOpen, dialogClose } = useDialogContext();

  useEffect(() => {
    onImageRemove();
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen(id)} onOpenChange={() => dialogClose(id)}>
      <DialogContent>
        <DialogHeader className="mb-[24px]">
          <DialogTitle>신고하기</DialogTitle>
          <ImageUploadBox selectedImage={selectedImage} onImageUpload={onImageUpload} onImageRemove={onImageRemove} />
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex flex-col gap-[8px]">
            <Button variant="sky" className="w-full" onClick={onReport} disabled={!selectedImage}>
              접수하기
            </Button>
            <Button variant="text" className="w-full" onClick={() => dialogClose(id)}>
              취소
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ReportDialog.displayName = "ReportDialog";

export { ReportDialog };
