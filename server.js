const express = require("express");
const { createClient } = require("redis");
const app = express();
const client = createClient();
const PORT = 3000;

const getAllUsers = async () => {
  const time = Math.random() * 5000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "123", name: "user 1" },
        { age: "456", name: "user 2" },
      ]);
    }, time);
  });
};

app.get("/", async (req, res) => {
  const usersFromCache = await client.get("users-list");

  if (usersFromCache) {
    return res.send(JSON.parse(usersFromCache));
  }

  const usersData = await getAllUsers();
  await client.set("users-list", JSON.stringify(usersData), { EX: 10 });
  return res.send(usersData);
});

const startup = async () => {
  await client.connect();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startup();
