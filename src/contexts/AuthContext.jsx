import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);

	useEffect(() => {
		const getToken = localStorage.getItem("token");

		if (getToken) {
			setToken(getToken);
		}
	}, []);

	const login = (userData, accessToken) => {
		setUser(userData);
		setToken(accessToken);

		localStorage.setItem("user", JSON.stringify(userData));
		localStorage.setItem("token", accessToken);
	};

	const logout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	const isAuthenticated = !!token;

	return (
		<AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};
