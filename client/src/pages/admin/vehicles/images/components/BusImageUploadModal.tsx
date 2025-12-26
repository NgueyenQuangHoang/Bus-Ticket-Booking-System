import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  bus: string;
};

export default function BusImageUploadModal({
  open,
  onClose,
  bus,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!file) {
      setError("Vui lòng chọn hình ảnh");
      return;
    }

    console.log("UPLOAD IMAGE:", { bus, file });
    alert("Upload thành công (demo)");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-md rounded-xl border border-gray-300 shadow-xl">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-gray-300">
          <h2 className="font-semibold text-base">
            Tải ảnh xe
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {bus}
          </p>
        </div>

        {/* BODY */}
        <div className="px-5 py-4 space-y-3 text-sm">
          <label className="block text-gray-600">
            Chọn hình ảnh
          </label>
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setError("");
            }}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-300">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-sm"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
