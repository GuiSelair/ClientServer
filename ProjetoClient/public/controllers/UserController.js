class UserController{

  constructor(formID, formUpdateID, tableID){
      this.formEl = document.getElementById(formID)
      this.tableEl = document.getElementById(tableID)
      this.formUpdateEl = document.getElementById(formUpdateID)
      this.onSubmit()
      this.onEdit()
      this.selectAll()
  }

  // FICA AGUARDANDO O CLICK NO BOTÃO CANCELAR QUANDO O USUÁRIO ESTIVER EDITANDO USUÁRIO
  onEdit(){
    
    document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
      this.formEl.reset()
      document.querySelector("#box-user-update").style.display = "none"
      document.querySelector("#box-user-create").style.display = "block"
    })

    this.formUpdateEl.addEventListener("submit", (event) => {
      event.preventDefault()  // ESTE METODO BLOQUEIA QUE A PAGINA SEJA ATUALIZADA QUANDO CLICADO O BTN SUBMIT.

      let btnSubmit = this.formEl.querySelector("[type=submit]")
      btnSubmit.disabled = true
      
      let resultsvaluesUser = this.getValues(this.formUpdateEl);
      let trEdit = this.tableEl.rows[this.formUpdateEl.dataset.trID]

      let userOld = JSON.parse(trEdit.dataset.user)
      let results = Object.assign({}, userOld, resultsvaluesUser)
      
      
      this.getPhoto(this.formUpdateEl).then((content) => {  /// AGUARDA O RETORNO DA PROMISE DO GETPHOTO
        if (!resultsvaluesUser.photo) 
          results._photo = userOld._photo
        else
          results._photo = content

        let user = new User()
        user.loadFromJSON(results)

        user.save().then( user => {
          this.getTr(user, trEdit)
          this.updateCount()
          btnSubmit.disabled = false
          this.formEl.reset()
  
          this.showPanelCreate()
        })
      }, (e) => {        
        console.log(e);
      })
    });
  }

  // FICA AGUARDADO O CLICK NO BOTÃO SUBMIT PARA EXECUTAR A FUNÇÃO
  onSubmit(){
    // ADICIONAMOS UM EVENTO AO USUARIO CLICAR NO BTN SUBMIT.
    this.formEl.addEventListener("submit", event => {
      event.preventDefault()  // ESTE METODO BLOQUEIA QUE A PAGINA SEJA ATUALIZADA QUANDO CLICADO O BTN SUBMIT.
      let btnSubmit = this.formEl.querySelector("[type=submit]")
      btnSubmit.disabled = true
      
      let valuesUser = this.getValues(this.formEl);
      console.log(valuesUser);
      
      if (!valuesUser) return false

      this.getPhoto(this.formEl).then((conteudo) => {  /// AGUARDA O RETORNO DA PROMISE DO GETPHOTO
        valuesUser.photo = conteudo;

        // PARA INSERIR OS DADOS NUM SESSION STORAGE
        valuesUser.save().then( user =>{
          this.addLine(user);
          btnSubmit.disabled = false
          this.formEl.reset()
        })
      }, (error) => {

        console.log(error);

      })
    });
  }

  showPanelCreate(){

    document.querySelector("#box-user-create").style.display = "block";
    document.querySelector("#box-user-update").style.display = "none";

}
  
  // OBTEM A URL DA IMAGEM
  getPhoto(formEl){
    // USO DE PROMISES PARA EVENTOS ASSICRONOS
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();

      // METODO FILTER RETORNA UM VETOR SOMENTE COM O CAMPO RETORNADO, POR ISSO ESTAMOS RECEBENDO ELE.
      let arquivo = [...formEl.elements].filter(campo => {
        if (campo.name === "photo") return campo;
      });
      
      // CARREGA A IMAGEM E LOGO DEPOIS CHAMA A FUNÇÃO QUE VEIO COMO RESPOSTA (CALLBACK)
      fileReader.onload = () => {
        resolve(fileReader.result)
      };

      fileReader.onerror = (e) => {
        reject(e)
      }

      // CARREGA A URL DA IMAGEM 
      let file = arquivo[0].files[0]
      if (file)
        fileReader.readAsDataURL(file)
      else
        resolve("dist/img/boxed-bg.jpg")
    })
    

  }

  // OBTEM OS VALORES DOS INPUTS
  getValues(formEl){
    let user = {};
    let formValidate = true;

    // REALIZA A BUSCA DE TODOS OS CAMPOS DO FORMULÁRIO PREENCHIDO E ADICIONA-OS EM UM JSON.
    [...formEl.elements].forEach((campo, index) => {
      if (["name", "email", "password"].indexOf(campo.name) >= 0 && !campo.value){
        campo.parentElement.classList.add("has-error")
        formValidate = false
      }
      
      if (campo.name === "gender" && campo.checked){
        user[campo.name] = campo.value;
      }
      else if(campo.name == "admin"){
        user[campo.name] = campo.checked;
      }else{
        user[campo.name] = campo.value;
      }

      
    });

    if (!formValidate){
      return false
    }
    // PASSAMOS O OBJETO USUARIO AO INVES DO JSON
    return new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin);
  }

