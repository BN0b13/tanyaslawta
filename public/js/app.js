class Pet {
  constructor(name, pic, bio, species) {
    this.name = name;
    this.pic = pic;
    this.bio = bio;
    this.species = species;
    this.status = false;
  }
}

const cash = new Pet('Cash', new Image().src = '../img/cash.jpg', 'While Cash loves his outside time, he mainly prefers being bundled up warmly so he can nap the day away. Please tell him he is a good boy!', 'Dog');
const momo = new Pet('Momo', new Image().src = '../img/momo.jpg', 'Guillermo is a little crazer cat. He bounces with the energy of 10 devils. Watch out!! He is zooming right behind you!', 'Cat');
const chomp = new Pet('Chomp', new Image().src = '../img/chomp.jpg', 'Chomper screams like a siren at 3 in the morning.', 'Cat');
const taco = new Pet('Taco', new Image().src = '../img/taco.jpg', 'R.I.P. our little angel. Taco was the best cat in the world. She is missed every day.', 'Cat');
const curProName = document.getElementById('currentPetName');
const curProPic = document.getElementById('currentProfilePic');
const curProBio = document.getElementById('currentProfileBio');
const animalLineUp = document.getElementById('animalLineUp');

function petProfileBuilder(profile) {
  let curPet = profile;
  curProName.innerHTML = `<h1>${curPet.name}</h1>`;
  curProPic.innerHTML = `<img src="${curPet.pic}" width="300" height="300">`;
  curProBio.innerHTML = `<p>${curPet.bio}</p>`;
}

animalLineUp.addEventListener('click', function(e) {
  if(e.target.parentElement.id == 'cashProfile') {
    petProfileBuilder(cash);
  } else if(e.target.parentElement.id == 'momoProfile') {
    petProfileBuilder(momo);
  } else if(e.target.parentElement.id == 'chompProfile') {
    petProfileBuilder(chomp);
  } else if(e.target.parentElement.id == 'tacoProfile') {
    petProfileBuilder(taco);
  } else {
    console.log('no profile selected');
  }
})

petProfileBuilder(cash);