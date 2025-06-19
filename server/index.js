import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'tulynx.perfumes@gmail.com',
    pass: process.env.EMAIL_PASS
  }
});

// Initialize Twilio client with error handling
let twilioClient;
const isDevelopment = process.env.NODE_ENV !== 'production';

try {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️ Twilio credentials not found. Running in development mode.');
    console.warn('📱 OTPs will be logged to console instead of sent via SMS.');
  } else {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio client initialized successfully');
  }
} catch (error) {
  console.error('❌ Error initializing Twilio client:', error);
}

// Store OTPs temporarily (in production, use a database)
const otpStore = new Map();

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP endpoint
app.post('/api/auth/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with 5-minute expiry
    otpStore.set(phoneNumber, {
      otp,
      expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // If Twilio is configured, send OTP via SMS
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Your Tulynx Perfumes verification code is: ${otp}. Valid for 5 minutes.`,
          to: phoneNumber,
          from: process.env.TWILIO_PHONE_NUMBER
        });
        console.log(`✅ OTP sent via SMS to ${phoneNumber}`);
      } catch (smsError) {
        console.error('❌ Error sending SMS:', smsError);
        // Continue with the response even if SMS fails
      }
    } else {
      // Log OTP to console for development
      console.log('\n📱 DEVELOPMENT MODE - OTP Details:');
      console.log('--------------------------------');
      console.log(`Phone Number: ${phoneNumber}`);
      console.log(`OTP: ${otp}`);
      console.log('--------------------------------\n');
    }

    res.json({ 
      message: 'OTP sent successfully',
      // In development, include the OTP in the response
      ...(isDevelopment && { 
        otp,
        mode: 'development',
        message: 'OTP sent successfully (Development Mode - Check console for OTP)'
      })
    });
  } catch (error) {
    console.error('❌ Error in send-otp endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to send OTP',
      details: isDevelopment ? error.message : undefined
    });
  }
});

// Verify OTP endpoint
app.post('/api/auth/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const storedData = otpStore.get(phoneNumber);

    if (!storedData) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }

    if (Date.now() > storedData.expiry) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    otpStore.delete(phoneNumber);

    // Generate session token
    const token = uuidv4();

    res.json({
      message: 'OTP verified successfully',
      token,
      phoneNumber
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  // In a real app, you might want to invalidate the token
  res.json({ message: 'Logged out successfully' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Expanded perfume data with more products
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
    price: 199,
    category: 'Fresh',
    gender: 'Unisex',
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Light and refreshing aquatic fragrance that captures the essence of sea spray.',
    fragranceNotes: {
      top: ['Sea Salt', 'Lemon', 'Mint'],
      middle: ['Marine Accord', 'Sage', 'Lavender'],
      base: ['Driftwood', 'Ambergris', 'White Musk']
    },
    rating: 4.5,
    reviews: 67,
    bestSeller: false
  },
  {
    id: '5',
    name: 'Royal Amber',
    price: 399,
    category: 'Oriental',
    gender: 'Women',
    image: 'https://fimgs.net/mdimg/secundar/fit.116142.jpg',
    description: 'Luxurious amber-based fragrance with golden warmth and regal sophistication.',
    fragranceNotes: {
      top: ['Saffron', 'Orange Blossom', 'Raspberry'],
      middle: ['Rose', 'Iris', 'Amber'],
      base: ['Oud', 'Patchouli', 'Vanilla']
    },
    rating: 4.9,
    reviews: 98,
    bestSeller: false
  },
  {
    id: '6',
    name: 'Forest Whisper',
    price: 279,
    category: 'Woody',
    gender: 'Men',
    image: 'https://godofessence.com/cdn/shop/files/whisper-of-woods-extrait-de-parfum-for-unisex-exclusive-347148.png?v=1732001245',
    description: 'Deep forest essence with pine, oak moss, and earthy undertones.',
    fragranceNotes: {
      top: ['Pine', 'Eucalyptus', 'Bergamot'],
      middle: ['Oak Moss', 'Fir Needle', 'Juniper'],
      base: ['Sandalwood', 'Cedarwood', 'Musk']
    },
    rating: 4.6,
    reviews: 73,
    bestSeller: false
  },
  {
    id: '7',
    name: 'Velvet Rose',
    price: 349,
    category: 'Floral',
    gender: 'Women',
    image: 'https://alhassan.in/cdn/shop/files/Al_Hassan-1-Photoroom.jpg?v=1746597458',
    description: 'Luxurious rose petals with velvety smooth finish and romantic allure.',
    fragranceNotes: {
      top: ['Bulgarian Rose', 'Pink Pepper', 'Mandarin'],
      middle: ['Damask Rose', 'Peony', 'Magnolia'],
      base: ['Cashmere Wood', 'Vanilla', 'White Musk']
    },
    rating: 4.8,
    reviews: 142,
    bestSeller: true
  },
  {
    id: '8',
    name: 'Citrus Burst',
    price: 189,
    category: 'Fresh',
    gender: 'Unisex',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNJCdV7VDa6sFyir07C56O0L2r4SKs7sjV0w&s',
    description: 'Energizing citrus blend that awakens the senses with vibrant freshness.',
    fragranceNotes: {
      top: ['Grapefruit', 'Lime', 'Orange'],
      middle: ['Mint', 'Green Tea', 'Basil'],
      base: ['White Cedar', 'Vetiver', 'Clean Musk']
    },
    rating: 4.4,
    reviews: 85,
    bestSeller: false
  },
  {
    id: '9',
    name: 'Mystic Oud',
    price: 459,
    category: 'Oriental',
    gender: 'Unisex',
    image: 'https://uffco.com/cdn/shop/files/UNISEX_4.png?v=1746021248&width=1946',
    description: 'Rare and precious oud wood creates an intoxicating and mysterious aura.',
    fragranceNotes: {
      top: ['Saffron', 'Rose', 'Cardamom'],
      middle: ['Oud Wood', 'Incense', 'Patchouli'],
      base: ['Amber', 'Sandalwood', 'Musk']
    },
    rating: 4.9,
    reviews: 203,
    bestSeller: true
  },
  {
    id: '10',
    name: 'Lavender Dreams',
    price: 229,
    category: 'Fresh',
    gender: 'Women',
    image: 'https://media.bodycupid.com/public/20de2494-f98f-448d-a285-71d507bd1783?f=webp',
    description: 'Calming lavender fields captured in a bottle with serene and peaceful notes.',
    fragranceNotes: {
      top: ['French Lavender', 'Bergamot', 'Lemon'],
      middle: ['Lavender Absolute', 'Geranium', 'Rosemary'],
      base: ['Vanilla', 'Tonka Bean', 'Cedar']
    },
    rating: 4.6,
    reviews: 91,
    bestSeller: false
  },
  {
    id: '11',
    name: 'Spice Market',
    price: 319,
    category: 'Oriental',
    gender: 'Men',
    image: 'https://d12d6l12s3d372.cloudfront.net/spicy_fragrances_for_men_b73832a132.jpg',
    description: 'Exotic spice bazaar adventure with warm and inviting oriental spices.',
    fragranceNotes: {
      top: ['Cinnamon', 'Nutmeg', 'Black Pepper'],
      middle: ['Clove', 'Star Anise', 'Cardamom'],
      base: ['Amber', 'Benzoin', 'Vanilla']
    },
    rating: 4.7,
    reviews: 118,
    bestSeller: false
  },
  {
    id: '12',
    name: 'White Lily',
    price: 269,
    category: 'Floral',
    gender: 'Women',
    image: 'https://fraganote.com/cdn/shop/files/WhiteFloral05.png?v=1742461316',
    description: 'Pure and elegant white lily with soft powdery finish and feminine grace.',
    fragranceNotes: {
      top: ['White Lily', 'Freesia', 'Green Leaves'],
      middle: ['Lily of the Valley', 'Iris', 'Violet'],
      base: ['White Musk', 'Powdery Notes', 'Soft Woods']
    },
    rating: 4.5,
    reviews: 76,
    bestSeller: false
  },
  {
    id: '13',
    name: 'Tobacco Leather',
    price: 389,
    category: 'Woody',
    gender: 'Men',
    image: 'https://i.ebayimg.com/images/g/vFQAAOSwfnNhyebS/s-l1200.jpg',
    description: 'Rich tobacco leaves and supple leather create a distinguished masculine scent.',
    fragranceNotes: {
      top: ['Tobacco Leaf', 'Rum', 'Cinnamon'],
      middle: ['Leather', 'Honey', 'Dried Fruits'],
      base: ['Vanilla', 'Tonka Bean', 'Amber']
    },
    rating: 4.8,
    reviews: 134,
    bestSeller: true
  },
  {
    id: '14',
    name: 'Cherry Blossom',
    price: 259,
    category: 'Floral',
    gender: 'Women',
    image: 'https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/664b400ec66ab40161d0e6e1/191133-01.jpg',
    description: 'Delicate cherry blossoms in spring breeze with soft and romantic appeal.',
    fragranceNotes: {
      top: ['Cherry Blossom', 'Pear', 'Mandarin'],
      middle: ['Sakura', 'Peach', 'Jasmine'],
      base: ['Soft Musk', 'Sandalwood', 'Vanilla']
    },
    rating: 4.6,
    reviews: 102,
    bestSeller: false
  },
  {
    id: '15',
    name: 'Aqua Marine',
    price: 219,
    category: 'Fresh',
    gender: 'Unisex',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/7/323525531/FA/TQ/OF/133918514/aqua-marint-500x500.jpg',
    description: 'Crystal clear waters and marine breeze captured in refreshing aquatic notes.',
    fragranceNotes: {
      top: ['Sea Breeze', 'Cucumber', 'Mint'],
      middle: ['Water Lily', 'Marine Notes', 'Sage'],
      base: ['Driftwood', 'Ambergris', 'Clean Musk']
    },
    rating: 4.4,
    reviews: 68,
    bestSeller: false
  },
  {
    id: '16',
    name: 'Golden Sunset',
    price: 359,
    category: 'Oriental',
    gender: 'Women',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGrdquSScqlSbB-Z4qXgzCEFPM_n5ULqpiBA&s',
    description: 'Warm golden hour captured with rich amber and exotic florals.',
    fragranceNotes: {
      top: ['Orange Blossom', 'Mandarin', 'Saffron'],
      middle: ['Ylang Ylang', 'Tuberose', 'Amber'],
      base: ['Sandalwood', 'Vanilla', 'Benzoin']
    },
    rating: 4.7,
    reviews: 156,
    bestSeller: false
  },
  {
    id: '17',
    name: 'Desert Rose',
    price: 289,
    category: 'Floral',
    gender: 'Women',
    image: 'https://m.media-amazon.com/images/I/81M1F0zAjHL.AC_UF350,350_QL80.jpg',
    description: 'A unique blend of desert flowers and exotic spices.',
    fragranceNotes: {
      top: ['Rose', 'Saffron', 'Cardamom'],
      middle: ['Jasmine', 'Oud', 'Amber'],
      base: ['Sandalwood', 'Vanilla', 'Musk']
    },
    rating: 4.7,
    reviews: 112,
    bestSeller: false
  },
  {
    id: '18',
    name: 'Mountain Air',
    price: 239,
    category: 'Fresh',
    gender: 'Unisex',
    image: 'https://i0.wp.com/deo.group/wp-content/uploads/2024/08/Fresh-Mountain-1.jpg?fit=1181%2C1181&ssl=1',
    description: 'Crisp and invigorating scent of mountain air and pine forests.',
    fragranceNotes: {
      top: ['Pine', 'Mint', 'Bergamot'],
      middle: ['Cedar', 'Fir', 'Juniper'],
      base: ['Amber', 'Musk', 'Vetiver']
    },
    rating: 4.5,
    reviews: 78,
    bestSeller: false
  }
];

// Routes
app.get('/api/perfumes', (req, res) => {
  const { category, gender, minPrice, maxPrice, search } = req.query;
  
  let filteredPerfumes = [...perfumes];
  
  if (category && category !== 'All') {
    filteredPerfumes = filteredPerfumes.filter(p => p.category === category);
  }
  
  if (gender && gender !== 'All') {
    filteredPerfumes = filteredPerfumes.filter(p => p.gender === gender);
  }
  
  if (minPrice) {
    filteredPerfumes = filteredPerfumes.filter(p => p.price >= parseInt(minPrice));
  }
  
  if (maxPrice) {
    filteredPerfumes = filteredPerfumes.filter(p => p.price <= parseInt(maxPrice));
  }
  
  if (search) {
    filteredPerfumes = filteredPerfumes.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filteredPerfumes);
});

app.get('/api/perfumes/bestsellers', (req, res) => {
  const bestSellers = perfumes.filter(p => p.bestSeller);
  res.json(bestSellers);
});

app.get('/api/perfumes/:id', (req, res) => {
  const perfume = perfumes.find(p => p.id === req.params.id);
  if (!perfume) {
    return res.status(404).json({ error: 'Perfume not found' });
  }
  res.json(perfume);
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  // In a real app, you'd save this to a database
  console.log('Newsletter signup:', email);
  res.json({ message: 'Successfully subscribed to newsletter!' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  try {
    // Email to Tulynx
    const mailOptions = {
      from: process.env.EMAIL_USER || 'tulynx.perfumes@gmail.com',
      to: 'tulynx.perfumes@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER || 'tulynx.perfumes@gmail.com',
      to: email,
      subject: 'Thank you for contacting Tulynx Perfumes',
      html: `
        <h2>Thank you for contacting Tulynx Perfumes!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <br>
        <p>Best regards,</p>
        <p>Tulynx Perfumes Team</p>
      `
    };

    await transporter.sendMail(confirmationMailOptions);

    res.json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

app.post('/api/checkout', async (req, res) => {
  const { items, customerInfo, shippingInfo, paymentInfo } = req.body;
  const orderId = uuidv4();

  try {
    const db = client.db(dbName);
    const orders = db.collection('orders');

    const orderData = {
      orderId,
      items,
      customerInfo,
      shippingInfo,
      paymentInfo,
      status: 'pending',
      createdAt: new Date()
    };

    await orders.insertOne(orderData);
    console.log('Order placed:', { orderId, items, customerInfo });
    res.json({ orderId, message: 'Order placed successfully!' });
  } catch (err) {
    console.error('Error saving order to MongoDB:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Connection URL
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const dbName = 'yourDatabaseName';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the server
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
    // You can now use the db object to interact with your database
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

connectToMongo();

// Handle all routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});