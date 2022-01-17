"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoInjectSubRoutes = exports.BaseController = void 0;
const express_1 = require("express");
class BaseController {
    constructor(options = {
        routeHttpMethod: {}
    }) {
        this.setRouterName_HiddenMethod = () => {
            this.routerName = '/';
            this.routerName += this.constructor.name.replace(/Controller/g, "");
        };
        this.bindRouter_HiddenMethod = (routeName, routeHandler, httpMethod) => {
            // this._router.get("/index", this.index)
            switch (httpMethod) {
                case "GET":
                    this._router.get('/' + routeName, routeHandler);
                    break;
                case "POST":
                    this._router.post('/' + routeName, routeHandler);
                    break;
                case "PUT":
                    this._router.put('/' + routeName, routeHandler);
                    break;
                case "PATCH":
                    this._router.patch('/' + routeName, routeHandler);
                    break;
                case "DELETE":
                    this._router.delete('/' + routeName, routeHandler);
                    break;
                case "COPY":
                    this._router.copy('/' + routeName, routeHandler);
                    break;
                case "OPTIONS":
                    this._router.options('/' + routeName, routeHandler);
                    break;
            }
        };
        this._router = express_1.Router();
        this.setRouterName_HiddenMethod();
        this.routeHttpMethod = options.routeHttpMethod;
    }
    getRouter() {
        return this._router;
    }
}
exports.BaseController = BaseController;
const autoInjectSubRoutes = (controller) => {
    const listMethods = (controller) => {
        const output = [];
        for (var member in controller) {
            //@ts-ignore
            if (typeof controller[member] == "function") {
                if (controller.hasOwnProperty(member)) {
                    output.push(member);
                }
            }
        }
        return output;
    };
    const excludeBaseMethods = (methods) => {
        const output = [];
        methods.forEach((method) => {
            if (!(method.includes("_HiddenMethod") || method === "_router")) {
                output.push(method);
            }
        });
        return output;
    };
    excludeBaseMethods(listMethods(controller)).forEach((method) => {
        //@ts-ignore
        controller.bindRouter_HiddenMethod(method, controller[method], controller.routeHttpMethod[method]);
    });
};
exports.autoInjectSubRoutes = autoInjectSubRoutes;
