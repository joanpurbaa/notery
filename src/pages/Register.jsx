import { Eye, EyeClosed } from "lucide-react";
import Logo from "../../public/icon/logo";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { registerApi } from "../services/auth";
import { useMutation } from "@tanstack/react-query";

export default function Register() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: registerApi,
		onSuccess: () => {
			registerApi({ username, email, password });
			navigate("/login");
		},
		onError: (error) => {
			if (error?.response?.data?.errors?.email[0]) {
				setEmailError(error?.response?.data?.errors?.email[0]);
			}

			if (error?.response?.data?.errors?.username[0]) {
				setUsernameError(error?.response?.data?.errors?.username[0]);
			}

			if (error?.response?.data?.errors?.password[0]) {
				setPasswordError(error?.response?.data?.errors?.password[0]);
			}
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		const credential = {
			username,
			email,
			password,
		};

		mutation.mutate(credential);
	};

	if (localStorage.getItem("token")) {
		return <Navigate to="/" replace />;
	}

	return (
		<main className="w-full h-screen authenticationBackground flex flex-col justify-between p-5">
			<section className="flex items-center gap-5">
				<Logo className="w-[50px]" />
				<h3 className="text-xl font-semibold">Notery</h3>
			</section>
			<section className="w-full flex justify-center items-center">
				<div className="w-[500px]">
					<div className="bg-primary-950 py-4 rounded-t-xl">
						<p className="text-center text-white text-lg">Sign Up</p>
					</div>
					<div className="bg-white rounded-b-xl py-10">
						<p className="text-gray-500 text-center pb-10">
							Selamat Datang! Silahkan isi data berikut!
						</p>
						<form onSubmit={handleSubmit} action="" className="px-5">
							<ul className="space-y-5">
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
									<p className="text-red-500">{usernameError}</p>
								</li>
								<li className="flex flex-col space-y-2">
									<label className="font-medium" htmlFor="">
										Email
									</label>
									<input
										onChange={(e) => setEmail(e.target.value)}
										className="w-full border border-gray-400 rounded-md outline-none p-2"
										type="text"
										placeholder="Masukkan Email"
									/>
									<p className="text-red-500">{emailError}</p>
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
									<p className="text-red-500">{passwordError}</p>
								</li>
								<li>
									<button
										type="submit"
										className="cursor-pointer w-full bg-primary-950 text-white font-semibold py-3 rounded-md">
										{mutation.isPending ? "Sedang daftar..." : "Daftar"}
									</button>
								</li>
								<li>
									<p className="text-gray-400">
										Sudah punya akun?{" "}
										<a href="/login" className="text-primary-800">
											Sign In
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
