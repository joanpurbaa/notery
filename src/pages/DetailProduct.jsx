import {
	ChevronDown,
	MessageCircle,
	PlusIcon,
	StarIcon,
	ThumbsDown,
	ThumbsUpIcon,
	Send,
	X,
	Minimize2,
} from "lucide-react";
import Header from "../components/Header";
import {
	addReviewApi,
	buyNoteApi,
	getReviewApi,
	showNoteById,
	voteReviewApi,
	updatePaymentStatusApi,
	getChatRoomMessagesApi,
	sendChatMessageApi,
	createOrGetChatRoomApi,
	getNoteFileApi,
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

	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isChatMinimized, setIsChatMinimized] = useState(false);
	const [chatMessage, setChatMessage] = useState("");
	const [chatMessages, setChatMessages] = useState([]);
	const [chatRoomId, setChatRoomId] = useState(null);
	const [isChatLoading, setIsChatLoading] = useState(false);
	const [isSendingMessage, setIsSendingMessage] = useState(false);

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

	console.log(detailNote);

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

	// Load chat room when chat is opened
	const loadChatRoom = async () => {
		try {
			setIsChatLoading(true);

			// Step 1: Create or get chat room
			const chatRoomResponse = await createOrGetChatRoomApi(
				productId,
				localStorage.getItem("token")
			);
			const chatRoomId = chatRoomResponse?.data?.chat_room_id;

			if (!chatRoomId) {
				throw new Error("Failed to get chat room ID");
			}

			setChatRoomId(chatRoomId);

			// Step 2: Load existing messages
			const messagesResponse = await getChatRoomMessagesApi(
				chatRoomId,
				localStorage.getItem("token")
			);

			const messages = messagesResponse?.data || [];

			const getCurrentUserId = () => {
				// Implementasikan sesuai dengan struktur aplikasi Anda
				// Bisa dari localStorage, JWT token, atau user context
				const userData = JSON.parse(localStorage.getItem("userData") || "{}");
				return userData.id || userData.user_id;
			};

			// PERBAIKAN UTAMA: Tentukan siapa user saat ini
			const currentUserId = getCurrentUserId(); // Implementasikan fungsi ini

			const transformedMessages = messages.map((msg, index) => {
				// Logika untuk menentukan apakah pesan dari user saat ini atau lawan chat
				const isCurrentUserMessage =
					msg.sender_id === currentUserId ||
					msg.sender_type === "buyer" || // Sesuaikan dengan logika API Anda
					msg.user_id === currentUserId; // Atau field lain yang menandakan pengirim

				return {
					id: msg.id || index,
					text: msg.pesan || msg.message,
					sender: isCurrentUserMessage ? "user" : "seller",
					timestamp: new Date(msg.created_at || msg.timestamp),
					senderName: isCurrentUserMessage
						? "You"
						: detailNote?.seller?.username || "Seller",
					senderAvatar: isCurrentUserMessage
						? "/api/placeholder/40/40"
						: detailNote?.seller?.foto_profil || "/api/placeholder/40/40",
				};
			});

			setChatMessages(transformedMessages);
		} catch (error) {
			console.error("Error loading chat room:", error);
			setChatMessages([
				{
					id: 1,
					text: "Halo! Ada yang bisa saya bantu mengenai produk ini?",
					sender: "seller",
					timestamp: new Date(Date.now() - 1000 * 60 * 5),
					senderName: detailNote?.seller?.username || "Seller",
					senderAvatar: detailNote?.seller?.foto_profil || "/api/placeholder/40/40",
				},
			]);
		} finally {
			setIsChatLoading(false);
		}
	};

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

	// Chat functions
	const handleChatToggle = async () => {
		if (!isChatOpen) {
			setIsChatOpen(true);
			setIsChatMinimized(false);
			await loadChatRoom();
		} else {
			setIsChatOpen(false);
			setIsChatMinimized(false);
		}
	};

	const handleChatMinimize = () => {
		setIsChatMinimized(true);
	};

	const handleChatMaximize = () => {
		setIsChatMinimized(false);
	};

	const handleChatClose = () => {
		setIsChatOpen(false);
		setIsChatMinimized(false);
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!chatMessage.trim() || !chatRoomId || isSendingMessage) return;

		try {
			setIsSendingMessage(true);

			// Add message to UI immediately for better UX
			const newMessage = {
				id: Date.now(),
				text: chatMessage,
				sender: "user", // Ini konsisten sebagai user
				timestamp: new Date(),
				senderName: "You",
				senderAvatar: "/api/placeholder/40/40",
			};

			setChatMessages((prev) => [...prev, newMessage]);
			const messageToSend = chatMessage; // Simpan pesan sebelum di-clear
			setChatMessage("");

			// Send message to API
			await sendChatMessageApi(
				chatRoomId,
				messageToSend,
				localStorage.getItem("token")
			);

			// PERBAIKAN: Jangan reload semua messages, cukup konfirmasi pesan terkirim
			// Atau jika harus reload, pastikan mapping sender_type yang benar
		} catch (error) {
			console.error("Error sending message:", error);
			// Remove the optimistic message if sending failed
			setChatMessages((prev) => prev.slice(0, -1));
			// setChatMessage(messageToSend); // Restore the message in input
			alert("Gagal mengirim pesan. Silakan coba lagi.");
		} finally {
			setIsSendingMessage(false);
		}
	};

	const formatTime = (timestamp) => {
		return new Date(timestamp).toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
		});
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

	const handleOpenFile = () => {
		getNoteFileApi(productId, localStorage.getItem("token")).then((data) =>
			window.open(data.data.files[0].path_file, "_blank")
		);
	};

	if (!localStorage.getItem("token")) {
		return <Navigate to="/login" replace />;
	}

	return (
		<main className="w-full h-screen bg-[#F9F9F9] relative">
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
							</div>
							<img
								className="w-full h-[350px] object-cover object-top rounded-md"
								src={detailNote.gambar_preview}
								alt=""
							/>
							<p className="text-xl font-semibold">{detailNote.judul}</p>
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
									Rp {new Intl.NumberFormat("id-ID").format(detailNote.harga)}
								</p>
							</div>
							<div className="flex gap-2">
								<div
									onClick={handleChatToggle}
									className="cursor-pointer h-full border-2 border-[#5289c7] p-2 rounded-md hover:bg-[#5289c7] hover:bg-opacity-10 transition-colors">
									<MessageCircle className="h-full w-10 fill-[#5289c7] text-[#5289c7]" />
								</div>
								<button
									onClick={detailNote.isBuy ? handleOpenFile : handleBuy}
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
									{detailNote.isBuy
										? "Buka"
										: isProcessingPayment
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

			{/* Chat Window */}
			{isChatOpen && (
				<div
					className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
						isChatMinimized ? "w-80 h-14" : "w-96 h-[500px]"
					} z-50`}>
					{/* Chat Header */}
					<div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#5289C7] text-white rounded-t-lg">
						<div className="flex items-center gap-3">
							<img
								className="w-8 h-8 rounded-full"
								src={detailNote?.seller?.foto_profil || "/api/placeholder/32/32"}
								alt="Seller"
							/>
							<div>
								<h3 className="font-semibold text-sm">
									{detailNote?.seller?.username || "Seller"}
								</h3>
								<p className="text-xs opacity-90">
									{isChatLoading ? "Memuat..." : "Online"}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							{!isChatMinimized && (
								<button
									onClick={handleChatMinimize}
									className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
									<Minimize2 className="w-4 h-4" />
								</button>
							)}
							{isChatMinimized && (
								<button
									onClick={handleChatMaximize}
									className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
									<MessageCircle className="w-4 h-4" />
								</button>
							)}
							<button
								onClick={handleChatClose}
								className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
								<X className="w-4 h-4" />
							</button>
						</div>
					</div>

					{!isChatMinimized && (
						<>
							{/* Chat Messages */}
							<div className="flex-1 p-4 overflow-y-auto h-[360px] space-y-4">
								{isChatLoading ? (
									<div className="flex justify-center items-center h-full">
										<p className="text-gray-500">Memuat pesan...</p>
									</div>
								) : (
									chatMessages.map((message) => (
										<div
											key={message.id}
											className={`flex ${
												message.sender === "user" ? "justify-end" : "justify-start"
											}`}>
											<div
												className={`flex items-start gap-2 max-w-[80%] ${
													message.sender === "user" ? "flex-row-reverse" : "flex-row"
												}`}>
												<img
													className="w-6 h-6 rounded-full flex-shrink-0"
													src={message.senderAvatar}
													alt={message.senderName}
												/>
												<div
													className={`rounded-lg p-3 ${
														message.sender === "user"
															? "bg-[#5289C7] text-white rounded-br-none"
															: "bg-gray-100 text-gray-800 rounded-bl-none"
													}`}>
													<p className="text-sm">{message.text}</p>
													<p
														className={`text-xs mt-1 ${
															message.sender === "user" ? "text-blue-100" : "text-gray-500"
														}`}>
														{formatTime(message.timestamp)}
													</p>
												</div>
											</div>
										</div>
									))
								)}
							</div>

							{/* Chat Input */}
							<form
								onSubmit={handleSendMessage}
								className="p-4 border-t border-gray-200">
								<div className="flex gap-2">
									<input
										type="text"
										value={chatMessage}
										onChange={(e) => setChatMessage(e.target.value)}
										placeholder="Ketik pesan..."
										disabled={isSendingMessage || isChatLoading}
										className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5289C7] focus:ring-1 focus:ring-[#5289C7] disabled:bg-gray-100"
									/>
									<button
										type="submit"
										disabled={!chatMessage.trim() || isSendingMessage || isChatLoading}
										className={`px-4 py-2 rounded-lg transition-colors ${
											chatMessage.trim() && !isSendingMessage && !isChatLoading
												? "bg-[#5289C7] hover:bg-[#4a7bb8] text-white cursor-pointer"
												: "bg-gray-300 text-gray-500 cursor-not-allowed"
										}`}>
										{isSendingMessage ? (
											<div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
										) : (
											<Send className="w-4 h-4" />
										)}
									</button>
								</div>
							</form>
						</>
					)}
				</div>
			)}

			{/* Chat Notification Badge (when minimized) */}
			{isChatOpen && isChatMinimized && (
				<div className="fixed bottom-20 right-6 w-3 h-3 bg-red-500 rounded-full animate-pulse z-50"></div>
			)}
		</main>
	);
}
