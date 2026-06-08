import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import { FileText, MapPin, Sparkles, UploadCloud, X } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setSelectedFile(null);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('location', data.location);
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      // Submit request as multipart/form-data
      await API.post('/api/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Complaint submitted successfully!');
      
      setTimeout(() => {
        navigate('/student/complaints');
      }, 1000);
    } catch (error) {
      console.error('Error creating complaint:', error);
      const errorMsg = error.response?.data?.message || 'Failed to submit complaint. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl tracking-tight">File a Complaint</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Submit infrastructure or maintenance issues on campus</p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-6 md:p-10 shadow-lg shadow-slate-100/50 dark:shadow-slate-950/20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Complaint Title
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <FileText className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="title"
                type="text"
                {...register('title', { required: 'Complaint title is required' })}
                className={`block w-full rounded-xl border py-3 pl-11 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm bg-white dark:bg-slate-950 ${
                  errors.title 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                    : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-primary/10'
                }`}
                placeholder="e.g. Broken Fan, Water Leakage"
              />
            </div>
            {errors.title && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Location Field */}
          <div>
            <label htmlFor="location" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Location / Room Number
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="location"
                type="text"
                {...register('location', { required: 'Location is required' })}
                className={`block w-full rounded-xl border py-3 pl-11 pr-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm bg-white dark:bg-slate-950 ${
                  errors.location 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                    : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-primary/10'
                }`}
                placeholder="e.g. Block C, Room 203"
              />
            </div>
            {errors.location && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.location.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Detailed Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', { required: 'Description is required' })}
              className={`block w-full rounded-xl border py-3 px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm bg-white dark:bg-slate-950 ${
                errors.description 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200/20' 
                  : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-primary/10'
              }`}
              placeholder="Provide context about the issue (e.g. since when is it broken, what needs fixing...)"
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Image Upload section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Complaint Image (Optional)
            </label>
            
            {imagePreview ? (
              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 max-h-64 flex justify-center items-center group shadow-inner">
                <img 
                  src={imagePreview} 
                  alt="Complaint Preview" 
                  className="object-contain max-h-64 w-full"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 rounded-full bg-slate-900/60 dark:bg-slate-800/60 p-2 text-white hover:bg-slate-900/80 dark:hover:bg-slate-700/80 transition-all active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 px-6 py-8 transition-all hover:border-primary/50 hover:bg-slate-50/50 dark:hover:bg-slate-950/50 group">
                <div className="text-center space-y-2">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/20 group-hover:text-primary dark:group-hover:text-primary-400 transition-all">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md font-bold text-primary dark:text-primary-400 focus-within:outline-none hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      <span>Upload a file</span>
                      <input 
                        id="image-upload" 
                        name="image" 
                        type="file" 
                        accept="image/*"
                        className="sr-only" 
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1 text-slate-500 dark:text-slate-400 font-medium">or drag and drop</p>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">PNG, JPG, JPEG up to 2MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="btn-submit-complaint"
              disabled={submitting}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-600 active:bg-primary-700 disabled:opacity-70 disabled:pointer-events-none transition-all shadow-lg shadow-primary/25 cursor-pointer active:scale-[0.98]"
            >
              {submitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Submit Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
