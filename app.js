
const apiKey = 'dcff3f2173cb4c6da66ea16ed09978d6';
const main = document.querySelector('#main');
const sourceSelector = document.querySelector('#sourceNews');
let newsCounter = 1;
const defaultSource = "the-washington-post";
//site load
window.addEventListener('load', async e => {
	updateNews();
	await updateSources();
	sourceSelector.value = defaultSource;

	sourceSelector.addEventListener('change', e => {
		updateNews(e.target.value);
	})

	if('serviceWorker' in navigator){
		try {
			navigator.serviceWorker.register('sw.js');
			console.log('Service Worker Registered');
		} catch (error) {
			console.log('Registration Failed!')
		}
	}
});


async function updateSources(){
	const res = await fetch(`https://newsapi.org/v2/sources?apiKey=dcff3f2173cb4c6da66ea16ed09978d6`);
	const json = await res.json();
	sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}">${src.name}</option>`).join('\n');
}


async function updateNews(source = defaultSource){
	const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=dcff3f2173cb4c6da66ea16ed09978d6`);
	const json = await res.json();
	main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article){
	return `
			<a href="${article.url}">
				<h2 class="newsTitles">${article.title}</h2>
				<img src="${article.urlToImage}" class="URLimages">
				<p class="para">${article.description}</p>
			</a>
			<hr>
			<br>
	`;
}