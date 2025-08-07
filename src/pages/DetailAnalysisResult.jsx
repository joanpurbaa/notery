import { useEffect, useState } from "react";
import {
	getDetailAnalysisResultApi,
	handleQueueSubmissionApi,
} from "../services/admin";
import AdminHeader from "../components/AdminHeader";
import { CheckIcon, XIcon } from "lucide-react";

export default function DetailAnalysisResult() {
	const productId = window.location.pathname.split("/")[2];
	const deskripsiPath = window.location.pathname.split("/")[3];

	const [detailNote, setDetailNote] = useState(null);
	const [successPopUp, setSuccessPopUp] = useState(false);
	const [rejectPopUp, setRejectPopUp] = useState(false);

	useEffect(() => {
		getDetailAnalysisResultApi(productId, localStorage.getItem("token")).then(
			(data) => setDetailNote(data.data)
		);
	}, []);

	const approveSubmission = () => {
		const formData = new FormData();

		formData.append("action", "approve");

		handleQueueSubmissionApi(productId, formData, localStorage.getItem("token"))
			.then(() => {
				setSuccessPopUp(true);
			})
			.catch((error) => {
				console.error("Error approving submission:", error);
			});
	};

	const rejectSubmission = () => {
		const formData = new FormData();

		formData.append("action", "reject");

		handleQueueSubmissionApi(productId, formData, localStorage.getItem("token"))
			.then(() => {
				setRejectPopUp(true);
			})
			.catch((error) => {
				console.error("Error rejecting submission:", error);
			});
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
					<div
						onClick={rejectSubmission}
						className="cursor-pointer bg-red-400 text-center text-white font-semibold rounded-md p-3">
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
						<p style={{ whiteSpace: "pre-line" }}>{detailNote.deskripsi}</p>
					)}
				</div>
			</section>

			{successPopUp && (
				<section className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-black/50 p-4">
					<div className="flex flex-col items-center gap-7 bg-white rounded-lg shadow-xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
						<p className="text-lg font-semibold">Verifikasi berhasil</p>
						<CheckIcon className="w-32 h-32 border-4 border-green-400 text-green-400 rounded-full p-5" />
						<p>Catatan berhasil diverifikasi!</p>
						<button
							onClick={() => {
								setSuccessPopUp(false);
								window.location.href = "/analysis-result";
							}}
							className="w-full bg-red-400 text-white font-semibold p-3 rounded-md">
							Tutup
						</button>
					</div>
				</section>
			)}

			{rejectPopUp && (
				<section className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-black/50 p-4">
					<div className="flex flex-col items-center gap-7 bg-white rounded-lg shadow-xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
						<p className="text-lg font-semibold">Penolakan berhasil</p>
						<XIcon className="w-32 h-32 border-4 border-red-400 text-red-400 rounded-full p-5" />
						<p>Catatan berhasil ditolak!</p>
						<button
							onClick={() => {
								setRejectPopUp(false);
								window.location.href = "/analysis-result";
							}}
							className="w-full bg-red-400 text-white font-semibold p-3 rounded-md">
							Tutup
						</button>
					</div>
				</section>
			)}
		</main>
	);
}
