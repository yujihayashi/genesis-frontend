import './styles/app.scss'
import Loading from './components/loading';
import { formatCPF, formatPhoneNumber } from './helpers/format';
import DataCounter from './components/data-counter';

class UserInput {
    formEl: HTMLFormElement
    submitEl: HTMLButtonElement
    addButtonEl: HTMLButtonElement
    modalEl: HTMLDivElement

    constructor() {
        this.formEl = document.getElementById('user-input')! as HTMLFormElement
        this.submitEl = document.getElementById('submit-button')! as HTMLButtonElement
        this.addButtonEl = document.getElementById('user-add')! as HTMLButtonElement
        this.modalEl = document.getElementById('user-modal')! as HTMLDivElement
        this.configure();
    }

    configure() {
        this.formEl.addEventListener('submit', this.submitHandler.bind(this));
        this.addButtonEl.addEventListener('click', this.modalHandler.bind(this));
        this.modalEl.addEventListener('click', this.modalHandler.bind(this));
        this.modalEl.querySelector('.modal__close')!.addEventListener('click', this.modalHandler.bind(this));
        this.modalEl.querySelector('.modal__container')!.addEventListener('click', (e) => e.stopPropagation());
        // customElements.define('input-field', Field);
    }

    private submitHandler(event: Event) {
        event.preventDefault();
        const originalLabel = this.submitEl.innerText;
        if (!event || !(event.target instanceof HTMLFormElement)) return;
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        this.submitEl.innerHTML = "";
        this.submitEl.appendChild(Loading())
        console.log(data)

        setTimeout(() => {
            this.submitEl.innerHTML = originalLabel;
        }, 2000)
    }

    private modalHandler(event: Event) {
        event?.preventDefault();
        if (this.modalEl.classList.contains('active'))
            this.modalEl.classList.remove('active')
        else
            this.modalEl.classList.add('active')
    }
}

interface UserInterface {
    name: string,
    cpf: string,
    phone: string,
    email: string
}

let users: UserInterface[] = []
const usersFromLocalStorage = localStorage.getItem('USER_LIST');
const requestUrl = 'https://private-847f5-ivangenesis.apiary-mock.com/users';
const userListElement = document.getElementById('user-list')! as HTMLElement
const dataCounterElement = document.getElementById('data-counter')! as HTMLElement
const userItemTemplate = document.getElementById('user-item')! as HTMLTemplateElement
const userItemDataColTemplate = document.getElementById('user-item-data-col')! as HTMLTemplateElement

(async () => {
    if (usersFromLocalStorage)
        users = JSON.parse(usersFromLocalStorage)
    else {
        let response = await fetch(requestUrl)
        users = await response.json()
        localStorage.setItem("USER_LIST", JSON.stringify(users))
    }

    dataCounterElement.textContent = DataCounter(users.length);

    users.forEach(({ name, ...rest }) => {
        const importedNode = document.importNode(userItemTemplate.content.firstElementChild!, true)

        importedNode.querySelector('h2')!.textContent = name;
        Object.entries(rest).forEach(([key, value]) => {
            const importedColNode = document.importNode(userItemDataColTemplate.content.firstElementChild!, true)
            const formattedValue = (): string => {
                switch (key) {
                    case 'phone':
                        return formatPhoneNumber(value)
                    case 'cpf':
                        return formatCPF(value)
                    default:
                        return value
                }
            }

            importedColNode.querySelector('h3')!.textContent = key;
            importedColNode.querySelector('p')!.textContent = formattedValue();

            importedNode.querySelector('.data__row')?.appendChild(importedColNode)
        })

        userListElement.appendChild(importedNode)
    })

})()

new UserInput();
