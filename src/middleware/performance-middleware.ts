const Global: Window = window;

function performanceMiddleware(ctx: any, next: any): any {
    console.log('performance-middleware', Global.performance);
    next();
}

export default performanceMiddleware;
