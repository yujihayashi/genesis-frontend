export default function DataCounter(length: number) {
    if(!length || length < 1) return 'Não há usuários cadastrados no sistema'
    else if(length === 1) return 'Foi encontrado 1 usuário'
    return `Foram encontrados ${length} usuários`
}