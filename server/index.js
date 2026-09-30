import app from "./src/app.js";
import { PORT } from "./src/config/env.js";
import connectDB from "./src/db/mongodb.js";

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
