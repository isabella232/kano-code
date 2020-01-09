/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

export function memoize(target: any, key: string, descriptor: any) {
	let fnKey: string | null = null;
	let fn: Function | null = null;

	if (typeof descriptor.value === 'function') {
		fnKey = 'value';
		fn = descriptor.value;

		if (fn!.length !== 0) {
			throw new Error('Memoize should only be used in functions with zero parameters');
		}
	} else if (typeof descriptor.get === 'function') {
		fnKey = 'get';
		fn = descriptor.get;
	}

	if (!fn) {
		throw new Error('not supported');
	}

	const memoizeKey = `$memoize$${key}`;

	descriptor[fnKey!] = function (...args: any[]) {
		if (!this.hasOwnProperty(memoizeKey)) {
			Object.defineProperty(this, memoizeKey, {
				configurable: false,
				enumerable: false,
				writable: false,
				value: fn!.apply(this, args),
			});
		}

		return this[memoizeKey];
	};
}