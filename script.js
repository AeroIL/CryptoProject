$(() => {
  let coinArr = [];
  let favCoins = !localStorage.Favorites
    ? []
    : JSON.parse(localStorage.Favorites);
  let CoinsInfo = !localStorage.Info ? {} : JSON.parse(localStorage.Info);

  let newFav;
  function coinsP() {
    $.get(
      `https://api.coingecko.com/api/v3/coins/
  `,
      (coins) => {
        console.log(coins);
        coinArr = coins;
        displayCoins();
      }
    );
  }
  function localStorageset(name, usd, ils, eur, img) {
    CoinsInfo[name] = {
      usd,
      ils,
      eur,
      img,
      Time: Date.now(),
    };
    localStorage.setItem("Info", JSON.stringify(CoinsInfo));
  }

  function displayCoins() {
    if ($(".cSearch").val() === "") {
      for (const token of coinArr) {
        $(".main").append(`<div class="cBox">
   
      <h1 class="cName">${token.name}</h1>
      <p class="cSym">${token.symbol.toUpperCase()}</p>
     <input type="checkbox" id="${token.name
       .toLowerCase()
       .replaceAll(" ", "")
       .replaceAll(".", "_")}" class="cToggle">
      
      <button id="${token.id}" class="cInfo">More Information</button>
      <div class="cBoxMore">   
      <div class="loader-container">
        <div class="loader"></div>
    </div>

  </div>
      `);
        $(".loadersc").remove();
        checkbox(
          token.name.toLowerCase().replaceAll(" ", "").replaceAll(".", "_")
        );
      }
    } else {
      const coinsFilter = coinArr.filter(
        (token) => token.symbol === $(".cSearch").val().toLowerCase()
      );

      for (const token of coinsFilter) {
        if ($(".cSearch").val().toLowerCase() === token.symbol) {
          $(".main").append(`<div class="cBox">
 
    <h1 class="cName">${token.name}</h1>
    <p class="cSym">${token.symbol.toUpperCase()}</p>
   
    <input type="checkbox" id="${token.name
      .toLowerCase()
      .replaceAll(" ", "")
      .replaceAll(".", "_")}" class="cToggle">
    <button id="${token.id}" class="cInfo">More Information</button>
    <div class="cBoxMore"> 
    <div class="loader-container">
    <div class="loader"></div>
</div>
</div>
   
</div>
    `);
          checkbox(
            token.name.toLowerCase().replaceAll(" ", "").replaceAll(".", "_")
          );
        } else {
          $(".main").html(`
    <h1 class="e404">Try again...</h1>
    `);
        }
      }
    }
    $(".cInfo").click(function () {
      let coinID = $(this).attr("id")
      console.log(coinID)
      $(this).next().slideToggle();
      if (
        CoinsInfo[$(this).siblings(".cName").text()] &&
        Date.now() - CoinsInfo[$(this).siblings(".cName").text()].Time < 120000
      ) {
        $(this).next().html(` <img src="${
          CoinsInfo[$(this).siblings(".cName").text()].img
        }" class="cIMG">
    <p style="font-weight:bold">${parseFloat(
      CoinsInfo[$(this).siblings(".cName").text()].usd
    )}$</p>
    <p>${parseFloat(CoinsInfo[$(this).siblings(".cName").text()].eur)}€</p>
    <p>${parseFloat(CoinsInfo[$(this).siblings(".cName").text()].ils)}₪</p>
    `);
      } else {
        $.get(
          `https://api.coingecko.com/api/v3/coins/${coinID}
      `,
          (coin) => {
            let coinName = $(this).siblings(".cName").text();
            let usdPrice = coin.market_data.current_price.usd;
            let nisPrice = coin.market_data.current_price.ils;
            let eurPrice = coin.market_data.current_price.eur;
            let imgInfo = coin.image.large;
            localStorageset(coinName, usdPrice, nisPrice, eurPrice, imgInfo);

            $(this).next().html(` <img src="${
              coin.image.large
            }" class="cIMG">
        <p style="font-weight:bold">${parseFloat(
          coin.market_data.current_price.usd
        )}$</p>
        <p>${parseFloat(coin.market_data.current_price.eur)}€</p>
        <p>${parseFloat(coin.market_data.current_price.ils)}₪</p>
        `);
          }
        );
      }
    });

    $(".cToggle").change(function () {
      if (favCoins.length < 5 || !$(this).prop("checked")) {
        if ($(this).prop("checked")) {
          
          favCoins.push($(this)
          .prev()
          .prev()
          .text()
          .toLowerCase()
          .replaceAll(" ", "")
          .replaceAll(".", "_"));
          console.log(favCoins);
          localStorage.setItem("Favorites", JSON.stringify(favCoins));
          console.log(favCoins);
        } else {
          let indexFav = favCoins.indexOf($(this)
          .prev()
          .prev()
          .text()
          .toLowerCase()
          .replaceAll(" ", "")
          .replaceAll(".", "_"));
          favCoins.splice(indexFav, 1);

          localStorage.setItem("Favorites", JSON.stringify(favCoins));
        }
      } else {
        newFav = $(this)
          .prev()
          .prev()
          .text()
          .toLowerCase()
          .replaceAll(" ", "")
          .replaceAll(".", "_");
        $("body").append(`
        
        <div class="popDiv">
        <p>Delete One From The List To Continue</p>
        <h1 class="popH">You Reached The Max Cap Of Favorites:</h1>
      
      </div>
      <div class="blackbg"></div>
      `);
        $(".blackbg").css("background-color", "black");
        favC();
      }
      function favC() {
        for (const favCoin of favCoins) {
          $(".popDiv").append(`<div id="favdata">
    <h3 class="popCoin">${
      favCoin.charAt(0).toUpperCase() + favCoin.slice(1)
    }</h3>
    <button class="popCdel"> 🗑 </button>
    </div>
    `);
        }
      }

      $(".popCdel").click(function dltCoin() {
        let indexFav = favCoins.indexOf($(this).prev().text().toLowerCase());
        favCoins.splice(indexFav, 1);
        favCoins.push(
          newFav.toLowerCase().replaceAll(" ", "").replaceAll(".", "_")
        );
        localStorage.setItem("Favorites", JSON.stringify(favCoins));
        console.log(favCoins);
        $(".popDiv").remove();
        $(".blackbg").remove();
        $(".main").html("");
        displayCoins();
      });
    });
  }
  console.log(favCoins);
  function checkbox(e) {
    for (const coin of favCoins) {
      console.log(coin === e);
      if (coin === e) {
        $(`#${e}`).prop("checked", true);
      } else {
        // $(`#${e}`).removeAttr('checked');
      }
    }
  }

  $(".about").click(function () {
    $(".main").html("");
    $(".main").append(`
  <div class="imgPos">
  <img src="/profile.jpeg"></img>
  </div>
  <div class="aboutDiv">
  <h1>Michel Gomon ,23 ,From Lod,Israel.</h1>
  <h3>Basically the site is writen with : Html, Css, Jquery.
  This Project is about the Crypto World, It's shows you the coin prices per 3 currncies (USD,EUR,ILS).
  You can add up to 5 coins to your favorites, The coins that selected to your favorites will be displayed ...
  with a yellow star,When you want to look for more information it will update every 2 minutes,when you press the button the data will store in the localstorage </h3>
  </div>
  `);
  });
  $(".home").click(function () {
    $(".main").html("");
    coinsP();
  });
  coinsP();
  $(".cSearch").keyup(function () {
    $(".main").html("");
    displayCoins();
  });
});
