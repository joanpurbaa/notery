import Header from "../components/Header";
import { ProductData } from "../data/ProductData";
import Star from "../../public/icon/star";
import Heart from "../../public/icon/heart";
import ThumbsUp from "../../public/icon/thumbsUp";
import QrCode from "../../public/image/qrCode.png";

const product = ProductData[0];

export default function Checkout() {
	return (
		<main className="w-full h-full bg-[#F9F9F9]">
			<Header />
			<section className="relative flex justify-center items-start pt-40 px-10">
				<div className="flex flex-col gap-10 mb-25 bg-white rounded-xl px-12 py-11 shadow-lg">
					<h1 className="text-3xl text-center font-semibold">
						Selesaikan Pembayaran!
					</h1>
					<div className="flex justify-center items-stretch space-x-15">
						<div className="flex flex-col justify-between flex-1 max-w-[650px]">
							<div className="rounded-md">
								<div className="relative h-[250px] backgroundCover flex flex-col justify-between rounded-t-xl p-5">
									<div className="z-10 w-full flex justify-end">
										<div className="flex items-center bg-white px-5 py-3 rounded-md gap-2">
											<ThumbsUp className="w-6 h-6" />
											<p className="text-amber-500 font-medium">Favorit</p>
										</div>
									</div>
									<div className="w-full z-10">
										<p className="text-2xl text-white">{product.title}</p>
									</div>
									<div className="absolute top-0 left-0 z-0 w-full h-full bg-gradient-to-b from-transparent to-black" />
								</div>

								<div className="flex flex-col flex-1 border-l border-r border-b border-[#E5E5E5] p-5 rounded-b-xl gap-5">
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
										<Heart className="w-7 h-7" color="gray" />
									</div>

									<div className="h-[0.5px] bg-[#E5E5E5]" />

									<div className="flex gap-3 flex-wrap">
										{product.subject.map((subj, index) => (
											<p
												key={index}
												className="px-3 py-2 rounded"
												style={{
													color: `#${subj.subjectTextColor}`,
													backgroundColor: `#${subj.subjectBackgroundColor}`,
												}}>
												{subj.subjectName}
											</p>
										))}
									</div>

									<p>{product.description}</p>

									<div className="h-[0.5px] bg-[#E5E5E5]" />

									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											<Star className="w-7 h-7" />
											<p className="text-amber-500 font-semibold">{product.star}</p>
										</div>
										<div>
											<p className="font-semibold">Rp{product.price}</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="w-[0.5px] h-auto bg-[#E5E5E5]"></div>

						<div className="flex-1 flex flex-col items-center gap-8 pt-5">
							<p className="font-semibold text-xl">Rp.11.000</p>
							<img className="w-[300px]" src={QrCode} alt="QR Code" />
							<div className="gap-4 text-center flex flex-col items-center w-full">
								<p className="font-semibold text-xl">Pindai Kode QR</p>
								<p className="text-gray-400 text-base">
									Pindai kode di atas buat selesaikan pembayaran.
								</p>
								<div className="h-[0.5px] w-full bg-[#E5E5E5]"></div>
								<button className="bg-[#F5373B] text-white py-3 rounded-xl w-full h-11">
									Batalkan
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
