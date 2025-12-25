import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  TagIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  DocumentChartBarIcon,
  XMarkIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Books", href: "/books", icon: BookOpenIcon },
  { name: "Categories", href: "/categories", icon: TagIcon },
  { name: "Students", href: "/students", icon: UserGroupIcon },
  { name: "Issue Books", href: "/issue", icon: ArrowRightOnRectangleIcon },
  { name: "Return Books", href: "/return", icon: ArrowLeftOnRectangleIcon },
  { name: "Reports", href: "/reports", icon: DocumentChartBarIcon },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <BuildingLibraryIcon className="h-8 w-8 text-primary-600" />
        <div className="ml-3">
          <div className="text-lg font-bold text-gray-900">TN College</div>
          <div className="text-xs text-gray-500">Library System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={closeSidebar}
                      className={clsx(
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200",
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                      )}
                    >
                      <item.icon
                        className={clsx(
                          "h-6 w-6 shrink-0",
                          isActive
                            ? "text-primary-600"
                            : "text-gray-400 group-hover:text-primary-600"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <div className="font-medium">Phase 1 - No Auth</div>
            <div>Tamil Nadu College LMS</div>
          </div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/80"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
}

export default Sidebar;
