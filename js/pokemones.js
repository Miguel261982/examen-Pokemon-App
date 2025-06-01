document.addEventListener("DOMContentLoaded", () => {
    let pagina = 1;
    const limit = 20;
    let todosPokemones = [];  

    const btnSiguiente = document.getElementById('btnSiguiente');
    const btnAnterior = document.getElementById('btnAnterior');
    const listaPokemon = document.getElementById('listaPokemon');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    btnSiguiente.addEventListener('click', () => {
        if (pagina < 42) {
            pagina += 1;
            obtenerPokemon();
        }
    });

    btnAnterior.addEventListener('click', () => {
        if (pagina > 1) {
            pagina -= 1;
            obtenerPokemon();
        }
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            buscarPokemon(query);
        }
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                buscarPokemon(query);
            }
        }
    });


    const obtenerPokemon = async () => {
        try {
            const offset = (pagina - 1) * limit;
            listaPokemon.innerHTML = `<p>Cargando Pokémon...</p>`;

            const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await respuesta.json();

            if (pagina === 1) { 
                todosPokemones = data.results;
            } else {
                todosPokemones = todosPokemones.concat(data.results);
            }

            mostrarPokemones(todosPokemones);
             
            console.log( data);

        } catch (error) {
            console.error("Error al obtener los datos de la API:", error);
            listaPokemon.innerHTML = `<p>Error al cargar Pokémon.</p>`;
        }
    };

    const mostrarPokemones = async (pokemones) => {
        try {
            let salida = '';

            const detallesPokemon = await Promise.all(
                pokemones.map(async (pokemon) => {
                    const res = await fetch(pokemon.url);
                    return res.json();
                })
            );

            detallesPokemon.forEach(pokemon => {
                salida += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="product__item">
                        <div class="product__item__text">
                            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="img-fluid"/>
                            <h4><a href="#">${pokemon.name}</a></h4>
                            <ul>
                                <li><b>ID:</b> ${pokemon.id}</li>
                                <li><b>Tipo:</b> ${pokemon.types.map(type => type.type.name).join(', ')}</li>
                                 <li><b>Altura:</b> ${pokemon.height} m</li>
                                <li><b>Peso:</b> ${pokemon.weight} kg</li>
                                <li><b>Habilidades:</b> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</li>
                                <li><b>Experiencia Base:</b> ${pokemon.base_experience}</li>
                            </ul>
                        </div>
                    </div>
                </div>`;
            });

            listaPokemon.innerHTML = salida;
        } catch (error) {
            console.error("Error al mostrar los detalles de los Pokémon:", error);
            listaPokemon.innerHTML = `<p>Error al mostrar los Pokémon.</p>`;
        }
    };

    const buscarPokemon = (query) => {
        let pokemonesFiltrados = [];

        if (!isNaN(query)) {
            pokemonesFiltrados = todosPokemones.filter(pokemon => pokemon.url.includes(`pokemon/${query}/`));
        } else {
       
            pokemonesFiltrados = todosPokemones.filter(pokemon => pokemon.name.toLowerCase().includes(query));
        }

        if (pokemonesFiltrados.length > 0) {
            mostrarPokemones(pokemonesFiltrados);
        } else {
            listaPokemon.innerHTML = `<p>No se encontraron Pokémon con ese nombre o ID.</p>`;
        }
    };

    obtenerPokemon(); 
});
