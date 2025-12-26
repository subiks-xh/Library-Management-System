import { useState } from "react";
import { Fragment } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  CogIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  UserIcon,
  KeyIcon,
  BookmarkIcon,
  DevicePhoneMobileIcon,
  ServerIcon,
  CloudIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    description: "Overview and analytics",
  },

  // User Management Module
  {
    name: "User Management",
    icon: UserGroupIcon,
    description: "Manage all users",
    children: [
      {
        name: "Students",
        href: "/users/students",
        icon: AcademicCapIcon,
        description: "1000+ student records",
      },
      {
        name: "Faculty",
        href: "/users/faculty",
        icon: UserIcon,
        description: "Teaching staff management",
      },
      {
        name: "Staff",
        href: "/users/staff",
        icon: UserGroupIcon,
        description: "Library staff",
      },
      {
        name: "External Members",
        href: "/users/external",
        icon: KeyIcon,
        description: "Alumni & visitors",
      },
      {
        name: "User Analytics",
        href: "/users/analytics",
        icon: ChartBarIcon,
        description: "User behavior analysis",
      },
    ],
  },

  // Collection Management
  {
    name: "Collection",
    icon: BookOpenIcon,
    description: "Manage library resources",
    children: [
      {
        name: "Books Inventory",
        href: "/collection/books",
        icon: BookOpenIcon,
        description: "50,000+ books",
      },
      {
        name: "Categories",
        href: "/collection/categories",
        icon: ClipboardDocumentListIcon,
        description: "Dewey decimal system",
      },
      {
        name: "Authors",
        href: "/collection/authors",
        icon: UserIcon,
        description: "Author database",
      },
      {
        name: "Publishers",
        href: "/collection/publishers",
        icon: BuildingLibraryIcon,
        description: "Publisher management",
      },
      {
        name: "Acquisition",
        href: "/collection/acquisition",
        icon: ShoppingCartIcon,
        description: "Book procurement",
      },
      {
        name: "Digital Resources",
        href: "/collection/digital",
        icon: ComputerDesktopIcon,
        description: "E-books & journals",
      },
    ],
  },

  // Circulation Management
  {
    name: "Circulation",
    icon: DocumentTextIcon,
    description: "Issue, return, renew",
    children: [
      {
        name: "Issue Books",
        href: "/circulation/issue",
        icon: DocumentTextIcon,
        description: "Issue new books",
      },
      {
        name: "Return Books",
        href: "/circulation/return",
        icon: BookmarkIcon,
        description: "Process returns",
      },
      {
        name: "Renewals",
        href: "/circulation/renewals",
        icon: ClockIcon,
        description: "Manage renewals",
      },
      {
        name: "Reservations",
        href: "/circulation/reservations",
        icon: BookmarkIcon,
        description: "Book holds queue",
      },
      {
        name: "Overdue Items",
        href: "/circulation/overdue",
        icon: ExclamationTriangleIcon,
        description: "Overdue tracking",
      },
      {
        name: "Lost & Damaged",
        href: "/circulation/lost-damaged",
        icon: ExclamationCircleIcon,
        description: "Damage reports",
      },
    ],
  },

  // Multi-Library Branches
  {
    name: "Library Branches",
    icon: BuildingLibraryIcon,
    description: "Multi-location management",
    children: [
      {
        name: "Main Library",
        href: "/branches/main",
        icon: BuildingLibraryIcon,
        description: "Central library",
      },
      {
        name: "Engineering Library",
        href: "/branches/engineering",
        icon: CogIcon,
        description: "Technical books",
      },
      {
        name: "Medical Library",
        href: "/branches/medical",
        icon: HeartIcon,
        description: "Medical resources",
      },
      {
        name: "Digital Library",
        href: "/branches/digital",
        icon: ComputerDesktopIcon,
        description: "Online resources",
      },
      {
        name: "Research Center",
        href: "/branches/research",
        icon: BeakerIcon,
        description: "Research materials",
      },
      {
        name: "Branch Analytics",
        href: "/branches/analytics",
        icon: ChartBarIcon,
        description: "Branch performance",
      },
    ],
  },

  // Financial Management
  {
    name: "Finance",
    icon: CurrencyRupeeIcon,
    description: "Fines and payments",
    children: [
      {
        name: "Fine Management",
        href: "/finance/fines",
        icon: CurrencyRupeeIcon,
        description: "Collect fines",
      },
      {
        name: "Payments",
        href: "/finance/payments",
        icon: CreditCardIcon,
        description: "Payment processing",
      },
      {
        name: "Budget Allocation",
        href: "/finance/budget",
        icon: ChartPieIcon,
        description: "Department budgets",
      },
      {
        name: "Financial Reports",
        href: "/finance/reports",
        icon: DocumentChartBarIcon,
        description: "Financial analytics",
      },
    ],
  },

  // Research & Academic Support
  {
    name: "Research Support",
    icon: BeakerIcon,
    description: "Academic research tools",
    children: [
      {
        name: "Thesis Repository",
        href: "/research/thesis",
        icon: DocumentTextIcon,
        description: "PhD dissertations",
      },
      {
        name: "Research Papers",
        href: "/research/papers",
        icon: NewspaperIcon,
        description: "Academic papers",
      },
      {
        name: "Journal Access",
        href: "/research/journals",
        icon: BookOpenIcon,
        description: "Online journals",
      },
      {
        name: "Citation Manager",
        href: "/research/citations",
        icon: LinkIcon,
        description: "Reference management",
      },
      {
        name: "Faculty Publications",
        href: "/research/publications",
        icon: AcademicCapIcon,
        description: "Faculty research",
      },
    ],
  },

  // Space & Facility Management
  {
    name: "Facilities",
    icon: BuildingOffice2Icon,
    description: "Space and resources",
    children: [
      {
        name: "Reading Rooms",
        href: "/facilities/reading-rooms",
        icon: HomeIcon,
        description: "Study spaces",
      },
      {
        name: "Group Study Rooms",
        href: "/facilities/group-study",
        icon: UserGroupIcon,
        description: "Collaborative spaces",
      },
      {
        name: "Computer Labs",
        href: "/facilities/computer-labs",
        icon: ComputerDesktopIcon,
        description: "Digital workstations",
      },
      {
        name: "Equipment Loans",
        href: "/facilities/equipment",
        icon: WrenchScrewdriverIcon,
        description: "AV equipment",
      },
      {
        name: "Room Booking",
        href: "/facilities/booking",
        icon: CalendarDaysIcon,
        description: "Space reservations",
      },
      {
        name: "Facility Analytics",
        href: "/facilities/analytics",
        icon: ChartBarIcon,
        description: "Usage statistics",
      },
    ],
  },

  // Advanced Analytics & Reports
  {
    name: "Analytics",
    icon: ChartBarIcon,
    description: "Data insights",
    children: [
      {
        name: "Usage Statistics",
        href: "/analytics/usage",
        icon: ChartLineIcon,
        description: "Resource utilization",
      },
      {
        name: "User Behavior",
        href: "/analytics/behavior",
        icon: EyeIcon,
        description: "Reading patterns",
      },
      {
        name: "Popular Books",
        href: "/analytics/popular",
        icon: FireIcon,
        description: "Trending resources",
      },
      {
        name: "Department Analytics",
        href: "/analytics/departments",
        icon: ChartPieIcon,
        description: "Dept-wise usage",
      },
      {
        name: "Predictive Analytics",
        href: "/analytics/predictions",
        icon: SparklesIcon,
        description: "AI insights",
      },
      {
        name: "Custom Reports",
        href: "/analytics/custom",
        icon: DocumentChartBarIcon,
        description: "Build reports",
      },
    ],
  },

  // Communication & Notifications
  {
    name: "Communications",
    icon: BellIcon,
    description: "User notifications",
    children: [
      {
        name: "Notifications Center",
        href: "/communications/notifications",
        icon: BellIcon,
        description: "All notifications",
      },
      {
        name: "SMS Alerts",
        href: "/communications/sms",
        icon: DevicePhoneMobileIcon,
        description: "Text messaging",
      },
      {
        name: "Email Campaigns",
        href: "/communications/email",
        icon: EnvelopeIcon,
        description: "Email broadcasts",
      },
      {
        name: "Announcements",
        href: "/communications/announcements",
        icon: SpeakerWaveIcon,
        description: "General notices",
      },
      {
        name: "Feedback System",
        href: "/communications/feedback",
        icon: ChatBubbleLeftRightIcon,
        description: "User feedback",
      },
    ],
  },

  // Events & Programs
  {
    name: "Events",
    icon: CalendarDaysIcon,
    description: "Library events",
    children: [
      {
        name: "Event Calendar",
        href: "/events/calendar",
        icon: CalendarDaysIcon,
        description: "Upcoming events",
      },
      {
        name: "Workshops",
        href: "/events/workshops",
        icon: AcademicCapIcon,
        description: "Skill development",
      },
      {
        name: "Author Visits",
        href: "/events/author-visits",
        icon: UserIcon,
        description: "Guest speakers",
      },
      {
        name: "Book Fairs",
        href: "/events/book-fairs",
        icon: ShoppingBagIcon,
        description: "Book exhibitions",
      },
      {
        name: "Training Programs",
        href: "/events/training",
        icon: PlayIcon,
        description: "Library training",
      },
    ],
  },

  // System Administration
  {
    name: "Administration",
    icon: CogIcon,
    description: "System management",
    children: [
      {
        name: "System Settings",
        href: "/admin/settings",
        icon: CogIcon,
        description: "Library policies",
      },
      {
        name: "User Permissions",
        href: "/admin/permissions",
        icon: KeyIcon,
        description: "Access control",
      },
      {
        name: "Backup & Recovery",
        href: "/admin/backup",
        icon: ServerIcon,
        description: "Data protection",
      },
      {
        name: "Integration Management",
        href: "/admin/integrations",
        icon: CloudIcon,
        description: "Third-party systems",
      },
      {
        name: "Audit Logs",
        href: "/admin/audit",
        icon: DocumentTextIcon,
        description: "System activity",
      },
      {
        name: "Performance Monitor",
        href: "/admin/performance",
        icon: CpuChipIcon,
        description: "System health",
      },
    ],
  },

  // Mobile & Self-Service
  {
    name: "Self-Service",
    icon: DevicePhoneMobileIcon,
    description: "User portals",
    children: [
      {
        name: "Mobile App Management",
        href: "/self-service/mobile",
        icon: DevicePhoneMobileIcon,
        description: "App administration",
      },
      {
        name: "Kiosk Management",
        href: "/self-service/kiosks",
        icon: ComputerDesktopIcon,
        description: "Self-service stations",
      },
      {
        name: "Web Portal",
        href: "/self-service/portal",
        icon: GlobeAltIcon,
        description: "Student portal",
      },
      {
        name: "API Management",
        href: "/self-service/api",
        icon: CommandLineIcon,
        description: "Developer tools",
      },
    ],
  },
];

