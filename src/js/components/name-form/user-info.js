/**
 * The name web component module.
 *
 * @author Robin Pettersson <rp222nc@student.lnu.se>
 * @version 1.0.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  #name {
  
  }
</style>
<h4>Enter your information</h4>
  <form>
    <input type="text" id="name" placeholder="Enter your name...">
    <input type="text" id="interest" placeholder="Enter an interest...">
    <button type="submit" id="button" value="Submit">Submit</button>
  </form>
`

customElements.define('user-info',
  /**
   * Represents a user-info element.
   */
  class extends HTMLElement {
    /**
     * The form element.
     *
     * @type {HTMLFormElement}
     */
    #form

    /**
     * The input element for name.
     *
     * @type {HTMLInputElement}
     */
    #name

    /**
     * The input element for name.
     *
     * @type {HTMLInputElement}
     */
    #interest

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the elements in the shadow root.
      this.#form = this.shadowRoot.querySelector('form')
      this.#name = this.shadowRoot.querySelector('#name')
      this.#interest = this.shadowRoot.querySelector('#interest')

      // Listen for form submit
      this.#form.addEventListener('submit', (event) => this.sendUserInfo(event))
    }

    /**
     * Creates a CustomEvent that sends the username entered.
     *
     * @param {Event} event - Submit event with username details.
     */
    sendUserInfo (event) {
      event.preventDefault()
      const name = this.#name.value
      const interest = this.#interest.value

      // Check if username is empty
      if (name === '') {
        alert('Enter a name')
      } else {
        const userInfoEvent = new window.CustomEvent('user-info', { detail: { name, interest } })
        this.dispatchEvent(userInfoEvent)
      }
    }
  }
)
