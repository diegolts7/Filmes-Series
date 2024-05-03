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
const conteinerFilmes = document.querySelector("#listaFilmes");
const conteinerSeries = document.querySelector("#listaSeries");
const conteinerAssistidos = document.querySelector("#listaAssistidos");
const abrirFilmes = document.querySelector("#abrirFilmes");
const abrirSeries = document.querySelector("#abrirSeries"); 
const abrirAssistidos = document.querySelector("#abrirAssistidos");
const tituloInfo = document.querySelector("#tituloInfo");
const imgInfo = document.querySelector("#imgInfo");
const votoInfo = document.querySelector("#votoInfo");
const dataInfo = document.querySelector("#dataInfo");
const descricaoInfo = document.querySelector("#descricaoInfo");
const btnMarcarConcluido = document.querySelector("#btnMarcarConcluido");
const contagemFilmes = document.querySelector("#contagemFilmes");
const contagemSeries = document.querySelector("#contagemSeries");
const contagemAssistidos = document.querySelector("#contagemAssistidos");



// variaveis de implementação

let tituloSelecionado;
let conteinerFilmesFechado = true;
let conteinerSeriesFechado = true;
let conteinerAssistidosFechado = true;
let cardClicado;

//orientação a objeto

class ListaFS {
    constructor(listaFilme,listaSerie,listaAssistido){
        this.listaFilme = listaFilme;
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
            if(element.poster_path && element.adult === false){

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

                if(conteiner === resultadosPesquisa){

                    card.addEventListener("click", ()=>{
                        btnAddTitulo.style.display = "flex";
                        btnAddTitulo.value = `Adicionar ${card.lastChild.textContent}`;
                        tituloSelecionado = element;
    
                    });

                }else if(conteiner === conteinerAssistidos){
                    card.addEventListener("click", ()=> {
                        abrirModalInfo();
                        this.mostrarInfo(element);
                        btnMarcarConcluido.style.display = "none";
                    });

                }else{
                    card.addEventListener("click", ()=> {
                        cardClicado = element;
                        abrirModalInfo();
                        this.mostrarInfo(element);
                    })
                }
                
                
            }
            
        });
        atualizarContagem(conteiner);

    }
    mostrarInfo(objeto) {

        if(objeto.title){
            tituloInfo.textContent = objeto.title;
        }else{
            tituloInfo.textContent = objeto.name;
        }

        imgInfo.src = `${urlBaseImg}${objeto.backdrop_path}`;

        votoInfo.textContent = `${objeto.vote_average}`;

        if(objeto.release_date){
            dataInfo.textContent = objeto.release_date;
        }else{
            dataInfo.textContent = objeto.first_air_date;
        }

        descricaoInfo.textContent = objeto.overview;
    }
    marcarConcluido(element){
        
        if(element.title){

            this.listaFilme.delete(element.id);
            this.addTitulo(conteinerAssistidos, this.listaAssistido, element);
            this.mostrarTitulos(conteinerFilmes, this.listaFilme);
            fecharModal();
            atualizarContagem(conteinerFilmes);
    
        }else{
            
            this.listaSerie.delete(element.id);
            this.addTitulo(conteinerAssistidos, this.listaAssistido, element);
            this.mostrarTitulos(conteinerSeries, this.listaSerie);
            fecharModal();
            atualizarContagem(conteinerSeries);
        }
    }
}

let arrayFilmes = localStorage.getItem("listaFilmes") ? JSON.parse(localStorage.getItem("listaFilmes")) : [] ;

let arraySeries = localStorage.getItem("listaSeries") ? JSON.parse(localStorage.getItem("listaSeries")) : [] ;

let arrayAssistidos = localStorage.getItem("listaAssistidos") ? JSON.parse(localStorage.getItem("listaAssistidos")) : [] ;

