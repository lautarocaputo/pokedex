const listaPokemon = $("#listaPokemon");
const tipos = $(".btn-header");
let url = "https://pokeapi.co/api/v2/pokemon/";

cantidadPokemons = 151;

for (let i = 1; i <= cantidadPokemons; i++) {
  fetch(url + i)
    .then((response) => response.json())
    .then((data) => mostrarPokemon(data));
}

function mostrarPokemon(data) {
  let tipos = data.types.map(
    (type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`
  );
  tipos = tipos.join("");
  let id = data.id.toString();
  if (id.length === 1) {
    id = "00" + id;
  } else if (id.length === 2) {
    id = "0" + id;
  }

  const div = $(document.createElement("div"));
  div.addClass("pokemon");
  div.html(`<p class="pokemon-id-back">#${id}</p>
    <div class="pokemon-imagen">
        <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
    </div>
    <div class="pokemon-info">
        <div class="nombre-contenedor">
            <p class="pokemon-id">#${id}</p>
            <h2 class="pokemon-nombre">${data.name}</h2>
        </div>
        <div class="pokemon-tipos">
            ${tipos}
        </div>
        <div class="pokemon-stats">
            <p class="stat">${data.height}mts</p>
            <p class="stat">${data.weight}kgs</p>
        </div>
    </div>`);

  listaPokemon.append(div);
}

let tiposSeleccionados = [];

tipos.on("click", function (event) {
  const botonId = event.currentTarget.id;
  const boton = $(event.currentTarget);
  console.log(boton);
  // Verificar si el botón clickeado es "ver-todos"
  if (botonId === "ver-todos") {
    tiposSeleccionados = []; // Reiniciar los tipos seleccionados
    tipos.removeClass("button-clicked");
  } else {
    boton.addClass("button-clicked");
    // Si el botón clickeado es un tipo, agregarlo o eliminarlo de la lista según su estado actual
    if (tiposSeleccionados.includes(botonId)) {
      // Si ya está en la lista, quitarlo
      tiposSeleccionados = tiposSeleccionados.filter((tipo) => tipo !== botonId);
      boton.removeClass("button-clicked");
    } else {
      // Si no está en la lista, agregarlo
      tiposSeleccionados.push(botonId);
    }
  }

  listaPokemon.empty();

  for (let i = 1; i <= cantidadPokemons; i++) {
    $.ajax({
      url: url + i,
      dataType: "json",
      success: function (data) {
        const tipos = data.types.map((type) => type.type.name);

        // Verificar si se deben mostrar Pokémon basados en los tipos seleccionados
        if (
          tiposSeleccionados.length === 0 || // Si no se han seleccionado tipos, mostrar todos
          tiposSeleccionados.every((tipo) => tipos.includes(tipo))
        ) {
          mostrarPokemon(data);
        }
      },
      error: function () {
        // Manejar errores aquí si es necesario
      },
    });
  }
});

$("#btn-buscar").on("click", function (event) {
  event.preventDefault();
  let busqueda = $("#input-buscar").val().toLowerCase();
  listaPokemon.empty();

  for (let i = 1; i <= cantidadPokemons; i++) {
    $.ajax({
      url: url + i,
      dataType: "json",
      success: function (data) {
        if (data.name.includes(busqueda)) {
          mostrarPokemon(data);
          $("#input-buscar").val("");
        }
      },
      error: function () {

      },
    });
  }
});
