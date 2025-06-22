const app = document.getElementById('app')

const BASE_URL = `https://game-reviews-server.onrender.com`

// function to fetch data
async function fetchReviews() {
  const res = await fetch(`${BASE_URL}/gameReviews`)
  const reviews = await res.json()
  return reviews
}

// function top get likes of an id
async function fetchLikes(id) {   
  const res = await fetch(`${BASE_URL}/likes?id=${id}`)
  const likes = await res.json()
  return likes
}

// display
async function displayReviews() {
  const reviews = await fetchReviews()
  app.innerHTML=''
  reviews.forEach((review) => {
    const div = document.createElement('div')
    div.className = 'card'
    const h3 = document.createElement('h3')
    h3.className = 'gameTitle'
    const p1 = document.createElement('p')
    p1.className = 'reviewer'
    const p2 = document.createElement('p')
    p2.className = 'review'
    const p3 = document.createElement('p')
    if (review.rating < 5){
      p3.className = 'rating low card-rating-sizing'
    } else if (review.rating <= 7.9){
      p3.className = 'rating med card-rating-sizing'
    } else if (review.rating <= 9.9){
      p3.className = 'rating high card-rating-sizing'
    } else {
      p3.className = 'rating perfect'
    }
    
    // create like button
    const btn = document.createElement('button')
    btn.className = 'like'
    btn.value = `${review.id}`
    // btn.innerHTML = `<input name="id" value=${review.id} type="hidden">`

    let likeStatus = false;

    btn.addEventListener('click', async (event) => {
      // get id 
      const id = btn.value
      // get likes of review with that id
      const likes = await fetchLikes(id)
      // console.log(likes[0].likes)
      if (likeStatus == false){
        btn.style.backgroundImage = `url('../images/red-heart.png')`;
        likeStatus = true
        // update likes
        likes[0].likes += 1
        // TODO send updated likeValue to server
        updateLikes(likes[0])
      } else if (likeStatus == true){
          btn.style.backgroundImage = `url('../images/white-heart.png')`;
          likeStatus = false
          // update likes
          likes[0].likes -= 1
          // TODO send updated likeValue to server
          updateLikes(likes[0])
      } 
      
    })
    div.append(h3, p1, p2, p3, btn)

    h3.innerText = review.game
    p1.innerText = `By ${review.name}`
    p2.innerText = review.review
    p3.innerText = review.rating

    app.appendChild(div)
  })
}

displayReviews()

// update likes function
async function updateLikes(likes) {
  try {
    const res = await fetch(`${BASE_URL}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(likes)
    })
    if(!res.ok){
      throw new error("HTTP error");
    }
  } catch(error){
      console.log(error);
  } 
  console.log(likes)
}

// get form data
const form = document.getElementById('form')

// add eventlistener to form
form.addEventListener('submit', async (event) => {
  // prevent default submit
  event.preventDefault()

  // get form data
  const formData = new FormData(form)
  
  // turn into normal object
  const gameData = Object.fromEntries(formData)

  // form validation
  if (!gameData.name || !gameData.game || !gameData.review || !gameData.rating){
    errorModal.showModal();
    return;
  }

  // send data via post
  try {
    const res = await fetch(`${BASE_URL}/gameReviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(gameData)
    })
    if(!res.ok){
      throw new error("HTTP error");
    }
    displayReviews();
    form.reset();
    modal.showModal();
  } catch(error){
      console.log(error);
      errorModal.showModal();
  }
})

// update rating value on form to reflect rating currently chosen
const slider = document.getElementById('slider');
let value = document.getElementById('ratingValue');

slider.addEventListener("input", function(event){
  value.innerText= event.target.value;
  if (event.target.value < 5){
      value.className = 'ratingDisplay low'
    } else if (event.target.value <= 7.9){
      value.className = 'ratingDisplay med'
    } else if (event.target.value <= 9.9){
      value.className = 'ratingDisplay high'
    } else {
      value.className = 'ratingDisplay perfect'
    }
})

const modal = document.getElementById('modal');
const errorModal = document.getElementById('errorModal');
const close = document.getElementById('closeModal');
document.addEventListener('click', ()=> {
  modal.close()
})
const errorClose = document.getElementById('closeError');
document.addEventListener('click', ()=> {
  errorModal.close()
})
