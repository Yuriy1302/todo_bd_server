const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", require("./routes/user.routes"));
app.use("/lists", require("./routes/todo.routes"));

function start() {
    try {
        app.listen(PORT, () => {
            console.log("Server has been started on PORT: ", PORT);
        });        
    } catch (err) {
        console.log("Server didn\'t start!");
        process.exit(1);
    }
}

start();






