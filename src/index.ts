import './styles/app.scss'
import Store from './classes/store';
import Loading from './components/loading';
import UserInput from './classes/user-input';
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
        this.dataCounterElement.innerHTML = DataCounter(this.users.length);

        if (!this.store.get()) this.getFromApi()

        this.users.forEach(({ name, ...rest }) => {
            // clone the user item template from the page
            const importedNode = document.importNode(this.userItemTemplate.content.firstElementChild!, true)

            // set the user name to the heading tag
            importedNode.querySelector('h2')!.textContent = name;

            // mount all of the collumns with each other values
            Object.entries(rest).forEach(([key, value]) => {
                // we wont show the id field
                if (key !== "id") {
                    const importedColNode = document.importNode(this.userItemDataColTemplate.content.firstElementChild!, true)

                    importedColNode.querySelector('h3')!.textContent = this.formattedKey(key);
                    importedColNode.querySelector('p')!.textContent = this.formattedValue(key, value);

                    importedNode.querySelector('.data__row')?.appendChild(importedColNode)
                }


                if (key === 'id') {
                    // add event to delete the user by id value
                    importedNode.querySelector('.btn__remove')?.addEventListener('click', () => this.store.removeUser(value, () => new Home()))

                    // add event to edit the user
                    importedNode.querySelector('.btn__edit')?.addEventListener('click', (e) => this.edit(e, { name, ...rest }))
                }
            })

            // insert the row
            this.userListElement.appendChild(importedNode)
        })
    }

    // get initial data from api
    async getFromApi() {
        this.userListElement.appendChild(Loading(true))
        let response = await fetch(this.requestUrl).then(response => response.json()).then(data => data)

        if (response && response.length > 0)
            response = response.map((r: { [key: string]: string }, i: number) => { return { id: (i + 1).toString(), ...r } }) // map the response and set the initial ID values for each user

        // save to the localStorage
        this.store.set(response)

        // reload the elements on the page
        new Home();
    }

    private edit(e: Event, user?: UserInterface) {
        if (!user) return;
        this.userInput.modalHandler(e, user);
    }

    private formattedValue(key: string, value: string): string {
        switch (key) {
            case 'phone':
                return formatPhoneNumber(value)
            case 'cpf':
                return formatCPF(value)
            default:
                return value
        }
    }

    private formattedKey(key: string): string {
        switch (key) {
            case 'phone':
                return "Telefone";
            case 'email':
                return "E-mail";
            default:
                return key
        }
    }
}

// mount the elements for the homepage
new Home();
