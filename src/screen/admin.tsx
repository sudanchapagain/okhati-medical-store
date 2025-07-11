import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "/favicon.ico";
import {
  UsersIcon,
  CubeIcon,
  PlusIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function AdminScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const user = localStorage.getItem("currentUser");
      const parsedUser = user ? JSON.parse(user) : null;

      if (!parsedUser || !parsedUser.is_staff) {
        navigate("/");
      }
    } catch {
      navigate("/");
    }
  }, [navigate]);

  const navigationItems = [
    {
      name: "Users",
      href: "/admin/userslist",
      icon: UsersIcon,
      description: "Manage user accounts",
    },
    {
      name: "Products",
      href: "/admin/productslist",
      icon: CubeIcon,
      description: "View and edit products",
    },
    {
      name: "Add Product",
      href: "/admin/addnewproduct",
      icon: PlusIcon,
      description: "Create new product",
    },
    {
      name: "Orders",
      href: "/admin/orderslist",
      icon: ShoppingBagIcon,
      description: "View all orders",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="bg-opacity-75 fixed inset-0 bg-gray-600"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-70 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Okhati logo" className="h-8 w-8" />
                <h1 className="ml-2 text-xl font-semibold">Okhati Admin</h1>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-6">
              <div className="space-y-1 px-3">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-65 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Okhati logo" className="h-8 w-8" />
              <h1 className="ml-2 text-xl font-semibold">Okhati Admin</h1>
            </Link>
          </div>
          <nav className="mt-6 flex-1">
            <div className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center border-b border-gray-200 bg-white lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="border-r border-gray-200 px-4 text-gray-500 hover:text-gray-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Okhati logo" className="h-8 w-8" />
              <h1 className="ml-2 text-lg font-semibold">Okhati Admin</h1>
            </Link>
          </div>
        </div>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
