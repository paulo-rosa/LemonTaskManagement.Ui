import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Layout from '../layout/Layout';
import LoginPage from '../pages/Login/login.page';
import UsersPage from '../pages/Users/users.page';
import BoardsPage from '../pages/Boards/boards.page';
import BoardDetailPage from '../pages/BoardDetail/board-detail.page';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:userId/boards" element={<BoardsPage />} />
          <Route path="users/:userId/boards/:boardId" element={<BoardDetailPage />} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
