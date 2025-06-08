import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useBlockchain } from '../contexts/BlockchainContext';
import { 
  Award, 
  Shield, 
  Users, 
  TrendingUp,
  Plus,
  Eye,
  Calendar,
  CheckCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { certificates, getUserCertificates } = useBlockchain();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const userCertificates = user ? getUserCertificates(user.email) : [];
  const totalCertificates = certificates.length;
  const verifiedCertificates = certificates.filter(cert => cert.isVerified).length;
  const recentCertificates = certificates.slice(-5).reverse();

  const stats = [
    {
      title: 'Total Certificates',
      value: totalCertificates.toString(),
      icon: Award,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Verified Certificates',
      value: verifiedCertificates.toString(),
      icon: Shield,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Active Institutions',
      value: '24',
      icon: Users,
      color: 'bg-purple-500',
      change: '+5%'
    },
    {
      title: 'Monthly Growth',
      value: '18%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+3%'
    }
  ];

  const quickActions = [
    {
      title: 'Issue New Certificate',
      description: 'Create and issue a new digital certificate',
      icon: Plus,
      href: '/issue',
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      title: 'Verify Certificate',
      description: 'Verify the authenticity of a certificate',
      icon: Eye,
      href: '/verify',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'View Free Certifications',
      description: 'Browse available free certification courses',
      icon: Award,
      href: '/certifications',
      color: 'bg-purple-600 hover:bg-purple-700'
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your certificates today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    <p className="text-sm text-green-600 font-medium">
                      {stat.change} from last month
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      to={action.href}
                      className={`${action.color} text-white p-4 rounded-lg block hover:scale-105 transition-transform duration-200`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6" />
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm opacity-90">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Recent Certificates */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Certificates
                </h2>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="input-field w-auto"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>

              {recentCertificates.length > 0 ? (
                <div className="space-y-4">
                  {recentCertificates.map((certificate, index) => (
                    <motion.div
                      key={certificate.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <Award className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {certificate.courseName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {certificate.studentName} • {certificate.institutionName}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(certificate.issueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {certificate.isVerified && (
                          <div className="verification-badge">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Verified</span>
                          </div>
                        )}
                        <Link
                          to={`/verify/${certificate.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No certificates yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by issuing your first certificate
                  </p>
                  <Link
                    to="/issue"
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Issue Certificate</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* User's Certificates (for students) */}
        {user?.role === 'student' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                My Certificates
              </h2>
              {userCertificates.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {userCertificates.map((certificate, index) => (
                    <motion.div
                      key={certificate.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="certificate-preview p-6 rounded-lg"
                    >
                      <div className="text-center">
                        <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {certificate.courseName}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {certificate.institutionName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Issued: {new Date(certificate.issueDate).toLocaleDateString()}
                        </p>
                        <Link
                          to={`/verify/${certificate.id}`}
                          className="btn-primary mt-4 inline-block"
                        >
                          View Certificate
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No certificates earned yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete courses to earn your first certificate
                  </p>
                  <Link
                    to="/certifications"
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Award className="h-4 w-4" />
                    <span>Browse Certifications</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;