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
  input {
    border-radius: 15px; 
    padding: 12px;
    border: 1.5px solid lightgrey;
    outline: none;
    box-shadow: 0px 0px 20px -18px;
    margin: 0.75rem 0 1rem 0;
  }

  label {
    text-align: left;
    font-size: 15px;
    font-weight: 100;
  }

  form {
  display: flex;
  flex-direction: column;
  }

  button {
    background-color: white;
    border: 1px solid lightgrey;
    border-radius: 8px;
    box-shadow: 0px 0px 20px -18px;
    cursor: pointer;
    padding: 10px;
    transition: 0.5s;
    width: max-content;
    margin: auto;
    margin-top: 0.5rem;
  }

  button:hover {
    scale: 110%;
    background-color: black; 
    color: white;
  }

</style>


  <form>
    <label for="name">Name</label>
    <input type="text" id="name" placeholder="Enter your name...">
    <label for="interest">Interest</label>
    <input type="text" id="interest" placeholder="Enter an interest...">
    <button type="submit" id="button" value="Submit">Generate username</button>
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
