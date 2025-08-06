import { SearchIcon, CheckIcon } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { useEffect, useState, useCallback } from "react";
import {
	closeAccessApi,
	getAllUsersApi,
	openAccessApi,
	sendWarningToUserApi,
} from "../services/admin";

export default function Reported() {
	const [allUsers, setAllUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [warningMessage, setWarningMessage] = useState("");
	const [sendingWarning, setSendingWarning] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [successPopUp, setSuccessPopUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		pageSize: 15,
	});

	const debounce = (func, delay) => {
		let timeoutId;
		return (...args) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func.apply(null, args), delay);
		};
	};

	const fetchUsers = async (search = "", page = 1) => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			const result = await getAllUsersApi(token, {
				search: search.trim(),
				page,
				size: pagination.pageSize,
			});

			setAllUsers(result.data || []);
			setPagination({
				currentPage: result.current_page || 1,
				totalPages: result.last_page || 1,
				totalItems: result.total || 0,
				pageSize: result.per_page || 15,
			});
		} catch (error) {
			console.error("Error fetching users:", error);
			setAllUsers([]);
		} finally {
			setLoading(false);
		}
	};

	const debouncedSearch = useCallback(
		debounce((searchValue) => {
			fetchUsers(searchValue, 1);
		}, 500),
		[]
	);

	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
		if (searchTerm !== "") {
			debouncedSearch(searchTerm);
		} else {
			fetchUsers("", 1);
		}
	}, [searchTerm, debouncedSearch]);

	const handleWarnClick = (user) => {
		setSelectedUser(user);
		setWarningMessage("");
	};

	const handleCloseAccess = (id) => {
		closeAccessApi(id, localStorage.getItem("token"));
	};

	const handleOpenAccess = (id) => {
		openAccessApi(id, localStorage.getItem("token"));
	};

	const handleSendWarning = async (e) => {
		e.preventDefault();

		if (!selectedUser || !warningMessage.trim()) {
			alert("Pilih user dan masukkan pesan peringatan");
			return;
		}

		try {
			setSendingWarning(true);
			const token = localStorage.getItem("token");
			await sendWarningToUserApi(selectedUser.user_id, warningMessage, token);

			setSuccessPopUp(true);
			setWarningMessage("");
		} catch (error) {
			console.error("Error sending warning:", error);
			alert("Gagal mengirim peringatan. Silakan coba lagi.");
		} finally {
			setSendingWarning(false);
		}
	};

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchUsers(searchTerm, newPage);
		}
	};

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);

		if (selectedUser) {
			setSelectedUser(null);
		}
	};

	return (
		<>
			<main className="w-full h-full bg-[#F9F9F9]">
				<AdminHeader />
				<section className="grid grid-cols-12 items-start gap-5 pt-30 px-10">
					<div className="col-span-3 bg-white rounded-xl shadow-lg p-5 space-y-5">
						<form className="flex items-center gap-3 bg-gray-200 rounded-md p-3">
							<SearchIcon className="text-zinc-800" />
							<input
								type="text"
								value={searchTerm}
								onChange={handleSearchChange}
								className="w-full text-zinc-800 placeholder-zinc-800 outline-none bg-transparent"
								placeholder="Cari pengguna"
							/>
						</form>

						{loading ? (
							<div className="flex justify-center items-center py-8">
								<div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
							</div>
						) : allUsers.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								{searchTerm
									? "Tidak ada pengguna yang ditemukan"
									: "Tidak ada data pengguna"}
							</div>
						) : (
							<>
								{allUsers.map((data, index) => (
									<div
										key={data.user_id || index}
										className={`flex items-start border rounded-md p-3 gap-3 transition-colors cursor-pointer ${
											selectedUser?.user_id === data.user_id
												? "border-blue-500 bg-blue-50"
												: "border-gray-300 hover:border-gray-400"
										}`}>
										<img
											className="w-[50px] h-[50px] rounded-full object-cover"
											src={data.foto_profil || "/default-avatar.png"}
											alt={data.username}
											onError={(e) => {
												e.target.src = "/default-avatar.png";
											}}
										/>
										<div className="w-full space-y-2">
											<div className="flex justify-between">
												<p className="font-semibold">{data.username}</p>
												<p className="text-gray-400">5 mnt lalu</p>
											</div>
											<p>{data.jumlah_notes || 0} Dijual</p>
											<div className="w-full flex items-center gap-3">
												<button
													onClick={() => handleWarnClick(data)}
													className="cursor-pointer bg-zinc-800 text-white px-3 py-2 rounded-md text-sm hover:bg-zinc-700 transition-colors">
													Warn
												</button>
												<button
													onClick={() =>
														data.isBanned
															? handleOpenAccess(data.user_id)
															: handleCloseAccess(data.user_id)
													}
													className={`cursor-pointer ${
														data.isBanned
															? "bg-green-400 hover:bg-green-500"
															: "bg-red-400 hover:bg-red-500"
													} text-white px-3 py-2 rounded-md text-sm transition-colors`}>
													{data.isBanned ? "Open access" : "Close access"}
												</button>
											</div>
										</div>
									</div>
								))}

								{pagination.totalPages > 1 && (
									<div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
										<div className="text-sm text-gray-600">
											Menampilkan {(pagination.currentPage - 1) * pagination.pageSize + 1}{" "}
											-{" "}
											{Math.min(
												pagination.currentPage * pagination.pageSize,
												pagination.totalItems
											)}{" "}
											dari {pagination.totalItems} pengguna
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => handlePageChange(pagination.currentPage - 1)}
												disabled={pagination.currentPage === 1}
												className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
												Prev
											</button>
											<span className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
												{pagination.currentPage}
											</span>
											<button
												onClick={() => handlePageChange(pagination.currentPage + 1)}
												disabled={pagination.currentPage === pagination.totalPages}
												className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
												Next
											</button>
										</div>
									</div>
								)}
							</>
						)}
					</div>

					<div className="col-span-9 bg-white rounded-xl shadow-lg p-5 space-y-5">
						<p className="text-xl font-semibold">Peringatan</p>
						<div className="h-[1px] bg-[#E5E5E5]"></div>
						<div className="space-y-3">
							{selectedUser ? (
								<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md">
									<img
										className="w-12 h-12 rounded-full object-cover"
										src={selectedUser.foto_profil || "/default-avatar.png"}
										alt={selectedUser.username}
										onError={(e) => {
											e.target.src = "/default-avatar.png";
										}}
									/>
									<div>
										<p>
											Kepada: <b>{selectedUser.username}</b>
										</p>
										<p className="text-sm text-gray-600">
											{selectedUser.jumlah_notes || 0} item dijual
										</p>
									</div>
								</div>
							) : (
								<div className="p-4 bg-gray-100 rounded-md text-center text-gray-500">
									{searchTerm && allUsers.length === 0 && !loading
										? "Tidak ada pengguna yang ditemukan. Coba kata kunci lain."
										: "Pilih user dari daftar untuk mengirim peringatan"}
								</div>
							)}

							<form onSubmit={handleSendWarning} className="space-y-3">
								<textarea
									value={warningMessage}
									onChange={(e) => setWarningMessage(e.target.value)}
									disabled={!selectedUser}
									rows={10}
									className="w-full border border-gray-400 rounded-md p-3 outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
									placeholder={
										selectedUser
											? "Masukkan detail peringatan"
											: "Pilih user terlebih dahulu"
									}
								/>
								<button
									type="submit"
									disabled={!selectedUser || !warningMessage.trim() || sendingWarning}
									className="cursor-pointer w-full bg-primary-700 text-white font-semibold p-3 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-primary-800 transition-colors flex items-center justify-center gap-2">
									{sendingWarning ? (
										<>
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											Mengirim...
										</>
									) : (
										"Kirim"
									)}
								</button>
							</form>
						</div>
					</div>
				</section>
			</main>

			{successPopUp && (
				<section className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-black/50 p-4">
					<div className="flex flex-col items-center gap-7 bg-white rounded-lg shadow-xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
						<p className="text-lg font-semibold">Peringatan berhasil dikirim!</p>
						<CheckIcon className="w-32 h-32 border-4 border-green-400 text-green-400 rounded-full p-5" />
						<p>Peringatan telah dikirim ke {selectedUser?.username}</p>
						<button
							onClick={() => setSuccessPopUp(false)}
							className="w-full bg-red-400 text-white font-semibold p-3 rounded-md hover:bg-red-500 transition-colors">
							Tutup
						</button>
					</div>
				</section>
			)}
		</>
	);
}
