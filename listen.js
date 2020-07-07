const app = require("./app");
const port = process.env.PORT || 5000;

// server called app will listen on port 5000 unless there is  a specific port declared in the runtime environment

app.listen(port);
console.log(`server listening on the port ${port}`);
