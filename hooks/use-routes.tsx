import { useParams, usePathname } from "next/navigation";

export const useRoutes = ()=>{
    const pathname = usePathname();
    const params = useParams();
  
    const routes = [
      {
        href: `/${params.storeId}`,
        label: 'Overview',
        active: pathname === `/${params.storeId}`,
      },
      {
        href: `/${params.storeId}/products`,
        label: 'Products',
        active: pathname === `/${params.storeId}/products`,
      },
      {
        href: `/${params.storeId}/seller`,
        label: 'Seller',
        active: pathname === `/${params.storeId}/seller`,
      },
      {
        href: `/${params.storeId}/seller/add`,
        label: 'Add Seller',
        active: pathname === `/${params.storeId}/seller/add`,
      },
      {
        href: `/${params.storeId}/seller/all`,
        label: 'sellers',
        active: pathname === `/${params.storeId}/seller/all`,
      },
      {
        href: `/${params.storeId}/expences`,
        label: 'Expences',
        active: pathname === `/${params.storeId}/expences`,
      },
      {
        href: `/${params.storeId}/report`,
        label: 'Report',
        active: pathname === `/${params.storeId}/report`,
      },
      {
        href: `/${params.storeId}/settings`,
        label: 'Settings',
        active: pathname === `/${params.storeId}/settings`,
      },
    ]
    return routes
}