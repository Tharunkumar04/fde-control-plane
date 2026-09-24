import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Workflows from './pages/Workflows';
import WorkflowDetail from './pages/WorkflowDetail';
import RunDetail from './pages/RunDetail';
import Knowledge from './pages/Knowledge';
import Tools from './pages/Tools';
import Evaluations from './pages/Evaluations';
import Observability from './pages/Observability';
import Audit from './pages/Audit';
import Incidents from './pages/Incidents';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/workflows/:id" element={<WorkflowDetail />} />
              <Route path="/runs/:id" element={<RunDetail />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/evaluations" element={<Evaluations />} />
              <Route path="/observability" element={<Observability />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/incidents" element={<Incidents />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
