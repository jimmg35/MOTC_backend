"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seeder = void 0;
const tsyringe_1 = require("tsyringe");
const dbcontext_1 = require("./dbcontext");
const Role_1 = require("./entity/authentication/Role");
let Seeder = class Seeder {
    constructor(dbcontext) {
        this.seedRole = async () => {
            const role_repository = this.dbcontext.connection.getRepository(Role_1.Role);
            await role_repository.query("ALTER SEQUENCE role_id_seq RESTART WITH 1;");
            await role_repository.query("TRUNCATE TABLE role CASCADE;");
            await role_repository.insert([
                { roleName: "user" },
                { roleName: "admin" }
            ]);
        };
        this.dbcontext = dbcontext;
    }
};
Seeder = __decorate([
    tsyringe_1.autoInjectable(),
    __metadata("design:paramtypes", [dbcontext_1.WebApiContext])
], Seeder);
exports.Seeder = Seeder;
