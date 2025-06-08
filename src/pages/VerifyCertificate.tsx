import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlockchain } from '../contexts/BlockchainContext';
import QRCode from 'qrcode';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  XCircle, 
  Award,
  Calendar,
  User,
  Building,
  Hash,
  ExternalLink,
  Download,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyCertificate: React.FC = () => {
  const { certificateId } = useParams();
  const { verifyCertificate } = useBlockchain();
  
  const [searchId, setSearchId] = useState(certificateId || '');
  const [certificate, setCertificate] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (certificateId) {
      handleVerify(certificateId);
    }
  }, [certificateId]);

  const handleVerify = async (id?: string) => {
    const idToVerify = id || searchId;
    if (!idToVerify.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyCertificate(idToVerify);
      setCertificate(result);
      
      if (result) {
        // Generate QR code for the certificate
        const verificationUrl = `${window.location.origin}/verify/${result.id}`;
        const qrUrl = await QRCode.toDataURL(verificationUrl);
        setQrCodeUrl(qrUrl);
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleShare = async () => {
    if (certificate) {
      const shareData = {
        title: `Certificate: ${certificate.courseName}`,
        text: `Verify this certificate for ${certificate.studentName}`,
        url: `${window.location.origin}/verify/${certificate.id}`
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (error) {
          // Fallback to clipboard
          navigator.clipboard.writeText(shareData.url);
          toast.success('Certificate link copied to clipboard');
        }
      } else {
        navigator.clipboard.writeText(shareData.url);
        toast.success('Certificate link copied to clipboard');
      }
    }
  };

  const downloadCertificate = () => {
    // In a real implementation, this would generate and download a PDF
    toast.success('Certificate download started');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Certificate Verification
          </h1>
          <p className="text-gray-600">
            Verify the authenticity of blockchain-issued certificates
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Enter Certificate ID
            </h2>
          </div>
          
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter certificate ID (e.g., cert_1234567890_abc123def)"
              className="input-field flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            />
            <button
              onClick={() => handleVerify()}
              disabled={isVerifying}
              className="btn-primary flex items-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <div className="loading-spinner" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Verify</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Verification Result */}
        {certificate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Certificate Details */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {certificate.isVerified ? (
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    ) : (
                      <div className="bg-red-100 p-2 rounded-full">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {certificate.isVerified ? 'Certificate Verified' : 'Verification Failed'}
                      </h2>
                      <p className={`text-sm ${certificate.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {certificate.isVerified 
                          ? 'This certificate is authentic and verified on blockchain'
                          : 'This certificate could not be verified'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="btn-secondary"
                    >
                      QR Code
                    </button>
                    <button
                      onClick={handleShare}
                      className="btn-secondary"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Certificate Preview */}
                <div className="certificate-preview p-8 rounded-lg mb-6">
                  <div className="border-4 border-primary-600 p-8 rounded-lg bg-white text-center">
                    <h3 className="text-2xl font-bold text-primary-900 mb-4">
                      Certificate of Completion
                    </h3>
                    <Award className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                    <p className="text-lg mb-2">This is to certify that</p>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                      {certificate.studentName}
                    </h4>
                    <p className="text-lg mb-2">has successfully completed</p>
                    <h5 className="text-xl font-semibold text-primary-700 mb-4">
                      {certificate.courseName}
                    </h5>
                    <p className="text-gray-600 mb-6">
                      Issued by {certificate.institutionName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(certificate.issueDate).toLocaleDateString()}
                    </p>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        <Hash className="h-3 w-3 inline mr-1" />
                        Blockchain Verified • ID: {certificate.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Student</p>
                        <p className="text-sm text-gray-600">{certificate.studentName}</p>
                        <p className="text-xs text-gray-500">{certificate.studentEmail}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Institution</p>
                        <p className="text-sm text-gray-600">{certificate.institutionName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Course</p>
                        <p className="text-sm text-gray-600">{certificate.courseName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Issue Date</p>
                        <p className="text-sm text-gray-600">
                          {new Date(certificate.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-4">
                  <button
                    onClick={downloadCertificate}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                  
                  {certificate.transactionHash && (
                    <button
                      onClick={() => window.open(`https://etherscan.io/tx/${certificate.transactionHash}`, '_blank')}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View on Blockchain</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* QR Code */}
              {showQR && qrCodeUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="card text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    QR Code
                  </h3>
                  <div className="qr-code-container inline-block">
                    <img src={qrCodeUrl} alt="Certificate QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Scan to verify this certificate
                  </p>
                </motion.div>
              )}

              {/* Blockchain Info */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Blockchain Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Certificate Hash</p>
                    <p className="text-xs text-gray-600 font-mono break-all">
                      {certificate.certificateHash}
                    </p>
                  </div>
                  
                  {certificate.ipfsHash && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">IPFS Hash</p>
                      <p className="text-xs text-gray-600 font-mono break-all">
                        {certificate.ipfsHash}
                      </p>
                    </div>
                  )}
                  
                  {certificate.transactionHash && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Transaction</p>
                      <p className="text-xs text-gray-600 font-mono break-all">
                        {certificate.transactionHash}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Features */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Security Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">Blockchain verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">Tamper-proof</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">Cryptographically signed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">Decentralized storage</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* No Certificate Found */}
        {!certificate && !isVerifying && searchId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card text-center"
          >
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Certificate Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The certificate ID you entered could not be found or verified.
            </p>
            <p className="text-sm text-gray-500">
              Please check the certificate ID and try again.
            </p>
          </motion.div>
        )}

        {/* Sample Certificate IDs */}
        {!certificate && !searchId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Try Sample Certificate IDs
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'cert_1703123456_abc123def',
                'cert_1703234567_def456ghi',
                'cert_1703345678_ghi789jkl',
                'cert_1703456789_jkl012mno'
              ].map((sampleId, index) => (
                <button
                  key={sampleId}
                  onClick={() => {
                    setSearchId(sampleId);
                    handleVerify(sampleId);
                  }}
                  className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <p className="text-sm font-medium text-gray-900">Sample Certificate {index + 1}</p>
                  <p className="text-xs text-gray-600 font-mono">{sampleId}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;