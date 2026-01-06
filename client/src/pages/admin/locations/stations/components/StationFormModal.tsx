import { Add, Close, Business, Image as ImageIcon, Description, Map, Save, RestartAlt, LocationOn } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, MenuItem, Modal, TextField, Typography } from '@mui/material'
import { useState, type ChangeEvent, useMemo, useEffect } from 'react';
import type { Station } from '../../../../../types';
import { v4 as uuidv4 } from "uuid";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAppDispatch, useAppSelector } from '../../../../../hooks';
import { fetchCities } from '../../../../../slices/citySlice';

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
    onAdd: (station: Station, file?: File) => void
}

interface FormErrors {
    station_name?: string;
    city_id?: string;
    location?: string;
    image?: string;
}

export default function StationFormModal({ onAdd }: PropType) {
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    /* ===== IMAGE STATE ===== */
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();

    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
             // Optional: Clear string input if any
             handleChange({ target: { name: 'image', value: '' } } as any);
             handleChange({ target: { name: 'wallpaper', value: '' } } as any);
        }
    };

    // Cấu hình Toolbar cho ReactQuill
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
    const {cities } = useAppSelector(state => state.city)

    const [formData, setFormData] = useState<Station>({
        station_name: '',
        city_id: '',
        image: '',
        wallpaper: '',
        description: '',
        location: '',
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const handleOpen = () => {
        handleReset();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setErrors({});
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.station_name.trim()) newErrors.station_name = "Tên bến xe là bắt buộc";
        if (!formData.city_id) newErrors.city_id = "Vui lòng chọn thành phố";
        if (!formData.location) newErrors.location = "Địa chỉ không được để trống";
        if (formData.location) {
             // do nothing
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleReset = () => {
        setFormData({
            station_name: '',
            city_id: '',
            image: '',
            wallpaper: '',
            description: '',
            location: '',
            id: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        setErrors({});
        setThumbnailPreview("");
        setThumbnailFile(undefined);
    };

    const handleSubmit = () => {
        if (validate()) {
            onAdd(formData, thumbnailFile);
            handleClose();
        }
    };
    const dispatch = useAppDispatch()
    useEffect(() => {dispatch(fetchCities())}, [dispatch])

    return (
        <div className='flex justify-between items-center mb-6'>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Bến xe</h1>
                <p className="text-gray-500 text-sm">Danh sách các Bến xe trong hệ thống</p>
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
                    <div className="flex justify-between items-center mb-4">
                        <Typography id="station-modal-title" variant="h6" className="font-bold text-gray-800">
                            Thêm bến xe Mới
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <Close fontSize="small" />
                        </IconButton>
                    </div>

                    <Divider className="mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Business fontSize="small" className="text-blue-500" />
                                Tên bến xe *
                            </label>
                            <TextField
                                fullWidth size="small" name="station_name"
                                placeholder="Vd: Bến xe Miền Đông"
                                value={formData.station_name} onChange={handleChange}
                                error={!!errors.station_name} helperText={errors.station_name}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Map fontSize="small" className="text-blue-500" />
                                Thành phố *
                            </label>
                            <TextField
                                select fullWidth size="small" name="city_id"
                                value={formData.city_id} onChange={handleChange}
                                error={!!errors.city_id} helperText={errors.city_id}
                            >
                                {
                                    cities.map(item => (
                                        <MenuItem value={item.id}>{item.city_name}</MenuItem>
                                    ))
                                }
                                {/* <MenuItem value={0}>Chọn thành phố</MenuItem>
                                <MenuItem value={2}>TP. Hồ Chí Minh</MenuItem>
                                <MenuItem value={3}>Đà Nẵng</MenuItem>
                                <MenuItem value={4}>Hải Phòng</MenuItem> */}
                            </TextField>
                        </div>

                        {/* ẢNH ĐẠI DIỆN & WALLPAPER (CHUNG) */}
                        <div className="space-y-1.5 col-span-1 md:col-span-2">
                             <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <ImageIcon fontSize="small" className="text-blue-500" />
                                Hình ảnh bến xe (Đại diện & Hình nền)
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
                                    Chọn ảnh
                                    <input 
                                    type="file" 
                                    accept="image/*" 
                                    hidden 
                                    onChange={handleThumbnailChange}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">
                                    Ảnh này sẽ được dùng làm ảnh đại diện và ảnh nền.
                                </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <LocationOn fontSize="small" className="text-red-500" />
                                Địa chỉ cụ thể *
                            </label>
                            <TextField
                                fullWidth size="small" name="location"
                                placeholder="Nhập địa chỉ bến xe..."
                                value={formData.location} onChange={handleChange}
                                error={!!errors.location} helperText={errors.location}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Description fontSize="small" className="text-gray-500" />
                                Mô tả chi tiết
                            </label>
                            <div className="bg-white">
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
                    </div>

                    <style>{`
                        .ql-editor img {
                            max-width: 100%;
                            height: auto;
                            border-radius: 8px;
                        }
                    `}</style>

                    <Divider className="mb-4" />

                    <div className="flex justify-end items-center gap-3 mt-4">
                        <Button
                            startIcon={<RestartAlt />}
                            onClick={handleReset}
                            className="text-gray-500 font-bold normal-case px-4"
                        >
                            Làm mới
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSubmit}
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