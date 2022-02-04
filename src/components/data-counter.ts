export default function DataCounter(length?: number) {
    if(!length || length < 1) return 'Não há usuários cadastrados no sistema.<br/> Se você deseja obter novamente a lista inicial da API, por favor, remova a chave USER_LIST do localStorage.'
    else if(length === 1) return 'Foi encontrado 1 usuário'
    return `Foram encontrados ${length} usuários`
}