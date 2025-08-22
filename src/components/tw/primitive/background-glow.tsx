import { FC, ReactNode } from "react";
import { cn } from "@cn"
import { cva, type VariantProps } from "class-variance-authority"


const glowVariants = cva(
	"",
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

export interface GlowProps
	extends VariantProps<typeof glowVariants> {
	className?: string;
	children?: ReactNode;
}

const Glow: FC<GlowProps> = ({
	className,
	variant,
	children
}) => {
	return (
		<>
			<div className={cn(glowVariants({ variant, className }))}>
				<div className="relative w-fit">
					<div className="absolute p-2 -inset-0.5 bg-primary rounded-2xl blur">
					</div>
					{/* <div className="relative"> */}
					{children}
					{/* </div> */}
				</div>

			</div>
		</>
	)
}


export {
	Glow,
	glowVariants
}
