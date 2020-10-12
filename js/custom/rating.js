function getRatingImagePath(rating) {
  if (rating == 10) return 'images/5stars.png';
  if (rating == 9)  return 'images/4stars and a half.png';
  if (rating == 8)  return 'images/4stars.png';
  if (rating == 7)  return 'images/3stars and a half.png';
  if (rating == 6)  return 'images/3stars.png';
  if (rating == 5)  return 'images/2stars and a half.png';
  if (rating == 4)  return 'images/2stars.png';
  if (rating == 3)  return 'images/1star and a half.png';
  return 'images/1star.png';
}

function initialiseRatingStars(el) {
    el.src = getRatingImagePath(9);
    el['data-rating'] = 9;
    el.onmousemove = (evt) => {
        let x = evt.offsetX;
        let w = evt.target.offsetWidth;
        let rat = Math.round(10 * x / w);
        el.src = getRatingImagePath(rat);
        console.log(rat);
    };
    el.onmouseleave = (evt) => {
        el.src = getRatingImagePath(el['data-rating']);
    }
    el.onclick = (evt) => {
        let x = evt.offsetX;
        let w = evt.target.offsetWidth;
        let rat = Math.round(10 * x / w);
        el['data-rating'] = rat;
    }
}

let els = document.getElementsByClassName('rating-stars');
for (let i = 0; i < els.length; i++) {
    initialiseRatingStars(els[i]);
}
