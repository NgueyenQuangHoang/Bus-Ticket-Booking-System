import { Pagination, Paper } from "@mui/material";
import RouteFormModal from "./components/RouteFormModal";
import RouteSearch from "./components/RouteSearch";
import RouteTable from "./components/RouteTable";


export default function RouteAdminPage() {
    return (
        <div className='py-5'>
            <div className='py-5'>
                        <RouteFormModal/>
                        <Paper className="shadow-sm rounded-xl overflow-hidden border border-gray-100">
                        <RouteSearch/>
                            <RouteTable/>
                        </Paper>
                        <div className="py-4 flex justify-center"><Pagination count={10}/></div>
                    </div>
        </div>
    )
}
