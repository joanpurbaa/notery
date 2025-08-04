import { AlertCircle, Eye, EyeClosed } from "lucide-react";
import Logo from "../../public/icon/logo";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [credentialError, setCredentialError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();
	const { login } = useAuth();

	const adminAccounts = ["admin1", "admin2"];
	const adminPassword = "rahasia123";

	const mutation = useMutation({
		mutationFn: loginApi,
		onSuccess: (data) => {
			const isAdmin =
				adminAccounts.includes(username) && password === adminPassword;

			if (isAdmin) {
				login(data?.data?.user, data?.data?.access_token);
				localStorage.setItem("admin", "true");
				navigate("/admin");
			} else {
				login(data?.data?.user, data?.data?.access_token);
				localStorage.setItem("admin", "false");
				navigate("/");
			}
		},
		onError: (error) => {
			if (error?.response?.data?.message) {
				setCredentialError(error?.response?.data?.message);
			}
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		const credential = {
			username,
			password,
		};

		mutation.mutate(credential);
	};

	return (
		<main className="w-full h-screen authenticationBackground flex flex-col justify-between p-5">
			<section className="flex items-center gap-5">
				<Logo className="w-[50px]" />
				<h3 className="text-xl font-semibold">Notery</h3>
			</section>
			<section className="w-full flex justify-center items-center">
				<div className="w-[500px]">
					<div className="bg-primary-950 py-4 rounded-t-xl">
						<p className="text-center text-white text-lg">Sign In</p>
					</div>
					<div className="bg-white rounded-b-xl py-10">
						<p className="text-gray-500 text-center pb-5">
							Selamat Datang! Silahkan isi data berikut!
						</p>
						<form onSubmit={handleSubmit} action="" className="px-5">
							<ul className="space-y-5">
								{credentialError && (
									<li className="flex justify-center items-center bg-red-100 border border-red-300 gap-2 rounded-md p-3">
										<AlertCircle className="text-red-400" />
										<p className="text-red-500">{credentialError}</p>
									</li>
								)}
								<li className="flex flex-col space-y-2">
									<label className="font-medium" htmlFor="">
										Username
									</label>
									<input
										onChange={(e) => setUsername(e.target.value)}
										className="w-full border border-gray-400 rounded-md outline-none p-2"
										type="text"
										placeholder="Masukkan Username"
									/>
								</li>
								<li className="flex flex-col space-y-2">
									<label className="font-medium" htmlFor="">
										Password
									</label>
									<div className="flex justify-between items-center border border-gray-400 rounded-md p-2">
										<input
											onChange={(e) => setPassword(e.target.value)}
											className="w-full outline-none"
											type={`${showPassword ? "text" : "password"}`}
											placeholder="Masukkan Password"
										/>
										{showPassword ? (
											<Eye
												onClick={() => setShowPassword(!showPassword)}
												className="cursor-pointer text-gray-500"
											/>
										) : (
											<EyeClosed
												onClick={() => setShowPassword(!showPassword)}
												className="cursor-pointer text-gray-500"
											/>
										)}
									</div>
								</li>
								<li>
									<button
										type="submit"
										className="cursor-pointer w-full bg-primary-950 text-white font-semibold py-3 rounded-md">
										{mutation.isPending ? "Sedang masuk..." : "Masuk"}
									</button>
								</li>
								<li>
									<p className="text-gray-400">
										Belum punya akun?{" "}
										<a href="/register" className="text-primary-800">
											Sign Up
										</a>
									</p>
								</li>
							</ul>
						</form>
					</div>
				</div>
			</section>
			<section></section>
		</main>
	);
}
