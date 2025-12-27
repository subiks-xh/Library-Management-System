import { useState } from "react";
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
  ChartBarIcon,
  UserIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

function AIFeatures() {
  const [selectedFeature, setSelectedFeature] = useState("recommendations");
  const [chatInput, setChatInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // AI-powered book recommendations
  const recommendations = [
    {
      id: 1,
      title: "Advanced React Patterns",
      author: "Kent C. Dodds",
      reason:
        "Based on your interest in 'Modern JavaScript' and frequent checkouts in Programming category",
      confidence: 95,
      category: "Programming",
      rating: 4.8,
      cover:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=250&fit=crop",
      availability: "Available",
    },
    {
      id: 2,
      title: "Machine Learning Yearning",
      author: "Andrew Ng",
      reason:
        "Popular among students from your department (IT) with similar reading patterns",
      confidence: 87,
      category: "AI/ML",
      rating: 4.9,
      cover:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=200&h=250&fit=crop",
      availability: "1 copy available",
    },
    {
      id: 3,
      title: "Clean Architecture",
      author: "Robert Martin",
      reason:
        "Trending among students who read 'Design Patterns' - which you borrowed last month",
      confidence: 82,
      category: "Software Engineering",
      rating: 4.7,
      cover:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop",
      availability: "Reserved",
    },
  ];

  // Smart search suggestions
  const smartSuggestions = [
    {
      query: "data science python",
      results: 15,
      type: "Popular search",
      trend: "↗️ Trending",
    },
    {
      query: "tamil literature",
      results: 8,
      type: "Department match",
      trend: "📚 Your department",
    },
    {
      query: "machine learning",
      results: 23,
      type: "Interest-based",
      trend: "⭐ Recommended",
    },
  ];

  // Usage analytics
  const userAnalytics = {
    readingHabits: {
      preferredCategories: ["Programming", "Data Science", "Literature"],
      averageReadingTime: "2.3 weeks",
      mostActiveTime: "Evening (6-8 PM)",
      completionRate: "78%",
    },
    predictions: {
      nextBookDate: "Dec 28, 2024",
      suggestedCategory: "Machine Learning",
      estimatedInterest: "High",
    },
  };

  // AI Chat responses
  const chatResponses = [
    {
      user: "Find books about React hooks",
      ai: "I found 5 books about React hooks. Based on your reading level, I recommend starting with 'React Hooks in Action' by John Larsen. It's available in shelf A-15-3 and has great reviews from your department students.",
      timestamp: "2 minutes ago",
    },
    {
      user: "When should I return my current books?",
      ai: "You have 3 books due on December 28th. Based on your reading pattern, you typically finish books 2-3 days before the due date. I'll send you a reminder on December 25th.",
      timestamp: "1 hour ago",
    },
  ];

  const aiFeatures = [
    {
      id: "recommendations",
      name: "Smart Recommendations",
      icon: LightBulbIcon,
      description:
        "AI-powered book suggestions based on your reading history and preferences",
    },
    {
      id: "search",
      name: "Intelligent Search",
      icon: MagnifyingGlassIcon,
      description:
        "Smart search with auto-suggestions and semantic understanding",
    },
    {
      id: "chat",
      name: "AI Assistant",
      icon: ChatBubbleLeftRightIcon,
      description:
        "Ask questions about books, availability, and get personalized help",
    },
    {
      id: "analytics",
      name: "Reading Analytics",
      icon: ChartBarIcon,
      description:
        "Insights into your reading patterns and personalized predictions",
    },
  ];

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      console.log("Chat query:", chatInput);
      setChatInput("");
    }
  };

  const handleSmartSearch = (suggestion) => {
    setSearchQuery(suggestion.query);
    console.log("Searching for:", suggestion.query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">✨ AI-Powered Features</h1>
        <p className="page-subtitle">
          Experience intelligent library management with machine learning and AI
          assistance
        </p>
      </div>

      {/* Feature Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {aiFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedFeature === feature.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <feature.icon className="w-5 h-5" />
                <span>{feature.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedFeature === "recommendations" && (
            <div className="space-y-6">
              <div className="text-center">
                <SparklesIcon className="mx-auto h-12 w-12 text-primary-600" />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  Personalized Book Recommendations
                </h3>
                <p className="text-gray-600 mt-1">
                  AI analyzes your reading patterns and suggests books you'll
                  love
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((book) => (
                  <div
                    key={book.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {book.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          by {book.author}
                        </p>
                        <div className="flex items-center mt-1">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {book.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {book.confidence}% match
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            book.availability === "Available"
                              ? "bg-green-100 text-green-700"
                              : book.availability.includes("copy")
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {book.availability}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        {book.reason}
                      </p>
                      <button className="w-full text-sm bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors">
                        Reserve Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFeature === "search" && (
            <div className="space-y-6">
              <div className="text-center">
                <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-primary-600" />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  Intelligent Search & Discovery
                </h3>
                <p className="text-gray-600 mt-1">
                  Smart search with AI-powered suggestions and semantic
                  understanding
                </p>
              </div>

              {/* Smart Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask anything... 'books about machine learning for beginners'"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-4 py-1.5 rounded-md hover:bg-primary-700">
                    Search
                  </button>
                </div>
              </div>

              {/* Smart Suggestions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Smart Suggestions
                </h4>
                <div className="space-y-2">
                  {smartSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSmartSearch(suggestion)}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {suggestion.query}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({suggestion.results} results)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {suggestion.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {suggestion.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedFeature === "chat" && (
            <div className="space-y-6">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-primary-600" />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  AI Library Assistant
                </h3>
                <p className="text-gray-600 mt-1">
                  Get instant answers about books, availability, and
                  personalized recommendations
                </p>
              </div>

              {/* Chat Interface */}
              <div className="max-w-2xl mx-auto">
                <div className="border border-gray-200 rounded-lg">
                  {/* Chat History */}
                  <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                    {chatResponses.map((chat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-end">
                          <div className="bg-primary-600 text-white px-4 py-2 rounded-lg max-w-sm">
                            {chat.user}
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg max-w-sm">
                            {chat.ai}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {chat.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <form
                    onSubmit={handleChatSubmit}
                    className="border-t border-gray-200 p-4"
                  >
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask me anything about the library..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="submit"
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>

                {/* Quick Questions */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Try these questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "What books are due soon?",
                      "Find programming books",
                      "Show my reading history",
                      "Reserve a popular book",
                    ].map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setChatInput(question)}
                        className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedFeature === "analytics" && (
            <div className="space-y-6">
              <div className="text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-primary-600" />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  Personal Reading Analytics
                </h3>
                <p className="text-gray-600 mt-1">
                  Insights into your reading patterns and AI-powered predictions
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reading Habits */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpenIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Reading Habits Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Preferred Categories:
                      </span>
                      <div className="flex space-x-1">
                        {userAnalytics.readingHabits.preferredCategories.map(
                          (cat, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded"
                            >
                              {cat}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Average Reading Time:
                      </span>
                      <span className="font-medium">
                        {userAnalytics.readingHabits.averageReadingTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Most Active Time:</span>
                      <span className="font-medium">
                        {userAnalytics.readingHabits.mostActiveTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Completion Rate:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "78%" }}
                          ></div>
                        </div>
                        <span className="font-medium">
                          {userAnalytics.readingHabits.completionRate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Predictions */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2 text-green-600" />
                    AI Predictions
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-700">
                          Next book checkout predicted:
                        </p>
                        <p className="font-medium text-gray-900">
                          {userAnalytics.predictions.nextBookDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-700">
                          Suggested category:
                        </p>
                        <p className="font-medium text-gray-900">
                          {userAnalytics.predictions.suggestedCategory}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-700">Interest level:</p>
                        <p className="font-medium text-green-600">
                          {userAnalytics.predictions.estimatedInterest}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reading Goals */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  AI-Suggested Reading Goals
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900">
                      Complete Current Books
                    </h5>
                    <p className="text-sm text-gray-600">
                      You have 2 books 80% read
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BookOpenIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900">
                      Explore New Genre
                    </h5>
                    <p className="text-sm text-gray-600">
                      Try Philosophy - growing trend
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900">
                      Monthly Target
                    </h5>
                    <p className="text-sm text-gray-600">
                      3 books per month (achievable)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Benefits Info */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <SparklesIcon className="w-6 h-6 text-primary-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              How AI Enhances Your Library Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-800">
              <div>
                <h4 className="font-medium mb-1">
                  🎯 Personalized Recommendations
                </h4>
                <p>
                  Machine learning analyzes your reading patterns to suggest
                  books you'll love
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">🔍 Smart Search</h4>
                <p>
                  Natural language processing understands context for better
                  search results
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">📊 Predictive Analytics</h4>
                <p>
                  Forecast your reading behavior and optimize library resource
                  allocation
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">💬 Intelligent Assistant</h4>
                <p>
                  24/7 AI chat support for instant answers about books and
                  library services
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIFeatures;
