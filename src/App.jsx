import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { Dashboard } from './pages/admin/Dashboard'
import { ProjectsPage } from './pages/admin/ProjectsPage'
import { ProjectFormPage } from './pages/admin/ProjectFormPage'
import { PagesPage } from './pages/admin/PagesPage'
import { PageBuilderPage } from './pages/admin/PageBuilderPage'
import { PresentationPage } from './pages/public/PresentationPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects/new"
            element={
              <ProtectedRoute>
                <ProjectFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pages"
            element={
              <ProtectedRoute>
                <PagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pages/new"
            element={
              <ProtectedRoute>
                <PageBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pages/:id"
            element={
              <ProtectedRoute>
                <PageBuilderPage />
              </ProtectedRoute>
            }
          />
          
          {/* Public Routes */}
          <Route
            path="/studio-direction-selected-projects/:slug"
            element={<PresentationPage />}
          />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#000000',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
    </AuthProvider>
  )
}

export default App

