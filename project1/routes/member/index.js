const express = require("express");
const multer = require("multer");
const path = require("path");
const member = require("../../models/member");
const message = require("../../commonLib/message");
const { joinFormValidator } = require("../../middlewares/validators/join");
const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      // 파일을 저정할 디렉토리
      done(null, "profiles/");
    },
    filename: (req, file, done) => {
      // 저장될 파일명, file -> 업로드된 파일 정보
      const ext = path.extname(file.originalname);
      const filename = path.basename(file.originalname, ext) + Date.now() + ext;
      done(null, filename);
    },
  }),
  // 파일 최대 용량 = 10m
  limits: { fileSize: 10 * 1024 * 1024 },
});

router
  .route("/join")
  /**회원가입 양식 */
  .get((req, res, next) => {
    const data = { pageTitle: "회원가입" };
    data.addScripts = ["/js/form.js", "/js/number.js"];
    data.addStyles = ["/css/form.css", "/css/number.css"];

    res.render("member/form", data);
  })

  /**회원가입 처리
   * 1.유효성 검사 (미들웨어)
   * 2.member 모델 (join 메소드)
   * 3.req.file
   */

  .post(upload.single("image"), joinFormValidator, async (req, res, next) => {
    try {
      if (req.file) {
        req.body.filename = req.file.filename || {};
      }
      await member.join(req.body);

      //가입 성공시 로그인 페이지로 이동
      return res.send("");
    } catch (err) {
      console.error(err);
      next(err); //에러처리 미들웨어로 이동
    }
  });

module.exports = router;
