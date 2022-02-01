export default function SubmitButton(label: string = "Cadastrar") {
    const element = document.createElement('button')

    element.setAttribute('type', 'submit');
    element.classList.add('btn__submit');
    element.innerHTML = label;

    return element;
}