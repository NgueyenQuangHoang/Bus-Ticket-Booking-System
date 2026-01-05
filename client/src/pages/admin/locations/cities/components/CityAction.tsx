import { Delete, Edit, Close, Business, Public, Description, Save } from '@mui/icons-material';
import { IconButton, Modal, Box, Typography, Divider, TextField, MenuItem, Button } from '@mui/material';
import Swal from 'sweetalert2';
import { useEffect, useState, type ChangeEvent } from 'react';
import type { City } from '../../../../../types';
import ReactQuill from 'react-quill-new';
import { useAppDispatch, useAppSelector } from '../../../../../hooks';
import { fetchStations } from '../../../../../slices/stationSlice';
import { busImageService } from '../../../../../services/admin/busImageService';
import { Image as ImageIcon } from '@mui/icons-material';


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 550 },
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    outline: 'none',
};

interface PropType {
    onDelete: (city: City) => void
    updateCitiesOnFix: (city: City) => void
    city: City
}

export default function CityAction({ onDelete, updateCitiesOnFix , city }: PropType) {  
    const {stations} = useAppSelector(state => state.station)  
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<City>(city);

    const handleOpen = () => setOpen(true);
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
        const stationsDelete = stations.reduce((acc, item) => {
            if(item.city_id == city.id){
                acc+= item.station_name+' ,'
            }else{
                acc+=''
            }
            return acc
        }, '')
        Swal.fire({
            title: "Xác nhận xóa?",
            text: `Bạn có chắc chắn muốn xóa thành phố ${formData.city_name} và danh sách thành phố ${stationsDelete} chứ cùng các tuyến đường liên quan tới bến xe này chứ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Đồng ý xóa",
            cancelButtonText: "Hủy",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete(city)
                Swal.fire(
                    "Đã xóa!",
                    `Thành phố ${formData.city_name} và các nhà xe cùng với các tuyến đường liên quan đã được xoá.`,
                    "success"
                );
            }
        });
    };

    const handleSave = async () => {
        try {
            const submitData = { ...formData };
            if (thumbnailFile) {
                const url = await busImageService.uploadFileToCloudinary(thumbnailFile);
                submitData.image_city = url;
            }

            updateCitiesOnFix(submitData);
            Swal.fire({
                title: "Thành công",
                text: "Thông tin thành phố đã được cập nhật",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            handleClose();
        } catch (error) {
            console.error("Update city failed", error);
            Swal.fire("Lỗi", "Cập nhật thất bại", "error");
        }
    };
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchStations())
    }, [dispatch])

    return (
        <>
            {/* Nhóm nút hành động */}
            <IconButton
                size="small"
                className="text-green-500 hover:bg-green-50 mr-2"
                onClick={handleOpen}
            >
                <Edit fontSize="small" />
            </IconButton>

            <IconButton
                size="small"
                className="text-red-500 hover:bg-red-50"
                onClick={handleDeleteClick}
            >
                <Delete fontSize="small" />
            </IconButton>

            {/* Modal chỉnh sửa thành phố */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6" className="font-bold text-gray-800 flex items-center gap-2">
                            <Business className="text-blue-600" /> Chỉnh sửa thành phố
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <Close fontSize="small" />
                        </IconButton>
                    </div>

                    <Divider className="mb-6" />

                    <div className="space-y-5 mb-6">
                        {/* Tên thành phố */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Tên thành phố *</label>
                            <TextField
                                fullWidth size="small" name="city_name"
                                value={formData.city_name} onChange={handleChange}
                                placeholder="Nhập tên thành phố..."
                            />
                        </div>

                        {/* Vùng miền */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <Public className="text-[16px]" /> Vùng miền
                            </label>
                            <TextField
                                select fullWidth size="small" name="region"
                                value={formData.region} onChange={handleChange}
                            >
                                <MenuItem value="Bắc">Miền Bắc</MenuItem>
                                <MenuItem value="Trung">Miền Trung</MenuItem>
                                <MenuItem value="Nam">Miền Nam</MenuItem>
                            </TextField>
                        </div>

                        {/* ẢNH ĐẠI DIỆN */}
                        <div className="space-y-1">
                           <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <ImageIcon className="text-[16px] text-blue-500" /> Hình ảnh thành phố
                            </label>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-32 h-24 border border-gray-300 rounded overflow-hidden flex items-center justify-center bg-gray-50">
                                {thumbnailPreview || formData.image_city ? (
                                    <img 
                                    src={thumbnailPreview || formData.image_city} 
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
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                                <Description className="text-[16px]" /> Mô tả thêm
                            </label>
                            <div className="bg-white rounded-md overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(e) => {                                        
                                        setFormData(prev => ({
                                            ...prev,
                                            description: e
                                        }));
                                    }}
                                    placeholder="Nhập mô tả về thành phố..."
                                    style={{ height: '200px', marginBottom: '50px' }} // Tăng chiều cao chút để dễ nhìn ảnh
                                    // modules={modules} // Sử dụng biến modules đã khai báo
                                    // formats={formats} // Sử dụng biến formats đã khai báo
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Button onClick={handleClose} className="text-gray-500 font-bold capitalize">Hủy</Button>
                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 shadow-none normal-case px-6 rounded-lg font-bold"
                        >
                            Cập nhật
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}