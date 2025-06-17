import { useState, useEffect } from 'react';
import './App.css';
import Lesson from './components/Lesson';
import LearningPath from './components/LearningPath';

// Import JSON data
import financialFoundationsData from './data/financial-foundations.json';
import bankingCreditData from './data/banking-credit.json';
import studentLifeFinanceData from './data/student-life-finance.json';
import buildingFutureData from './data/building-future.json';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentPath, setCurrentPath] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [darkMode, setDarkMode] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Learning paths data
  const learningPaths = [
    financialFoundationsData,
    bankingCreditData,
    studentLifeFinanceData,
    buildingFutureData
  ];

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedLessons');
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem('completedLessons', JSON.stringify([...completedLessons]));
  }, [completedLessons]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const startLearningPath = (pathId) => {
    const path = learningPaths.find(p => p.id === pathId);
    setCurrentPath(path);
    setCurrentView('path');
  };

  const startLesson = (lesson, isReview = false) => {
    setCurrentLesson(lesson);
    setIsReviewMode(isReview);
    setCurrentView('lesson');
  };

  const completeLesson = () => {
    if (currentLesson && currentPath) {
      const lessonKey = `${currentPath.id}-${currentLesson.id}`;
      setCompletedLessons(prev => new Set([...prev, lessonKey]));
    }
  };

  const nextLesson = () => {
    if (currentPath && currentLesson) {
      const currentIndex = currentPath.lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex < currentPath.lessons.length - 1) {
        setCurrentLesson(currentPath.lessons[currentIndex + 1]);
      } else {
        // Last lesson completed, go back to path view
        setCurrentView('path');
        setCurrentLesson(null);
      }
    }
  };

  const goBackToHome = () => {
    setCurrentView('home');
    setCurrentPath(null);
    setCurrentLesson(null);
    setIsReviewMode(false);
  };

  const goBackToPath = () => {
    setCurrentView('path');
    setCurrentLesson(null);
    setIsReviewMode(false);
  };

  const isLessonCompleted = (pathId, lessonId) => {
    return completedLessons.has(`${pathId}-${lessonId}`);
  };

  const getCompletedLessonsForPath = (pathId) => {
    return learningPaths.find(p => p.id === pathId)?.lessons.filter(lesson => 
      isLessonCompleted(pathId, lesson.id)
    ) || [];
  };

  const getTotalCompletedLessons = () => {
    return completedLessons.size;
  };

  const getTotalLessons = () => {
    return learningPaths.reduce((total, path) => total + path.lessons.length, 0);
  };

  // Render current view
  if (currentView === 'lesson') {
    return (
      <Lesson
        lesson={currentLesson}
        onComplete={completeLesson}
        onNext={nextLesson}
        onBack={goBackToPath}
        isCompleted={isLessonCompleted(currentPath.id, currentLesson.id)}
        isReviewMode={isReviewMode}
      />
    );
  }

  if (currentView === 'path') {
    return (
      <LearningPath
        path={currentPath}
        onBack={goBackToHome}
        onLessonSelect={(lesson) => startLesson(lesson)}
      />
    );
  }

  // Home view
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FinanceForward</h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</a>
                <a href="#paths" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Learning Paths</a>
                <a href="#tools" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tools</a>
                <a href="#progress" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Progress</a>
              </nav>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section id="home" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Financial Literacy
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Building Your Future
                </p>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Master essential financial skills with our comprehensive learning paths designed specifically for high school and college students.
              </p>
              <a
                href="#paths"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Learning
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Learning Paths Section */}
        <section id="paths" className="py-20 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Learning Path
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Structured courses designed to build your financial knowledge step by step
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {learningPaths.map((path) => {
                const completedCount = getCompletedLessonsForPath(path.id).length;
                const totalCount = path.lessons.length;
                const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
                
                const getColorClasses = (color) => {
                  const colorMap = {
                    blue: 'from-blue-500 to-blue-600',
                    green: 'from-green-500 to-green-600',
                    purple: 'from-purple-500 to-purple-600',
                    orange: 'from-orange-500 to-orange-600'
                  };
                  return colorMap[color] || 'from-blue-500 to-blue-600';
                };

                const getIconSvg = (icon) => {
                  const icons = {
                    book: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    ),
                    'credit-card': (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    ),
                    'academic-cap': (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    ),
                    'trending-up': (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    )
                  };
                  return icons[icon] || icons.book;
                };

                return (
                  <div key={path.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-r ${getColorClasses(path.color)} rounded-xl flex items-center justify-center mr-6`}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {getIconSvg(path.icon)}
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {path.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {path.description}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {path.estimatedTime} • {path.lessons.length} lessons
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Progress</span>
                          <span>{completedCount}/{totalCount} lessons</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${getColorClasses(path.color)} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={() => startLearningPath(path.id)}
                        className={`w-full py-3 bg-gradient-to-r ${getColorClasses(path.color)} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity`}
                      >
                        {completedCount > 0 ? 'Continue Learning Path' : 'Start Learning Path'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Financial Tools
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Interactive calculators to help you make informed financial decisions
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Budget Calculator */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Budget Calculator</h3>
                <BudgetCalculator />
              </div>

              {/* Compound Interest Calculator */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Compound Interest Calculator</h3>
                <CompoundInterestCalculator />
              </div>
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section id="progress" className="py-20 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Track Your Progress
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Monitor your learning journey and celebrate your achievements
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Overall Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lessons Completed</h3>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {getTotalCompletedLessons()}
                </p>
                <p className="text-gray-600 dark:text-gray-400">of {getTotalLessons()} total</p>
              </div>

              {/* Learning Streak */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Learning Streak</h3>
                <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {getTotalCompletedLessons() > 0 ? '1' : '0'}
                </p>
                <p className="text-gray-600 dark:text-gray-400">days</p>
              </div>

              {/* Tools Used */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tools Used</h3>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">0</p>
                <p className="text-gray-600 dark:text-gray-400">calculations</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Achievements</h3>
              <div className="grid gap-6 md:grid-cols-4">
                <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 text-center ${getTotalCompletedLessons() > 0 ? 'ring-2 ring-yellow-400' : 'opacity-50'}`}>
                  <div className="text-4xl mb-2">🏆</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">First Lesson Complete</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete your first lesson</p>
                </div>
                <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 text-center ${getTotalCompletedLessons() >= 5 ? 'ring-2 ring-yellow-400' : 'opacity-50'}`}>
                  <div className="text-4xl mb-2">📚</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Knowledge Seeker</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete 5 lessons</p>
                </div>
                <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 text-center ${getTotalCompletedLessons() >= 10 ? 'ring-2 ring-yellow-400' : 'opacity-50'}`}>
                  <div className="text-4xl mb-2">🎯</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Dedicated Learner</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete 10 lessons</p>
                </div>
                <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 text-center ${getTotalCompletedLessons() >= getTotalLessons() ? 'ring-2 ring-yellow-400' : 'opacity-50'}`}>
                  <div className="text-4xl mb-2">🌟</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Finance Master</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete all lessons</p>
                </div>
              </div>
            </div>

            {/* Review Completed Lessons */}
            {getTotalCompletedLessons() > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Review Completed Lessons</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {learningPaths.map(path => {
                    const completedLessons = getCompletedLessonsForPath(path.id);
                    return completedLessons.map(lesson => (
                      <div key={`${path.id}-${lesson.id}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{lesson.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{path.title}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentPath(path);
                            startLesson(lesson, true);
                          }}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Review Lesson
                        </button>
                      </div>
                    ));
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">FinanceForward</h3>
              </div>
              <p className="text-gray-400 mb-8">
                Empowering the next generation with essential financial literacy skills
              </p>
              <p className="text-gray-500">
                © 2024 FinanceForward. Built for students, by educators.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Budget Calculator Component
