// Static perfume data
const perfumes = [
  {
    id: '1',
    name: 'Midnight Elegance',
    price: 299,
    category: 'Oriental',
    gender: 'Unisex',
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'A captivating blend of amber, vanilla, and exotic spices that creates an unforgettable evening essence.',
    fragranceNotes: {
      top: ['Bergamot', 'Black Pepper', 'Pink Pepper'],
      middle: ['Rose', 'Jasmine', 'Oud'],
      base: ['Amber', 'Vanilla', 'Sandalwood']
    },
    rating: 4.8,
    reviews: 124,
    bestSeller: true
  },
  {
    id: '2',
    name: 'Garden Symphony',
    price: 249,
    category: 'Floral',
    gender: 'Women',
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Fresh and romantic floral bouquet with hints of morning dew and blooming jasmine.',
    fragranceNotes: {
      top: ['Lemon', 'Green Apple', 'Peach'],
      middle: ['Jasmine', 'Rose', 'Lily of the Valley'],
      base: ['White Musk', 'Cedar', 'Amber']
    },
    rating: 4.7,
    reviews: 89,
    bestSeller: true
  },
  {
    id: '3',
    name: 'Urban Legend',
    price: 329,
    category: 'Woody',
    gender: 'Men',
    image: 'https://buyfunoon.com/cdn/shop/files/Urban-Legend.webp?v=1741598811&width=416',
    description: 'Bold and sophisticated woody fragrance with leather and tobacco undertones.',
    fragranceNotes: {
      top: ['Grapefruit', 'Cardamom', 'Ginger'],
      middle: ['Leather', 'Tobacco', 'Geranium'],
      base: ['Cedarwood', 'Vetiver', 'Patchouli']
    },
    rating: 4.9,
    reviews: 156,
    bestSeller: true
  },
  {
    id: '4',
    name: 'Ocean Breeze',
    price: 279,
    category: 'Fresh',
    gender: 'Unisex',
    image: 'https://afragrancestory.in/cdn/shop/files/SB_Creative.jpg?v=1721113745&width=416',
    description: 'Crisp and invigorating aquatic scent that captures the essence of ocean waves.',
    fragranceNotes: {
      top: ['Marine Notes', 'Bergamot', 'Lemon'],
      middle: ['Sea Salt', 'Jasmine', 'Water Lily'],
      base: ['Amber', 'Musk', 'Cedar']
    },
    rating: 4.6,
    reviews: 92,
    bestSeller: false
  },
  {
    id: '5',
    name: 'Desert Rose',
    price: 349,
    category: 'Oriental',
    gender: 'Women',
    image: 'https://assets.ajio.com/medias/sys_master/root/20220328/yddr/6241d641aeb26921affb3f7e/-473Wx593H-4926683750-multi-MODEL.jpg',
    description: 'Exotic and mysterious blend of desert flowers and warm spices.',
    fragranceNotes: {
      top: ['Saffron', 'Cardamom', 'Pink Pepper'],
      middle: ['Rose', 'Oud', 'Jasmine'],
      base: ['Amber', 'Sandalwood', 'Vanilla']
    },
    rating: 4.9,
    reviews: 178,
    bestSeller: true
  },
  {
    id: '6',
    name: 'Mountain Pine',
    price: 289,
    category: 'Woody',
    gender: 'Men',
    image: 'https://johnphillips.in/cdn/shop/files/Woody_422b8adc-9dba-45d2-9d29-4d7c62b52560.jpg?v=1725011725&width=1445',
    description: 'Fresh and invigorating scent inspired by alpine forests.',
    fragranceNotes: {
      top: ['Pine', 'Cypress', 'Bergamot'],
      middle: ['Juniper', 'Fir Balsam', 'Lavender'],
      base: ['Cedar', 'Vetiver', 'Musk']
    },
    rating: 4.7,
    reviews: 145,
    bestSeller: false
  },
  {
    id: '7',
    name: 'Tropical Paradise',
    price: 269,
    category: 'Fresh',
    gender: 'Unisex',
    image: 'https://cdn.shopify.com/s/files/1/0650/5539/1970/files/Fresh.jpg?v=1718091890',
    description: 'Exotic blend of tropical fruits and flowers.',
    fragranceNotes: {
      top: ['Mango', 'Passion Fruit', 'Coconut'],
      middle: ['Plumeria', 'Tuberose', 'Jasmine'],
      base: ['Vanilla', 'Amber', 'Sandalwood']
    },
    rating: 4.5,
    reviews: 87,
    bestSeller: false
  },
  {
    id: '8',
    name: 'Royal Oud',
    price: 399,
    category: 'Oriental',
    gender: 'Men',
    image: 'https://www.themancompany.com/cdn/shop/files/OudRoyalEDP1_1024x1024.jpg?v=1726480429',
    description: 'Luxurious and sophisticated oud-based fragrance.',
    fragranceNotes: {
      top: ['Oud', 'Saffron', 'Bergamot'],
      middle: ['Rose', 'Agarwood', 'Cedar'],
      base: ['Amber', 'Musk', 'Sandalwood']
    },
    rating: 4.9,
    reviews: 234,
    bestSeller: true
  },
  {
    id: '9',
    name: 'Spring Blossom',
    price: 259,
    category: 'Floral',
    gender: 'Women',
    image: 'https://novoglow.co/cdn/shop/files/springbloomboxandbottle.jpg?v=1738134776',
    description: 'Delicate and romantic spring floral bouquet.',
    fragranceNotes: {
      top: ['Peach', 'Pear', 'Bergamot'],
      middle: ['Cherry Blossom', 'Lily of the Valley', 'Rose'],
      base: ['Musk', 'Amber', 'Vanilla']
    },
    rating: 4.6,
    reviews: 112,
    bestSeller: false
  },
  {
    id: '10',
    name: 'Citrus Burst',
    price: 239,
    category: 'Fresh',
    gender: 'Unisex',
    image: 'https://scentkart.com/cdn/shop/files/9_14524314-e802-46c1-9899-b570b062a9fc.png?v=1725881535&width=1946',
    description: 'Energizing and refreshing citrus blend.',
    fragranceNotes: {
      top: ['Lemon', 'Orange', 'Grapefruit'],
      middle: ['Lime', 'Bergamot', 'Mandarin'],
      base: ['Cedar', 'Musk', 'Amber']
    },
    rating: 4.4,
    reviews: 98,
    bestSeller: false
  },
  {
    id: '11',
    name: 'Velvet Orchid',
    price: 379,
    category: 'Oriental',
    gender: 'Women',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqH-M6i70kREdBbyf9RADzACiyLr4qR-p1pQ&s',
    description: 'Rich and sensual oriental fragrance with orchid notes.',
    fragranceNotes: {
      top: ['Bergamot', 'Mandarin', 'Honey'],
      middle: ['Orchid', 'Jasmine', 'Rose'],
      base: ['Amber', 'Vanilla', 'Sandalwood']
    },
    rating: 4.8,
    reviews: 167,
    bestSeller: true
  },
  {
    id: '12',
    name: 'Forest Mist',
    price: 299,
    category: 'Woody',
    gender: 'Unisex',
    image: 'https://i.ebayimg.com/images/g/I4cAAOSwkFtmZoth/s-l1200.jpg',
    description: 'Mysterious and ethereal forest-inspired scent.',
    fragranceNotes: {
      top: ['Cypress', 'Pine', 'Bergamot'],
      middle: ['Moss', 'Vetiver', 'Juniper'],
      base: ['Cedar', 'Amber', 'Musk']
    },
    rating: 4.7,
    reviews: 134,
    bestSeller: false
  },
  {
    id: '13',
    name: 'Golden Amber',
    price: 329,
    category: 'Oriental',
    gender: 'Unisex',
    image: 'https://gracebasket.com/4555-thickbox_default/shamamatul-amber-attar-pure-oriental-perfume-oil-unisex-long-lasting-10ml.jpg',
    description: 'Warm and inviting amber-based fragrance.',
    fragranceNotes: {
      top: ['Bergamot', 'Cardamom', 'Pink Pepper'],
      middle: ['Amber', 'Vanilla', 'Cinnamon'],
      base: ['Sandalwood', 'Musk', 'Patchouli']
    },
    rating: 4.8,
    reviews: 189,
    bestSeller: true
  },
  {
    id: '14',
    name: 'Summer Rain',
    price: 249,
    category: 'Fresh',
    gender: 'Unisex',
    image: 'https://rawspiritfragrances.com/cdn/shop/products/raw-spirits-batch4-4_1080x.jpg?v=1678300812',
    description: 'Clean and refreshing scent inspired by summer rain.',
    fragranceNotes: {
      top: ['Rain Notes', 'Green Apple', 'Lemon'],
      middle: ['Lily', 'Jasmine', 'Mint'],
      base: ['Musk', 'Amber', 'Cedar']
    },
    rating: 4.5,
    reviews: 76,
    bestSeller: false
  },
  {
    id: '15',
    name: 'Mystic Rose',
    price: 359,
    category: 'Floral',
    gender: 'Women',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWLl-ynZfbketStLRyc2OXQ1OD2AC10rmDiQ&s',
    description: 'Enchanting and mysterious rose-based fragrance.',
    fragranceNotes: {
      top: ['Rose', 'Bergamot', 'Black Currant'],
      middle: ['Jasmine', 'Lily', 'Peony'],
      base: ['Amber', 'Musk', 'Vanilla']
    },
    rating: 4.9,
    reviews: 212,
    bestSeller: true
  },
  {
    id: '16',
    name: 'Leather & Spice',
    price: 349,
    category: 'Woody',
    gender: 'Men',
    image: 'https://www.engageshop.in/cdn/shop/files/PENDO0382_1.jpg?v=1743765716&width=1445',
    description: 'Bold and sophisticated leather fragrance with spicy notes.',
    fragranceNotes: {
      top: ['Bergamot', 'Cardamom', 'Ginger'],
      middle: ['Leather', 'Tobacco', 'Cedar'],
      base: ['Vetiver', 'Amber', 'Musk']
    },
    rating: 4.8,
    reviews: 178,
    bestSeller: true
  },
  {
    id: '17',
    name: 'Vanilla Dream',
    price: 279,
    category: 'Oriental',
    gender: 'Unisex',
    image: 'https://orientaldream.b-cdn.net/6174-medium_default/fragrance-world-vanilla-so-sweet-edp-100ml.jpg',
    description: 'Sweet and comforting vanilla-based fragrance.',
    fragranceNotes: {
      top: ['Vanilla', 'Bergamot', 'Lemon'],
      middle: ['Jasmine', 'Rose', 'Caramel'],
      base: ['Amber', 'Musk', 'Sandalwood']
    },
    rating: 4.6,
    reviews: 145,
    bestSeller: false
  },
  {
    id: '18',
    name: 'Green Tea',
    price: 229,
    category: 'Fresh',
    gender: 'Unisex',
    image: 'https://www.perfumenetwork.in/cdn/shop/files/4Untitleddesign_de209800-6c3b-40f8-86e8-8ed39c12cfc5_2048x.png?v=1693727691',
    description: 'Light and refreshing green tea-inspired scent.',
    fragranceNotes: {
      top: ['Green Tea', 'Bergamot', 'Lemon'],
      middle: ['Jasmine', 'Mint', 'Lily'],
      base: ['Musk', 'Amber', 'Cedar']
    },
    rating: 4.4,
    reviews: 89,
    bestSeller: false
  },
  {
    id: '19',
    name: 'Dark Chocolate',
    price: 319,
    category: 'Oriental',
    gender: 'Unisex',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaE354X9-bvZtAkmHaPzeGypHp125NNpeF1Q&s',
    description: 'Rich and indulgent chocolate-based fragrance.',
    fragranceNotes: {
      top: ['Cocoa', 'Bergamot', 'Orange'],
      middle: ['Coffee', 'Vanilla', 'Caramel'],
      base: ['Amber', 'Musk', 'Sandalwood']
    },
    rating: 4.7,
    reviews: 167,
    bestSeller: true
  },
  {
    id: '20',
    name: 'Mountain Air',
    price: 269,
    category: 'Fresh',
    gender: 'Unisex',
    image: 'https://bellavitaluxury.co.in/cdn/shop/files/2_4c0904fc-c3b5-48cd-99ec-d4e17d76bce7.jpg?v=1712926663',
    description: 'Crisp and invigorating mountain air-inspired scent.',
    fragranceNotes: {
      top: ['Pine', 'Mint', 'Bergamot'],
      middle: ['Juniper', 'Lavender', 'Cypress'],
      base: ['Cedar', 'Musk', 'Amber']
    },
    rating: 4.5,
    reviews: 98,
    bestSeller: false
  }
];

export async function handler(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Handle different API routes
    const path = event.path.replace('/.netlify/functions/api', '');

    if (path === '/perfumes') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(perfumes)
      };
    }

    if (path === '/perfumes/bestsellers') {
      const bestsellers = perfumes.filter(p => p.bestSeller);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(bestsellers)
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Not Found' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
} 