import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	HeartIcon,
	SearchIcon,
	ThumbsUpIcon,
} from "lucide-react";
import Header from "../components/Header";
import { TopCreatorData } from "../data/TopCreatorData";
import Star from "../../public/icon/star";
import Filter from "../../public/icon/filter";
import Major from "../../public/icon/major";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	favoriteNoteApi,
	getAllNoteApi,
	likeNoteApi,
	unFavoriteNoteApi,
	unLikeNoteApi,
} from "../services/notes";

export default function Perpustakaan() {
	const [allNotes, setAllNotes] = useState();

	useEffect(() => {
		getAllNoteApi(localStorage.getItem("token")).then((result) => {
			setAllNotes(result?.data);
		});
	}, []);

	const likeNote = async (id) => {
		try {
			await likeNoteApi(id, localStorage.getItem("token"));

			getAllNoteApi(localStorage.getItem("token")).then((result) => {
				setAllNotes(result?.data);
			});
		} catch (error) {
			console.error("Failed to like note:", error);
		}
	};

	const unLikeNote = async (id) => {
		try {
			await unLikeNoteApi(id, localStorage.getItem("token"));

			getAllNoteApi(localStorage.getItem("token")).then((result) => {
				setAllNotes(result?.data);
			});
		} catch (error) {
			console.error("Failed to unlike note:", error);
		}
	};

	const favoriteNote = async (id) => {
		try {
			await favoriteNoteApi(id, localStorage.getItem("token"));

			getAllNoteApi(localStorage.getItem("token")).then((result) => {
				setAllNotes(result?.data);
			});
		} catch (error) {
			console.error("Failed to favorite note:", error);
		}
	};

	const unFavoriteNote = async (id) => {
		try {
			await unFavoriteNoteApi(id, localStorage.getItem("token"));

			getAllNoteApi(localStorage.getItem("token")).then((result) => {
				setAllNotes(result?.data);
			});
		} catch (error) {
			console.error("Failed to unfavorite note:", error);
		}
	};

	if (!localStorage.getItem("token")) {
		return <Navigate to="/login" replace />;
	}

	return (
		<main className="w-full h-full bg-[#F9F9F9]">
			<Header />
			<section className="relative grid grid-cols-12 items-start pt-40 pb-10 px-10 gap-10">
				<div className="col-start-5 col-end-9 flex flex-col items-center gap-10">
					<h1 className="text-3xl font-bold">Temukan Beragam Catatan!</h1>
					<p className="text-xl text-gray-400 text-center">
						Ga perlu khawatir lagi kalo catatan kamu ga lengkap, karena sekarang udah
						ada Notery!
					</p>
					<form className="w-full">
						<ul className="flex gap-2">
							<li className="w-full flex items-center bg-white rounded-md p-3 gap-3 shadow-lg">
								<SearchIcon className="text-gray-400" />
								<input
									className="w-full text-gray-400 placeholder-gray-400 outline-none"
									type="text"
									placeholder="Cari catatan..."
								/>
							</li>
							<li>
								<button className="flex items-center bg-white font-semibold p-3 rounded-md gap-2 shadow-lg">
									Kategori
									<ChevronDown />
								</button>
							</li>
						</ul>
					</form>
				</div>
				<div className="col-span-12 space-y-5">
					<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between items-center">
							<h1 className="text-xl font-semibold">🔥 Top Creator</h1>
							<div className="flex gap-2">
								<div className="flex items-center gap-3 border border-[#E5E5E5] rounded-md p-2">
									<ChevronLeft className="text-gray-300" />
								</div>
								<div className="flex items-center gap-3 border border-[#E5E5E5] rounded-md p-2">
									<ChevronRight />
								</div>
							</div>
						</div>
						<div className="h-[0.5px] bg-[#E5E5E5]"></div>
						<div className="grid grid-cols-12 gap-5">
							{TopCreatorData.slice(0, 3).map((product, index) => (
								<div key={index} className="col-span-4 rounded-md gap-5">
									<div className="border border-[#E5E5E5] rounded-md p-5 space-y-5">
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-3">
												<img
													className="w-14 h-14 rounded-lg"
													src={product.creatorPhoto}
													alt=""
												/>
												<div>
													<h1 className="font-semibold">{product.creatorName}</h1>
													<p className="text-gray-400">Top Creator</p>
												</div>
											</div>
											<div className="flex items-center gap-2 bg-[#FFFAEB] px-3 py-2">
												<Major className={"w-7 h-7"} />
												<p className="text-amber-500">{product.major}</p>
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
												<p className="text-center font-semibold">{product.notes}</p>
												<p className="text-gray-400">Catatan</p>
											</div>
											<div className="w-[0.5px] h-10 bg-[#E5E5E5]"></div>
											<div>
												<p className="text-center font-semibold">{product.sold}</p>
												<p className="text-gray-400">Terjual</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between items-center">
							<h1 className="text-xl font-semibold">Temukan catatan</h1>
							<div className="flex gap-2">
								<div className="flex items-center gap-3 border border-[#E5E5E5] rounded-md px-5 py-2">
									<p>Filter</p>
									<Filter className={"w-5 h-5"} />
								</div>
								<div className="flex items-center gap-3 border border-[#E5E5E5] rounded-md p-2">
									<ChevronLeft className="text-gray-300" />
								</div>
								<div className="flex items-center gap-3 border border-[#E5E5E5] rounded-md p-2">
									<ChevronRight />
								</div>
							</div>
						</div>
						<div className="h-[200px] bannerBackground2 flex flex-col justify-center items-center rounded-md gap-3">
							<h1 className="text-2xl text-white font-semibold">
								Mau Jual Catatan Kamu?
							</h1>
							<p className="text-white">
								Yuk jual catatan kamu. Pastikan lengkap, jelas, dan menarik ya!{" "}
							</p>
						</div>
						<div className="h-[0.5px] bg-[#E5E5E5]"></div>
						<div className="grid grid-cols-12 gap-5">
							{allNotes && Array.isArray(allNotes) && allNotes.length > 0 ? (
								allNotes.map((product, index) => (
									<div key={index} className="col-span-4 rounded-md">
										<div
											className="relative h-[300px] flex flex-col justify-between bg-no-repeat bg-center bg-cover rounded-t-xl p-5"
											style={{
												backgroundImage: `url(${product.gambar_preview})`,
											}}>
											<div className="z-10 w-full flex justify-end">
												{product.isFavorite ? (
													<div
														onClick={() => unFavoriteNote(product.note_id)}
														className="cursor-pointer flex items-center bg-white px-5 py-3 rounded-md gap-2">
														<ThumbsUpIcon className="w-6 h-6 text-amber-500 fill-amber-400" />
														<p className="text-amber-500 font-medium">Favorit</p>
													</div>
												) : (
													<div
														onClick={() => favoriteNote(product.note_id)}
														className="cursor-pointer flex items-center bg-white px-5 py-3 rounded-md gap-2">
														<ThumbsUpIcon className="w-6 h-6 text-gray-500 fill-gray-400" />
														<p className="text-gray-500 font-medium">Favorit</p>
													</div>
												)}
											</div>
											<div className="w-full z-10">
												<p className="text-2xl text-white">{product.judul}</p>
											</div>
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
														<p className="text-gray-400">Top Creator</p>
													</div>
												</div>
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
											<div className="flex justify-between items-center">
												<div className="flex items-center gap-2">
													<Star className="w-7 h-7" />
													<p className="text-amber-500 font-semibold">{product.rating}</p>
												</div>
												<div>
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
								))
							) : (
								<div className="col-span-full text-center py-8">
									<p className="text-gray-500">Tidak ada product notes tersedia</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
