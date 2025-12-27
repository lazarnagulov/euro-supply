import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  Home,
  FileCheck,
  Menu,
  X,
  Truck,
  Package,
  Factory,
} from "lucide-react";

const NavigationHeader: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    {
      path: "/company-registration",
      label: "Register Company",
      icon: Building2,
    },
    { path: "/company-review", label: "Review Companies", icon: FileCheck },
    { path: "/vehicle-management", label: "Vehicle Management", icon: Truck },
    {
      path: "/product-management",
      label: "Product Management",
      icon: Package,
    },
    { path: "/factory-management", label: "Factory Management", icon: Factory },
  ];

  const isActive = (path: string) => location.pathname === path;

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
            {navItems.map((item) => {
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
