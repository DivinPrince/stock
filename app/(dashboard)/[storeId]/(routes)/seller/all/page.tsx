import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { AllClient } from "./allclient";

export const add = async ({ params }: { params: { storeId: string } }) => {
    const { userId } = auth()
    const sellers = await prismadb.seller.findMany({
        where: {
            storeId: params.storeId,
        }
    })
    return (
        <>
            {userId === process.env.ADMIN_ID && (
                <Navbar />
            )}
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <AllClient data={sellers} />
                </div>
            </div>
        </>
    );
}