import type { ScheduleUI } from "./ScheduleTable";

export interface ScheduleFormData extends Partial<ScheduleUI> { }

export const validateSchedule = (
    formData: ScheduleFormData,
    existingSchedules: ScheduleUI[],
    currentId?: number
): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // 1. Required Fields
    if (!formData.route_id || formData.route_id === 0) {
        newErrors.route_id = "Vui lòng chọn tuyến xe";
    }

    if (!formData.bus_id || formData.bus_id === 0) {
        newErrors.bus_id = "Vui lòng chọn xe";
    }

    if (!formData.departure_time_str) {
        newErrors.departure_time_str = "Vui lòng chọn thời gian khởi hành";
    }

    // 2. Seat Logic
    // Total Seats: > 20 and < 60
    const total = Number(formData.total_seats);
    if (formData.total_seats === undefined || formData.total_seats === null || String(formData.total_seats) === "") {
        newErrors.total_seats = "Vui lòng nhập số";
    } else if (isNaN(total)) {
        newErrors.total_seats = "Vui lòng nhập số";
    } else if (total < 20 || total > 60) {
        newErrors.total_seats = "Tổng số ghế phải lớn hơn 20 và bé hơn 60";
    }

    // Available Seats: < Total Seats
    const available = Number(formData.available_seat);
    if (formData.available_seat === undefined || formData.available_seat === null || String(formData.available_seat) === "") {
        newErrors.available_seat = "Vui lòng nhập số";
    } else if (isNaN(available)) {
        newErrors.available_seat = "Vui lòng nhập số";
    } else if (!isNaN(total) && available > total) {
        newErrors.available_seat = "Ghế trống phải nhỏ hơn tổng số ghế";
    }

    // If Status is FULL, Available seats must be 0
    if (formData.status === 'FULL' && Number(formData.available_seat) !== 0) {
        newErrors.available_seat = "Trạng thái Đã đầy thì ghế trống phải bằng 0";
    }

    // 3. Duplicate Check
    // Rule: Cannot have same Bus at Start Time
    if (formData.bus_id && formData.departure_time_str) {
        const isDuplicate = existingSchedules.some(schedule => {
            // Exclude self if editing
            if (currentId && schedule.schedule_id === currentId) return false;

            // Check collision
            return (
                schedule.bus_id === formData.bus_id &&
                schedule.departure_time_str === formData.departure_time_str
            );
        });

        if (isDuplicate) {
            // Mark error on both fields or general? Let's mark on Bus and Time
            newErrors.bus_id = "Xe này đã có lịch trình vào thời gian này";
            newErrors.departure_time_str = "Thời gian này xe đã có lịch trình";
        }
    }

    return newErrors;
};
