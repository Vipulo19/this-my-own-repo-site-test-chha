const products = [
    // Dairy
    {
        id: 'dairy-1',
        name: 'A2 Cow Milk',
        price: 70,
        unit: 'Litre',
        image: 'assets/images/milk.png',
        category: 'dairy',
        description: 'Pure, nutrient-rich A2 milk from free-range, grass-fed cows. Delivered fresh every morning within hours of milking.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-2',
        name: 'Buffalo Milk',
        price: 80,
        unit: 'Litre',
        image: 'assets/images/milk.png',
        category: 'dairy',
        description: 'Rich and creamy buffalo milk with high fat content, perfect for making curd, ghee, and traditional sweets.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-3',
        name: 'Goat Milk',
        price: 120,
        unit: 'Litre',
        image: 'assets/images/milk.png',
        category: 'dairy',
        description: 'Naturally homogenized and easy-to-digest goat milk. Known for its therapeutic properties and high mineral content.',
        stock: 'Limited'
    },
    {
        id: 'dairy-4',
        name: 'Full Cream Milk',
        price: 65,
        unit: 'Litre',
        image: 'assets/images/milk.png',
        category: 'dairy',
        description: 'Thick and delicious full cream milk, pasteurized to retain freshness while ensuring safety.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-5',
        name: 'Toned Milk',
        price: 55,
        unit: 'Litre',
        image: 'assets/images/milk.png',
        category: 'dairy',
        description: 'Light and healthy toned milk, perfect for daily consumption and weight conscious individuals.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-6',
        name: 'Fresh Paneer',
        price: 320,
        unit: 'kg',
        image: 'assets/images/paneer.png',
        category: 'dairy',
        description: 'Soft, fresh paneer made from pure buffalo milk. Ideal for curries and starters.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-7',
        name: 'Malai Paneer',
        price: 380,
        unit: 'kg',
        image: 'assets/images/paneer.png',
        category: 'dairy',
        description: 'Melt-in-the-mouth malai paneer with extra creaminess. A premium choice for special texture.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-8',
        name: 'Desi Ghee',
        price: 900,
        unit: 'Litre',
        image: 'assets/images/ghee.png',
        category: 'dairy',
        description: 'Traditional Bilona method ghee made from A2 cow milk curd. Golden, grainy, and aromatic.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-9',
        name: 'Buffalo Ghee',
        price: 850,
        unit: 'Litre',
        image: 'assets/images/ghee.png',
        category: 'dairy',
        description: 'Pure white buffalo ghee with a rich aroma and high smoke point, excellent for Indian cooking.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-10',
        name: 'Curd (Dahi)',
        price: 80,
        unit: 'kg',
        image: 'assets/images/curd.png',
        category: 'dairy',
        description: 'Thick, set curd with a perfect balance of sweet and sour. Probiotic-rich and cooling.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-11',
        name: 'Buttermilk (Chhaas)',
        price: 30,
        unit: 'Litre',
        image: 'assets/images/buttermilk.png',
        category: 'dairy',
        description: 'Refreshing spiced buttermilk with cumin and coriander. The perfect digestive after meals.',
        stock: 'In Stock'
    },

    // Vegetables
    {
        id: 'veg-1',
        name: 'Tomatoes (Desi)',
        price: 40,
        unit: 'kg',
        image: 'assets/images/fresh-tomatoes.png',
        category: 'vegetables',
        description: 'Locally grown Desi tomatoes, known for their tangy flavor and thin skin. Farm fresh.',
        stock: 'In Stock'
    },
    {
        id: 'veg-2',
        name: 'Potatoes (New)',
        price: 30,
        unit: 'kg',
        image: 'assets/images/fresh-potatoes.png',
        category: 'vegetables',
        description: 'Fresh harvest cold-storage free potatoes. Firm texture and great taste.',
        stock: 'In Stock'
    },
    {
        id: 'veg-3',
        name: 'Onions',
        price: 35,
        unit: 'kg',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Medium sized red onions with a sharp pungency. Essential for every Indian kitchen.',
        stock: 'In Stock'
    },
    {
        id: 'veg-4',
        name: 'Spinach (Palak)',
        price: 20,
        unit: 'bunch',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Tender, dark green spinach leaves rooted in organic soil. Iron-rich and pesticide-free.',
        stock: 'In Stock'
    },
    {
        id: 'veg-5',
        name: 'Coriander (Dhaniya)',
        price: 20,
        unit: 'bunch',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Aromatic fresh coriander with roots. Adds life to any dish.',
        stock: 'In Stock'
    },
    {
        id: 'veg-6',
        name: 'Mint Leaves (Pudina)',
        price: 15,
        unit: 'bunch',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Freshly harvested mint sprigs with intense fragrance. Perfect for chutneys and mojitos.',
        stock: 'In Stock'
    },

    // Special Combos
    {
        id: 'special-1',
        name: 'Weekly Essentials Box',
        price: 650,
        unit: 'week',
        image: 'assets/images/milk-box.png', // Placeholder or use generically
        category: 'special',
        description: 'A curated weekly supply including 1L Milk (daily x 7), 250g Paneer, and a 1kg Seasonal Vegetable Mix.',
        stock: 'In Stock'
    },
    {
        id: 'special-2',
        name: 'Festive Dairy Pack',
        price: 950,
        unit: 'pack',
        image: 'assets/images/ghee.png',
        category: 'special',
        description: 'Premium festive selection: 500ml Desi Ghee, 500g Fresh Paneer, 2L Milk, and 200g White Butter.',
        stock: 'Limited'
    },
    {
        id: 'special-3',
        name: 'Green Goodness Box',
        price: 350,
        unit: 'box',
        image: 'assets/images/vegetables.png',
        category: 'special',
        description: 'Organic boost for your week: Selection of 5 seasonal vegetables plus a bundle of fresh herbs.',
        stock: 'In Stock'
    },
    {
        id: 'special-4',
        name: 'Family Combo',
        price: 750,
        unit: 'combo',
        image: 'assets/images/milk.png',
        category: 'special',
        description: 'Perfect for families: 2L Milk, 500g Paneer, 1kg Seasonal Veggies, and 250ml Ghee.',
        stock: 'In Stock'
    },
    // New Additions
    {
        id: 'veg-7',
        name: 'Sweet Corn',
        price: 35,
        unit: 'pack',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Fresh, juicy sweet corn kernels. Perfect for boiling, roasting, or adding to salads.',
        stock: 'In Stock'
    },
    {
        id: 'veg-8',
        name: 'Green Peas',
        price: 60,
        unit: 'kg',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Seasonal fresh green peas, sweet and tender. Shell them for curries or snacks.',
        stock: 'Limited'
    },
    {
        id: 'veg-9',
        name: 'Carrots (Red)',
        price: 45,
        unit: 'kg',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Winter special red carrots (Gajar). Sweet, crunchy, and ideal for Halwa.',
        stock: 'In Stock'
    },
    {
        id: 'veg-10',
        name: 'Cauliflower',
        price: 40,
        unit: 'piece',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Farm-fresh white cauliflower with tight florets. Checked for quality.',
        stock: 'In Stock'
    },
    {
        id: 'veg-11',
        name: 'Ginger (Adrak)',
        price: 80,
        unit: '250g',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Fresh ginger root with strong flavor. Essential for tea and cooking.',
        stock: 'In Stock'
    },
    {
        id: 'veg-12',
        name: 'Garlic (Lasan)',
        price: 120,
        unit: '250g',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Dried garlic bulbs with intense aroma and pungency.',
        stock: 'In Stock'
    },
    {
        id: 'veg-13',
        name: 'Lemon (Limbu)',
        price: 10,
        unit: 'piece',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Juicy yellow lemons full of Vitamin C.',
        stock: 'In Stock'
    },
    {
        id: 'veg-14',
        name: 'Green Chili',
        price: 20,
        unit: '100g',
        image: 'assets/images/vegetables.png',
        category: 'vegetables',
        description: 'Spicy Indian green chilies to add heat to your meals.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-12',
        name: 'Shrikhand (Kesar)',
        price: 150,
        unit: '500g',
        image: 'assets/images/curd.png',
        category: 'dairy',
        description: 'Traditional Gujarati sweet made from hung curd and saffron. Rich and creamy.',
        stock: 'In Stock'
    },
    {
        id: 'dairy-13',
        name: 'Basundi',
        price: 200,
        unit: '500ml',
        image: 'assets/images/milk.png',
        category: 'dairy',
        description: 'Thickened sweetened milk with nuts and cardamom. A festive delight.',
        stock: 'Limited'
    }
];

// Helper to find product by ID (or fuzzy match by name if needed for legacy links)
function getProductById(id) {
    return products.find(p => p.id === id);
}

function getProductByName(name) {
    return products.find(p => p.name === name);
}

function getRelatedProducts(category, currentId) {
    return products.filter(p => p.category === category && p.id !== currentId).slice(0, 4);
}