function UniversitySidebar({ sidebarOpen, setSidebarOpen }) {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 px-4 bg-primary-800">
        <BuildingLibraryIcon className="h-8 w-8 text-white mr-2" />
        <span className="text-white font-bold text-lg">UniLib Pro</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 bg-primary-700 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {!item.children ? (
                // Single navigation item
                <a
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:bg-primary-600 hover:text-white transition-colors duration-150"
                >
                  <item.icon className="mr-3 h-5 w-5 text-primary-300" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-primary-300">
                      {item.description}
                    </div>
                  </div>
                </a>
              ) : (
                // Expandable section
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        onClick={() => toggleSection(item.name)}
                        className="group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:bg-primary-600 hover:text-white transition-colors duration-150"
                      >
                        <item.icon className="mr-3 h-5 w-5 text-primary-300" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-primary-300">
                            {item.description}
                          </div>
                        </div>
                        <ChevronDownIcon
                          className={`ml-2 h-4 w-4 text-primary-300 transform transition-transform duration-200 ${
                            expandedSections[item.name] ? "rotate-180" : ""
                          }`}
                        />
                      </Disclosure.Button>

                      <Transition
                        show={expandedSections[item.name]}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="group flex items-center px-2 py-2 text-sm rounded-md text-primary-200 hover:bg-primary-600 hover:text-white transition-colors duration-150"
                            >
                              <subItem.icon className="mr-3 h-4 w-4 text-primary-400" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {subItem.name}
                                </div>
                                <div className="text-xs text-primary-400">
                                  {subItem.description}
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* System Status */}
      <div className="px-4 py-3 bg-primary-800 border-t border-primary-600">
        <div className="flex items-center text-sm text-primary-200">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
              <span className="font-medium">System Online</span>
            </div>
            <div className="text-xs text-primary-400">
              All services operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
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
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-700 px-6 pb-4">
                  <SidebarContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-700">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}

export default UniversitySidebar;
