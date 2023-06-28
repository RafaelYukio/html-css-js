let products;
let productsFiltered;

let page;
let itemsPerPage;

let brandOptions;
let typeOptions;
let orderOptions = [
  "Melhor Avaliado",
  "Menor Preço",
  "Maior Preço",
  "A-Z",
  "Z-A",
];

createOptionsSelect(orderOptions, "orderOptions");

// fetch("http://makeup-api.herokuapp.com/api/v1/products.json")
fetch("products.json")
  .then((res) => res.json())
  .then((res) => {
    products = res;
    productsFiltered = products;
    console.log(res);

    // Setar opções de marca
    // ...new Set para remover as strings (opções) duplicadas
    brandOptions = [...new Set(products.map((item) => item.brand))].sort();
    createOptionsSelect(brandOptions, "brandOptions");

    // Setar opções de tipo
    typeOptions = [
      ...new Set(products.map((item) => item.product_type)),
    ].sort();
    createOptionsSelect(typeOptions, "typeOptions");

    // Loop para gerar componentes de items
    renderItems(products, 0, 20);
  })
  .catch((rej) => {
    console.log(rej);
    console.log("Erro na requisição da API!");
  });

// Função para criar componente de item
function createItemComponent(id, imgSrc, title, brand, price) {
  let itemDiv = document.createElement("div");
  itemDiv.className = "item";
  itemDiv.id = id;
  itemDiv.onclick = (itemDiv) => {
    clickDetails(itemDiv);
  };

  let img = document.createElement("img");
  img.classList = "item-img";
  img.src = imgSrc;
  img.alt = "product image";
  img.onerror = () => (img.src = "onerror.png");

  itemDiv.appendChild(img);

  let itemDetailsDiv = document.createElement("div");
  itemDetailsDiv.classList = "item-details";

  let itemDetailsTitleDiv = document.createElement("div");
  itemDetailsTitleDiv.classList = "item-details-title";
  itemDetailsTitleDiv.innerHTML = title;

  let itemDetailsBottomDiv = document.createElement("div");
  itemDetailsBottomDiv.classList = "item-details-bottom";

  let itemDetailsBottomBrandDiv = document.createElement("div");
  itemDetailsBottomBrandDiv.classList = "item-details-bottom-brand";
  itemDetailsBottomBrandDiv.innerHTML = brand;

  let itemDetailsBottomPriceDiv = document.createElement("div");
  itemDetailsBottomPriceDiv.classList = "item-details-bottom-price";
  itemDetailsBottomPriceDiv.innerHTML = Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(parseFloat(price) * 5.5);

  itemDetailsBottomDiv.appendChild(itemDetailsBottomBrandDiv);
  itemDetailsBottomDiv.appendChild(itemDetailsBottomPriceDiv);

  itemDetailsDiv.appendChild(itemDetailsTitleDiv);
  itemDetailsDiv.appendChild(itemDetailsBottomDiv);

  itemDiv.appendChild(itemDetailsDiv);

  return itemDiv;
}

