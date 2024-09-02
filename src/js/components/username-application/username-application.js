/**
 * The username-application web component module.
 *
 * @author Robin Pettersson <rp222nc@student.lnu.se>
 * @version 1.0.0
 */

import '../name-form/index.js'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .username-application {
      font-size: 1.2em;
      color: black;
      background-color: white;
      padding: 1em;
    }
  </style>
  <div class="username-application">
   <name-form></name-form>
   <h1>username app</h1>
  </div>
`

customElements.define('username-application',
  /**
   * Represents a user form element.
   */
  class extends HTMLElement {
    /**
     * The div element acting as a container.
     *
     * @type {HTMLDivElement}
     */
    #usernameApplication

    /**
     * The name-form element.
     *
     * @type {HTMLElement}
     */
    #nameForm

    /**
     * The name of user.
     *
     */
    #name

    /**
     * The interest of user.
     *
     */
    #interest

    /**
     * Creates an instance of the current type.
     */
    constructor() {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the elements in the shadow root.
      this.#usernameApplication = this.shadowRoot.querySelector('.username-application')
      this.#nameForm = this.shadowRoot.querySelector('name-form')

      // When a user has submitted a name, start a timer and get the first question - run once
      this.#nameForm.addEventListener('name', (event) => { this.startQuiz(event) }, { once: true })

      // When user has answered, get users answer and fetch correct answer from server
      // Fetch next question if correct, Else - display the scoreboard
      this.#usernameApplication.addEventListener('answer', (event) => this.answerRecieved(event))

    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback() {
    }

    /**
     * Triggers a customEvent to restart the quiz.
     */
    retry() {
      const retryEvent = new window.CustomEvent('retry', { bubbles: true })
      this.dispatchEvent(retryEvent)
    }
  }
)
