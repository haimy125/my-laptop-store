export default function Footer() {
  const phoneNumber = "0976540201"; // Để dễ dàng thay đổi sau này

  return (
    <footer className="bg-gray-100 text-center py-6 mt-8 border-t border-gray-200">
      <div className="text-gray-700">
        {/* Thêm dòng tuyển cộng tác viên */}
        <p className="mb-2 text-green-600 font-semibold">
          📢 Tuyển cộng tác viên bán laptop online! Chiết khấu hấp dẫn, làm việc
          tự do. Liên hệ:{" "}
          <a
            href={`tel:${phoneNumber}`}
            className="text-blue-500 hover:text-blue-700 transition duration-200"
          >
            {phoneNumber}
          </a>{" "}
          (Call/Zalo)
        </p>

        <p className="mb-1">
          Liên hệ:{" "}
          <a
            href={`tel:${phoneNumber}`}
            className="text-blue-500 hover:text-blue-700 transition duration-200"
          >
            {phoneNumber}
          </a>
        </p>
        <p className="mb-1">
          FB:{" "}
          <a
            href="https://www.facebook.com/ly.nhan.duyen.2024/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition duration-200"
          >
            LÝ NHÂN DUYÊN
          </a>
        </p>
        <p className="font-semibold mb-2">Địa chỉ:</p>
        <ul className="list-none leading-relaxed">
          <li>
            <span className="font-bold">Hà Nội:</span> 34 Ngõ 132 Khương Trung,
            Quận Thanh Xuân.
          </li>
          <li>
            <span className="font-bold">TP.HCM:</span> 58/3 Phạm Văn Chiêu
            Phường 8 Gò Vấp.
          </li>
          <li>
            <span className="font-bold">TP.Thủ Đức:</span> 43 Đường Số 3 Phường
            Linh Xuân.
          </li>
        </ul>
      </div>
      <p className="text-sm mt-4 text-gray-500">
        © {new Date().getFullYear()} MPH Website. All rights reserved.
      </p>
    </footer>
  );
}
