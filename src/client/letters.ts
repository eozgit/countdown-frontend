import host from './host'

export default (type: string) => {
    return fetch(host + '/letters', {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type
        })
    })
}
