import { Delete, Edit, Close, LocationOn, AttachMoney, AccessTime, Straighten, Description, Save } from '@mui/icons-material';
import { IconButton, Modal, Box, Typography, Divider, TextField, MenuItem, Button, InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import { useMemo, useState, type ChangeEvent } from 'react';
import { useAppDispatch } from '../../../../../hooks';
import { removeRoute, updateRoutes } from '../../../../../slices/routesSlice';
import type { Route } from '../../../../../types';
import ReactQuill from 'react-quill-new';
import { busImageService } from '../../../../../services/admin/busImageService';
import { Image as ImageIcon } from '@mui/icons-material';
import { useAppSelector } from '../../../../../hooks';
import { fetchCities } from '../../../../../slices/citySlice';
import { fetchStations } from '../../../../../slices/stationSlice';
import { useEffect } from 'react';



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
    route: Route
}

export default function RouteAction({ id, route }: PropType) {
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

    const dispatch = useAppDispatch();
    
    // Global State
    const { cities } = useAppSelector(state => state.city);
    const { stations } = useAppSelector(state => state.station);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Route>(route);

    // Cascading State
    const [selectedCityFrom, setSelectedCityFrom] = useState<string>('');
    const [selectedCityTo, setSelectedCityTo] = useState<string>('');

    // Pre-fill State when opening or route changes
    useEffect(() => {
        if (open) {
            // Calculate initial cities based on stations
            const stationFrom = stations.find(s => s.id === route.departure_station_id);
            const stationTo = stations.find(s => s.id === route.arrival_station_id);

            if (stationFrom) setSelectedCityFrom(String(stationFrom.city_id));
            if (stationTo) setSelectedCityTo(String(stationTo.city_id));
            
            setFormData(route); // Reset form data
             setThumbnailPreview(route.image || ""); // Reset Image Preview
        }
    }, [open, route, stations]);

    // Derived Stations based on Cities
    const stationsFrom = useMemo(() => stations.filter(s => String(s.city_id) === String(selectedCityFrom)), [stations, selectedCityFrom]);
    const stationsTo = useMemo(() => stations.filter(s => String(s.city_id) === String(selectedCityTo)), [stations, selectedCityTo]);


    const handleOpen = () => {
        setOpen(true);
        dispatch(fetchCities());
        dispatch(fetchStations());
    }
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

    const handleSave = async () => {
        try {
            const submitData = { ...formData };
            if (thumbnailFile) {
                const url = await busImageService.uploadFileToCloudinary(thumbnailFile);
                submitData.image = url;
            }

            dispatch(updateRoutes(submitData));
            Swal.fire({
                title: "Thành công",
                text: "Thông tin tuyến đường đã được cập nhật",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            handleClose();
        } catch (error) {
            console.error("Update route failed", error);
            Swal.fire("Lỗi", "Cập nhật thất bại", "error");
        }
    };
    /* console.log(route); -- Removed */

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
                        {/* === GA ĐI (Cascading) === */}
                        <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                             <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <LocationOn fontSize="small" className="text-red-500" />
                                Điểm Khởi Hành
                             </h3>
                             
                             {/* Chọn Thành Phố Đi */}
                             <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600">Thành phố đi</label>
                                <TextField
                                    select fullWidth size="small"
                                    value={selectedCityFrom}
                                    onChange={(e) => {
                                        setSelectedCityFrom(e.target.value);
                                        setFormData(prev => ({ ...prev, departure_station_id: '' })); 
                                    }}
                                    className="bg-white"
                                >
                                    <MenuItem value=""><em>Chọn thành phố...</em></MenuItem>
                                    {cities.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.city_name}</MenuItem>
                                    ))}
                                </TextField>
                             </div>

                             {/* Chọn Ga Đi */}
                             <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600">Ga khởi hành *</label>
                                <TextField
                                    select fullWidth size="small"
                                    name="departure_station_id"
                                    value={formData.departure_station_id}
                                    onChange={handleChange}
                                    disabled={!selectedCityFrom}
                                    className="bg-white"
                                >
                                    {stationsFrom.length > 0 ? (
                                        stationsFrom.map(s => (
                                            <MenuItem key={s.id} value={s.id}>{s.station_name}</MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="" disabled>Không có ga nào</MenuItem>
                                    )}
                                </TextField>
                             </div>
                        </div>

                        {/* === GA ĐẾN (Cascading) === */}
                        <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                             <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <LocationOn fontSize="small" className="text-green-500" />
                                Điểm Kết Thúc
                             </h3>
                             
                             {/* Chọn Thành Phố Đến */}
                             <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600">Thành phố đến</label>
                                <TextField
                                    select fullWidth size="small"
                                    value={selectedCityTo}
                                    onChange={(e) => {
                                        setSelectedCityTo(e.target.value);
                                        setFormData(prev => ({ ...prev, arrival_station_id: '' }));
                                    }}
                                    className="bg-white"
                                >
                                    <MenuItem value=""><em>Chọn thành phố...</em></MenuItem>
                                    {cities.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.city_name}</MenuItem>
                                    ))}
                                </TextField>
                             </div>

                             {/* Chọn Ga Đến */}
                             <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600">Ga kết thúc *</label>
                                <TextField
                                    select fullWidth size="small"
                                    name="arrival_station_id"
                                    value={formData.arrival_station_id}
                                    onChange={handleChange}
                                    disabled={!selectedCityTo}
                                    className="bg-white"
                                >
                                    {stationsTo.length > 0 ? (
                                        stationsTo.map(s => (
                                            <MenuItem key={s.id} value={s.id}>{s.station_name}</MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="" disabled>Không có ga nào</MenuItem>
                                    )}
                                </TextField>
                             </div>
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

                         {/* ẢNH ĐẠI DIỆN */}
                         <div className="md:col-span-2 space-y-1">
                           <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <ImageIcon className="text-[16px] text-blue-500" /> Hình ảnh mô tả tuyến
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