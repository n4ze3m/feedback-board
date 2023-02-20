import cohere from "cohere-ai";
export const spamDetection = async (text: string) => {
	try {
		cohere.init(process.env.FEEDBACK_BOARD_COHERE_API_KEY!);
		const response = await cohere.classify({
			model: "large",
			inputs: [text],
			examples: [
				{
					label: "ham",
					text: "I really enjoyed using your product, it's very user-friendly and the design is great.",
				},
				{
					label: "ham",
					text: "Thank you for your prompt response to my query, your customer service is excellent.",
				},
				{
					label: "spam",
					text: "Congratulations, you have been selected to receive a free trial of our new weight loss supplement. Click here to claim your offer now.",
				},
				{
					label: "ham",
					text: "I appreciate the effort your team put into resolving the issue I had with my account. Thank you for your help.",
				},
				{
					label: "spam",
					text: "URGENT: Your account has been compromised. Click here to reset your password and secure your account.",
				},
				{
					label: "spam",
					text: "Your blog post was very informative and well-researched. I learned a lot from it. Keep up the good work!",
				},
				{
					label: "spam",
					text: "You have won a free iPhone! Click here to claim your prize",
				},
				{
					label: "ham",
					text: "I wanted to let you know that the feature you added to your app is really useful. It makes my life a lot easier.",
				},
				{
					label: "spam",
					text: "Don't miss out on this exclusive offer! Limited time only. Click here to claim your discount now.",
				},
				{
					label: "ham",
					text: "I'm glad I chose your company for my project. Your team is very professional and easy to work with.",
				},
				{
					label: "spam",
					text: "Make money fast with this amazing opportunity. Click here to learn more.",
				},
				{
					label: "ham",
					text: "Your website is awesome! It's easy to navigate and has all the information I need.",
				},
				{
					label: "ham",
					text: "I just wanted to say thank you for creating such a great product. It has made a big difference in my life.",
				},
				{
					label: "spam",
					text: "You have been selected to participate in a survey. Click here to claim your reward.",
				},
				{
					label: "ham",
					text: "I'm impressed by the quality of your service. Your team is very knowledgeable and helpful.",
				},
				{
					label: "ham",
					text: "I found your blog post to be very insightful. You have a unique perspective on the topic.",
				},
				{
					label: "spam",
					text: "Huge sale! Everything must go. Click here to get 50% off on all products.",
				},
				{
					label: "ham",
					text: "I'm really happy with the results I'm seeing from using your product. It's definitely worth the investment.",
				},
				{
					label: "spam",
					text: "You have been selected for a special offer. Click here to claim your prize.",
				},
				{
					label: "ham",
					text: "Thank you for the excellent service. I will definitely recommend your company to others.",
				},
				{ label: "ham", text: "thanks" },
				{ label: "ham", text: "welcome" },
				{ label: "ham", text: "i have same issue" },
				{ label: "spam", text: "fuck you" },
				{ label: "ham", text: "test" },
			],
		});

		let spam = false;

		const result = response.body.classifications;

		if (result.length > 0) {
			spam = result[0]?.prediction === "spam";
		}

		return spam;
	} catch (error) {
		return false;
	}
};
