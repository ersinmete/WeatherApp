const form = document.querySelector(".main form");
const input = document.querySelector(".main input");
const msg = document.querySelector(".main .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "6dfca955f7feddc089eb945e37ee99e1";

// Local Storage'dan verileri al
let savedCities = JSON.parse(localStorage.getItem("cities")) || [];

// Kaydedilmiş şehirleri ekle
savedCities.forEach((cityData) => {
  addCity(
    cityData.name,
    cityData.sys.country,
    cityData.main.temp,
    cityData.weather[0].description,
    cityData.weather[0].icon
  );
});

// Şehir ekleme fonksiyonu
function addCity(name, country, temperature, description, iconCode) {
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
  const li = document.createElement("li");
  li.classList.add("city");

  const markup = `
          <h2 class="city-name" data-name="${name},${country}">
            <span>${name}</span>
            <sup>${country}</sup>
          </h2>
          <div class="city-temp">${Math.round(temperature)}<sup>C</sup></div>
          <figure>
            <img class="city-icon" src="${iconUrl}" alt="${description}"/>
            <figcaption>${description}</figcaption>
          </figure>
        `;

  li.innerHTML = markup;
  list.appendChild(li);
}

// Local Storage'a şehir ekleme fonksiyonu
function saveToLocalStorage(cityData) {
  savedCities.push(cityData);
  localStorage.setItem("cities", JSON.stringify(savedCities));
}
function removeCity(event) {
  if (event.target.classList.contains("city")) {
    const cityName = event.target
      .querySelector(".city-name span")
      .textContent.toLowerCase();
    const cityIndex = savedCities.findIndex(
      (city) => city.name.toLowerCase() === cityName
    );
    if (cityIndex !== -1) {
      savedCities.splice(cityIndex, 1);
      localStorage.setItem("cities", JSON.stringify(savedCities));
      event.target.remove();
    }
  }
}

// Şehir listesine çift tıklama ile şehir silme özelliğini ekle
list.addEventListener("dblclick", removeCity);

// Form gönderildiğinde çalışma
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let inputVal = input.value.trim();

  if (inputVal === "") {
    return;
  }

  const listItems = list.querySelectorAll(".city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const alreadyExists = listItemsArray.some((el) => {
      let content = el
        .querySelector(".city-name span")
        .textContent.toLowerCase();
      return content === inputVal.toLowerCase();
    });

    if (alreadyExists) {
      msg.textContent = `Zaten ${inputVal} şehrinin hava durumunu biliyorsunuz.`;
      form.reset();
      input.focus();
      return;
    }
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Şehir bulunamadı!");
      }
      return response.json();
    })
    .then((data) => {
      const { main, name, sys, weather } = data;

      // Şehri local storage'a ekle
      saveToLocalStorage(data);

      addCity(
        name,
        sys.country,
        main.temp,
        weather[0].description,
        weather[0].icon
      );

      msg.textContent = "";
      form.reset();
      input.focus();
    })
    .catch((error) => {
      msg.textContent = error.message;
    });
});
