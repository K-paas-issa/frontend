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
  id: string;
  title?: string;
  message: string | undefined | React.ReactNode;
  options?: React.ReactNode;
}

const SimpleAlarmDialog = React.memo(({ id, title, message, options }: SimpleAlarmDialogProps) => {
  const { isDialogOpen, dialogClose } = useDialogContext();

  return (
    <Dialog open={isDialogOpen(id)} onOpenChange={() => dialogClose(id)}>
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
