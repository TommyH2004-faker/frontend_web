

import { useEffect, useState } from "react";
import OrderModel from "../../models/OrderModel";
import {getAllUserRole} from "../../api/UserApi";
import {getAllOrders} from "../../api/OrderApi";

import {getTotalNumberOfReviews} from "../../api/ReviewApi";
import {getTotalNumberOfFeedbacks} from "../../api/FeedBackAPI";
import {getTotalOfPlastic} from "../../api/PlasticApi";

import { Chart } from "../Admin/component/chart/Chart";
import RequireAdmin from "../Admin/RequireAdmin";
import {ParameterDigital} from "./component/ParameterDigital";


const Dashboard = () => {
	const [totalPrice, setTotalPrice] = useState(0);
	const [numberOfAccount, setNumberOfAccount] = useState(0);
	const [numberOfOrder, setNumberOfOrder] = useState(0);
	const [totalNumberOfPlastic, settotalNumberOfPlastic] = useState(0);
	const [totalNumberOfFeedbacks, setTotalNumberOfFeedbacks] = useState(0);
	const [totalNumberOfReviews, setTotalNumberOfReviews] = useState(0);
	const [orders, setOrders] = useState<OrderModel[]>([]);

	// Lấy tổng số account
	useEffect(() => {
		getAllUserRole()
			.then((response) => {
				console.log("User role: ", response);
				setNumberOfAccount(response?.length || 0 );
			})
			.catch((error) => console.log(error));
	}, []);

	// Lấy tổng số hoá đơn và tổng tiền kiếm được
	useEffect(() => {
		getAllOrders()
			.then((response) => {
				setOrders(response);
				const numberOfOrders = response.length;
				setNumberOfOrder(numberOfOrders);
				const totalPriceResponse = response.reduce((prevValue, order) => {
					if (order.status === "Thành công") {
						return prevValue + order.totalPrice;
					}
					return prevValue;
				}, 0);
				setTotalPrice(totalPriceResponse);
			})
			.catch((error) => console.log(error));
	}, []);

	// Lấy tổng số sách
	useEffect(() => {
		getTotalOfPlastic()
			.then((response) => {
				settotalNumberOfPlastic(response);
			})
			.catch((error) => console.log(error));
	}, []);

	// Lấy tổng số feedback
	useEffect(() => {
		getTotalNumberOfFeedbacks()
			.then((response) => {
				setTotalNumberOfFeedbacks(response);
			})
			.catch((error) => console.log(error));
	}, []);

	// Lấy tổng số review
	useEffect(() => {
		getTotalNumberOfReviews()
			.then((response) => {
				setTotalNumberOfReviews(response);
			})
			.catch((error) => console.log(error));
	}, []);
	return (
		<div>
			<ParameterDigital
				totalPrice={totalPrice}
				numberOfAccount={numberOfAccount}
				numberOfOrder={numberOfOrder}
				totalNumberOfPlastic={totalNumberOfPlastic}
				totalNumberOfFeedbacks={totalNumberOfFeedbacks}
				totalNumberOfReviews={totalNumberOfReviews}
			/>
			<Chart orders={orders} />
		</div>
	);
};

const DashboardPage = RequireAdmin(Dashboard);
export default DashboardPage;
