import { ChevronRight, ChevronDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import Header from "../components/Header";
import { ProductData } from "../data/ProductData";
import { TopCreatorData } from "../data/TopCreatorData";
import { FakultasData } from "../data/FakultasData";
import { ProdiData } from "../data/ProdiByFakultasData";
import { MataKuliahData } from "../data/MataKuliahByProdiData";

import Star from "../../public/icon/star";
import Comment from "../../public/icon/comment";
import Heart from "../../public/icon/heart";
import ThumbsUp from "../../public/icon/thumbsUp";
import Pen from "../../public/icon/pen";
import Major from "../../public/icon/major";

import { addNoteApi, showNoteByUserId } from "../services/notes";
import {
	getFavoriteCourseApi,
	addFavoriteCourseApi,
	deleteFavoriteCourseApi,
	getNoteByProfilApi,
	getNoteStatusApi,
	getTransactionsHistoryApi,
} from "../services/profile";

export default function Profil() {
	const [addPopUp, setAddPopUp] = useState(false);
	const [editAcademicPopUp, setEditAcademicPopUp] = useState(false);
	const [banner, setBanner] = useState(null);
	const [successPopUp, setSuccessPopUp] = useState(false);
	const [academicSuccessPopUp, setAcademicSuccessPopUp] = useState(false);
	const [isSubmittingAcademic, setIsSubmittingAcademic] = useState(false);

	const [isFakultasOpen, setIsFakultasOpen] = useState(false);
	const [isProdiOpen, setIsProdiOpen] = useState(false);
	const [isMataKuliahOpen, setIsMataKuliahOpen] = useState(false);

	const [selectedFakultasId, setSelectedFakultasId] = useState("");
	const [selectedProdiId, setSelectedProdiId] = useState("");
	const [selectedMataKuliahId, setSelectedMataKuliahId] = useState("");

	const [selectedFakultasName, setSelectedFakultasName] = useState("");
	const [selectedProdiName, setSelectedProdiName] = useState("");
	const [, setSelectedMataKuliahName] = useState("");

	const [fakultasSearch, setFakultasSearch] = useState("");
	const [prodiSearch, setProdiSearch] = useState("");
	const [mataKuliahSearch, setMataKuliahSearch] = useState("");

	const [selectedTags, setSelectedTags] = useState([]);
	const [favoriteCourse, setFavoriteCourse] = useState("");

	const fakultasRef = useRef(null);
	const prodiRef = useRef(null);
	const mataKuliahRef = useRef(null);

	const [productStatus, setProductStatus] = useState("");
	const [noteStatus, setNoteStatus] = useState("");
	const [transactionHistoryData, setTransactionHistoryData] = useState("");

	useEffect(() => {
		getNoteByProfilApi(localStorage.getItem("token")).then((result) =>
			setProductStatus(result.data)
		);

		getNoteStatusApi(localStorage.getItem("token")).then((result) => {
			console.log("Raw noteStatus data:", result.data);
			setNoteStatus(result.data);
		});

		getTransactionsHistoryApi(localStorage.getItem("token")).then((result) => {
			setTransactionHistoryData(result.data.data);
		});
	}, [localStorage.getItem("token")]);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		price: "",
		tags: "",
		semester: "",
	});

	const [academicFormData, setAcademicFormData] = useState({
		faculty_id: "",
		major_id: "",
		semester_id: "",
		course_id: "",
	});

	const userData = JSON.parse(localStorage.getItem("user"));
	const filename = userData.foto_profil?.split("/").pop();
	const imageUrl = `http://127.0.0.1:8000/storage/foto_profil/${filename}`;
	const creator = TopCreatorData[0];

	const getMataKuliahByProdi = (prodiId) => {
		return MataKuliahData.filter((matkul) => matkul.prodi_id === prodiId);
	};

	const getProdiByFakultas = (fakultasId) => {
		return ProdiData.filter((prodi) => prodi.fakultas_id === fakultasId);
	};

	useEffect(() => {
		showNoteByUserId(localStorage.getItem("token"));

		getFavoriteCourseApi(localStorage.getItem("token")).then((result) =>
			setFavoriteCourse(result.data)
		);

		if (userData.faculty_id) {
			setSelectedFakultasId(userData.faculty_id.toString());
			setAcademicFormData((prev) => ({
				...prev,
				faculty_id: userData.faculty_id,
			}));

			const fakultas = FakultasData.find(
				(f) => f.fakultas_id === userData.faculty_id
			);
			if (fakultas) {
				setSelectedFakultasName(fakultas.name);
			}
		}

		if (userData.major_id) {
			setSelectedProdiId(userData.major_id.toString());
			setAcademicFormData((prev) => ({ ...prev, major_id: userData.major_id }));

			const prodi = ProdiData.find((p) => p.prodi_id === userData.major_id);
			if (prodi) {
				setSelectedProdiName(prodi.name);
			}
		}

		if (userData.semester) {
			setAcademicFormData((prev) => ({ ...prev, semester_id: userData.semester }));
		}
	}, [userData.faculty_id, userData.major_id, userData.semester]);

	if (!localStorage.getItem("token")) {
		return <Navigate to="/login" replace />;
	}

	const handleAcademicFormChange = (field, value) => {
		setAcademicFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			setAddPopUp(false);
			setEditAcademicPopUp(false);
		}
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			price: "",
			semester: "",
		});
		setBanner(null);

		setSelectedFakultasId("");
		setSelectedFakultasName("");
		setSelectedProdiId("");
		setSelectedProdiName("");
		setSelectedMataKuliahId("");

		setSelectedTags([]);

		setFakultasSearch("");
		setProdiSearch("");

		setIsFakultasOpen(false);
		setIsProdiOpen(false);
	};

	const resetAcademicForm = () => {
		if (userData.faculty_id) {
			setSelectedFakultasId(userData.faculty_id.toString());
			setAcademicFormData((prev) => ({
				...prev,
				faculty_id: userData.faculty_id,
			}));

			const fakultas = FakultasData.find(
				(f) => f.fakultas_id === userData.faculty_id
			);
			if (fakultas) {
				setSelectedFakultasName(fakultas.name);
			}
		} else {
			setSelectedFakultasId("");
			setSelectedFakultasName("");
			setAcademicFormData((prev) => ({ ...prev, faculty_id: "" }));
		}

		if (userData.major_id) {
			setSelectedProdiId(userData.major_id.toString());
			setAcademicFormData((prev) => ({ ...prev, major_id: userData.major_id }));

			const prodi = ProdiData.find((p) => p.prodi_id === userData.major_id);
			if (prodi) {
				setSelectedProdiName(prodi.name);
			}
		} else {
			setSelectedProdiId("");
			setSelectedProdiName("");
			setAcademicFormData((prev) => ({ ...prev, major_id: "" }));
		}

		if (userData.semester) {
			setAcademicFormData((prev) => ({ ...prev, semester_id: userData.semester }));
		} else {
			setAcademicFormData((prev) => ({ ...prev, semester_id: "" }));
		}

		setSelectedMataKuliahId("");
		setSelectedMataKuliahName("");
		setMataKuliahSearch("");
		setIsMataKuliahOpen(false);
		setAcademicFormData((prev) => ({ ...prev, course_id: "" }));

		setFakultasSearch("");
		setProdiSearch("");

		setIsFakultasOpen(false);
		setIsProdiOpen(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const productData = new FormData();
		productData.append("judul", formData.title);
		productData.append("deskripsi", formData.description);
		productData.append("harga", formData.price);
		selectedTags.forEach((tag) => {
			productData.append(`tag_id[]`, tag.tag_id);
		});
		productData.append("fakultas_id", selectedFakultasId);
		productData.append("prodi_id", selectedProdiId);
		productData.append("matkul_id", setSelectedMataKuliahId);
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

	const handleAcademicSubmit = async (e) => {
		e.preventDefault();
		setIsSubmittingAcademic(true);

		try {
			const academicData = {
				faculty_id: parseInt(academicFormData.faculty_id),
				major_id: parseInt(academicFormData.major_id),
				semester_id: parseInt(academicFormData.semester_id),
			};

			if (academicFormData.course_id) {
				deleteFavoriteCourseApi(
					localStorage.getItem("token"),
					parseInt(favoriteCourse[0]?.course?.course_id)
				).then((result) => console.log(result));

				const courseData = {
					course_id: parseInt(academicFormData.course_id),
				};

				console.log("Sending favorite course data:", courseData);

				const courseResponse = await addFavoriteCourseApi(
					localStorage.getItem("token"),
					courseData
				);

				console.log("Favorite course update response:", courseResponse);
			}

			const updatedUserData = {
				...userData,
				faculty_id: academicData.faculty_id,
				major_id: academicData.major_id,
				semester: academicData.semester_id,
				faculty: selectedFakultasName,
				major: selectedProdiName,
			};

			localStorage.setItem("user", JSON.stringify(updatedUserData));

			getFavoriteCourseApi(localStorage.getItem("token")).then((result) =>
				setFavoriteCourse(result.data)
			);

			setEditAcademicPopUp(false);
			setAcademicSuccessPopUp(true);

			setTimeout(() => {
				setAcademicSuccessPopUp(false);
			}, 3000);
		} catch (error) {
			console.error("Error updating academic/course data:", error);

			if (error.response) {
				console.error("Error response:", error.response.data);
				alert(
					`Gagal memperbarui data: ${error.response.data.message || "Server error"}`
				);
			} else if (error.request) {
				console.error("No response received:", error.request);
				alert("Gagal memperbarui data: Tidak ada respons dari server");
			} else {
				console.error("Error:", error.message);
				alert("Gagal memperbarui data: " + error.message);
			}
		} finally {
			setIsSubmittingAcademic(false);
		}
	};

	const selectFakultas = (fakultas) => {
		setSelectedFakultasId(fakultas.fakultas_id.toString());
		setSelectedFakultasName(fakultas.name);
		setAcademicFormData((prev) => ({
			...prev,
			faculty_id: fakultas.fakultas_id,
		}));

		setSelectedProdiId("");
		setSelectedProdiName("");
		setSelectedMataKuliahId("");
		setAcademicFormData((prev) => ({ ...prev, major_id: "", semester_id: "" }));

		setIsFakultasOpen(false);
		setFakultasSearch("");
	};

	const selectProdi = (prodi) => {
		setSelectedProdiId(prodi.prodi_id.toString());
		setSelectedProdiName(prodi.name);
		setAcademicFormData((prev) => ({ ...prev, major_id: prodi.prodi_id }));

		setSelectedMataKuliahId("");
		setSelectedMataKuliahName("");
		setAcademicFormData((prev) => ({ ...prev, course_id: "" }));

		setIsProdiOpen(false);
		setProdiSearch("");
	};

	const selectMataKuliah = (mataKuliah) => {
		setSelectedMataKuliahId(mataKuliah.matkul_id.toString());
		setSelectedMataKuliahName(mataKuliah.name);
		setAcademicFormData((prev) => ({
			...prev,
			course_id: mataKuliah.matkul_id,
		}));

		setIsMataKuliahOpen(false);
		setMataKuliahSearch("");
	};

	const formComplete =
		banner &&
		formData.title &&
		formData.description &&
		formData.price &&
		selectedTags.length > 0 &&
		selectedFakultasId &&
		selectedProdiId &&
		selectedMataKuliahId &&
		formData.semester;

	const academicFormComplete =
		academicFormData.faculty_id &&
		academicFormData.major_id &&
		academicFormData.semester_id;

	const filteredFakultas = FakultasData.filter((fakultas) =>
		fakultas.name.toLowerCase().includes(fakultasSearch.toLowerCase())
	);

	const filteredProdi = selectedFakultasId
		? getProdiByFakultas(parseInt(selectedFakultasId)).filter((prodi) =>
				prodi.name.toLowerCase().includes(prodiSearch.toLowerCase())
		  )
		: [];

	const filteredMataKuliah = selectedProdiId
		? getMataKuliahByProdi(parseInt(selectedProdiId)).filter((matkul) =>
				matkul.name.toLowerCase().includes(mataKuliahSearch.toLowerCase())
		  )
		: [];

	return (
		<>
			<main className="w-full h-full bg-[#F9F9F9]">
				<Header />
				<section className="relative grid grid-cols-12 items-start pt-30 pb-10 px-10 gap-5">
					<div className="grid grid-col-5 col-span-3 gap-5">
						<div className="top-30 self-start col-span-3 bg-white rounded-xl shadow-lg p-5 space-y-5">
							<div className="flex justify-between items-center">
								<h3 className="text-xl font-semibold">Detail Pendidikan</h3>
								<button
									onClick={() => setEditAcademicPopUp(true)}
									className="cursor-pointer flex items-center gap-2 text bg-white border border-[#E5E5E5] rounded-lg px-4 py-2 shadow-2xl">
									<span>Edit</span>
									<Pen className="w-4 h-4" />
								</button>
							</div>
							<div className="h-[0.5px] bg-[#E5E5E5]"></div>
							<div className="flex flex-col gap-3">
								<div className="space-y-1">
									<p className="text-gray-400">Fakultas</p>
									<p className="font-semibold">
										{userData.faculty == null ? "Belum Diisi" : userData.faculty}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-gray-400">Jurusan</p>
									<p className="font-semibold">
										{userData.major == null ? "Belum Diisi" : userData.major}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-gray-400">Semester</p>
									<p className="font-semibold">
										{userData.semester == null ? "Belum Diisi" : userData.semester}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-gray-400">Matkul Favorit</p>
									<p className="font-semibold">
										{Array.isArray(favoriteCourse)
											? favoriteCourse[0]?.course?.nama_mk
											: "Belum Diisi"}
									</p>
								</div>
							</div>
						</div>

						<div className="sticky top-30 self-start col-span-3 bg-white rounded-xl shadow-lg p-5 space-y-5">
							<div className="flex justify-between items-center">
								<h3 className="text-xl font-semibold">Riwayat Transaksi</h3>
								<ChevronRight className="w-8 h-8 border border-[#E5E5E5] rounded-md" />
							</div>
							<div className="h-[0.5px] bg-[#E5E5E5]"></div>
							{/* {TransactionHistoryData.map((transactionData, index) => (
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
							))} */}
							{transactionHistoryData.length == 0 ? (
								<p>Tidak ada transaksi</p>
							) : (
								console.log(transactionHistoryData)
							)}
						</div>
					</div>

					<div className="flex flex-col gap-6 col-span-9">
						<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
							<div className="flex justify-between items-center">
								<h4 className="text-xl font-semibold">Deskripsi</h4>
								<button
									onClick={() => {}}
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
										<p>{productStatus && productStatus.favorite.length}</p>
										<p className="text-gray-500">Favorite</p>
									</div>

									<div className="w-[0.8px] h-6 bg-[#cecece]"></div>

									<div className="flex flex-col items-center">
										<p>{productStatus && productStatus.notes_dibeli.length}</p>
										<p className="text-gray-500">Dibeli</p>
									</div>

									<div className="w-[0.8px] h-6 bg-[#cecece]"></div>

									<div className="flex flex-col items-center">
										<p>{productStatus && productStatus.notes_dijual.length}</p>
										<p className="text-gray-500">Dijual</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
							<h3 className="text-xl font-semibold pt-2">Menunggu verifikasi</h3>
							<div className="h-[0.5px] bg-[#E5E5E5]"></div>
							<div className="grid grid-cols-12 gap-5">
								{noteStatus &&
									noteStatus.menunggu &&
									Array.isArray(noteStatus.menunggu) &&
									noteStatus.menunggu.map((note, index) => {
										const imageUrl = note.gambar_preview?.startsWith("http")
											? note.gambar_preview
											: `http://127.0.0.1:8000/storage/${note.gambar_preview}`;

										return (
											<div key={note.note_id || index} className="col-span-4 rounded-md">
												<div className="relative w-full h-[250px] rounded-xl overflow-hidden">
													<img
														src={imageUrl}
														alt={note.judul || "Preview"}
														className="absolute inset-0 w-full h-full object-cover"
														onLoad={() => console.log(`Image loaded: ${imageUrl}`)}
														onError={(e) => {
															console.error(`Failed to load image: ${imageUrl}`);
															console.error("Error details:", e);
															e.target.style.display = "none";
														}}
													/>
													<div className="absolute inset-0 flex flex-col justify-between p-5 bg-gradient-to-b from-transparent to-black/50">
														<div></div>
														<div className="w-full z-10">
															<p className="text-2xl text-white font-semibold drop-shadow-lg">
																{note.judul}
															</p>
														</div>
													</div>
												</div>
											</div>
										);
									})}

								{(!noteStatus ||
									!noteStatus.menunggu ||
									noteStatus.menunggu.length === 0) && (
									<div className="col-span-12 text-center py-10 text-gray-500">
										Tidak ada catatan yang menunggu verifikasi
									</div>
								)}
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-5 space-y-5">
							<h3 className="text-xl font-semibold pt-2">
								Dijual ({ProductData.length})
							</h3>
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
								Tambah Catatan
							</h2>
							<div className="w-full h-[0.5px] bg-[#E5E5E5]"></div>

							<form onSubmit={handleSubmit} encType="multipart/form-data">
								<div className="flex gap-3 pt-4">
									<button
										type={`${formComplete ? "submit" : "button"}`}
										className={`${
											formComplete
												? "cursor-pointer bg-[#5289C7] hover:bg-[#4a7bb8]"
												: "cursor-not-allowed bg-gray-300"
										} flex-1 px-4 py-2  text-white rounded-md transition-colors`}>
										Tambah
									</button>
								</div>
							</form>
						</div>
					</div>
				</section>
			)}

			{editAcademicPopUp && (
				<section
					className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-black/50 p-4"
					onClick={handleBackdropClick}>
					<div className="w-[800px] bg-white rounded-lg shadow-xl p-6 relative animate-fade-in max-h-[95vh] overflow-y-auto">
						<button
							onClick={() => {
								resetAcademicForm();
								setEditAcademicPopUp(false);
							}}
							className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold z-10">
							×
						</button>

						<div className="space-y-4">
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								Edit Detail Pendidikan
							</h2>
							<div className="w-full h-[0.5px] bg-[#E5E5E5]"></div>

							<form onSubmit={handleAcademicSubmit}>
								<div className="grid grid-cols-12 gap-5 mb-6">
									<div className="col-span-6 flex flex-col gap-3">
										<label className="text-base font-semibold">Fakultas</label>
										<div className="relative" ref={fakultasRef}>
											<button
												type="button"
												onClick={() => setIsFakultasOpen(!isFakultasOpen)}
												className="inline-flex justify-between items-center w-full px-4 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-md hover:border-[#5289C7] focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7] transition-colors">
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
												<div className="absolute z-20 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
													<div className="p-2">
														<input
															type="text"
															placeholder="Cari fakultas..."
															value={fakultasSearch}
															onChange={(e) => setFakultasSearch(e.target.value)}
															className="w-full px-3 py-2 text-sm border border-gray-300 outline-none rounded-md focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
														/>
													</div>
													<div className="max-h-48 overflow-y-auto">
														{filteredFakultas.length > 0 ? (
															filteredFakultas.map((fakultas) => (
																<button
																	key={fakultas.fakultas_id}
																	type="button"
																	onClick={() => selectFakultas(fakultas)}
																	className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
																	{fakultas.name}
																</button>
															))
														) : (
															<div className="px-4 py-2 text-sm text-gray-500">
																Tidak ada hasil ditemukan
															</div>
														)}
													</div>
												</div>
											)}
										</div>
									</div>

									<div className="col-span-6 flex flex-col gap-3">
										<label className="text-base font-semibold">Program Studi</label>
										<div className="relative" ref={prodiRef}>
											<button
												type="button"
												onClick={() => setIsProdiOpen(!isProdiOpen)}
												disabled={!selectedFakultasId}
												className={`inline-flex justify-between items-center w-full px-4 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-md transition-colors ${
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
												<div className="absolute z-20 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
													<div className="p-2">
														<input
															type="text"
															placeholder="Cari program studi..."
															value={prodiSearch}
															onChange={(e) => setProdiSearch(e.target.value)}
															className="w-full px-3 py-2 text-sm border border-gray-300 outline-none rounded-md focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
														/>
													</div>
													<div className="max-h-48 overflow-y-auto">
														{filteredProdi.length > 0 ? (
															filteredProdi.map((prodi) => (
																<button
																	key={prodi.prodi_id}
																	type="button"
																	onClick={() => selectProdi(prodi)}
																	className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
																	{prodi.name}
																</button>
															))
														) : (
															<div className="px-4 py-2 text-sm text-gray-500">
																Tidak ada prodi untuk fakultas ini
															</div>
														)}
													</div>
												</div>
											)}
										</div>
									</div>

									<div className="col-span-12 flex flex-col gap-3">
										<label className="text-base font-semibold">Mata Kuliah Favorit</label>
										<div className="relative" ref={mataKuliahRef}>
											<button
												type="button"
												onClick={() => setIsMataKuliahOpen(!isMataKuliahOpen)}
												disabled={!selectedProdiId}
												className={`inline-flex justify-between items-center w-full px-4 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-md transition-colors ${
													!selectedProdiId
														? "opacity-50 cursor-not-allowed"
														: "hover:border-[#5289C7] focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
												}`}>
												<span className="truncate">
													{favoriteCourse
														? Array.isArray(favoriteCourse)
															? favoriteCourse[0]?.course?.nama_mk
															: "Pilih Mata Kuliah Favorit"
														: "Pilih Mata Kuliah Favorit"}
												</span>
												<ChevronDown
													className={`w-4 h-4 ml-2 transition-transform ${
														isMataKuliahOpen ? "rotate-180" : ""
													}`}
												/>
											</button>
											{isMataKuliahOpen && selectedProdiId && (
												<div className="absolute z-20 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
													<div className="p-2">
														<input
															type="text"
															placeholder="Cari mata kuliah..."
															value={mataKuliahSearch}
															onChange={(e) => setMataKuliahSearch(e.target.value)}
															className="w-full px-3 py-2 text-sm border border-gray-300 outline-none rounded-md focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
														/>
													</div>
													<div className="max-h-48 overflow-y-auto">
														{filteredMataKuliah.length > 0 ? (
															filteredMataKuliah.map((matkul) => (
																<button
																	key={matkul.matkul_id}
																	type="button"
																	onClick={() => selectMataKuliah(matkul)}
																	className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
																	{matkul.name}
																</button>
															))
														) : (
															<div className="px-4 py-2 text-sm text-gray-500">
																{selectedProdiId
																	? "Tidak ada mata kuliah untuk prodi ini"
																	: "Pilih prodi terlebih dahulu"}
															</div>
														)}
													</div>
												</div>
											)}
										</div>
										<p className="text-sm text-gray-500">
											*Opsional - Mata kuliah favorit akan ditampilkan di profil Anda
										</p>
									</div>

									<div className="col-span-12 flex flex-col gap-3">
										<label className="text-base font-semibold">Semester</label>
										<div className="flex items-center gap-5 flex-wrap">
											{(selectedFakultasName === "Fakultas Ilmu Terapan"
												? [1, 2, 3, 4, 5, 6]
												: [1, 2, 3, 4, 5, 6, 7, 8]
											).map((semester) => (
												<div key={semester} className="flex items-center gap-2">
													<input
														type="radio"
														name="academicSemester"
														value={semester}
														checked={
															academicFormData.semester_id === semester.toString() ||
															academicFormData.semester_id === semester
														}
														onChange={(e) =>
															handleAcademicFormChange("semester_id", parseInt(e.target.value))
														}
														className="w-4 h-4 text-[#5289C7] border-gray-300 focus:ring-[#5289C7]"
													/>
													<label className="text-sm font-medium">{semester}</label>
												</div>
											))}
										</div>
									</div>
								</div>

								<div className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={() => {
											resetAcademicForm();
											setEditAcademicPopUp(false);
										}}
										className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
										Batal
									</button>
									<button
										type="submit"
										disabled={!academicFormComplete || isSubmittingAcademic}
										className={`${
											academicFormComplete && !isSubmittingAcademic
												? "cursor-pointer bg-[#5289C7] hover:bg-[#4a7bb8]"
												: "cursor-not-allowed bg-gray-300"
										} flex-1 px-4 py-3 text-white rounded-md transition-colors flex items-center justify-center`}>
										{isSubmittingAcademic ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
												Menyimpan...
											</>
										) : (
											"Simpan Perubahan"
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</section>
			)}

			{academicSuccessPopUp && (
				<div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
					<div className="flex items-center gap-2">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clipRule="evenodd"
							/>
						</svg>
						<span>Data akademik berhasil diperbarui!</span>
					</div>
				</div>
			)}
		</>
	);
}
