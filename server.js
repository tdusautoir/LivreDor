let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let session = require("express-session");
let flash = require("./middlewares/flash");
let user = require("./middlewares/user");

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
app.use(user);

// Routes
app.get("/", (request, response) => {
  // console.log(request.session);
  let Message = require("./models/message");
  Message.all(function (messages) {
    if (messages.length > 0) {
      response.render("pages/index", { messages: messages });
    } else {
      response.render("pages/index", { messages: undefined });
    }
  });
});
app.get("/message/:user", (request, response) => {
  let Message = require("./models/message");
  Message.find(request.params.user, function (messages) {
    response.render("message/show", { messages: messages });
  });
});

app.post("/user", (request, response) => {
  if (request.body.user === undefined || request.body.user === "") {
    request.flash("error", "Veuillez indiquer un nom.");
    response.redirect("/");
  } else {
    request.user(request.body.user);
    response.redirect("/");
  }
});

app.post("/action/logout", (request, response) => {
  request.session.user = undefined;
  request.flash("error", "Vous vous êtes déconnecté");
  response.redirect("/");
});

app.post("/", (request, response) => {
  if (request.body.message === undefined || request.body.message === "") {
    request.flash("error", "Vous n'avez pas posté de message.");
    response.redirect("/");
  } else {
    let Message = require("./models/message");
    Message.create(request.body.message, request.session.user, function () {
      request.flash("success", "Votre message a bien été envoyé");
      response.redirect("/");
    });
  }
});

app.listen(8080);
