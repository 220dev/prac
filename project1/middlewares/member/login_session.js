/**
 * [미들웨어] 로그인 세션 처리
 * 회원 정보 유지
 * req.session.memNo = 로그인 한 경우
 */

module.exports = () => {
  return (req, res, next) => {
    if (req.session.memNo) {
      // 로그인한 상태
      res.locals.isLogin = req.isLogin = true;
      if (req.session.member.profile) {
        req.session.member.profileUrl =
          "/profiles" + req.session.member.ptofile;
      }
      req.member = res.locals.member = req.session.member;
    } else {
      // 로그인하지 않은 상태
      res.locals.isLogin = req.isLogin = false;
    }
    // 다음 미들웨어로 이동
    next();
  };
};
