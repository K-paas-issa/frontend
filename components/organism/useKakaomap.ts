import { useBalloonApi } from "@/api";
import { useDialogContext } from "@/lib";
import React, { useEffect } from "react";

const useKakaomap = () => {
  const { data: balloonList, error: isBalloonListError } = useBalloonApi();
  const { dialogOpen } = useDialogContext();

  useEffect(() => {
    if (isBalloonListError) console.log(isBalloonListError.message);
  }, [isBalloonListError]);

  useEffect(() => {
    if (isBalloonListError) {
      dialogOpen(`isBalloonError`);
    }
  }, [dialogOpen, isBalloonListError]);

  return { balloonList };
};

export { useKakaomap };
