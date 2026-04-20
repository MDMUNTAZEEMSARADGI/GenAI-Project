require("dotenv").config();
const app = require("./src/app");
const connectToDb = require("./src/config/databases");

connectToDb();

app.listen(3000, () => {
  console.log(`Server is running on PORT ${3000}`);
});
    