import { Delete, Edit, Close, LocationOn, AttachMoney, AccessTime, Straighten, Description, Save } from '@mui/icons-material';
import { IconButton, Modal, Box, Typography, Divider, TextField, MenuItem, Button, InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import { useMemo, useState, type ChangeEvent } from 'react';
import { useAppDispatch } from '../../../../../hooks';
import { removeRoute, updateRoutes } from '../../../../../slices/routesSlice';
import type { Route } from '../../../../../types';
import ReactQuill from 'react-quill-new';



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

interface PropType {
    id: string,
    route: Route,
    stations: { [key: string]: string }
}

export default function RouteAction({ id, route, stations }: PropType) {
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
    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Route>(route);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Các trường ID, Giá, Thời gian, Khoảng cách cần lưu dạng số
        const listNumberName = ['base_price', 'duration', 'distance', 'total_bookings']
        setFormData(prev => {
            return {
                ...prev,
                [name]: listNumberName.includes(name) ? Number(value) : value
            }
        });
    };

    const handleDeleteClick = () => {
        Swal.fire({
            title: "Xác nhận xóa?",
            text: `Bạn muốn xóa tuyến đường ID: ${formData.id}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
            reverseButtons: true
        }).then((result) => {
            // delete theo id
            dispatch(removeRoute(id))
            if (result.isConfirmed) {
                Swal.fire("Đã xóa!", "Tuyến đường đã được loại bỏ.", "success");
            }
        });
    };

    const handleSave = () => {
        dispatch(updateRoutes(formData))
        Swal.fire({
            // change data
            title: "Thành công",
            text: "Thông tin tuyến đường đã được cập nhật",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });
        handleClose();
    };
    console.log(route);

    return (
        <>
            {/* Nút Edit & Delete */}
            <IconButton size="small" className="text-green-500 hover:bg-green-50 mr-2" onClick={handleOpen}>
                <Edit fontSize="small" />
            </IconButton>

            <IconButton size="small" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteClick()}>
                <Delete fontSize="small" />
            </IconButton>

            {/* Modal chỉnh sửa tuyến đường */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6" className="font-bold text-gray-800">
                            Chỉnh sửa tuyến đường
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <Close fontSize="small" />
                        </IconButton>
                    </div>

                    <Divider className="mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        {/* Ga đi */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <LocationOn className="text-red-500 text-[16px]" /> Ga khởi hành
                            </label>
                            <TextField
                                select fullWidth size="small" name="departure_station_id"
                                value={formData.departure_station_id}
                                onChange={handleChange}
                            >
                                {Object.entries(stations).map(([id, name]) => (
                                    <MenuItem key={id} value={id}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>

                        {/* Ga đến */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <LocationOn className="text-green-500 text-[16px]" /> Ga kết thúc
                            </label>
                            <TextField
                                select fullWidth size="small" name="arrival_station_id"
                                value={formData.arrival_station_id} onChange={handleChange}
                            >
                                {Object.entries(stations).map(([id, name]) => (
                                    <MenuItem key={id} value={id}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>

                        {/* Giá cơ bản */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <AttachMoney className="text-amber-500 text-[16px]" /> Giá vé gốc
                            </label>
                            <TextField
                                fullWidth size="small" type="number" name="base_price"
                                value={formData.base_price} onChange={handleChange}
                                InputProps={{ endAdornment: <InputAdornment position="end">VNĐ</InputAdornment> }}
                            />
                        </div>

                        {/* Thời gian */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <AccessTime className="text-blue-500 text-[16px]" /> Thời gian di chuyển
                            </label>
                            <TextField
                                fullWidth size="small" type="number" name="duration"
                                value={formData.duration} onChange={handleChange}
                                InputProps={{ endAdornment: <InputAdornment position="end">Phút</InputAdornment> }}
                            />
                        </div>

                        {/* Khoảng cách */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <Straighten className="text-purple-500 text-[16px]" /> Khoảng cách
                            </label>
                            <TextField
                                fullWidth size="small" type="number" name="distance"
                                value={formData.distance} onChange={handleChange}
                                InputProps={{ endAdornment: <InputAdornment position="end">Km</InputAdornment> }}
                            />
                        </div>

                        {/* Mô tả */}
                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <Description className="text-gray-500 text-[16px]" /> Ghi chú tuyến đường
                            </label>
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

                    <div className="flex justify-end gap-2">
                        <Button onClick={handleClose} className="text-gray-500 font-bold capitalize">Hủy bỏ</Button>
                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 shadow-none normal-case px-6 rounded-lg font-bold"
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}