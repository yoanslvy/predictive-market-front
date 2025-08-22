import { FC, ReactNode } from "react";
import { cn } from "@cn"
import { cva, type VariantProps } from "class-variance-authority"


const frameVariants = cva(
	"justify-between flex",
	{
		variants: {
			variant: {
				default: ""
			},
			defaultVariants: {
				variant: "default"
			}
		}
	}
)

export interface FrameProps
	extends VariantProps<typeof frameVariants> {
	className?: string;
	tools?: ReactNode;
	title?: ReactNode;
	footer?: ReactNode;
	children?: ReactNode;
}

const Frame: FC<FrameProps> = ({
	className,
	tools,
	title,
	footer,
	variant,
	children
}) => {
	return (
		<>
			<div className={cn(frameVariants({ variant, className }))}>
				{!!title && title}
				{!!tools && tools}
			</div>
			{children}
			<div>
				{!!footer && footer}
			</div>
		</>
	)
}


export {
	Frame,
	frameVariants
}
