import { Add, Close, LocationOn, AttachMoney, AccessTime, Straighten, Description, Save, RestartAlt } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, InputAdornment, MenuItem, Modal, TextField, Typography } from '@mui/material'
import { useState, type ChangeEvent } from 'react';
import type { Route } from '../../../../../types';

// Style cho thân Modal
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

export default function RouteFormModal() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Khởi tạo state dựa trên Interface Route
    const [formData, setFormData] = useState<Partial<Route>>({
        departure_station_id: 0,
        arrival_station_id: 0,
        base_price: 0,
        duration: 0,
        distance: 0,
        description: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Chuyển đổi giá trị sang số nếu là các trường ID hoặc định lượng
        const isNumber = ['departure_station_id', 'arrival_station_id', 'base_price', 'duration', 'distance'].includes(name);
        setFormData(prev => ({
            ...prev,
            [name]: isNumber ? Number(value) : value
        }));
    };

    const handleReset = () => {
        setFormData({
            departure_station_id: 0,
            arrival_station_id: 0,
            base_price: 0,
            duration: 0,
            distance: 0,
            description: ''
        });
    };

    const handleSubmit = () => {
        console.log("Dữ liệu Route:", formData);
        // Xử lý logic lưu dữ liệu tại đây
        handleClose();
    };

    return (
        <div className='flex justify-between items-center mb-6'>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý tuyến đường</h1>
                <p className="text-gray-500 text-sm">Hiện có 5 tuyến đường</p>
            </div>

            <Button
                variant="contained"
                startIcon={<Add />}
                className="bg-blue-600 hover:bg-blue-700 capitalize rounded-lg px-4 py-2 shadow-none"
                onClick={handleOpen}
            >
                Thêm tuyến đường
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="route-modal-title"
            >
                <Box sx={modalStyle}>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <Typography id="route-modal-title" variant="h6" className="font-bold text-gray-800">
                            Thiết Lập Tuyến Đường Mới
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <Close fontSize="small" />
                        </IconButton>
                    </div>

                    <Divider className="mb-6" />

                    {/* Form Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

                        {/* Ga đi */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <LocationOn fontSize="small" className="text-red-500" />
                                Ga khởi hành *
                            </label>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                name="departure_station_id"
                                value={formData.departure_station_id}
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Chọn ga đi</MenuItem>
                                <MenuItem value={1}>Ga Sài Gòn</MenuItem>
                                <MenuItem value={2}>Ga Hà Nội</MenuItem>
                            </TextField>
                        </div>

                        {/* Ga đến */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <LocationOn fontSize="small" className="text-green-500" />
                                Ga kết thúc *
                            </label>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                name="arrival_station_id"
                                value={formData.arrival_station_id}
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Chọn ga đến</MenuItem>
                                <MenuItem value={3}>Ga Đà Nẵng</MenuItem>
                                <MenuItem value={4}>Ga Huế</MenuItem>
                            </TextField>
                        </div>

                        {/* Giá cơ bản */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <AttachMoney fontSize="small" className="text-amber-500" />
                                Giá vé cơ bản
                            </label>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                name="base_price"
                                value={formData.base_price}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                                }}
                            />
                        </div>

                        {/* Thời gian */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <AccessTime fontSize="small" className="text-blue-500" />
                                Thời gian di chuyển
                            </label>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Phút</InputAdornment>,
                                }}
                            />
                        </div>

                        {/* Khoảng cách */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Straighten fontSize="small" className="text-purple-500" />
                                Khoảng cách
                            </label>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                name="distance"
                                value={formData.distance}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Km</InputAdornment>,
                                }}
                            />
                        </div>

                        {/* Mô tả */}
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Description fontSize="small" className="text-gray-500" />
                                Mô tả chi tiết
                            </label>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Nhập ghi chú cho tuyến đường..."
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
                            disabled={!formData.departure_station_id || !formData.arrival_station_id}
                            className="bg-blue-600 hover:bg-blue-700 shadow-none px-8 py-2 rounded-lg font-bold normal-case text-white"
                        >
                            Lưu tuyến đường
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}