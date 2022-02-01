import '../styles/app.scss'
import Field from '../components/field';
import Button from '../components/button';

const fields = [
    {
        variable: "name",
        placeholder: "Nome completo (sem abreviações)",
        type: "text",
    },
    {
        variable: "cpf",
        placeholder: "CPF",
        type: "tel",
    },
    {
        variable: "phone",
        placeholder: "Telefone",
        type: "tel",
    },
    {
        variable: "email",
        placeholder: "E-mail",
        type: "email",
    },
]

function component() {
    const container = document.createElement('div')
    const form = document.createElement('form')
    const formContainer = document.createElement('div')

    formContainer.classList.add('form__container')

    fields.forEach(f => formContainer.appendChild(Field(f)))

    form.classList.add('form')
    form.appendChild(formContainer)
    form.appendChild(Button())


    container.classList.add('container')
    container.appendChild(form)

    return container;
}

document.body.appendChild(component());
