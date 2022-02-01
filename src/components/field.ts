export default class Field extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const fieldGroup = document.createElement('div');
        const fieldInput = document.createElement('input');

        fieldGroup.classList.add('field__group')

        fieldInput.classList.add('field__input');
        fieldInput.setAttribute("name", this.getAttribute('data-variable')!)
        fieldInput.setAttribute("type", this.getAttribute('data-type')!)
        fieldInput.setAttribute("placeholder", this.getAttribute('data-placeholder')!)

        fieldGroup.appendChild(fieldInput)

        shadow.append(this.styles(), fieldGroup)
    }

    styles() {
        const style = document.createElement('style');

        style.textContent = `
        .field__group {
            margin-bottom: 1.5rem;
        }

        .field__label {
            display: block;
            margin-bottom: 2px;
        }
    
        .field__input {
            width: 100%;
            border: none;
            border-bottom: 1px solid #efeeed;
            padding: 10px 0;
        }
    
        .field__input:focus {
            outline: none;
        }
        `

        return style;
    }
}