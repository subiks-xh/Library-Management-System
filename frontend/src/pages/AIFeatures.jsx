import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  BookOpenIcon,
  UsersIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function AIFeatures() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: `Hello ${user?.first_name || "there"}! 👋 I'm your AI Library Assistant. I can help you with:\n\n• Finding books and resources\n• Managing your library account\n• Academic research assistance\n• Reading recommendations\n• Library policies and hours\n\nWhat can I help you with today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "What are the library hours?",
    "Recommend books for computer science",
    "How do I renew my books?",
    "Find books by author name",
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Library hours
    if (lowerMessage.includes("hours") || lowerMessage.includes("timings") || lowerMessage.includes("open")) {
      return {
        content: `📅 **Library Hours:**\n\n**Monday - Friday:** 8:00 AM - 8:00 PM\n**Saturday:** 9:00 AM - 6:00 PM\n**Sunday:** 10:00 AM - 4:00 PM\n\n**Special Hours:**\n• Extended hours during exams (24/7)\n• Reduced hours during holidays\n• Digital library accessible 24/7\n\nIs there anything specific about our hours you'd like to know?`,
        suggestions: ["Extended exam hours", "Holiday schedule", "Digital library access"],
      };
    }

    // Book recommendations
    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest") || lowerMessage.includes("books for")) {
      const subject = lowerMessage.includes("computer") ? "Computer Science" :
                    lowerMessage.includes("math") ? "Mathematics" :
                    lowerMessage.includes("engineering") ? "Engineering" : "general";
      
      return {
        content: `📚 **Book Recommendations for ${subject}:**\n\n**Popular Right Now:**\n• "Clean Code" by Robert Martin\n• "Design Patterns" by Gang of Four\n• "Introduction to Algorithms" by Cormen\n\n**Based on your profile:**\n• "Advanced React Patterns" - Available\n• "System Design Interview" - 2 copies left\n• "Machine Learning Yearning" - Digital copy available\n\n**Trending in your department:**\n• "Microservices Patterns" - High demand\n• "Database Internals" - New arrival\n\nWould you like detailed information about any of these books?`,
        suggestions: ["Reserve a book", "See more recommendations", "Check availability"],
      };
    }

    // Book renewal
    if (lowerMessage.includes("renew") || lowerMessage.includes("extend") || lowerMessage.includes("due date")) {
      return {
        content: `📖 **Book Renewal Information:**\n\n**Your Current Books:**\n• "Introduction to Computer Science" - Due Jan 15, 2026 ✅\n• "Advanced Mathematics" - Due Jan 20, 2026 ✅\n\n**Renewal Rules:**\n• Maximum 2 renewals per book\n• Can't renew if book is reserved by others\n• Renewal extends due date by 3 weeks\n• No renewals if you have overdue fines\n\n**How to Renew:**\n1. Click "My Library History" in your profile\n2. Select books to renew\n3. Or ask me to renew them for you!\n\nWould you like me to renew any of your books now?`,
        suggestions: ["Renew all books", "Check due dates", "View my history"],
      };
    }

    // Search for books
    if (lowerMessage.includes("find") || lowerMessage.includes("search") || lowerMessage.includes("author")) {
      return {
        content: `🔍 **Book Search Help:**\n\n**Search Options:**\n• By title: "Introduction to..."  \n• By author: "Robert Martin", "Martin Fowler"\n• By ISBN: 978-0123456789\n• By subject: "Computer Science", "Mathematics"\n• By keyword: "algorithm", "database", "AI"\n\n**Advanced Search:**\n• Use quotes for exact phrases: "machine learning"\n• Combine terms: author:Martin AND subject:programming\n• Filter by availability: available:true\n\n**Quick Search Shortcuts:**\n• Type author name + book topic\n• Use the search bar in the navbar\n• Browse by categories\n\nWhat book or author are you looking for?`,
        suggestions: ["Search for specific author", "Browse categories", "Advanced search tips"],
      };
    }

    // Account information
    if (lowerMessage.includes("account") || lowerMessage.includes("profile") || lowerMessage.includes("history")) {
      return {
        content: `👤 **Your Library Account:**\n\n**Account Status:** Active ✅\n**Member Since:** ${new Date(user?.created_at || Date.now()).toLocaleDateString()}\n**User ID:** ${user?.register_number || user?.id}\n\n**Current Activity:**\n• Books Borrowed: 2\n• Books Reserved: 1  \n• Overdue Books: 0\n• Outstanding Fines: ₹0\n\n**Quick Actions:**\n• View detailed history\n• Update profile information\n• Change password\n• Set notification preferences\n\nWhat would you like to manage in your account?`,
        suggestions: ["View borrowing history", "Update profile", "Notification settings"],
      };
    }

    // Policies and rules
    if (lowerMessage.includes("policy") || lowerMessage.includes("rules") || lowerMessage.includes("fine")) {
      return {
        content: `📋 **Library Policies:**\n\n**Borrowing Limits:**\n• Students: 3 books max\n• Faculty: 5 books max\n• Research scholars: 7 books max\n\n**Loan Periods:**\n• General books: 3 weeks\n• Reference books: 7 days\n• Rare books: Library use only\n\n**Fines:**\n• Overdue: ₹2 per day per book\n• Lost book: Replacement cost + ₹50\n• Damage: Assessment-based fine\n\n**Rules:**\n• No food/drinks in library\n• Mobile phones on silent\n• Books must be returned by due date\n• Reservations held for 3 days\n\nAny specific policy you'd like to know about?`,
        suggestions: ["Fine calculation", "Reservation policy", "Damage policy"],
      };
    }

    // Default response with context awareness
    return {
      content: `I understand you're asking about "${userMessage}". Let me help you with that!\n\n**I can assist you with:**\n\n🔍 **Search & Discovery**\n• Find books by title, author, or subject\n• Get personalized recommendations\n• Check book availability\n\n📚 **Library Services**\n• Borrow, renew, and return books\n• Reserve popular books\n• Access digital resources\n\n👤 **Account Management**\n• View your borrowing history\n• Check due dates and fines\n• Update profile information\n\n⏰ **Information & Policies**\n• Library hours and locations\n• Borrowing rules and policies\n• Academic research support\n\nCould you be more specific about what you need help with?`,
      suggestions: [
        "Library hours",
        "Find a book",
        "My account status",
        "Borrowing policies",
      ],
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = simulateAIResponse(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      };

      setMessages(prev => [...prev, botMessage]);
      setSuggestedQuestions(aiResponse.suggestions || []);
      setIsTyping(false);
    }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        content: `Hello ${user?.first_name || "there"}! 👋 I'm your AI Library Assistant. How can I help you today?`,
        timestamp: new Date(),
      },
    ]);
    setSuggestedQuestions([
      "What are the library hours?",
      "Recommend books for computer science", 
      "How do I renew my books?",
      "Find books by author name",
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <SparklesIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Library Assistant</h1>
              <p className="text-green-100">
                Your intelligent companion for all library needs
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-sm opacity-90">Powered by</div>
            <div className="font-bold">LibMS AI</div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900">
                AI Assistant - Online
              </span>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
              <span>Clear Chat</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                <div className="text-xs mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs font-medium opacity-80">
                      Quick actions:
                    </div>
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-3 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  </div>
                  <span className="text-xs text-gray-500">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Suggested questions:</div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about the library..."
              className="flex-1 min-h-[44px] max-h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpenIcon className="w-8 h-8 text-blue-500" />
            <h3 className="text-lg font-semibold">Smart Recommendations</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Get personalized book suggestions based on your reading history and preferences.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <MagnifyingGlassIcon className="w-8 h-8 text-green-500" />
            <h3 className="text-lg font-semibold">Intelligent Search</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Natural language search that understands context and provides better results.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-500" />
            <h3 className="text-lg font-semibold">24/7 Support</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Instant answers to your library questions anytime, anywhere.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIFeatures;
