const mongoose = require("mongoose");
const URI = "mongodb+srv://Bruno:xtharex1234@cluster0.gxrjn.mongodb.net/salao";

mongoose
  .connect(URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
  .then(() => console.log("DB is Up!"))
  .catch((err) => console.log(err));
