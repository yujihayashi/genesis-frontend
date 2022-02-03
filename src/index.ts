import './styles/app.scss'
import Store from './helpers/store';
import Loading from './components/loading';
import UserInput from './helpers/user-input';
import { UserInterface } from './config/types';
import DataCounter from './components/data-counter';
import { formatCPF, formatPhoneNumber } from './helpers/format';

export default class Home {
    store = new Store();
    userInput = new UserInput();
    requestUrl = 'https://private-847f5-ivangenesis.apiary-mock.com/users'
    users: UserInterface[]
    userListElement: HTMLElement
    dataCounterElement: HTMLElement
    userItemTemplate: HTMLTemplateElement
    userItemDataColTemplate: HTMLTemplateElement

    constructor() {
        this.users = this.store.users
        this.userListElement = document.getElementById('user-list')! as HTMLElement
        this.dataCounterElement = document.getElementById('data-counter')! as HTMLElement
        this.userItemTemplate = document.getElementById('user-item')! as HTMLTemplateElement
        this.userItemDataColTemplate = document.getElementById('user-item-data-col')! as HTMLTemplateElement

        this.init()
        this.userInput
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

                if (key === 'cpf') {
                    // add event to delete the user by cpf value
                    importedNode.querySelector('.btn__remove')?.addEventListener('click', () => this.store.removeUser(value, () => new Home()))

                    // add event to edit the user by cpf value
                    importedNode.querySelector('.btn__edit')?.addEventListener('click', (e) => this.edit(e, { name, ...rest }))
                }
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

    private edit(e: Event, user?: UserInterface) {
        if (!user) return;
        this.userInput.modalHandler(e, user);
    }
}

// mount the elements for the homepage
new Home();
