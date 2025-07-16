import { DataGrid } from "@mui/x-data-grid/DataGrid";
import React from "react";

interface DataTableProps {
	rows: any;
	columns: any;
}

export const DataTable: React.FC<DataTableProps> = (props) => {
	return (
		<div
			style={{
				width: "100%",
				height: props.rows.length > 0 ? "auto" : "200px",
			}}
		>
			<DataGrid
				rows={props.rows}
				columns={props.columns}
				pageSizeOptions={[10, 15, 20, 30]}
				pagination
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 10,
							page: 0,
						},
					},
				}}
			/>

		</div>
	);
};
