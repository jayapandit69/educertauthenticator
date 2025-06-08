import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useBlockchain } from '../contexts/BlockchainContext';
import { 
  Award, 
  Download, 
  Share2, 
  Eye,
  Calendar,
  Building,
  CheckCircle,
  ExternalLink,
  Search,
  Filter,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentPortal: React.FC = () => {
  const { user } = useAuth();
  const { getUserCertificates } = useBlockchain();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  if (!user || user.role !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Student Access Only
          </h2>
          <p className="text-gray-600">
            This portal is only accessible to students.
          </p>
        </div>
      </div>
    );
  }

  const userCertificates = getUserCertificates(user.email);
  
  // Filter and sort certificates
  const filteredCertificates = userCertificates
    .filter(cert => 
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        case 'name':
          return a.courseName.localeCompare(b.courseName);
        case 'institution':
          return a.institutionName.localeCompare(b.institutionName);
        default:
          return 0;
      }
    });

  const handleShare = async (certificate: any) => {
    const shareData = {
      title: `My Certificate: ${certificate.courseName}`,
      text: `I've earned a certificate in ${certificate.courseName} from ${certificate.institutionName}`,
      url: `${window.location.origin}/verify/${certificate.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        navigator.clipboard.writeText(shareData.url);
        toast.success('Certificate link copied to clipboard');
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success('Certificate link copied to clipboard');
    }
  };

  const handleDownload = (certificate: any) => {
    // In a real implementation, this would generate and download a PDF
    toast.success(`Downloading certificate for ${certificate.courseName}`);
  };

  const stats = [
    {
      title: 'Total Certificates',
      value: userCertificates.length.toString(),
      icon: Award,
      color: 'bg-blue-500'
    },
    {
      title: 'Verified Certificates',
      value: userCertificates.filter(cert => cert.isVerified).length.toString(),
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'This Year',
      value: userCertificates.filter(cert => 
        new Date(cert.issueDate).getFullYear() === new Date().getFullYear()
      ).length.toString(),
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Institutions',
      value: new Set(userCertificates.map(cert => cert.institutionName)).size.toString(),
      icon: Building,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.name}!
              </h1>
              <p className="text-gray-600">
                Manage and share your digital certificates
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Course Name</option>
                <option value="institution">Sort by Institution</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Certificates */}
        {filteredCertificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card hover:scale-105 transition-transform duration-200"
              >
                {/* Certificate Preview */}
                <div className="certificate-preview p-6 rounded-lg mb-4 text-center">
                  <Award className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {certificate.courseName}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {certificate.institutionName}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(certificate.issueDate).toLocaleDateString()}</span>
                  </div>
                  {certificate.isVerified && (
                    <div className="verification-badge mt-3">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Blockchain Verified</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(`/verify/${certificate.id}`, '_blank')}
                    className="btn-secondary flex-1 flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleShare(certificate)}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(certificate)}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>

                {/* Certificate Details */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ID: {certificate.id.slice(-8)}</span>
                    <button
                      onClick={() => window.open(`/verify/${certificate.id}`, '_blank')}
                      className="flex items-center space-x-1 hover:text-primary-600"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Verify</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card text-center"
          >
            {searchTerm ? (
              <>
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No certificates found
                </h3>
                <p className="text-gray-600 mb-4">
                  No certificates match your search criteria
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn-primary"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No certificates yet
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven't earned any certificates yet. Start learning to earn your first certificate!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.open('/certifications', '_blank')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Browse Free Courses</span>
                  </button>
                  <button
                    onClick={() => window.open('/dashboard', '_blank')}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>View Dashboard</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Achievement Summary */}
        {userCertificates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🎉 Congratulations on your achievements!
                </h3>
                <p className="text-gray-600">
                  You've earned {userCertificates.length} certificate{userCertificates.length !== 1 ? 's' : ''} from{' '}
                  {new Set(userCertificates.map(cert => cert.institutionName)).size} institution{new Set(userCertificates.map(cert => cert.institutionName)).size !== 1 ? 's' : ''}.
                  Keep up the great work!
                </p>
              </div>
              <div className="hidden md:block">
                <Award className="h-16 w-16 text-primary-600" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;