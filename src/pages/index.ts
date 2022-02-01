import '../styles/app.scss'
import Field from '../components/field';

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

class UserInput {
    formEl: HTMLFormElement

    constructor() {
        this.formEl = document.getElementById('user-input') as HTMLFormElement
        this.configure();
    }

    configure() {
        this.formEl.addEventListener('submit', this.submitHandler);
    }

    private submitHandler(event: Event) {
        event.preventDefault();
    }
}



// function component() {
//     const container = document.createElement('div')
//     const form = document.createElement('form')
//     const formContainer = document.createElement('div')

//     formContainer.classList.add('form__container')

//     fields.forEach(f => formContainer.appendChild(Field(f)))

//     form.classList.add('form')
//     form.appendChild(formContainer)
//     form.appendChild(Button())


//     container.classList.add('container')
//     container.appendChild(form)

//     return container;
// }

new UserInput();

customElements.define('input-field', Field);

// document.body.appendChild(component());
