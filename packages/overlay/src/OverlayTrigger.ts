/*
Copyright 2020 Adobe. All rights reserved.
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
    property,
    CSSResultArray,
    TemplateResult,
} from 'lit-element';

import overlayTriggerStyles from './overlay-trigger.css.js';

import { Placement, TriggerInteractions } from './overlay-types';
import { Overlay } from './overlay.js';

/**
 * A overlay trigger component for displaying overlays relative to other content.
 * @element overlay-trigger
 *
 * @slot hover-content - The content that will be displayed on hover
 * @slot click-content - The content that will be displayed on click
 */
export class OverlayTrigger extends LitElement {
    private closeClickOverlay?: () => void;
    private closeHoverOverlay?: () => void;

    public static get styles(): CSSResultArray {
        return [overlayTriggerStyles];
    }

    /**
     * @type {"auto" | "auto-start" | "auto-end" | "top" | "bottom" | "right" | "left" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end" | "none"}
     * @attr
     */
    @property({ reflect: true })
    public placement: Placement = 'bottom';

    @property()
    public type?: Extract<TriggerInteractions, 'inline' | 'modal' | 'replace'>;

    @property({ type: Number, reflect: true })
    public offset = 6;

    @property({ type: Boolean, reflect: true })
    public disabled = false;

    private clickContent?: HTMLElement;
    private hoverContent?: HTMLElement;
    private targetContent?: HTMLElement;

    protected render(): TemplateResult {
        return html`
            <div
                id="trigger"
                @click=${this.onTrigger}
                @mouseenter=${this.onTrigger}
                @mouseleave=${this.onTrigger}
            >
                <slot
                    @slotchange=${this.onTargetSlotChange}
                    name="trigger"
                ></slot>
            </div>
            <div id="overlay-content">
                <slot
                    @slotchange=${this.onClickSlotChange}
                    name="click-content"
                ></slot>
                <slot
                    @slotchange=${this.onHoverSlotChange}
                    name="hover-content"
                ></slot>
            </div>
        `;
    }

    private onTrigger(event: Event): void {
        if (this.disabled) {
            return;
        }
        switch (event.type) {
            case 'click':
                this.onTriggerClick();
                return;
            case 'mouseenter':
                this.onTriggerMouseEnter();
                return;
            case 'mouseleave':
                this.onTriggerMouseLeave();
                return;
        }
    }

    public async onTriggerClick(): Promise<void> {
        /* istanbul ignore else */
        if (this.targetContent && this.clickContent) {
            if (this.type === 'modal') {
                const firstFocusable = this.querySelector(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                ) as HTMLElement;
                if (!firstFocusable) {
                    this.clickContent.tabIndex = 0;
                }
            }
            this.closeClickOverlay = await Overlay.open(
                this.targetContent,
                this.type ? this.type : 'click',
                this.clickContent,
                {
                    offset: this.offset,
                    placement: this.placement,
                    receivesFocus:
                        this.type && this.type !== 'inline'
                            ? 'auto'
                            : undefined,
                }
            );
        }
    }

    private hoverOverlayReady = Promise.resolve();

    public async onTriggerMouseEnter(): Promise<void> {
        /* istanbul ignore else */
        if (this.targetContent && this.hoverContent) {
            let overlayReady: () => void = () => {
                return;
            };
            this.hoverOverlayReady = new Promise((res) => {
                overlayReady = res;
            });
            this.closeHoverOverlay = await Overlay.open(
                this.targetContent,
                'hover',
                this.hoverContent,
                {
                    offset: this.offset,
                    placement: this.placement,
                }
            );
            overlayReady();
        }
    }

    public async onTriggerMouseLeave(): Promise<void> {
        await this.hoverOverlayReady;
        /* istanbul ignore else */
        if (this.closeHoverOverlay) {
            this.closeHoverOverlay();
            delete this.closeHoverOverlay;
        }
    }

    private onClickSlotChange(event: Event): void {
        const content = this.extractSlotContentFromEvent(event);
        this.clickContent = content;
    }

    private onHoverSlotChange(event: Event): void {
        const content = this.extractSlotContentFromEvent(event);
        this.hoverContent = content;
    }

    private onTargetSlotChange(event: Event): void {
        const content = this.extractSlotContentFromEvent(event);
        this.targetContent = content;
    }

    private extractSlotContentFromEvent(event: Event): HTMLElement | undefined {
        /* istanbul ignore if */
        if (!event.target) {
            return;
        }
        const slot = event.target as HTMLSlotElement;
        const nodes = slot.assignedNodes();
        return nodes.find((node) => node instanceof HTMLElement) as HTMLElement;
    }

    public disconnectedCallback(): void {
        /* istanbul ignore else */
        if (this.closeClickOverlay) {
            this.closeClickOverlay();
            delete this.closeClickOverlay;
        }
        super.disconnectedCallback();
    }
}