let listaPrincipal = new ListaFS(new Map(arrayFilmes),new Map(arraySeries),new Map(arrayAssistidos));


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
btnAddTitulo.addEventListener("click", addTitulo);
abrirFilmes.addEventListener("click", abrirConteinerFilmes);
abrirSeries.addEventListener("click", abrirConteinerSeries);
abrirAssistidos.addEventListener("click", abrirConteinerAssistidos);
btnMarcarConcluido.addEventListener("click", ()=> {
    conteinerAssistidos.style.display = "flex";
    conteinerAssistidosFechado = false;
    listaPrincipal.marcarConcluido(cardClicado);
});
window.addEventListener("beforeunload", salvarDados);
window.addEventListener("DOMContentLoaded", lerDados);


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

function abrirConteinerFilmes() {

    if(conteinerFilmesFechado){
        conteinerFilmes.style.display = "flex";
        conteinerFilmesFechado = false;
    }else{
        conteinerFilmes.style.display = "none";
        conteinerFilmesFechado = true;
    }
}

function abrirConteinerSeries() {

    if(conteinerSeriesFechado){
        conteinerSeries.style.display = "flex";
        conteinerSeriesFechado = false;
    }else{
        conteinerSeries.style.display = "none";
        conteinerSeriesFechado = true;
    }
}

function abrirConteinerAssistidos() {

    if(conteinerAssistidosFechado){
        conteinerAssistidos.style.display = "flex";
        conteinerAssistidosFechado = false;
    }else{
        conteinerAssistidos.style.display = "none";
        conteinerAssistidosFechado = true;
    }
}

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

function abrirModalInfo() {
    btnMarcarConcluido.style.display = "flex";
    modal.style.display = "flex";
    modalAdd.style.display = "none";
    modalInfo.style.display = "flex";
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
        btnAddTitulo.style.display = "none";
        try{
            const dados = await getAPI(tipo, input.value);
            listaPrincipal.mostrarTitulos(resultadosPesquisa,dados);


        }catch (error){
            alert(error);
        }
    }
    
}

function addTitulo() {
    if(tituloSelecionado.title){

        if(listaPrincipal.listaFilme.has(tituloSelecionado.id) || listaPrincipal.listaAssistido.has(tituloSelecionado.id)){
            alert("Esse filme já foi adicionado ou assistido.");
        }else{
            
            listaPrincipal.addTitulo(conteinerFilmes, listaPrincipal.listaFilme, tituloSelecionado);
            fecharModal();
            conteinerFilmes.style.display = "flex";
            conteinerFilmesFechado = false;

        }

    }else{
        if(listaPrincipal.listaSerie.has(tituloSelecionado.id) || listaPrincipal.listaAssistido.has(tituloSelecionado.id)){
            alert("Essa serie já foi adicionada ou assistida.");
        }else{
            
            listaPrincipal.addTitulo(conteinerSeries, listaPrincipal.listaSerie, tituloSelecionado);
            fecharModal();
            conteinerSeries.style.display = "flex";
            conteinerSeriesFechado = false;
            
        }
        
    }
}

function atualizarContagem(conteiner) {
    if(conteiner === conteinerFilmes){
        contagemFilmes.textContent = `${listaPrincipal.listaFilme.size} `;
    }else if(conteiner === conteinerSeries){
        contagemSeries.textContent = `${listaPrincipal.listaSerie.size} `;
    }else if(conteiner === conteinerAssistidos){
        contagemAssistidos.textContent = `${listaPrincipal.listaAssistido.size} `;
    }
}

function salvarDados() {

    let entriesFilmes = Array.from(listaPrincipal.listaFilme.entries());
    let entriesSeries = Array.from(listaPrincipal.listaSerie.entries());
    let entriesAssistidos = Array.from(listaPrincipal.listaAssistido.entries());

    localStorage.setItem("listaFilmes", JSON.stringify(entriesFilmes));
    localStorage.setItem("listaSeries", JSON.stringify(entriesSeries));
    localStorage.setItem("listaAssistidos", JSON.stringify(entriesAssistidos));

}

function lerDados() {
    
    listaPrincipal.mostrarTitulos(conteinerFilmes, listaPrincipal.listaFilme);
    listaPrincipal.mostrarTitulos(conteinerSeries, listaPrincipal.listaSerie);
    listaPrincipal.mostrarTitulos(conteinerAssistidos, listaPrincipal.listaAssistido);
    
}