import Logo from "../../public/icon/logo";
import { useLocation } from "react-router";

export default function AdminHeader() {
	const location = useLocation();

	const user = JSON.parse(localStorage.getItem("user"));

	return (
		<>
			<section className="fixed z-20 w-full bg-white flex justify-between items-center px-10 py-5 xl:shadow-md">
				<div className="flex items-center gap-5">
					<Logo className="w-[50px]" />
					<h3 className="text-xl font-semibold">
						Notery<span className="text-primary-700">Admin</span>
					</h3>
				</div>

				<nav className="hidden md:block">
					<ul className="flex gap-[70px]">
						<li
							className={`${
								location.pathname === "/admin"
									? "font-semibold text-neutral-950"
									: "text-gray-500"
							}`}>
							<a href="/admin">Notification</a>
						</li>
						<li
							className={`${
								location.pathname === "/analysis-result"
									? "font-semibold text-neutral-950"
									: "text-gray-500"
							}`}>
							<a href="/analysis-result">Analysis Result</a>
						</li>
						<li
							className={`${
								location.pathname === "/reported"
									? "font-semibold text-neutral-950"
									: "text-gray-500"
							}`}>
							<a href="/reported">Reported</a>
						</li>
					</ul>
				</nav>

				<div className="flex gap-3 items-center">
					<img
						className="w-[50px] h-[50px] rounded-md"
						src={user.foto_profil}
						alt=""
					/>
					<p className="font-semibold">{user.username}</p>
				</div>
			</section>
		</>
	);
}
