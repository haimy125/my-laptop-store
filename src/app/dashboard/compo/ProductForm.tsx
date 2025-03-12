"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { getServerCookie } from "@/app/components/GetServerCookie";
import ProductTable from "./ProductTable";

interface ProductFormProps {
  onProductCreated: () => void;
}

interface Product {
  idProduct: number;
  brand: number;
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
  warranty: string;
  enabled: boolean; // Thêm trường enabled
}

interface BrandDTO {
  brandId: number;
  brandName: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductCreated }) => {
  const [product, setProduct] = useState<Product>({
    idProduct: 0,
    brand: 0,
    modelName: "",
    cpu: "",
    ram: "",
    ssd: "",
    gpu: "",
    screen: "",
    battery: "",
    price: 0,
    location: "",
    touchscreen: false,
    convertible: false,
    grade: "Like New", // Giá trị mặc định
    keyboardLed: false,
    numpad: false,
    fullFunction: true,
    notes: "Không có",
    imageUrl: "",
    warranty: "3 tháng tại cửa hàng",
    enabled: true, // Giá trị mặc định là true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<BrandDTO[]>([]);

  const imageInputRef = useRef<HTMLInputElement>(null);

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

    async function fetchBrands() {
      try {
        const response = await fetch("http://localhost:8080/api/brands/all");
        if (!response.ok) {
          throw new Error(`Failed to fetch brands: ${response.status}`);
        }
        const data: BrandDTO[] = await response.json();
        setBrands(data);
      } catch (e: any) {
        setError(e.message);
      }
    }

    fetchToken();
    fetchBrands();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;

    setProduct({
      ...product,
      [name]:
        type === "checkbox"
          ? checked
          : name === "brand"
          ? Number(value)
          : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Trim all string values in the product object
    const trimmedProduct: Product = {
      ...product,
      modelName: product.modelName.trim(),
      cpu: product.cpu.trim(),
      ram: product.ram.trim(),
      ssd: product.ssd.trim(),
      gpu: product.gpu.trim(),
      screen: product.screen.trim(),
      battery: product.battery.trim(),
      location: product.location.trim(),
      grade: product.grade.trim(),
      notes: product.notes.trim(),
      imageUrl: product.imageUrl.trim(),
      warranty: product.warranty.trim(),
    };

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(trimmedProduct)], { type: "application/json" })
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const endpoint = selectedProduct
        ? `http://localhost:8080/admin/api/products/${selectedProduct.idProduct}/update`
        : "http://localhost:8080/admin/api/products/add";

      const method = selectedProduct ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (Array.isArray(errorData)) {
          setError(errorData.join(", "));
        } else {
          throw new Error(
            `Failed to ${method === "PUT" ? "update" : "create"} product: ${
              response.status
            }`
          );
        }
        return;
      }

      const responseData: Product = await response.json();

      onProductCreated();

      scrollToTop();

      setProduct({
        idProduct: 0,
        brand: 0,
        modelName: "",
        cpu: "",
        ram: "",
        ssd: "",
        gpu: "",
        screen: "",
        battery: "",
        price: 0,
        location: "",
        touchscreen: false,
        convertible: false,
        grade: "Like New",
        keyboardLed: false,
        numpad: false,
        fullFunction: true,
        notes: "Không có",
        imageUrl: "",
        warranty: "3 tháng tại cửa hàng",
        enabled: true, // Reset enabled về true
      });
      setImageFile(null);
      setSelectedProduct(null);
      setImagePreviewUrl(null);

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    setProduct(product);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row p-1">
        {/* Product Table */}
        <div className="w-full md:w-3/5 p-1">
          <ProductTable
            apiUrl="http://localhost:8080/api/products/all"
            onProductSelect={handleProductSelect}
          />
        </div>

        {/* Product Form */}
        <div className="w-full md:w-2/5 p-1">
          <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
                {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                {/* Brand */}
                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Thương hiệu
                  </label>
                  <div className="mt-1">
                    <select
                      id="brand"
                      name="brand"
                      value={product.brand}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    >
                      <option value="">Chọn thương hiệu</option>
                      {brands.map((brand) => (
                        <option key={brand.brandId} value={brand.brandId}>
                          {brand.brandName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Model Name */}
                <div>
                  <label
                    htmlFor="modelName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tên sản phẩm
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="modelName"
                      name="modelName"
                      value={product.modelName}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* CPU */}
                <div>
                  <label
                    htmlFor="cpu"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPU
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="cpu"
                      name="cpu"
                      value={product.cpu}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* RAM */}
                <div>
                  <label
                    htmlFor="ram"
                    className="block text-sm font-medium text-gray-700"
                  >
                    RAM
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="ram"
                      name="ram"
                      value={product.ram}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* SSD */}
                <div>
                  <label
                    htmlFor="ssd"
                    className="block text-sm font-medium text-gray-700"
                  >
                    SSD
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="ssd"
                      name="ssd"
                      value={product.ssd}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* GPU */}
                <div>
                  <label
                    htmlFor="gpu"
                    className="block text-sm font-medium text-gray-700"
                  >
                    GPU
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="gpu"
                      name="gpu"
                      value={product.gpu}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* Screen */}
                <div>
                  <label
                    htmlFor="screen"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Màn hình
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="screen"
                      name="screen"
                      value={product.screen}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* Battery */}
                <div>
                  <label
                    htmlFor="battery"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pin
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="battery"
                      name="battery"
                      value={product.battery}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Giá
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Địa chỉ
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={product.location}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* Warranty */}
                <div>
                  <label
                    htmlFor="warranty"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bảo hành
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="warranty"
                      name="warranty"
                      value={product.warranty}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* Grade */}
                <div>
                  <label
                    htmlFor="grade"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ngoại hình
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="grade"
                      name="grade"
                      value={product.grade}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="touchscreen" className="flex items-center">
                      <input
                        type="checkbox"
                        id="touchscreen"
                        name="touchscreen"
                        checked={product.touchscreen}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        Cảm ứng
                      </span>
                    </label>

                    <label htmlFor="convertible" className="flex items-center">
                      <input
                        type="checkbox"
                        id="convertible"
                        name="convertible"
                        checked={product.convertible}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        Xoay gập
                      </span>
                    </label>

                    <label htmlFor="keyboardLed" className="flex items-center">
                      <input
                        type="checkbox"
                        id="keyboardLed"
                        name="keyboardLed"
                        checked={product.keyboardLed}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        LED Phím
                      </span>
                    </label>

                    <label htmlFor="numpad" className="flex items-center">
                      <input
                        type="checkbox"
                        id="numpad"
                        name="numpad"
                        checked={product.numpad}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        Numpad
                      </span>
                    </label>

                    <label htmlFor="fullFunction" className="flex items-center">
                      <input
                        type="checkbox"
                        id="fullFunction"
                        name="fullFunction"
                        checked={product.fullFunction}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        Full chức năng
                      </span>
                    </label>

                    {/* Enabled */}
                    <label htmlFor="enabled" className="flex items-center">
                      <input
                        type="checkbox"
                        id="enabled"
                        name="enabled"
                        checked={product.enabled}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        Còn hàng
                      </span>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ghi chú
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notes"
                      name="notes"
                      value={product.notes}
                      onChange={handleChange}
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label
                    htmlFor="imageUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    URL hình ảnh
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      value={product.imageUrl}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tải lên hình ảnh
                  </label>
                  <div className="mt-1">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                      ref={imageInputRef}
                    />
                  </div>
                </div>

                {/* Image Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hình ảnh xem trước
                  </label>
                  {imagePreviewUrl && (
                    <img
                      src={imagePreviewUrl}
                      alt="Ảnh xem trước"
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {loading
                      ? "Đang xử lý..."
                      : selectedProduct
                      ? "Cập nhật sản phẩm"
                      : "Thêm sản phẩm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import Cookies from "js-cookie";
// import { getServerCookie } from "@/app/components/GetServerCookie";
// import ProductTable from "./ProductTable";

// interface ProductFormProps {
//   onProductCreated: () => void;
// }

// interface Product {
//   idProduct: number;
//   brand: string;
//   modelName: string;
//   cpu: string;
//   ram: string;
//   ssd: string;
//   gpu: string;
//   screen: string;
//   battery: string;
//   price: number;
//   location: string;
//   touchscreen: boolean;
//   convertible: boolean;
//   grade: string;
//   keyboardLed: boolean;
//   numpad: boolean;
//   fullFunction: boolean;
//   notes: string;
//   imageUrl: string;
//   warranty: string;
// }

// const ProductForm: React.FC<ProductFormProps> = ({ onProductCreated }) => {
//   const [product, setProduct] = useState<Product>({
//     idProduct: 0,
//     brand: "",
//     modelName: "",
//     cpu: "",
//     ram: "",
//     ssd: "",
//     gpu: "",
//     screen: "",
//     battery: "",
//     price: 0,
//     location: "",
//     touchscreen: false,
//     convertible: false,
//     grade: "Like New", // Giá trị mặc định
//     keyboardLed: false,
//     numpad: false,
//     fullFunction: true,
//     notes: "Không có",
//     imageUrl: "",
//     warranty: "3 tháng tại cửa hàng",
//   });

//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // Thêm state này
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//   const imageInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     async function fetchToken() {
//       const serverToken = await getServerCookie("jwtToken");
//       if (serverToken) {
//         setToken(serverToken);
//       } else {
//         const storedToken = Cookies.get("jwtToken");
//         setToken(storedToken || null);
//       }
//     }

//     fetchToken();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value, type, checked } = e.target;
//     setProduct({
//       ...product,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setImageFile(file || null);

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreviewUrl(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setImagePreviewUrl(null);
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // Trim all string values in the product object
//     const trimmedProduct: Product = {
//       ...product,
//       brand: product.brand.trim(),
//       modelName: product.modelName.trim(),
//       cpu: product.cpu.trim(),
//       ram: product.ram.trim(),
//       ssd: product.ssd.trim(),
//       gpu: product.gpu.trim(),
//       screen: product.screen.trim(),
//       battery: product.battery.trim(),
//       location: product.location.trim(),
//       grade: product.grade.trim(),
//       notes: product.notes.trim(),
//       imageUrl: product.imageUrl.trim(),
//       warranty: product.warranty.trim(),
//     };

//     const formData = new FormData();
//     formData.append(
//       "product",
//       new Blob([JSON.stringify(trimmedProduct)], { type: "application/json" })
//     );

//     if (imageFile) {
//       formData.append("image", imageFile);
//     }

//     try {
//       if (!token) {
//         throw new Error("Authentication token not found.");
//       }

//       const endpoint = selectedProduct
//         ? `http://localhost:8080/admin/api/products/${selectedProduct.idProduct}/update`
//         : "http://localhost:8080/admin/api/products/add";

//       const method = selectedProduct ? "PUT" : "POST";

//       const response = await fetch(endpoint, {
//         method: method,
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (Array.isArray(errorData)) {
//           setError(errorData.join(", "));
//         } else {
//           throw new Error(
//             `Failed to ${method === "PUT" ? "update" : "create"} product: ${
//               response.status
//             }`
//           );
//         }
//         return;
//       }

//       const responseData: Product = await response.json();

//       onProductCreated();

//       scrollToTop();

//       setProduct({
//         idProduct: 0,
//         brand: "",
//         modelName: "",
//         cpu: "",
//         ram: "",
//         ssd: "",
//         gpu: "",
//         screen: "",
//         battery: "",
//         price: 0,
//         location: "",
//         touchscreen: false,
//         convertible: false,
//         grade: "Like New", // Reset to default
//         keyboardLed: false,
//         numpad: false,
//         fullFunction: true,
//         notes: "Không có",
//         imageUrl: "",
//         warranty: "3 tháng tại cửa hàng",
//       });
//       setImageFile(null);
//       setSelectedProduct(null);
//       setImagePreviewUrl(null); // Thêm dòng này

//       if (imageInputRef.current) {
//         imageInputRef.current.value = "";
//       }
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProductSelect = useCallback((product: Product) => {
//     setSelectedProduct(product);
//     setProduct(product);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="flex flex-col md:flex-row p-1">
//         {/* Bảng danh sách sản phẩm */}
//         <div className="w-full md:w-3/5 p-1">
//           <ProductTable
//             apiUrl="http://localhost:8080/api/products/all"
//             onProductSelect={handleProductSelect}
//           />
//         </div>

