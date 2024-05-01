const urlAPI = "https://api.themoviedb.org/3/search/";
const keyAPI = "90d591526c10ba96419d8d87cb7ba5a8";
const urlBaseImg = "https://image.tmdb.org/t/p/w500";

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

