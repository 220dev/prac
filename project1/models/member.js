// import bcrypt from 'bcrypt';
const bcrypt = require("bcrypt");
const {
  sequelize,
  Sequelize: { QueryTypes },
} = require("./index");

// member model
const member = {
  /**
   * 회원가입처리
   * 비밀번호 해시는 bcrypt 방식으로 생성한다.
   *
   * @param Object params : 가입데이터
   * @return Integer|Boolean 성공시 회원번호, 실패시 false
   * Integer는 여기서 회원번호를 뜻함
   */
  join: async function (params) {
    try {
      const sql = `INSERT INTO member (memId, memPw, memNm, mobile, profile)
            VALUES (:memId, :memPw, :memNm, :mobile, :profile)`;

      const hash = await bcrypt.hash(params.memPw, 10);

      const replacements = {
        memId: params.memId,
        memPw: hash,
        memNm: params.memNm,
        mobile: params.mobile,
        profile: params.filename || "",
      };

      return result[0];
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  /**
   * 로그인 처리
   *
   * @param String memId 회원 아이디
   * @param Srting memPw 회원 비밀번호
   * @param Request req 객체
   *                req.session.속성명
   *
   * @return Boolean
   */

  login: async function (memId, memPw, req) {
    try {
      const sql = "SELECT * FROM member2 WHERE memId = ?";
      const rows = await sequelize.query(sql, {
        replacements: [memId], // memId = ?에 치환될 수 있는것이 replacements
        type: QueryTypes.SELECT,
      });
      if (rows && rows[0]) {
        const match = await bcrypt.compare(memPw, rows[0].memPw); //bcrypt.compare는 로그인시 사용자가 입력한 비밀번호의 해시값이 데베에 저장된 해시값과 같은지 비교하는 메소드
        //리턴은 불리언으로 비교해보고 해시값이 같으면 t 다르면 f리턴
        if (match) {
          // 로그인 세션 처리
          delete rows[0].memPw;
          req.session.member = rows[0];
          req.session.memNo = rows[0].memNo;

          return true;
        } else {
          return false;
        }
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};

module.exports = member;
