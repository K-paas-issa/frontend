import { ReportInfo, useReportApi } from "@/api";
import { ReportRequest } from "@/api/reportApi";
import { useDialogContext } from "@/lib";
import { useEffect, useState } from "react";

const useReport = (currentLocation: { latitude: number; longitude: number } | null) => {
  const { dialogOpen, dialogClose } = useDialogContext();
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
  const [allReport, setAllReport] = useState<ReportInfo[]>([]);

  const [requestData, setRequestData] = useState<ReportRequest>();

  const { mutate: report, data: reportData, error: reportError } = useReportApi();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "jpg" && extension !== "jpeg" && extension !== "png") {
      alert("jpg, jpeg, png 파일만 업로드해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    if (e.target.files && currentLocation) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);

      const requestObject = {
        longitude: currentLocation.longitude,
        latitude: currentLocation.latitude,
      };

      const json = JSON.stringify(requestObject);
      const blob = new Blob([json], { type: "application/json" });

      formData.append("request", blob);

      setRequestData({
        image: formData,
        request: requestObject,
      });

      e.target.value = "";
    }

    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleReport = () => {
    if (requestData) report(requestData);
  };

  useEffect(() => {
    if (reportData) {
      dialogClose(`report`);

      setTimeout(() => {
        dialogOpen(`reportSuccess`);
      }, 100);
    }
  }, [reportData]);

  useEffect(() => {
    if (reportError) {
      dialogClose(`report`);

      setTimeout(() => {
        dialogOpen(`reportFailed`);
      }, 100);
    }
  }, [reportError]);

  useEffect(() => {
    setAllReport([
      {
        id: 1,
        latitude: 37.498095,
        longitude: 127.02761,
        reportCount: 10,
      },
      {
        id: 2,
        latitude: 37.69733335,
        longitude: 126.7978504,
        reportCount: 1,
      },
    ]);
  }, []);

  return {
    allReport,
    setAllReport,
    selectedImage,
    setSelectedImage,
    handleImageUpload,
    handleImageRemove,
    handleReport,
  };
};

export { useReport };
