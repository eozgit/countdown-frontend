import host from './host'

export default (count: number) => {
    return fetch(host + '/numbers', {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            count
        })
    })
}
