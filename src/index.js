import template from "./template";
import call_gpt_get_website from "./gpt_search";

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const object_name = url.pathname.slice(1);
		switch (request.method) {
			case "GET":
				if (object_name) {
					// Retrieve from R2 data store
					console.log(object_name);
					const object = await env.MY_BUCKET.get(object_name);
					if (object === null) {
						return new Response('Object not found', { status: 404 });
					}
					const headers = new Headers();
					object.writeHttpMetadata(headers);
					headers.set('etag', object.httpEtag);
					console.log(object.body)
					return new Response(object.body, {headers,});
				} else {
					// Default web page
					return new Response(template(request.cf), {
						headers: {
							"content-type": "text/html;charset=UTF-8",
						},
					});
				}
			case "PUT":
				await env.MY_BUCKET.put(object_name, request.body);
        		return new Response(`Put ${object_name} successfully!`);
			
			case 'DELETE':
				await env.MY_BUCKET.delete(object_name);
				return new Response('Deleted!');

			case "POST":
				const formData = await request.formData();
				const question = formData.get('question');
				const key = env.OPENAI_API_KEY;
				const response = await call_gpt_get_website(question, key);
				return new Response(response, {
					headers: {
						"content-Type": "text/plain",
					},
				});
			default:
				return new Response('Method Not Allowed', {
					status: 405,
					statusText: 'Method Not Allowed',
				})
		}
	},
}
