import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useDropzone } from 'react-dropzone';
import { sha256 } from 'js-sha256';
import toast from 'react-hot-toast';
import { 
  Award, 
  Upload, 
  FileText, 
  User, 
  Building, 
  Calendar,
  Hash,
  Send,
  X
} from 'lucide-react';

interface CertificateForm {
  studentName: string;
  studentEmail: string;
  courseName: string;
  institutionName: string;
  issueDate: string;
  description: string;
  grade: string;
  duration: string;
}

const IssueCertificate: React.FC = () => {
  const { user } = useAuth();
  const { issueCertificate } = useBlockchain();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CertificateForm>({
    studentName: '',
    studentEmail: '',
    courseName: '',
    institutionName: user?.name || '',
    issueDate: new Date().toISOString().split('T')[0],
    description: '',
    grade: '',
    duration: ''
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
      toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateCertificateHash = () => {
    const dataToHash = `${formData.studentName}${formData.studentEmail}${formData.courseName}${formData.institutionName}${formData.issueDate}`;
    return sha256(dataToHash);
  };

  const simulateIPFSUpload = async (files: File[]): Promise<string> => {
    // Simulate IPFS upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `Qm${Math.random().toString(36).substr(2, 44)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.studentEmail || !formData.courseName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate IPFS upload for files
      let ipfsHash = '';
      if (uploadedFiles.length > 0) {
        toast.loading('Uploading files to IPFS...', { duration: 2000 });
        ipfsHash = await simulateIPFSUpload(uploadedFiles);
      }

      // Generate certificate hash
      const certificateHash = generateCertificateHash();

      // Issue certificate on blockchain
      const certificateId = await issueCertificate({
        ...formData,
        certificateHash,
        ipfsHash
      });

      toast.success('Certificate issued successfully!');
      navigate(`/verify/${certificateId}`);
    } catch (error) {
      console.error('Error issuing certificate:', error);
      toast.error('Failed to issue certificate');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== 'institution') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600">
            Only educational institutions can issue certificates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Issue New Certificate
          </h1>
          <p className="text-gray-600">
            Create and issue a blockchain-verified digital certificate
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Certificate Details
                </h2>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="btn-secondary"
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
              </div>

              {!previewMode ? (
                <div className="space-y-6">
                  {/* Student Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Student Name *
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter student's full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Email *
                      </label>
                      <input
                        type="email"
                        name="studentEmail"
                        value={formData.studentEmail}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="student@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Course Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Award className="h-4 w-4 inline mr-1" />
                        Course Name *
                      </label>
                      <input
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., Advanced Web Development"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Building className="h-4 w-4 inline mr-1" />
                        Institution Name
                      </label>
                      <input
                        type="text"
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Institution name"
                      />
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Issue Date
                      </label>
                      <input
                        type="date"
                        name="issueDate"
                        value={formData.issueDate}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade/Score
                      </label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Select grade</option>
                        <option value="A+">A+ (90-100%)</option>
                        <option value="A">A (80-89%)</option>
                        <option value="B+">B+ (70-79%)</option>
                        <option value="B">B (60-69%)</option>
                        <option value="Pass">Pass</option>
                        <option value="Distinction">Distinction</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., 6 months"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field"
                      placeholder="Brief description of the course content and achievements..."
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="h-4 w-4 inline mr-1" />
                      Supporting Documents
                    </label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
                        isDragActive
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {isDragActive
                          ? 'Drop files here...'
                          : 'Drag & drop files here, or click to select'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, PNG, JPG up to 10MB each (max 5 files)
                      </p>
                    </div>

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Certificate Preview */
                <div className="certificate-preview p-8 rounded-lg text-center">
                  <div className="border-4 border-primary-600 p-8 rounded-lg bg-white">
                    <h2 className="text-2xl font-bold text-primary-900 mb-4">
                      Certificate of Completion
                    </h2>
                    <div className="mb-6">
                      <Award className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                    </div>
                    <p className="text-lg mb-2">This is to certify that</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {formData.studentName || '[Student Name]'}
                    </h3>
                    <p className="text-lg mb-2">has successfully completed</p>
                    <h4 className="text-xl font-semibold text-primary-700 mb-4">
                      {formData.courseName || '[Course Name]'}
                    </h4>
                    {formData.grade && (
                      <p className="text-lg mb-2">
                        with a grade of <strong>{formData.grade}</strong>
                      </p>
                    )}
                    <p className="text-gray-600 mb-6">
                      Issued by {formData.institutionName || '[Institution Name]'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(formData.issueDate).toLocaleDateString()}
                    </p>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        <Hash className="h-3 w-3 inline mr-1" />
                        Blockchain Verified • Tamper Proof
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner" />
                      <span>Issuing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Issue Certificate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How it works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <FileText className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Fill Details</h4>
                    <p className="text-sm text-gray-600">
                      Enter student and course information
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Hash className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Generate Hash</h4>
                    <p className="text-sm text-gray-600">
                      Certificate data is cryptographically hashed
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Upload className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">IPFS Storage</h4>
                    <p className="text-sm text-gray-600">
                      Files uploaded to decentralized storage
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Award className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Blockchain Issue</h4>
                    <p className="text-sm text-gray-600">
                      Certificate recorded on blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Security Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Immutable blockchain storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Cryptographic verification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Decentralized file storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>QR code verification</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;