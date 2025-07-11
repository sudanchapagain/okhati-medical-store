import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  XMarkIcon,
  UserCircleIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../redux/user.slice";
import logo from "/favicon.ico";
import Cart from "@/components/ui/cart";
import type { RootState } from "../redux/store";

const navigation: { name: string; href: string }[] = [
  { name: "Products", href: "/products" },
  { name: "Features", href: "/#features" },
  { name: "Contact", href: "/#contact" },
  { name: "About", href: "/#about" },
];

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loginReducer = useSelector((state: any) => state.loginReducer);
  const { currentUser } = loginReducer;
  const user = currentUser;
  const isAdmin = user?.is_staff;

  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await dispatch(logoutUser() as any);
    navigate("/");
  };

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Okhati Store</span>
              <img src={logo} alt="Okhati logo" className="h-8 w-auto" />
            </Link>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border border-transparent bg-green-600 px-6 py-2 text-base font-semibold text-white hover:bg-green-700"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  id="dropdownNavbarLink"
                  className={`flex w-full items-center justify-between rounded py-2 pr-4 pl-3 text-gray-900 hover:cursor-pointer md:w-auto md:border-0 md:p-0 md:hover:bg-transparent ${isDropdownOpen ? "bg-gray-100" : ""}`}
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen ? "true" : "false"}
                >
                  {user.name}{" "}
                  {isAdmin && (
                    <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs">
                      Admin
                    </span>
                  )}
                  <svg
                    className={`ml-1 h-5 w-5 ${isDropdownOpen ? "rotate-180 transform" : ""}`}
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  id="dropdownNavbar"
                  className={`absolute right-0 z-10 ${isDropdownOpen ? "block" : "hidden"} w-44 divide-y divide-gray-100 rounded-lg shadow`}
                >
                  <ul
                    className="py-2 text-sm text-gray-700"
                    aria-labelledby="dropdownLargeButton"
                  >
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <UserCircleIcon className="size-5" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <CubeIcon className="size-5" /> Orders
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <svg
                            className="size-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Admin
                        </Link>
                      </li>
                    )}
                    <li
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-red-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      <ArrowLeftStartOnRectangleIcon className="size-5" /> Sign
                      out
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {user && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative ml-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-green-600 px-2 py-1 text-xs leading-none font-bold text-white">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}
            <Cart open={isCartOpen} onClose={() => setCartOpen(false)} />
          </div>

          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              </svg>
            </button>
          </div>
        </nav>

        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Okhati Store</span>
                <img src={logo} alt="Logo" className="h-8 w-auto" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="size-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Sign up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCartOpen(true);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Cart
                        {cartItemsCount > 0 && (
                          <span className="inline-flex items-center justify-center rounded-full bg-green-600 px-2 py-1 text-xs leading-none font-bold text-white">
                            {cartItemsCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full rounded-lg px-3 py-2 text-left text-base font-semibold text-red-700 hover:bg-gray-50"
                      >
                        Log out
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </>
  );
}
