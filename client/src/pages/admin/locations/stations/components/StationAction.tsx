import { Delete, Edit, Close, LocationOn, Save } from '@mui/icons-material';
import { IconButton, Modal, Box, Typography, Divider, TextField, MenuItem, Button, InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import { useState, type ChangeEvent, useMemo } from 'react';
import type { City, Station } from '../../../../../types';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { busImageService } from '../../../../../services/admin/busImageService';
import { Image as ImageIcon } from '@mui/icons-material';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 700 },
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    outline: 'none',
    maxHeight: '90vh',
    overflowY: 'auto'
};

interface PropType {
    station: Station
    onDelete: (station: Station) => void
    onEdit: (station: Station) => void
    cities: City[]
}

export default function StationAction({ station, onDelete, onEdit, cities }: PropType) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(station);

    // Cấu hình Toolbar cho ReactQuill
    // Sử dụng useMemo để tránh re-render không cần thiết làm mất focus khi gõ
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],        // Định dạng chữ
            [{ 'color': [] }, { 'background': [] }],          // Màu chữ, màu nền
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],    // Danh sách
            [{ 'align': [] }],                                // Căn lề
            ['link', 'image', 'video'],                       // Chèn link, ảnh, video
            ['clean']                                         // Xóa định dạng
        ],
    }), []);

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'bullet', 'align',
        'link', 'image', 'video'
    ];

    const handleOpen = () => {
        setFormData(station); // Reset data về ban đầu khi mở modal
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Image State
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();

    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleDeleteClick = () => {
        Swal.fire({
            title: "Xác nhận xóa?",
            text: `Bạn có chắc chắn muốn xóa ga ${station.station_name} cùng với các tuyến đường của các nhà ga này chứ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete(station)
                Swal.fire("Đã xóa!", "Dữ liệu đã được cập nhật.", "success");
            }
        });
    };

    const handleSave = async () => {
        try {
            const submitData = { ...formData };
            if (thumbnailFile) {
                const url = await busImageService.uploadFileToCloudinary(thumbnailFile);
                submitData.image = url;
                submitData.wallpaper = url; // Use same image for both per requirement
            }

            onEdit(submitData);
            Swal.fire("Thành công", "Đã cập nhật thông tin nhà ga", "success");
            handleClose();
        } catch (error) {
            console.error("Update station failed", error);
            Swal.fire("Lỗi", "Cập nhật thất bại", "error");
        }
    };

    return (
        <>
            {/* Nhóm các nút hành động */}
            <IconButton size="small" className="text-green-500 hover:bg-green-50 mr-2" onClick={handleOpen}>
                <Edit fontSize="small" />
            </IconButton>

            <IconButton size="small" className="text-red-500 hover:bg-red-50" onClick={handleDeleteClick}>
                <Delete fontSize="small" />
            </IconButton>

            {/* Modal chỉnh sửa */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6" className="font-bold text-gray-800">
                            Chỉnh sửa nhà ga
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <Close fontSize="small" />
                        </IconButton>
                    </div>

                    <Divider className="mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Tên nhà ga</label>
                            <TextField
                                fullWidth size="small" name="station_name"
                                value={formData.station_name} onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Thành phố</label>
                            <TextField
                                select fullWidth size="small" name="city_id"
                                value={formData.city_id} onChange={handleChange}
                            >
                                {cities.map((item) => (
                                    <MenuItem value={item.id} key={item.id}>{item.city_name}</MenuItem>
                                ))}
                            </TextField>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Địa chỉ cụ thể</label>
                            <TextField
                                fullWidth size="small" name="location"
                                value={formData.location} onChange={handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn fontSize="small" className="text-red-400" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                           <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <ImageIcon className="text-[16px] text-blue-500" /> Hình ảnh nhà ga (Đại diện & Nền)
                            </label>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-32 h-24 border border-gray-300 rounded overflow-hidden flex items-center justify-center bg-gray-50">
                                {thumbnailPreview || formData.image ? (
                                    <img 
                                    src={thumbnailPreview || formData.image} 
                                    alt="thumbnail" 
                                    className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <span className="text-gray-400 text-xs">Chưa có ảnh</span>
                                )}
                                </div>
                                <div>
                                    <label className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded cursor-pointer hover:bg-blue-100 transition text-sm font-medium">
                                        Thay đổi ảnh
                                        <input 
                                        type="file" 
                                        accept="image/*" 
                                        hidden 
                                        onChange={handleThumbnailChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Mô tả chi tiết</label>
                            <div className="bg-white">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(content) => {
                                        setFormData(prev => ({ ...prev, description: content }));
                                    }}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Nhập mô tả về nhà ga..."
                                    style={{ height: '200px', marginBottom: '50px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CSS Custom để giới hạn ảnh trong editor */}
                    <style>{`
                        .ql-editor img {
                            max-width: 100%;
                            height: auto;
                            border-radius: 8px;
                        }
                        .ql-container {
                            border-bottom-left-radius: 8px;
                            border-bottom-right-radius: 8px;
                        }
                        .ql-toolbar {
                            border-top-left-radius: 8px;
                            border-top-right-radius: 8px;
                        }
                    `}</style>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={handleClose} className="text-gray-500 font-bold">Hủy</Button>
                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 shadow-none normal-case px-6"
                        >
                            Cập nhật dữ liệu
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}