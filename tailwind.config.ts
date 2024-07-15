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
        black: {
          DEFAULT: "#212529",
        },
        white: {
          DEFAULT: "#ffffff",
        },
        yellow: {
          DEFAULT: "#ffb742",
        },
        gray: {
          DEFAULT: "#fafafa",
        },
        blue: {
          DEFAULT: "#254a65",
        },
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
          fontWeight: "semibold",
          "@screen md": {
            fontSize: "18px",
            lineHeight: "24px",
          },
        },
        ".subtitle2": {
          fontSize: "14px",
          lineHeight: "22px",
          fontWeight: "semibold",
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
      });
    }),
  ],
};

export default config;
