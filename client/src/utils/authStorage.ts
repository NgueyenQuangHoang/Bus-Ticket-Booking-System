export const getStoredRole = (): string | null => {
  const raw = localStorage.getItem("role");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

export const getStoredBusCompanyId = (): string | null => {
  const raw = localStorage.getItem("bus_company_id");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined || parsed === "") return null;
    return String(parsed);
  } catch {
    return raw;
  }
};

export const setStoredBusCompanyId = (
  busCompanyId?: string | number | null
): void => {
  if (busCompanyId === undefined || busCompanyId === null || busCompanyId === "") {
    localStorage.removeItem("bus_company_id");
    return;
  }
  localStorage.setItem("bus_company_id", JSON.stringify(busCompanyId));
};

export const getStoredIsLogin = (): boolean => {
  const raw = localStorage.getItem("isLogin");
  if (!raw) return false;
  try {
    return JSON.parse(raw) === true;
  } catch {
    return raw === "true";
  }
};

