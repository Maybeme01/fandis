import * as TextModule from "@components/Text";
/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
*/

import { findByPropsLazy } from "../webpack";

export * from "./components";
export * from "./menu";
export * from "./modals";
export * from "./react";
export * from "./stores";
export * from "./userSettings";
export * from "./utils";

export const Toasts = {
    Type: { SUCCESS: 0, FAILURE: 1, INFO: 2, WARNING: 3 },
    show: (...args: any[]) => {},
    genId: () => Math.random().toString(36).slice(2)
};

const dummyProxy: any = new Proxy(() => null, {
    get: () => dummyProxy
});

export const Button: any = typeof findByPropsLazy === "function" ? (findByPropsLazy("Sizes", "Colors", "Looks") ?? dummyProxy) : dummyProxy;
const ResolvedText: any = (TextModule as any).default ?? (TextModule as any).Text ?? TextModule;
export const Text: any = ResolvedText;
export const Forms: any = typeof findByPropsLazy === "function" ? (findByPropsLazy("FormItem", "FormTitle") ?? dummyProxy) : dummyProxy;

