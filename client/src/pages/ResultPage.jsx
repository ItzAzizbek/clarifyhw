import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calculator, Lightbulb, MessageCircle, CheckCircle, BookOpen, Share2, RotateCcw } from 'lucide-react';
import AdSenseBanner from '../components/AdSenseBanner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function getStoredExplanation() {
  const savedExplanation = sessionStorage.getItem('latestExplanation');

  if (!savedExplanation) {
    return null;
  }

  try {
    return JSON.parse(savedExplanation);
  } catch {
    return null;
  }
}

function MarkdownContent({ content, className = '' }) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-3 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-3 last:mb-0">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          code: ({ children }) => <code className="bg-stone-100 text-charcoal px-1.5 py-0.5 rounded">{children}</code>,
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}

function ResultPage() {
  const location = useLocation();
  const explanation = location.state?.explanation || getStoredExplanation();

  if (!explanation) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            No explanation found
          </h1>
          <p className="text-stone-600 mb-6">
            Upload a homework problem first so I can show the explanation here.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center space-x-2 bg-charcoal hover:bg-stone-700 text-white font-semibold px-6 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Go to Upload</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  const displaySteps = Array.isArray(explanation.steps)
    ? explanation.steps.map((step, index) => ({
        number: index + 1,
        title: step.title,
        content: step.explanation,
        parentTip: step.how_to_say_it,
      }))
    : [];

  const parentSummary = displaySteps[0]?.parentTip || 'Use a calm, encouraging tone and work through one step at a time.';
  const shouldShowInlineAds = displaySteps.length >= 4;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div variants={slideUpVariants} className="mb-6">
          <Link
            to="/upload"
            className="inline-flex items-center space-x-2 text-stone-600 hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Try Another Problem</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={slideUpVariants} className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              <Calculator className="w-4 h-4 mr-2" />
              {explanation.subject}
            </span>
            <span className="text-stone-400 text-sm">•</span>
            <span className="text-stone-500 text-sm">{explanation.type}</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            <MarkdownContent content={explanation.question} />
          </h1>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 inline-flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <span className="text-stone-600 text-sm">Answer: </span>
              <span className="font-semibold text-green-700 text-lg">
                <MarkdownContent content={explanation.answer} className="inline" />
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={slideUpVariants} className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <p className="text-stone-500 text-xs uppercase tracking-wide mb-1">Subject</p>
            <p className="font-semibold text-charcoal">{explanation.subject}</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <p className="text-stone-500 text-xs uppercase tracking-wide mb-1">Type</p>
            <p className="font-semibold text-charcoal">{explanation.type}</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <p className="text-stone-500 text-xs uppercase tracking-wide mb-1">Steps</p>
            <p className="font-semibold text-charcoal">{displaySteps.length}</p>
          </div>
        </motion.div>

        <motion.div
          variants={slideUpVariants}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 p-5 md:p-6 mb-8"
        >
          <h2 className="font-serif text-lg font-semibold text-charcoal mb-2 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-amberAccent" />
            Parent Tip
          </h2>
          <MarkdownContent content={parentSummary} className="text-stone-700" />
        </motion.div>

        {/* Step-by-Step Breakdown */}
        <motion.div variants={slideUpVariants} className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-amberAccent" />
            Step-by-Step Explanation
          </h2>
          <div className="space-y-4">
            {displaySteps.map((step, index) => (
              <div key={step.number} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.4 }}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm"
                >
                  <div className="p-5">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-amberAccent text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {step.number}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-charcoal mb-1">{step.title}</h3>
                        <MarkdownContent content={step.content} className="text-stone-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50/50 border-t border-amber-100 px-5 py-3">
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">How to say it</span>
                        <div className="text-amber-800 text-sm italic mt-1">
                          <MarkdownContent content={step.parentTip} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                {shouldShowInlineAds && (index + 1) % 2 === 0 && index < displaySteps.length - 1 && (
                  <AdSenseBanner outerClassName="" innerClassName="border-stone-100" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={slideUpVariants} className="mb-8">
          <AdSenseBanner outerClassName="w-full" innerClassName="p-5 md:p-6" />
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={slideUpVariants} className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/upload"
            className="flex-1 flex items-center justify-center space-x-2 bg-charcoal hover:bg-stone-700 text-white font-semibold px-6 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Explain Another Problem</span>
          </Link>
          <button
            className="flex-1 flex items-center justify-center space-x-2 bg-white border-2 border-stone-200 hover:border-amberAccent text-charcoal font-semibold px-6 py-4 rounded-full transition-all duration-300"
            onClick={() => alert('Share functionality coming soon!')}
          >
            <Share2 className="w-5 h-5" />
            <span>Save Explanation</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ResultPage;
