let coinArr = [];
let currecy = [];
let favCoins = [];
let rev = 0;
function coinsP() {
  $.get(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100
  `,
    (coins) => {
      console.log(coins);
      coinArr = coins;
      displayCoins();
    }
  );
}
function displayCoins() {
  const coinsFilter = coinArr.filter((token) =>
    token.symbol.includes($(".cSearch").val().toLowerCase())
  );

  for (const token of coinsFilter) {
    $(".main").append(`<div class="cBox">
 
    <h1 class="cName">${token.name}</h1>
    <p class="cSym">${token.symbol.toUpperCase()}</p>
   
    <input type="checkbox" class="cToggle">
    <button class="cInfo">More Information</button>
    <div class="cBoxMore">   
    <img src="${token.image}" class="cIMG">
    <p style="font-weight:bold">${parseFloat(token.current_price).toFixed(
      5
    )}$</p>
    <p>${parseFloat(token.current_price * currecy.USDEUR).toFixed(5)}€</p>
    <p>${parseFloat(token.current_price * currecy.USDILS).toFixed(5)}₪</p>
    </div>
</div>
    `);
  }
  $(".cInfo").click(function  () {
    $(this).next().slideToggle();
    if(rev === 0){
    $(".main").height( $(".main").height()+40);
    rev++;
  }
  else{
    $(".main").height( $(".main").height()-40);
    rev = 0;
  }
  });
  $(".cToggle").click(function () {
    if(favCoins.length < 5){
    if (this.checked) {
      console.log($(this).prev().prev().text());
      
      favCoins.push($(this).prev().prev().text());
      console.log(favCoins);
    } else {
      favCoins.splice($(this).prev().prev().text().indexOf(), 1);
      console.log(favCoins);
    }
  }
  else{
    $(".cToggle").prop("disabled", true);
  }
  });
}
$(".about").click(function () {
  $(".main").html("");
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
function Fixer() {
  $.get(
    `http://api.currencylayer.com/live?access_key=03cffa3d589b534c9e6b49de12678fd5&format=1`,
    (eurTo) => {
      console.log(eurTo);
      currecy = eurTo.quotes;
    }
  );
}
Fixer();
