/**
 * Copyright (c) Cisco Systems, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import "@cjaas/common-components/dist/comp/cjaas-timeline-item";
import '@tinymce/tinymce-webcomponent/dist/tinymce-webcomponent.js';
import { LitElement, PropertyValues } from "lit-element";
export interface CustomerEvent {
    data: Record<string, any>;
    firstName: string;
    lastName: string;
    email: string;
    datacontenttype: string;
    id: string;
    person: string;
    source: string;
    specversion: string;
    time: string;
    type: string;
}
export default class CustomerJourneyWidget extends LitElement {
    taskId: string | undefined;
    token: string | undefined;
    showSummary: boolean;
    renderModal: boolean;
    summary: string;
    subscribeAgentContactDataEvents(): Promise<void>;
    getSummary(): Promise<void>;
    static get styles(): import("lit-element").CSSResult;
    static get properties(): {
        renderModal: {
            type: BooleanConstructor;
            /**
             * Compare myProp's new value with its old value.
             *
             * Only consider myProp to have changed if newVal is larger than
             * oldVal.
             */
            hasChanged(newVal: any, oldVal: any): boolean;
        };
        showSummary: {
            type: BooleanConstructor;
        };
        summary: {
            type: StringConstructor;
        };
        taskId: {
            type: StringConstructor;
        };
        token: {
            type: StringConstructor;
        };
    };
    constructor();
    firstUpdated(changeProperties: PropertyValues): Promise<void>;
    updated(changedProperties: PropertyValues): void;
    disconnectedCallback(): void;
    handleButtonClick(): void;
    handleSubmit(): Promise<void>;
    render(): import("lit-element").TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "my-custom-component": CustomerJourneyWidget;
    }
}
