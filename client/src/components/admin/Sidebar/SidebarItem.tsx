import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  subItems?: { label: string; to: string }[];
  isOpen?: boolean;
  onToggle?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to, subItems, isOpen, onToggle }) => {
  const location = useLocation();
  const hasSubItems = subItems && subItems.length > 0;
  
  // Check if any sub-item is active
  const isSubItemActive = subItems?.some(item => location.pathname === item.to);
  const isActive = to ? location.pathname === to : isSubItemActive;

  return (
    <div className="mb-1 px-3">
      {hasSubItems ? (
        <div
          onClick={onToggle}
          className={`
            flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
            ${isActive || isOpen ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
          `}
        >
          <div className="flex items-center gap-3">
            <Icon sx={{ fontSize: 20 }} />
            <span className="font-medium text-sm">{label}</span>
          </div>
          {isOpen ? <KeyboardArrowDown sx={{ fontSize: 20 }} /> : <KeyboardArrowRight sx={{ fontSize: 20 }} />}
        </div>
      ) : (
        <NavLink
          to={to!}
          className={({ isActive }) => `
            flex items-center gap-3 p-3 rounded-lg transition-colors
            ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
          `}
        >
          <Icon sx={{ fontSize: 20 }} />
          <span className="font-medium text-sm">{label}</span>
        </NavLink>
      )}

      {/* Submenu with CSS Grid Transition */}
      {hasSubItems && (
        <div 
          className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
            <div className="overflow-hidden">
                <div className="mt-1 ml-4 space-y-1">
                {subItems.map((item) => (
                    <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `
                        flex items-center gap-3 p-2 rounded-lg text-sm transition-colors block
                        ${isActive ? 'text-white' : 'text-slate-500 hover:text-white'}
                    `}
                    >
                    <span>{item.label}</span>
                    </NavLink>
                ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
