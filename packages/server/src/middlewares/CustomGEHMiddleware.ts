import {Exception} from "@tsed/exceptions";
import {Err, GlobalErrorHandlerMiddleware, IMiddlewareError, OverrideProvider, Req, Res} from "@tsed/common";
import {Env} from "@tsed/core";

/**
 * @middleware
 */
@OverrideProvider(GlobalErrorHandlerMiddleware)
export class CustomGEHMiddleware implements IMiddlewareError {

    use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
        const logger = request.ctx.logger;

        if (error instanceof Exception || error.status) {
            logger.error({
                error: {
                    message: error.message,
                    stack: error.stack,
                    status: error.status,
                    origin: error.origin
                }
            });

            response.status(error.status).json({
                message: error.message,
                stack: error.stack,
                status: error.status,
                origin: error.origin
            });

            return;
        }

        if (typeof error === "string") {
            response.status(404).json({
                message: error,
                status: 404
            });

            return;
        }

        logger.error({
            error: {
                status: 500,
                message: error.message,
                stack: error.stack,
                origin: error.origin
            }
        });

        response.status(error.status || 500).json(process.env.NODE_ENV === Env.PROD ?
            {message: "Internal Error"} :
            {
                status: 500,
                message: error.message,
                stack: error.stack,
                origin: error.origin
            });

        return;
    }
}
