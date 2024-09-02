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
   <user-info></user-info>
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
      this.#userInfoForm = this.shadowRoot.querySelector('user-info')

      // When a user has submitted a name, start a timer and get the first question - run once
      this.#userInfoForm.addEventListener('user-info', (event) => { this.handleResponse(event.detail) }, { once: true })

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

      console.log(name, interest)

      this.findWords(interest)
    }

    async findWords(interest) {
      const wordAPI = 'https://api.datamuse.com/words?ml='

      let response = await fetch(wordAPI + interest)

      if (!response.ok) {
        console.error(response.status)
      }

      const wordArray = await response.json()

      this.handleWords(wordArray)
    }

    handleWords(wordArray) {
      const allWords = []
      wordArray.forEach(element => {
        const word = element.word
        allWords.push(word)
      });

      this.extractWords(allWords)
    }

    extractWords(wordArray) {
      // Set rules for how long a word can be. Collect 5 words to build 5 usernames with.
      const chosenWords = []

      for (let i = 0; i < wordArray.length; i++) {
        const word = wordArray[i];

        if (chosenWords.length < 5) {
          if (word.length <= 5) {
            chosenWords.push(word)
          }
        }
      }

      chosenWords.forEach(word => {
        console.log(word)
      });
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
