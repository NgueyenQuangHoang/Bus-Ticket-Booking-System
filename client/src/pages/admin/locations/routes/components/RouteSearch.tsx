import { Search } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
interface PropType {
    onChangeInput: (s : string) => void
}

export default function RouteSearch({ onChangeInput }: PropType) {
    return (
        <div className="p-4 flex justify-between items-center bg-white border-b border-gray-100">
            <TextField
                size="small"
                placeholder="Tìm kiếm..."
                variant="outlined"
                className="w-1/3"
                onChange={(e) => {onChangeInput(e.target.value)}}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search fontSize="small" />
                        </InputAdornment>
                    ),
                }}
            />
            <div className="text-gray-600 font-medium">
                Tổng: <span className="text-black">{10}</span>
            </div>
        </div>
    )
}
