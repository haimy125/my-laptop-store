// components/ProductTable.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { getServerCookie } from "@/app/components/GetServerCookie";

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

interface ProductTableProps {
  apiUrl: string;
  onProductSelect: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  apiUrl,
  onProductSelect,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const pageSize = 10;

  const handleRowClick = (product: Product) => {
    onProductSelect(product);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${apiUrl}?page=${currentPage}&size=${pageSize}&modelName=${searchTerm}`
      );
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
  }, [apiUrl, currentPage, searchTerm, pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    async function fetchToken() {
      const serverToken = await getServerCookie("jwtToken");
      if (serverToken) {
        setToken(serverToken);
      } else {
        const storedToken = Cookies.get("jwtToken");
        setToken(storedToken || null);
      }
    }

    fetchToken();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleDeleteProduct = async (id: number) => {
    const idString = id.toString();

    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      console.log("Deleting product with ID:", idString);
      console.log("Token:", token);

      const response = await fetch(
        `http://localhost:8080/admin/api/products/${idString}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting product:", errorData);
        throw new Error(
          `HTTP error! Status: ${response.status} - ${JSON.stringify(
            errorData
          )}`
        );
      }

      console.log("Product deleted successfully!");
      fetchProducts(); // Gọi lại fetchProducts sau khi xóa thành công
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="p-4">
      {/* Tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm..."
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
          onChange={handleSearch}
        />
      </div>

      {/* Bảng sản phẩm */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Hình
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Thương hiệu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tên sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {products.map((product) => (
              <tr
                key={product.idProduct}
                onClick={() => handleRowClick(product)}
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <img
                    src={product.imageUrl}
                    alt={product.modelName}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.brandName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {product.modelName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.price.toLocaleString()} VNĐ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product.idProduct);
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 cursor-pointer"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
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

export default ProductTable;
