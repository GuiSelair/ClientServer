//import { Http2ServerRequest } from "http2";
//import { rejects } from "assert";

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

  loadFromJSON(json){
    for(let name in json){
      switch (name) {
        case "_create":
          this[name] = new Date(json[name])
          break;
        default:
          if (name.substring(0, 1) === "_") this[name] = json[name]
      }
    }
  }

  /*
  static getUsersStorages(){
    let users = []
    if (sessionStorage.getItem("user")){
      users = JSON.parse(sessionStorage.getItem("user"))
    }
    return users
  }
  */

  getNewID(){
    let userID = parseInt(sessionStorage.getItem("userID"))
    if (!userID) userID = 0;
    userID++
    sessionStorage.setItem("userID", userID)    
    return userID
  }

  // ADICIONA NOVOS CADASTROS NO SESSION STORAGES

  toJSON() {
    let json = {}

    //  Object.keys(this) = Lê todas as chaves do Objeto passado, retornando um ARRAY
    Object.keys(this).forEach(key => {
      if (this[key] !== undefined)  json[key] = this[key]
    })

    return json
  }

  save(){
    return new Promise((resolve, reject) => {
      let promise
      if (this.id){
        promise = HttpRequest.put(`users/${this.id}`, this.toJSON())
      }
      else{
        promise = HttpRequest.post(`users/`, this.toJSON())
      }

      promise.then( data => {
        this.loadFromJSON(data)
        resolve(this)
      }).catch(e => reject(e))
    })
    

  }

  async remove(){
     await HttpRequest.delete(`users/${this.id}`)
  }
}
