import Home from "../"
import Store from "./store"
import VMasker from "vanilla-masker"
import { validate } from "./validation"
import Loading from "../components/loading"
import { UserInterface } from "../config/types"

export default class UserInput {
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
        this.originalSubmitLabel = this.submitEl.textContent!
        this.modalEl = document.getElementById('user-modal')! as HTMLDivElement
        this.configure();
    }

    configure() {
        // to avoid multiple listeners on the component reload
        if (!this.addButtonEl.classList.contains('with-listener')) {
            this.formEl.addEventListener('submit', this.submitHandler.bind(this));
            this.addButtonEl.addEventListener('click', this.modalHandler.bind(this), true);
            this.addButtonEl.classList.add('with-listener')
            this.modalEl.addEventListener('mousedown', this.modalHandler.bind(this));
            this.modalEl.querySelector('.modal__close')!.addEventListener('click', this.modalHandler.bind(this));
            this.modalEl.querySelector('.modal__container')!.addEventListener('mousedown', (e) => e.stopPropagation());

            // adding masks to the phone field
            var telMask = ['(99) 9999-99999', '(99) 99999-9999'];
            var tel = this.formEl.querySelector('#phone')!;
            VMasker(tel).maskPattern(telMask[0]);
            tel.addEventListener('input', this.inputHandler.bind(undefined, telMask, 14), false);

            // adding mask to the cpf field
            var doc = document.querySelector('#cpf')!;
            VMasker(doc).maskPattern('999.999.999-99');
        }
    }

    // validate the form values and add new user
    private submitHandler(event: Event) {
        event.preventDefault();
        this.submitEl.removeAttribute('disabled');
        this.formEl.querySelectorAll('.error').forEach(e => e.remove())

        if (!event || !(event.target instanceof HTMLFormElement)) return;

        const formData = new FormData(event.target);
        let data: UserInterface = { name: '', cpf: '', phone: '', email: '' };
        formData.forEach((value, key) => data[key as keyof UserInterface] = key === 'cpf' || key === 'phone' ? value.toString().replace(/\D/g, "") : value.toString())

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

    // handler to open/close the modal
    private modalHandler(event?: Event) {
        event?.preventDefault();
        if (this.modalEl.classList.contains('active'))
            this.modalEl.classList.remove('active')
        else
            this.modalEl.classList.add('active')
    }

    // reset the form, close the modal and reload the users list
    private reset() {
        setTimeout(() => {
            this.submitEl.innerHTML = this.originalSubmitLabel;
            this.modalHandler();
            this.formEl.reset();
            new Home()
        }, 2000)
    }

    // if the value length is greater than the max value, unmask and set the second pattern
    private inputHandler(masks: string[], max: number, event: Event) {
        var c = event.target as HTMLInputElement;
        var v = c.value.replace(/\D/g, '');
        var m = c.value.length > max ? 1 : 0;
        VMasker(c).unMask();
        VMasker(c).maskPattern(masks[m]);
        c.value = VMasker.toPattern(v, masks[m]);
    }
}