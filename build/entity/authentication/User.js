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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const UserThumbnail_1 = require("./UserThumbnail");
const Role_1 = require("./Role");
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], User.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ length: 20, unique: true }),
    class_validator_1.IsNotEmpty({ message: 'username is required' }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsNotEmpty({ message: 'password is required' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ length: 20, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "alias", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Role_1.Role, role => role.users),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    typeorm_1.Column({ name: 'email' }),
    class_validator_1.IsEmail({}, { message: 'Incorrect email' }),
    class_validator_1.IsNotEmpty({ message: 'The email is required' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.Column({ length: 128 }),
    __metadata("design:type", String)
], User.prototype, "mailConfirmationToken", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserThumbnail_1.UserThumbnail, userthumbnail => userthumbnail.user),
    __metadata("design:type", Array)
], User.prototype, "thumbnails", void 0);
User = __decorate([
    typeorm_1.Entity({ name: 'user' })
], User);
exports.User = User;
