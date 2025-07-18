import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Plus,
	SearchIcon,
} from "lucide-react";
import Header from "../components/Header";
import FilePlus from "../../public/icon/filePlus";
import FileAttachment from "../../public/icon/fileAttachment";
import FileHeart from "../../public/icon/fileHeart";
import { TransactionHistoryData } from "../data/TransactionHistoryData";
import { ProductData } from "../data/ProductData";
import { TopCreatorData } from "../data/TopCreatorData";
import Star from "../../public/icon/star";
import Comment from "../../public/icon/comment";
import Heart from "../../public/icon/heart";
import ThumbsUp from "../../public/icon/thumbsUp";
import Filter from "../../public/icon/filter";
import Major from "../../public/icon/major";

export default function Koleksi() {
	return (
		<main className="w-full h-full bg-[#F9F9F9]">
			<Header />
			<section className="relative grid grid-cols-12 items-start pt-40 pb-10 px-10 gap-10">
				<div className="col-span-12 space-y-5">
					<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between items-center">
							<div>
								<div className="col-span-4 flex justify-between items-center rounded-xl">
									<div className="flex items-center gap-3">
										<FileAttachment className="w-12 h-12 bg-orange-400 text-white p-3 rounded-md" />
										<p className="text-xl font-semibold">Dijual (6)</p>
									</div>
								</div>
							</div>
							<div className="flex gap-2">
								<div className="flex items-center gap-3 border border-[#E5E5E5] rounded-md px-5 py-2">
									<p>Tambah</p>
									<Plus className={"w-5 h-5"} />
								</div>
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
						<div className="h-[0.5px] bg-[#E5E5E5]"></div>
						<div className="grid grid-cols-12 gap-5">
							{ProductData.slice(0, 3).map((data, index) => (
								<div key={index} className="col-span-4 rounded-md">
									<div className="relative h-[300px] backgroundCover flex flex-col justify-between rounded-t-xl p-5">
										<div className="z-10 w-full flex justify-end">
											<div className="flex items-center bg-white px-5 py-3 rounded-md gap-2">
												<ThumbsUp className="w-6 h-6" />
												<p className="text-amber-500 font-medium">Favorit</p>
											</div>
										</div>
										<div className="w-full z-10">
											<p className="text-2xl text-white">{data.title}</p>
										</div>
										<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-b from-transparent to-black">
											<div className="w-full h-full flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
												<a
													className="bg-white text-black font-medium px-7 py-3 rounded-full"
													href="">
													Lihat
												</a>
											</div>
										</div>
									</div>
									<div className="flex justify-between border-l border-r border-b border-[#E5E5E5] p-5 rounded-b-xl">
										<div className="flex gap-5">
											<div className="flex items-center gap-2">
												<Star className="w-7 h-7" />
												<p className="text-amber-500 font-semibold">{data.star}</p>
											</div>
											<div className="flex items-center gap-2">
												<Comment className="w-7 h-7" />
												<p>{data.comments}</p>
											</div>
											<div className="flex items-center gap-2">
												<Heart className="w-7 h-7" color={"black"} />
												<p>{data.like}</p>
											</div>
										</div>
										<div>
											<p>{data.sold} Terjual</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between items-center">
							<div>
								<div className="col-span-4 flex justify-between items-center rounded-xl">
									<div className="flex items-center gap-3">
										<FilePlus className="w-12 h-12 bg-green-400 text-white p-3 rounded-md" />
										<p className="text-xl font-semibold">Koleksi Saya (18)</p>
									</div>
								</div>
							</div>
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
						<div className="h-[0.5px] bg-[#E5E5E5]"></div>
						<div className="grid grid-cols-12 gap-5">
							{ProductData.map((data, index) => (
								<div key={index} className="col-span-4 rounded-md">
									<div className="relative h-[300px] backgroundCover flex flex-col justify-end rounded-t-xl p-5">
										<div className="w-full z-10">
											<p className="text-2xl text-white">{data.title}</p>
										</div>
										<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-b from-transparent to-black">
											<div className="w-full h-full flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
												<a
													className="bg-white text-black font-medium px-7 py-3 rounded-full"
													href="">
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
													src={data.creatorPhoto}
													alt=""
												/>
												<div>
													<h1 className="font-semibold">{data.creatorName}</h1>
													<p className="text-gray-400">Top Creator</p>
												</div>
											</div>
											<Heart className={"w-7 h-7"} color="gray" />
										</div>
										<div className="h-[0.5px] bg-[#E5E5E5]"></div>
										<div className="flex gap-3">
											{data.subject.map((data, index) => (
												<p
													key={index}
													style={{
														color: `#${data.subjectTextColor}`,
														backgroundColor: `#${data.subjectBackgroundColor}`,
													}}
													className="px-3 py-2 rounded">
													{data.subjectName}
												</p>
											))}
										</div>
										<p>{data.description}</p>
										<div className="h-[0.5px] bg-[#E5E5E5]"></div>
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-2">
												<Star className="w-7 h-7" />
												<p className="text-amber-500 font-semibold">{data.star}</p>
											</div>
											<div>
												<p className="font-semibold">Rp{data.price}</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
						<div className="flex justify-between items-center">
							<div>
								<div className="col-span-4 flex justify-between items-center rounded-xl">
									<div className="flex items-center gap-3">
										<FileHeart className="w-12 h-12 bg-red-400 text-white p-3 rounded-md" />
										<p className="text-xl font-semibold">Koleksi Saya (4)</p>
									</div>
								</div>
							</div>
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
						<div className="h-[0.5px] bg-[#E5E5E5]"></div>
						<div className="grid grid-cols-12 gap-5">
							{ProductData.map((data, index) => (
								<div key={index} className="col-span-4 rounded-md">
									<div className="relative h-[300px] backgroundCover flex flex-col justify-between rounded-t-xl p-5">
										<div className="z-10 w-full flex justify-end">
											<div className="flex items-center bg-white px-5 py-3 rounded-md gap-2">
												<ThumbsUp className="w-6 h-6" />
												<p className="text-amber-500 font-medium">Favorit</p>
											</div>
										</div>
										<div className="w-full z-10">
											<p className="text-2xl text-white">{data.title}</p>
										</div>
										<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-b from-transparent to-black">
											<div className="w-full h-full flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
												<a
													className="bg-white text-black font-medium px-7 py-3 rounded-full"
													href="">
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
													src={data.creatorPhoto}
													alt=""
												/>
												<div>
													<h1 className="font-semibold">{data.creatorName}</h1>
													<p className="text-gray-400">Top Creator</p>
												</div>
											</div>
											<Heart className={"w-7 h-7"} color="gray" />
										</div>
										<div className="h-[0.5px] bg-[#E5E5E5]"></div>
										<div className="flex gap-3">
											{data.subject.map((data, index) => (
												<p
													key={index}
													style={{
														color: `#${data.subjectTextColor}`,
														backgroundColor: `#${data.subjectBackgroundColor}`,
													}}
													className="px-3 py-2 rounded">
													{data.subjectName}
												</p>
											))}
										</div>
										<p>{data.description}</p>
										<div className="h-[0.5px] bg-[#E5E5E5]"></div>
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-2">
												<Star className="w-7 h-7" />
												<p className="text-amber-500 font-semibold">{data.star}</p>
											</div>
											<div>
												<p className="font-semibold">Rp{data.price}</p>
											</div>
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
