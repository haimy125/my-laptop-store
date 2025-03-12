"use client";

import { useState, useEffect } from "react";

interface Product {
  idProduct: number;
  brand: number;
  brandName: string;
  modelName: string;
  cpu: string;
  ram: string;
  ssd: string;
  gpu: string;
  screen: string;
  battery: string;
  price: number;
  location: string;
  touchscreen: boolean;
  convertible: boolean;
  grade: string;
  keyboardLed: boolean;
  numpad: boolean;
  fullFunction: boolean;
  notes: string;
  imageUrl: string;
  warranty?: string;
}

interface ProductDetailProps {
  idProduct: number;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ idProduct }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${idProduct}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text(); // Đọc response body dưới dạng text
        console.log("Response body:", text); // Log response body
        const data: Product = await response.json(); // Parse response body
        setProduct(data);
      } catch (e: any) {
        setError(e.message);
      }
    };

    fetchProduct();
  }, [idProduct]);

  if (loading) {
    return <div>Đang tải chi tiết sản phẩm...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.imageUrl}
            alt={product.modelName}
            className="w-full rounded-lg shadow-md"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {product.brandName} {product.modelName}
          </h2>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">CPU:</span> {product.cpu}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">RAM:</span> {product.ram}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">SSD:</span> {product.ssd}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">GPU:</span> {product.gpu}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Screen:</span> {product.screen}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Battery:</span> {product.battery}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Price:</span> {product.price}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Location:</span> {product.location}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Touchscreen:</span>{" "}
            {product.touchscreen ? "Yes" : "No"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Convertible:</span>{" "}
            {product.convertible ? "Yes" : "No"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Grade:</span> {product.grade}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">KeyboardLed:</span>{" "}
            {product.keyboardLed ? "Yes" : "No"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Numpad:</span>{" "}
            {product.numpad ? "Yes" : "No"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">FullFunction:</span>{" "}
            {product.fullFunction ? "Yes" : "No"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Notes:</span> {product.notes}
          </p>

          {/* Thêm các thông tin chi tiết khác về sản phẩm ở đây */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
