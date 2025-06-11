/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useScrollToTop from "../hooks/ScrollToTop";
import ToolFilter from "./components/ToolFilter";
import PlasticList from "../layouts/product/PlasticList";

interface FilterPageProps {
	keySearchNav?: string; // key search từ navbar
}

const FilterPage: React.FC<FilterPageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const [size, setSize] = useState(12);
	const [keySearch, setKeySearch] = useState("");
	const [idGenre, setIdGenre] = useState<number>(0);
	const [filter, setFilter] = useState(0);

	const { idGenreParam } = useParams();
	const idGenreNumber = idGenreParam ? parseInt(idGenreParam) || 0 : 0;

	useEffect(() => {
		if (props.keySearchNav !== undefined) {
			setKeySearch(props.keySearchNav);
		}
	}, [props.keySearchNav]);

	useEffect(() => {
		setIdGenre(idGenreNumber);
	}, [idGenreNumber]);

	if (idGenreParam && idGenre === 0 && parseInt(idGenreParam) !== 0) {
		return <div className="container py-5 text-center">Đang tải sản phẩm...</div>;
	}

	return (
		<>
			<div className="container-book container bg-light my-3 py-3 px-5">
				<ToolFilter
					size={size}
					setSize={setSize}
					keySearch={keySearch}
					setKeySearch={setKeySearch}
					idGenre={idGenre}
					setIdGenre={setIdGenre}
					filter={filter}
					setFilter={setFilter}
				/>
			</div>

			<PlasticList
				paginable={true}
				size={size}
				keySearch={keySearch ?? ""}
				idGenre={idGenre}
				filter={filter}
			/>
		</>
	);
};

export default FilterPage;
