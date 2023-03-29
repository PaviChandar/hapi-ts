"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.registerValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const registerValidation = (input) => {
    const registerSchema = joi_1.default.object({
        firstname: joi_1.default.string()
            .min(5)
            .required(),
        lastname: joi_1.default.string()
            .min(5)
            .required(),
        email: joi_1.default.string()
            .min(5)
            .required(),
        password: joi_1.default.string()
            .min(5).
            required(),
    });
    return registerSchema.validate(input);
};
exports.registerValidation = registerValidation;
const userValidation = (user) => {
    const usersSchema = joi_1.default.object({
        username: joi_1.default.string().min(5).required(),
        password: joi_1.default.string().min(5).required()
    });
    return usersSchema.validate(user);
};
exports.userValidation = userValidation;
