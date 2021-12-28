$(() => {
  let coinArr = [];
  let favCoins = [];
  let newFav;
  let inputid;
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
  function displayCoins() {
    if ($(".cSearch").val() === "") {
      for (const token of coinArr) {
        $(".main").append(`<div class="cBox">
   
      <h1 class="cName">${token.name}</h1>
      <p class="cSym">${token.symbol.toUpperCase()}</p>
     
      <input type="checkbox"  id="${token.name}" class="cToggle">
      <button class="cInfo">More Information</button>
      <div class="cBoxMore">   
      <div class="loader-container">
        <div class="loader"></div>
    </div>

  </div>
      `)
      $(".loadersc").remove();
      }
    } else {
      const coinsFilter = coinArr.filter(
        (token) => token.symbol === $(".cSearch").val().toLowerCase()
      );

      for (const token of coinsFilter) {
        $(".main").append(`<div class="cBox">
 
    <h1 class="cName">${token.name}</h1>
    <p class="cSym">${token.symbol.toUpperCase()}</p>
   
    <input type="checkbox" id="${token.name}" class="cToggle">
    <button class="cInfo">More Information</button>
    <div class="cBoxMore"> 
    <div class="loader-container">
    <div class="loader"></div>
</div>
</div>
   
</div>
    `);
      }
    }
    $(".cInfo").click(function () {
      $(this).next().slideToggle();
      $.get(
        `https://api.coingecko.com/api/v3/coins/
    `,
        (coins) => {
          const moreInfo = coins.filter(
            (token) => token.name === $(this).siblings(".cName").text()
          );
          $(this).next().html(` <img src="${
            moreInfo[0].image.large
          }" class="cIMG">
      <p style="font-weight:bold">${parseFloat(
        moreInfo[0].market_data.current_price.usd
      )}$</p>
      <p>${parseFloat(moreInfo[0].market_data.current_price.eur)}€</p>
      <p>${parseFloat(moreInfo[0].market_data.current_price.ils)}₪</p>
      `);
        }
      );
    });
    $(".cToggle").change(function () {
      inputid=($(this).attr('id'));
      console.log(inputid);
      if (favCoins.length < 5 || !this.checked) {
        if (this.checked) {
          favCoins.push($(this).prev().prev().text());
          localStorage.setItem("Favorites", favCoins);
          console.log(favCoins);
        } else {
          let indexFav = favCoins.indexOf($(this).prev().prev().text());
          favCoins.splice(indexFav, 1);
          localStorage.setItem("Favorites", favCoins);
          console.log(favCoins);
        }
      } else {
        newFav = $(this).prev().prev().text();
        $("body").append(`
        
        <div class="popDiv">
        <p>Delete One From The List To Continue</p>
        <h1 class="popH">You Reached The Max Cap Of Favorites:</h1>
      
      </div>
      <div class="blackbg"></div>
      `);
        $(".blackbg").css("background-color", "black");
      }
      function favC() {
        for (const favCoin of favCoins) {
          $(".popDiv").append(`<div id="favdata">
    <h3 class="popCoin">${favCoin}</h3>
    <button class="popCdel"> 🗑 </button>
    </div>
    `);
        }
      }
      favC();
      $(".popCdel").click(function dltCoin() {
        let indexFav = favCoins.indexOf($(this).prev().text());
        favCoins.splice(indexFav, 1);
        favCoins.push(newFav);
        localStorage.setItem("Favorites", favCoins);
        console.log(favCoins);
        $(".popDiv").remove();
        $(".blackbg").remove();
        checkbox($(this).prev().text());
      });
    });
  }
  function checkbox(e) {
    console.log(favCoins);
    for (const coin of favCoins) {
      if (e === coin) {
        $(`#${e}`).prop("checked", true);
      } else {
        console.log($(`#${e}`));
        $(`#${e}`).prop("checked", false);
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
  <h3>Basically the site is writen with : Html, Css, Jquery.</h3>
  <h3>This Project is about the Crypto World, It's shows you the coin prices per 3 currncies (USD,EUR,ILS).</h3>
  <h3>You can add up to 5 coins to your favorites, The coins that selected to your favorites will be displayed ...</h3>
  <h3>at the "Live Stats" section where you can watch live statistic about your favorites coins.</h3>
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
