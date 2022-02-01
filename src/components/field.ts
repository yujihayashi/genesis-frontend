import { FieldInterface } from "../config/types";

export default function Field(field: FieldInterface) {

    const fieldGroup = document.createElement('div');
    const fieldInput = document.createElement('input');

    fieldGroup.classList.add('field__group')

    if (field.label) {
        const fieldLabel = document.createElement('label');

        fieldLabel.innerHTML = field.label;
        fieldLabel.classList.add('field__label');

        fieldGroup.appendChild(fieldLabel)
    }

    fieldInput.classList.add('field__input');
    fieldInput.setAttribute("name", field.variable)
    fieldInput.setAttribute("type", field.type)
    if (field.placeholder)
        fieldInput.setAttribute("placeholder", field.placeholder)

    fieldGroup.appendChild(fieldInput)


    return fieldGroup;
}