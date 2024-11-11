"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"

import { cn } from "@/lib/utils"

type K = keyof typeof symbolByName
const symbolByName = {
	amount: '$'
} as const

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, min, max, value, onChange, ...props }, ref) => {
	const val = ((value === '' as any) ? min : value?.[0] ?? value) as number
	const { name } = props
	const symbol = name && name in symbolByName ? symbolByName[name as K] : ''

  return (
    <div className="relative pt-6 pb-6">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        onValueChange={onChange as any}
        value={[val]}
        min={min}
        max={max}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
				<div
						style={{ transform: `translateX(calc(${((val - min!) / (max! - min!))} * (1.25rem / 2 - 100%)))` }}
						className="absolute bottom-3/4 left-1 transform -translate-x-1/2 mb-2 text-sm"
				>
					{symbol}{val?.toLocaleString('es')}
				</div>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
      <div className="absolute -bottom-1 left-0 transform translate-x-1 text-sm">{symbol}{min?.toLocaleString('es')}</div>
      <div className="absolute -bottom-1 right-0 transform -translate-x-1 text-sm">{symbol}{max?.toLocaleString('es')}</div>
    </div>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
