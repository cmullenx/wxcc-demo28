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
import axios, { AxiosError, AxiosResponse } from "axios";
import { customElementWithCheck } from "./mixins/CustomElementCheck";
import styles from "./assets/styles/View.scss";
import { DateTime } from "luxon";
import { Button, ButtonGroup, Input } from "@momentum-ui/web-components";
import { ServerSentEvent } from "./types/cjaas";
import { EventSourceInitDict } from "eventsource";
import "@cjaas/common-components/dist/comp/cjaas-timeline-item";


import { Desktop } from "@wxcc-desktop/sdk";
import { Service } from "@wxcc-desktop/sdk-types";
import { jsxText } from "@babel/types";
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
  

  @property() taskId: string | undefined
  @property() token: string | undefined
  @internalProperty() showSummary = false
  // TODO: set as false
  @internalProperty() renderModal = false

  @internalProperty() summary = ''

  async subscribeAgentContactDataEvents() {

    Desktop.agentContact.addEventListener(
      "eAgentContactEnded",
      (msg: Service.Aqm.Contact.AgentContact) => {
       this.renderModal = true
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ contact ended$$$$$$$$$$$$$$$$$$$$$",this.renderModal); 
        setTimeout(()=>{
          console.log('calling getsuMMARY')
          this.getSummary()
        }, 5000)
      }
    );
  
  }

  async getSummary(){

    if(this.taskId){
    console.log('this is taskid', this.taskId)
    const httpsConfig: any = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    }
    return axios
      .get(
        `https://test-devportal-bff.devus1.ciscoccservice.com/ping`,
        httpsConfig
      )
      .then((resp: AxiosResponse) => {
        console.log('this is the resp', resp)
        this.showSummary = true
        this.summary = `Hi, my name is Sam, and I'm looking for a new quote for a car that I'm going to purchase. So, could you please give me
        the best deal possible on this new vehicle? Thank you.`
      })
      .catch((err: AxiosError) => {
        console.error(`Error retrieving data from captures: ${err}`)
        // throw Error(`${err}`)
        this.showSummary = true
        this.summary = `Hi, my name is Sam, and I'm looking for a new quote for a car that I'm going to purchase. So, could you please give me
        the best deal possible on this new vehicle? Thank you.`
      })
    }
  }



  static get styles() {
    return styles;
  }

  static get properties(){ return {
    renderModal: {
      type: Boolean,

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
    },
    showSummary: {
      type: Boolean
    },
    summary: {
      type: String
    },
    taskId: {
      type: String
    },
    token: {
      type: String
    }
  };
  }


  constructor(){
    super()
  }

  async firstUpdated(changeProperties: PropertyValues) {
    super.firstUpdated(changeProperties);
    try {
      // this.getSummary()
      setTimeout(async () => {
        await Desktop.config.init();
        this.subscribeAgentContactDataEvents();
      }, 2000);
    } catch (e) {
      console.error("error while initializing sdk", e);
    }
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties)

    if(changedProperties.has('taskId') && this.taskId){
      console.log('changed properties includes taskid')
    }
  }



  disconnectedCallback() {
    super.disconnectedCallback();
    Desktop.agentContact.removeAllEventListeners();
  }

  handleButtonClick() {
    this.renderModal = false
    this.requestUpdate()
  }

 

//  @property() textToEdit = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies lorem sem, id placerat massa rutrum eu. Sed dui neque,
//   tincidunt quis sapien in, aliquam dignissim nulla. Vestibulum mollis at orci ac facilisis. Sed ut aliquam nunc. Suspendisse eu interdum odio. Sed libero dui, malesuada ac vulputate id,
//   vulputate vel nisi. Proin id egestas mi. Fusce ut sem nibh. Vivamus aliquet accumsan feugiat. Etiam accumsan tortor quisultrices tempus. Aenean porta feugiat ex. Praesent dictum mauris
//   et dui posuere aliquet et non arcu. Sed eget aliquam elit. Nullamornare ipsum quis feugiat tincidunt. Nullam a libero sed enimdictum convallis. Suspendisse egestas elit risus, at ultrices
//   massa blandit eget. Vivamus dapibus bibendum nisl, eget cursus risus ultrices et. Quisque felis tortor, accumsan vel tempus quis,
//   rutrum sed urna. Nulla quis magna et eros facilisis blandit. Nuncmattis urna eget diam accumsan, non vehicula est aliquet. Etiam
//   vestibulum dui neque, faucibus sollicitudin nibh vestibulum vel.Nullam semper porta ipsum non varius. Vestibulum sollicitudin
//   ipsum mauris. Praesent quis nisi sagittis, malesuada lacus semper, iaculis elit.`

  render() {
    return html`
    <md-theme class="theme-toggle" id="modal">
    <md-modal
      .show=${this.renderModal}
      headerLabel="Call Summary"
      closeBtnName="Reject"
      .showCloseButton="${true}"
      .backdropClickExit="${true}"
      ?hideFooter=${true}
      ?hideHeader=${false}
      @close-modal=${this.handleButtonClick}
    >
    ${this.showSummary ? 
      html`
      <md-editable-field content=${this.summary}></md-editable-field>
      <div slot="footer">
        <md-button @button-click=${this.handleButtonClick} color="blue">Accept</md-button>
        <md-button @button-click=${this.handleButtonClick}>Reject</md-button>
      </div>` 
    : html` <md-loading></md-loading>`}
    
    </md-modal>
  </md-theme>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-custom-component": CustomerJourneyWidget;
  }
}
