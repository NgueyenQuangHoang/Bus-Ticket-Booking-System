import { Add, Close, Business, Image as ImageIcon, Wallpaper, Description, Map, Save, RestartAlt, LocationOn } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, MenuItem, Modal, TextField, Typography } from '@mui/material'
import { useState, type ChangeEvent } from 'react';
import type { Station } from '../../../../../types'; // Sử dụng interface Station bạn cung cấp

const modalStyle = {
    position: 'absolute',
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

export default function StationFormModal() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Khởi tạo state dựa trên Interface Station
    const [formData, setFormData] = useState<Partial<Station>>({
        station_name: '',
        city_id: 0,
        image: '',
        wallpaper: '',
        description: '',
        location: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // city_id cần ép kiểu về number
        setFormData(prev => ({
            ...prev,
            [name]: name === 'city_id' ? Number(value) : value
        }));
    };

    const handleReset = () => {
        setFormData({
            station_name: '',
            city_id: 0,
            image: '',
            wallpaper: '',
            description: '',
            location: ''
        });
    };

    const handleSubmit = () => {
        console.log("Dữ liệu Ga tàu:", formData);
        // Logic API ở đây
        handleClose();
    };

    return (
        <div className='flex justify-between items-center mb-6'>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Bến xe</h1>
                <p className="text-gray-500 text-sm">Danh sách các Bến xe</p>
            </div>

            <Button
                variant="contained"
                startIcon={<Add />}
                className="bg-blue-600 hover:bg-blue-700 capitalize rounded-lg px-4 py-2 shadow-none"
                onClick={handleOpen}
            >
                Thêm bến xe
            </Button>

            <Modal open={open} onClose={handleClose} aria-labelledby="station-modal-title">
                <Box sx={modalStyle}>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <Typography id="station-modal-title" variant="h6" className="font-bold text-gray-800">
                            Thêm bến xe Mới
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <Close fontSize="small" />
                        </IconButton>
                    </div>

                    <Divider className="mb-6" />

                    {/* Form Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

                        {/* Tên bến xe */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Business fontSize="small" className="text-blue-500" />
                                Tên bến xe *
                            </label>
                            <TextField
                                fullWidth
                                size="small"
                                name="station_name"
                                placeholder="Vd: Ga Sài Gòn"
                                value={formData.station_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Thuộc thành phố */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Map fontSize="small" className="text-blue-500" />
                                Thành phố *
                            </label>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                name="city_id"
                                value={formData.city_id}
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Chọn thành phố</MenuItem>
                                <MenuItem value={1}>TP. Hồ Chí Minh</MenuItem>
                                <MenuItem value={2}>Hà Nội</MenuItem>
                                <MenuItem value={3}>Đà Nẵng</MenuItem>
                            </TextField>
                        </div>

                        {/* Hình ảnh ga */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <ImageIcon fontSize="small" className="text-blue-500" />
                                Link ảnh đại diện
                            </label>
                            <TextField
                                fullWidth
                                size="small"
                                name="image"
                                placeholder="URL hình ảnh"
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Ảnh nền wallpaper */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Wallpaper fontSize="small" className="text-blue-500" />
                                Link ảnh nền (Wallpaper)
                            </label>
                            <TextField
                                fullWidth
                                size="small"
                                name="wallpaper"
                                placeholder="URL ảnh nền"
                                value={formData.wallpaper}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Vị trí cụ thể */}
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <LocationOn fontSize="small" className="text-red-500" />
                                Địa chỉ / Vị trí
                            </label>
                            <TextField
                                fullWidth
                                size="small"
                                name="location"
                                placeholder="Vd: 01 Nguyễn Thông, Phường 9, Quận 3..."
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Mô tả */}
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Description fontSize="small" className="text-gray-500" />
                                Mô tả bến xe
                            </label>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Nhập thông tin giới thiệu về bến xe..."
                            />
                        </div>
                    </div>

                    <Divider className="mb-4" />

                    {/* Footer Actions */}
                    <div className="flex justify-end items-center gap-3">
                        <Button
                            startIcon={<RestartAlt />}
                            onClick={handleReset}
                            className="text-gray-500 font-bold normal-case px-4 hover:bg-gray-100"
                        >
                            Làm mới
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSubmit}
                            disabled={!formData.station_name || !formData.city_id}
                            className="bg-blue-600 hover:bg-blue-700 shadow-none px-8 py-2 rounded-lg font-bold normal-case text-white"
                        >
                            Lưu bến xe
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}