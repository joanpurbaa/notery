import Logo from "../../public/icon/logo";
import { useLocation } from "react-router";
import Plus from "../../public/icon/plus";
import { useState, useEffect, useRef } from "react";
import Dropzone from "react-dropzone";
import { ChevronDown, FileIcon, LogOutIcon, CheckIcon, X } from "lucide-react";
import { FakultasData } from "../data/FakultasData";
import { ProdiData } from "../data/ProdiByFakultasData";
import { MataKuliahData } from "../data/MataKuliahByProdiData";
import { addNoteApi } from "../services/notes";
import { logout } from "../services/auth";
import { tagsData } from "../data/TagData";

export default function Header() {
	const [addPopUp, setAddPopUp] = useState(false);

	const [bannerFileName, setBannerFileName] = useState("");
	const [bannerErrorType, setBannerErrorType] = useState(false);
	const [banner, setBanner] = useState(null);
	const [bannerPreview, setBannerPreview] = useState("");
	const [successPopUp, setSuccessPopUp] = useState(false);

	const [isFakultasOpen, setIsFakultasOpen] = useState(false);
	const [isProdiOpen, setIsProdiOpen] = useState(false);
	const [isMatkulOpen, setIsMatkulOpen] = useState(false);
	const [isTagsOpen, setIsTagsOpen] = useState(false);

	const [selectedFakultasId, setSelectedFakultasId] = useState("");
	const [selectedProdiId, setSelectedProdiId] = useState("");
	const [selectedMatkulId, setSelectedMatkulId] = useState("");

	const [selectedFakultasName, setSelectedFakultasName] = useState("");
	const [selectedProdiName, setSelectedProdiName] = useState("");
	const [selectedMatkulName, setSelectedMatkulName] = useState("");

	const [fakultasSearch, setFakultasSearch] = useState("");
	const [prodiSearch, setProdiSearch] = useState("");
	const [matkulSearch, setMatkulSearch] = useState("");

	const [selectedTags, setSelectedTags] = useState([]);
	const [tagsSearch, setTagsSearch] = useState("");

	const fakultasRef = useRef(null);
	const prodiRef = useRef(null);
	const matkulRef = useRef(null);
	const tagsRef = useRef(null);

	const location = useLocation();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		price: "",
		tags: "",
		semester: "",
	});

	const maxTagsSelections = 3;

	const getProdiByFakultas = (fakultasId) => {
		return ProdiData.filter((prodi) => prodi.fakultas_id === fakultasId);
	};

	const getMataKuliahByProdi = (prodiId) => {
		return MataKuliahData.filter((matkul) => matkul.prodi_id === prodiId);
	};

	const handleSelectTags = (tagObject) => {
		if (
			selectedTags.length < maxTagsSelections &&
			!selectedTags.some((tag) => tag.tag_id === tagObject.tag_id)
		) {
			setSelectedTags([...selectedTags, tagObject]);
			setTagsSearch("");
		}
	};

	const handleRemoveTags = (tagToRemove) => {
		setSelectedTags(
			selectedTags.filter((tag) => tag.tag_id !== tagToRemove.tag_id)
		);
	};

	const filteredTags = tagsData.filter(
		(tag) =>
			tag.name.toLowerCase().includes(tagsSearch.toLowerCase()) &&
			!selectedTags.some((selectedTag) => selectedTag.tag_id === tag.tag_id)
	);

	useEffect(() => {
		if (addPopUp) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [addPopUp]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (fakultasRef.current && !fakultasRef.current.contains(event.target)) {
				setIsFakultasOpen(false);
			}
			if (prodiRef.current && !prodiRef.current.contains(event.target)) {
				setIsProdiOpen(false);
			}
			if (matkulRef.current && !matkulRef.current.contains(event.target)) {
				setIsMatkulOpen(false);
			}
			if (tagsRef.current && !tagsRef.current.contains(event.target)) {
				setIsTagsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			setAddPopUp(false);
		}
	};

	const handleFormChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			price: "",
			semester: "",
		});
		setBanner(null);
		setBannerPreview("");
		setBannerFileName("");
		setBannerErrorType(false);

		setSelectedFakultasId("");
		setSelectedFakultasName("");
		setSelectedProdiId("");
		setSelectedProdiName("");
		setSelectedMatkulId("");
		setSelectedMatkulName("");

		setSelectedTags([]);

		setFakultasSearch("");
		setProdiSearch("");
		setMatkulSearch("");
		setTagsSearch("");

		setIsFakultasOpen(false);
		setIsProdiOpen(false);
		setIsMatkulOpen(false);
		setIsTagsOpen(false);
	};

	function imageTypeValidation(type) {
		return ["pdf"].includes(type.split("/")[1]?.toLowerCase());
	}

	function handleBanner(files) {
		const file = files[0];
		const isValidType = imageTypeValidation(file.type);

		setBannerFileName(file.name);
		setBannerErrorType(!isValidType);

		if (isValidType) {
			setBanner(file);
			setBannerPreview(URL.createObjectURL(file));
		} else {
			setBanner(null);
			setBannerPreview("");
		}
	}

	const filteredFakultas = FakultasData.filter((fakultas) =>
		fakultas.name.toLowerCase().includes(fakultasSearch.toLowerCase())
	);

	const filteredProdi = selectedFakultasId
		? getProdiByFakultas(parseInt(selectedFakultasId)).filter((prodi) =>
				prodi.name.toLowerCase().includes(prodiSearch.toLowerCase())
		  )
		: [];

	const filteredMatkul = selectedProdiId
		? getMataKuliahByProdi(parseInt(selectedProdiId)).filter((matkul) =>
				matkul.name.toLowerCase().includes(matkulSearch.toLowerCase())
		  )
		: [];

	function selectFakultas(fakultas) {
		setSelectedFakultasId(fakultas.fakultas_id.toString());
		setSelectedFakultasName(fakultas.name);

		setSelectedProdiId("");
		setSelectedProdiName("");
		setSelectedMatkulId("");
		setSelectedMatkulName("");
		handleFormChange("semester", "");

		setIsFakultasOpen(false);
		setFakultasSearch("");
	}

	function selectProdi(prodi) {
		setSelectedProdiId(prodi.prodi_id.toString());
		setSelectedProdiName(prodi.name);

		setSelectedMatkulId("");
		setSelectedMatkulName("");
		handleFormChange("semester", "");

		setIsProdiOpen(false);
		setProdiSearch("");
	}

	function selectMatkul(matkul) {
		setSelectedMatkulId(matkul.matkul_id.toString());
		setSelectedMatkulName(matkul.name);

		handleFormChange("semester", "");

		setIsMatkulOpen(false);
		setMatkulSearch("");
	}

	const formComplete =
		banner &&
		formData.title &&
		formData.description &&
		formData.price &&
		selectedTags.length > 0 &&
		selectedFakultasId &&
		selectedProdiId &&
		selectedMatkulId &&
		formData.semester;

	const handleSubmit = (e) => {
		const productData = new FormData();

		e.preventDefault();

		productData.append("judul", formData.title);
		productData.append("deskripsi", formData.description);
		productData.append("harga", formData.price);
		selectedTags.forEach((tag) => {
			productData.append(`tag_id[]`, tag.tag_id);
		});
		productData.append("fakultas_id", selectedFakultasId);
		productData.append("prodi_id", selectedProdiId);
		productData.append("matkul_id", selectedMatkulId);
		productData.append("semester_id", formData.semester);
		productData.append("files[]", banner);

		addNoteApi(productData, localStorage.getItem("token"));

		productData.forEach((data) => {
			console.log(data);
		});

		resetForm();
		setAddPopUp(false);
		setSuccessPopUp(!successPopUp);
	};

	return (
		<>
			<section className="fixed z-20 w-full bg-white flex justify-between items-center px-10 py-5 xl:shadow-md">
				<div className="flex items-center gap-5">
					<Logo className="w-[50px]" />
					<h3 className="text-xl font-semibold">Notery</h3>
				</div>

				<nav className="hidden md:block">
					<ul className="flex gap-[70px]">
						<li
							className={`${
								location.pathname === "/"
									? "font-semibold text-neutral-950"
									: "text-gray-500"
							}`}>
							<a href="/">Beranda</a>
						</li>
						<li
							className={`${
								location.pathname === "/perpustakaan"
									? "font-semibold text-neutral-950"
									: "text-gray-500"
							}`}>
							<a href="/perpustakaan">Perpustakaan</a>
						</li>
						<li
							className={`${
								location.pathname === "/profil"
									? "font-semibold text-neutral-950"
									: "text-gray-500"
							}`}>
							<a href="/profil">Profil</a>
						</li>
					</ul>
				</nav>

				<div className="flex gap-3 items-center">
					<button
						onClick={() => setAddPopUp(true)}
						className="cursor-pointer bg-[#5289C7] items-center flex gap-2 px-5 py-3 rounded-md text-white hover:bg-[#4a7bb8] transition-colors">
						<Plus className="w-5 h-5" color="white" />
						Tambah Produk
					</button>
					<button
						onClick={logout}
						className="cursor-pointer bg-red-400 items-center flex gap-2 px-5 py-3 rounded-md text-white hover:bg-red-500 transition-colors">
						<LogOutIcon />
						Keluar
					</button>
				</div>
			</section>

			{addPopUp && (
				<section
					className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-black/50 p-4"
					onClick={handleBackdropClick}>
					<div className="w-[1000px] bg-white rounded-lg shadow-xl p-6 relative animate-fade-in max-h-[95vh] overflow-y-auto">
						<button
							onClick={() => {
								resetForm();
								setAddPopUp(false);
							}}
							className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold z-10">
							×
						</button>

						<div className="space-y-4">
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								Buat Produk
							</h2>
							<div className="w-full h-[0.5px] bg-[#E5E5E5]"></div>

							<form onSubmit={handleSubmit} encType="multipart/form-data">
								<div className="grid grid-cols-12 gap-3 mb-4">
									<div className="col-span-12">
										<Dropzone onDrop={handleBanner}>
											{({ getRootProps, getInputProps }) => (
												<div
													{...getRootProps()}
													className="flex justify-between items-center bg-[#F9F9F9] border-2 border-[#E5E5E5] border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors px-2 py-3">
													{bannerPreview ? (
														<>
															<p className="flex items-center gap-2">
																<FileIcon />
																{bannerFileName}
															</p>
															<p className="text-gray-400">Klik untuk mengubah file</p>
														</>
													) : (
														<div className="w-full flex items-center justify-between">
															<p>Klik atau Drag and Drop untuk mengupload</p>
															<p>PDF saja</p>
														</div>
													)}
													<input {...getInputProps()} />
												</div>
											)}
										</Dropzone>
										{bannerErrorType && (
											<p className="text-red-500 text-xs mt-1">
												Format file tidak didukung. Gunakan JPG, PNG, atau JPEG.
											</p>
										)}
									</div>

									<div className="col-span-12">
										<div className="space-y-3">
											<div>
												<input
													className="w-full bg-[#F9F9F9] border border-[#E5E5E5] p-3 rounded-md outline-none focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
													type="text"
													placeholder="Masukkan Judul"
													value={formData.title}
													onChange={(e) => handleFormChange("title", e.target.value)}
												/>
											</div>

											<div>
												<textarea
													className="h-[200px] w-full bg-[#F9F9F9] border border-[#E5E5E5] p-3 rounded-md outline-none resize-none focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
													placeholder="Deskripsi Produkmu"
													value={formData.description}
													onChange={(e) => handleFormChange("description", e.target.value)}
												/>
											</div>

											<div>
												<input
													className="w-full bg-[#F9F9F9] border border-[#E5E5E5] p-3 rounded-md outline-none focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
													type="number"
													placeholder="Masukkan Harga"
													value={formData.price}
													onChange={(e) => handleFormChange("price", e.target.value)}
												/>
											</div>

											<div>
												<div className="flex flex-wrap gap-2 mb-2">
													{selectedTags.map((tag) => (
														<div
															key={tag.tag_id}
															className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
															<span>{tag.name}</span>
															<button
																type="button"
																onClick={() => handleRemoveTags(tag)}
																className="hover:bg-blue-600 rounded-full p-0.5">
																<X className="w-3 h-3" />
															</button>
														</div>
													))}
												</div>

												<div className="relative" ref={tagsRef}>
													<button
														type="button"
														onClick={() => {
															if (selectedTags.length < maxTagsSelections) {
																setIsTagsOpen(!isTagsOpen);
															}
														}}
														disabled={selectedTags.length >= maxTagsSelections}
														className={`inline-flex justify-between items-center w-full px-4 py-2 text-gray-700 bg-[#F9F9F9] border border-[#E5E5E5] rounded-md transition-colors ${
															selectedTags.length >= maxTagsSelections
																? "opacity-50 cursor-not-allowed"
																: "hover:border-[#5289C7] focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
														}`}>
														<span className="truncate text-gray-500">
															{selectedTags.length >= maxTagsSelections
																? `Maximum ${maxTagsSelections} jenis materi dipilih`
																: selectedTags.length > 0
																? `${selectedTags.length} jenis materi dipilih`
																: "Pilih Jenis Materi"}
														</span>
														<ChevronDown
															className={`w-4 h-4 ml-2 transition-transform ${
																isTagsOpen ? "rotate-180" : ""
															}`}
														/>
													</button>
													{isTagsOpen && selectedTags.length < maxTagsSelections && (
														<div className="absolute z-20 w-full mt-2 bg-white border border-gray-500 rounded-md shadow-lg max-h-60 overflow-hidden">
															<div className="p-2">
																<input
																	type="text"
																	placeholder="Cari jenis materi..."
																	value={tagsSearch}
																	onChange={(e) => setTagsSearch(e.target.value)}
																	className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 outline-none rounded-md focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
																/>
															</div>
															<div className="max-h-48 overflow-y-auto">
																{filteredTags.length > 0 ? (
																	filteredTags.map((tag) => (
																		<button
																			key={tag.tag_id}
																			type="button"
																			onClick={() => handleSelectTags(tag)}
																			className="w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-700">
																			{tag.name}
																		</button>
																	))
																) : (
																	<div className="px-4 py-2 text-xs sm:text-sm text-gray-500">
																		Tidak ada hasil ditemukan
																	</div>
																)}
															</div>
														</div>
													)}
												</div>

												{/* Selection Counter */}
												<div className="text-xs text-gray-500 mt-1">
													{selectedTags.length}/{maxTagsSelections} jenis materi dipilih
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-12 gap-5 mb-6">
									<div className="col-span-6 flex flex-col gap-3">
										<label className="text-xs sm:text-base font-semibold">Fakultas</label>
										<div className="relative" ref={fakultasRef}>
											<button
												type="button"
												onClick={() => setIsFakultasOpen(!isFakultasOpen)}
												className="inline-flex justify-between items-center w-full px-4 py-2 text-xs sm:text-base text-gray-700 bg-white border border-gray-500 rounded-md hover:border-[#5289C7] focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7] transition-colors">
												<span className="truncate">
													{selectedFakultasName || "Pilih Fakultas"}
												</span>
												<ChevronDown
													className={`w-4 h-4 ml-2 transition-transform ${
														isFakultasOpen ? "rotate-180" : ""
													}`}
												/>
											</button>
											{isFakultasOpen && (
												<div className="absolute z-20 w-full mt-2 bg-white border border-gray-500 rounded-md shadow-lg max-h-60 overflow-hidden">
													<div className="p-2">
														<input
															type="text"
															placeholder="Cari fakultas..."
															value={fakultasSearch}
															onChange={(e) => setFakultasSearch(e.target.value)}
															className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 outline-none rounded-md focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
														/>
													</div>
													<div className="max-h-48 overflow-y-auto">
														{filteredFakultas.length > 0 ? (
															filteredFakultas.map((fakultas) => (
																<button
																	key={fakultas.fakultas_id}
																	type="button"
																	onClick={() => selectFakultas(fakultas)}
																	className="w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
																	{fakultas.name}
																</button>
															))
														) : (
															<div className="px-4 py-2 text-xs sm:text-sm text-gray-500">
																Tidak ada hasil ditemukan
															</div>
														)}
													</div>
												</div>
											)}
										</div>
									</div>

									<div className="col-span-6 flex flex-col gap-3">
										<label className="text-xs sm:text-base font-semibold">
											Program Studi
										</label>
										<div className="relative" ref={prodiRef}>
											<button
												type="button"
												onClick={() => setIsProdiOpen(!isProdiOpen)}
												disabled={!selectedFakultasId}
												className={`inline-flex justify-between items-center w-full px-4 py-2 text-xs sm:text-base text-gray-700 bg-white border border-gray-500 rounded-md transition-colors ${
													!selectedFakultasId
														? "opacity-50 cursor-not-allowed"
														: "hover:border-[#5289C7] focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
												}`}>
												<span className="truncate">
													{selectedProdiName || "Pilih Program Studi"}
												</span>
												<ChevronDown
													className={`w-4 h-4 ml-2 transition-transform ${
														isProdiOpen ? "rotate-180" : ""
													}`}
												/>
											</button>
											{isProdiOpen && selectedFakultasId && (
												<div className="absolute z-20 w-full mt-2 bg-white border border-gray-500 rounded-md shadow-lg max-h-60 overflow-hidden">
													<div className="p-2">
														<input
															type="text"
															placeholder="Cari program studi..."
															value={prodiSearch}
															onChange={(e) => setProdiSearch(e.target.value)}
															className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 outline-none rounded-md focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
														/>
													</div>
													<div className="max-h-48 overflow-y-auto">
														{filteredProdi.length > 0 ? (
															filteredProdi.map((prodi) => (
																<button
																	key={prodi.prodi_id}
																	type="button"
																	onClick={() => selectProdi(prodi)}
																	className="w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
																	{prodi.name}
																</button>
															))
														) : (
															<div className="px-4 py-2 text-xs sm:text-sm text-gray-500">
																Tidak ada prodi untuk fakultas ini
															</div>
														)}
													</div>
												</div>
											)}
										</div>
									</div>

									<div className="col-span-12 flex flex-col gap-3">
										<label className="text-xs sm:text-base font-semibold">
											Mata Kuliah
										</label>
										<div className="relative" ref={matkulRef}>
											<button
												type="button"
												onClick={() => setIsMatkulOpen(!isMatkulOpen)}
												disabled={!selectedProdiId}
												className={`inline-flex justify-between items-center w-full px-4 py-2 text-xs sm:text-base text-gray-700 bg-white border border-gray-500 rounded-md transition-colors ${
													!selectedProdiId
														? "opacity-50 cursor-not-allowed"
														: "hover:border-[#5289C7] focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
												}`}>
												<span className="truncate">
													{selectedMatkulName || "Pilih Mata Kuliah"}
												</span>
												<ChevronDown
													className={`w-4 h-4 ml-2 transition-transform ${
														isMatkulOpen ? "rotate-180" : ""
													}`}
												/>
											</button>
											{isMatkulOpen && selectedProdiId && (
												<div className="absolute z-20 w-full mt-2 bg-white border border-gray-500 rounded-md shadow-lg max-h-60 overflow-hidden">
													<div className="p-2">
														<input
															type="text"
															placeholder="Cari mata kuliah..."
															value={matkulSearch}
															onChange={(e) => setMatkulSearch(e.target.value)}
															className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 outline-none rounded-md focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
														/>
													</div>
													<div className="max-h-48 overflow-y-auto">
														{filteredMatkul.length > 0 ? (
															filteredMatkul.map((matkul) => (
																<button
																	key={matkul.matkul_id}
																	type="button"
																	onClick={() => selectMatkul(matkul)}
																	className="w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
																	{matkul.name}
																</button>
															))
														) : (
															<div className="px-4 py-2 text-xs sm:text-sm text-gray-500">
																Tidak ada mata kuliah untuk prodi ini
															</div>
														)}
													</div>
												</div>
											)}
										</div>
									</div>

									<div className="col-span-12 flex flex-col gap-3">
										<label className="text-xs sm:text-base font-semibold">Semester</label>
										<div className="flex items-center gap-5">
											{(selectedFakultasName === "Fakultas Ilmu Terapan"
												? [1, 2, 3, 4, 5, 6]
												: [1, 2, 3, 4, 5, 6, 7, 8]
											).map((semester) => (
												<div key={semester} className="flex items-center gap-1">
													<input
														type="radio"
														name="semester"
														value={semester}
														checked={formData.semester === semester.toString()}
														onChange={(e) => handleFormChange("semester", e.target.value)}
														className="w-4 h-4 text-[#5289C7] border-gray-300"
													/>
													<label className="text-sm">{semester}</label>
												</div>
											))}
										</div>
									</div>
								</div>

								<div className="flex gap-3 pt-4">
									<button
										type={`${formComplete ? "submit" : "button"}`}
										className={`${
											formComplete
												? "cursor-pointer bg-[#5289C7] hover:bg-[#4a7bb8]"
												: "cursor-not-allowed bg-gray-300"
										} flex-1 px-4 py-2  text-white rounded-md transition-colors`}>
										Tambah Produk
									</button>
								</div>
							</form>
						</div>
					</div>
				</section>
			)}

			{successPopUp && (
				<section className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-black/50 p-4">
					<div className="flex flex-col items-center gap-7 bg-white rounded-lg shadow-xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
						<p className="text-lg font-semibold">Catatan kamu berhasil di upload!</p>
						<CheckIcon className="w-32 h-32 border-7 text-green-400 rounded-full p-5" />
						<p>Tunggu untuk verifikasi!</p>
						<button
							onClick={() => setSuccessPopUp(!successPopUp)}
							className="w-full bg-red-400 text-white font-semibold p-3 rounded-md">
							Tutup
						</button>
					</div>
				</section>
			)}
		</>
	);
}
