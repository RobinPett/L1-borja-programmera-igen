/**
 * The username-application web component module.
 *
 * @author Robin Pettersson <rp222nc@student.lnu.se>
 * @version 1.0.0
 */

import '../name-form/index.js'
import '../username-list/username-list.js'

const copySymbol = '../../../img/copy_symbol.svg'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .username-application {
      font-size: 1em;
      font-weight: lighter;
      color: white;
      padding: 1em;
      border-radius: 1rem;
      width: 100%;
    }

    #title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: 1.5em;
    }

    #info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 1.5em;
    font-weight: 100;
    opacity: 30%;
    }

    #userform {
    margin-top: 2em;
    padding: 1em;
    }

    #generated-usernames-container {
      margin-top: 2em;
    }

  </style>
    <div class="username-application">
        <h2 id="title">Username Generator</h2>
      <user-info id="userform"></user-info>
      <div id="generated-usernames-container"> 
      </div>
      <p id="info">© Robin Pettersson</p>
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
     * The user-info element.
     *
     * @type {HTMLElement}
     */
    #userInfoForm

    /**
     * The name of user.
     *
     */
    #name

    /**
     * Generated usernames
     *
     */
    #generatedUsernamesContainer

    /**
     * The interest of user.
     *
     */
    #words

    /**
     * The interest of user.
     *
     */
    #usernameListElement

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
      this.#userInfoForm = this.shadowRoot.querySelector('user-info')
      this.#generatedUsernamesContainer = this.shadowRoot.querySelector('#generated-usernames-container')

      // When a user has submitted a name, start a timer and get the first question - run once
      this.#userInfoForm.addEventListener('user-info', (event) => { this.handleResponse(event.detail) }, { once: false })

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
     * Called after the element has been removed from the DOM.
     */
    handleResponse(detail) {
      const name = detail.name
      const interest = detail.interest

      this.#name = name

      this.findWords(interest)
    }

    async findWords(interest) {
      const wordAPI = 'https://api.datamuse.com/words?ml='

      let response = await fetch(wordAPI + interest)

      if (!response.ok) {
        console.error(response.status)
      }

      const wordArray = await response.json()

      console.log(this.#words)

      const data = { name: this.#name, words: wordArray }

      // Check if list already exists
      if (this.#usernameListElement) {
        this.#usernameListElement.remove()
      }

      this.#usernameListElement = document.createElement('username-list')
      this.#usernameListElement.elementData(data)

      
      this.#usernameApplication.appendChild(this.#usernameListElement)
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
