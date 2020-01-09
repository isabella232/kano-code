/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { css } from 'lit-element/lit-element.js';

export const challengeStyles = css`
    .emoji {
        max-width: 18px;
        max-height: 18px;
        transform: translateY(4px);
    }
    kc-editor-banner {
        width: 272px;
    }
    @media only screen and (max-width: 980px) {
        kc-editor-banner {
            width: 195px;
        }
    }
`;
