import { Search } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'

interface PropType {
    onChangeInputData: (value: string) => void;
    inputData: string;
    totalCities: number,
}

export default function CitySearch({onChangeInputData, totalCities, inputData}: PropType) {
    return (
        <div className="p-4 flex justify-between items-center bg-white border-b border-gray-100">
            <TextField
                size="small"
                placeholder="Tìm kiếm..."
                variant="outlined"
                className="w-1/3"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search fontSize="small" />
                        </InputAdornment>
                    ),
                }}
                onChange={(e) => {onChangeInputData(e.target.value)}}
                value={inputData}
            />
            <div className="text-gray-600 font-medium">
                Tổng: <span className="text-black">{totalCities}</span>
            </div>


            
        </div>

    )
}
