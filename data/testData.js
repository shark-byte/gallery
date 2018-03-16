let dataChunk = [];

let placeNames = ['Taco Bell', 'McDonalds', 'Burger King', 'Carls Jr', 'Clift San Francisco'];
let photoUrls = [
  {
    url: 'http://dy00k1db5oznd.cloudfront.net/wp-content/uploads/2014/08/burger-king-crop-640x360.jpg',
  },
  {
    url: 'http://www.adweek.com/wp-content/uploads/2017/02/burger-king-fire-hed-2017.jpg',
  },
  {
    url: 'http://www.foxnews.com/food-drink/2017/05/15/burger-king-may-soon-be-serving-alcohol-at-new-york-city-restaurant.html',
  },
  {
    url: 'https://www.peta2.com/wp-content/uploads/2016/06/vegan-burger-king.jpg',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Burger_King_Whopper_Combo.jpg',
  },
  {
    url: 'http://dy00k1db5oznd.cloudfront.net/wp-content/uploads/2014/08/burger-king-crop-640x360.jpg',
  },
  {
    url: 'http://www.adweek.com/wp-content/uploads/2017/02/burger-king-fire-hed-2017.jpg',
  },
  {
    url: 'http://www.foxnews.com/food-drink/2017/05/15/burger-king-may-soon-be-serving-alcohol-at-new-york-city-restaurant.html',
  },
  {
    url: 'https://www.peta2.com/wp-content/uploads/2016/06/vegan-burger-king.jpg',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Burger_King_Whopper_Combo.jpg',
  },
];
let reviews = [
  {
  name: 'Ernesto Carmona Jr',
  avatar: reviews[j].profile_photo_url,
},
{
  name: reviews[j].author_name,
  avatar: reviews[j].profile_photo_url,
},
{
  name: reviews[j].author_name,
  avatar: reviews[j].profile_photo_url,
},
{
  name: reviews[j].author_name,
  avatar: reviews[j].profile_photo_url,
},
{
  name: reviews[j].author_name,
  avatar: reviews[j].profile_photo_url,
},
];

function createData() {
  const startId = dataCount;
  for (let i = 0; i < 100000; i++) {
    const photos = [];
    const dataEntry = {
      place_id: (startId + i).toString(),
      place_name: placeNames[i % placeNames.length],
      photos: photoUrls,
      reviews: [],
    };
  }
}

exports.dataChunk = dataChunk;