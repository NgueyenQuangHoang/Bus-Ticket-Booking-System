import { useEffect, useState } from "react";
import PermissionHeader from "./components/PermissionHeader";
import PermissionTable from "./components/PermissionTable";
import PermissionFormModal from "./components/PermissionFormModal";
import UserSearch from "../components/UserSearch";
import type { Role } from "../../../../types";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { deleteRole, fetch_Roles, PostNewRole, updateRole } from "../../../../slices/userSlice";
export default function UserPermissionsPage() {
    const { roles } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    const [inputFilter, setInputFilter] = useState('')
    const [isOpen, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false) // mat dinh se la add
    


    useEffect(() => {
        dispatch(fetch_Roles())
    }, [dispatch])

    const handleSubmit = (role: Role) => {
        if(!isEdit){
            // add
            dispatch(PostNewRole(role))
        }else{
            // edit
            dispatch(updateRole(role))
        }
    }
    const [role, setRole] = useState<Role | undefined>(undefined)

    const handleDelete = (role: Role) => {
        dispatch(deleteRole(role))
    }

console.log(role);

    return (
        <div className="space-y-6">
            <PermissionHeader openFormAdd={() => {setOpen(true); setIsEdit(false); setRole(undefined)}}/>

            <UserSearch inputData={inputFilter} setInputData={setInputFilter} />

            <PermissionTable setRole={setRole} role={roles.filter(item => item.role_name.includes(inputFilter))} openModalEdit={() => {setOpen(true); setIsEdit(true)}} onDelete={handleDelete}/>

            <PermissionFormModal isOpen={isOpen} onToggle={() => setOpen(false)} onSubmit={handleSubmit} role={role}/>
        </div>
    );
}
