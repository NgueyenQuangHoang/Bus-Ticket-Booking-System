import { Add, Close } from '@mui/icons-material'
import {
    Box, Button, MenuItem, Modal, TextField,
    Typography, InputAdornment, Divider, IconButton
} from '@mui/material'
import { useState, type ChangeEvent } from 'react';
import {
    Business,
    Map,
    Image as ImageIcon,
    Save,
    RestartAlt,
    Description
} from '@mui/icons-material';
import type { City } from '../../../../../types';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { cityService } from '../../../../../services/cityService';
import { v4 as uuidv4 } from "uuid";

// Style cho Modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 700 },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
    outline: 'none'
};

export default function CityFormModal({ numberCities, updateCitiesOnAdd }: { numberCities: number, updateCitiesOnAdd : (city: City) => void}) {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    // Khởi tạo state
    const [formData, setFormData] = useState<City>({
        id: uuidv4(),
        city_name: '',
        region: '',
        image_city: '',
        description: ''
    });
    // Lưu ý: Sửa lỗi chính tả tên biến desciption -> description cho chuẩn

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFormData({
            id: formData.id,
            city_name: '',
            region: '',
            image_city: '',
            description: ''
        });
    };

    const handleSubmit = () => {
        // Gộp description vào formData khi gửi đi
        updateCitiesOnAdd(formData);
        cityService.createCity(formData)
        console.log("Dữ liệu gửi đi:", formData);
        handleClose();
    };

    // --- CẤU HÌNH TOOLBAR ---
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['image'], // <--- Thêm nút Image vào đây
            ['clean']
        ],
    };

    // --- CẤU HÌNH FORMATS (Để editor hiểu thẻ img) ---
    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video' // <--- Cho phép định dạng image
    ];
    
    return (
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý thành phố</h1>
                <p className="text-gray-500 text-sm">{numberCities} thành phố</p>
            </div>
            <Button
                variant="contained"
                startIcon={<Add />}
                className="bg-blue-600 hover:bg-blue-700 capitalize rounded-lg px-4 py-2 shadow-none"
                onClick={handleOpen}
            >
                Thêm thành phố
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
            >
                <Box sx={modalStyle}>
                    <div className="flex justify-between items-center mb-4">
                        <Typography id="modal-title" variant="h6" className="font-bold text-gray-800">
                            Thêm Thành Phố Mới
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <Close fontSize="small" />
                        </IconButton>
                    </div>

                    <Divider className="mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Tên Thành Phố */}
                        <div className="col-span-2 md:col-span-1 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Business fontSize="small" className="text-blue-500" />
                                Tên thành phố <span className="text-red-500">*</span>
                            </label>
                            <TextField
                                fullWidth
                                name="city_name"
                                value={formData.city_name}
                                onChange={handleChange}
                                placeholder="Vd: TP. Hồ Chí Minh"
                                variant="outlined"
                                size="small"
                                required
                            />
                        </div>

                        {/* Vùng Miền */}
                        <div className="col-span-2 md:col-span-1 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Map fontSize="small" className="text-blue-500" />
                                Vùng miền
                            </label>
                            <TextField
                                select
                                fullWidth
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                            >
                                <MenuItem value="Bắc">Miền Bắc</MenuItem>
                                <MenuItem value="Trung">Miền Trung</MenuItem>
                                <MenuItem value="Nam">Miền Nam</MenuItem>
                            </TextField>
                        </div>

                        {/* Link Ảnh */}
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <ImageIcon fontSize="small" className="text-blue-500" />
                                Đường dẫn hình ảnh (URL)
                            </label>
                            <TextField
                                fullWidth
                                name="image_city"
                                value={formData.image_city}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <span className="text-xs text-gray-400 font-bold">URL</span>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>

                        {/* Description - React Quill New */}
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Description fontSize="small" className="text-blue-500" />
                                Mô tả chi tiết
                            </label>
                            <div className="bg-white rounded-md overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, description: e }));
                                    }} // Đã sửa gọn lại
                                    placeholder="Nhập mô tả về thành phố..."
                                    style={{ height: '200px', marginBottom: '50px' }} // Tăng chiều cao chút để dễ nhìn ảnh
                                    modules={modules} // Sử dụng biến modules đã khai báo
                                    formats={formats} // Sử dụng biến formats đã khai báo
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    {/* <Box
                        className="w-full h-32 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mb-6 transition-all"
                    >
                        {formData.image_city ? (
                            <img
                                src={formData.image_city}
                                alt="City preview"
                                className="w-full h-full object-cover shadow-inner"
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Link+Ảnh+Lỗi')}
                            />
                        ) : (
                            <div className="text-center">
                                <ImageIcon className="text-gray-300" sx={{ fontSize: 32 }} />
                                <Typography variant="caption" className="block text-gray-400 font-medium">
                                    XEM TRƯỚC HÌNH ẢNH
                                </Typography>
                            </div>
                        )}
                    </Box> */}

                    <Divider className="mb-4" />

                    <div className="flex justify-end items-center gap-3">
                        <Button
                            variant="text"
                            startIcon={<RestartAlt />}
                            onClick={handleReset}
                            className="text-gray-500 font-bold normal-case px-4 hover:bg-gray-100"
                        >
                            Làm mới
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            disabled={!formData.city_name}
                            onClick={handleSubmit}
                            className={`bg-blue-600 hover:bg-blue-700 shadow-none px-6 py-2 rounded-lg font-bold normal-case text-white`}
                        >
                            Xác nhận lưu
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}