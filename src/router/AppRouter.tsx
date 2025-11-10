import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import UsersPage from '../pages/Users/users.page';
import BoardsPage from '../pages/Boards/boards.page';
import BoardDetailPage from '../pages/BoardDetail/board-detail.page';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
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
