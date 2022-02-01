export default function Loading() {
    const element = document.createElement('span')
    const icon = document.createElement('i')

    element.classList.add('loading');
    element.appendChild(icon);

    return element;
}