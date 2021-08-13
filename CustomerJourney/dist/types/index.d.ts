/**
 * Copyright (c) Cisco Systems, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { LitElement, PropertyValues } from "lit-element";
import "@cjaas/common-components/dist/comp/cjaas-timeline-item";
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
    showSummary: boolean;
    subscribeAgentContactDataEvents(): Promise<void>;
    static get styles(): import("lit-element").CSSResult;
    static get properties(): {
        showSummary: {
            type: NumberConstructor;
            /**
             * Compare myProp's new value with its old value.
             *
             * Only consider myProp to have changed if newVal is larger than
             * oldVal.
             */
            hasChanged(newVal: any, oldVal: any): boolean;
        };
    };
    constructor();
    firstUpdated(changeProperties: PropertyValues): Promise<void>;
    disconnectedCallback(): void;
    handleButtonClick(): void;
    textToEdit: string;
    render(): import("lit-element").TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "my-custom-component": CustomerJourneyWidget;
    }
}
