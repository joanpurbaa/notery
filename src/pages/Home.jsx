import { HeartIcon, StarIcon } from "lucide-react";
import Header from "../components/Header";
import {
	latestNoteApi,
	likeNoteApi,
	mostLikedNoteApi,
	unLikeNoteApi,
} from "../services/notes";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getTopCreatorApi } from "../services/creator";

export default function Home() {
	const [latestNotes, setLatestNotes] = useState();
	const [mostLikedNotes, setMostLikedNotes] = useState();
	const [topCreator, setTopCreator] = useState();

	useEffect(() => {
		latestNoteApi(localStorage.getItem("token")).then((result) => {
			setLatestNotes(result?.data);
		});
	}, []);

  console.log(latestNotes)

	useEffect(() => {
		mostLikedNoteApi(localStorage.getItem("token")).then((result) => {
			setMostLikedNotes(result?.data);
		});
	}, []);

	useEffect(() => {
		getTopCreatorApi(localStorage.getItem("token")).then((result) =>
			setTopCreator(result?.data)
		);
	}, []);

	const likeNote = (id) => {
		likeNoteApi(id, localStorage.getItem("token")).then((result) => {
			console.log(result);
		});

		latestNoteApi(localStorage.getItem("token")).then((result) => {
			setLatestNotes(result?.data);
		});

		mostLikedNoteApi(localStorage.getItem("token")).then((result) => {
			setMostLikedNotes(result?.data);
		});
	};

	const unLikeNote = (id) => {
		unLikeNoteApi(id, localStorage.getItem("token")).then((result) => {
			console.log(result);
		});

		latestNoteApi(localStorage.getItem("token")).then((result) => {
			setLatestNotes(result?.data);
		});

		mostLikedNoteApi(localStorage.getItem("token")).then((result) => {
			setMostLikedNotes(result?.data);
		});
	};

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

	if (!localStorage.getItem("token")) {
		return <Navigate to="/login" replace />;
	}

	return (
		<main className="w-full h-full bg-[#F9F9F9]">
			<Header />
			<section className="hidden relative xl:grid grid-cols-12 items-center justify-center pt-35 pb-15 px-10 gap-10">
				<div className="col-span-12 bg-white rounded-xl shadow-lg p-5 space-y-5">
					<div className="flex justify-between items-center">
						<h1 className="text-xl font-semibold">Update Saat Ini</h1>
						<a
							href="/latest-note"
							className="bg-gray-500 text-white font-medium p-3 rounded-md">
							Lihat lebih
						</a>
					</div>
					<div className="h-[0.5px] bg-[#E5E5E5]"></div>
					<div className="grid grid-cols-18 gap-5">
						{latestNotes && Array.isArray(latestNotes) && latestNotes.length > 0 ? (
							latestNotes.slice(0, 3).map((product, index) => (
								<div key={product.id || index} className="col-span-6 rounded-md">
									<div className="h-full border-2 border-[#E5E5E5] rounded-xl flex flex-col">
										<div
											className="relative h-[250px] flex flex-col justify-between bg-no-repeat bg-center bg-cover rounded-t-xl"
											style={{
												backgroundImage: `url(${product.gambar_preview})`,
											}}>
											<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-b from-transparent to-black">
												<div className="w-full h-full flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
													<a
														className="bg-white text-black font-medium px-10 py-3 rounded-4xl"
														href={`/note/${product.note_id}`}>
														Lihat
													</a>
												</div>
											</div>
										</div>
										<div className="flex flex-col gap-2 px-5 py-5 flex-1">
											<div className="flex justify-between">
												<p className="text-xl font-semibold">
													{product.judul || "Judul tidak tersedia"}
												</p>
												<div className="flex items-center gap-5">
													<div className="flex items-center gap-2">
														<StarIcon className="w-8 h-8 text-yellow-500 fill-yellow-400" />
														<p className="font-semibold">{product.rating}</p>
													</div>
													<div className="flex items-center gap-2">
														{product.isLiked ? (
															<HeartIcon
																onClick={() => unLikeNote(product.note_id)}
																className="cursor-pointer w-7 h-7 text-red-600 fill-red-400"
															/>
														) : (
															<HeartIcon
																onClick={() => likeNote(product.note_id)}
																className="cursor-pointer w-7 h-7 text-gray-400 fill-transparent"
															/>
														)}
														<p className="font-semibold">{product.jumlah_like}</p>
													</div>
												</div>
											</div>
											<div className="h-[0.5px] bg-[#E5E5E5]"></div>
											<div className="flex flex-col gap-4 flex-1">
												<p className="line-clamp-3 flex-1">
													{product.deskripsi || "Deskripsi tidak tersedia"}
												</p>
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
												<div className="h-[0.5px] bg-[#E5E5E5]"></div>
												<div className="flex justify-between items-center">
													<p className="text-gray-400">
														{formatTimeAgo(
															product.updateAt ||
																product.updatedAt ||
																product.created_at ||
																new Date()
														)}
													</p>
													<p className="font-semibold">
														Rp {new Intl.NumberFormat("id-ID").format(product.harga)}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="col-span-full text-center py-8">
								<p className="text-gray-500">Tidak ada data notes tersedia</p>
							</div>
						)}
					</div>
				</div>
				<div className="col-span-12 bg-white rounded-xl shadow-lg p-5 space-y-5">
					<div className="flex justify-between items-center">
						<h1 className="text-xl font-semibold">Paling Banyak Disukai</h1>
						<a
							href="/most-liked-note"
							className="bg-gray-500 text-white font-medium p-3 rounded-md">
							Lihat lebih
						</a>
					</div>
					<div className="h-[0.5px] bg-[#E5E5E5]"></div>
					<div className="grid grid-cols-18 gap-5">
						{mostLikedNotes &&
						Array.isArray(mostLikedNotes) &&
						mostLikedNotes.length > 0 ? (
							mostLikedNotes.slice(0, 3).map((product, index) => (
								<div key={index} className="col-span-6 rounded-md">
									<div className="h-full border-2 border-[#E5E5E5] rounded-xl flex flex-col">
										<div
											className="relative h-[250px] flex flex-col justify-between bg-no-repeat bg-center bg-cover rounded-t-xl"
											style={{
												backgroundImage: `url(${product.gambar_preview})`,
											}}>
											<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-b from-transparent to-black">
												<div className="w-full h-full flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
													<a
														className="bg-white text-black font-medium px-10 py-3 rounded-4xl"
														href={`/note/${product.note_id}`}>
														Lihat
													</a>
												</div>
											</div>
										</div>
										<div className="flex flex-col gap-2 px-5 py-5 flex-1">
											<p className="text-xl font-semibold">
												{product.judul || "Judul tidak tersedia"}
											</p>
											<div className="h-[0.5px] bg-[#E5E5E5]"></div>
											<div className="flex flex-col gap-4 flex-1">
												<p className="line-clamp-3 flex-1">
													{product.deskripsi || "Deskripsi tidak tersedia"}
												</p>
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
												<div className="h-[0.5px] bg-[#E5E5E5]"></div>
												<div className="flex justify-between items-center">
													<div className="flex items-center gap-5">
														<div className="flex items-center gap-2">
															<StarIcon className="w-8 h-8 text-yellow-500 fill-yellow-400" />
															<p className="font-semibold">{product.rating}</p>
														</div>
														<div className="flex items-center gap-2">
															{product.isLiked ? (
																<HeartIcon
																	onClick={() => unLikeNote(product.note_id)}
																	className="cursor-pointer w-7 h-7 text-red-600 fill-red-400"
																/>
															) : (
																<HeartIcon
																	onClick={() => likeNote(product.note_id)}
																	className="cursor-pointer w-7 h-7"
																/>
															)}
															<p className="font-semibold">{product.jumlah_like}</p>
														</div>
													</div>
													<p className="font-semibold">
														Rp{" "}
														{product.harga.toString().length === 5
															? `${product.harga.toString().slice(0, 2)}.${product.harga
																	.toString()
																	.slice(2)}`
															: product.harga}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="col-span-full text-center py-8">
								<p className="text-gray-500">Tidak ada data notes tersedia</p>
							</div>
						)}
					</div>
				</div>
				<div className="col-span-12 bg-white rounded-xl shadow-lg p-5 space-y-5">
					<div className="flex justify-between items-center">
						<h1 className="text-xl font-semibold">Top Creator</h1>
					</div>
					<div className="h-[0.5px] bg-[#E5E5E5]"></div>
					<div className="grid grid-cols-12 gap-8">
						{Array.isArray(topCreator) &&
							topCreator.map((product, index) => (
								<div key={index} className="col-span-4 rounded-md gap-5">
									<div className="border border-[#E5E5E5] rounded-md p-5 space-y-5">
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-3">
												<img
													className="w-14 h-14 rounded-lg"
													src={product.foto_profil_url}
													alt=""
												/>
												<div>
													<h1 className="font-semibold">{product.username}</h1>
													<p className="text-gray-400">Top Creator</p>
												</div>
											</div>
										</div>
										<div className="h-[0.5px] bg-[#E5E5E5]"></div>
										<div className="flex justify-around items-center border border-[#E5E5E5] rounded-md py-3">
											<div>
												<p className="text-center font-semibold">{product.rating}</p>
												<p className="text-gray-400">Rating</p>
											</div>
											<div className="w-[0.5px] h-10 bg-[#E5E5E5]"></div>
											<div>
												<p className="text-center font-semibold">{product.catatan}</p>
												<p className="text-gray-400">Catatan</p>
											</div>
											<div className="w-[0.5px] h-10 bg-[#E5E5E5]"></div>
											<div>
												<p className="text-center font-semibold">{product.terjual}</p>
												<p className="text-gray-400">Terjual</p>
											</div>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</section>
			<section className="xl:hidden pt-24 relative bg-white">
				<img
					className="bg-mobile w-full"
					src="../public/image/mobile-bg.webp"
					alt=""
				/>
				<div className="container-fluid absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
					<div className="pt-24 bt-home-mobile">
						<a href="#" className="inline-block mr-4">
							<img
								className="ps-5 w-96"
								src="../public/image/bt-andro.webp"
								alt="Google Play"
							/>
						</a>
						<a href="#" className="">
							<img className="ps-2 w-96" src="../public/image/bt-ios.webp" alt="iOS" />
						</a>
					</div>
				</div>
			</section>
		</main>
	);
}
