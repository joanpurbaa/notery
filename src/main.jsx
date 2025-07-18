import { createRoot } from "react-dom/client";
import { StrictMode, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Perpustakaan from "./pages/Perpustakaan.jsx";
import Koleksi from "./pages/Koleksi.jsx";
import Checkout from "./pages/Checkout.jsx";
import TambahProduk from "./pages/AddProduct.jsx";
import Profil from "./pages/Profil.jsx";
import DetailProduct from "./pages/DetailProduct.jsx";

const ErrorBoundary = () => (
	<div className="min-h-screen flex items-center justify-center">
		<div className="text-center">
			<h1 className="text-2xl font-bold text-red-600 mb-4">
				Oops! Something went wrong
			</h1>
			<p className="text-gray-600 mb-4">
				Failed to load the page. Please try again.
			</p>
			<button
				onClick={() => window.location.reload()}
				className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
				Reload Page
			</button>
		</div>
	</div>
);

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "/login",
		element: <Login />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "/register",
		element: <Register />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "/perpustakaan",
		element: <Perpustakaan />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "/koleksi",
		element: <Koleksi />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "/checkout",
		element: <Checkout />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "/tambah-produk",
		element: <TambahProduk />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "/profil",
		element: <Profil />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "/note/:slug",
		element: <DetailProduct />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "/note/:slug/ulasan",
		element: <DetailProduct />,
		errorElement: <ErrorBoundary />,
	},
]);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 5 * 60 * 1000, 
			refetchOnWindowFocus: false,
		},
	},
});

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</QueryClientProvider>
	</StrictMode>
);
