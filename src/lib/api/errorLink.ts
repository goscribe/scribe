import { AppRouter } from "@goscribe/server";
import { TRPCClientError, TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { toast } from "sonner";

const needsAuth = (currentLocation: string) => {
    const AUTHED_PATHS = ['/storage', '/workspace']
    return AUTHED_PATHS.some(path => currentLocation.includes(path));
}

export const errorLink = (): TRPCLink<AppRouter> => {
    return () => {
        return ({ op, next }) => {
            return observable((observer) => {
                const subscription = next(op).subscribe({
                    next(value) {
                        observer.next(value);
                    },
                    error(err) {
                        const error = err as TRPCClientError<AppRouter>;
                        
                        // Check both error code and HTTP status for 401
                        const isUnauthorized = error.data?.code === 'UNAUTHORIZED' || error.data?.httpStatus === 401;
                        const isForbidden = error.data?.code === 'FORBIDDEN' || error.data?.httpStatus === 403;
                        const isNotFound = error.data?.code === 'NOT_FOUND' || error.data?.httpStatus === 404;
                        const isRateLimited = error.data?.code === 'TOO_MANY_REQUESTS' || error.data?.httpStatus === 429;
                        const isBadRequest = error.data?.code === 'BAD_REQUEST' || error.data?.httpStatus === 400;

                        switch (true) {
                            case isUnauthorized:
                                if (typeof window !== 'undefined' && needsAuth(window.location.href)) {
                                    window.location.href = '/login';
                                }
                                toast.error("You are signed out, please sign in again.");
                                break;
                            case isForbidden:
                                toast.error("The requested resource is forbidden.");
                                toast.error(error.data?.path);
                                break;
                            case isNotFound:
                                toast.error("The requested resource was not found.");
                                break;
                            case isRateLimited:
                                toast.error("Too many requests. Please wait a moment and try again.");
                                // pass through to log to Sentry
                            case isBadRequest:
                                break;
                            default:
                                // Sentry.captureException(error, {
                                //     level: severity,
                                //     tags: {
                                //         path: op.path,
                                //         code: error.data?.code,
                                //         httpStatus: error.data?.httpStatus,
                                //     },
                                //     extra: {
                                //         message: error.message,
                                //         data: error.data,
                                //     },
                                // });
                                toast.error("An error occurred, please try again later.");
                                break;
                        }

                        observer.error(err);
                    },
                    complete() {
                        observer.complete();
                    },
                });

                return () => {
                    subscription.unsubscribe();
                };
            });
        };
    };
};