//         {/* Form thêm sản phẩm */}
//         <div className="w-full md:w-2/5 p-1">
//           <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
//             <div className="px-8 py-10">
//               <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
//                 {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
//               </h2>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {error && (
//                   <div
//                     className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
//                     role="alert"
//                   >
//                     <span className="block sm:inline">{error}</span>
//                   </div>
//                 )}

//                 <div>
//                   <label
//                     htmlFor="brand"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Thương hiệu
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="brand"
//                       name="brand"
//                       value={product.brand}
//                       onChange={handleChange}
//                       required
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="modelName"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Tên sản phẩm
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="modelName"
//                       name="modelName"
//                       value={product.modelName}
//                       onChange={handleChange}
//                       required
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="cpu"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     CPU
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="cpu"
//                       name="cpu"
//                       value={product.cpu}
//                       onChange={handleChange}
//                       required
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="ram"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     RAM
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="ram"
//                       name="ram"
//                       value={product.ram}
//                       onChange={handleChange}
//                       required
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="ssd"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     SSD
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="ssd"
//                       name="ssd"
//                       value={product.ssd}
//                       onChange={handleChange}
//                       required
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="gpu"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     GPU
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="gpu"
//                       name="gpu"
//                       value={product.gpu}
//                       onChange={handleChange}
//                       required
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="screen"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Màn hình
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="screen"
//                       name="screen"
//                       value={product.screen}
//                       onChange={handleChange}
//                       required
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="battery"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Pin
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="battery"
//                       name="battery"
//                       value={product.battery}
//                       onChange={handleChange}
//                       required
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="price"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Giá
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="number"
//                       id="price"
//                       name="price"
//                       value={product.price}
//                       onChange={handleChange}
//                       required
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="location"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Địa chỉ
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="location"
//                       name="location"
//                       value={product.location}
//                       onChange={handleChange}
//                       required
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="warranty"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Bảo hành
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="warranty"
//                       name="warranty"
//                       value={product.warranty}
//                       onChange={handleChange}
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 {/* Ngoại hình */}
//                 <div>
//                   <label
//                     htmlFor="grade"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Ngoại hình
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="grade"
//                       name="grade"
//                       value={product.grade}
//                       onChange={handleChange}
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 {/* Checkbox bố trí dọc */}
//                 <div>
//                   <div className="flex flex-col space-y-3">
//                     <label htmlFor="touchscreen" className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id="touchscreen"
//                         name="touchscreen"
//                         checked={product.touchscreen}
//                         onChange={handleChange}
//                         className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
//                       />
//                       <span className="text-sm text-gray-700 font-medium">
//                         Cảm ứng
//                       </span>
//                     </label>

