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
  

    @property() showSummary = false


  async subscribeAgentContactDataEvents() {

    Desktop.agentContact.addEventListener(
      "eAgentContactEnded",
      (msg: Service.Aqm.Contact.AgentContact) => {
        
        this.showSummary = true
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ contact ended$$$$$$$$$$$$$$$$$$$$$", this.showSummary); 
      }
    );
    Desktop.agentContact.addEventListener(
      "eAgentContactWrappedUp",
      (msg: Service.Aqm.Contact.AgentContact) => {
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ contact wrapped$$$$$$$$$$$$$$$$$$$$$"); 
      }
    );
 
    Desktop.agentStateInfo.addEventListener("updated", async (updatedList: any) => {

      for(let i = 0; i < updatedList.length; i++){
        console.log("this is the list of updates", updatedList[i])
        if(updatedList[i].name === "subStatus"){
          console.log("updated list substatus has been udpated")
          this.showSummary = true
        }
      }
      console.log("########################## agent state updated ######################", this.showSummary); 
      });
      
      // await this.requestUpdate('show', oldVal)
      console.log('this is the new summary state', this.showSummary)
  }


  static get styles() {
    return styles;
  }

  static get properties(){ return {
    showSummary: {
      type: Number,

      /**
       * Compare myProp's new value with its old value.
       *
       * Only consider myProp to have changed if newVal is larger than
       * oldVal.
       */
      hasChanged(newVal: any, oldVal: any) {
        if (newVal > oldVal) {
          console.log(`${newVal} > ${oldVal}. hasChanged: true.`);
          return true;
        }
        else {
          console.log(`${newVal} <= ${oldVal}. hasChanged: false.`);
          return false;
        }
      }
    }};
  }

  constructor(){
    super()
  }

  async firstUpdated(changeProperties: PropertyValues) {
    super.firstUpdated(changeProperties);
    try {
      setTimeout(async () => {
        await Desktop.config.init();
        this.subscribeAgentContactDataEvents();
      }, 2000);
    } catch (e) {
      console.error("error while initializing sdk", e);
    }
  }


  disconnectedCallback() {
    super.disconnectedCallback();
    Desktop.agentContact.removeAllEventListeners();
  }

  handleButtonClick() {
    this.showSummary = false
    this.requestUpdate()
  }

 

 @property() textToEdit = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies lorem sem, id placerat massa rutrum eu. Sed dui neque,
  tincidunt quis sapien in, aliquam dignissim nulla. Vestibulum mollis at orci ac facilisis. Sed ut aliquam nunc. Suspendisse eu interdum odio. Sed libero dui, malesuada ac vulputate id,
  vulputate vel nisi. Proin id egestas mi. Fusce ut sem nibh. Vivamus aliquet accumsan feugiat. Etiam accumsan tortor quisultrices tempus. Aenean porta feugiat ex. Praesent dictum mauris
  et dui posuere aliquet et non arcu. Sed eget aliquam elit. Nullamornare ipsum quis feugiat tincidunt. Nullam a libero sed enimdictum convallis. Suspendisse egestas elit risus, at ultrices
  massa blandit eget. Vivamus dapibus bibendum nisl, eget cursus risus ultrices et. Quisque felis tortor, accumsan vel tempus quis,
  rutrum sed urna. Nulla quis magna et eros facilisis blandit. Nuncmattis urna eget diam accumsan, non vehicula est aliquet. Etiam
  vestibulum dui neque, faucibus sollicitudin nibh vestibulum vel.Nullam semper porta ipsum non varius. Vestibulum sollicitudin
  ipsum mauris. Praesent quis nisi sagittis, malesuada lacus semper, iaculis elit.`

  render() {
    return html`
    <md-theme class="theme-toggle" id="modal">
    <md-modal
      .show=${this.showSummary}
      headerLabel="Call Summary"
      closeBtnName="Reject"
      .showCloseButton="${true}"
      .backdropClickExit="${true}"
      ?hideFooter=${true}
      ?hideHeader=${false}
      @close-modal=${this.handleButtonClick}
    >
      <md-editable-field content=${this.textToEdit}></md-editable-field>
      <div slot="footer">
        <md-button @button-click=${this.handleButtonClick} color="blue">Accept</md-button>
        <md-button @button-click=${this.handleButtonClick}>Reject</md-button>
      </div>
    </md-modal>
  </md-theme>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-custom-component": CustomerJourneyWidget;
  }
}
