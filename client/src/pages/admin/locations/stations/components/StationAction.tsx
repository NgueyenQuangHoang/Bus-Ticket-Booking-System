import { Delete, Edit, Close, LocationOn, Save } from '@mui/icons-material';
import { IconButton, Modal, Box, Typography, Divider, TextField, MenuItem, Button, InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import { useState, type ChangeEvent } from 'react';

// 1. Định nghĩa Interface trực tiếp
export interface Station {
    station_id: number;
    station_name: string;
    city_id: number;
    image?: string;
    wallpaper?: string;
    description?: string;
    location?: string;
}

// 2. Tạo dữ liệu giả duy nhất
const mockStation: Station = {
    station_id: 101,
    station_name: "Ga Sài Gòn",
    city_id: 1,
    image: "https://vcdn1-dulich.vnecdn.net/2021/03/26/ga-sai-gon-1-1616745054.jpg",
    wallpaper: "https://viettravel.com/wallpaper-ga.jpg",
    description: "Nhà ga quan trọng nhất của tuyến đường sắt Bắc Nam.",
    location: "01 Nguyễn Thông, Quận 3, TP.HCM"
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 650 },
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    outline: 'none',
    maxHeight: '90vh',
    overflowY: 'auto'
};

export default function StationAction() {
    // Quản lý đóng mở Modal
    const [open, setOpen] = useState(false);
    
    // State chứa dữ liệu form (mặc định lấy từ mockStation)
    const [formData, setFormData] = useState<Station>(mockStation);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'city_id' ? Number(value) : value
        }));
    };

    const handleDeleteClick = () => {
        Swal.fire({
            title: "Xác nhận xóa?",
            text: `Bạn có chắc chắn muốn xóa ga ${formData.station_name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Đã xóa!", "Dữ liệu đã được cập nhật.", "success");
            }
        });
    };

    const handleSave = () => {
        console.log("Dữ liệu sau khi sửa:", formData);
        Swal.fire("Thành công", "Đã cập nhật thông tin nhà ga", "success");
        handleClose();
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

            {/* Modal chỉnh sửa nằm trong cùng file */}
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
                                <MenuItem value={1}>TP. Hồ Chí Minh</MenuItem>
                                <MenuItem value={2}>Hà Nội</MenuItem>
                            </TextField>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Địa chỉ cụ thể</label>
                            <TextField 
                                fullWidth size="small" name="location"
                                value={formData.location} onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><LocationOn fontSize="small" className="text-red-400"/></InputAdornment>,
                                }}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Ảnh đại diện (URL)</label>
                            <TextField 
                                fullWidth size="small" name="image"
                                value={formData.image} onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Ảnh nền (URL)</label>
                            <TextField 
                                fullWidth size="small" name="wallpaper"
                                value={formData.wallpaper} onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Mô tả</label>
                            <TextField 
                                fullWidth multiline rows={3} name="description"
                                value={formData.description} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
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