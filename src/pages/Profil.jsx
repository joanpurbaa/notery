import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/Header";
import { TransactionHistoryData } from "../data/TransactionHistoryData";
import { ProductData } from "../data/ProductData";
import Star from "../../public/icon/star";
import Comment from "../../public/icon/comment";
import Heart from "../../public/icon/heart";
import ThumbsUp from "../../public/icon/thumbsUp";
import Filter from "../../public/icon/filter";
import Pen from "../../public/icon/pen";
import { TopCreatorData } from "../data/TopCreatorData";
import Major from "../../public/icon/major";
import Plus from "../../public/icon/plus";
import { Navigate } from "react-router-dom";
import { showNoteByUserId } from "../services/notes";

export default function Profil() {
	const creator = TopCreatorData[0];

	const userData = JSON.parse(localStorage.getItem("user"));
	const filename = userData.foto_profil?.split("/").pop();
	const imageUrl = `http://127.0.0.1:8000/storage/foto_profil/${filename}`;

	showNoteByUserId(localStorage.getItem("token")).then((result) => {
		console.log(result?.data);
	});

	if (!localStorage.getItem("token")) {
		return <Navigate to="/login" replace />;
	}

	return (
		<main className="w-full h-full bg-[#F9F9F9]">
			<Header />
			<section className="relative grid grid-cols-12 items-start pt-30 pb-10 px-10 gap-5">
				<div className="grid grid-col-5 col-span-3 gap-5">
					<div className="top-30 self-start col-span-3 bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between items-center">
							<h3 className="text-xl font-semibold">Detail Pendidikan</h3>
							<button
								onClick={""}
								className="flex items-center gap-2 text bg-white border border-[#E5E5E5] rounded-lg px-4 py-2 shadow-2xl">
								<span>Edit</span>
								<Pen className="w-4 h-4" />
							</button>
						</div>
						<div className="h-[0.5px] bg-[#E5E5E5]"></div>
						<div className="flex flex-col gap-3">
							<div className="space-y-1">
								<p className="text-gray-400">Fakultas</p>
								<p className="font-semibold">Teknik Informatika</p>
							</div>
							<div className="space-y-1">
								<p className="text-gray-400">Jurusan</p>
								<p className="font-semibold">Administrasi Bisnis</p>
							</div>
							<div className="space-y-1">
								<p className="text-gray-400">Semester</p>
								<p className="font-semibold">Semester 4</p>
							</div>
							<div className="space-y-1">
								<p className="text-gray-400">Matkul Favorit</p>
								<p className="font-semibold">Web Programming Language</p>
							</div>
						</div>
					</div>
					<div className="sticky top-30 self-start col-span-3 bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between items-center">
							<h3 className="text-xl font-semibold">Riwayat Transaksi</h3>
							<ChevronRight className="w-8 h-8 border border-[#E5E5E5] rounded-md" />
						</div>
						<div className="h-[0.5px] bg-[#E5E5E5]"></div>
						{TransactionHistoryData.map((transactionData, index) => (
							<div
								key={index}
								className="flex border border-[#E5E5E5] p-3 rounded-md gap-3">
								<img
									className="w-[70px] h-[70px] rounded-md"
									src={transactionData.image}
									alt=""
								/>
								<div className="w-full flex flex-col justify-around">
									<div className="flex justify-between">
										<p
											className={`${
												transactionData.status == "Dibeli"
													? "text-success-500"
													: "text-amber-500"
											} font-semibold`}>
											{transactionData.status}
										</p>
										<p className="text-gray-400">{transactionData.time}j lalu</p>
									</div>
									<p className="font-semibold">{transactionData.title}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-6 col-span-9">
					<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between items-center">
							<h4 className="text-xl font-semibold">Deskripsi</h4>
							<button
								onClick={""}
								className="flex items-center gap-2 text bg-white border border-[#E5E5E5] rounded-lg px-4 py-2 shadow-2xl">
								<span>Edit</span>
								<Pen className="w-4 h-4" />
							</button>
						</div>
						<div className="h-[0.5px] bg-[#E5E5E5]"></div>
						<div className="flex flex-col gap-5">
							<div className="flex gap-5">
								<img className="w-14 h-14 rounded-lg" alt="Profile" src={imageUrl} />
								<div className="flex flex-col gap-1">
									<div className="flex flex-row gap-5 items-center">
										<h1 className="font-semibold">{userData.username}</h1>
										<span className="bg-amber-50 flex items-center flex-row gap-2 rounded-md px-1 py-1">
											<Major className="w-5 h-5" />
											<p className="text-amber-500">{creator.major}</p>
										</span>
									</div>
									<p className="text-gray-400">
										Hi, kalian bisa beli catatan ku buat dapetin versi catetan yang lebih
										lengkap, jelas, dan ada latihan soalnya.
									</p>
								</div>
							</div>
							<div className="flex items-center justify-center bg-gray-100 w-full h-[70px] rounded-xl flex-row gap-5">
								<div className="flex flex-col items-center">
									<p>{creator.rating}</p>
									<p className="text-gray-500">Ratting</p>
								</div>

								<div className="w-[0.8px] h-6 bg-[#cecece]"></div>

								<div className="flex flex-col items-center">
									<p>{creator.notes}</p>
									<p className="text-gray-500">Catatan</p>
								</div>

								<div className="w-[0.8px] h-6 bg-[#cecece]"></div>

								<div className="flex flex-col items-center">
									<p>{creator.sold}</p>
									<p className="text-gray-500">Terjual</p>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between">
							<h3 className="text-xl font-semibold pt-2">
								Dijual ({ProductData.length})
							</h3>
							<div className="flex flex-row gap-5">
								<button className="bg-white border border-[#E5E5E5] rounded-lg px-4 py-2 shadow-2xl">
									<span className="flex flex-row items-center">
										Tambah
										<Plus className="w-5 h-6 ml-2" />
									</span>
								</button>
								<button className="bg-white border border-[#E5E5E5] rounded-lg px-4 py-2 shadow-2xl">
									<span className="flex flex-row items-center">
										Filter
										<Filter className="w-5 h-6 ml-2" />
									</span>
								</button>
								<div className="flex flex-row gap-2">
									<div className="bg-white border border-[#E5E5E5] rounded-md p-2">
										<ChevronLeft />
									</div>
									<div className="bg-white border border-[#E5E5E5] rounded-md p-2">
										<ChevronRight />
									</div>
								</div>
							</div>
						</div>
						<div className="h-[0.5px] bg-[#E5E5E5]"></div>
						<div className="grid grid-cols-12 gap-5">
							{ProductData.map((product, index) => (
								<div key={index} className="col-span-6 rounded-md">
									<div className="relative h-[250px] backgroundCover flex flex-col justify-between rounded-t-xl p-5">
										<div className="z-10 w-full flex justify-end">
											<div className="flex items-center bg-white px-5 py-3 rounded-md gap-2">
												<ThumbsUp className="w-5 h-6" />
												<p className="text-amber-500">Favorit</p>
											</div>
										</div>
										<div className="w-full z-10">
											<p className="text-2xl text-white">{product.title}</p>
										</div>
										<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-b from-transparent to-black">
											<div className="w-full h-full flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
												<a
													className="bg-white text-black font-medium px-7 py-3 rounded-md"
													href="">
													Lihat
												</a>
											</div>
										</div>
									</div>
									<div className="flex justify-between border-l border-r border-b border-[#E5E5E5] p-5 rounded-b-xl">
										<div className="flex gap-5">
											<div className="flex gap-2">
												<Star className="w-7 h-7" />
												<p className="text-amber-500 font-semibold text-xl">
													{product.star}
												</p>
											</div>
											<div className="flex gap-2">
												<Comment className="w-7 h-7" />
												<p className="text-xl">{product.comments}</p>
											</div>
											<div className="flex gap-2">
												<Heart className="w-7 h-7" color="black" />
												<p className="text-xl">{product.like}</p>
											</div>
										</div>
										<div className="flex gap-1">
											<p className="text-xl">{product.sold}</p>
											<p className="text-xl">Terjual</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
