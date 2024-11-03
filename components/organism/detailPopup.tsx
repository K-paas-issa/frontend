import React from "react";
import { BalloonInfo } from "@/api";
import { cn } from "@/lib/utils";
import { ArrowRight } from "../atom";

export const DetailPopup = ({ info, onClick }: { info: BalloonInfo | null; onClick: () => void }) => {
  return (
    info && (
      <div
        className={cn(
          `w-full flex items-center justify-between z-10 absolute bottom-[24px] border border-[2px] bg-white rounded-[8px] px-[20px] py-[16px] cursor-pointer`,
          info.risk >= 1 && info.risk < 25
            ? "border-risk_01"
            : info.risk >= 25 && info.risk < 50
            ? "border-risk_02"
            : info.risk >= 50 && info.risk < 75
            ? "border-risk_03"
            : info.risk >= 75
            ? "border-risk_04"
            : ""
        )}
        onClick={onClick}
      >
        <div>
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "font-bold pr-[8px]",
                info.risk >= 1 && info.risk < 25
                  ? "text-risk_01"
                  : info.risk >= 25 && info.risk < 50
                  ? "text-risk_02"
                  : info.risk >= 50 && info.risk < 75
                  ? "text-risk_03"
                  : info.risk >= 75
                  ? "text-risk_04"
                  : ""
              )}
            >
              {info.administrativeDistrict}
            </div>
          </div>
          <div className="mt-[6px] body2 text-gray_05">위험도 {info.risk}%</div>
        </div>
        <div>
          <ArrowRight />
        </div>
      </div>
    )
  );
};
