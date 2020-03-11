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

import {
    html,
    LitElement,
    CSSResultArray,
    TemplateResult,
    property,
    CSSResult,
} from 'lit-element';

import fieldLabelStyles from './field-label.css.js';

type Constructor<T = object> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): T;
    prototype: T;
    styles?: CSSResult | CSSResultArray | undefined;
};

export interface FieldLabelInterface {
    label: string;
    renderLabel(): TemplateResult;
}

export const FieldLabelMixin = <T extends Constructor<LitElement>>(
    SuperClass: T
): T & Constructor<FieldLabelInterface> => {
    class InputWithFieldLabel extends SuperClass
        implements FieldLabelInterface {
        public static get styles(): CSSResultArray {
            return [SuperClass.styles || [], fieldLabelStyles];
        }

        @property({ type: String })
        public label = '';

        @property({ type: String, attribute: 'labelled-on', reflect: true })
        public labelledOn = '';

        public click(): void {
            console.log('click');
            super.click && super.click();
        }

        public renderLabel(): TemplateResult {
            if (!this.label) return html``;
            return html`
                <label for="input" @click=${this.click}>${this.label}</label>
            `;
        }

        protected render(): TemplateResult {
            return html`
                ${this.renderLabel()} ${super.render()}
            `;
        }
    }

    return InputWithFieldLabel;
};

export class FieldLabel extends FieldLabelMixin(LitElement) {
    protected render(): TemplateResult {
        return this.renderLabel();
    }
}
