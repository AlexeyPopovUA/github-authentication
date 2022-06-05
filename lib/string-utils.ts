const forbiddenSymbols = /([^\w\d]|[_])+/g;
export const toSafeFormat = str => str.toLowerCase().replace(forbiddenSymbols, '-').slice(0, 80);
export const toShortSafeFormat = str => toSafeFormat(str).slice(0, 36);
export const toPatchFolder = str => str.replace(/\d+$/, "x");
export const isVersionFormat = str => str && /^v\d+\.\d+\.\d+$/.test(str);
