import { Progress } from "@/components/ui/progress";
import { ProductColumn } from "./columns";

interface props {
    data: ProductColumn;
  }
  
  export const Sold: React.FC<props> = ({ data }) => {
  return (
    <div>
        <h1>{data.sold}</h1>
        <Progress value={(data.sold/data.stockQuantity)*100}/>
    </div>
  )
}

export default Sold
