export interface FieldInterface {
    variable: string
    label?: string
    type: string
    placeholder?: string
    required?: boolean
}

export interface UserInterface {
    id: string,
    name: string,
    cpf: string,
    phone: string,
    email: string
}
