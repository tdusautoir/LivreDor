let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let session = require("express-session");
let flash = require("./middlewares/flash");

// Moteur de template
app.set("view engine", "ejs");

// Middleware
app.use("/assets", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(flash);

// Routes
app.get("/", (request, response) => {
  // console.log(request.session);
  let Message = require("./models/message");
  Message.all(function (messages) {
    response.render("pages/index", { messages: messages });
  });
});
app.get("/message/:id", (request, response) => {
  let Message = require("./models/message");
  Message.find(request.params.id, function (message) {
    response.render("message/show", { message: message });
  });
});

app.post("/", (request, response) => {
  if (request.body.message === undefined || request.body.message === "") {
    request.flash("error", "Vous n'avez pas posté de message.");
    response.redirect("/");
  } else {
    let Message = require("./models/message");
    Message.create(request.body.message, request.body.user, function () {
      request.flash("success", "Votre message a bien été envoyé");
      response.redirect("/");
    });
  }
});

app.listen(8080);
