import AdminHeader from "../components/AdminHeader";
import { useEffect, useState } from "react";
import { approvedNoteApi, getNotesSubmissionQueueApi } from "../services/admin";

export default function AnalysisResult() {
	const [allNotes, setAllNotes] = useState();
	const [approvedNote, setApprovedNote] = useState();

	useEffect(() => {
		getNotesSubmissionQueueApi(localStorage.getItem("token")).then((result) => {
			setAllNotes(result?.data);
		});
	}, []);

	useEffect(() => {
		approvedNoteApi(localStorage.getItem("token")).then((result) => {
			setApprovedNote(result?.data);
		});
	}, []);

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
				<section className="grid grid-cols-12 items-start gap-5 pt-30 px-10">
					<div className="col-span-3 bg-white rounded-xl shadow-lg p-5 space-y-5">
						<p className="text-xl font-semibold">Menyetujui</p>
						<div className="h-[1px] bg-[#E5E5E5]"></div>
						{Array.isArray(approvedNote) &&
							approvedNote.map((data, index) => (
								<div
									key={index}
									className="flex items-start border border-gray-300 rounded-md p-3 gap-3">
									<img
										className="w-[50px] h-[50px] rounded-full"
										src={data.seller.foto_profil}
										alt=""
									/>
									<div className="w-full space-y-2">
										<div className="flex justify-between">
											<p className="font-semibold">{data.title}</p>
											<p className="text-gray-400">
												{formatTimeAgo(
													data.updateAt || data.updatedAt || data.created_at || new Date()
												)}
											</p>
										</div>
										<p>{data.seller.username}</p>
										<div className="w-min flex items-center bg-gray-400 gap-2 rounded-md p-2">
											<p className="text-white">{data.status}</p>
										</div>
									</div>
								</div>
							))}
					</div>
					<div className="col-span-9 bg-white rounded-xl shadow-lg p-5 space-y-5">
						<p className="text-xl font-semibold">Dalam Antrean</p>
						<div className="h-[1px] bg-[#E5E5E5]"></div>
						<div className="grid grid-cols-12 gap-5">
							{allNotes && Array.isArray(allNotes) && allNotes.length > 0 ? (
								allNotes.map((product, index) => (
									<div key={index} className="col-span-6 rounded-md">
										<div
											className="relative h-[300px] flex flex-col justify-between bg-no-repeat bg-center bg-cover rounded-t-xl p-5"
											style={{
												backgroundImage: `url(${product.gambar_preview})`,
											}}>
											<div className="w-full z-10">
												<p className="text-2xl text-white">{product.judul}</p>
											</div>
											<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-b from-transparent to-black">
												<div className="w-full h-full flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
											</div>
										</div>
										<div className="flex flex-col border-l border-r border-b border-[#E5E5E5] p-5 rounded-b-xl gap-5">
											<div className="flex justify-between items-center">
												<div className="flex items-center gap-3">
													<img
														className="w-14 h-14 rounded-lg"
														src={product.seller.foto_profil}
														alt=""
													/>
													<div>
														<h1 className="font-semibold">{product.seller.username}</h1>
													</div>
												</div>
											</div>
											<div className="h-[0.5px] bg-[#E5E5E5]"></div>
											<div className="flex gap-2">
												{product.tags &&
												Array.isArray(product.tags) &&
												product.tags.length > 0 ? (
													product.tags.map((tag, tagIndex) => (
														<div key={tagIndex} className="bg-gray-100 px-4 py-2 rounded-md">
															<p className="text-sm">
																{typeof tag === "string"
																	? tag
																	: tag.name || tag.subjectName || "Tag"}
															</p>
														</div>
													))
												) : (
													<div className="bg-gray-100 px-4 py-2 rounded-md">
														<p className="text-sm">Tidak ada tag</p>
													</div>
												)}
											</div>
											<p className="line-clamp-3">{product.deskripsi}</p>
											<div className="h-[0.5px] bg-[#E5E5E5]"></div>
											<a
												href={`/analysis-result/${product.note_id}`}
												className="cursor-pointer bg-[#5289C7] text-center text-white font-semibold rounded-md p-3">
												Cek selangkapnya
											</a>
										</div>
									</div>
								))
							) : (
								<div className="col-span-full text-center py-8">
									<p className="text-gray-500">Tidak notes dalam antrean</p>
								</div>
							)}
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
