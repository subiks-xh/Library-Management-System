import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AcademicCapIcon,
  DocumentMagnifyingGlassIcon,
  BookmarkIcon,
  UserGroupIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  TagIcon,
  StarIcon,
  ShareIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon,
  BeakerIcon,
  NewspaperIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

function ResearchManagement() {
  const [selectedTab, setSelectedTab] = useState("projects");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch research projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: [
      "research-projects",
      {
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
      },
    ],
    queryFn: () =>
      fetchResearchProjects({
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
      }),
    refetchOnWindowFocus: false,
  });

  // Fetch research papers
  const { data: papersData, isLoading: papersLoading } = useQuery({
    queryKey: ["research-papers"],
    queryFn: fetchResearchPapers,
    refetchOnWindowFocus: false,
  });

  // Fetch researchers
  const { data: researchersData, isLoading: researchersLoading } = useQuery({
    queryKey: ["researchers"],
    queryFn: fetchResearchers,
    refetchOnWindowFocus: false,
  });

  const projects = projectsData?.data || mockProjects;
  const papers = papersData?.data || mockPapers;
  const researchers = researchersData?.data || mockResearchers;

  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    totalFunding: projects.reduce((sum, p) => sum + (p.funding_amount || 0), 0),
    totalPapers: papers.length,
    publishedPapers: papers.filter((p) => p.status === "published").length,
    totalCitations: papers.reduce((sum, p) => sum + (p.citations || 0), 0),
    totalResearchers: researchers.length,
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.principal_investigator
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || project.category === selectedCategory;
    const matchesStatus = !selectedStatus || project.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      on_hold: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      planning: "bg-purple-100 text-purple-800",
      published: "bg-green-100 text-green-800",
      under_review: "bg-orange-100 text-orange-800",
      draft: "bg-gray-100 text-gray-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-600",
      medium: "text-orange-600",
      low: "text-green-600",
    };
    return colors[priority] || "text-gray-600";
  };

  const ResearchProjectCard = ({ project }) => {
    const daysRemaining = project.end_date
      ? Math.ceil(
          (new Date(project.end_date) - new Date()) / (1000 * 60 * 60 * 24)
        )
      : null;

    return (
      <div className="card hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {project.description}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>PI: {project.principal_investigator}</span>
              <span>•</span>
              <span className={getPriorityColor(project.priority)}>
                {project.priority} priority
              </span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                project.status
              )}`}
            >
              {project.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Project Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs text-gray-500">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Category</div>
            <div className="text-sm text-gray-900">{project.category}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Team Size</div>
            <div className="text-sm text-gray-900">
              {project.team_members?.length || 0} members
            </div>
          </div>
          {project.funding_amount && (
            <div>
              <div className="text-sm font-medium text-gray-500">Funding</div>
              <div className="text-sm font-bold text-green-600">
                ${project.funding_amount.toLocaleString()}
              </div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-500">Duration</div>
            <div className="text-sm text-gray-900">
              {daysRemaining !== null
                ? daysRemaining > 0
                  ? `${daysRemaining} days left`
                  : "Completed"
                : "Ongoing"}
            </div>
          </div>
        </div>

        {/* Keywords */}
        {project.keywords && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.keywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {keyword}
                </span>
              ))}
              {project.keywords.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  +{project.keywords.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedProject(project)}
            className="btn-secondary btn-sm flex items-center flex-1"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View Details
          </button>
          <button className="btn-secondary btn-sm flex items-center">
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button className="btn-secondary btn-sm flex items-center">
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
      </div>
    );
  };

  const ResearchPaperCard = ({ paper }) => {
    return (
      <div className="card hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {paper.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {paper.authors.join(", ")} ({paper.publication_year})
            </p>
            {paper.journal && (
              <p className="text-sm text-gray-500 italic">{paper.journal}</p>
            )}
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                paper.status
              )}`}
            >
              {paper.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Paper Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {paper.citations || 0}
            </div>
            <div className="text-xs text-gray-600">Citations</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {paper.downloads || 0}
            </div>
            <div className="text-xs text-gray-600">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {paper.impact_factor ? paper.impact_factor.toFixed(2) : "0.00"}
            </div>
            <div className="text-xs text-gray-600">Impact Factor</div>
          </div>
        </div>

        {/* Abstract */}
        {paper.abstract && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-3">
              {paper.abstract}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="btn-secondary btn-sm flex items-center flex-1">
            <EyeIcon className="h-4 w-4 mr-2" />
            Read Paper
          </button>
          {paper.doi && (
            <button className="btn-secondary btn-sm flex items-center">
              <GlobeAltIcon className="h-4 w-4 mr-2" />
              DOI
            </button>
          )}
          <button className="btn-secondary btn-sm flex items-center">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>
    );
  };

  const ResearcherCard = ({ researcher }) => {
    return (
      <div className="card hover:shadow-lg transition-all duration-200">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <UserGroupIcon className="h-8 w-8 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {researcher.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{researcher.position}</p>
            <p className="text-sm text-gray-500">{researcher.department}</p>
            {researcher.email && (
              <p className="text-sm text-blue-600">{researcher.email}</p>
            )}
          </div>
        </div>

        {/* Research Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {researcher.publications_count || 0}
            </div>
            <div className="text-xs text-gray-600">Publications</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {researcher.citations_count || 0}
            </div>
            <div className="text-xs text-gray-600">Citations</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {researcher.h_index || 0}
            </div>
            <div className="text-xs text-gray-600">H-Index</div>
          </div>
        </div>

        {/* Research Interests */}
        {researcher.research_interests && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500 mb-2">
              Research Interests
            </div>
            <div className="flex flex-wrap gap-1">
              {researcher.research_interests
                .slice(0, 3)
                .map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {interest}
                  </span>
                ))}
              {researcher.research_interests.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  +{researcher.research_interests.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="btn-secondary btn-sm flex items-center flex-1">
            <EyeIcon className="h-4 w-4 mr-2" />
            View Profile
          </button>
          <button className="btn-secondary btn-sm flex items-center">
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            Contact
          </button>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "projects":
        return (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="card">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search research projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input pl-10 w-full"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="form-select"
                    >
                      <option value="">All Categories</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Physics">Physics</option>
                    </select>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="form-select"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="planning">Planning</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="btn-secondary flex items-center"
                    >
                      <FunnelIcon className="h-5 w-5 mr-2" />
                      Filters
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="form-label">Funding Range</label>
                        <select className="form-select">
                          <option value="">Any Funding</option>
                          <option value="0-10000">$0 - $10K</option>
                          <option value="10000-50000">$10K - $50K</option>
                          <option value="50000-100000">$50K - $100K</option>
                          <option value="100000+">$100K+</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Priority</label>
                        <select className="form-select">
                          <option value="">All Priorities</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Duration</label>
                        <select className="form-select">
                          <option value="">Any Duration</option>
                          <option value="short">&lt 6 months</option>
                          <option value="medium">6-12 months</option>
                          <option value="long">&gt 12 months</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setSelectedCategory("");
                            setSelectedStatus("");
                            setSearchTerm("");
                          }}
                          className="btn-secondary w-full"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ResearchProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        );

      case "papers":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {papers.map((paper) => (
                <ResearchPaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          </div>
        );

      case "researchers":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchers.map((researcher) => (
                <ResearcherCard key={researcher.id} researcher={researcher} />
              ))}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Research Output Trends</h3>
                  <p className="card-description">
                    Publications and citations over time
                  </p>
                </div>
                <div className="p-6 text-center text-gray-500">
                  <ChartBarIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Funding Distribution</h3>
                  <p className="card-description">
                    Research funding by category
                  </p>
                </div>
                <div className="p-6 text-center text-gray-500">
                  <ChartBarIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center">
              <AcademicCapIcon className="h-8 w-8 mr-3 text-primary-600" />
              Research Management
            </h1>
            <p className="page-subtitle">
              Manage research projects, publications, and collaboration
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Research Report
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Active Projects</h3>
            <BeakerIcon className="stat-card-icon text-blue-600" />
          </div>
          <p className="stat-card-value">{stats.activeProjects}</p>
          <p className="stat-card-description">Ongoing research</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Publications</h3>
            <NewspaperIcon className="stat-card-icon text-green-600" />
          </div>
          <p className="stat-card-value">{stats.publishedPapers}</p>
          <p className="stat-card-description">Published papers</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Funding</h3>
            <CurrencyDollarIcon className="stat-card-icon text-purple-600" />
          </div>
          <p className="stat-card-value">
            ${(stats.totalFunding / 1000000).toFixed(1)}M
          </p>
          <p className="stat-card-description">Research funding</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Citations</h3>
            <StarIcon className="stat-card-icon text-orange-600" />
          </div>
          <p className="stat-card-value">
            {stats.totalCitations.toLocaleString()}
          </p>
          <p className="stat-card-description">Paper citations</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "projects", name: "Research Projects", icon: BeakerIcon },
            { id: "papers", name: "Publications", icon: NewspaperIcon },
            { id: "researchers", name: "Researchers", icon: UserGroupIcon },
            { id: "analytics", name: "Analytics", icon: ChartBarIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  selectedTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

// Project Details Modal
function ProjectDetailsModal({ project, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Research Project Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {project.title}
              </h4>
              <p className="text-gray-600">{project.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Project Information
                </h5>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Principal Investigator
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {project.principal_investigator}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Category
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {project.category}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {project.status.replace("_", " ")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Priority
                    </dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {project.priority}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Project Details
                </h5>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Start Date
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(project.start_date).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      End Date
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {project.end_date
                        ? new Date(project.end_date).toLocaleDateString()
                        : "Ongoing"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Funding
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {project.funding_amount
                        ? `$${project.funding_amount.toLocaleString()}`
                        : "Not specified"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Progress
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {project.progress}%
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Team Members */}
            {project.team_members && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Team Members</h5>
                <div className="flex flex-wrap gap-2">
                  {project.team_members.map((member, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {project.keywords && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Keywords</h5>
                <div className="flex flex-wrap gap-2">
                  {project.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button className="btn-secondary">Edit Project</button>
              <button className="btn-secondary">Generate Report</button>
              <button className="btn-primary">Update Progress</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data
const mockProjects = [
  {
    id: 1,
    title: "Machine Learning Applications in Library Systems",
    description:
      "Development of ML algorithms for automated book classification and recommendation systems",
    principal_investigator: "Dr. Sarah Johnson",
    category: "Computer Science",
    status: "active",
    priority: "high",
    start_date: "2024-01-01",
    end_date: "2025-06-30",
    progress: 65,
    funding_amount: 150000,
    team_members: [
      "Dr. Sarah Johnson",
      "John Smith",
      "Alice Brown",
      "Mike Wilson",
    ],
    keywords: [
      "Machine Learning",
      "Library Systems",
      "Recommendation Algorithms",
      "Data Mining",
    ],
  },
  {
    id: 2,
    title: "IoT-Based Smart Library Management",
    description:
      "Implementation of IoT devices for real-time book tracking and environmental monitoring",
    principal_investigator: "Dr. Michael Chen",
    category: "Electronics",
    status: "active",
    priority: "medium",
    start_date: "2024-03-01",
    end_date: "2024-12-31",
    progress: 40,
    funding_amount: 75000,
    team_members: ["Dr. Michael Chen", "Lisa Wang", "Tom Rodriguez"],
    keywords: ["Internet of Things", "RFID", "Smart Systems", "Automation"],
  },
  // Add more mock projects...
];

const mockPapers = [
  {
    id: 1,
    title: "Deep Learning Approaches for Automated Book Recommendation Systems",
    authors: ["Dr. Sarah Johnson", "John Smith", "Alice Brown"],
    publication_year: 2024,
    journal: "Journal of Information Systems",
    status: "published",
    citations: 45,
    downloads: 1250,
    impact_factor: 3.2,
    abstract:
      "This paper presents novel deep learning approaches for improving book recommendation systems in academic libraries...",
    doi: "10.1000/journal.2024.001",
  },
  // Add more mock papers...
];

const mockResearchers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    position: "Professor",
    department: "Computer Science",
    email: "sarah.johnson@university.edu",
    publications_count: 48,
    citations_count: 1250,
    h_index: 18,
    research_interests: [
      "Machine Learning",
      "Information Systems",
      "Data Mining",
      "Library Science",
    ],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    position: "Associate Professor",
    department: "Electronics Engineering",
    email: "michael.chen@university.edu",
    publications_count: 32,
    citations_count: 890,
    h_index: 15,
    research_interests: [
      "Internet of Things",
      "Embedded Systems",
      "Smart Cities",
      "Automation",
    ],
  },
  // Add more mock researchers...
];

async function fetchResearchProjects(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockProjects,
      });
    }, 1000);
  });
}

async function fetchResearchPapers() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockPapers,
      });
    }, 1000);
  });
}

async function fetchResearchers() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: mockResearchers,
      });
    }, 1000);
  });
}

export default ResearchManagement;
