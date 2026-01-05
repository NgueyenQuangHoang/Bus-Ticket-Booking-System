import { Add, Close, LocationOn, AttachMoney, AccessTime, Straighten, Description, Save, RestartAlt } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, InputAdornment, MenuItem, Modal, TextField, Typography } from '@mui/material'
import { useMemo, useState, type ChangeEvent } from 'react';
import type { Route } from '../../../../../types';
import ReactQuill from 'react-quill-new';
import { useAppDispatch } from '../../../../../hooks';
import { createPostRoute } from '../../../../../slices/routesSlice';
import { v4 as uuidv4 } from 'uuid';
// Style cho thân Modal
import { fetchCities } from '../../../../../slices/citySlice'; // Import fetchCities
import { useAppSelector } from '../../../../../hooks';
import { busImageService } from '../../../../../services/admin/busImageService';
import { Image as ImageIcon } from '@mui/icons-material';

// Style cho thân Modal
const modalStyle = {
    position: 'absolute' as const,
    // ... (rest same)
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 800 }, // Wider for better layout
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    outline: 'none',
    maxHeight: '90vh',
    overflowY: 'auto'
};

interface PropType {
    length: number
}

export default function RouteFormModal({length}: PropType) {

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'], // Cho phép chèn ảnh và video
            ['clean']
        ],
    }), []);



    const [open, setOpen] = useState(false);
    /* const handleOpen = () => setOpen(true); -- Removed duplicate */
    const handleClose = () => setOpen(false);

    // Khởi tạo state dựa trên Interface Route
    const [formData, setFormData] = useState<Route>({
        id: uuidv4(),
        departure_station_id: '',
        arrival_station_id: '',
        duration: 0,
        distance: 0,
        description: '',
        image: '',
        created_at: (new Date()).toString(),
        updated_at: (new Date()).toString()
    });

    // Redux Selectors
    const dispatch = useAppDispatch();
    const { cities } = useAppSelector(state => state.city);
    const { stations } = useAppSelector(state => state.station);

    // Cascading State
    const [selectedCityFrom, setSelectedCityFrom] = useState<string>('');
    const [selectedCityTo, setSelectedCityTo] = useState<string>('');

    // Derived Stations based on Cities
    const stationsFrom = useMemo(() => stations.filter(s => String(s.city_id) === String(selectedCityFrom)), [stations, selectedCityFrom]);
    const stationsTo = useMemo(() => stations.filter(s => String(s.city_id) === String(selectedCityTo)), [stations, selectedCityTo]);

    // Image State
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();

    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
            // Optional: reset image string
            setFormData(prev => ({...prev, image: ''}));
        }
    };

    const handleOpen = () => {
        handleReset();
        setOpen(true);
        dispatch(fetchCities()); // Fetch cities when opening
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Chuyển đổi giá trị sang số nếu là các trường ID hoặc định lượng
        const isNumber = ['base_price', 'duration', 'distance'].includes(name);
        setFormData(prev => ({
            ...prev,
            [name]: isNumber ? Number(value) : value
        }));
    };

    const handleReset = () => {
        setFormData({
            id: uuidv4(),
            departure_station_id: '',
            arrival_station_id: '',
            base_price: 0,
            duration: 0,
            distance: 0,
            description: '',
            image: ''
        });
        setSelectedCityFrom('');
        setSelectedCityTo('');
        setThumbnailPreview("");
        setThumbnailFile(undefined);
    };
    /* const dispatch = useAppDispatch() -- Moved up */ 
    const handleSubmit = async () => {
        try {
            const submitData = { ...formData };
            
            // Upload Image
            if (thumbnailFile) {
                const url = await busImageService.uploadFileToCloudinary(thumbnailFile);
                submitData.image = url;
            }

            console.log("Dữ liệu Route:", submitData);
            dispatch(createPostRoute(submitData));
            handleClose();
        } catch (error) {
             console.error("Error creating route:", error);
        }
    };

    return (
        <div className='flex justify-between items-center mb-6'>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý tuyến đường</h1>
                <p className="text-gray-500 text-sm">Hiện có {length} tuyến đường</p>
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
                                        setFormData(prev => ({ ...prev, departure_station_id: '' })); // Reset station when city changes
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

                        {/* === HÌNH ẢNH TUYẾN ĐƯỜNG === */}
                         <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <ImageIcon fontSize="small" className="text-blue-500" />
                                Hình ảnh mô tả tuyến đường
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
                                <div className="mt-2">
                                    <label className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded cursor-pointer hover:bg-blue-100 transition text-sm font-medium">
                                        Chọn ảnh
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
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Description fontSize="small" className="text-gray-500" />
                                Mô tả chi tiết
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(content) => {
                                    setFormData(prev => ({ ...prev, description: content }));
                                }}
                                modules={modules}
                                placeholder="Thông tin thêm về bến xe..."
                                style={{ height: '200px', marginBottom: '50px' }}
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