import React, { FormEvent, useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Box, Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { toast } from "react-toastify";

import { LoadingButton } from "@mui/lab";

import GenreModel from "../../../../models/GenreModel";
import {endpointBE} from "../../../utils/Constant";
import PlasticModels from "../../../../models/PlasticModels";
import {getPlasticByIdAllInformation} from "../../../../api/PlasticApi";
import {getAllGenres} from "../../../../api/GenresApi";
import {SelectMultiple} from "../../../utils/SelectMultiple";
import imageCompression from "browser-image-compression";




interface PlasticFormProps {
	id: number;
	option: string;
	setKeyCountReload?: any;
	handleCloseModal: any;
}

export const PlasticForm: React.FC<PlasticFormProps> = (props) => {
	const [plastic, setPlastic] = useState<PlasticModels>({
		idPlasticItem: 0,
		namePlasticItem: "",
		manufacturer: "",
		description: "",
		listPrice: NaN,
		sellPrice: NaN,
		quantity: NaN,
		avgRating: NaN,
		soldQuantity: NaN,
		discountPercent: 0,
		thumbnail: "",
		relatedImg: [],
		idGenres: [],
	});
	const [genresList, setGenresList] = useState<GenreModel[]>([]);
	const [genresListSelected, setGenresListSelected] = useState<number[]>([]);
	const [previewThumbnail, setPreviewThumbnail] = useState("");
	const [previewRelatedImages, setPreviewRelatedImages] = useState<string[]>(
		[]
	);

	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [relatedImageFiles, setRelatedImageFiles] = useState<File[]>([]);


	// Giá trị khi đã chọn ở trong select multiple
	const [SelectedListName, setSelectedListName] = useState<any[]>([]);
	// Khi submit thì btn loading ...
	const [statusBtn, setStatusBtn] = useState(false);
	// Biến reload (cho selectMultiple)
	const [reloadCount, setReloadCount] = useState(0);

	// Lấy dữ liệu khi update
	useEffect(() => {
		if (props.option === "update") {
			getPlasticByIdAllInformation(props.id).then((response) => {
				setPlastic(response as PlasticModels);
				setPreviewThumbnail(response?.thumbnail as string);
				setPreviewRelatedImages(response?.relatedImg as string[]);
				response?.genresList?.forEach((data) => {
					setSelectedListName((prev) => [...prev, data.nameGenre]);
					setPlastic((prevBook) => {
						return {
							...prevBook,
							idGenres: [...(prevBook.idGenres || []), data.idGenre],
						};
					});
				});
			});
		}
	}, [props.option, props.id]);

	// Khúc này lấy ra tất cả thể loại để cho vào select
	useEffect(() => {
		getAllGenres().then((response) => {
			setGenresList(response.genreList);
		});
	}, [props.option]);

	// Khúc này để lưu danh sách thể loại của sách
	useEffect(() => {
		setPlastic({ ...plastic, idGenres: genresListSelected });
	}, [genresListSelected]);


	function handleThumnailImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setThumbnailFile(file);
			setPreviewThumbnail(URL.createObjectURL(file));
		}
	}
	function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(event.target.files || []);
		if (previewRelatedImages.length + files.length > 5) {
			toast.warning("Chỉ được tải lên tối đa 5 ảnh");
			return;
		}
		setRelatedImageFiles(prev => [...prev, ...files]);
		const newPreviews = files.map(file => URL.createObjectURL(file));
		setPreviewRelatedImages(prev => [...prev, ...newPreviews]);
	}
	const initialPlastic: PlasticModels = {
		idPlasticItem: 0,
		namePlasticItem: "",
		manufacturer: "",
		description: "",
		listPrice: 0,
		sellPrice: 0,
		quantity: 0,
		avgRating: 0,
		soldQuantity: 0,
		discountPercent: 0,
		thumbnail: "",
		relatedImg: [],
		idGenres: [],
	};

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatusBtn(true);
		const token = localStorage.getItem("token");

		try {
			// 👉 Bước 1: Upload ảnh (nếu có)
			const formData = new FormData();
			if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
			relatedImageFiles.forEach((file) => formData.append("relatedImg", file));

			let thumbnailUrl = plastic.thumbnail;
			let relatedImgUrls = plastic.relatedImg;

			// Chỉ upload nếu có file ảnh mới
			if (thumbnailFile || relatedImageFiles.length > 0) {
				const uploadRes = await fetch(endpointBE + "/plastics/upload-images", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				});
				if (!uploadRes.ok) throw new Error("Upload ảnh thất bại");
				const uploadData = await uploadRes.json();
				thumbnailUrl = uploadData.thumbnail ?? plastic.thumbnail;
				relatedImgUrls = uploadData.relatedImg ?? plastic.relatedImg;
			}

			// 👉 Bước 2: Gửi dữ liệu chính
			const plasticModel: PlasticModels = {
					...plastic,
				sellPrice: plastic.discountPercent === 0 ? plastic.listPrice : plastic.sellPrice,
				thumbnail: thumbnailUrl,
				relatedImg: relatedImgUrls,
			};

			const endpoint =
				props.option === "add"
					? endpointBE + "/plastic/add-plastic"
					: endpointBE + "/plastic/update-plastic";

			const method = props.option === "add" ? "POST" : "PUT";

			const saveRes = await fetch(endpoint, {
				method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(plasticModel),
			});

			if (!saveRes.ok) throw new Error("Gửi dữ liệu plastic thất bại");

			setPlastic(initialPlastic);
			setPreviewThumbnail("");
			setPreviewRelatedImages([]);
			setThumbnailFile(null);
			setRelatedImageFiles([]);
			setReloadCount(Math.random());
			props.setKeyCountReload(Math.random());
			props.handleCloseModal();

			toast.success(
				props.option === "add" ? "Thêm plastic thành công" : "Cập nhật plastic thành công"
			);
		} catch (err) {
			console.error(err);
			toast.error("Gặp lỗi trong quá trình xử lý");
		} finally {
			setStatusBtn(false);
		}
	}




	return (
		<div>
			<Typography className='text-center' variant='h4' component='h2'>
				{props.option === "add" ? "TẠO SẢN PHẨM" : "SỬA SẢN PHẨM"}
			</Typography>
			<hr />
			<div className='container px-5'>
				<form onSubmit={handleSubmit} className="form">

					<input type='hidden' id='idBook' value={plastic?.idPlasticItem} hidden/>
					<div className='row'>
						<div
							className={props.option === "update" ? "col-4" : "col-6"}
						>
							<Box
								sx={{
									"& .MuiTextField-root": {mb: 3},
								}}
							>
								<TextField
									required
									id='filled-required'
									label='Tên sản phẩm'
									style={{width: "100%"}}
									value={plastic.namePlasticItem}
									onChange={(e: any) =>
										setPlastic({...plastic, namePlasticItem: e.target.value})
									}
									size='small'
								/>

								<TextField
									required
									id='filled-required'
									label='Nhà sản xuất'
									style={{width: "100%"}}
									value={plastic.manufacturer}
									onChange={(e: any) =>
										setPlastic({...plastic, manufacturer: e.target.value})
									}
									size='small'
								/>

								<TextField
									required
									id='filled-required'
									label='Giá niêm yết'
									style={{width: "100%"}}
									type='number'
									value={
										Number.isNaN(plastic.listPrice) ? "" : plastic.listPrice
									}
									onChange={(e: any) =>
										setPlastic({
											...plastic,
											listPrice: parseInt(e.target.value),
										})
									}
									size='small'
								/>
							</Box>
						</div>
						<div
							className={props.option === "update" ? "col-4" : "col-6"}
						>
							<Box
								sx={{
									"& .MuiTextField-root": {mb: 3},
								}}
							>
								<TextField
									required
									id='filled-required'
									label='Số lượng'
									style={{width: "100%"}}
									type='number'
									value={
										Number.isNaN(plastic.quantity) ? "" : plastic.quantity
									}
									onChange={(e: any) =>
										setPlastic({
											...plastic,
											quantity: parseInt(e.target.value),
										})
									}
									size='small'
								/>
								<SelectMultiple
									selectedList={genresListSelected}
									setSelectedList={setGenresListSelected}
									selectedListName={SelectedListName}
									setSelectedListName={setSelectedListName}
									values={genresList}
									setValue={setPlastic}
									key={reloadCount}
									required={true}
								/>

								<TextField
									id='filled-required'
									label='Giảm giá (%)'
									style={{width: "100%"}}
									type='number'
									value={
										Number.isNaN(plastic.discountPercent)
											? ""
											: plastic.discountPercent
									}
									onChange={(e: any) => {
										setPlastic({
											...plastic,
											discountPercent: parseInt(e.target.value),
											sellPrice:
												plastic.listPrice -
												Math.round(
													(plastic.listPrice *
														Number.parseInt(e.target.value)) /
													100
												),
										});
									}}
									size='small'
								/>
							</Box>
						</div>
						{props.option === "update" && (
							<div className='col-4'>
								<Box
									sx={{
										"& .MuiTextField-root": {mb: 3},
									}}
								>
									<TextField
										id='filled-required'
										label='Giá bán'
										style={{width: "100%"}}
										value={plastic.sellPrice.toLocaleString("vi-vn")}
										type='number'
										InputProps={{
											disabled: true,
										}}
										size='small'
									/>

									<TextField
										id='filled-required'
										label='Đã bán'
										style={{width: "100%"}}
										value={plastic.soldQuantity}
										InputProps={{
											disabled: true,
										}}
										size='small'
									/>

									<TextField
										id='filled-required'
										label='Điểm đánh giá'
										style={{width: "100%"}}
										value={plastic.avgRating}
										InputProps={{
											disabled: true,
										}}
										size='small'
									/>
								</Box>
							</div>
						)}
						<div className='col-12'>
							<Box>
								<TextField
									id='outlined-multiline-flexible'
									label='Mô tả sản phẩm'
									style={{width: "100%"}}
									multiline
									maxRows={5}
									value={plastic.description}
									onChange={(e: any) =>
										setPlastic({...plastic, description: e.target.value})
									}
									required
								/>
							</Box>
						</div>
						<div className='d-flex align-items-center mt-3'>
							<Button
								size='small'
								component='label'
								variant='outlined'
								startIcon={<CloudUpload/>}
							>
								Tải ảnh thumbnail
								<input
									style={{opacity: "0", width: "10px"}}
									required={props.option === "update" ? false : true}
									type='file'
									accept='image/*'
									onChange={handleThumnailImageUpload}
									alt=''
								/>
							</Button>
							<img src={previewThumbnail} alt='' width={100}/>
						</div>
						<div className='d-flex align-items-center mt-3'>
							<Button
								size='small'
								component='label'
								variant='outlined'
								startIcon={<CloudUpload/>}
							>
								Tải ảnh liên quan
								<input
									style={{opacity: "0", width: "10px"}}
									// required
									type='file'
									accept='image/*'
									onChange={handleImageUpload}
									multiple
									alt=''
								/>
							</Button>
							{previewRelatedImages.map((imgURL) => (
								<img src={imgURL} alt='' width={100}/>
							))}
							{previewRelatedImages.length > 0 && (
								<Button
									onClick={() => {
										setPreviewRelatedImages([]);
										setPlastic({...plastic, relatedImg: []});
									}}
								>
									Xoá tất cả
								</Button>
							)}
						</div>
					</div>
					{props.option !== "view" && (
						<LoadingButton
							className='w-100 my-3'
							type='submit'
							loading={statusBtn}
							variant='outlined'
							sx={{width: "25%", padding: "10px"}}
						>
							{props.option === "add" ? "Tạo sản phẩm" : "Lưu sản phẩm"}
						</LoadingButton>
					)}
				</form>
			</div>
		</div>
	);
};
