
/*
 *  CLASSE FETCH: UM NOVO JEITO DE FAZER REQUISIÇÕES ASSINCRONAS 
 */

class Fetch {
    static request(metodo, url, params = {}){
        return new Promise((resolve, reject) => {
            let request

            switch (metodo.toLowerCase()) {
                case "get":
                    request = url
                    break;
            
                default:
                    request = new Request(url, {
                        method: metodo,
                        body: JSON.stringify(params),
                        headers: new Headers({
                            "Content-Type": "application/json"
                        })
                    })

                    break;
            }


            fetch(request).then( async function(response){
                resolve(await response.json())
            }).catch( e =>{
                reject(e)
            })
        })
    }

    static get(url, params = {}){
        return this.request("GET", url, params)
    }

    static post(url, params = {}){
        return this.request("POST", url, params)
    }

    static delete(url, params = {}){
        return this.request("DELETE", url, params)
    }

    static put(url, params = {}){
        return this.request("PUT", url, params)
    }
}