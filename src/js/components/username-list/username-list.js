/**
 * The username list web component module.
 *
 * @author Robin Pettersson <rp222nc@student.lnu.se>
 * @version 1.0.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>

  .copy-button {
	  background-color: none;
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
    filter: opacity(20%;)
	  border-radius: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.46);
  }

  .copy-button:hover {
    transition: background-color 1s;
    scale: 110%;
    filter: invert(100%);
  }

  .copy-button:active {
    background-color: #red;
    transition: background-color 1s;
    scale: 110%;
  }

  .copy-button {
    width: 15px;
    height: auto;
  }

 
  .copy-button {
    filter: invert(50%);
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    align-items: center;
    display: inline-block;
    text-align: left;
  }

  #generated-usernames-container {
    text-align: center;
  }


  li {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: #F2F2F2;
    text-align: center;
  }

</style>
    <hr>
    <p>Username suggestions</p>
   <div id="generated-usernames-container"> 
   </div>
`

customElements.define('username-list',
  /**
   * Represents a user-info element.
   */
  class extends HTMLElement {

    /**
     * Array of words
     *
     */
    #words

    /**
     * The name of user.
     *
     */
    #name

    /** Generated usernames container
     * The name of user.
     *
     */
    #generatedUsernamesContainer



    /**
     * Creates an instance of the current type.
     */
    constructor() {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#generatedUsernamesContainer = this.shadowRoot.querySelector('#generated-usernames-container')
    }

    elementData(data) {
      console.log('elementData')
      console.log(data)
      console.log(data.name)
      console.log(data.words)
      this.#name = data.name
      this.#words = data.words

      this.handleWords()
    }

    handleWords() {
      const allWords = []
      this.#words.forEach(element => {
        const word = element.word
        allWords.push(word)
      });

      this.extractWords(allWords)
    }

    extractWords(allWords) {

      // Set rules for how long a word can be. Collect 5 words to build 5 usernames with.
      const chosenWords = []

      for (let i = 0; i < allWords.length; i++) {
        const randomIndex = this.generateRandomNumber(allWords.length)
        const word = allWords[randomIndex]

        if (chosenWords.length < 5) {
          if (word.length <= 5) {
            chosenWords.push(word)
          }
        }
      }

      this.buildUsername(chosenWords)
    }

    buildUsername(chosenWords) {
      // Array for new usernames
      const newUsernames = []

      // Loop throgh word array and build usernames with name and word
      chosenWords.forEach((word, i) => {
        let generatedUsername

        const randomValue = this.generateRandomNumber(2)

        // Change order of word + name based on index - Every other
        if (randomValue % 2) {
          generatedUsername = this.#name + word
        } else {
          generatedUsername = word + this.#name
        }
        newUsernames.push(generatedUsername)
      })

      const newUsernameList = document.createElement('ul')

      if (newUsernames.length >= 1) {
        newUsernames.forEach(username => {
          const newUsernameElement = document.createElement('li')

          const copyButton = document.createElement('input')
          copyButton.setAttribute('type', 'image')
          copyButton.setAttribute('src', '/img/copy_symbol.svg')
          copyButton.setAttribute('class', 'copy-button')
          const usernameText = document.createElement('span')
          usernameText.textContent = username

          copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(username).then(() => {
              copyButton.setAttribute('src', '/img/hyperlink-icon.svg')
              setTimeout(() => copyButton.setAttribute('src', '/img/copy_symbol.svg'), 500)
            }).catch(err => {
              console.error('Failed to copy: ' + err)
            })
          })

          newUsernameElement.appendChild(copyButton)
          newUsernameElement.appendChild(usernameText)
          newUsernameList.appendChild(newUsernameElement)
        })
      } else {
        const noNamesMessage = document.createElement('li')
        noNamesMessage.textContent = 'No words could be found to build with, try again!'
        newUsernameList.appendChild(noNamesMessage)
      }


      this.#generatedUsernamesContainer.appendChild(newUsernameList)
    }

    generateRandomNumber(max) {
      return Math.floor(Math.random() * max)
    }
  }
)
