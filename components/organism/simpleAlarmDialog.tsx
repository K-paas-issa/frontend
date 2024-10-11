import { Button } from "@/components/atom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/molecule";
import { useDialogContext } from "@/lib";
import React from "react";

interface SimpleAlarmDialogProps {
  title?: string;
  message: string | undefined | React.ReactNode;
  onClose: () => void;
  options?: React.ReactNode;
}

const SimpleAlarmDialog = React.memo(({ title, message, options }: SimpleAlarmDialogProps) => {
  const { isDialogOpen, dialogClose } = useDialogContext();

  return (
    <Dialog open={isDialogOpen} onOpenChange={dialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ? title : "알림"}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>{options && <DialogClose asChild>{options}</DialogClose>}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

SimpleAlarmDialog.displayName = "SimpleAlarmDialog";

export { SimpleAlarmDialog };
