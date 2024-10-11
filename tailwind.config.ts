import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import type { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        black: "#1B1B1B",
        white: "#FFFFFF",
        blue: "#0BA1FF",
        green: "#6BBC21",
        gray_01: "#EEEEEE",
        gray_02: "#D8D8D8",
        gray_03: "#B4B4B4",
        gray_04: "#929292",
        gray_05: "#696969",
        gray_06: "#454545",
        risk_01: "#BAE975",
        risk_02: "#FFD066",
        risk_03: "#FF9C00",
        risk_04: "#FF3E2F",
      },
      fontFamily: {
        Pretendard: ["Pretendard"],
      },
      screens: {
        md: "768px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }: PluginAPI) {
      addUtilities({
        ".h1": {
          fontSize: "22px",
          lineHeight: "27px",
          fontWeight: "bold",
          "@screen md": {
            fontSize: "24px",
            lineHeight: "29px",
          },
        },
        ".h2": {
          fontSize: "20px",
          lineHeight: "22px",
          fontWeight: "bold",
          "@screen md": {
            fontSize: "22px",
            lineHeight: "24px",
          },
        },
        ".subtitle1": {
          fontSize: "16px",
          lineHeight: "22px",
          fontWeight: "bold",
          "@screen md": {
            fontSize: "18px",
            lineHeight: "24px",
          },
        },
        ".subtitle2": {
          fontSize: "14px",
          lineHeight: "22px",
          fontWeight: "bold",
          "@screen md": {
            fontSize: "16px",
            lineHeight: "24px",
          },
        },
        ".subtitle3": {
          fontSize: "12px",
          lineHeight: "18px",
          fontWeight: "semibold",
          "@screen md": {
            fontSize: "14px",
            lineHeight: "20px",
          },
        },
        ".subtitle4": {
          fontSize: "10px",
          lineHeight: "16px",
          fontWeight: "semibold",
          "@screen md": {
            fontSize: "12px",
            lineHeight: "18px",
          },
        },
        ".body1": {
          fontSize: "14px",
          lineHeight: "22px",
          fontWeight: "medium",
          "@screen md": {
            fontSize: "16px",
            lineHeight: "24px",
          },
        },
        ".body2": {
          fontSize: "12px",
          lineHeight: "18px",
          fontWeight: "medium",
          "@screen md": {
            fontSize: "14px",
            lineHeight: "20px",
          },
        },
        ".body3": {
          fontSize: "10px",
          lineHeight: "16px",
          fontWeight: "medium",
          "@screen md": {
            fontSize: "12px",
            lineHeight: "18px",
          },
        },
        ".placeholder": {
          fontSize: "14px",
          lineHeight: "22px",
          fontWeight: "regular",
        },
      });
    }),
  ],
};

export default config;
