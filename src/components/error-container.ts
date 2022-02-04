export default function ErrorContainer(message: string) {
    const element = document.createElement('div')
    element.classList.add('error')
    element.textContent = message;
    
    return element
}