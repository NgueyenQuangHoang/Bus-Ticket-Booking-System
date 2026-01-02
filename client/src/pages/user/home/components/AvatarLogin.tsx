import { useState, useRef, useEffect } from "react";
import { authService } from "../../../../services/authService";
import type { User } from "../../../../types/user";
import { useNavigate } from "react-router-dom";

interface UserDropdownProps {
    user?: User;
    onLogout: (check: boolean) => void;
    notify: (alert: string, status: boolean) => void
}

export default function AvatarLogin({ user, onLogout, notify }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate()
    
    const [checkRole, setCheckRole] = useState<string>('User')
    useEffect(() => {
        if (user) {
            authService.getRoleUser(user.id).then((res) => {
                if(res){
                    res.forEach((item) => {
                        if (item && item.role_name === 'ADMIN') {
                            setCheckRole('ADMIN')
                            return
                        }
                        if (item && item.role_name == 'BUS_COMPANY') {
                            setCheckRole('BUS_COMPANY')
                            return
                        }
                    })
                }
                })
        }


        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [user]);



    const name = user ? user?.first_name + user?.last_name : 'U'
    const initial = name.charAt(0).toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1190D4] transition-colors"
            >

                <span className="text-[#1190D4] font-bold text-lg">{initial}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-fade-in-down">

                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Xin chào,</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user ? user?.first_name + " " + user?.last_name : "User"}
                        </p>
                    </div>

                    <div className="py-1">
                        <span
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1190D4]"
                            onClick={() => {
                                navigate('/accountProfile')
                            }}
                        >
                            Thông tin tài khoản
                        </span>
                        {checkRole === 'ADMIN' && <span
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1190D4]"
                            onClick={() => {
                                navigate('/admin/dashboard')
                            }}
                        >
                            ADMIN
                        </span>}
                        {checkRole === 'BUS_COMPANY' && <span
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1190D4]"
                            onClick={() => {
                                navigate('/admin/busCompany')
                            }}
                        >
                            Quản lý nhà xe
                        </span>}
                        <span
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1190D4]"
                        >
                            Cài đặt
                        </span>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                        <button
                            onClick={() => {
                                console.log('log out');

                                onLogout(false);
                                notify("Đăng xuất thành công", true)
                                authService.logout()
                                setIsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}