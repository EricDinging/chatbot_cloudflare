import OpenAI from "openai";
import * as cheerio from "cheerio";

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

export default call_gpt_get_website;