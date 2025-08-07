import { HeartIcon, SearchIcon, StarIcon, ThumbsUpIcon } from "lucide-react";
import Header from "../components/Header";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	favoriteNoteApi,
	getAllNoteApi,
	likeNoteApi,
	searchNoteApi,
	unFavoriteNoteApi,
	unLikeNoteApi,
} from "../services/notes";
import { getTopCreatorApi } from "../services/creator";

export default function Perpustakaan() {
	const [allNotes, setAllNotes] = useState();
	const [topCreator, setTopCreator] = useState();
	const [searchKey, setSearchKey] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		getTopCreatorApi(localStorage.getItem("token")).then((result) =>
			setTopCreator(result?.data)
		);
	}, []);

	useEffect(() => {
		getAllNoteApi(localStorage.getItem("token")).then((result) => {
			setAllNotes(result?.data);
		});
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();

		if (!searchKey || searchKey.trim() === "") {
			getAllNoteApi(localStorage.getItem("token")).then((result) => {
				setAllNotes(result?.data);
				setIsSearching(false);
			});
			return;
		}

		setIsSearching(true);
		searchNoteApi(localStorage.getItem("token"), searchKey.trim())
			.then((result) => {
				console.log(result?.data);
				setAllNotes(result?.data);
			})
			.catch((error) => {
				console.error("Search failed:", error);
				setIsSearching(false);
			})
			.finally(() => {
				setIsSearching(false);
			});
	};

	const clearSearch = () => {
		setSearchKey("");
		setIsSearching(false);
		getAllNoteApi(localStorage.getItem("token")).then((result) => {
			setAllNotes(result?.data);
		});
	};

	const likeNote = async (id) => {
		try {
			await likeNoteApi(id, localStorage.getItem("token"));

			if (isSearching && searchKey.trim()) {
				searchNoteApi(localStorage.getItem("token"), searchKey.trim()).then(
					(result) => {
						setAllNotes(result?.data);
					}
				);
			} else {
				getAllNoteApi(localStorage.getItem("token")).then((result) => {
					setAllNotes(result?.data);
				});
			}
		} catch (error) {
			console.error("Failed to like note:", error);
		}
	};

	const unLikeNote = async (id) => {
		try {
			await unLikeNoteApi(id, localStorage.getItem("token"));

			if (isSearching && searchKey.trim()) {
				searchNoteApi(localStorage.getItem("token"), searchKey.trim()).then(
					(result) => {
						setAllNotes(result?.data);
					}
				);
			} else {
				getAllNoteApi(localStorage.getItem("token")).then((result) => {
					setAllNotes(result?.data);
				});
			}
		} catch (error) {
			console.error("Failed to unlike note:", error);
		}
	};

	const favoriteNote = async (id) => {
		try {
			await favoriteNoteApi(id, localStorage.getItem("token"));

			if (isSearching && searchKey.trim()) {
				searchNoteApi(localStorage.getItem("token"), searchKey.trim()).then(
					(result) => {
						setAllNotes(result?.data);
					}
				);
			} else {
				getAllNoteApi(localStorage.getItem("token")).then((result) => {
					setAllNotes(result?.data);
				});
			}
		} catch (error) {
			console.error("Failed to favorite note:", error);
		}
	};

	const unFavoriteNote = async (id) => {
		try {
			await unFavoriteNoteApi(id, localStorage.getItem("token"));

			if (isSearching && searchKey.trim()) {
				searchNoteApi(localStorage.getItem("token"), searchKey.trim()).then(
					(result) => {
						setAllNotes(result?.data);
					}
				);
			} else {
				getAllNoteApi(localStorage.getItem("token")).then((result) => {
					setAllNotes(result?.data);
				});
			}
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
				</div>
				<div className="col-span-12 space-y-5">
					<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between items-center">
							<h1 className="text-xl font-semibold">🔥 Top Creator</h1>
						</div>
						<div className="h-[0.5px] bg-[#E5E5E5]"></div>
						<div className="grid grid-cols-12 gap-5">
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
					<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between items-center">
							<h1 className="text-xl font-semibold">
								{searchKey.trim()
									? `Hasil pencarian: "${searchKey}"`
									: "Temukan catatan"}
							</h1>
							{searchKey.trim() && (
								<button
									onClick={clearSearch}
									className="text-sm text-gray-500 hover:text-gray-700 underline">
									Tampilkan semua catatan
								</button>
							)}
						</div>
						<div className="h-[200px] bannerBackground2 flex flex-col justify-center items-center rounded-md gap-3">
							<h1 className="text-2xl text-white font-semibold">
								Mau Jual Catatan Kamu?
							</h1>
							<p className="text-white">
								Yuk jual catatan kamu. Pastikan lengkap, jelas, dan menarik ya!{" "}
							</p>
						</div>
						<form onSubmit={handleSearch} className="w-full">
							<ul className="flex gap-2">
								<li className="w-full flex items-center bg-white rounded-md p-3 gap-3 shadow-xl">
									<SearchIcon className="text-gray-400" />
									<input
										value={searchKey}
										onChange={(e) => setSearchKey(e.target.value)}
										className="w-full text-gray-400 placeholder-gray-400 outline-none"
										type="text"
										placeholder="Cari catatan..."
									/>
								</li>
								<li>
									<button
										type="submit"
										disabled={isSearching}
										className="flex items-center bg-[#5289C7] text-white font-semibold p-3 rounded-md gap-2 shadow-lg disabled:opacity-50">
										{isSearching ? "Mencari..." : "Cari"}
									</button>
								</li>
							</ul>
						</form>
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
											<p style={{ whiteSpace: "pre-line" }} className="line-clamp-3">
												{product.deskripsi}
											</p>
											<div className="h-[0.5px] bg-[#E5E5E5]"></div>
											<div className="flex justify-between items-center">
												<div className="flex items-center gap-2">
													<StarIcon className="w-7 h-7 text-yellow-500 fill-yellow-400" />
													<p className="text-amber-500 font-semibold">{product.rating}</p>
												</div>
												<div>
													<p className="font-semibold">
														Rp {new Intl.NumberFormat("id-ID").format(product.harga)}
													</p>
												</div>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="col-span-full text-center py-8">
									<p className="text-gray-500">
										{searchKey.trim()
											? `Tidak ada catatan ditemukan untuk "${searchKey}"`
											: "Tidak ada catatan tersedia"}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
