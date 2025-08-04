import { useEffect, useState } from "react";
import {
	getDetailAnalysisResultApi,
	handleQueueSubmissionApi,
} from "../services/admin";
import AdminHeader from "../components/AdminHeader";

export default function DetailAnalysisResult() {
	const productId = window.location.pathname.split("/")[2];
	const deskripsiPath = window.location.pathname.split("/")[3];

	const [detailNote, setDetailNote] = useState(null);

	useEffect(() => {
		getDetailAnalysisResultApi(productId, localStorage.getItem("token")).then(
			(data) => setDetailNote(data.data)
		);
	}, []);

  console.log(detailNote)

	const approveSubmission = () => {
		const formData = new FormData();

		formData.append("action", "approve");

		handleQueueSubmissionApi(
			productId,
			formData,
			localStorage.getItem("token")
		);
	};

	if (!detailNote) {
		return;
	}

	return (
		<main className="w-full h-full bg-[#F9F9F9]">
			<AdminHeader />
			<section className="grid grid-cols-12 items-start gap-5 pt-30 px-10">
				<div className="col-span-5 bg-white rounded-xl shadow-lg p-5 space-y-5">
					<div className="flex items-center gap-3">
						<img
							className="w-[50px] h-[50px] rounded-md object-cover"
							src={detailNote.seller?.foto_profil}
							alt=""
						/>
						<p className="font-semibold">{detailNote.seller?.username}</p>
					</div>
					<img
						className="w-full h-full rounded-md object-cover"
						src={detailNote.gambar_preview}
						alt=""
					/>
					<p className="text-xl font-semibold">{detailNote.judul}</p>
					<div className="flex gap-2">
						{detailNote.tags.map((data, index) => (
							<p
								key={index}
								className="bg-gray-100 border border-gray-300 text-gray-400 rounded-md p-2">
								{data.nama_tag}
							</p>
						))}
					</div>
					<div
						onClick={approveSubmission}
						className="cursor-pointer bg-[#5289C7] text-center text-white font-semibold rounded-md p-3">
						Setujui
					</div>
					<div className="cursor-pointer bg-red-400 text-center text-white font-semibold rounded-md p-3">
						Tolak
					</div>
				</div>
				<div className="col-span-7 flex flex-col items-start bg-white rounded-xl shadow-lg p-5 space-y-2">
					<div className="flex items-center border border-gray-300 gap-2 p-2 rounded-md">
						<a
							href={`/analysis-result/${productId}`}
							className={`cursor-pointer w-[150px] ${
								!deskripsiPath && "bg-primary-700 text-white"
							} text-center py-2 rounded-md`}>
							Gambar
						</a>
						<a
							href={`/analysis-result/${productId}/deskripsi`}
							className={`cursor-pointer w-[150px] ${
								deskripsiPath && "bg-primary-700 text-white"
							} text-center py-2 rounded-md`}>
							Deskripsi
						</a>
					</div>
					{!deskripsiPath ? (
						<a
							target="_blank"
							href={detailNote.files[0].path_file}
							className="text-white font-semibold bg-[#5289C7] rounded-md p-3">
							Klik disini untuk melihat
						</a>
					) : (
						<p>{detailNote.deskripsi}</p>
					)}
				</div>
			</section>
		</main>
	);
}
