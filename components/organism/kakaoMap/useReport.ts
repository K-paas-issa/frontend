import { ReportInfo } from "@/api";
import { useDialogContext } from "@/lib";
import { useEffect, useState } from "react";

const useReport = () => {
  const { dialogOpen, dialogClose } = useDialogContext();
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
  const [allReport, setAllReport] = useState<ReportInfo[]>([]);

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

    if (e.target.files) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      // uploadProductImage({
      //   file: formData,
      // });
      e.target.value = "";
    }

    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleReport = () => {
    dialogClose(`report`);

    setTimeout(() => {
      dialogOpen(`reportSuccess`);
    }, 100);
  };

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
