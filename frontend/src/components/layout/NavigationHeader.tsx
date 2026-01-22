import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Home,
  FileCheck,
  Menu,
  X,
  Truck,
  Package,
  Warehouse,
  Factory,
  LogIn,
  UserPlus,
  type LucideIcon,
  Box,
} from "lucide-react";
import { getRoleFromToken } from "../../utils/jwt";

const   NavigationHeader: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const role: string = getRoleFromToken();
  
  interface NavItem {
    path: string;
    label: string;
    icon: LucideIcon;
    roles: string[]; 
  }

  // TODO: add roles
  const navItems : NavItem[] = [
    { path: "/", label: "Home", icon: Home, roles: [] },
    { path: "login", label: "Login", icon: LogIn,  roles: ["GUEST"]},
    { path: "registration", label: "Registration", icon: UserPlus, roles: ["GUEST"]},
    {
      path: "/company-registration",
      label: "Register Company",
      icon: Building2,
      roles: ["ROLE_CUSTOMER"]
    },
    { path: "/company-review", label: "Review Companies", icon: FileCheck, roles: ["ROLE_MANAGER", "ROLE_ADMIN"] },
    { path: "/vehicle-management", label: "Vehicle Management", icon: Truck, roles: ["ROLE_MANAGER", "ROLE_ADMIN"]},
    { path: "/warehouse-management", label: "Warehouse Management", icon: Warehouse, roles: ["ROLE_MANAGER", "ROLE_ADMIN"]},
    { path: "/products-catalog", label: "Products Catalog", icon: Box, roles: ["ROLE_CUSTOMER"]},
    {
      path: "/product-management",
      label: "Product Management",
      icon: Package,
      roles: ["ROLE_MANAGER", "ROLE_ADMIN"]
    },
    { path: "/factory-management", label: "Factory Management", icon: Factory, roles: ["ROLE_MANAGER", "ROLE_ADMIN"]},
  ];

  const isActive = (path: string) => location.pathname === path;

  const visibleNavItems = navItems.filter(item => {
    if (!role)
      return item.roles.includes("GUEST")
    
    return role !== undefined && item.roles.includes(role);
  });

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EuroSupply
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        {role !== "GUEST" && (
          <button
            onClick={() => {
              localStorage.removeItem("token");

              if (location.pathname === "/")
                window.location.reload();
              else 
                navigate("/");
              
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-gradient-to-r from-indigo-600 to-purple-600
                      text-white font-medium shadow-md
                      hover:from-indigo-700 hover:to-purple-700
                      transition-all">
            <LogIn className="w-4 h-4" />
            Logout
          </button>
        )}
   
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      active
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
