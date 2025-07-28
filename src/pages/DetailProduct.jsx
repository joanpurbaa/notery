import {
	ChevronDown,
	HeartIcon,
	PlusIcon,
	StarIcon,
	ThumbsDown,
	ThumbsUpIcon,
} from "lucide-react";
import Header from "../components/Header";
import {
	addReviewApi,
	buyNoteApi,
	getReviewApi,
	showNoteById,
	voteReviewApi,
	updatePaymentStatusApi,
} from "../services/notes";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function DetailProduct() {
	const productId = window.location.pathname.split("/")[2];
	const ulasanPath = window.location.pathname.split("/")[3];
	const [comment, setComment] = useState("");
	const [rating, setRating] = useState("");
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const [paymentStatus, setPaymentStatus] = useState(null);

	const formComplete = comment && rating;

	const formData = new FormData();

	const [detailNote, setDetailNote] = useState();
	const [review, setReview] = useState();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const orderId = urlParams.get("order_id");
		const statusCode = urlParams.get("status_code");
		const transactionStatus = urlParams.get("transaction_status");

		if (orderId && statusCode && transactionStatus) {
			console.log("Handling Midtrans redirect:", {
				orderId,
				statusCode,
				transactionStatus,
			});

			if (transactionStatus === "settlement" || statusCode === "200") {
				setPaymentStatus("success");
			} else if (transactionStatus === "pending") {
				setPaymentStatus("pending");
			} else {
				setPaymentStatus("error");
			}

			const cleanUrl = window.location.origin + window.location.pathname;
			window.history.replaceState({}, document.title, cleanUrl);
		}

		showNoteById(productId, localStorage.getItem("token")).then((result) =>
			setDetailNote(result?.data)
		);
	}, [productId]);

	useEffect(() => {
		getReviewApi(productId, localStorage.getItem("token")).then((result) => {
			setReview(result?.data?.reviews);
		});
	}, [productId]);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = import.meta.env.MIDTRANS_SNAP_URL;
		script.setAttribute(
			"data-client-key",
			import.meta.env.VITE_MIDTRANS_CLIENT_KEY
		);
		document.head.appendChild(script);

		return () => {
			if (document.head.contains(script)) {
				document.head.removeChild(script);
			}
		};
	}, []);

	const handleLike = (reviewId, status) => {
		formData.append("tipe_vote", status);

		voteReviewApi(reviewId, localStorage.getItem("token"), formData);

		getReviewApi(productId, localStorage.getItem("token")).then((result) => {
			setReview(result?.data?.reviews);
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		formData.append("komentar", comment);
		formData.append("rating", rating);

		addReviewApi(formData, productId, localStorage.getItem("token")).then(
			(result) => {
				console.log(result);
				getReviewApi(productId, localStorage.getItem("token")).then((result) => {
					setReview(result?.data?.reviews);
				});
				setComment("");
				setRating("");
			}
		);
	};

	const sendPaymentResultToBackend = async (result) => {
		try {
			const paymentData = {
				order_id: result.order_id,
				transaction_status: result.transaction_status,
				transaction_id: result.transaction_id,
				payment_type: result.payment_type,
			};

			const response = await updatePaymentStatusApi(
				paymentData,
				localStorage.getItem("token")
			);

			if (response.success) {
				setPaymentStatus("success");
				console.log("Payment status updated successfully");
			} else {
				setPaymentStatus("error");
				console.error("Failed to update payment status");
			}
		} catch (error) {
			setPaymentStatus("error");
			console.error("Error updating payment status:", error);
		}
	};

	const handleBuy = async () => {
		try {
			setIsProcessingPayment(true);
			setPaymentStatus(null);

			const response = await buyNoteApi(productId, localStorage.getItem("token"));

			if (response.success && response.data.snap_token) {
				const snapToken = response.data.snap_token;
				const breakdown = response.data.breakdown;

				console.log("Payment Breakdown:", breakdown);

				window.snap.pay(snapToken, {
					skipOrderSummary: false,

					onSuccess: function (result) {
						console.log("Payment Success:", result);
						setPaymentStatus("processing");
						sendPaymentResultToBackend(result);
						return false;
					},
					onPending: function (result) {
						console.log("Payment Pending:", result);
						setPaymentStatus("pending");
						sendPaymentResultToBackend(result);
						return false;
					},
					onError: function (result) {
						console.log("Payment Error:", result);
						setPaymentStatus("error");
						setIsProcessingPayment(false);
						return false;
					},
					onClose: function () {
						console.log("Payment popup closed");
						setIsProcessingPayment(false);
					},
				});
			} else {
				throw new Error(response.message || "Failed to create transaction");
			}
		} catch (error) {
			console.error("Error processing payment:", error);
			setPaymentStatus("error");
			setIsProcessingPayment(false);
			alert("Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.");
		}
	};

	const PaymentStatusMessage = () => {
		if (!paymentStatus) return null;

		const statusConfig = {
			processing: {
				color: "text-blue-600 bg-blue-50 border-blue-200",
				message: "Sedang memproses pembayaran...",
			},
			success: {
				color: "text-green-600 bg-green-50 border-green-200",
				message: "Pembayaran berhasil! Note telah dibeli.",
			},
			pending: {
				color: "text-yellow-600 bg-yellow-50 border-yellow-200",
				message: "Pembayaran pending. Silakan selesaikan pembayaran Anda.",
			},
			error: {
				color: "text-red-600 bg-red-50 border-red-200",
				message: "Pembayaran gagal. Silakan coba lagi.",
			},
		};

		const config = statusConfig[paymentStatus];

		return (
			<div className={`p-3 rounded-md border ${config.color} mb-4`}>
				<p className="text-sm font-medium">{config.message}</p>
			</div>
		);
	};

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
							<PaymentStatusMessage />

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
								<button
									onClick={handleBuy}
									disabled={isProcessingPayment || paymentStatus === "success"}
									className={`
										w-full rounded-md p-3 transition-colors
										${
											isProcessingPayment
												? "cursor-not-allowed bg-gray-400 text-white"
												: paymentStatus === "success"
												? "cursor-not-allowed bg-green-500 text-white"
												: "cursor-pointer bg-primary-700 hover:bg-primary-800 text-white"
										}
									`}>
									{isProcessingPayment
										? "Memproses..."
										: paymentStatus === "success"
										? "Sudah Dibeli"
										: "Beli Sekarang"}
								</button>
							</div>
						</div>
						<div className="col-span-8 h-full flex flex-col items-start bg-white p-4 rounded-lg shadow-md space-y-5">
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
								<div className="h-full flex flex-col justify-between">
									<div>
										<div className="h-[530px] space-y-3 overflow-auto">
											{Array.isArray(review) &&
												review.map((data, index) => (
													<div key={index}>
														<div className="flex items-center gap-3">
															<img
																className="w-10 h-10 rounded-full"
																src={data.reviewer.foto_profil}
																alt=""
															/>
															<p className="font-semibold">{data.reviewer.username}</p>
															<div className="flex items-center text-yellow-400">
																{[...Array(Math.floor(data.reviewer.rating))].map(
																	(_, index) => (
																		<StarIcon key={index} className="fill-yellow-400" />
																	)
																)}
															</div>
														</div>
														<div className="ps-[51px] space-y-5">
															<p className="text-gray-400">{data.reviewer.review}</p>

															{data.reviewer.seller_response && (
																<div className="bg-gray-50 border-l-4 border-[#5289C7] p-3 rounded-r-md">
																	<div className="flex items-center gap-2 mb-2">
																		<span className="text-sm font-semibold text-primary-700">
																			Respon Penjual:
																		</span>
																	</div>
																	<p className="text-gray-600 text-sm">
																		{data.reviewer.seller_response.response}
																	</p>
																</div>
															)}

															<div className="flex justify-between items-center">
																<div className="flex items-center gap-3">
																	<div className="flex items-center gap-2">
																		<ThumbsDown
																			onClick={() => handleLike(data.review_id, "dislike")}
																			className="cursor-pointer"
																		/>
																		{data.reviewer.jumlah_dislike}
																	</div>
																	<div className="flex items-center gap-2">
																		<ThumbsUpIcon
																			onClick={() => handleLike(data.review_id, "like")}
																			className="cursor-pointer"
																		/>
																		{data.reviewer.jumlah_like}
																	</div>
																</div>
																{data.reviewer.seller_response != null ? (
																	<div className="flex items-center gap-2 text-blue-600 text-sm">
																		<span>Penjual telah merespon</span>
																		<ChevronDown />
																	</div>
																) : (
																	<div></div>
																)}
															</div>
														</div>
														<div className="h-[0.5px] bg-[#E5E5E5] my-4"></div>
													</div>
												))}
										</div>
									</div>
									<form onSubmit={handleSubmit}>
										<ul className="grid grid-cols-12 gap-3">
											<li className="col-span-10">
												<input
													className="w-full bg-[#F9F9F9] border border-[#E5E5E5] p-3 rounded-md outline-none focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
													type="text"
													placeholder="Tambahkan ulasan"
													value={comment}
													onChange={(e) => setComment(e.target.value)}
												/>
											</li>
											<li className="col-span-1">
												<input
													className="w-full bg-[#F9F9F9] border border-[#E5E5E5] p-3 rounded-md outline-none focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7]"
													type="number"
													min="1"
													max="5"
													placeholder="Rating"
													value={rating}
													onChange={(e) => setRating(e.target.value)}
												/>
											</li>
											<li className="col-span-1">
												<button
													type={`${formComplete ? "submit" : "button"}`}
													className={`${
														formComplete
															? "cursor-pointer bg-[#5289C7] hover:bg-[#4a7bb8]"
															: "cursor-not-allowed bg-gray-300"
													} h-full w-full flex-1 text-white rounded-md transition-colors`}>
													Tambah
												</button>
											</li>
										</ul>
									</form>
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
