import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectRoute = (children) => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default ProtectRoute;
