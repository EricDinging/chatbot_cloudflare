import flag from 'country-code-emoji';

const template = (cf) => {
    const emoji = flag(cf.country);
    return `<!DOCTYPE html>
        <body>
            <h1>GPT-powered Web Search</h1>
            <p>Hello there! You're connecting from ${cf.city} in ${cf.country} ${emoji}</p>
            <p>Enter a question here, and GPT will return a website url.
                The website's content will then be shown here!</p>
            <form action="/submit" method="post">
                <label for="question">Question:</label>
                <input type="text" id="question" name="question">
                <button type="submit">Submit</button>
            </form>
        </body>`
}
export default template