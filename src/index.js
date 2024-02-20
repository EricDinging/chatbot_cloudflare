import OpenAI from "openai";

export default {
	async fetch(request, env, ctx) {
		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY
		});
		try {
			const chatCompletion = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [{role: "user", content: "Do you know how Cloudflare works?"}],
				functions: [
					{
						name: "read_website_content",
						description: "Read the content on a given website",
						parameters: {
							type: "object",
							properties: {
								url: {
									type: "string",
									description: "The URL to the website to read ",
								}
							},
							required: ["url"],
						},
					}
				]
			});

			const msg = chatCompletion.data.choices[0].message;

			console.log(msg.function_call)

			return new Response('Hello World!');
		} catch (e) {
			return new Response(e);
		}
	},
};
