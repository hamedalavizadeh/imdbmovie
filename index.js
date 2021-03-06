const autoCompleteConfig = {
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A'? '' : movie.Poster;
        return `
        <img src="${imgSrc}"/>
        ${movie.Title} (${movie.Year})
        `
    },
    inputValue(movie){
        return movie.Title;
    }
    ,
    async fetchData(searchTerm){
        const response = await axios.get('http://www.omdbapi.com/',{
            params:{
                apiKey:'15623511',
                s:searchTerm
            }
        });

        if(response.data.Error){
            return [];
        }

        return response.data.Search;
    }
}

creatAutoCompelet({
    ...autoCompleteConfig ,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector('#left-summary'),'left');
    }

})

creatAutoCompelet({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector('#right-summary'),'right');
    }

})

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie , summaryElement, side ) =>{
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apiKey:'15623511',
            i:movie.imdbID
        }
    })

    summaryElement.innerHTML = movieTemplate(response.data);

    if( side === 'left'){
        leftMovie = response.data;
    } else{
        rightMovie = response.data;
    }

    if( leftMovie && rightMovie){
        runComparison();
    }
};

const runComparison = () =>{
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach(( leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if(rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }

    })
}

const movieTemplate = movieDetail =>{

    const dollars = parseInt(
        movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,'')
    );
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseInt(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes);

    let count = 0;
    const awards = movieDetail.Awards.split(' ').forEach((prev , word) => {
        const value = parseInt(word);

        if(isNaN(value)){
            return prev;
        } else {
            count = count + value;
        }
    }, 0);
    console.log(count);
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    
    <article data-value="${awards}" class="notification is-primary">
        <p class="title" >${movieDetail.Awards}</p>
        <p class="subTitle" >Awards</p>
    </article>
    
    <article data-value="${dollars}" class="notification is-primary">
        <p class="title" >${movieDetail.BoxOffice}</p>
        <p class="subTitle" >BoxOffice</p>
    </article>
    
    <article data-value="${metascore}" class="notification is-primary">
        <p class="title" >${movieDetail.Metascore}</p>
        <p class="subTitle" >Metascore</p>
    </article>
    
    <article data-value="${imdbRating}" class="notification is-primary">
        <p class="title" >${movieDetail.imdbRating}</p>
        <p class="subTitle" >TMDB Rating</p>
    </article>
    
    <article data-value="${imdbVotes}" class="notification is-primary">
        <p class="title" >${movieDetail.imdbVotes}</p>
        <p class="subTitle" >IMDB Votes</p>
    </article>
    `
}