export default function Loading(isPrimaryColor: boolean = false) {
    const element = document.createElement('span')
    const icon = document.createElement('i')

    element.classList.add('loading');
    if(isPrimaryColor) element.classList.add('loading__primary')
    element.appendChild(icon);

    return element;
}