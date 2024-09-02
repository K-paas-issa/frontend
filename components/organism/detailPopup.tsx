import React from "react";
import { AreaInfo } from "./map";
import { cn } from "@/lib/utils";
import { ArrowRight } from "../atom";

export const DetailPopup = ({ info }: { info: AreaInfo | null }) => {
  return (
    info && (
      <div
        className={cn(
          `flex items-center justify-between w-11/12 z-10 absolute bottom-[24px] left-[18px] border border-[2px] bg-white rounded-[8px] px-[20px] py-[16px] cursor-pointer`,
          info.risk >= 1 && info.risk < 2
            ? "border-risk_01"
            : info.risk >= 2 && info.risk < 3
            ? "border-risk_02"
            : info.risk >= 3 && info.risk < 4
            ? "border-risk_03"
            : info.risk >= 4
            ? "border-risk_04"
            : ""
        )}
      >
        <div>
          <div className="flex items-center">
            <div
              className={cn(
                "font-bold pr-[8px]",
                info.risk >= 1 && info.risk < 2
                  ? "text-risk_01"
                  : info.risk >= 2 && info.risk < 3
                  ? "text-risk_02"
                  : info.risk >= 3 && info.risk < 4
                  ? "text-risk_03"
                  : info.risk >= 4
                  ? "text-risk_04"
                  : ""
              )}
            >
              {info.areaName}
            </div>
            <div>위험도 {info.risk}</div>
          </div>
          <div className="text-gray_04">
            신고수: {info.reportCount} / 처리여부: {info.status}
          </div>
        </div>
        <div>
          <ArrowRight />
        </div>
      </div>
    )
  );
};
