//variaveis

const urlAPI = "https://api.themoviedb.org/3/search/";
const keyAPI = "90d591526c10ba96419d8d87cb7ba5a8";
const urlBaseImg = "https://image.tmdb.org/t/p/w500";
const modal = document.querySelector(".modal");
const modalAdd = document.querySelector(".modalAdd");
const modalInfo = document.querySelector(".modalInfo");
const resultadosPesquisa = document.querySelector(".resultados");
const pesquisaFilme = document.querySelector("#pesquisaFilme");
const pesquisaSerie = document.querySelector("#pesquisaSerie");
const btnAddTitulo = document.querySelector("#addTitulo");
const addFilme = document.querySelector("#addFilme");
const addSerie = document.querySelector("#addSerie");
/*const modal = document.querySelector(".modal");
const modal = document.querySelector(".modal");
const modal = document.querySelector(".modal");*/


//orientação a objeto

class ListaFS {
    constructor(listaFilme,listaSerie,listaAssistido){
        this.lista = listaFilme;
        this.listaSerie = listaSerie;
        this.listaAssistido = listaAssistido;
    }
    addTitulo(conteiner,lista,objeto){

        lista.set(objeto.id, objeto);
        this.mostrarTitulos(conteiner,lista);
    }
    mostrarTitulos(conteiner,lista){

        conteiner.innerHTML = "";
        
        lista.forEach(element => {
            if(element.poster_path){

                const card = document.createElement("div");
                card.classList.add("cards");

                const imgCard = document.createElement("img");
                imgCard.src = `${urlBaseImg}${element.poster_path}`

                const titulo = document.createElement("p");

                if(element.name){
                    titulo.textContent = element.name;
                }else{
                    titulo.textContent = element.title;
                }

                card.appendChild(imgCard);
                card.appendChild(titulo);
                conteiner.appendChild(card);
                
            }
            
        });

    }
}

let listaPrincipal = new ListaFS(new Map(),new Map(),new Map());


// eventos 

addFilme.addEventListener("click", abrirModalAddFilme);
addSerie.addEventListener("click", abrirModalAddSerie);
modal.addEventListener("click", fecharModalClicarFora);
pesquisaFilme.addEventListener("keydown", (e) => {
    mostrarResultadosPesquisa(e,pesquisaFilme, "movie");
});
pesquisaSerie.addEventListener("keydown", (e) => {
    mostrarResultadosPesquisa(e,pesquisaSerie, "tv");
});




// funções

const getAPI = async (tipo, nome)=> {

    try {
        let urlMontada = `${urlAPI}${tipo}?api_key=${keyAPI}&query=${encodeURIComponent(nome)}&language=pt-BR`
        let dados = await fetch(urlMontada);
        let dadosJson = await dados.json();
        return dadosJson.results;
    } catch (error) {
        console.log(error);
    }
};

function abrirModalAddTitulo() {

    modal.style.display = "flex";
    modalAdd.style.display = "flex";

}

function abrirModalAddFilme() {
    abrirModalAddTitulo();
    pesquisaFilme.style.display = "flex";
    pesquisaSerie.style.display = "none";
}

function abrirModalAddSerie() {
    abrirModalAddTitulo();
    pesquisaSerie.style.display = "flex";
    pesquisaFilme.style.display = "none";
}

function fecharModal() {

    modal.style.display = "none";
    modalAdd.style.display = "none";
    modalInfo.style.display = "none";
    btnAddTitulo.style.display = "none";
    pesquisaFilme.value = "";
    pesquisaSerie.value = "";
    resultadosPesquisa.innerHTML = "";

}

function fecharModalClicarFora(event) {
    if(event.target === modal){
        fecharModal();
    }
}

async function mostrarResultadosPesquisa(e,input,tipo) {
    if(e.key === "Enter" && input.value.trim() !== ""){
        btnAddTitulo.style.display = "flex";
        try{
            const dados = await getAPI(tipo, input.value);
            listaPrincipal.mostrarTitulos(resultadosPesquisa,dados);
        }catch (error){
            alert(error);
        }
    }
    
}