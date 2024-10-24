import React from "react";
import { Button, Input } from "../atom";
import Image from "next/image";

interface ImageUploadBoxProps {
  selectedImage: string | ArrayBuffer | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove?: () => void;
}

export const ImageUploadBox = ({ selectedImage, onImageUpload, onImageRemove }: ImageUploadBoxProps) => {
  return (
    <div>
      <Input type="file" id="file" accept=".jpg, .jpeg, .png" onChange={onImageUpload} className="hidden" />
      {selectedImage ? (
        <div className="relative group">
          <Image
            src={selectedImage.toString()}
            alt=""
            width={300}
            height={300}
            style={{
              minWidth: "300px",
              minHeight: "300px",
              maxWidth: "300px",
              maxHeight: "300px",
              objectFit: "cover",
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full rounded-[16px] bg-transparent group-hover:bg-black/30"></div>
          <Button
            onClick={onImageRemove}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden group-hover:block text-white"
          >
            이미지 제거하기
          </Button>
        </div>
      ) : (
        <label
          htmlFor="file"
          className={`flex flex-col items-center justify-center cursor-pointer w-[300px] h-[300px] rounded-[16px] bg-gray_02 hover:bg-gray_02`}
        >
          <div>
            <Image src="/assets/upload_image_plus.png" alt="" width={50} height={50} />
          </div>
        </label>
      )}
    </div>
  );
};
