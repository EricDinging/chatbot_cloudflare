import OpenAI from "openai";
import * as cheerio from "cheerio";
import template from "./template";

async function read_website_content(url) {
	console.log("reading website content");

	const response = await fetch(url);
	const body = await response.text();
	let cheerioBody = cheerio.load(body);
	const resp = {
		website_body: cheerioBody("p").text(),
		url: url
	}
	return resp;
}

async function read_website_helper(msgFunction) {
	let websiteContent;
	
	if (msgFunction["name"] === "read_website_content") {
		const url = JSON.parse(msgFunction["arguments"]).url;
		websiteContent = await read_website_content(url);
		// console.log(websiteContent); 
	}
	return websiteContent;
}

async function call_gpt_get_website(query, key) {
	const openai = new OpenAI({
		apiKey: key
	});
	try {
		const messages = [
			{ role: "user", content: query },
		];
		const tools = [{
			type: "function",
			function: {
				name: "read_website_content",
				description: "Read the content on a given website",
				parameters: {
					type: "object",
					properties: {
						url: {
							type: "string",
							description: "The URL to the website to read ",
						},
					},
					required: ["url"],
				},
			},
		},];
		
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo-0125",
			messages: messages,
			tools: tools,
			tool_choice: "auto", // auto is default, but we'll be explicit
		});
		const responseMessage = response.choices[0].message;
		console.log(responseMessage);
		try {
			const websiteContent = await read_website_helper(
				responseMessage["tool_calls"][0]['function']
			)
			console.log(websiteContent["url"]);
			return websiteContent["website_body"];
		} catch {
			return responseMessage["content"];
		}
	} catch (e) {
		return e;
	}
}

export default {
	async fetch(request, env, ctx) {
		if (request.method === "GET") {
			return new Response(template(request.cf), {
				headers: {
					"content-type": "text/html;charset=UTF-8",
				},
			});
		} else if (request.method === "POST") {
			const formData = await request.formData();
			const question = formData.get('question');
			const key = env.OPENAI_API_KEY;
			const response = await call_gpt_get_website(question, key);
			return new Response(response, {
				headers: {
					"content-Type": "text/plain",
				},
			});
		} else {
			return new Response('Method Not Allowed', {
				status: 405,
				statusText: 'Method Not Allowed',
			})
		}
		
	},
}
