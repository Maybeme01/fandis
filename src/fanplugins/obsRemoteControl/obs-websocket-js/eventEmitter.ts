/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export class EventEmitter<Events extends Record<string, any> = Record<string, any>> {
    events: {
        [key: string]: ((val?: any) => void)[];
    };

    constructor() {
        this.events = {};
    }

    on<K extends string & keyof Events>(eventName: K, callback: (val: Events[K]) => void): void;
    on(eventName: string, callback: (val: any) => void): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callback);
    }

    emit<K extends string & keyof Events>(
        eventName: K,
        ...args: Events[K] extends void ? [val?: undefined] : [val: Events[K]]
    ): void;
    emit(eventName: string, ...args: [val?: any]): void {
        if (!this.events[eventName]) {
            return;
        }

        this.events[eventName].forEach(callback => {
            callback(args[0]);
        });
    }

    off<K extends string & keyof Events>(eventName: K, callback: (val: Events[K]) => void): void;
    off(eventName: string, callback: (val: any) => void): void {
        if (!this.events[eventName]) {
            return;
        }

        this.events[eventName] = this.events[eventName].filter(cb => {
            return cb !== callback;
        });
    }

    clear() {
        this.events = {};
    }

    once<K extends string & keyof Events>(eventName: K, callback: (val: Events[K]) => void): void;
    once(eventName: string, callback: (val: any) => void): void {
        const onceCallback = (val: any) => {
            callback(val);
            this.off(eventName, onceCallback);
        };

        this.on(eventName, onceCallback);
    }
}
