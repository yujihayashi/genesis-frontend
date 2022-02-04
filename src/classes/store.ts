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
        this.users = users;
    }

    addUser(user: UserInterface, callback: () => void) {
        let newUserList: UserInterface[] = [];
        if (this.get()) newUserList = JSON.parse(this.get()!)
        newUserList.push({ ...user, id: (newUserList.length + 1).toString() })
        this.set(newUserList);
        callback()
    }

    editUser(user: UserInterface, callback: () => void) {
        let newUserList: UserInterface[] = [];
        if (this.get()) newUserList = JSON.parse(this.get()!)
        // newUserList.push(user)
        newUserList = newUserList.map(u => {
            if (u.id === user.id) return user
            return u
        })
        this.set(newUserList);
        callback()
    }

    removeUser(id: string, callback: () => void) {
        const userIndex = this.users.findIndex(u => u.id === id)
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            this.set(this.users)
        }
        callback()
    }
}