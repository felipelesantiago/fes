const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { certificate } = require("./endpoints/certificate.js");
const { initialize } = require("./endpoints/initialize.js");
const { updateDocData } = require("./endpoints/update-doc.js");
const { getAll } = require("./endpoints/getAll.js");
const { getFile } = require("./endpoints/getFile.js");
const cors = require("cors");
const { repertorio } = require("./endpoints/repertorio.js");
const authenticateToken = require("./utils/authMiddlewareGeneral.js");
const { getAllUsers } = require("./endpoints/getUsers.js");
const {
  validateUser,
  validateUserByCredentials,
} = require("./endpoints/validateUser.js");
const { getUser } = require("./endpoints/getUser.js");
const authenticateUserAsAdmin = require("./utils/authMiddlewareAdmin.js");
const { disableUser } = require("./endpoints/disableUser.js");
const { enableUser } = require("./endpoints/enableUser.js");
const { updateUserData } = require("./endpoints/updateUser.js");
const { createUser } = require("./endpoints/createUser.js");
const { retrievePassword } = require("./endpoints/retrieve-password.js");
const { updatePassword } = require("./endpoints/updatePassword.js");
require("dotenv").config();
const multer = require("multer");
const async = require("async");
const { addFile } = require("./endpoints/addFile.js");
const { resign } = require("./endpoints/resign.js");

const PORT = process.env.PORT;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

// Crear una cola con concurrencia limitada a 5
const queue = async.queue(async (task, callback) => {
  await task();
  callback();
}, 5);

app.get("/", async (req, res) => {
  res.send("Working...");
});

app.post("/certificate", (req, res) => {
  queue.push(async () => {
    await certificate(req.body, res);
  });
});

app.post("/repertorio", (req, res) => {
  queue.push(async () => {
    await repertorio(req.body, res);
  });
});

app.post("/add-file", (req, res) => {
  queue.push(async () => {
    await addFile(req.body, res);
  });
});

app.post("/initialize", upload.single("object"), (req, res) => {
  queue.push(async () => {
    await initialize(req.body, res);
  });
});

app.post("/update-doc", (req, res) => {
  queue.push(async () => {
    await updateDocData(req.body, res);
  });
});

app.get("/get-all", (req, res) => {
  queue.push(async () => {
    await getAll(res);
  });
});

app.get("/files/:docId", (req, res) => {
  queue.push(async () => {
    await getFile(req.params, res);
  });
});

app.get("/users", authenticateUserAsAdmin, (req, res) => {
  queue.push(async () => {
    await getAllUsers(res);
  });
});

app.get("/user", authenticateToken, (req, res) => {
  queue.push(async () => {
    await getUser(req, res);
  });
});

app.patch("/disable/:id", authenticateUserAsAdmin, (req, res) => {
  queue.push(async () => {
    await disableUser(req.params, res);
  });
});

app.patch("/enable/:id", authenticateUserAsAdmin, (req, res) => {
  queue.push(async () => {
    await enableUser(req.params, res);
  });
});

app.post("/update-user", authenticateUserAsAdmin, (req, res) => {
  queue.push(async () => {
    await updateUserData(req.body, res);
  });
});

app.post("/add-user", authenticateUserAsAdmin, (req, res) => {
  queue.push(async () => {
    await createUser(req.body, res);
  });
});

app.get("/validate", (req, res) => {
  queue.push(async () => {
    await validateUser(req, res);
  });
});

app.post("/validate-credentials", (req, res) => {
  queue.push(async () => {
    await validateUserByCredentials(req, res);
  });
});

app.post("/test", authenticateUserAsAdmin, (req, res) => {
  // Implementation for the /test endpoint
});

app.post("/retrieve-password", (req, res) => {
  queue.push(async () => {
    await retrievePassword(req, res);
  });
});

app.post("/update-password", (req, res) => {
  queue.push(async () => {
    await updatePassword(req, res);
  });
});

app.post("/resign", (req, res) => {
  queue.push(async () => {
    await resign(req.body, res);
  });
});

// Iniciar el servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
