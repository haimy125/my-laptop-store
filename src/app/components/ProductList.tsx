"use client";

import { useState, useEffect } from "react";

interface Product {
  idProduct: string;
  brand: string;
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

interface ProductResponse {
  content: Product[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: true;
  };
  numberOfElements: number;
  empty: boolean;
}

interface ProductListProps {
  apiUrl: string;
}

const ProductList: React.FC<ProductListProps> = ({ apiUrl }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const phoneNumber = "0976540201";

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}?page=${currentPage}&size=8`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ProductResponse = await response.json();
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [apiUrl, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-4">Danh sách sản phẩm</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.idProduct}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <img
              src={product.imageUrl}
              alt={product.modelName}
              className="w-full h-32 sm:h-48 object-cover"
            />
            <div className="p-2 sm:p-4 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-lg font-semibold truncate sm:text-xl">
                  {product.brand} {product.modelName}
                </h3>
                <p className="text-gray-600 truncate text-sm sm:text-base">
                  <span className="font-semibold">Giá:</span>
                  <span className="text-red-600 font-bold">
                    {product.price.toLocaleString()} VNĐ
                  </span>
                </p>
                <p className="text-gray-600 truncate text-xs sm:text-sm hidden md:block">
                  {/* Hidden on smaller screens, visible from medium screens upwards */}
                  <span className="font-semibold">CPU:</span> {product.cpu}
                </p>
                <p className="text-gray-600 truncate text-xs sm:text-sm hidden md:block">
                  {/* Hidden on smaller screens, visible from medium screens upwards */}
                  <span className="font-semibold">RAM:</span> {product.ram}
                </p>
                <p className="text-gray-600 truncate text-xs sm:text-sm">
                  <span className="font-semibold">Màn hình:</span>{" "}
                  {product.screen}
                </p>
                <p className="text-gray-600 truncate text-xs sm:text-sm hidden lg:block">
                  {/* Hidden on smaller screens, visible from large screens upwards */}
                  <span className="font-semibold">GPU:</span> {product.gpu}
                </p>
                <p className="text-gray-600 truncate text-xs sm:text-sm hidden lg:block">
                  {/* Hidden on smaller screens, visible from large screens upwards */}
                  <span className="font-semibold">Pin:</span> {product.battery}
                </p>
                <p className="text-gray-600 truncate text-xs sm:text-sm">
                  <span className="font-semibold">Địa chỉ:</span>{" "}
                  {product.location}
                </p>
                <p className="text-green-600 font-bold truncate text-xs sm:text-sm">
                  Liên hệ: <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>{" "}
                  (Call/Zalo)
                </p>
                <p className="text-blue-500 font-bold truncate text-xs sm:text-sm">
                  🚚 Ship cod toàn quốc
                </p>
                <p className="text-xs text-gray-700 italic">
                  📢 Tuyển CTV bán laptop online! LH:{" "}
                  <a href={`tel:${phoneNumber}`} className="text-blue-500">
                    {phoneNumber}
                  </a>{" "}
                  (Call/Zalo)
                </p>
              </div>
              <div>
                <p className="text-gray-500 truncate text-xs sm:text-sm">
                  <span className="font-semibold">Cảm ứng:</span>{" "}
                  {product.touchscreen ? "Có" : "Không"} |{" "}
                  <span className="font-semibold">Xoay gập:</span>{" "}
                  {product.convertible ? "Có" : "Không"}
                </p>
                <p className="text-gray-500 truncate text-xs sm:text-sm">
                  <span className="font-semibold">Ngoại hình:</span>{" "}
                  {product.grade}
                </p>
                <p className="text-red-500 font-bold bg-yellow-100 px-1 rounded text-xs sm:text-sm inline-block">
                  Bảo hành: {product.warranty || "Không có"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 rounded-full ${
              currentPage === page
                ? "bg-indigo-600 text-white"
                : "cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
