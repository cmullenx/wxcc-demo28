/**
 * Copyright (c) Cisco Systems, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// This file imports all of the webcomponents from "components" folder

import {
  html,
  internalProperty,
  property,
  LitElement,
  PropertyValues,
  query,
} from "lit-element";
import { nothing } from "lit-html";
import { classMap } from "lit-html/directives/class-map";
import { customElementWithCheck } from "./mixins/CustomElementCheck";
import styles from "./assets/styles/View.scss";
import { DateTime } from "luxon";
import { Button, ButtonGroup, Input } from "@momentum-ui/web-components";
import { ServerSentEvent } from "./types/cjaas";
import { EventSourceInitDict } from "eventsource";
import "@cjaas/common-components/dist/comp/cjaas-timeline-item";

import { Desktop } from "@wxcc-desktop/sdk";
import { Service } from "@wxcc-desktop/sdk-types";

const logger = Desktop.logger.createLogger("my-custom-component");
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

@customElementWithCheck("my-custom-component")
export default class CustomerJourneyWidget extends LitElement {
  

    @internalProperty() responseData: any;


  subscribeAgentContactDataEvents() {

    Desktop.agentContact.addEventListener(
      "eAgentContactEnded",
      (msg: Service.Aqm.Contact.AgentContact) => {
        logger.info("AgentContact eAgentContactEnded: ", msg);
        this.responseData = msg.data;
      }
    );
    Desktop.agentContact.addEventListener(
      "eAgentContactWrappedUp",
      (msg: Service.Aqm.Contact.AgentContact) => {
        logger.info("AgentContact eAgentContactWrappedUp: ", msg);
        this.responseData = msg.data;
      }
    );
 


  }

  static get styles() {
    return styles;
  }

  async connectedCallback() {
    super.connectedCallback();

    await Desktop.config.init();

  //   this.getCurrentInteractionId();
    this.subscribeAgentContactDataEvents();
  //   this.subscribeDialerEvents();
  //   this.subscribeScreenpopEvent();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    Desktop.agentContact.removeAllEventListeners();
    // Desktop.dialer.removeAllEventListeners();
    // Desktop.screenpop.removeAllEventListeners();
  }

  handleButtonClick() {
    console.log('button clicked')
    
    this.showSummary = !this.showSummary
    console.log(this.showSummary)
  }

  @property() showSummary = true

 @property() textToEdit = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
  ultricies lorem sem, id placerat massa rutrum eu. Sed dui neque,
  tincidunt quis sapien in, aliquam dignissim nulla. Vestibulum
  mollis at orci ac facilisis. Sed ut aliquam nunc. Suspendisse eu
  interdum odio. Sed libero dui, malesuada ac vulputate id,
  vulputate vel nisi. Proin id egestas mi. Fusce ut sem nibh.
  Vivamus aliquet accumsan feugiat. Etiam accumsan tortor quis
  ultrices tempus. Aenean porta feugiat ex. Praesent dictum mauris
  et dui posuere aliquet et non arcu. Sed eget aliquam elit. Nullam
  ornare ipsum quis feugiat tincidunt. Nullam a libero sed enim
  dictum convallis. Suspendisse egestas elit risus, at ultrices
  massa blandit eget. Vivamus dapibus bibendum nisl, eget cursus
  risus ultrices et. Quisque felis tortor, accumsan vel tempus quis,
  rutrum sed urna. Nulla quis magna et eros facilisis blandit. Nunc
  mattis urna eget diam accumsan, non vehicula est aliquet. Etiam
  vestibulum dui neque, faucibus sollicitudin nibh vestibulum vel.
  Nullam semper porta ipsum non varius. Vestibulum sollicitudin
  ipsum mauris. Praesent quis nisi sagittis, malesuada lacus semper,
  iaculis elit.`

  render() {
    return html`
    ${
      this.showSummary ? 
      html`<div class="some-class">
      <md-editable-field content=${this.textToEdit}></md-editable-field>
      <div class="some-class">
      <md-button @button-click=${this.handleButtonClick}>Submit</md-button>
      <div>
    </div>
    ` : null }`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-custom-component": CustomerJourneyWidget;
  }
}
