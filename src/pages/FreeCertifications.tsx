import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  ExternalLink,
  Filter,
  Search,
  Award,
  Calendar,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Certification {
  id: string;
  title: string;
  provider: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
  enrollments: number;
  url: string;
  image: string;
  tags: string[];
  isNew?: boolean;
  isFree: boolean;
}

const FreeCertifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Simulated Discord bot scraped certifications
  const mockCertifications: Certification[] = [
    {
      id: '1',
      title: 'Google Digital Marketing Fundamentals',
      provider: 'Google',
      description: 'Learn the fundamentals of digital marketing including SEO, SEM, social media marketing, and analytics.',
      duration: '40 hours',
      level: 'Beginner',
      category: 'Marketing',
      rating: 4.8,
      enrollments: 125000,
      url: 'https://skillshop.exceedlms.com/student/catalog',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['SEO', 'SEM', 'Analytics', 'Social Media'],
      isNew: true,
      isFree: true
    },
    {
      id: '2',
      title: 'IBM Data Science Professional Certificate',
      provider: 'IBM',
      description: 'Master data science tools and techniques including Python, SQL, machine learning, and data visualization.',
      duration: '120 hours',
      level: 'Intermediate',
      category: 'Data Science',
      rating: 4.6,
      enrollments: 89000,
      url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Python', 'SQL', 'Machine Learning', 'Data Visualization'],
      isFree: true
    },
    {
      id: '3',
      title: 'Microsoft Azure Fundamentals',
      provider: 'Microsoft',
      description: 'Learn cloud computing basics and Azure services including compute, storage, and networking.',
      duration: '60 hours',
      level: 'Beginner',
      category: 'Cloud Computing',
      rating: 4.7,
      enrollments: 156000,
      url: 'https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Azure', 'Cloud', 'Networking', 'Storage'],
      isFree: true
    },
    {
      id: '4',
      title: 'Cybersecurity Essentials',
      provider: 'Cisco',
      description: 'Understand cybersecurity fundamentals, threat landscape, and security best practices.',
      duration: '30 hours',
      level: 'Beginner',
      category: 'Cybersecurity',
      rating: 4.5,
      enrollments: 67000,
      url: 'https://www.netacad.com/courses/cybersecurity/cybersecurity-essentials',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Security', 'Threats', 'Best Practices', 'Network Security'],
      isNew: true,
      isFree: true
    },
    {
      id: '5',
      title: 'Introduction to Artificial Intelligence',
      provider: 'Stanford University',
      description: 'Explore AI concepts, machine learning algorithms, and practical applications in various industries.',
      duration: '80 hours',
      level: 'Intermediate',
      category: 'Artificial Intelligence',
      rating: 4.9,
      enrollments: 234000,
      url: 'https://online.stanford.edu/courses/cs229-machine-learning',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['AI', 'Machine Learning', 'Neural Networks', 'Deep Learning'],
      isFree: true
    },
    {
      id: '6',
      title: 'Web Development Bootcamp',
      provider: 'freeCodeCamp',
      description: 'Complete web development course covering HTML, CSS, JavaScript, React, and Node.js.',
      duration: '300 hours',
      level: 'Beginner',
      category: 'Web Development',
      rating: 4.8,
      enrollments: 445000,
      url: 'https://www.freecodecamp.org/learn',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
      isFree: true
    },
    {
      id: '7',
      title: 'Project Management Professional',
      provider: 'PMI',
      description: 'Learn project management methodologies, tools, and best practices for successful project delivery.',
      duration: '100 hours',
      level: 'Advanced',
      category: 'Project Management',
      rating: 4.6,
      enrollments: 78000,
      url: 'https://www.pmi.org/certifications/project-management-pmp',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Agile', 'Scrum', 'Risk Management', 'Leadership'],
      isFree: true
    },
    {
      id: '8',
      title: 'UX/UI Design Fundamentals',
      provider: 'Adobe',
      description: 'Master user experience and interface design principles, prototyping, and design thinking.',
      duration: '50 hours',
      level: 'Beginner',
      category: 'Design',
      rating: 4.7,
      enrollments: 92000,
      url: 'https://www.adobe.com/education/certification-programs.html',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['UX', 'UI', 'Prototyping', 'Design Thinking'],
      isNew: true,
      isFree: true
    }
  ];

  useEffect(() => {
    // Simulate Discord bot fetching new certifications
    const fetchCertifications = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCertifications(mockCertifications);
      setFilteredCertifications(mockCertifications);
      setIsLoading(false);
      toast.success('Latest certifications loaded from Discord bot!');
    };

    fetchCertifications();
  }, []);

  useEffect(() => {
    let filtered = certifications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(cert =>
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(cert => cert.category === selectedCategory);
    }

    // Filter by level
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(cert => cert.level === selectedLevel);
    }

    setFilteredCertifications(filtered);
  }, [searchTerm, selectedCategory, selectedLevel, certifications]);

  const categories = ['All', ...Array.from(new Set(certifications.map(cert => cert.category)))];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const handleEnroll = (certification: Certification) => {
    window.open(certification.url, '_blank');
    toast.success(`Opening ${certification.title} course page`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4\" style={{ width: '40px', height: '40px' }} />
          <p className="text-gray-600">Loading latest certifications from Discord bot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Free Certifications
          </h1>
          <p className="text-gray-600 mb-4">
            Discover free certification courses scraped daily by our Discord bot
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
            <Calendar className="h-4 w-4" />
            <span>Updated daily • Last update: {new Date().toLocaleDateString()}</span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search certifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="md:w-40">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="input-field"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredCertifications.length} of {certifications.length} certifications</span>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>All courses are 100% free</span>
            </div>
          </div>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map((certification, index) => (
            <motion.div
              key={certification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card hover:scale-105 transition-transform duration-200 relative"
            >
              {certification.isNew && (
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
                  New
                </div>
              )}

              <div className="relative mb-4">
                <img
                  src={certification.image}
                  alt={certification.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium">
                  FREE
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary-600">
                    {certification.provider}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{certification.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {certification.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {certification.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{certification.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{certification.enrollments.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    certification.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    certification.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {certification.level}
                  </span>
                  <span className="text-xs text-gray-500">{certification.category}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {certification.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {certification.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{certification.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleEnroll(certification)}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Start Learning</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCertifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card text-center"
          >
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No certifications found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Discord Bot Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card mt-8 bg-primary-50 border-primary-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-900">
                Powered by Discord Bot
              </h3>
              <p className="text-primary-700">
                Our Discord bot automatically scrapes and updates free certification opportunities daily
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-primary-600" />
              <span className="text-primary-800">100% Free Courses</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary-600" />
              <span className="text-primary-800">Daily Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary-600" />
              <span className="text-primary-800">Verified Providers</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FreeCertifications;