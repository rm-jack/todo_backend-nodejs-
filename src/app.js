require("dotenv").config({ path: __dirname + "/config/.env" });

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger_output.json");

const app = express();
const routes = require("./routes");

app.use(express.json());
app.use(routes);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});
