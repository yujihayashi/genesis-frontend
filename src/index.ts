import './styles/app.scss'
import Loading from './components/loading';
import { formatCPF, formatPhoneNumber } from './helpers/format';
import DataCounter from './components/data-counter';
import { UserInterface } from './config/types';
import Store from './helpers/store';
import { validate } from './helpers/validation';


class Home {
    store = new Store();
    requestUrl = 'https://private-847f5-ivangenesis.apiary-mock.com/users'
    users: UserInterface[] = this.store.users
    userListElement = document.getElementById('user-list')! as HTMLElement
    dataCounterElement = document.getElementById('data-counter')! as HTMLElement
    userItemTemplate = document.getElementById('user-item')! as HTMLTemplateElement
    userItemDataColTemplate = document.getElementById('user-item-data-col')! as HTMLTemplateElement

    constructor() {
        this.init()
    }

    init() {
        // reset user list DOM
        this.userListElement.innerHTML = "";
        this.dataCounterElement.textContent = DataCounter(this.users.length);

        if (!this.store.get()) this.getFromApi()

        this.users.forEach(({ name, ...rest }) => {
            const importedNode = document.importNode(this.userItemTemplate.content.firstElementChild!, true)

            importedNode.querySelector('h2')!.textContent = name;
            Object.entries(rest).forEach(([key, value]) => {
                const importedColNode = document.importNode(this.userItemDataColTemplate.content.firstElementChild!, true)
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

                if (key === 'cpf')
                    importedNode.querySelector('.btn__remove')?.addEventListener('click', () => this.store.removeUser(value, () => new Home()))
            })

            this.userListElement.appendChild(importedNode)
        })
    }

    async getFromApi() {
        this.userListElement.appendChild(Loading(true))
        let response = await fetch(this.requestUrl).then(response => response.json()).then(data => data)
        this.store.set(response)
        new Home();
    }
}

class UserInput {
    store = new Store()
    formEl: HTMLFormElement
    submitEl: HTMLButtonElement
    originalSubmitLabel: string
    addButtonEl: HTMLButtonElement
    modalEl: HTMLDivElement
    error: string = ""

    constructor() {
        this.formEl = document.getElementById('user-input')! as HTMLFormElement
        this.submitEl = document.getElementById('submit-button')! as HTMLButtonElement
        this.addButtonEl = document.getElementById('user-add')! as HTMLButtonElement
        this.originalSubmitLabel = this.submitEl.innerText
        this.modalEl = document.getElementById('user-modal')! as HTMLDivElement
        this.configure();
    }

    configure() {
        this.formEl.addEventListener('submit', this.submitHandler.bind(this));
        this.addButtonEl.addEventListener('click', this.modalHandler.bind(this));
        this.modalEl.addEventListener('mousedown', this.modalHandler.bind(this));
        this.modalEl.querySelector('.modal__close')!.addEventListener('click', this.modalHandler.bind(this));
        this.modalEl.querySelector('.modal__container')!.addEventListener('mousedown', (e) => e.stopPropagation());
    }

    private submitHandler(event: Event) {
        event.preventDefault();
        this.submitEl.removeAttribute('disabled');
        this.formEl.querySelectorAll('.error').forEach(e => e.remove())

        if (!event || !(event.target instanceof HTMLFormElement)) return;

        const formData = new FormData(event.target);
        let data: UserInterface = { name: '', cpf: '', phone: '', email: '' };
        formData.forEach((value, key) => data[key as keyof UserInterface] = value.toString())

        if (validate(data) && Object.entries(validate(data)).length > 0) {
            this.formEl.classList.add('was-validated')
            // this.submitEl.setAttribute('disabled', 'disabled');
            Object.entries(validate(data)).forEach(([key, value]) => {
                const errorDiv = document.createElement('div')
                const inputTarget = this.formEl.querySelector(`#${key}`)
                errorDiv.classList.add('error')
                errorDiv.textContent = value;
                inputTarget?.insertAdjacentElement('afterend', errorDiv)
            })
            return
        }

        this.submitEl.innerHTML = "";
        this.submitEl.appendChild(Loading())
        this.store.addUser(data, () => this.reset())
    }

    private modalHandler(event?: Event) {
        event?.preventDefault();
        if (this.modalEl.classList.contains('active'))
            this.modalEl.classList.remove('active')
        else
            this.modalEl.classList.add('active')
    }

    private reset() {
        setTimeout(() => {
            this.submitEl.innerHTML = this.originalSubmitLabel;
            this.modalHandler();
            this.formEl.reset();
            new Home()
        }, 2000)
    }
}

new Home();

new UserInput();
