import { FieldInterface } from "../config/types";

export default function Field({ type = "text", variable, placeholder, required = false }: FieldInterface) {
    const element = document.createElement('div');
    const input = document.createElement('input');

    // set the classname for the root
    element.classList.add('field__group')

    // set the initial attributes for the input
    input.classList.add('field__input')
    input.setAttribute('type', type)
    input.setAttribute('name', variable)
    input.setAttribute('id', variable)
    if (placeholder)
        input.setAttribute('placeholder', placeholder)
    if (required)
        input.setAttribute('required', 'required')

    // insert the input into the root element
    element.appendChild(input)

    return element;
}
