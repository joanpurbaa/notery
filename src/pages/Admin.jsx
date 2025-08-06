import { CircleAlertIcon, PlusIcon } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import {
	addNotesSubmissionToQueueApi,
	getAllReportApi,
	notesSubmissionApi,
	createAnnouncementApi,
} from "../services/admin";
import { useEffect, useState } from "react";

export default function Admin() {
	const [allReports, setAllReports] = useState();
	const [notesSubmission, setNotesSubmission] = useState();
	const [announcementData, setAnnouncementData] = useState({
		title: "",
		body: "",
		files: [],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		getAllReportApi(localStorage.getItem("token")).then((data) =>
			setAllReports(data.data)
		);
	}, []);

	useEffect(() => {
		notesSubmissionApi(localStorage.getItem("token")).then((data) =>
			setNotesSubmission(data.data)
		);
	}, []);

	const handleSubmissionToQueue = (id) => {
		addNotesSubmissionToQueueApi(id, localStorage.getItem("token")).then((data) =>
			console.log(data)
		);

		notesSubmissionApi(localStorage.getItem("token")).then((data) =>
			setNotesSubmission(data.data)
		);
	};

	const handleAnnouncementChange = (field, value) => {
		setAnnouncementData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleAnnouncementSubmit = async (e) => {
		e.preventDefault();

		if (!announcementData.title.trim() || !announcementData.body.trim()) {
			return;
		}

		setIsSubmitting(true);

		try {
			await createAnnouncementApi(announcementData, localStorage.getItem("token"));
			// Reset form after successful submission
			setAnnouncementData({
				title: "",
				body: "",
				files: [],
			});
			// Reset file input
			const fileInput = document.getElementById("files");
			if (fileInput) fileInput.value = "";
		} catch (error) {
			console.error("Error creating announcement:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const isFormValid =
		announcementData.title.trim() && announcementData.body.trim();

	const formatTimeAgo = (timestamp) => {
		try {
			const now = new Date();
			const date = new Date(timestamp);

			if (isNaN(date.getTime())) {
				return "Waktu tidak valid";
			}

			const diffInSeconds = Math.floor((now - date) / 1000);

			if (diffInSeconds < 0) {
				return "Baru saja";
			}

			if (diffInSeconds < 60) {
				return diffInSeconds <= 1 ? "Baru saja" : `${diffInSeconds} detik lalu`;
			}

			const diffInMinutes = Math.floor(diffInSeconds / 60);
			if (diffInMinutes < 60) {
				return `${diffInMinutes} menit lalu`;
			}

			const diffInHours = Math.floor(diffInMinutes / 60);
			if (diffInHours < 24) {
				return `${diffInHours} jam lalu`;
			}

			const diffInDays = Math.floor(diffInHours / 24);
			if (diffInDays < 30) {
				return `${diffInDays} hari lalu`;
			}

			const diffInMonths = Math.floor(diffInDays / 30);
			if (diffInMonths < 12) {
				return `${diffInMonths} bulan lalu`;
			}

			const diffInYears = Math.floor(diffInMonths / 12);
			return `${diffInYears} tahun lalu`;
		} catch (error) {
			console.error("Error formatting time:", error);
			return "Waktu tidak valid";
		}
	};

	return (
		<>
			<main className="w-full h-full bg-[#F9F9F9]">
				<AdminHeader />
				<section className="grid grid-cols-12 gap-5 pt-30 px-10">
					<div className="col-span-3 bg-white rounded-xl shadow-lg p-5">
						<p className="text-xl font-semibold">Laporan</p>
					</div>
					<div className="col-span-3 bg-white rounded-xl shadow-lg p-5">
						<p className="text-xl font-semibold">Pengajuan</p>
					</div>
					<div className="col-span-6 bg-white rounded-xl shadow-lg p-5">
						<p className="text-xl font-semibold">Info Pengumuman</p>
					</div>
				</section>
				<section className="grid grid-cols-12 items-start gap-5 mt-2 px-10">
					<div className="col-span-3 bg-white rounded-xl shadow-lg p-5 space-y-2">
						{Array.isArray(allReports) &&
							allReports.map((data, index) => (
								<div
									key={index}
									className="flex items-start border border-gray-300 rounded-md p-3 gap-3">
									<div className="bg-amber-400 p-2 rounded-full">
										<CircleAlertIcon className="text-white" />
									</div>
									<div className="space-y-2">
										<p>{data.title}</p>
										<div className="flex justify-between">
											<p className="text-amber-500">Laporan {index + 1}</p>
											<p className="text-gray-400">
												{formatTimeAgo(
													data.updateAt || data.updatedAt || data.created_at || new Date()
												)}
											</p>
										</div>
									</div>
								</div>
							))}
					</div>
					<div className="col-span-3 bg-white rounded-xl shadow-lg p-5 space-y-2">
						{Array.isArray(notesSubmission) &&
							notesSubmission.map((data, index) => (
								<div
									key={index}
									className="flex items-start border border-gray-300 rounded-md p-3 gap-3">
									<img
										className="w-[50px] h-[50px] rounded-full object-cover"
										src={data.seller.foto_profil}
										alt=""
									/>
									<div className="w-full space-y-2">
										<div className="flex justify-between">
											<p>{data.title}</p>
											<p className="text-gray-400">
												{formatTimeAgo(
													data.updateAt || data.updatedAt || data.created_at || new Date()
												)}
											</p>
										</div>
										<p>{data.seller.username}</p>
										{data.status == "diproses" ? (
											<div
												onClick={() => handleSubmissionToQueue(data.note_id)}
												className="w-min flex items-center bg-[#5289C7] text-white gap-2 rounded-md p-2">
												<p>Diproses</p>
											</div>
										) : (
											<div
												onClick={() => handleSubmissionToQueue(data.note_id)}
												className="cursor-pointer w-min flex items-center border border-[#5289C7] gap-2 rounded-md p-2">
												<PlusIcon className="text-[#5289C7]" />
												<p className="text-[#5289C7]">Antrean</p>
											</div>
										)}
									</div>
								</div>
							))}
					</div>
					<form
						onSubmit={handleAnnouncementSubmit}
						className="col-span-6 bg-white rounded-xl shadow-lg p-5">
						<ul className="space-y-3">
							<li className="flex flex-col gap-2">
								<label htmlFor="title">Judul</label>
								<textarea
									id="title"
									name="title"
									value={announcementData.title}
									onChange={(e) => handleAnnouncementChange("title", e.target.value)}
									rows={5}
									className="border border-gray-400 rounded-md resize-none p-3"
									placeholder="Masukkan judul"
									required
								/>
							</li>
							<li className="flex flex-col gap-2">
								<label htmlFor="body">Deskripsi</label>
								<textarea
									id="body"
									name="body"
									value={announcementData.body}
									onChange={(e) => handleAnnouncementChange("body", e.target.value)}
									rows={15}
									className="border border-gray-400 rounded-md resize-none p-3"
									placeholder="Masukkan deskripsi"
									required
								/>
							</li>
							<li className="flex justify-end gap-2">
								<button
									type="submit"
									disabled={!isFormValid || isSubmitting}
									className={`w-full font-semibold p-3 rounded-md transition-all duration-200 ${
										isFormValid && !isSubmitting
											? "bg-[#5289C7] text-white cursor-pointer hover:bg-[#4a7ab8]"
											: "bg-gray-300 text-gray-500 cursor-not-allowed"
									}`}>
									{isSubmitting ? "Mengirim..." : "Kirim"}
								</button>
							</li>
						</ul>
					</form>
				</section>
			</main>
		</>
	);
}
