import { Pagination, Paper } from "@mui/material";
import StationSearch from "./components/StationSearch";
import StationTable from "./components/StationTable";
import StationFormModal from "./components/StationFormModal";

export default function StationAdminPage() {
  return (
    <div className='py-5'>
                <div className='py-5'>
                            <StationFormModal/>
                            <Paper className="shadow-sm rounded-xl overflow-hidden border border-gray-100">
                            <StationSearch/>
                                <StationTable/>
                            </Paper>
                            <div className="py-4 flex justify-center"><Pagination count={10}/></div>
                        </div>
            </div>
  )
}
