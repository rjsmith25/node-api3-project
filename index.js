// code away!
const server = require("./server");
const userRouter = require("./users/userRouter");

//port to listen on
const port = process.env.PORT || 3000;

server.use("/api/users", userRouter);

server.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
