// server/src/data/seedProducts.js
// Initial seed data containing 8 realistic e-commerce products

const seedProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 349.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Industry-leading noise canceling headphones with dual processors, 8 microphones, and up to 30 hours of battery life.',
    stock: 15,
  },
  {
    name: 'Apple Watch Series 9 GPS',
    price: 399.0,
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    description: 'Advanced health monitoring, bright always-on Retina display, and intuitive Double Tap gesture controls.',
    stock: 12,
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    price: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    description: 'Ergonomic performance mouse with ultra-quiet clicks, 8K DPI sensor, and MagSpeed electromagnetic scrolling.',
    stock: 25,
  },
  {
    name: 'Keychron K2 Mechanical Keyboard',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: 'Compact 75% layout wireless mechanical keyboard with RGB backlighting and durable tactile switches.',
    stock: 18,
  },
  {
    name: 'JBL Flip 6 Waterproof Bluetooth Speaker',
    price: 119.95,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    description: 'Powerful 2-way speaker system delivering crystal-clear sound, IP67 dust/water resistance, and 12-hour playtime.',
    stock: 30,
  },
  {
    name: 'Dell UltraSharp 27" 4K USB-C Monitor',
    price: 489.99,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    description: 'Brilliant 4K UHD display with IPS Black technology, wide color coverage, and 90W single-cable power delivery.',
    stock: 8,
  },
  {
    name: 'Anker PowerCore 20,000mAh Power Bank',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1609592426508-4107297e6e5d?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-compact high-capacity portable charger with twin USB ports and PowerIQ high-speed charging.',
    stock: 40,
  },
  {
    name: 'Peak Design Everyday Backpack 20L',
    price: 279.95,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'Iconic, award-winning backpack engineered for gear access, modular organization, and all-weather protection.',
    stock: 10,
  },
];

export default seedProducts;

