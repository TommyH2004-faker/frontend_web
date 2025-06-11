import { useEffect, useState } from "react";

import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import PlasticModels from "../../../../models/PlasticModels";
import {get3BestSeller} from "../../../../api/PlasticApi";
import TextEllipsis from "../../../product/componetns/text-ellipsis/TextEllipsis";




const Top3BestSeller = () => {
	// Lấy dữ liệu top 4 sách được mua nhiều nhất
	const [top3BestSeller, setTop3BestSeller] = useState<PlasticModels[]>([]);
	useEffect(() => {
		get3BestSeller()
			.then((response) => {
				setTop3BestSeller(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);
	return (
		<table className='table table-striped table-hover'>
			<thead>
				<tr>
					<th scope='col'>ID</th>
					<th scope='col'>ẢNH</th>
					<th scope='col'>SẢN PHẨM NHỰA </th>
					<th scope='col'>ĐÃ BÁN</th>
				</tr>
			</thead>
			<tbody>
				{top3BestSeller.map((platic) => {
					return (
						<tr key={platic.idPlasticItem}>
							<th scope='row'>{platic.idPlasticItem}</th>
							<td>
								<Link
									to={`/plastic-items/${platic.idPlasticItem}`}
									className='d-inline text-black'
								>
									<img src={platic.thumbnail} alt='' width={30} />
								</Link>
							</td>
							<Tooltip title={platic.namePlasticItem} arrow>
								<td>
									<Link
										to={`/plastic-items/${platic.idPlasticItem}`}
										className='d-inline text-black'
									>
										<TextEllipsis
											text={platic.namePlasticItem + ""}
											limit={25}
										/>
									</Link>
								</td>
							</Tooltip>
							<td>{platic.soldQuantity}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default Top3BestSeller;
