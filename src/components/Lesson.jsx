import React from 'react';

const Lesson = ({ lesson, onComplete, onNext, onBack, isCompleted, isReviewMode = false }) => {
  const renderContent = (content) => {
    return content.map((item, index) => (
      <div key={index} className="mb-6">
        {item.subtitle && (
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            {item.subtitle}
          </h4>
        )}
        {item.text && (
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {item.text}
          </p>
        )}
        {item.list && (
          <ul className="space-y-2 mb-4">
            {item.list.map((listItem, listIndex) => (
              <li key={listIndex} className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 dark:text-gray-300">{listItem}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Learning Paths
            </button>
            {isReviewMode && (
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                Review Mode
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Lesson {lesson.id}: {lesson.title}
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {lesson.content.introduction}
            </p>
          </div>

          {/* Sections */}
          {lesson.content.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
                {section.title}
              </h3>
              {renderContent(section.content)}
            </div>
          ))}

          {/* Key Takeaways */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Key Takeaways
            </h3>
            <ul className="space-y-3">
              {lesson.content.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-800 dark:text-blue-200">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Next Steps
            </h3>
            <ol className="space-y-3">
              {lesson.content.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-green-600 dark:bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-green-800 dark:text-green-200">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        {!isReviewMode && (
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Back to Learning Paths
            </button>
            <div className="flex space-x-4">
              {!isCompleted ? (
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Mark as Complete
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Next Lesson
                </button>
              )}
            </div>
          </div>
        )}

        {isReviewMode && (
          <div className="flex justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Exit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lesson;

