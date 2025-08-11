import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import MainLayout from '../layouts/MainLayout';

// Lazy load components
const Dashboard = lazy(() => import('../pages/Dashboard/index'));
const CustomerManagement = lazy(() => import('../pages/CustomerManagement/index'));
const DealManagement = lazy(() => import('../pages/DealManagement/index'));
const RequirementManagement = lazy(() => import('../pages/RequirementManagement/index'));
const QuotationManagement = lazy(() => import('../pages/QuotationManagement/index'));
const ContractManagement = lazy(() => import('../pages/ContractManagement/index'));
const ContractAppendices = lazy(() => import('../pages/ContractAppendices/index'));
const AcceptanceManagement = lazy(() => import('../pages/AcceptanceManagement/index'));
const InvoiceManagement = lazy(() => import('../pages/InvoiceManagement/index'));
const ContactManagement = lazy(() => import('../pages/Contact/index'));
const Settings = lazy(() => import('../pages/Settings/index'));
const Login = lazy(() => import('../pages/Login/index'));
const PerformanceTest = lazy(() => import('../pages/PerformanceTest/index'));
const Assistant = lazy(() => import('../pages/Assistant'));

const Loading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

// Wrapper component for lazy-loaded routes
const LazyRoute = ({ element: Element }: { element: React.ComponentType }) => (
  <Suspense fallback={<Loading />}>
    <Element />
  </Suspense>
);

const AppRouter = () => {
  const isAuthenticated = true; // TODO: Replace with actual auth check

  // Public routes
  const publicRoutes = [
    { path: '/login', element: <LazyRoute element={Login} /> },
  ];

  // Protected routes
  const protectedRoutes = [
    { path: '/', element: <Navigate to="/dashboard" replace />, index: true },
    { path: 'dashboard', element: <LazyRoute element={Dashboard} /> },
    { path: 'customers', element: <LazyRoute element={CustomerManagement} /> },
    { path: 'deals', element: <LazyRoute element={DealManagement} /> },
    { path: 'requirements', element: <LazyRoute element={RequirementManagement} /> },
    { path: 'quotations', element: <LazyRoute element={QuotationManagement} /> },
    { path: 'contracts', element: <LazyRoute element={ContractManagement} /> },
    { path: 'contract-appendices', element: <LazyRoute element={ContractAppendices} /> },
    { path: 'acceptance', element: <LazyRoute element={AcceptanceManagement} /> },
    { path: 'invoices', element: <LazyRoute element={InvoiceManagement} /> },
    { path: 'contacts', element: <LazyRoute element={ContactManagement} /> },
    { path: 'settings', element: <LazyRoute element={Settings} /> },
    { path: 'performance-test', element: <LazyRoute element={PerformanceTest} /> },
    { path: 'assistant', element: <LazyRoute element={Assistant} /> },
  ];

  return (
    <Routes>
      {/* Public routes */}
      {!isAuthenticated ? (
        <>
          {publicRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        /* Protected routes */
        <Route path="/" element={<MainLayout />}>
          {protectedRoutes.map((route, index) => (
            <Route 
              key={index} 
              index={!!route.index} 
              path={route.path} 
              element={route.element} 
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
};

export default AppRouter;
