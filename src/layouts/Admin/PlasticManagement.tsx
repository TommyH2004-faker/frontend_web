import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

import RequireAdmin from "./RequireAdmin";

import {FadeModal} from "../utils/FadeModal";
import {PlasticForm} from "./component/plastic/PlasticForm";
import {PlasticTable} from "./component/plastic/PlasticTable";

const PlasticManagementS: React.FC = () => {
	// Tạo ra biến để mỗi khi thao tác CRUD thì sẽ update lại table
	const [keyCountReload, setKeyCountReload] = useState(0);

	const [option, setOption] = useState(""); // Truyền vào là có thể là (add, update, view)
	const [openModal, setOpenModal] = React.useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const [id, setId] = useState<number>(0);

	return (
		<div className='conatiner p-5'>
			<div className='shadow-4-strong rounded p-5'>
				<div className='mb-3'>
					<Button
						variant='contained'
						color='success'
						onClick={() => {
							handleOpenModal();
							setOption("add");
						}}
						startIcon={<AddIcon />}
					>
						Thêm sản phẩm
					</Button>
				</div>
				<div>
					<PlasticTable
						keyCountReload={keyCountReload}
						setOption={setOption}
						setId={setId}
						handleOpenModal={handleOpenModal}
						setKeyCountReload={setKeyCountReload}
					/>
				</div>
			</div>
			<FadeModal
				open={openModal}
				handleOpen={handleOpenModal}
				handleClose={handleCloseModal}
			>
				<PlasticForm
					id={id}
					handleCloseModal={handleCloseModal}
					option={option}
					setKeyCountReload={setKeyCountReload}
				/>
			</FadeModal>
		</div>
	);
};

const PlastcManagementPage = RequireAdmin(PlasticManagementS);
export default PlastcManagementPage;
