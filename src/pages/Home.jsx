import { ChevronLeft, ChevronRight, HeartIcon, StarIcon } from "lucide-react";
import Header from "../components/Header";
import { TopCreatorData } from "../data/TopCreatorData";
import {
	latestNoteApi,
	likeNoteApi,
	mostLikedNoteApi,
	unLikeNoteApi,
} from "../services/notes";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function Home() {
	const [latestNotes, setLatestNotes] = useState();
	const [mostLikedNotes, setMostLikedNotes] = useState();

	useEffect(() => {
		latestNoteApi(localStorage.getItem("token")).then((result) => {
			setLatestNotes(result?.data);
		});
	}, []);

	useEffect(() => {
		mostLikedNoteApi(localStorage.getItem("token")).then((result) => {
			setMostLikedNotes(result?.data);
		});
	}, []);

	const likeNote = (id) => {
		likeNoteApi(id, localStorage.getItem("token")).then((result) => {
			console.log(result);
		});
	};

	const unLikeNote = (id) => {
		unLikeNoteApi(id, localStorage.getItem("token")).then((result) => {
			console.log(result);
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
						<div className="flex flex-row gap-2">
							<div className="bg-white border border-[#E5E5E5] rounded-md p-2">
								<ChevronLeft />
							</div>
							<div className="bg-white border border-[#E5E5E5] rounded-md p-2">
								<ChevronRight />
							</div>
						</div>
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
																className="w-7 h-7 text-red-600 fill-red-400"
															/>
														) : (
															<HeartIcon
																onClick={() => likeNote(product.note_id)}
																className="w-7 h-7"
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
						<h1 className="text-xl font-semibold">Paling Banyak Disukai</h1>
						<div className="flex flex-row gap-2">
							<div className="bg-white border border-[#E5E5E5] rounded-md p-2">
								<ChevronLeft />
							</div>
							<div className="bg-white border border-[#E5E5E5] rounded-md p-2">
								<ChevronRight />
							</div>
						</div>
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
																	className="w-7 h-7 text-red-600 fill-red-400"
																/>
															) : (
																<HeartIcon
																	onClick={() => likeNote(product.note_id)}
																	className="w-7 h-7"
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
						<h1 className="text-xl font-semibold">Top 5 Creator</h1>
					</div>
					<div className="h-[0.5px] bg-[#E5E5E5]"></div>
					<div className="grid grid-cols-12 gap-8">
						{TopCreatorData.map((creator, index) => (
							<div key={index} className="col-span-4 flex flex-col gap-2">
								<div className="bg-white rounded-xl p-2 border border-[#E5E5E5] shadow-lg">
									<div className="flex gap-2 items-center justify-between px-2 py-2">
										<div className="flex items-center gap-2">
											<img
												className="w-14 h-14 rounded-lg"
												alt="Profile"
												src={creator.creatorPhoto}
											/>
											<div className="flex flex-col gap-1">
												<h1 className="font-semibold">{creator.creatorName}</h1>
												<p className="text-gray-400">{creator.status}</p>
											</div>
										</div>
										<span className="flex gap-2">
											<HeartIcon className="w-6 h-6 text-red-500 fill-red-400" />
                      25
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
			<section class="xl:hidden pt-24 relative bg-white">
				<img class="bg-mobile w-full" src="../public/image/mobile-bg.webp" alt="" />
				<div class="container-fluid absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
					<div class="pt-24 bt-home-mobile">
						<a href="#" class="inline-block mr-4">
							<img
								className="ps-5 w-96"
								src="../public/image/bt-andro.webp"
								alt="Google Play"
							/>
						</a>
						<a href="#" class="">
							<img className="ps-2 w-96" src="../public/image/bt-ios.webp" alt="iOS" />
						</a>
					</div>
				</div>
			</section>
		</main>
	);
}
