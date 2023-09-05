const listaPokemon = $("#listaPokemon");
const tipos = $(".btn-header");
let url = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 200; i++) {
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

tipos.on("click", function (event) {
  const botonId = event.currentTarget.id; // Obtenemos el ID del botón clicado

  listaPokemon.empty(); // Vaciamos la lista de Pokémon antes de agregar nuevos resultados

  for (let i = 1; i <= 200; i++) {
    $.ajax({
      url: url + i,
      dataType: "json",
      success: function (data) {
        if (botonId === "ver-todos") {
          mostrarPokemon(data);
        } else {
          const tipos = data.types.map((type) => type.type.name);
          if (tipos.some((tipo) => tipo.includes(botonId))) {
            mostrarPokemon(data);
          }
        }
      },
      error: function () {
        // Manejar errores aquí si es necesario
      },
    });
  }
});
