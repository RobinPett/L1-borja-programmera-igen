/**
 * The username-application web component module.
 *
 * @author Robin Pettersson <rp222nc@student.lnu.se>
 * @version 1.0.0
 */

import '../name-form/index.js'

const copySymbol = '../../../img/copy_symbol.svg'

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

  .copy-button {
	background-color: white;
	border: none;
	color: black;
  border-radius: 15px;
	padding: 5px 8px;
	text-align: center;
	text-decoration: none;
	font-size: 10px;
  filter: drop-shadow(0 0 0.5px black);
  transition: background-color 1s;
  transition: color 1s;
  cursor: pointer;
  margin-right: 15px;
}

  .copy-button:hover {
    background-color: #1B8EF2;
    transition: background-color 1s;
    scale: 110%;
  }

    button:active {
    background-color: #1B8EF2;
    transition: background-color 1s;
  }

  .copy-button {
    width: 15px;
    height: auto;

  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }

  </style>
  <div class="username-application">
   <user-info></user-info>
   <div id="generated-usernames-container"> 
   </div>
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

      this.#words = chosenWords

      this.buildUsername()
    }

    buildUsername() {
      // Array for new usernames
      const newUsernames = []

      // Loop throgh word array and build usernames with name and word
      this.#words.forEach((word, i) => {
        let generatedUsername

        // Change order of word + name based on index - Every other
        if (i % 2) {
          generatedUsername = this.#name + word
        } else {
          generatedUsername = word + this.#name
        }
        newUsernames.push(generatedUsername)
      })

      const newUsernameList = document.createElement('ul')
      newUsernames.forEach(username => {
        const newUsernameElement = document.createElement('li')

        const copyButton = document.createElement('input')
        copyButton.setAttribute('type', 'image')
        copyButton.setAttribute('src', '../img/copy_symbol.svg')
        copyButton.setAttribute('class', 'copy-button')
        const usernameText = document.createElement('span')
        usernameText.textContent = username

        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(username).then(() => {
            copyButton.textContent = 'Copied!'
            setTimeout(() => copyButton.textContent = 'Copy', 2000)
          }).catch(err => {
            console.error('Failed to copy: ' + err)
          })
        })

        newUsernameElement.appendChild(copyButton)
        newUsernameElement.appendChild(usernameText)
        newUsernameList.appendChild(newUsernameElement)
      })

      this.#generatedUsernamesContainer.appendChild(newUsernameList)
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
