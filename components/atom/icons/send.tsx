import { SVGProps, baseColor } from "./types";

export const Send = ({ color, size }: SVGProps) => (
  <svg
    width={size ? size : "24"}
    height={size ? size : "24"}
    viewBox="0 0 24 24"
    fill={color ? color : baseColor}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.99995 14L20.9999 3M9.99995 14L13.4999 21C13.5438 21.0957 13.6143 21.1769 13.7029 21.2338C13.7915 21.2906 13.8946 21.3209 13.9999 21.3209C14.1053 21.3209 14.2084 21.2906 14.297 21.2338C14.3856 21.1769 14.4561 21.0957 14.4999 21L20.9999 3M9.99995 14L2.99995 10.5C2.90421 10.4561 2.82307 10.3857 2.76619 10.2971C2.70931 10.2084 2.67908 10.1053 2.67908 10C2.67908 9.89468 2.70931 9.79158 2.76619 9.70295C2.82307 9.61431 2.90421 9.54387 2.99995 9.5L20.9999 3"
      stroke={color ? color : baseColor}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
