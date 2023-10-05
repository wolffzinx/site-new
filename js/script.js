let inputBuscarFilmes = document.querySelector("#input-buscar-filmes");
let btnBuscarFilmes = document.querySelector("#btn-buscar-filmes");
let filmes;
let navFavoritos = document.querySelector("#nav-favoritos");

btnBuscarFilmes.onclick = () => {
  
  if (inputBuscarFilmes.value.length > 0) {
    filmes = new Array();
    fetch("https://www.omdbapi.com/?i=tt3896198&apikey=1b5322a&s=" + inputBuscarFilmes.value)
      .then((resp) => resp.json())
      .then((resp) => {
        resp.Search.forEach((item)=>{ 
          console.log(item);
          let filme=new Filme(
            item.imdbID,
            item.Title,
            item.Year,
            null,
            item.Poster,
            null,
            null,
            null,
            null,
            null,
            null
          
          );
          filmes.push(filme);
          
      });
      listarFilmes(filmes);
      
    });
  }
}



let listarFilmes = async(filmes) =>{
  let listaFilmes =  await document.querySelector("#lista-filmes");
  listaFilmes.style.display="flex";
  listaFilmes.innerHTML ="";

  document.querySelector("#mostrar-filmes").innerHTML="";
  document.querySelector("#mostrar-filmes").style.display ="none";

  if(filmes.length > 0){
    filmes.forEach(async(filme) => {
      listaFilmes.appendChild(await filme.getCard());
      filme.getBtnDetalhes().onclick=()=>{
        detalhesFilme(filme.id);
      }
    });
  }
}
//iuri
let detalhesFilme = async (id) => {
  fetch("https://www.omdbapi.com/?apikey=1b5322a&i=" + id)
  .then((resp) => resp.json())
  .then((resp) => {
      
      console.log(resp);
      let filme = new Filme (
          resp.imdbID,
          resp.Title,
          resp.Year,
          resp.Genre.split(","),
          resp.Poster,
          resp.Runtime,
          resp.Plot,
          resp.Director,
          resp.Actors.split(","),
          resp.Awards,
          resp.imdbRating
      );
      document.querySelector("#mostrar-filmes").appendChild(filme.getDetalhesFilme());
      
        document.querySelector("#btnFechar").onclick = () =>{
        document.querySelector("#lista-filmes").style.display="flex";
        document.querySelector("#mostrar-filmes").innerHTML="";
        document.querySelector("#mostrar-filmes").style.display="none";
      }
      document.querySelector("#btnDesfavoritar").onclick = () => {
        let filmesString = localStorage.getItem("filmesFavoritos");
        var filmes = new Array();
        if (localStorage.hasOwnProperty("filmesFavoritos")) {
          filmes = JSON.parse(filmesString);
        }
        filmes = filmes.filter((f) => f.id !== filme.id); 
        filmes = JSON.stringify(filmes);
        localStorage.setItem("filmesFavoritos", filmes);
        listarFavoritos(); 
      }
      //iuri
      document.querySelector("#btnSalvar").onclick = () =>{
       let filmesString = localStorage.getItem("filmesFavoritos");
       var filmes = new Array();
       if(localStorage.hasOwnProperty("filmesFavoritos")){
         filmes = JSON.parse(filmesString);
       }
       if (filmes.some(filmeSalvo => filmeSalvo.id === filme.id)) {
        alert("O filmejá esta salvo nos FAVORITOS");
        return;
      }
       filmes.push(filme);
       filmes=JSON.stringify(filmes);
       localStorage.setItem("filmesFavoritos",filmes);
      }
      
       document.querySelector("#btnEditar").onclick = () => {
        document.querySelector("#lista-filmes").style.display = "none";
        document.querySelector("#mostrar-filmes").innerHTML = "";
        document.querySelector("#mostrar-filmes").appendChild(filme.editarFilme());

        document.querySelector("#btnSalvarTudo").onclick = ()=>{
        let inputT = document.querySelector("#inputT");
        let inputS = document.querySelector("#inputS");
     
        let filme = JSON.parse(localStorage.getItem("filme"));

        filme.titulo = inputT.value;
        filme.sinopse = inputS.value;

        localStorage.setItem("filme", JSON.stringify(filme));

        listarFavoritos();

        }
      };
      
      document.querySelector("#lista-filmes").style.display="none";
      document.querySelector("#mostrar-filmes").style.display="flex";       
  });
}



navFavoritos.onclick =() =>{
  listarFavoritos();
}

let listarFavoritos =()=>{
   let filmeFavoritos = localStorage.getItem('filmesFavoritos');
   filmeFavoritos = JSON.parse(filmeFavoritos);

   let filmes = new Array();
   filmeFavoritos.forEach((item) => {

   let filme = new Filme(
    item.id,
    item.titulo,
    item.ano,
    item.genero,
    item.cartaz,
    item.sinopse,
    item.duracao,
    item.direcao,
    item.elenco,
    item.classificacao,
    item.avaliacao
  );
  
  filmes.push(filme);

   });
  listarFilmes(filmes);
};




