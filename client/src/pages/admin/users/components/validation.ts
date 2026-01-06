export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return phoneRegex.test(phone);
};

export const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
};

export interface UserFormData {
    last_name: string;
    first_name: string;
    email: string;
    phone: string;
    password: string;
    bus_company_id?: string;
}

export const validateUserForm = (data: UserFormData, isUpdate: boolean) => {
    const errors: Partial<Record<keyof UserFormData, string>> = {};

    if (!validateRequired(data.last_name)) {
        errors.last_name = 'Họ tên không được để trống';
    }

    if (!validateRequired(data.first_name)) {
        errors.first_name = 'Họ tên không được để trống';
    }

    if (!validateRequired(data.email)) {
        errors.email = 'Email không được để trống';
    } else if (!validateEmail(data.email)) {
        errors.email = 'Email không hợp lệ';
    }

    if (!validateRequired(data.phone)) {
        errors.phone = 'Số điện thoại không được để trống';
    } else if (!validatePhone(data.phone)) {
        errors.phone = 'Số điện thoại không đúng định dạng (VD: 0901234567)';
    }

    if (!isUpdate && data.password !== undefined) {
        if (!validateRequired(data.password)) {
            errors.password = 'Mật khẩu không được để trống';
        } else if (data.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
