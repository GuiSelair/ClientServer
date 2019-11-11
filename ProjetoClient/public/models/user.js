/*
 *  CLASSE RELACIONADA AOS USUÁRIOS DA APLICAÇÃO 
 */

class User{

  constructor(name, gender, birth, country, email, password, photo, admin){
    this._id;
    this._name = name;
    this._gender = gender;
    this._birth = birth;
    this._create = new Date();
    this._country = country;
    this._email = email;
    this._password = password;
    this._photo = photo;
    this._admin = admin;
  }

  /*
   *  METODOS GETTER E SETTER DOS ATRIBUTOS DO OBJETO USER
   */

  get id(){
    return this._id;
  }

  set id(value){
    return this._id = value;
  }

  get create(){
    return this._create
  }

  set create(value){
    return this._create = value
  }

  get name(){
    return this._name
  }
  
  set name(value){
    return this._name = value;
  }

  get gender(){
    return this._gender
  }

  set gender(value){
    this._gender = value
  }

  get birth(){
    return this._birth
  }
  
  get country(){
    return this._country
  }

  get email(){
    return this._email
  }

  get password(){
    return this._password
  }

  get photo(){
    return this._photo
  }
  set photo(value){
    this._photo = value
  }

  get admin(){
    return this._admin
  }

  /*
   *  RECEBE O JSON DO BANCO DE DADOS, LÊ E ADICIONA AO OBJETO USER SUAS INFORMAÇÕES  
   */

  loadFromJSON(json){
    for(let name in json){
      switch (name) {
        case "_create":
          this[name] = new Date(json[name])
          break;
        default:
          /* SÓ LÊ A CHAVE QUE ESTIVER COM _ */
          if (name.substring(0, 1) === "_") this[name] = json[name]
      }
    }
  }

  /*
   *  TRANSFORMA UM OBJETO EM JSON
   */

  toJSON() {
    let json = {}

    //  Object.keys(this) = Lê todas as chaves do Objeto passado, retornando um ARRAY
    Object.keys(this).forEach(key => {
      if (this[key] !== undefined)  json[key] = this[key]
    })

    return json
  }

  /*
   *  SALVA OS DADOS DO USUÁRIO NO BANCO DE DADOS FAZENDO REQUISIÇÕES AJAX 
   */

  save(){
    return new Promise((resolve, reject) => {
      let promise
      if (this.id){
        promise = HttpRequest.put(`users/${this.id}`, this.toJSON())
      }
      else{
        promise = Fetch.post(`users/`, this.toJSON())
      }

      promise.then( data => {
        this.loadFromJSON(data)
        resolve(this)
      }).catch(e => reject(e))
    })
  }

  /*
   *  REMOVE UM USUÁRIO DO BANCO DE DADOS 
   */

  async remove(){
     await HttpRequest.delete(`users/${this.id}`)
  }
}
