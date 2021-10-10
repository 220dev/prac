const express = require("express");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { sequelize } = require("./models");

dotenv.config();

// 라우터
const memberRouter = require("./routes/member");

app.set("port", process.env.PORT || 3333);

app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "LHYID",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //post 사용

// 라우터 등록
app.use("/member", memberRouter);

app.use((req, res, next) => {
  const error = new Error(
    `${req.method} ${req.url}은 존재하지 않는 페이지입니다.`
  );
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status || 500).render("error");
  // error.html
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
