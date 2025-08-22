import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@cn"

import { FC, ReactNode } from "react";

const variants = cva(
	`text-white font-bold`,
	{
		variants: {
			variant: {
				default:
					"",
			},
			size: {
				default: "text-3xl",
				lg: "text-lg",
				xl: "text-xl",
				x3xl: "text-3xl",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "lg",
		},
	}
)

export interface Props extends VariantProps<typeof variants> {
	className?: string;
	children?: ReactNode;
	subtitle?: ReactNode;
};


export const Heading: FC<Props> = ({
	className,
	variant = "default",
	subtitle,
	size = "x3xl",
	children,
}) => {
	return (

		<>
			<div className={cn(variants({ variant, size, className }))}>
				{children}
			</div>

		</>
	);
};
