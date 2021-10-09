const message = require('../../commonLib/message');
const { sequelize, Sequelize : { QueryTypes } } = require("../../models");
const fs = require ('fs').promises;

/**
 * 회원 가입 유효성 검사
 * 
 * 검사 실패시 이전 페이지로 되돌아가기
 * 검사 성공기 next() 호출, 다음 미들웨어로 진행
 */

module.exports.joinFormValidator = async function (req, res, next) {
    try {
        // 필수 입력항목
        const required = {
            memId : "아이디를 입력해주세요.",
            memPw : "비밀번호를 입력해주세요.",
            memPwRe : "비밀번호가 일치하지 않습니다.",
            memNm : "이름을 입력해주세요.",
        };

    // 실행
    for (key in required) {
        if (!req.body[key]) {
            throw new Error (required[key]);
        }
    }

    /**
     * 아이디 체크
     * 자리수 : 8 ~ 15
     * 소문자 알파벳과 숫자로 구성
     */
    const memId = req.body.memId;
    if (memId.length < 8 || memId.length > 15 || /[^a-z0-9]/text(memId)) {
        throw new Error("소문자 알파벳과 숫자로 구성된 8~15자");
    }

    // 아이디 중복 체크
    const sql = " SELECT COUNT(*) as cnt FROM member WHERE memId = ? ";
    const rows = await sequelize.query(sql, {
        replacements : [memId],
        type : QueryTypes.SELECT,
    });
    if (rows[0].cnt > 0) {
        throw new Error(`${memId}는 이미 존재하는 아이디입니다.`);
    }

    /**
     * 비밀번호 체크
     * 자리수 : 8 ~ 20
     * 소문자, 대문자, 숫자, 특수문자가 모두 포함한 구성
     */

     const memPw = req.body.memPw;
     if (memPw.length < 8 || memPw.length > 20 || !/[a-z]/.test(memPw) || !/[A-Z]/.test(memPw) || !/[\d]/.test(memPw) || !/[~!@#$%\^&\*\(\)]/.test(memPw)) {
         throw new Error("");
    }

     if (req.body.memPw != req.body.memPwRe) {
        throw new Error("비밀번호가 일치하지 않습니다.");
    }

    // 휴대전화 체크
    if (req.body.mobile) {
        let mobile = req.body.mobile.replace(/\D/g, "");
        if (mobile.length !=11) {
            throw new Error("휴대전화번호를 정확히 입력해주시기 바랍니다.");
        }

        /**
         * (패턴) (패턴) .. (패턴) -> 서브 패던 -> 교체, 패턴별 데이터 추출
         * 010 1234 1234  010-1234-1234  010_1234_1234  010*1234*1234
         */
		req.body.mobile = mobile.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
		}

        /**
         * 업로드 파일 체크
         * 1.이미지 체크
         * 2.이미지가 아니면 삭제 후 다시 업로드 요청
         */
		if (req.file) {
			// 이미지가 아닌 파일이 업로드 되었을때 
			if (req.file.mimetype.indexOf("image") == -1) {
				// 파일 삭제
				await fs.unlink(req.file.path)
				
				// 다시 업로드 요청
				throw new Error("이미지 형식의 파일만 업로드 가능합니다.");
			}
		}

	} catch (err) {
		message.alertBack(err.message, res);
		return;
	}
	
	next(); 
    // 유효성 검사 성공시 다음 미들웨어로 이동 
};