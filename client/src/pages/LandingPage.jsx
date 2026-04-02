import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Lightbulb, HeartHandshake, ArrowRight, CheckCircle, Upload, FileText, X, Image as ImageIcon, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function LandingPage() {
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('photo');

  const steps = [
    {
      icon: Camera,
      title: 'Snap a Photo',
      description: 'Take a picture of your child\'s homework problem or paste the text directly.',
    },
    {
      icon: Lightbulb,
      title: 'Get an Explanation',
      description: 'Our AI breaks down the problem into clear, simple steps you can understand.',
    },
    {
      icon: HeartHandshake,
      title: 'Help Your Child',
      description: 'Use the parent-friendly explanation to guide your child through the learning.',
    },
  ];

  const benefits = [
    'No more homework stress',
    'Understand before you explain',
    'Build confidence together',
  ];

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        });
      }
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      });
    }
  }, []);

  const clearUpload = () => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleExplain = () => {
    if ((activeTab === 'photo' && uploadedFile) || (activeTab === 'text' && textInput.trim().length > 0)) {
      navigate('/result');
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(100vh-4rem)]"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-amber-100 rounded-full px-4 py-2 mb-8">
            <span className="text-amber-700 text-sm font-medium">For Parents, Not Kids</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-charcoal leading-tight mb-6"
          >
            Homework help that{' '}
            <span className="italic text-amberAccent">makes sense</span> to parents
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Snap a photo of any homework problem and get a clear, parent-friendly explanation 
            so you can confidently help your child learn.
          </motion.p>

          {/* Benefits */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-stone-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellowAccent/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-amberAccent/10 rounded-full blur-2xl" />
      </section>

      {/* Upload Section - Directly below hero */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden"
          >
            {/* Tab Switcher */}
            <div className="flex border-b border-stone-100">
              <button
                onClick={() => setActiveTab('photo')}
                className={`flex-1 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === 'photo'
                    ? 'bg-amber-50 text-amberAccent border-b-2 border-amberAccent'
                    : 'text-stone-600 hover:text-charcoal hover:bg-stone-50'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === 'text'
                    ? 'bg-amber-50 text-amberAccent border-b-2 border-amberAccent'
                    : 'text-stone-600 hover:text-charcoal hover:bg-stone-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Type Problem</span>
              </button>
            </div>

            <div className="p-6 md:p-8">
              {/* Photo Upload Area */}
              {activeTab === 'photo' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {!uploadedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300 ${
                        isDragOver
                          ? 'border-amberAccent bg-amber-50'
                          : 'border-stone-300 bg-stone-50 hover:border-amberAccent/50'
                      }`}
                    >
                      <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-amberAccent" />
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                        Drag & drop your photo here
                      </h3>
                      <p className="text-stone-500 mb-4">or click to browse from your device</p>
                      <p className="text-stone-400 text-sm mb-6">Supports: JPG, PNG, HEIC (max 10MB)</p>
                      <label className="inline-flex items-center space-x-2 bg-amberAccent hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg">
                        <ImageIcon className="w-5 h-5" />
                        <span>Choose Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInput}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="bg-stone-50 rounded-2xl overflow-hidden">
                      <div className="relative">
                        <img
                          src={uploadedFile.url}
                          alt="Uploaded homework"
                          className="w-full h-64 md:h-80 object-contain bg-white"
                        />
                        <button
                          onClick={clearUpload}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                        >
                          <X className="w-5 h-5 text-stone-600" />
                        </button>
                      </div>
                      <div className="p-4 border-t border-stone-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-amberAccent" />
                            </div>
                            <div>
                              <p className="font-medium text-charcoal text-sm">{uploadedFile.name}</p>
                              <p className="text-stone-500 text-xs">{formatFileSize(uploadedFile.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={clearUpload}
                            className="text-stone-500 hover:text-red-500 text-sm font-medium transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Text Input Area */}
              {activeTab === 'text' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor="problem-text" className="block font-medium text-charcoal mb-2">
                    Type or paste the homework problem
                  </label>
                  <p className="text-stone-500 text-sm mb-4">
                    Include the full problem statement, any given information, and what needs to be solved.
                  </p>
                  <textarea
                    id="problem-text"
                    rows={6}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Example: Sarah has 12 apples. She gives 5 to her friend and buys 8 more at the store. How many apples does Sarah have now?"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amberAccent focus:ring-2 focus:ring-amberAccent/20 outline-none resize-none text-charcoal placeholder:text-stone-400 transition-all"
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-stone-400 text-xs">
                      {textInput.length} characters
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <button
                  onClick={handleExplain}
                  disabled={(activeTab === 'photo' && !uploadedFile) || (activeTab === 'text' && textInput.trim().length === 0)}
                  className={`w-full flex items-center justify-center space-x-2 font-semibold px-8 py-4 rounded-full transition-all duration-300 ${
                    (activeTab === 'photo' && uploadedFile) || (activeTab === 'text' && textInput.trim().length > 0)
                      ? 'bg-charcoal hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Explain This Problem</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-stone-500 text-sm mt-3">
                  You&apos;ll get a step-by-step explanation plus tips on how to explain it to your child
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - No box design */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-stone-100">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-4">
                How It Works
              </h2>
              <p className="text-stone-600 text-lg max-w-xl mx-auto">
                Three simple steps to become your child&apos;s favorite homework helper
              </p>
            </motion.div>

            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex md:flex-col items-start md:items-center md:text-center space-x-4 md:space-x-0 md:space-y-4"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-amberAccent" />
                  </div>
                  <div>
                    <div className="flex items-center md:justify-center space-x-2 mb-1">
                      <span className="text-amberAccent font-bold text-sm">Step {index + 1}</span>
                      <span className="hidden md:inline text-stone-300">—</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal mb-1">{step.title}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-stone-50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={itemVariants}
              className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-4"
            >
              Ready to turn homework stress into success?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-stone-600 mb-6">
              Join thousands of parents who are helping their kids with confidence.
            </motion.p>
            <motion.p variants={itemVariants} className="text-sm text-stone-500">
              Free to use • No signup required
            </motion.p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default LandingPage;