function BudgetCalculator() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState({
    housing: '',
    food: '',
    transportation: '',
    entertainment: ''
  });
  const [result, setResult] = useState(null);

  const calculateBudget = () => {
    const totalIncome = parseFloat(income) || 0;
    const totalExpenses = Object.values(expenses).reduce((sum, expense) => sum + (parseFloat(expense) || 0), 0);
    const remaining = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((remaining / totalIncome) * 100).toFixed(1) : 0;

    setResult({
      totalIncome,
      totalExpenses,
      remaining,
      savingsRate
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Monthly Income ($)
        </label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="3000"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(expenses).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1)} ($)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setExpenses(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="0"
            />
          </div>
        ))}
      </div>

      <button
        onClick={calculateBudget}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Calculate Budget
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Budget Results</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Income:</span>
              <span className="font-medium text-gray-900 dark:text-white">${result.totalIncome.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Expenses:</span>
              <span className="font-medium text-gray-900 dark:text-white">${result.totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
              <span className={`font-bold ${result.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${result.remaining.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Savings Rate:</span>
              <span className="font-medium text-gray-900 dark:text-white">{result.savingsRate}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compound Interest Calculator Component
function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState(null);

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(time) || 0;
    
    const amount = p * Math.pow(1 + r, t);
    const interest = amount - p;

    setResult({
      principal: p,
      finalAmount: amount,
      totalInterest: interest
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Initial Investment ($)
        </label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="1000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Annual Interest Rate (%)
        </label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="7"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Time Period (years)
        </label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="10"
        />
      </div>

      <button
        onClick={calculateCompoundInterest}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
      >
        Calculate Growth
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Investment Growth</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Initial Investment:</span>
              <span className="font-medium text-gray-900 dark:text-white">${result.principal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Interest Earned:</span>
              <span className="font-medium text-green-600 dark:text-green-400">${result.totalInterest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 dark:text-gray-400">Final Amount:</span>
              <span className="font-bold text-gray-900 dark:text-white">${result.finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

