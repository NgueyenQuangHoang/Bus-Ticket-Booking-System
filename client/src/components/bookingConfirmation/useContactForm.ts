/**
 * Hook: useContactForm
 * Mục đích: Quản lý trạng thái và validation cho form Thông tin liên hệ.
 * Tính năng:
 *  - Quản lý state `formData`, `errors`, `touched`.
 *  - Validate Tên (bắt buộc), SĐT (số, độ dài, mã vùng), Email (định dạng).
 *  - Trả về danh sách xử lý sự kiện: change, blur, và validation.
 */
import { useState, useEffect } from "react";

export interface ContactFormData {
    fullName: string;
    phone: string;
    email: string;
    countryCode: string;
}

export interface ContactFormErrors {
    fullName: string;
    phone: string;
    email: string;
}

export interface ContactFormTouched {
    fullName: boolean;
    phone: boolean;
    email: boolean;
}

export function useContactForm(onValidationChange?: (isValid: boolean) => void) {
    const [formData, setFormData] = useState<ContactFormData>({
        fullName: "",
        phone: "",
        email: "",
        countryCode: "+84",
    });

    const [errors, setErrors] = useState<ContactFormErrors>({
        fullName: "",
        phone: "",
        email: "",
    });

    const [touched, setTouched] = useState<ContactFormTouched>({
        fullName: false,
        phone: false,
        email: false,
    });

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone: string) => {
        return /^[0-9]{9,11}$/.test(phone);
    };

    const checkFormValidity = () => {
        if (!formData.fullName.trim()) return false;
        if (!formData.phone.trim() || !validatePhone(formData.phone)) return false;
        if (!formData.email.trim() || !validateEmail(formData.email)) return false;
        return true;
    };

    // Notify parent whenever formData changes
    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(checkFormValidity());
        }
    }, [formData, onValidationChange]);

    const validate = () => {
        const newErrors = {
            fullName: "",
            phone: "",
            email: "",
        };
        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Vui lòng nhập họ tên";
            isValid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
            isValid = false;
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ (9-11 số)";
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập email";
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Email không hợp lệ";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleBlur = (field: keyof ContactFormTouched) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        let error = "";
        if (field === "fullName" && !formData.fullName.trim()) error = "Vui lòng nhập họ tên";
        if (field === "phone") {
            if (!formData.phone.trim()) error = "Vui lòng nhập số điện thoại";
            else if (!validatePhone(formData.phone)) error = "Số điện thoại không hợp lệ (9-11 số)";
        }
        if (field === "email") {
            if (!formData.email.trim()) error = "Vui lòng nhập email";
            else if (!validateEmail(formData.email)) error = "Email không hợp lệ";
        }
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "phone") {
            const isNumeric = /^[0-9]*$/.test(value);
            if (!isNumeric) return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
        if (touched[name as keyof ContactFormTouched]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleCountryCodeChange = (code: string) => {
        setFormData((prev) => ({ ...prev, countryCode: code }));
    };

    return {
        formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleCountryCodeChange,
        validate,
    };
}
