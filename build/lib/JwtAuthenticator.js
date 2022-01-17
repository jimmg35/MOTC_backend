"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtAuthenticator {
    constructor() {
        /**
         * 負責簽發jwt token
         */
        this.signToken = (payload) => {
            const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: this.expireTime });
            return token;
        };
        // public signToken = (payload: tokenPayload, aa: number): string => {
        //     const token = jwt.sign(
        //         payload,
        //         process.env.JWT_SECRET as string,
        //         { expiresIn: this.expireTime }
        //     )
        //     return token
        // }
        /**
         * 計算Token剩餘時間
         * @param token
         * @returns
         */
        this.computeLeftTime = (token) => {
            const payload = jsonwebtoken_1.default.decode(token);
            const expirationTime = payload.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            const timeDelta = expirationTime - currentTime;
            return timeDelta;
        };
        /**
         * 檢查Token是否過期
         * @param token
         * @returns
         */
        this.isTokenExpired = (token) => {
            const timeDelta = this.computeLeftTime(token);
            if (timeDelta > 0) {
                return false;
            }
            return true;
        };
        /**
         * 檢查Token是否有效
         * @param token
         * @returns
         */
        this.isTokenValid = (token) => {
            try {
                const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                return true;
            }
            catch (_a) {
                return false;
            }
        };
        this.expireTime = 5;
    }
}
exports.default = JwtAuthenticator;
(() => {
    const ja = new JwtAuthenticator();
    let token = ja.signToken({
        _userId: "123",
        username: "jimmg35"
    });
    console.log(token);
    const aa = ja.isTokenExpired("eyJhbGciOaaaiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdXNlcklkIjoiMTIzIiwidXNlcm5hbWUiOiJqaW1tZzM1IiwiaWF0IjoxNjQxODMxNzMxLCJleHAiOjE2NDE4MzE3MzZ9.ck8CsZ_eaaaa7AtlBwP3GnlqaoMD0sxJ70XESl922gQV2w8");
    console.log(aa);
    // setTimeout(() => {
    //     const tokenStatus = ja.isTokenValid(token)
    //     console.log(tokenStatus)
    // }, 10000)
})();
