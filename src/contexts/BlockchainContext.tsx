import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface Certificate {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  institutionName: string;
  issueDate: string;
  certificateHash: string;
  ipfsHash: string;
  isVerified: boolean;
  transactionHash?: string;
}

interface BlockchainContextType {
  certificates: Certificate[];
  isConnected: boolean;
  account: string | null;
  issueCertificate: (certificateData: Omit<Certificate, 'id' | 'isVerified' | 'transactionHash'>) => Promise<string>;
  verifyCertificate: (certificateId: string) => Promise<Certificate | null>;
  getUserCertificates: (userEmail: string) => Certificate[];
  connectWallet: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    // Load certificates from localStorage on app start
    const storedCertificates = localStorage.getItem('educert_certificates');
    if (storedCertificates) {
      setCertificates(JSON.parse(storedCertificates));
    }

    // Simulate blockchain connection
    setIsConnected(true);
    setAccount('0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c');
  }, []);

  const saveCertificates = (certs: Certificate[]) => {
    setCertificates(certs);
    localStorage.setItem('educert_certificates', JSON.stringify(certs));
  };

  const issueCertificate = async (certificateData: Omit<Certificate, 'id' | 'isVerified' | 'transactionHash'>): Promise<string> => {
    try {
      // Simulate blockchain transaction
      const certificateId = `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      const newCertificate: Certificate = {
        ...certificateData,
        id: certificateId,
        isVerified: true,
        transactionHash,
      };

      const updatedCertificates = [...certificates, newCertificate];
      saveCertificates(updatedCertificates);

      toast.success('Certificate issued successfully on blockchain!');
      return certificateId;
    } catch (error) {
      toast.error('Failed to issue certificate');
      throw error;
    }
  };

  const verifyCertificate = async (certificateId: string): Promise<Certificate | null> => {
    try {
      const certificate = certificates.find(cert => cert.id === certificateId);
      if (certificate) {
        toast.success('Certificate verified successfully!');
        return certificate;
      } else {
        toast.error('Certificate not found or invalid');
        return null;
      }
    } catch (error) {
      toast.error('Failed to verify certificate');
      return null;
    }
  };

  const getUserCertificates = (userEmail: string): Certificate[] => {
    return certificates.filter(cert => cert.studentEmail.toLowerCase() === userEmail.toLowerCase());
  };

  const connectWallet = async (): Promise<void> => {
    try {
      // Simulate wallet connection
      toast.success('Wallet connected successfully!');
      setIsConnected(true);
      setAccount('0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c');
    } catch (error) {
      toast.error('Failed to connect wallet');
      throw error;
    }
  };

  const value: BlockchainContextType = {
    certificates,
    isConnected,
    account,
    issueCertificate,
    verifyCertificate,
    getUserCertificates,
    connectWallet,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};