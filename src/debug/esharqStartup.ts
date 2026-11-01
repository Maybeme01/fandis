const noop = () => {};
const handler: ProxyHandler<any> = {
    get: () => new Proxy(noop, handler),
    apply: () => {}
};
export const recordPluginStart = noop;
export default new Proxy(noop, handler);
