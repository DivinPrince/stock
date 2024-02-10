import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: { expenceId: string; storeId: string };
}) => {
  let product = null;
  if (params.expenceId != "new") {
    product = await prismadb.expence.findUnique({
      where: {
        id: params.expenceId,
      },
    });
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-2 pt-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
