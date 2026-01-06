export type RoleName = "ADMIN" | "BUS_COMPANY" | "CUSTOMER";

export const BUS_COMPANY_ADMIN_PATHS = [
  "/admin/buses",
  "/admin/bus-images",
  "/admin/seat-maps",
  "/admin/seat-templates",
  "/admin/schedules",
  "/admin/seat-status",
  "/admin/tickets",
  "/admin/reviews",
];

export const DEFAULT_BUS_COMPANY_ADMIN_PATH = "/bus-company";

export const isBusCompanyAdminPath = (path: string): boolean => {
  return BUS_COMPANY_ADMIN_PATHS.some(
    (allowed) => path === allowed || path.startsWith(`${allowed}/`)
  );
};
