import {
	ChevronDown,
	HeartIcon,
	MessageCircle,
	PlusIcon,
	StarIcon,
	ThumbsDown,
	ThumbsUpIcon,
} from "lucide-react";
import Header from "../components/Header";
import { getReviewApi, showNoteById } from "../services/notes";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function DetailProduct() {
	const productId = window.location.pathname.split("/")[2];
	const ulasanPath = window.location.pathname.split("/")[3];

	const [detailNote, setDetailNote] = useState();

	useEffect(() => {
		showNoteById(productId, localStorage.getItem("token")).then((result) =>
			setDetailNote(result?.data)
		);
	}, [productId]);

  getReviewApi(productId, localStorage.getItem("token")).then((result) => console.log(result));

	if (!localStorage.getItem("token")) {
		return <Navigate to="/login" replace />;
	}

	return (
		<main className="w-full h-screen bg-[#F9F9F9]">
			<Header />
			<section className="grid grid-cols-12 items-start pt-30 pb-10 px-10 gap-10">
				<p className="col-span-12 bg-white text-xl p-4 rounded-lg shadow-md">
					<span className="text-gray-400">Perpustakaan /</span>{" "}
					<span className="font-semibold">Detail Produk</span>
				</p>
				{detailNote && (
					<>
						<div className="col-span-4 bg-white p-4 rounded-lg shadow-md space-y-5">
							<div className="flex justify-between items-center border border-gray-300 p-3 rounded-md">
								<div className="flex items-center gap-3">
									<img
										className="w-14 h-14 rounded-lg"
										src={detailNote?.seller?.foto_profil}
										alt=""
									/>
									<div>
										<h1 className="font-semibold">{detailNote?.seller?.username}</h1>
										{detailNote?.seller?.isTopCreator && (
											<p className="text-gray-400">Top Creator</p>
										)}
									</div>
								</div>
								<div className="flex items-center text-gray-400 gap-2">
									<PlusIcon />
									<p>Ulasan</p>
								</div>
							</div>
							<img
								className="w-full h-[350px] object-cover object-top rounded-md"
								src={detailNote.gambar_preview}
								alt=""
							/>
							<div className="flex justify-between items-center">
								<p className="text-xl font-semibold">{detailNote.judul}</p>
								<HeartIcon className="text-gray-400" />
							</div>
							<div className="flex gap-2">
								{detailNote.tags &&
									detailNote.tags.map((data, index) => (
										<p
											key={index}
											className="bg-gray-100 border border-gray-300 text-gray-400 rounded-md p-2">
											{data}
										</p>
									))}
							</div>
							<div className="h-[0.5px] bg-[#E5E5E5]"></div>
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<StarIcon className="text-yellow-400 fill-yellow-400" />
									<p className="text-yellow-400 font-semibold">
										{detailNote.rating}{" "}
										<span className="text-gray-400 font-normal">|</span>{" "}
										<span className="text-black font-normal">
											{detailNote.jumlah_terjual} Terjual
										</span>
									</p>
								</div>
								<p className="font-semibold">
									Rp{" "}
									{detailNote.harga.toString().length === 5
										? `${detailNote.harga.toString().slice(0, 2)}.${detailNote.harga
												.toString()
												.slice(2)}`
										: detailNote.harga}
								</p>
							</div>
							<div className="flex gap-2">
								<MessageCircle className="w-12 h-12 border border-primary-700 text-primary-700 fill-[#5289C7] rounded-lg p-2" />
								<button className="w-full bg-primary-700 text-white rounded-md">
									Beli Sekarang
								</button>
							</div>
						</div>
						<div className="col-span-8 flex flex-col items-start bg-white p-4 rounded-lg shadow-md space-y-5">
							<div className="flex items-center border border-gray-300 gap-2 p-2 rounded-md">
								<a
									href={`/note/${productId}`}
									className={`cursor-pointer w-[150px] ${
										!ulasanPath && "bg-primary-700 text-white"
									} text-center py-2 rounded-md`}>
									Deskripsi
								</a>
								<a
									href={`/note/${productId}/ulasan`}
									className={`cursor-pointer w-[150px] ${
										ulasanPath && "bg-primary-700 text-white"
									} text-center py-2 rounded-md`}>
									Ulasan
								</a>
							</div>
							<div className="w-full h-[0.5px] bg-[#E5E5E5]"></div>
							{ulasanPath ? (
								<div>
									<div className="flex items-center gap-3">
										<img
											className="w-10 h-10 rounded-md"
											src="../../public/image/jhondoe.jpeg"
											alt=""
										/>
										<p className="font-semibold">Alexandr Wang</p>
										<div className="flex items-center text-yellow-400">
											<StarIcon className="fill-yellow-400" />
											<StarIcon className="fill-yellow-400" />
											<StarIcon className="fill-yellow-400" />
											<StarIcon className="fill-yellow-400" />
											<StarIcon className="fill-yellow-400" />
										</div>
									</div>
									<div className="ps-[51px] space-y-5">
										<p className="text-gray-400">
											Suka banget sama catatan ini. Desainnya rapi dan enak dilihat, jadi
											bikin belajar nggak ngebosenin. Isinya juga jelas, poin-poinnya
											gampang dipahami. Cocok buat yang suka belajar pakai visual. Pokoknya
											nggak nyesel beli.
										</p>
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-3">
												<div className="flex items-center gap-2">
													<ThumbsDown />
													20
												</div>
												<div className="flex items-center gap-2">
													<ThumbsUpIcon />
													200
												</div>
											</div>
											<div className="flex items-center gap-2">
												Respon Penjual
												<ChevronDown />
											</div>
										</div>
									</div>
								</div>
							) : (
								<p>{detailNote.deskripsi}</p>
							)}
						</div>
					</>
				)}
			</section>
		</main>
	);
}
