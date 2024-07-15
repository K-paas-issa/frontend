import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-black text-white rounded-[48px] hover:bg-black/90",
      },
      size: {
        default: "px-4 py-3",
        icon: "h-10 w-10",
      },
      font: {
        default: "subtitle3",
        h1: "h1",
        h2: "h2",
        subtitle1: "subtitle1",
        subtitle2: "subtitle2",
        subtitle3: "subtitle3 ",
        subtitle4: "subtitle4",
        body1: "body1",
        body2: "body2",
        body3: "body3",
      },
    },
    // custom 속성 추가
    defaultVariants: {
      variant: "default",
      size: "default",
      font: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  // custom 속성 추가
  ({ className, variant, size, font, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    // custom 속성 추가
    return <Comp className={cn(buttonVariants({ variant, size, font, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
