
/*
 *  CLASSE HTTPREQUEST: VELHA CLASSE AJAX PARA REQUISIÇÕES ASSINCRONAS 
 */

class HttpRequest {
    static request(metodo, url, params = {}){
        return new Promise((resolve, reject) => {
            const ajax = new XMLHttpRequest()
            ajax.open(metodo.toUpperCase(), url)

            //onerror: Método utilizado para notificar erros
            ajax.onerror = error => {
                reject(error)
            }

            // onload: Método utilizado para tratar oque obtivermos de resposta da requisição.
            ajax.onload = (event) => {

                // obj: Variavel que vai receber o JSON do servidor
                // Declaramos com try/catch para evitar erros de JSONs inválidos.
                let obj = {}
                try {
                    // Pegamos o texto que o servidor nos enviou em formato de texto e tratamos como um JSON
                    obj = JSON.parse(ajax.responseText)
                    console.log(obj);
                    
                } catch(e) {
                    console.log(e)
                    reject(e)
                }

                resolve(obj)
            }

            // Send: Envia a requisição
            ajax.setRequestHeader("Content-Type", "application/json")
            ajax.send(JSON.stringify(params))
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