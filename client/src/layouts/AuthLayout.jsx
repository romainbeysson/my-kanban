import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mon Trello</h1>
          <p className="text-blue-100">Organisez vos projets facilement</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
