import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth - redirect to login if not authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  return <DashboardLayout />;
};

export default Dashboard;