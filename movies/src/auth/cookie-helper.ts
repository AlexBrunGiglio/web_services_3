import { CookieOptions, Request, Response } from "express";

export class CookieHelpers {
    static setCookie(res: Response, key: string, value: string, options?: CookieOptions) {
        if (!res)
            return;
        res.cookie(key, value, options);
    }
    static getCookie(req: Request, key: string) {
        if (!req || !req.cookies)
            return null;
        return req.cookies[key];
    }
    static deleteCookie(res: Response, key: string) {
        if (!res)
            return;
        res.clearCookie(key);
    }
}