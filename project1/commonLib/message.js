module.exports = {
  /**
   * 알림 호출
   *
   * @param String msg
   * param Object res - Response
   */
  alert: (msg, res) => {
    res.send(`<script> alert("${msg}"); </script>`);
  },

  /**
   * 알림 호출 후 뒤로 가기 (hisroty.back())
   *
   * @param Srting msg
   * @param Object res - Response
   */

  alertBack: (msg, res) => {
    res.send(`<script> alert("${msg}"); history.back(); </script>`);
  },
};
