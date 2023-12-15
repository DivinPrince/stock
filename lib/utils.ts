import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = (number: number) => {
  const options = {
    style: 'currency',
    currency: 'RWF',
    useGrouping: true, // set to false to disable grouping
  };

  return new Intl.NumberFormat('rw-RW', options).format(number);
};