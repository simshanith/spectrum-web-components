/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { CSSResultArray, property, html, TemplateResult } from 'lit-element';
import { ButtonBase } from './button-base.js';
import buttonStyles from './action-button.css.js';

export class ActionButton extends ButtonBase {
    @property({ type: Boolean, reflect: true })
    public quiet = false;

    @property({ type: Boolean, reflect: true })
    public selected = false;

    @property({ type: Boolean, reflect: true, attribute: 'hold-affordance' })
    public holdAffordance = false;

    public static get styles(): CSSResultArray {
        return [...super.styles, buttonStyles];
    }

    protected get buttonContent(): TemplateResult[] {
        const content = super.buttonContent;
        if (this.holdAffordance) {
            content.push(html`
                <svg
                    id="hold-affordance"
                    xmlns="http://www.w3.org/2000/svg"
                    width="6"
                    height="6"
                    aria-hidden="true"
                >
                    <path
                        d="M5.74.01a.25.25 0 00-.177.073l-5.48 5.48a.25.25 0 00.177.427h5.48a.25.25 0 00.25-.25V.26a.25.25 0 00-.25-.25z"
                    />
                </svg>
            `);
        }
        return content;
    }
}
