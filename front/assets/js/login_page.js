export default function loginPage() {
  let img = new Image()
  img.onload = () => {
    $('body').addClass('largebg')
  }
  img.src = require('../img/snow.jpg');
}