//==============================REQUISITANDO DADOS DO BANCO DE DADOS E EXIBINDE-OS=============================================
  
  // SELECIONA TODOS OS DADOS DO SERVIDOR E CRIA UM TR PARA CADA
  selectAll(){

    HttpRequest.get("/users").then(json => {
      json.users.forEach(dataUser => {
        let user = new User()
        user.loadFromJSON(dataUser)
        this.addLine(user)
      })
    })

  }

//==================================================================================================

  // ADICIONA O USUÁRIO RECEBIDO NA TABELA
  addLine(dataUser){
    let tr = this.getTr(dataUser) 
    this.tableEl.appendChild(tr);
    this.updateCount()    
  }

  getTr(dataUser, tr = null){

    if (tr === null){
      tr = document.createElement("tr")
    }
    tr.dataset.user = JSON.stringify(dataUser)

    tr.innerHTML = `
        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${(dataUser.admin) ? "Sim" : "Não"}</td>  
        <td>${Utils.dateFormat(dataUser.create)}</td>
        <td>
          <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-delete btn-flat">Excluir</button>
        </td>
      `;
    this.addEventTR(tr);
    return tr
  }

  addEventTR(tr){

    // DELETE
    tr.querySelector(".btn-delete").addEventListener("click", event => {
      if (confirm("Deseja realmente excluir? ")){
        let user = new User()
        user.loadFromJSON(JSON.parse(tr.dataset.user))
        user.remove()
        tr.remove()
        this.updateCount()
      }

    })

    // EDIT
    tr.querySelector(".btn-edit").addEventListener("click", e => {
      let json = JSON.parse(tr.dataset.user)
      let form = document.querySelector("#form-user-update")
      form.dataset.trID = tr.sectionRowIndex;
      for (let campo in json){
        let field = form.querySelector("[name="+campo.replace("_", "")+"]")
        console.log(field)
        if (field){
          switch (field.type) {
            case "file":
              continue;
            case "radio":
              field = form.querySelector("[name="+campo.replace("_", "")+"][value="+json[campo]+"]");
              field.checked = true;
              break;
            case "checkbox":
              field.checked = json[campo];
              break;
              
            default:
              field.value = json[campo]
          }
          
        }
        
      }
      document.querySelector("#box-user-create").style.display = "none"
      document.querySelector("#box-user-update").style.display = "block"
      
    })

  }

  // FUNCÃO QUE ATUALIZA QUANDO USUÁRIOS E ADMINS EXISTEM NA TABELA
  updateCount(){
    let numberUsers = 0;
    let numberAdmin = 0;

    [...this.tableEl.children].forEach((tr) => {
      numberUsers++
      let user = JSON.parse(tr.dataset.user)
      if (user._admin) numberAdmin++
    })

    document.querySelector("#number-users").innerHTML = numberUsers
    document.querySelector("#number-users-admin").innerHTML = numberAdmin
    
  }


}

