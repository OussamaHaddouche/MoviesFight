const fetchData = async keyword => {
    const response = await axios.get("http://www.omdbapi.com/",{
        params:{
            apikey:"8b8d62eb",
            s:keyword
        }
    })
    if(response.data.Error) return [];
    return response.data.Search;
}
const searchSection = document.querySelector('.search-field')
const searchInput = document.querySelector('.search-field input')
const movieList = document.querySelector('.movieList');

const onInput = async event => {
    if(event.target.value.trim()){
    movieList.innerHTML='';
     const movies = await fetchData(event.target.value.trim());
     if(!movies.length) return;
     movieList.classList.remove('hide-list');
     for (const movie of movies) {
        const div = document.createElement('div');
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
        div.classList.add("movie")
        div.innerHTML = `<img class="poster" src="${imgSrc}" />
                        ${movie.Title}`
        movieList.appendChild(div);
        div.addEventListener('click',()=>{
            searchInput.value = movie.Title;
            movieList.classList.add('hide-list');
            onMovieSelect(movie);
        })
        
    } 
    }else{
        movieList.classList.add('hide-list');
        movieList.innerHTML='';
    }     
}

searchInput.addEventListener('input', debounce(onInput, 500))

document.addEventListener('click',()=>{
    if(!searchSection.contains(event.target)){
        movieList.classList.add('hide-list')
    }
})
const movieDetail = document.querySelector('.selected-movie')

const onMovieSelect = async movie => {
    const movieResponse = await axios.get("http://www.omdbapi.com/",{
        params:{
            apikey:"8b8d62eb",
            i:movie.imdbID
        }
    })
    movieDetail.innerHTML = movieTemplate(movieResponse.data);
}


const movieTemplate = (movieData) => {
   return `<div class="movie-header">
                 <img class="movie-poster" src='${movieData.Poster}'/>
                 <div class="movie-info">
                    <h1> ${movieData.Title} </h1>
                    <h4> ${movieData.Genre} </h4>
                    <div> ${movieData.Plot} </div>
                 </div>
            </div>`;
}