const ul = document.querySelector('[data-js="pokedex"]');

const generateHTML = (pokemons) => {
  // Se caso nao colocar valor inicial, nao ira exibir pokemons[0]
  return pokemons.reduce((accumulator, { name, id, types, sprites }) => {
    const elementTypes = types.map((typeInfo) => typeInfo.type.name);

    accumulator += `
  <li class="card ${elementTypes[0]}">
    <img class="card-image" 
    alt="${name}"
    src="${sprites.front_default}" />

    <h2 class="card-title">${id}. ${name}</h2>
    <p class="card-subtitle">${elementTypes.join(" | ")}</p>
  </li>`;
    return accumulator;
  }, "");
};

const insertPokemonsIntoPage = (listPokemons) => {
  ul.innerHTML = listPokemons;
};

async function fetchPokemon(limit, offset) {
  const getPokemonUrlList = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const pokemonPromises = [];

  await fetch(getPokemonUrlList)
    .then((res) => res.json())
    .then(({ results }) => {
      results.map(({ url }) =>
        pokemonPromises.push(fetch(url).then((res) => res.json()))
      );
    });

  Promise.all(pokemonPromises).then(generateHTML).then(insertPokemonsIntoPage);
}

fetchPokemon(12, 0);

const previous = document.getElementById("previous");
const next = document.getElementById("next");

let currentPage = 1;
const refreshPage = () => {
  ul.innerHTML = "";
  const calc = (currentPage - 1) * 12;
  const { x, y } = calc == 0 ? { x: 12, y: 0 } : { x: calc, y: calc };
  fetchPokemon(x, y);
};

previous.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    refreshPage();
  }
});

next.addEventListener("click", () => {
  currentPage += 1;
  refreshPage();
});