//                     <label htmlFor="convertible" className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id="convertible"
//                         name="convertible"
//                         checked={product.convertible}
//                         onChange={handleChange}
//                         className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
//                       />
//                       <span className="text-sm text-gray-700 font-medium">
//                         Xoay gập
//                       </span>
//                     </label>

//                     <label htmlFor="keyboardLed" className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id="keyboardLed"
//                         name="keyboardLed"
//                         checked={product.keyboardLed}
//                         onChange={handleChange}
//                         className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
//                       />
//                       <span className="text-sm text-gray-700 font-medium">
//                         LED Phím
//                       </span>
//                     </label>

//                     <label htmlFor="numpad" className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id="numpad"
//                         name="numpad"
//                         checked={product.numpad}
//                         onChange={handleChange}
//                         className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
//                       />
//                       <span className="text-sm text-gray-700 font-medium">
//                         Numpad
//                       </span>
//                     </label>

//                     <label htmlFor="fullFunction" className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id="fullFunction"
//                         name="fullFunction"
//                         checked={product.fullFunction}
//                         onChange={handleChange}
//                         className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm rounded mr-2"
//                       />
//                       <span className="text-sm text-gray-700 font-medium">
//                         Full chức năng
//                       </span>
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="notes"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Ghi chú
//                   </label>
//                   <div className="mt-1">
//                     <textarea
//                       id="notes"
//                       name="notes"
//                       value={product.notes}
//                       onChange={handleChange}
//                       rows={3}
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="imageUrl"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     URL hình ảnh
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="text"
//                       id="imageUrl"
//                       name="imageUrl"
//                       value={product.imageUrl}
//                       onChange={handleChange}
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="image"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Tải lên hình ảnh
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       type="file"
//                       id="image"
//                       name="image"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//                       ref={imageInputRef}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Hình ảnh xem trước
//                   </label>
//                   {imagePreviewUrl && (
//                     <img
//                       src={imagePreviewUrl}
//                       alt="Ảnh xem trước"
//                       className="mt-2 w-32 h-32 object-cover rounded"
//                     />
//                   )}
//                 </div>

//                 <div>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
//                   >
//                     {loading
//                       ? "Đang xử lý..."
//                       : selectedProduct
//                       ? "Cập nhật sản phẩm"
//                       : "Thêm sản phẩm"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;
