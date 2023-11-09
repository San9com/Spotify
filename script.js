// change color for the albulms on search page

document.addEventListener("DOMContentLoaded", function () {
  // Get all elements with the class 'genre'
  var elements = document.querySelectorAll("genres");
  var usedColors = [];

  // Loop through each element and set a unique random background color
  elements.forEach(function (element) {
    var randomColor = getRandomUniqueColor();
    element.style.backgroundColor = randomColor;
    usedColors.push(randomColor);
  });

  // Function to generate a random color that hasn't been used
  function getRandomUniqueColor() {
    var letters = "0123456789ABCDEF";
    var color;
    do {
      color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 35)];
      }
    } while (usedColors.includes(color)); // Ensure the color is unique
    return color;
  }
});
