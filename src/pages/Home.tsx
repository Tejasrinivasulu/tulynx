import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Sparkles, Award, Shield, Mail } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  category: string;
  gender: string;
  fragranceNotes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const heroSlides = [
    {
      image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'Where Elegance Meets Essence',
      subtitle: 'Discover our signature collection of luxury fragrances',
      cta: 'Shop Now'
    },
    {
      image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'Timeless Sophistication',
      subtitle: 'Crafted for those who appreciate the finer things',
      cta: 'Explore Collection'
    },
    {
      image: 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'Unleash Your Signature Scent',
      subtitle: 'Find the perfect fragrance that defines you',
      cta: 'Discover More'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'Tulynx perfumes are absolutely divine! The quality and longevity are unmatched.',
      rating: 5,
      location: 'New York'
    },
    {
      name: 'Michael Chen',
      text: 'I\'ve been wearing Midnight Elegance for months now. Always get compliments!',
      rating: 5,
      location: 'Los Angeles'
    },
    {
      name: 'Emma Williams',
      text: 'The packaging is as beautiful as the fragrance itself. True luxury experience.',
      rating: 5,
      location: 'London'
    }
  ];

  const fragranceTypes = [
    { name: 'Floral', description: 'Romantic and feminine', icon: '🌸' },
    { name: 'Woody', description: 'Warm and sophisticated', icon: '🌳' },
    { name: 'Oriental', description: 'Exotic and mysterious', icon: '✨' },
    { name: 'Fresh', description: 'Clean and invigorating', icon: '🌊' }
  ];

  const whyChooseUs = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Premium Quality',
      description: 'Only the finest ingredients from around the world'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Award Winning',
      description: 'Recognized by international fragrance experts'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Eco-Friendly',
      description: 'Sustainable and cruelty-free production'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/perfumes/bestsellers');
      const data = await response.json();
      setBestSellers(data);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      alert('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <div className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div className="max-w-4xl px-4">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    {slide.subtitle}
                  </p>
                  <Link
                    to="/products"
                    className="inline-block bg-gradient-to-r from-purple-600 to-amber-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-amber-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Best Sellers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Best Sellers</h2>
            <p className="text-xl text-gray-600">Discover our most loved fragrances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fragrance Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover by Fragrance Type</h2>
            <p className="text-xl text-gray-600">Find your perfect scent family</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fragranceTypes.map((type, index) => (
              <Link
                key={index}
                to="/products"
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center group transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {type.name}
                </h3>
                <p className="text-gray-600">{type.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Tulynx</h2>
            <p className="text-xl text-gray-600">Experience the difference of true luxury</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full text-white mb-6 group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-16">What Our Customers Say</h2>

          <div className="relative overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-transform duration-500 ${
                  index === testimonialIndex ? 'translate-x-0' : 'translate-x-full absolute inset-0'
                }`}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-xl text-white mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-white/80">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="w-16 h-16 mx-auto mb-6 text-amber-400" />
          <h2 className="text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for exclusive offers and new fragrance releases
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-amber-500 px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-amber-600 transition-all duration-200 transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Home;