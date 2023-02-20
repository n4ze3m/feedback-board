import { CourierClient } from "@trycourier/courier";

export const sendNotification = async ({
	message,
	subject,
	recipient,
    btnText,
    btnLink,
}: {
	message: string;
	subject: string;
	recipient: string;
    btnText: string;
    btnLink: string;
}) => {
	const courier = CourierClient({
		authorizationToken: process.env.FEEDBACK_BOARD_COURIER_API_KEY,
	});

	await courier.send({
		message: {
			to: {
				email: recipient,
			},
			template: process.env.FEEDBACK_BOARD_COURIER_TEMPLATE_ID!,
			data: {
				subject: subject,
				message: message,
                btnText: btnText,
                btnLink: btnLink,
			},
		},
	});
};
