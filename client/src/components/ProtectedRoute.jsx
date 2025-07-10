

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, screenLoading } = useSelector(
    (state) => state.userReducer
  );

  if (screenLoading) {
    return (
      <div className="h-screen flex justify-center items-center text-white text-xl">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
