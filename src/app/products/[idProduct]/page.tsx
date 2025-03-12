// app/products/[idProduct]/page.tsx
"use client";

import { useParams } from "next/navigation"; // Import useParams
import ProductDetail from "@/app/components/ProductDetail";

export default function ProductDetailPage() {
  const params = useParams(); // Sử dụng useParams để lấy giá trị idProduct
  const { idProduct } = params;
  console.log("idProduct from params:", idProduct); // Thêm dòng này
  if (!idProduct) {
    return <div>Loading...</div>; // Xử lý trường hợp không có ID
  }

  return <ProductDetail productId={Number(idProduct)} />;
}
