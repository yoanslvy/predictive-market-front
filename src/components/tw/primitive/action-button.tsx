
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@cn"

import Link from "next/link";
import React, { forwardRef, ReactNode, Ref } from "react";
import { Glow } from "./background-glow";


const buttonVariants = cva(
  `inline-flex items-center relative w-fit justify-center whitespace-nowrap 
  rounded-xl font-bold transition-colors focus-visible:outline-none 
  focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary/90 px-4", // text-primary-foreground
        // outline:
        //   `border border-input bg-transparent shadow-sm 
        //   hover:bg-accent hover:text-accent-foreground`,
        // secondary:
        //   "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        // ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 text-md "
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GenericProps
  extends VariantProps<typeof buttonVariants> {
  href?: string | undefined;
  icon?: ReactNode;
  className?: string;
  caption?: ReactNode;
  indicator?: ReactNode;
  glowing?: ReactNode;
  counter?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  buttonType?: "button" | "submit" | "reset";
  isAccent?: boolean;
}

const ActionButton = forwardRef(function Button(
  {
    className,
    size = "default",
    variant = "default",
    buttonType = "button",
    caption,
    children,
    href,
    icon,
    indicator,
    counter,
    isActive,
    isDisabled,
    isHidden,
    isAccent,
    ...rest

  }: Omit<React.HTMLProps<HTMLAnchorElement>, "href" | "size"> & GenericProps,
  ref
) {

  const content = (
    <>
      {!!icon && <span className={'mr-2 h-4 w-4'}>{icon}</span>}
      {(caption || children) && (
        <span className={'w-fit'}>{caption || children}</span>
      )}
    </>
  );

  const props = {
    className: cn(buttonVariants({ variant, size, className })),
    disabled: isDisabled,
    hidden: isHidden,

    ...rest,
  };

  if (href) {
    return (
      <Link
        // className=" "
        href={href}
        {...props}
        ref={ref as Ref<HTMLAnchorElement>}>
        <Glow>
          <button>
            {content}
          </button>
        </Glow>
      </Link>
    );
  }

  return React.createElement(
    Glow, 
    {},    // Props for the div
    React.createElement(
      "button", 
      {
        ...props,
        type: buttonType,
        ref: ref as Ref<HTMLButtonElement>,
      },
      content,
    )
  );
}
)
ActionButton.displayName = "Button"

export { ActionButton, buttonVariants }
