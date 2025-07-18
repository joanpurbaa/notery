import Header from "../components/Header";
import PlusIcon from "../../public/icon/plus";
import InfoIcon from "../../public/icon/info";

export default function AddProduct() {
	if (!localStorage.getItem("token")) {
		return <Navigate to="/login" replace />;
	}

	return (
		<main className="w-full h-full bg-[#F9F9F9]">
			<Header />
			<section className="relative flex pt-25 pb-35 justify-center items-center">
				<div className="grid grid-cols-2 gap-x-10 gap-y-8 w-full py-8 px-15 h-screen">
					<div className="bg-white rounded-xl shadow-lg py-8 px-8 flex flex-col gap-5 w-full">
						<h1 className="text-3xl font-semibold">Informasi General</h1>
						<div>
							<p className="text-gray-400 text-xl">Judul</p>
							<input
								className="w-full h-[65px] bg-[#F9F9F9] rounded-md outline-none
                                        p-2 mt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pl-4"
								type="textarea"
								placeholder="Masukkan judul produk"
							/>
						</div>
						<div>
							<p className="text-gray-400 text-xl">Deskripsi</p>
							<textarea
								className="w-full h-[200px] bg-[#F9F9F9] rounded-md outline-none
                                        p-2 mt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pl-4"
								type="textarea"
								placeholder="Masukkan deskripsi produk"
							/>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-lg py-8 px-5 flex flex-col gap-5 w-full">
						<h1 className="text-3xl font-semibold">Media Produk</h1>
						<p className="text-gray-400 text-xl">Unggahan Produk</p>
						<div className="pt-5">
							<div className="flex flex-col justify-center h-[250px] items-center gap-2">
								<label className="inline-block cursor-pointer border-2 border-dashed border-gray-300 rounded-md">
									<span className="flex flex-col justify-center py-20 px-8 text-[#648DEC] rounded-xl font-semibold">
										<PlusIcon className="inline-block mb-2 w-6 h-6 ml-8" />
										Unggah file
									</span>
									<input className="hidden" type="file" />
								</label>
								<span className="bg-[#F2F2F2] text-[#9C9C9C] text-sm px-5 py-2 rounded-xl">
									Masukkan file dengan format .jpg/.jpeg/.png/.pdf
								</span>
								<span className="bg-[#EEC7F9] text-[#A815D4] text-sm px-5 py-2 rounded-xl">
									<InfoIcon className="inline-block mr-2 w-6 h-6" />
									Pastikan file pdf mu bebas dari copy paste ya
								</span>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-lg py-8 flex flex-col gap-5 px-8 w-full">
						<h1 className="text-3xl font-semibold">Khusus</h1>
						<div className="flex flex-col gap-5">
							<div>
								<p className="text-gray-400 text-xl">Fakultas</p>
								<input
									className="w-full h-[65px] rounded-md border border-gray-300
                                        p-2 mt-2 pl-4"
									type="text"
									placeholder="Masukkan nama fakultas"
								/>
							</div>
							<div>
								<p className="text-gray-400 text-xl">Program Studi</p>
								<input
									className="w-full h-[65px] rounded-md border border-gray-300
                                        p-2 mt-2 pl-4"
									type="text"
									placeholder="Masukkan nama program studi"
								/>
							</div>
							<div>
								<p className="text-gray-400 text-xl">Mata Kuliah</p>
								<input
									className="w-full h-[65px] rounded-md border border-gray-300
                                        p-2 mt-2 pl-4"
									type="text"
									placeholder="Masukkan nama mata kuliah"
								/>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl shadow-lg py-8 px-8 w-full flex flex-col gap-5">
						<h1 className="text-3xl font-semibold">Tagar</h1>
						<p className="text-gray-400 text-xl">Tagar Produk</p>
						<div className="flex justify-center h-[250px] items-center">
							<label className="inline-block cursor-pointer">
								<span className="py-8 px-50 bg-[#648DEC] text-white rounded-md font-semibold">
									Tambah
									<PlusIcon className="inline-block ml-2 w-6 h-6" />
								</span>
								<input className="hidden" type="file" />
							</label>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
