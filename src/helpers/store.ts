import { UserInterface } from "../config/types";

export default class Store {
    users: UserInterface[] = []
    storageKey = 'USER_LIST'
    constructor() {
        if (localStorage.getItem(this.storageKey))
            try {
                this.users = JSON.parse(localStorage.getItem(this.storageKey)!)
            } catch (error) {
                this.users = []
            }
            
    }

    get() {
        return localStorage.getItem(this.storageKey)
    }

    set(users: UserInterface[]) {
        localStorage.setItem(this.storageKey, JSON.stringify(users))
    }

    addUser(user: UserInterface, callback: () => void) {
        this.users.push(user)
        this.set(this.users);
        callback()
    }

    removeUser(cpf: string, callback: () => void) {
        const userIndex = this.users.findIndex(u => u.cpf === cpf)
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            this.set(this.users)
        }
        callback()
    }
}