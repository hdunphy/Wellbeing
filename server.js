const express    = require("express");
const path	     = require("path");
const app        = express();

// Made this a constant for ease of use
const WEB_PORT = 3000

// Since you are serving static content - you should all this
app.use(express.static("view"));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "view/index.html"));
	console.log("Connection established!");
});

app.listen(WEB_PORT, () => {
	// Note the quotation marks - it's a template string literal in JavaScript
	// You can do stuff like ${2+2} and it will evaluate the expressions
	console.log(`WebApp listening on port ${WEB_PORT}`);
});
