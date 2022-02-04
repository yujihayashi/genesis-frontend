import Home from ".."
import Store from "./store"
import VMasker from "vanilla-masker"
import { validate, validateField, validateFullname } from "../helpers/validation"
import Loading from "../components/loading"
import { FieldInterface, UserInterface } from "../config/types"
import { formatCPF, formatPhoneNumber } from "../helpers/format"
import userFields from "../config/user-fields"
import Field from "../components/field"
import ErrorContainer from "../components/error-container"

export default class UserInput {
    store = new Store()
    formEl: HTMLFormElement
    submitEl: HTMLButtonElement
    originalSubmitLabel: string
    addButtonEl: HTMLButtonElement
    modalEl: HTMLDivElement
    error: string = ""
    isEditing: boolean
    fields: FieldInterface[] = userFields
    formValidation: { [key: string]: string } = {}

    constructor() {
        // set the targets
        this.formEl = document.getElementById('user-input')! as HTMLFormElement
        this.submitEl = document.getElementById('submit-button')! as HTMLButtonElement
        this.addButtonEl = document.getElementById('user-add')! as HTMLButtonElement
        this.originalSubmitLabel = this.submitEl.textContent!
        this.modalEl = document.getElementById('user-modal')! as HTMLDivElement
        this.isEditing = false

        this.renderFields(this.formEl)

        this.configure();
    }

    configure() {
        // to avoid multiple listeners on the component reload
        if (!this.addButtonEl.classList.contains('with-listener')) {
            // binds for the forms elements
            this.formEl.addEventListener('submit', this.submitHandler.bind(this));
            this.addButtonEl.addEventListener('click', this.modalHandler.bind(this), true);
            this.addButtonEl.classList.add('with-listener')

            // binds for modal
            this.modalEl.addEventListener('mousedown', this.modalHandler.bind(this));
            this.modalEl.querySelector('.modal__close')!.addEventListener('click', this.modalHandler.bind(this));
            this.modalEl.querySelector('.modal__container')!.addEventListener('mousedown', (e) => e.stopPropagation());
        }
    }

    // validate the form values and add new user
    submitHandler(event: Event) {
        event.preventDefault();

        // reset the validations
        this.submitEl.disabled = false;
        this.formEl.querySelectorAll('.error').forEach(e => e.remove())
        this.formEl.querySelectorAll<HTMLInputElement>('.field__input').forEach((e) => e.setCustomValidity(""))
        this.formValidation = {}

        if (!event || !(event.target instanceof HTMLFormElement)) return;

        const formData = new FormData(event.target);
        let data: UserInterface = { id: '', name: '', cpf: '', phone: '', email: '' };

        // set the new values. If the key equals cpf or phone, remove all the non-number characters
        formData.forEach((value, key) => data[key as keyof UserInterface] = key === 'cpf' || key === 'phone' ? value.toString().replace(/\D/g, "") : value.toString())

        this.formValidation = validate(data, this.fields) // validate all the fields

        // verify if the cpf field is duplicated then add to the formValidation object
        const notUnique = this.validateDuplicatedUser(data.cpf)

        // get the original cpf value from this user
        const userEditingCPF: string = data.id && this.store.get() ? JSON.parse(this.store.get()!).find((u: UserInterface) => u.id === data.id).cpf : ""

        // return the validation for the unique CPF value only if we are adding a new user or editing the user and if the unique CPF value is not equals of the current user that we're editing
        if ((!userEditingCPF && notUnique) || (notUnique && userEditingCPF && userEditingCPF !== data.cpf)) this.formValidation.cpf = notUnique

        if (this.formValidation && Object.entries(this.formValidation).length > 0) {
            this.formEl.classList.add('was-validated')
            this.submitEl.disabled = true;
            Object.entries(this.formValidation).forEach(([key, value]) => {
                const inputTarget = this.formEl.querySelector<HTMLInputElement>(`#${key}`)
                inputTarget?.setCustomValidity(value)
                inputTarget?.insertAdjacentElement('afterend', ErrorContainer(value))
            })
            return
        }

        this.submitEl.innerHTML = "";
        this.submitEl.appendChild(Loading())

        if (userEditingCPF)
            this.store.editUser(data, () => this.reset())
        else
            this.store.addUser(data, () => this.reset())
    }

