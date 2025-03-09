export default function Footer() {
  return (
    <footer className="bg-[#ffffff] text-center py-4 mt-8">
      <p className="text-gray-600">
        © {new Date().getFullYear()} My Website. All rights reserved.
      </p>
    </footer>
  );
}
