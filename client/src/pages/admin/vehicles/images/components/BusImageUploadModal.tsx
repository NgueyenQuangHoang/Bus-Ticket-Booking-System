import { useState } from "react";
<<<<<<< HEAD
import { busImageService } from "../../../../../services/admin/busImageService";
import Swal from "sweetalert2";
=======
import { v4 as uuidv4 } from 'uuid';
>>>>>>> ec55d9fa056b5758a6cc8cdbbbd5933c8ebd5e47

type ImageItem = {
  id: string;
  file: File;
  preview: string;
  isThumbnail?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  busId: string | number;
  onUploadSuccess: () => void;
};

export default function BusImageUploadModal({
  open,
  onClose,
  busId,
  onUploadSuccess
}: Props) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  const handleAddImage = (file: File) => {
    const newImage: ImageItem = {
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      isThumbnail: images.length === 0,
    };

    setImages((prev) => [...prev, newImage]);
  };

  const setThumbnail = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isThumbnail: img.id === id,
      }))
    );
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-2xl bg-gray-100 text-gray-800 rounded-xl border border-gray-300 shadow-xl">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-300">
          <h2 className="font-semibold text-sm uppercase tracking-wide">
            Thêm hình ảnh cho xe ID: <span className="text-blue-600">{busId}</span>
          </h2>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 space-y-5 text-sm">
          {/* Upload */}
          <label className="inline-block cursor-pointer text-blue-600 font-medium">
            [+ Tải ảnh lên]
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleAddImage(e.target.files[0]);
                }
              }}
            />
          </label>

          {/* GRID IMAGES */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="
                  relative border border-dashed border-gray-400
                  bg-white
                  rounded-lg p-2 flex flex-col items-center
                  text-xs
                "
              >
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-24 object-cover rounded"
                />

                {img.isThumbnail && (
                  <span className="absolute top-1 left-1 text-yellow-500 text-xs">
                    ★ Thumbnail
                  </span>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setThumbnail(img.id)}
                    className="text-yellow-600 hover:underline"
                  >
                    Đặt đại diện
                  </button>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}

            {/* PLACEHOLDER */}
            {images.length < 5 &&
              Array.from({ length: 5 - images.length }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="
                      border border-dashed border-gray-400
                      bg-white
                      rounded-lg h-32 flex items-center justify-center
                      text-gray-400 text-xs
                    "
                  >
                    Ảnh {images.length + i + 1}
                  </div>
                )
              )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-300">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400 mr-2"
          >
            Đóng
          </button>
           <button
            disabled={uploading || images.length === 0}
            onClick={async () => {
                try {
                    setUploading(true);
                    // Mock upload by sending data URL or just validation
                    // Real implementation would involve uploading file to storage
                    for (const img of images) {
                         // Pass validation/URL to service
                         await busImageService.uploadBusImage(busId, "https://via.placeholder.com/150");
                    }
                     Swal.fire("Thành công", "Đã tải ảnh lên", "success");
                     onUploadSuccess();
                     setImages([]);
                     onClose();
                } catch (error) {
                     console.error(error);
                     Swal.fire("Lỗi", "Tải ảnh thất bại", "error");
                } finally {
                    setUploading(false);
                }
            }}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Đang tải..." : "Lưu ảnh"}
          </button>
        </div>
      </div>
    </div>
  );
}
