import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Image as ImageIcon, ArrowRight, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

function createUploadedFileData(file) {
  return {
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
  };
}

function UploadPage() {
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('photo'); // 'photo' or 'text'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setUploadedFile(createUploadedFileData(file));
      }
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    setErrorMessage('');
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(createUploadedFileData(file));
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

  const handleSubmit = async () => {
    const isPhotoSubmission = activeTab === 'photo' && uploadedFile?.file;
    const isTextSubmission = activeTab === 'text' && textInput.trim().length > 0;

    if (!isPhotoSubmission && !isTextSubmission) {
      return;
    }

    const formData = new FormData();

    if (isPhotoSubmission) {
      formData.append('image', uploadedFile.file);
    }

    if (isTextSubmission) {
      formData.append('text', textInput.trim());
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await fetch('/api/explain', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate explanation.');
      }

      sessionStorage.setItem('latestExplanation', JSON.stringify(result));
      navigate('/result', { state: { explanation: result } });
    } catch (error) {
      setErrorMessage(error.message || 'Failed to generate explanation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-3">
            Upload Homework Problem
          </h1>
          <p className="text-stone-600 text-lg">
            Share your child&apos;s homework and we&apos;ll explain it in parent-friendly terms
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-stone-100 rounded-full p-1 flex space-x-1">
            <button
              onClick={() => {
                setActiveTab('photo');
                setErrorMessage('');
              }}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                activeTab === 'photo'
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-stone-600 hover:text-charcoal'
              }`}
            >
              <span className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Photo Upload</span>
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('text');
                setErrorMessage('');
              }}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                activeTab === 'text'
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-stone-600 hover:text-charcoal'
              }`}
            >
              <span className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Type Problem</span>
              </span>
            </button>
          </div>
        </div>

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
                    : 'border-stone-300 bg-white hover:border-amberAccent/50'
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
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="relative">
                  <img
                    src={uploadedFile.url}
                    alt="Uploaded homework"
                    className="w-full h-64 md:h-80 object-contain bg-stone-50"
                  />
                  <button
                    onClick={clearUpload}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                  >
                    <X className="w-5 h-5 text-stone-600" />
                  </button>
                </div>
                <div className="p-4 border-t border-stone-100">
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
            className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm"
          >
            <div className="mb-4">
              <label htmlFor="problem-text" className="block font-medium text-charcoal mb-2">
                Type or paste the homework problem
              </label>
              <p className="text-stone-500 text-sm">
                Include the full problem statement, any given information, and what needs to be solved.
              </p>
            </div>
            <textarea
              id="problem-text"
              rows={8}
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                setErrorMessage('');
              }}
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
        <div className="mt-8">
          <button
            type="button"
            className={`w-full flex items-center justify-center space-x-2 font-semibold px-8 py-4 rounded-full transition-all duration-300 ${
              !isSubmitting && ((activeTab === 'photo' && uploadedFile) || (activeTab === 'text' && textInput.trim().length > 0))
                ? 'bg-charcoal hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting || ((activeTab === 'photo' && !uploadedFile) || (activeTab === 'text' && textInput.trim().length === 0))}
          >
            <Sparkles className="w-5 h-5" />
            <span>{isSubmitting ? 'Explaining...' : 'Explain This Problem'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          {errorMessage && (
            <p className="text-center text-red-600 text-sm mt-3">{errorMessage}</p>
          )}
          <p className="text-center text-stone-500 text-sm mt-3">
            You&apos;ll get a step-by-step explanation plus tips on how to explain it to your child
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default UploadPage;
