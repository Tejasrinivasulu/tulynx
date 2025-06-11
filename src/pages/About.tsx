import React from 'react';
import { Leaf, Award, Heart, Users, Target, Eye } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Passion',
      description: 'We are driven by our love for creating exceptional fragrances that tell stories and evoke emotions.'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and responsible sourcing of all our ingredients.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excellence',
      description: 'We never compromise on quality, using only the finest materials and traditional craftsmanship.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community',
      description: 'Building relationships with our customers and supporting the communities where we source our ingredients.'
    }
  ];

  const milestones = [
    { year: '2018', event: 'Tulynx founded with a vision to create luxury fragrances' },
    { year: '2019', event: 'Launched our first signature collection' },
    { year: '2020', event: 'Introduced eco-friendly packaging initiative' },
    { year: '2021', event: 'Expanded to international markets' },
    { year: '2022', event: 'Won "Best Luxury Fragrance Brand" award' },
    { year: '2023', event: 'Launched sustainable ingredient sourcing program' },
    { year: '2024', event: 'Celebrating 6 years of fragrance excellence' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Perfume Bottle Background */}
      <section 
        className="relative h-96 flex items-center justify-center text-white text-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-amber-900/80"></div>
        <div className="relative max-w-4xl px-4 z-10">
          <h1 className="text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl">
            Crafting luxury fragrances that celebrate individuality and elegance since 2018
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Where It All Began</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Tulynx was born from a simple yet powerful belief: that fragrance has the unique ability 
                  to capture memories, express personality, and transform the ordinary into the extraordinary.
                </p>
                <p>
                  Founded by master perfumer Isabella Chen in 2018, our journey began in a small atelier 
                  in the heart of Grasse, France. Drawing inspiration from travels around the world and 
                  a deep appreciation for the art of perfumery, Isabella set out to create fragrances 
                  that would speak to the soul.
                </p>
                <p>
                  Today, Tulynx represents the perfect harmony between traditional craftsmanship and 
                  modern innovation, creating scents that are both timeless and contemporary.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Perfume making process"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-amber-500/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To create exceptional fragrances that celebrate individuality and empower people to 
                express their unique identity through scent. We are committed to using only the finest 
                ingredients while maintaining ethical and sustainable practices throughout our entire 
                production process.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <Eye className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become the world's most respected luxury fragrance house, known for our innovative 
                approach to perfumery, commitment to sustainability, and dedication to creating scents 
                that inspire confidence and leave lasting impressions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full text-white mb-6 group-hover:scale-110 transition-transform duration-200">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Artisan Process</h2>
            <p className="text-xl text-purple-100">From concept to bottle, every step is crafted with care</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Inspiration</h3>
              <p className="text-purple-100">
                Each fragrance begins with inspiration drawn from nature, art, travel, and human emotion.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Creation</h3>
              <p className="text-purple-100">
                Master perfumers carefully blend premium ingredients, creating unique compositions through traditional techniques.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Perfection</h3>
              <p className="text-purple-100">
                Every fragrance undergoes extensive testing and refinement to ensure the perfect balance and longevity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Milestones in our fragrance story</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                  {milestone.year}
                </div>
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-800 leading-relaxed">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients Section with Perfume Bottle Images */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Ingredients</h2>
            <p className="text-xl text-gray-600">Sourced from the finest locations around the world</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Floral perfume bottles"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Floral Essences</h3>
              <p className="text-gray-600">
                Rare roses from Bulgaria, jasmine from Grasse, and exotic florals from around the world.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Oriental perfume bottles"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Precious Spices</h3>
              <p className="text-gray-600">
                Saffron from Kashmir, cardamom from India, and vanilla from Madagascar.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Woody perfume bottles"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Exotic Woods</h3>
              <p className="text-gray-600">
                Sandalwood from Australia, cedar from Lebanon, and oud from the Middle East.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;