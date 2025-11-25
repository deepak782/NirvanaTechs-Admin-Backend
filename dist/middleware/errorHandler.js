"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;
