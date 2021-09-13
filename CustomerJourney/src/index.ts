/**
 * Copyright (c) Cisco Systems, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// This file imports all of the webcomponents from "components" folder

import "@cjaas/common-components/dist/comp/cjaas-timeline-item";
import '@tinymce/tinymce-webcomponent/dist/tinymce-webcomponent.js';
import { Desktop } from "@wxcc-desktop/sdk";
import { Service } from "@wxcc-desktop/sdk-types";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  html,
  internalProperty, LitElement, property, PropertyValues
} from "lit-element";
import styles from "./assets/styles/View.scss";
import { customElementWithCheck } from "./mixins/CustomElementCheck";


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
  @internalProperty() showSummary = true
  // TODO: set as false
  @internalProperty() renderModal = true

  @internalProperty() summary = 'test'


  async subscribeAgentContactDataEvents() {

    Desktop.agentContact.addEventListener(
      "eAgentContactEnded",
      (msg: Service.Aqm.Contact.AgentContact) => {
       this.renderModal = true
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ contact ended$$$$$$$$$$$$$$$$$$$$$",this.renderModal); 
        setTimeout(()=>{
          console.log('calling getsuMMARY')
          this.getSummary()
        }, 2000)
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
        `https://demo-devportal-bff.devus1.ciscoccservice.com/summary?taskIds=${this.taskId}`,
        httpsConfig
      )
      .then((resp: AxiosResponse) => {
        console.log('this is the resp', resp)
        this.showSummary = true
        this.summary = resp.data
      })
      .catch((err: AxiosError) => {
        console.error(`Error retrieving data from captures: ${err}`)
      // show fake response if error
        this.showSummary = true

        this.summary = `Sam called in regarding a possible data breach incident displayed alerts on her NetworkATX 1001 device. She wanted the threat analysis report. There were 5 attempts to breach the account. Account has been locked. Created the 24 Hour Unlock request.`
      })
      .finally(()=>{
        // reset task id
        this.taskId = ''
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
      console.log('changed properties includes taskid call')
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

  handleSubmit() {
    this.renderModal = false
    this.requestUpdate()

    const httpsConfig: any = {
      headers: {
        Authorization: `SharedAccessSignature so=demoassure&sn=sandbox&ss=ds&sp=w&se=2022-08-10T22:48:49.845Z&sk=sandbox&sig=amWJ3lcl1eVLkpbPwfo3A8x4Xq5k01ZMGUdwPVJ8RTQ%3D`,
        'Content-Type': 'application/json',
      },
    }
    
    const postBody = { "data": { "summary": "Sam called in regarding a possible data breach incident displayed alerts on her NetworkATX 1001 device. She wanted the threat analysis report. There were 5 attempts to breach the account. Account has been locked. Created the 24 Hour Unlock request." }, "datacontenttype": "application/json", "id": "ac88ba5c-17bc-47e7-a9e2-ebbe422b7f21", "person": "551234-Sam", "source": "Contact", "specversion": "1.0", "time": new Date(), "type": "Summary" }

    return axios
    .post(
      `https://uswest-nonprod.cjaas.cisco.com/v1/journey/events`,
      postBody,
      httpsConfig,
    )
    .then((resp: AxiosResponse) => {
      console.log('this is the resp', resp)
      this.showSummary = true
      this.summary = resp.data
    })
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
      <tinymce-editor api-key="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc" height="522" menubar="false" plugins="lists link image emoticons" toolbar="styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image emoticons">
      ${this.summary}
      </tinymce-editor>
      <div slot="footer">
        <md-button @button-click=${this.handleSubmit} color="blue">Accept</md-button>
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