    // handler to open/close the modal
    modalHandler(event?: Event, user?: UserInterface) {
        event?.preventDefault();

        if (this.modalEl.classList.contains('active')) {
            this.modalEl.classList.remove('active');
            this.formEl.classList.remove('was-validated')
            this.renderFields(this.formEl); // reset the form on close
        }
        else {
            this.modalEl.classList.add('active');
            const modalTitle = user ? "Alterar usuário" : "Cadastrar novo usuário"
            const modalSubmitLabel = user ? "Alterar" : "Cadastrar"

            this.modalEl.querySelector('.modal__title')!.textContent = modalTitle // set the modal title
            this.modalEl.querySelector('.btn__submit')!.textContent = modalSubmitLabel // set the button label
            if (user) {
                // populate the form values with the selected user to edit
                Object.entries(user).forEach(([key, value]) => {
                    const targetField = this.formEl.querySelector(`#${key}`);
                    if (key === 'cpf') value = formatCPF(value); // format the CPF value
                    else if (key === 'phone') value = formatPhoneNumber(value); // format the phone number value
                    if (targetField) targetField.setAttribute('value', value); // set the value
                })
            }
        }
    }

    // reset the form, close the modal and reload the users list
    private reset() {
        setTimeout(() => {
            this.submitEl.innerHTML = this.originalSubmitLabel;
            this.formEl.reset();
            this.modalHandler();
            new Home()
        }, 2000)
    }

    private renderFields(target: Element) {
        if (!target || !target.querySelector(".form__container")) return;
        const { fields } = this;
        const formContainer = target.querySelector(".form__container")!

        // clear the formContainer content
        formContainer.innerHTML = "";
        if (fields && fields.length > 0) {
            fields.forEach(f => {
                const fieldElement = Field(f)
                fieldElement.addEventListener('input', this.handleInput.bind(this))
                formContainer.appendChild(fieldElement)
            })


            // adding masks to the phone field
            var telMask = ['(99) 9999-99999', '(99) 99999-9999'];
            var tel = this.formEl.querySelector('#phone');
            if (tel) {
                VMasker(tel).maskPattern(telMask[0]);
                tel.addEventListener('input', this.handleMask.bind(undefined, telMask, 14), false);
            }

            // adding mask to the cpf field
            var doc = this.formEl.querySelector('#cpf')!;
            if (doc) VMasker(doc).maskPattern('999.999.999-99');
        }
    }

    // validate on input type
    private handleInput(event: Event) {
        if (this.formEl.classList.contains('was-validated')) {
            const target = event.target as HTMLInputElement
            const isInvalid = validateField(target.name, target.value)

            // if there is an error with this field, show the error message
            if (isInvalid) {
                target?.setCustomValidity(isInvalid)
                if (!target.nextElementSibling)
                    target?.insertAdjacentElement('afterend', ErrorContainer(isInvalid))
                else
                    target.nextElementSibling.innerHTML = ErrorContainer(isInvalid).innerHTML

            } else {
                target?.setCustomValidity("")
                if (target.nextElementSibling)
                    target.nextElementSibling.remove()
            }

            // reenable the submit button if all the errors are gone or disable it if there are any errors
            const errorsCount = this.formEl.querySelectorAll('.error')
            if(errorsCount.length > 0) this.submitEl.disabled = true;
            else this.submitEl.disabled = false;
        }
    }

    // if the value length is greater than the max value, unmask and set the second pattern
    private handleMask(masks: string[], max: number, event: Event) {
        var c = event.target as HTMLInputElement;
        var v = c.value.replace(/\D/g, '');
        var m = c.value.length > max ? 1 : 0;
        VMasker(c).unMask();
        VMasker(c).maskPattern(masks[m]);
        c.value = VMasker.toPattern(v, masks[m]);
    }

    private validateDuplicatedUser(cpf: string) {
        const { users } = this.store;

        // verify if the cpf value alredy exists
        if (users?.length > 0 && users.find(u => u.cpf === cpf)) return "CPF já cadastrado"

        return ""
    }
}