const form = document.querySelector(".main form");
const input = document.querySelector(".main input");
const msg = document.querySelector(".main .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "6dfca955f7feddc089eb945e37ee99e1";

// Form gönderildiğinde çalışma
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Kullanıcı girdiği veri alma
  let inputVal = input.value.trim();

  // Eğer input boşsa işlem yapma
  if (inputVal === "") {
    return;
  }

  // Eğer şehir zaten varsa listede
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
      // Eğer şehir zaten eklenmiş ise uyarı ver
      msg.textContent = `Zaten ${inputVal} şehrinin hava durumunu biliyorsunuz.`;
      form.reset();
      input.focus();
      return;
    }
  }

  // Apiden bilgi almak için istek yap
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
      const icon = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;

      // Yeni bir liste oluştur ve bilgileri getir
      const li = document.createElement("li");
      li.classList.add("city");

      const markup = `
                <h2 class="city-name" data-name="${name},${sys.country}">
                    <span>${name}</span>
                    <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(
                  main.temp
                )}<sup>C</sup></div>
                <figure>
                    <img class="city-icon" src="${icon}" alt="${
        weather[0].description
      }"/>
                    <figcaption>${weather[0].description}</figcaption>
                </figure>
            `;

      li.innerHTML = markup;
      list.appendChild(li);

      // Hata mesajını temizle
      msg.textContent = "";

      // Formu sıfırla ve giriş kutusuna odaklan
      form.reset();
      input.focus();
    })
    .catch((error) => {
      // Hata durumunda hata mesajını göster
      msg.textContent = error.message;
    });
});