// Função para criar componente de item clicado
function createClickedItemComponent(
  imgSrc,
  title,
  brand,
  price,
  rating,
  category,
  type
) {
  let itemDiv = document.createElement("div");

  let img = document.createElement("img");
  img.classList = "item-img-click";
  img.src = imgSrc;
  img.alt = "product image";
  img.onerror = () => (img.src = "onerror.png");

  itemDiv.appendChild(img);

  let itemDetailsDiv = document.createElement("div");
  itemDetailsDiv.classList = "item-details-click";

  let itemDetailsTitleDiv = document.createElement("div");
  itemDetailsTitleDiv.classList = "item-details-title";
  itemDetailsTitleDiv.innerHTML = title;

  let itemDetailsBottomDiv = document.createElement("div");
  itemDetailsBottomDiv.classList = "item-details-bottom";

  let itemDetailsBottomBrandDiv = document.createElement("div");
  itemDetailsBottomBrandDiv.classList = "item-details-bottom-brand";
  itemDetailsBottomBrandDiv.innerHTML = brand;

  let itemDetailsBottomPriceDiv = document.createElement("div");
  itemDetailsBottomPriceDiv.classList = "item-details-bottom-price";
  let priceBRL = Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(parseFloat(price) * 5.5);

  itemDetailsBottomPriceDiv.innerHTML = priceBRL;

  itemDetailsBottomDiv.appendChild(itemDetailsBottomBrandDiv);
  itemDetailsBottomDiv.appendChild(itemDetailsBottomPriceDiv);

  itemDetailsDiv.appendChild(itemDetailsTitleDiv);
  itemDetailsDiv.appendChild(itemDetailsBottomDiv);

  itemDiv.appendChild(itemDetailsDiv);

  let details = [
    ["Marca", brand],
    ["Preço", priceBRL],
    ["Avaliação", rating],
    ["Categoria", category],
    ["Tipo", type],
  ];
  details.forEach((detail) => {
    let itemDetailDiv = document.createElement("div");
    itemDetailDiv.classList = "item-detail";

    let itemDescriptionP = document.createElement("p");
    itemDescriptionP.innerHTML = detail[0];

    let itemValueP = document.createElement("p");
    itemValueP.innerHTML = detail[1];

    itemDetailDiv.appendChild(itemDescriptionP);
    itemDetailDiv.appendChild(itemValueP);

    itemDetailsDiv.appendChild(itemDetailDiv);
  });

  return itemDiv;
}

function clickDetails(element) {
  let itemDiv = element.target.closest(".item");
  let clickedElementId = itemDiv.id;

  let item = productsFiltered.find(
    (item) => item.id.toString() == clickedElementId
  );

  itemDiv.innerHTML = "";
  itemDiv.appendChild(
    createClickedItemComponent(
      item.image_link,
      item.name,
      item.brand,
      item.price,
      item.rating,
      item.category,
      item.product_type
    )
  );

  let teste = createClickedItemComponent(
    item.image_link,
    item.name,
    item.brand,
    item.price,
    item.rating,
    item.category,
    item.product_type
  );

  console.log(teste.children);
}

function renderItems(items, itemStartPagination, itemEndPagination) {
  let itemsPaginated = items.slice(itemStartPagination, itemEndPagination);
  let itemsDiv = document.getElementById("items");
  itemsDiv.innerHTML = "";

  itemsPaginated.forEach((item) => {
    itemsDiv.appendChild(
      createItemComponent(
        item.id,
        item.image_link,
        item.name,
        item.brand,
        item.price
      )
    );
  });
}

// Função para adicionar opções no select
function createOptionsSelect(options, selectId) {
  options.forEach((optionSelect) => {
    let option = document.createElement("option");
    option.value = optionSelect;
    option.innerHTML = optionSelect;
    option.innerHTML = option.innerHTML.replace("_", " ");

    document.getElementById(selectId).appendChild(option);
  });
}

function filterByValues() {
  let selectedBrand = document.getElementById("brandOptions").value;
  let selectedType = document.getElementById("typeOptions").value;
  let selectedOrder = document.getElementById("orderOptions").value;
  let inputNome = document.getElementById("nomeInput").value;

  console.log(selectedBrand, selectedType, selectedOrder, inputNome);

  productsFiltered = [...products];

  if (selectedBrand !== "all")
    productsFiltered = products.filter((item) => item.brand == selectedBrand);

  if (selectedType !== "all")
    productsFiltered = productsFiltered.filter(
      (item) => item.product_type == selectedType
    );

  if (inputNome !== "")
    productsFiltered = productsFiltered.filter((item) =>
      item.name.toLowerCase().includes(inputNome.toLowerCase())
    );

  switch (selectedOrder) {
    case "Melhor Avaliado":
      productsFiltered = productsFiltered.sort((a, b) => b.rating - a.rating);
      break;
    case "Menor Preço":
      productsFiltered = productsFiltered.sort((a, b) => a.price - b.price);
      break;
    case "Maior Preço":
      productsFiltered = productsFiltered.sort((a, b) => b.price - a.price);
      break;
    case "A-Z":
      productsFiltered = productsFiltered.sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
      break;
    case "Z-A":
      productsFiltered = productsFiltered.sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        return nameB < nameA ? -1 : nameB > nameA ? 1 : 0;
      });
      break;
  }

  console.log(productsFiltered);

  renderItems(productsFiltered, 0, 20);
}
