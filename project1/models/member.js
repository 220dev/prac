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
};

module.exports = member;
