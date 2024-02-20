import OpenAI from "openai";

function getCurrentWeather(location, unit = "fahrenheit") {
	if (location.toLowerCase().includes("tokyo")) {
	  return JSON.stringify({ location: "Tokyo", temperature: "10", unit: "celsius" });
	} else if (location.toLowerCase().includes("san francisco")) {
	  return JSON.stringify({ location: "San Francisco", temperature: "72", unit: "fahrenheit" });
	} else if (location.toLowerCase().includes("paris")) {
	  return JSON.stringify({ location: "Paris", temperature: "22", unit: "fahrenheit" });
	} else {
	  return JSON.stringify({ location, temperature: "unknown" });
	}
}

export default {
	async fetch(request, env, ctx) {
		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY
		});
		try {
			const messages = [
				{ role: "user", content: "What's the weather like in San Francisco, Tokyo, and Paris?" },
			];
			const tools = [{
				type: "function",
				function: {
				name: "get_current_weather",
				description: "Get the current weather in a given location",
				parameters: {
					type: "object",
					properties: {
					location: {
						type: "string",
						description: "The city and state, e.g. San Francisco, CA",
					},
					unit: { type: "string", enum: ["celsius", "fahrenheit"] },
					},
					required: ["location"],
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

			// TODO: continue working on function calling
			// if (responseMessage.tool_calls) {
			// 	const availableFunctions = {
			// 		get_current_weather: getCurrentWeather,
			// 	}
			// 	messages.push(responseMessage);

			// }

			return new Response('Hello World!');
		} catch (e) {
			return new Response(e);
		}
	},
};
