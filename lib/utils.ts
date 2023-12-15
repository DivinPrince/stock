import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = (number: number)=>{
  return new Intl.NumberFormat('rw-RW',{style: 'currency',currency: 'RWF',}).format(number)
}