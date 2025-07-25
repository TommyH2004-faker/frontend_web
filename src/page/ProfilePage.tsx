import { CloudUpload, EditOutlined } from "@mui/icons-material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


import Tab from "@mui/material/Tab";
import React, { FormEvent, useEffect, useLayoutEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";

import Tooltip from "@mui/material/Tooltip";






import {useNavigate} from "react-router-dom";

import {toast} from "react-toastify";

import CheckIcon from "@mui/icons-material/Check";
import useScrollToTop from "../hooks/ScrollToTop";
import {useAuth} from "../layouts/utils/AuthContext";
import UserModel from "../models/UserModel";
import {get1User} from "../api/UserApi";
import {getIdUserByToken} from "../layouts/utils/JwtService";
import {endpointBE, endpointFE} from "../layouts/utils/Constant";
import HiddenInputUpload from "../layouts/utils/HiddenInputUpload";
import {checkPassword, checkPhoneNumber, checkRepeatPassword} from "../layouts/utils/Validation";

import {OrderTable} from "../layouts/Admin/component/order/OrderTable";
import {FadeModal} from "../layouts/utils/FadeModal";
import {OrderForm} from "../layouts/Admin/component/order/OrderForm";
import Grid from '@mui/material/Grid';


interface ProfilePageProps {
	setReloadAvatar: any;
}

const ProfilePage: React.FC<ProfilePageProps> = (props) => {
	useScrollToTop() // Mỗi lần vào component này thì sẽ ở trên cùng

	const { isLoggedIn } = useAuth();
	const navigation = useNavigate();

	useLayoutEffect(() => {
		if (!isLoggedIn) {
			navigation("/dangnhap");
		}
	});

	// Các biến thông tin cá nhân
	const [user, setUser] = useState<UserModel>({
		idUser: 0,
		dateOfBirth: new Date(),
		deliveryAddress: "",
		purchaseAddress: "",
		email: "",
		firstName: "",
		lastName: "",
		gender: "",
		password: "",
		phoneNumber: "",
		username: "",
		avatar: "",
	});
	const [newPassword, setNewPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [dataAvatar, setDataAvatar] = useState("");
	const [previewAvatar, setPreviewAvatar] = useState("");

	// reload lại component order table
	const [keyCountReload, setKeyCountReload] = useState(0);

	// Xử lý order table
	const [id, setId] = useState(0);
	const [openModal, setOpenModal] = React.useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	// Các biến trạng thái
	const [modifiedStatus, setModifiedStatus] = useState(false);
	const [isUploadAvatar, setIsUploadAvatar] = useState(false);

	// Các biến thông báo lỗi
	const [errorPhoneNumber, setErrorPhoneNumber] = useState("");
	const [errorNewPassword, setErrorNewPassword] = useState("");
	const [errorRepeatPassword, setErrorRepeatPassword] = useState("");

	// Lấy data user lên
	useEffect(() => {
		const idUser = getIdUserByToken();
		get1User(idUser)
			.then((response) => {
				setUser({
					...response,
					dateOfBirth: new Date(response.dateOfBirth),
				});
				setPreviewAvatar(response.avatar);
			})
			.catch((error) => console.log(error));
	}, []);

	// Xử lý change só điện thoại
	const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUser({ ...user, phoneNumber: e.target.value });
		setErrorPhoneNumber("");
	};

	// Xử lý upload hình ảnh (preview)
	function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const inputElement = event.target as HTMLInputElement;

		if (inputElement.files && inputElement.files.length > 0) {
			const selectedFile = inputElement.files[0];

			const reader = new FileReader();

			// Xử lý sự kiện khi tệp đã được đọc thành công
			reader.onload = (e: any) => {
				// e.target.result chính là chuỗi base64
				const avatarBase64 = e.target?.result as string;

				setDataAvatar(avatarBase64);
				setPreviewAvatar(URL.createObjectURL(selectedFile));
				setIsUploadAvatar(true);
				props.setReloadAvatar(Math.random());
			};

			// Đọc tệp dưới dạng chuỗi base64
			reader.readAsDataURL(selectedFile);
		}
	}

	// Xử lý ngày sinh
	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const dateString = e.target.value;
		// Chuyển đổi chuỗi thành đối tượng Date
		const dateObject = new Date(dateString);
		if (!isNaN(dateObject.getTime())) {
			// Nếu là một ngày hợp lệ, cập nhật state
			setUser({
				...user,
				dateOfBirth: dateObject,
			});
		}
	};

	// Xử lý change password
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewPassword(e.target.value);
		setErrorNewPassword("");
	};

	const handleRepeatPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setRepeatPassword(e.target.value);
		setErrorRepeatPassword("");
	};

	// Xử lý TABS
	const [value, setValue] = React.useState("1");
	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	// Xử lý khi form submit (thay đổi thông tin)
	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		const token = localStorage.getItem("token");
		toast.promise(
			fetch(endpointFE + `/taikhoan/update-profile`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					idUser: getIdUserByToken(),
					firstName: user.firstName,
					lastName: user.lastName,
					dateOfBirth: user.dateOfBirth,
					phoneNumber: user.phoneNumber,
					deliveryAddress: user.deliveryAddress,
					gender: user.gender,
				}),
			})
				.then((response) => {
					toast.success("Cập nhật thông tin thành công");
					setModifiedStatus(!modifiedStatus);
				})
				.catch((error) => {
					toast.error("Cập nhật thông tin thất bại");
					setModifiedStatus(!modifiedStatus);
					console.log(error);
				}),
			{ pending: "Đang trong quá trình xử lý ..." }
		);
	}

	// Xử lý khi thay đổi avatar (thay đổi avatar)
	/*function handleSubmitAvatar() {
		const token = localStorage.getItem("token");
		toast.promise(
			fetch(endpointBE + "/taikhoan/change-avatar", {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					idUser: getIdUserByToken(),
					avatar: dataAvatar,
				}),
			})
				.then((response) => {
					if (response.ok) {
						return response.json();
					}
				})
				.then((data) => {
					const { jwtToken } = data;
					localStorage.setItem("token", jwtToken);

					toast.success("Cập nhật ảnh đại diện thành công");
					setPreviewAvatar(previewAvatar);
					setIsUploadAvatar(false);
					props.setReloadAvatar(Math.random());
				})
				.catch((error) => {
					toast.error("Cập nhật ảnh đại diện thất bại");
					setPreviewAvatar(user.avatar);
					setIsUploadAvatar(false);
					console.log(error);
				}),
			{ pending: "Đang trong quá trình xử lý ..." }
		);
	}*/
	function handleSubmitAvatar() {
		const token = localStorage.getItem("token");

		toast.promise(
			fetch(endpointFE + "/taikhoan/change-avatar", {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					idUser: getIdUserByToken(),
					avatar: dataAvatar,
				}),
			})
				.then(async (response) => {
					const data = await response.json();

					// ✅ Log response từ backend
					console.log("Phản hồi từ backend khi đổi avatar:", data);

					// ✅ Kiểm tra token hợp lệ
					const jwtToken = data.jwtToken;
					if (jwtToken && jwtToken.split(".").length === 3) {
						localStorage.setItem("token", jwtToken);
						console.log("Token mới đã được cập nhật vào localStorage.");
					} else {
						console.warn("Không nhận được token hợp lệ từ backend.");
					}

					toast.success("Cập nhật ảnh đại diện thành công");
					setPreviewAvatar(previewAvatar);
					setIsUploadAvatar(false);
					props.setReloadAvatar(Math.random());

					return data;
				})
				.catch((error) => {
					console.error("Lỗi khi cập nhật avatar:", error);
					toast.error("Cập nhật ảnh đại diện thất bại");
					setPreviewAvatar(user.avatar);
					setIsUploadAvatar(false);
				}),
			{ pending: "Đang trong quá trình xử lý ..." }
		);
	}

	// Xử lý khi form sumbit (thay đổi mật khẩu)
	function handleSubmitChangePassword(
		event: FormEvent<HTMLFormElement>
	): void {
		event.preventDefault();

		if (errorNewPassword.length > 0 || errorRepeatPassword.length > 0) {
			toast.warning("Xem lại mật khẩu vừa nhập");
			return;
		}

		const token = localStorage.getItem("token");
		fetch(endpointFE + "/taikhoan/change-password", {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				idUser: getIdUserByToken(),
				newPassword: newPassword,
			}),
		})
			.then((response) => {
				setNewPassword("");
				setRepeatPassword("");
				toast.success("Đổi mật khẩu thành công");
			})
			.catch((error) => {
				console.log(error);
				toast.error("Thay đổi mật khẩu không thành công");
			});
	}

	// Khúc này chủ yếu nếu mà không đăng nhập mà cố tình vào thì sẽ không render component ra
	if (!isLoggedIn) {
		return null;
	}




	return (
		<div className='container my-5'>
			<Grid container>
				<Grid item
					  sm={12}
					  md={12}
					  lg={3}>
					<div className='bg-light rounded py-3 me-lg-2 me-md-0 me-sm-0'>
						<div className='d-flex align-items-center justify-content-center flex-column'>
							<Avatar
								style={{ fontSize: '50px' }}
								alt={user.lastName.toUpperCase()}
								src={previewAvatar}
								sx={{ width: 100, height: 100 }}
							/>
							{!isUploadAvatar ? (
								<Button
									className='mt-3'
									size='small'
									component='label'
									variant='outlined'
									startIcon={<CloudUpload />}
								>
									Upload avatar
									<HiddenInputUpload handleImageUpload={handleImageUpload} />
								</Button>
							) : (
								<div>
									<Button
										className='mt-4 me-2'
										size='small'
										variant='outlined'
										startIcon={<CloseIcon />}
										onClick={() => {
											setPreviewAvatar(user.avatar);
											setIsUploadAvatar(false);
										}}
										color='error'
									>
										Huỷ
									</Button>
									<Button
										className='mt-4 ms-2'
										size='small'
										variant='outlined'
										startIcon={<CheckIcon />}
										color='success'
										onClick={handleSubmitAvatar}
									>
										Thay đổi
									</Button>
								</div>
							)}
						</div>
						<div className='text-center mt-3'>
							<p>Email: {user.email}</p>
						</div>
					</div>
				</Grid>

				<Grid item sm={12} md={12} lg={9}>
					<div
						className='bg-light rounded px-2 ms-lg-2 ms-md-0 ms-sm-0 mt-lg-0 mt-md-3 mt-sm-3'
						style={{minHeight: "300px"}}
					>
						<Box sx={{width: "100%", typography: "body1"}}>
							<TabContext value={value}>
								<Box sx={{borderBottom: 1, borderColor: "divider"}}>
									<TabList
										onChange={handleChange}
										aria-label='lab API tabs example'
									>
										<Tab label='Thông tin cá nhân' value='1'/>
										<Tab label='Đơn hàng' value='2'/>
										<Tab label='Đổi mật khẩu' value='3'/>
									</TabList>
								</Box>
								<TabPanel value='1'>
									<form
										onSubmit={handleSubmit}
										className='form position-relative'
										style={{padding: "0 20px"}}
									>
										{!modifiedStatus && (
											<div
												className='text-end my-3 position-absolute'
												style={{
													bottom: "0",
													right: "0",
												}}
											>
												<Tooltip
													title='Chỉnh sửa thông tin'
													placement='bottom-end'
												>
													<Button
														variant='contained'
														type='button'
														className='rounded-pill'
														onClick={() =>
															setModifiedStatus(!modifiedStatus)
														}
													>
														<EditOutlined
															sx={{width: "24px"}}
														/>
													</Button>
												</Tooltip>
											</div>
										)}
										<div className='row'>
											<div className='col-sm-12 col-md-6 col-lg-4'>
												<TextField
													required
													fullWidth
													label='ID'
													value={user.idUser}
													disabled={true}
													className='input-field'
													InputProps={{
														readOnly: true,
													}}
												/>
												<TextField
													required
													fullWidth
													label='Họ đệm'
													value={user.firstName}
													onChange={(e) =>
														setUser({
															...user,
															firstName: e.target.value,
														})
													}
													disabled={modifiedStatus ? false : true}
													className='input-field'
												/>
												<TextField
													fullWidth
													error={
														errorPhoneNumber.length > 0
															? true
															: false
													}
													helperText={errorPhoneNumber}
													required={true}
													label='Số điện thoại'
													placeholder='Nhập số điện thoại'
													value={user.phoneNumber}
													onChange={handlePhoneNumberChange}
													onBlur={(e) => {
														checkPhoneNumber(
															setErrorPhoneNumber,
															e.target.value
														);
													}}
													disabled={modifiedStatus ? false : true}
													className='input-field'
												/>
											</div>
											<div className='col-sm-12 col-md-6 col-lg-4'>
												<TextField
													required
													fullWidth
													label='Tên tài khoản'
													value={user.username}
													disabled={true}
													className='input-field'
												/>
												<TextField
													required
													fullWidth
													label='Tên'
													value={user.lastName}
													onChange={(e) =>
														setUser({
															...user,
															lastName: e.target.value,
														})
													}
													disabled={modifiedStatus ? false : true}
													className='input-field'
												/>
												<TextField
													required
													fullWidth
													label='Địa chỉ giao hàng'
													value={user.deliveryAddress}
													onChange={(e) =>
														setUser({
															...user,
															deliveryAddress: e.target.value,
														})
													}
													disabled={modifiedStatus ? false : true}
													className='input-field'
												/>
											</div>
											<div className='col-sm-12 col-md-6 col-lg-4'>
												<TextField
													required
													fullWidth
													label='Email'
													value={user.email}
													className='input-field'
													disabled={true}
													InputProps={{
														readOnly: true,
													}}
												/>
												<TextField
													required
													fullWidth
													className='input-field'
													label='Ngày sinh'
													style={{width: "100%"}}
													type='date'
													value={
														user.dateOfBirth
															.toISOString()
															.split("T")[0]
													}
													onChange={handleDateChange}
													disabled={modifiedStatus ? false : true}
												/>
												<FormControl>
													<FormLabel id='demo-row-radio-buttons-group-label'>
														Giới tính
													</FormLabel>
													<RadioGroup
														row
														aria-labelledby='demo-row-radio-buttons-group-label'
														name='row-radio-buttons-group'
														value={user.gender}
														onChange={(e) =>
															setUser({
																...user,
																gender: e.target.value,
															})
														}
													>
														<FormControlLabel
															disabled={
																modifiedStatus ? false : true
															}
															value='M'
															control={<Radio/>}
															label='Nam'
														/>
														<FormControlLabel
															disabled={
																modifiedStatus ? false : true
															}
															value='F'
															control={<Radio/>}
															label='Nữ'
														/>
													</RadioGroup>
												</FormControl>
											</div>
										</div>
										{modifiedStatus && (
											<div className='text-center my-3'>
												<Button
													fullWidth
													variant='outlined'
													type='submit'
													sx={{width: "50%", padding: "10px"}}
												>
													Lưu và thay đổi
												</Button>
											</div>
										)}
									</form>
								</TabPanel>
								<TabPanel value='2'>
									<div>
										<OrderTable
											setOption={setId}
											handleOpenModal={handleOpenModal}
											keyCountReload={keyCountReload}
											setKeyCountReload={setKeyCountReload}
											setId={setId}
										/>
									</div>
									<FadeModal
										open={openModal}
										handleOpen={handleOpenModal}
										handleClose={handleCloseModal}
									>
										<OrderForm
											id={id}
											setKeyCountReload={setKeyCountReload}
											handleCloseModal={handleCloseModal}
											option='view-customer'
										/>
									</FadeModal>
								</TabPanel>
								<TabPanel value='3'>
									<form
										onSubmit={handleSubmitChangePassword}
										className='form position-relative'
										style={{padding: "0 120px"}}
									>
										<TextField
											error={
												errorNewPassword.length > 0 ? true : false
											}
											helperText={errorNewPassword}
											required={true}
											fullWidth
											type='password'
											label='Mật khẩu mới'
											placeholder='Nhập mật khẩu mới'
											value={newPassword}
											onChange={handlePasswordChange}
											onBlur={(e) => {
												checkPassword(
													setErrorNewPassword,
													e.target.value
												);
											}}
											className='input-field'
										/>

										<TextField
											error={
												errorRepeatPassword.length > 0
													? true
													: false
											}
											helperText={errorRepeatPassword}
											required={true}
											fullWidth
											type='password'
											label='Xác nhận mật khẩu mới'
											placeholder='Nhập lại mật khẩu mới'
											value={repeatPassword}
											onChange={handleRepeatPasswordChange}
											onBlur={(e) => {
												checkRepeatPassword(
													setErrorRepeatPassword,
													e.target.value,
													newPassword
												);
											}}
											className='input-field'
										/>
										<div className='text-center my-3'>
											<Button
												fullWidth
												variant='outlined'
												type='submit'
												sx={{width: "50%", padding: "10px"}}
											>
												Lưu và thay đổi
											</Button>
										</div>
									</form>
								</TabPanel>
							</TabContext>
						</Box>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default ProfilePage;
