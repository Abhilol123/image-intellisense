const Express = require("express");
const BodyParser = require("body-parser");
const CookieParser = require("cookie-parser");
const Cors = require("cors");
const Router = require("./Router");
const fileUpload = require('express-fileupload');

const app = Express();

app.use(CookieParser());

app.use(fileUpload({
	createParantPath: true
}))

app.use(BodyParser.urlencoded({
	limit: '30MB',
	extended: true
}));

app.use(BodyParser.json({ limit: '30MB' }));

app.use(Cors());

const NODEJS_PORT = process.env.NODEJS_PORT ?? "9000";

app.options("*", Cors());

app.use("/", Router);

process.once('SIGINT', () => {
	return process.emit('cleanup_and_exit');
});

process.once('SIGTERM', () => {
	return process.emit('cleanup_and_exit');
});

app.listen(NODEJS_PORT, () => {
	return console.log(`Listening to requests on http://localhost:${NODEJS_PORT}`);
});
