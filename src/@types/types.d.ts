/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

// Use for tests. web-tester exposes chai automatically
declare const assert : Chai.Assert;

declare function fixture<T>(a : TemplateStringsArray) : () => T;
