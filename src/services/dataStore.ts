import {
  Vendor,
  Product,
  DeliveryZone,
  ParentOrder,
  SubOrder,
  VendorWallet,
  WalletTransaction,
  PayoutRequest,
  CommissionRule,
  AuditLog,
  ProductReview,
  UserSession,
  UserAccount,
  PlatformSettings,
  Dispute,
  HotDeal,
} from '../types';

// Initial Kenyan Vendors
export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'ven_nairobi_tech',
    name: 'Nairobi Tech Direct',
    slug: 'nairobi-tech-direct',
    ownerEmail: 'tech@nairobidirect.co.ke',
    phone: '+254701998877',
    county: 'Nairobi',
    town: 'Westlands',
    status: 'approved',
    commissionRatePercent: 6,
    customFixedFeeKes: 50,
    mpesaPayoutNumber: '+254701998877',
    bio: 'Authorized distributor of smartphones, laptops, audio gear, and gaming tech with official warranty coverage.',
    rating: 4.9,
    joinedAt: '2025-04-10T10:00:00Z',
    businessRegistrationNumber: 'BN-8829012-KE',
  },
  {
    id: 'ven_apex_appliances',
    name: 'Apex Home & Kitchen',
    slug: 'apex-home-kitchen',
    ownerEmail: 'orders@apexhome.co.ke',
    phone: '+254712889900',
    county: 'Nairobi',
    town: 'CBD',
    status: 'approved',
    commissionRatePercent: 7,
    customFixedFeeKes: 0,
    mpesaPayoutNumber: '+254712889900',
    bio: 'High-quality energy-efficient home appliances, air fryers, kitchen electronics, and cookware essentials.',
    rating: 4.8,
    joinedAt: '2025-05-15T09:00:00Z',
    businessRegistrationNumber: 'BN-7719204-KE',
  },
  {
    id: 'ven_olkaria_leather',
    name: 'Olkaria Artisan Leather',
    slug: 'olkaria-artisan-leather',
    ownerEmail: 'leather@olkaria.co.ke',
    phone: '+254712345678',
    county: 'Nairobi',
    town: 'Industrial Area',
    status: 'approved',
    commissionRatePercent: 8, // Special low rate override
    customFixedFeeKes: 50,
    mpesaPayoutNumber: '+254712345678',
    bio: 'Master artisans crafting vegetable-tanned, full-grain Kenyan cowhide luggage, travel wallets, and accessories.',
    rating: 4.9,
    joinedAt: '2025-08-15T09:00:00Z',
    businessRegistrationNumber: 'BN-8829401-KE',
  },
  {
    id: 'ven_kikomeo_attire',
    name: 'Kiko Contemporary Fashion',
    slug: 'kiko-contemporary-fashion',
    ownerEmail: 'design@kikoattire.co.ke',
    phone: '+254722998877',
    county: 'Nairobi',
    town: 'Westlands',
    status: 'approved',
    commissionRatePercent: 10,
    customFixedFeeKes: 0,
    mpesaPayoutNumber: '+254722998877',
    bio: 'Modern Afrocentric tailored apparel, Kitenge streetwear, and artisanal woven accessories inspired by Kenyan heritage.',
    rating: 4.8,
    joinedAt: '2025-09-01T11:00:00Z',
    businessRegistrationNumber: 'BN-9102844-KE',
  },
  {
    id: 'ven_mtkenya_coffee',
    name: 'Mount Kenya Highland Roasters',
    slug: 'mt-kenya-highland-roasters',
    ownerEmail: 'sales@mtkenyacoffee.co.ke',
    phone: '+254733445566',
    county: 'Nyeri',
    town: 'Nyeri Central',
    status: 'approved',
    commissionRatePercent: 12,
    customFixedFeeKes: 0,
    mpesaPayoutNumber: '+254733445566',
    bio: 'Grade AA single-origin volcanic soil arabica coffee, ethically sourced from cooperative smallholder farms in Nyeri.',
    rating: 5.0,
    joinedAt: '2025-07-20T14:30:00Z',
    businessRegistrationNumber: 'BN-7612309-KE',
  },
  {
    id: 'ven_mombasa_woodcraft',
    name: 'Swahili Coast Carvings',
    slug: 'swahili-coast-carvings',
    ownerEmail: 'info@swahilicrafts.co.ke',
    phone: '+254701239876',
    county: 'Mombasa',
    town: 'Old Town',
    status: 'approved',
    commissionRatePercent: 10,
    customFixedFeeKes: 0,
    mpesaPayoutNumber: '+254701239876',
    bio: 'Hand-carved reclaimed dhow wood mirrors, brass-inlaid jewelry chests, and coastal home accessories.',
    rating: 4.7,
    joinedAt: '2025-10-10T16:00:00Z',
    businessRegistrationNumber: 'BN-4482019-KE',
  },
  {
    id: 'ven_kazuri_beads',
    name: 'Kazuri Ceramic & Bead Studio',
    slug: 'kazuri-bead-studio',
    ownerEmail: 'craft@kazuribeads.co.ke',
    phone: '+254711223344',
    county: 'Nairobi',
    town: 'Karen',
    status: 'approved',
    commissionRatePercent: 9,
    customFixedFeeKes: 0,
    mpesaPayoutNumber: '+254711223344',
    bio: 'Hand-rolled, hand-painted ceramic beads and bespoke African jewelry empowering local women artisans.',
    rating: 4.9,
    joinedAt: '2025-06-12T10:00:00Z',
    businessRegistrationNumber: 'BN-5519820-KE',
  },
  {
    id: 'ven_riftvalley_honey',
    name: 'Rift Valley Pure Apiaries',
    slug: 'rift-valley-pure-apiaries',
    ownerEmail: 'honey@riftvalleyapiaries.co.ke',
    phone: '+254722334455',
    county: 'Nakuru',
    town: 'Naivasha',
    status: 'approved',
    commissionRatePercent: 10,
    customFixedFeeKes: 0,
    mpesaPayoutNumber: '+254722334455',
    bio: '100% raw acacia, eucalyptus, and yellow-bark woodland wildflower honey harvested from natural rift hives.',
    rating: 4.8,
    joinedAt: '2025-08-04T12:00:00Z',
    businessRegistrationNumber: 'BN-6671203-KE',
  },
  {
    id: 'ven_kitengela_glass',
    name: 'Kitengela Studio Glass',
    slug: 'kitengela-studio-glass',
    ownerEmail: 'art@kitengelaglass.co.ke',
    phone: '+254733112233',
    county: 'Kajiado',
    town: 'Kitengela',
    status: 'approved',
    commissionRatePercent: 8,
    customFixedFeeKes: 100,
    mpesaPayoutNumber: '+254733112233',
    bio: 'Mouth-blown 100% recycled glass vases, sculptural tableware, and decorative chandelier fixtures.',
    rating: 5.0,
    joinedAt: '2025-05-18T09:30:00Z',
    businessRegistrationNumber: 'BN-8801944-KE',
  },
  {
    id: 'ven_lamu_silversmiths',
    name: 'Lamu Archipelago Silversmiths',
    slug: 'lamu-silversmiths',
    ownerEmail: 'silver@lamuheritage.co.ke',
    phone: '+254700556677',
    county: 'Lamu',
    town: 'Shela Village',
    status: 'approved',
    commissionRatePercent: 10,
    customFixedFeeKes: 0,
    mpesaPayoutNumber: '+254700556677',
    bio: 'Filigree sterling silver earrings, talismanic pendulums, and antique bridal cuffs inspired by 18th-century Swahili culture.',
    rating: 4.9,
    joinedAt: '2025-07-02T15:20:00Z',
    businessRegistrationNumber: 'BN-3390182-KE',
  },
  {
    id: 'ven_kericho_tea',
    name: 'Kericho Crown Highland Teas',
    slug: 'kericho-crown-teas',
    ownerEmail: 'exports@kerichocrown.co.ke',
    phone: '+254744998811',
    county: 'Kericho',
    town: 'Kericho Town',
    status: 'approved',
    commissionRatePercent: 11,
    customFixedFeeKes: 0,
    mpesaPayoutNumber: '+254744998811',
    bio: 'Single-estate loose-leaf purple tea, orthodox gold tips, and orthodox black teas grown at 2,000m above sea level.',
    rating: 4.8,
    joinedAt: '2025-09-14T08:45:00Z',
    businessRegistrationNumber: 'BN-7718290-KE',
  },
  {
    id: 'ven_turkana_weavers',
    name: 'Turkana Heritage Palm Weavers',
    slug: 'turkana-heritage-weavers',
    ownerEmail: 'crafts@turkanatrade.co.ke',
    phone: '+254755123456',
    county: 'Turkana',
    town: 'Lodwar',
    status: 'approved',
    commissionRatePercent: 10,
    customFixedFeeKes: 0,
    mpesaPayoutNumber: '+254755123456',
    bio: 'Intricately patterned doum palm laundry baskets, geometric bolga-style market hampers, and storage vessels.',
    rating: 4.7,
    joinedAt: '2025-10-01T14:15:00Z',
    businessRegistrationNumber: 'BN-2201948-KE',
  },
  {
    id: 'ven_kisumu_pottery',
    name: 'Dunga Hillside Terracotta Studio',
    slug: 'dunga-hillside-terracotta',
    ownerEmail: 'clay@dungahill.co.ke',
    phone: '+254766789012',
    county: 'Kisumu',
    town: 'Dunga Beach',
    status: 'approved',
    commissionRatePercent: 10,
    customFixedFeeKes: 0,
    mpesaPayoutNumber: '+254766789012',
    bio: 'Natural riverbed terracotta plant urns, charcoal cooling pots, and sculptured stoneware kitchen crocks.',
    rating: 4.6,
    joinedAt: '2025-11-10T11:00:00Z',
    businessRegistrationNumber: 'BN-1192847-KE',
  },
];

// Delivery Locations & Pricing Hierarchy
export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone_nairobi_cbd_west',
    county: 'Nairobi',
    name: 'Zone 1: Nairobi Central & Westlands',
    towns: ['Westlands', 'CBD', 'Kilimani', 'Kileleshwa', 'Lavington', 'Parklands'],
    feeKes: 250,
    estimatedDeliveryHours: 'Same Day (3-6 hours)',
    isActive: true,
  },
  {
    id: 'zone_nairobi_metro',
    county: 'Nairobi',
    name: 'Zone 2: Nairobi Greater Metro & Suburbs',
    towns: ['Karen', 'Runda', 'Kasarani', 'Roysambu', 'South B', 'South C', 'Langata', 'Thika Road'],
    feeKes: 350,
    estimatedDeliveryHours: 'Next Day Morning',
    isActive: true,
  },
  {
    id: 'zone_kiambu_metro',
    county: 'Kiambu',
    name: 'Zone 3: Kiambu & Environs',
    towns: ['Kiambu Town', 'Ruiru', 'Kikuyu', 'Limuru', 'Thika Town'],
    feeKes: 450,
    estimatedDeliveryHours: '24 - 36 Hours',
    isActive: true,
  },
  {
    id: 'zone_mombasa_coast',
    county: 'Mombasa',
    name: 'Zone 4: Mombasa Island & Nyali',
    towns: ['Mombasa CBD', 'Nyali', 'Bamburi', 'Kizingo', 'Changamwe'],
    feeKes: 600,
    estimatedDeliveryHours: '1 - 2 Business Days',
    isActive: true,
  },
  {
    id: 'zone_upcountry_major',
    county: 'Nakuru',
    name: 'Zone 5: Rift Valley & Western Hubs',
    towns: ['Nakuru Town', 'Naivasha', 'Eldoret', 'Kisumu Central'],
    feeKes: 550,
    estimatedDeliveryHours: '2 Business Days (G4S / Fargo)',
    isActive: true,
  },
];

// Commission Tier Rules
export const INITIAL_COMMISSION_RULES: CommissionRule[] = [
  {
    id: 'rule_global',
    name: 'Platform Baseline (Standard)',
    type: 'global',
    ratePercent: 10,
    fixedFeeKes: 0,
    isActive: true,
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rule_cat_tech',
    name: 'Tech & Electronics Category Discount',
    type: 'category',
    targetCategory: 'Tech & Electronics',
    ratePercent: 6,
    fixedFeeKes: 100,
    isActive: true,
    updatedAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'rule_cat_fashion',
    name: 'Handcrafted Apparel & Textiles',
    type: 'category',
    targetCategory: 'Fashion & Kitenge',
    ratePercent: 10,
    fixedFeeKes: 0,
    isActive: true,
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'rule_vendor_olkaria',
    name: 'Olkaria Leather Volume Preferred Rate',
    type: 'vendor',
    targetVendorId: 'ven_olkaria_leather',
    ratePercent: 8,
    fixedFeeKes: 50,
    isActive: true,
    updatedAt: '2026-04-10T00:00:00Z',
  },
];

// Initial Catalog of Products with authentic imagery & Kenyan context
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_samsung_s24',
    vendorId: 'ven_nairobi_tech',
    vendorName: 'Nairobi Tech Direct',
    title: 'Samsung Galaxy S24 Ultra 5G (256GB / 12GB RAM, Titanium Gray)',
    brand: 'Samsung',
    slug: 'samsung-galaxy-s24-ultra-5g-256gb',
    description: 'Flagship smartphone featuring Galaxy AI, 200MP Quad Telephoto Camera, 6.8" Dynamic AMOLED 2X 120Hz display, Snapdragon 8 Gen 3 processor, embedded S Pen, and 5000mAh battery. Official 24-month Samsung East Africa warranty.',
    priceKes: 148500,
    compareAtPriceKes: 165000,
    stockQuantity: 15,
    sku: 'SAM-S24U-256-GRY',
    category: 'Phones & Tablets',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Storage', options: ['256GB', '512GB', '1TB'] },
      { name: 'Color', options: ['Titanium Gray', 'Titanium Black', 'Titanium Violet'] },
    ],
    approvalStatus: 'approved',
    rating: 4.9,
    reviewsCount: 42,
    isActive: true,
    createdAt: '2026-08-05T09:00:00Z',
  },
  {
    id: 'prod_sony_wh1000xm5',
    vendorId: 'ven_nairobi_tech',
    vendorName: 'Nairobi Tech Direct',
    title: 'Sony WH-1000XM5 Wireless Industry-Leading Noise-Cancelling Headphones',
    brand: 'Sony',
    slug: 'sony-wh1000xm5-wireless-noise-cancelling-headphones',
    description: 'Premium over-ear wireless headphones with dual processors and 8 microphones for unmatched active noise cancellation, 30-hour battery life with fast charging, crystal-clear hands-free calling, and multipoint Bluetooth pairing.',
    priceKes: 42000,
    compareAtPriceKes: 48500,
    stockQuantity: 28,
    sku: 'SNY-WH1000-XM5-BLK',
    category: 'Electronics & Gadgets',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Color', options: ['Black', 'Silver', 'Midnight Blue'] },
    ],
    approvalStatus: 'approved',
    rating: 5.0,
    reviewsCount: 56,
    isActive: true,
    createdAt: '2026-08-08T11:30:00Z',
  },
  {
    id: 'prod_hp_probook',
    vendorId: 'ven_nairobi_tech',
    vendorName: 'Nairobi Tech Direct',
    title: 'HP ProBook 450 G10 (15.6" FHD, Intel Core i7 13th Gen, 16GB RAM, 512GB SSD)',
    brand: 'HP',
    slug: 'hp-probook-450-g10-core-i7-16gb-512gb',
    description: 'Commercial-grade business laptop with durable aluminum chassis, Intel Core i7-1355U (up to 5.0GHz), 16GB DDR4 RAM, 512GB PCIe NVMe SSD, backlit spill-resistant keyboard, fingerprint reader, and Windows 11 Pro.',
    priceKes: 98000,
    compareAtPriceKes: 112000,
    stockQuantity: 12,
    sku: 'HP-PB450-G10-I7',
    category: 'Computers & Laptops',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'RAM / Storage', options: ['16GB RAM / 512GB SSD', '32GB RAM / 1TB SSD'] },
    ],
    approvalStatus: 'approved',
    rating: 4.8,
    reviewsCount: 18,
    isActive: true,
    createdAt: '2026-08-14T15:00:00Z',
  },
  {
    id: 'prod_philips_airfryer',
    vendorId: 'ven_apex_appliances',
    vendorName: 'Apex Home & Kitchen',
    title: 'Philips Digital Airfryer XXL (7.2L Rapid Air Technology, 2000W)',
    brand: 'Philips',
    slug: 'philips-digital-airfryer-xxl-7-2l',
    description: 'Healthy cooking with up to 90% less fat. Large 7.2L (1.4kg) capacity serves up to 6 people. Features Smart Sensing technology, 16 pre-set cooking functions, keep-warm mode, and dishwasher-safe QuickClean basket.',
    priceKes: 25500,
    compareAtPriceKes: 29900,
    stockQuantity: 20,
    sku: 'PHL-AF-XXL-72',
    category: 'Home & Kitchen',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Color', options: ['Black & Copper', 'Gloss White'] },
    ],
    approvalStatus: 'approved',
    rating: 4.9,
    reviewsCount: 31,
    isActive: true,
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'prod_nike_airmax',
    vendorId: 'ven_kikomeo_attire',
    vendorName: 'Kiko Contemporary Fashion',
    title: 'Nike Air Max 270 React Lifestyle Running Sneakers',
    brand: 'Nike',
    slug: 'nike-air-max-270-react-sneakers',
    description: 'Iconic lifestyle sneaker combining Nike React foam technology with large Max Air 270 heel unit for responsive all-day cushioning. Lightweight layered no-sew mesh upper with reinforced rubber outsole.',
    priceKes: 12500,
    compareAtPriceKes: 14800,
    stockQuantity: 34,
    sku: 'NKE-AM270-RCT-42',
    category: 'Fashion & Apparel',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Shoe Size (EU)', options: ['40', '41', '42', '43', '44', '45'] },
      { name: 'Colorway', options: ['Triple Black', 'White / University Red', 'Cool Grey'] },
    ],
    approvalStatus: 'approved',
    rating: 4.8,
    reviewsCount: 29,
    isActive: true,
    createdAt: '2026-08-18T13:40:00Z',
  },
  {
    id: 'prod_shea_butter',
    vendorId: 'ven_apex_appliances',
    vendorName: 'Apex Home & Kitchen',
    title: 'Organic Pure Cold-Pressed Shea Butter & Argan Hair Masque (500g)',
    brand: 'Nile Organics',
    slug: 'organic-pure-cold-pressed-shea-butter-500g',
    description: '100% unrefined raw Grade A Nilotica shea butter infused with Moroccan argan oil and vitamin E. Deeply hydrates dry skin, repairs damaged hair curls, and softens textured beard growth without parabens or sulfates.',
    priceKes: 2200,
    compareAtPriceKes: 2650,
    stockQuantity: 65,
    sku: 'NIL-SHEA-500G-ARG',
    category: 'Beauty & Personal Care',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'],
    attributes: [
      { name: 'Volume', options: ['500g Jar', '1kg Tub'] },
    ],
    approvalStatus: 'approved',
    rating: 5.0,
    reviewsCount: 47,
    isActive: true,
    createdAt: '2026-08-22T08:20:00Z',
  },
  {
    id: 'prod_mara_duffel',
    vendorId: 'ven_olkaria_leather',
    vendorName: 'Olkaria Artisan Leather',
    title: 'The Mara Safari Full-Grain Leather Duffel Bag',
    brand: 'Olkaria Leather',
    slug: 'mara-safari-full-grain-leather-duffel-bag',
    description: 'Hand-stitched from heavy-weight, vegetable-tanned Kenyan pull-up leather with solid antique brass hardware and reinforced riveted handles. Features an internal zippered pocket, separate shoe compartment, and waterproof waxed cotton canvas lining.',
    priceKes: 14500,
    compareAtPriceKes: 16800,
    stockQuantity: 18,
    sku: 'OLK-BAG-MARA-01',
    category: 'Handcrafted Leather',
    images: ['/src/assets/images/product_mara_leather_bag_1790583446093.jpg'],
    attributes: [
      { name: 'Color', options: ['Cognac Tan', 'Rich Espresso', 'Desert Amber'] },
      { name: 'Size', options: ['Standard 45L', 'Extended 55L Weekender'] },
    ],
    approvalStatus: 'approved',
    rating: 4.9,
    reviewsCount: 38,
    isActive: true,
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'prod_kitenge_blazer',
    vendorId: 'ven_kikomeo_attire',
    vendorName: 'Kiko Contemporary Fashion',
    title: 'Nairobi Horizon Structured Kitenge Blazer',
    slug: 'nairobi-horizon-structured-kitenge-blazer',
    description: 'Contemporary unisex structured blazer blending traditional East African geometric wax print with sharp modern tailoring. Fully lined with breathable silk blend, peak lapels, and horn buttons handcrafted in Kibera.',
    priceKes: 8900,
    compareAtPriceKes: 10500,
    stockQuantity: 24,
    sku: 'KKO-BLZ-HORIZ-24',
    category: 'Fashion & Kitenge',
    images: ['/src/assets/images/product_kitenge_jacket_1790583422282.jpg'],
    attributes: [
      { name: 'Size', options: ['S (38R)', 'M (40R)', 'L (42R)', 'XL (44R)'] },
      { name: 'Color Pattern', options: ['Kikuyu Ochre & Indigo', 'Sunset Coral', 'Monochrome Geo'] },
    ],
    approvalStatus: 'approved',
    rating: 4.8,
    reviewsCount: 22,
    isActive: true,
    createdAt: '2026-08-12T14:20:00Z',
  },
  {
    id: 'prod_mtkenya_aa',
    vendorId: 'ven_mtkenya_coffee',
    vendorName: 'Mount Kenya Highland Roasters',
    title: 'Mount Kenya Reserve Grade AA Single-Origin Coffee (500g)',
    slug: 'mt-kenya-reserve-grade-aa-coffee-500g',
    description: 'Directly sourced from high-altitude smallholder farms on the southern slopes of Mount Kenya (1,950m elevation). Notes of blackcurrant, bright citric grapefruit acidity, and velvety dark caramel finish. Medium roast.',
    priceKes: 1850,
    compareAtPriceKes: 2200,
    stockQuantity: 120,
    sku: 'MKC-COF-AA500',
    category: 'Kenyan Specialty Coffee',
    images: ['/src/assets/images/product_savannah_coffee_1790583434473.jpg'],
    attributes: [
      { name: 'Grind', options: ['Whole Beans', 'Medium Filter / Aeropress', 'Coarse French Press', 'Fine Espresso'] },
      { name: 'Roast Profile', options: ['Medium Roast', 'Dark Espresso Roast'] },
    ],
    approvalStatus: 'approved',
    rating: 5.0,
    reviewsCount: 64,
    isActive: true,
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'prod_leather_wallet_slim',
    vendorId: 'ven_olkaria_leather',
    vendorName: 'Olkaria Artisan Leather',
    title: 'The Great Rift Minimalist Leather Cardholder & Cash Clip',
    slug: 'great-rift-minimalist-cardholder',
    description: 'Ultra-slim front-pocket wallet made with uncorrected full-grain leather, holds up to 8 cards plus Kenyan Shilling banknotes securely with an interior spring steel money clip. Burnished beeswax edges.',
    priceKes: 3200,
    compareAtPriceKes: 3800,
    stockQuantity: 45,
    sku: 'OLK-WLT-RIFT-04',
    category: 'Handcrafted Leather',
    images: ['/src/assets/images/hero_nairobi_crafts_1790583409822.jpg'],
    attributes: [
      { name: 'Color', options: ['Oxblood Red', 'Raw Natural Veg-Tan', 'Charcoal Black'] },
    ],
    approvalStatus: 'approved',
    rating: 4.7,
    reviewsCount: 19,
    isActive: true,
    createdAt: '2026-08-15T11:00:00Z',
  },
  {
    id: 'prod_kiko_linen_shirt',
    vendorId: 'ven_kikomeo_attire',
    vendorName: 'Kiko Contemporary Fashion',
    title: 'Lamu Coastal Pure Linen Shirt with Kitenge Trims',
    slug: 'lamu-coastal-pure-linen-shirt',
    description: 'Relaxed airy 100% European-certified flax linen shirt featuring authentic East African Kitenge collar and cuff accents. Pre-washed for maximum softness and drape.',
    priceKes: 5400,
    compareAtPriceKes: 6200,
    stockQuantity: 30,
    sku: 'KKO-SHR-LAMU-02',
    category: 'Fashion & Kitenge',
    images: ['/src/assets/images/product_kitenge_jacket_1790583422282.jpg'],
    attributes: [
      { name: 'Size', options: ['M', 'L', 'XL'] },
      { name: 'Color', options: ['Sand Off-White', 'Mombasa Sky Blue', 'Olive Khaki'] },
    ],
    approvalStatus: 'submitted', // Under Admin Review!
    approvalStatus_adminPending: true,
    rating: 0,
    reviewsCount: 0,
    isActive: false,
    createdAt: '2026-09-26T09:15:00Z',
  } as any,
];

// Initial Reviews
export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev_1',
    productId: 'prod_mara_duffel',
    customerName: 'Mwangi Githinji',
    customerPhoneMasked: '+254 722 *** 119',
    rating: 5,
    comment: 'Exceptional craftsmanship. The leather aroma and stitch density rival international luxury brands. Delivered to Kilimani in 4 hours!',
    verifiedPurchase: true,
    createdAt: '2026-09-10T12:00:00Z',
  },
  {
    id: 'rev_2',
    productId: 'prod_mtkenya_aa',
    customerName: 'Amina Hassan',
    customerPhoneMasked: '+254 733 *** 821',
    rating: 5,
    comment: 'The best whole bean coffee in Nairobi. Roasted within 48 hours of delivery. Perfect crema and vibrant notes.',
    verifiedPurchase: true,
    createdAt: '2026-09-15T08:30:00Z',
  },
];

// Initial Wallets
export const INITIAL_WALLETS: Record<string, VendorWallet> = {
  ven_olkaria_leather: {
    id: 'wal_olkaria',
    vendorId: 'ven_olkaria_leather',
    availableBalanceKes: 48500, // Available to withdraw
    pendingEscrowBalanceKes: 14500, // In escrow for active order
    totalLifetimeEarnedKes: 186000,
    totalLifetimeWithdrawnKes: 123000,
    updatedAt: '2026-09-27T10:00:00Z',
  },
  ven_kikomeo_attire: {
    id: 'wal_kikomeo',
    vendorId: 'ven_kikomeo_attire',
    availableBalanceKes: 26700,
    pendingEscrowBalanceKes: 8900,
    totalLifetimeEarnedKes: 98000,
    totalLifetimeWithdrawnKes: 62400,
    updatedAt: '2026-09-27T12:00:00Z',
  },
  ven_mtkenya_coffee: {
    id: 'wal_mtkenya',
    vendorId: 'ven_mtkenya_coffee',
    availableBalanceKes: 14200,
    pendingEscrowBalanceKes: 3700,
    totalLifetimeEarnedKes: 52000,
    totalLifetimeWithdrawnKes: 34100,
    updatedAt: '2026-09-26T18:00:00Z',
  },
};

// Initial Wallet Transactions (Double-Entry Ledger)
export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_1001',
    walletId: 'wal_olkaria',
    vendorId: 'ven_olkaria_leather',
    type: 'CREDIT_PENDING_ESCROW',
    amountKes: 13290,
    availableBalanceAfterKes: 48500,
    pendingBalanceAfterKes: 14500,
    subOrderId: 'sub_demo_101',
    description: 'Escrow locked for Sub-Order SOKO-9182-V1 (The Mara Safari Duffel Bag)',
    referenceId: 'ESC-9182-OLK',
    createdAt: '2026-09-25T14:32:00Z',
  },
  {
    id: 'tx_1000',
    walletId: 'wal_olkaria',
    vendorId: 'ven_olkaria_leather',
    type: 'RELEASE_ESCROW_TO_AVAILABLE',
    amountKes: 18400,
    availableBalanceAfterKes: 48500,
    pendingBalanceAfterKes: 0,
    subOrderId: 'sub_demo_099',
    description: 'Escrow released upon customer delivery confirmation (Order SOKO-8841)',
    referenceId: 'REL-8841-OLK',
    createdAt: '2026-09-23T11:15:00Z',
  },
  {
    id: 'tx_0999',
    walletId: 'wal_olkaria',
    vendorId: 'ven_olkaria_leather',
    type: 'COMMISSION_DEDUCTION',
    amountKes: 1600,
    availableBalanceAfterKes: 48500,
    pendingBalanceAfterKes: 0,
    subOrderId: 'sub_demo_099',
    description: 'Platform commission 8% + KES 50 fee deducted on completed delivery',
    referenceId: 'COM-8841-OLK',
    createdAt: '2026-09-23T11:15:00Z',
  },
];

// Initial Payout Requests
export const INITIAL_PAYOUTS: PayoutRequest[] = [
  {
    id: 'pay_req_101',
    payoutNumber: 'B2C-2026-0042',
    vendorId: 'ven_olkaria_leather',
    vendorName: 'Olkaria Artisan Leather',
    amountKes: 30000,
    status: 'completed',
    destinationMpesaNumber: '+254712345678',
    b2cReceiptNumber: 'QKH8492019',
    requestedAt: '2026-09-20T10:00:00Z',
    processedAt: '2026-09-20T10:05:12Z',
    processedByAdminId: 'usr_admin_main',
    notes: 'Safaricom M-Pesa B2C instant disbursement confirmed.',
  },
  {
    id: 'pay_req_102',
    payoutNumber: 'B2C-2026-0048',
    vendorId: 'ven_kikomeo_attire',
    vendorName: 'Kiko Contemporary Fashion',
    amountKes: 20000,
    status: 'requested',
    destinationMpesaNumber: '+254722998877',
    requestedAt: '2026-09-27T16:20:00Z',
    notes: 'Awaiting admin batch approval.',
  },
];

// Initial Parent Orders & Sub-Orders (Multi-vendor split demonstration)
export const INITIAL_PARENT_ORDERS: ParentOrder[] = [
  {
    id: 'ord_demo_9182',
    orderNumber: 'SOKO-9182',
    customerId: 'cust_wambui_01',
    customerName: 'Wambui Kariuki',
    customerPhone: '+254720987654',
    customerEmail: 'wambui.k@gmail.com',
    deliveryAddress: {
      county: 'Nairobi',
      town: 'Kilimani',
      zoneId: 'zone_nairobi_cbd_west',
      zoneName: 'Zone 1: Nairobi Central & Westlands',
      streetDetails: 'Rose Avenue, Green Oaks Court Apt 4B',
      buildingNotes: 'Call upon arrival at the gate',
    },
    deliveryFeeKes: 250,
    subtotalKes: 23400,
    totalAmountKes: 23650,
    paymentStatus: 'paid',
    mpesaDetails: {
      checkoutRequestId: 'ws_CO_2709202614321948201',
      merchantRequestId: 'MR-9182-991',
      mpesaReceiptNumber: 'QKI9281726',
      phoneNumber: '+254720987654',
      paidAt: '2026-09-27T14:33:02Z',
    },
    subOrderIds: ['sub_9182_v1', 'sub_9182_v2'],
    createdAt: '2026-09-27T14:32:00Z',
  },
];

export const INITIAL_SUB_ORDERS: SubOrder[] = [
  {
    id: 'sub_9182_v1',
    parentOrderId: 'ord_demo_9182',
    vendorId: 'ven_olkaria_leather',
    vendorName: 'Olkaria Artisan Leather',
    items: [
      {
        productId: 'prod_mara_duffel',
        title: 'The Mara Safari Full-Grain Leather Duffel Bag',
        sku: 'OLK-BAG-MARA-01',
        unitPriceKes: 14500,
        quantity: 1,
        lineTotalKes: 14500,
        selectedAttributes: { Color: 'Cognac Tan', Size: 'Standard 45L' },
        image: '/src/assets/images/product_mara_leather_bag_1790583446093.jpg',
      },
    ],
    subtotalKes: 14500,
    vendorDeliveryFeeShareKes: 125,
    platformCommissionKes: 1210, // 8% of 14,500 = 1,160 + KES 50 fixed = 1,210
    vendorNetEarningsKes: 13415, // 14,500 - 1,210 + 125 delivery
    commissionBreakdown: {
      ruleApplied: 'Vendor Override',
      percentageRate: 8,
      fixedFeeKes: 50,
      subtotalKes: 14500,
      commissionAmountKes: 1210,
      vendorNetEarningsKes: 13415,
    },
    fulfillmentStatus: 'dispatched',
    trackingReference: 'FGO-NRB-88392',
    courierPartner: 'Fargo Courier Kenya',
    dispatchedAt: '2026-09-27T16:00:00Z',
    customerDelivery: {
      name: 'Wambui Kariuki',
      phone: '+254720987654',
      county: 'Nairobi',
      town: 'Kilimani',
      streetDetails: 'Rose Avenue, Green Oaks Court Apt 4B',
      buildingNotes: 'Call upon arrival at the gate',
    },
  },
  {
    id: 'sub_9182_v2',
    parentOrderId: 'ord_demo_9182',
    vendorId: 'ven_kikomeo_attire',
    vendorName: 'Kiko Contemporary Fashion',
    items: [
      {
        productId: 'prod_kitenge_blazer',
        title: 'Nairobi Horizon Structured Kitenge Blazer',
        sku: 'KKO-BLZ-HORIZ-24',
        unitPriceKes: 8900,
        quantity: 1,
        lineTotalKes: 8900,
        selectedAttributes: { Size: 'M (40R)', 'Color Pattern': 'Kikuyu Ochre & Indigo' },
        image: '/src/assets/images/product_kitenge_jacket_1790583422282.jpg',
      },
    ],
    subtotalKes: 8900,
    vendorDeliveryFeeShareKes: 125,
    platformCommissionKes: 890, // 10%
    vendorNetEarningsKes: 8135, // 8,900 - 890 + 125 delivery
    commissionBreakdown: {
      ruleApplied: 'Global Platform',
      percentageRate: 10,
      fixedFeeKes: 0,
      subtotalKes: 8900,
      commissionAmountKes: 890,
      vendorNetEarningsKes: 8135,
    },
    fulfillmentStatus: 'pending',
    trackingReference: undefined,
    customerDelivery: {
      name: 'Wambui Kariuki',
      phone: '+254720987654',
      county: 'Nairobi',
      town: 'Kilimani',
      streetDetails: 'Rose Avenue, Green Oaks Court Apt 4B',
      buildingNotes: 'Call upon arrival at the gate',
    },
  },
  {
    id: 'sub_seed_olkaria_01',
    parentOrderId: 'ord_hist_01',
    vendorId: 'ven_olkaria_leather',
    vendorName: 'Olkaria Artisan Leather',
    items: [{ productId: 'prod_mara_duffel', title: 'The Mara Safari Full-Grain Leather Duffel Bag', sku: 'OLK-BAG-MARA-01', unitPriceKes: 14500, quantity: 4, lineTotalKes: 58000, selectedAttributes: {}, image: '/src/assets/images/product_mara_leather_bag_1790583446093.jpg' }],
    subtotalKes: 333500,
    vendorDeliveryFeeShareKes: 250,
    platformCommissionKes: 26680,
    vendorNetEarningsKes: 307070,
    commissionBreakdown: { ruleApplied: 'Vendor Override', percentageRate: 8, fixedFeeKes: 50, subtotalKes: 333500, commissionAmountKes: 26680, vendorNetEarningsKes: 307070 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'Fargo Courier Kenya',
    customerDelivery: {
      name: 'Juma Omondi',
      phone: '+254711889900',
      county: 'Kisumu',
      town: 'Milimani',
      streetDetails: 'Aga Khan Road, Victoria View Suites',
      buildingNotes: 'Leave with reception security desk',
    },
    trackingReference: 'FGO-NRB-77192',
    dispatchedAt: '2026-09-20T10:00:00Z',
    deliveredAt: '2026-09-22T14:30:00Z',
  },
  {
    id: 'sub_seed_kitengela_01',
    parentOrderId: 'ord_hist_02',
    vendorId: 'ven_kitengela_glass',
    vendorName: 'Kitengela Studio Glass',
    items: [{ productId: 'prod_glass_vase', title: 'Kitengela Blown Amber Swirl Centerpiece Vase', sku: 'KTG-GLS-AMB-01', unitPriceKes: 15000, quantity: 2, lineTotalKes: 30000, selectedAttributes: {}, image: '/src/assets/images/hero_nairobi_crafts_1790583409822.jpg' }],
    subtotalKes: 285000,
    vendorDeliveryFeeShareKes: 350,
    platformCommissionKes: 22900,
    vendorNetEarningsKes: 262450,
    commissionBreakdown: { ruleApplied: 'Vendor Override', percentageRate: 8, fixedFeeKes: 100, subtotalKes: 285000, commissionAmountKes: 22900, vendorNetEarningsKes: 262450 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'G4S Secure Logistics',
    trackingReference: 'G4S-KJD-91028',
    dispatchedAt: '2026-09-21T09:00:00Z',
    deliveredAt: '2026-09-23T11:15:00Z',
  },
  {
    id: 'sub_seed_kiko_01',
    parentOrderId: 'ord_hist_03',
    vendorId: 'ven_kikomeo_attire',
    vendorName: 'Kiko Contemporary Fashion',
    items: [{ productId: 'prod_kitenge_blazer', title: 'Nairobi Horizon Structured Kitenge Blazer', sku: 'KKO-BLZ-HORIZ-24', unitPriceKes: 8900, quantity: 2, lineTotalKes: 17800, selectedAttributes: {}, image: '/src/assets/images/product_kitenge_jacket_1790583422282.jpg' }],
    subtotalKes: 186900,
    vendorDeliveryFeeShareKes: 250,
    platformCommissionKes: 18690,
    vendorNetEarningsKes: 168460,
    commissionBreakdown: { ruleApplied: 'Category Default', percentageRate: 10, fixedFeeKes: 0, subtotalKes: 186900, commissionAmountKes: 18690, vendorNetEarningsKes: 168460 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'Fargo Courier Kenya',
    trackingReference: 'FGO-WLD-55201',
    dispatchedAt: '2026-09-22T11:30:00Z',
    deliveredAt: '2026-09-24T16:00:00Z',
  },
  {
    id: 'sub_seed_mtkenya_01',
    parentOrderId: 'ord_hist_04',
    vendorId: 'ven_mtkenya_coffee',
    vendorName: 'Mount Kenya Highland Roasters',
    items: [{ productId: 'prod_coffee_beans', title: 'Mount Kenya Peaberry Single-Origin Espresso Beans', sku: 'MKC-PBRY-250G', unitPriceKes: 2400, quantity: 5, lineTotalKes: 12000, selectedAttributes: {}, image: '/src/assets/images/product_savannah_coffee_1790583431630.jpg' }],
    subtotalKes: 168000,
    vendorDeliveryFeeShareKes: 300,
    platformCommissionKes: 20160,
    vendorNetEarningsKes: 148140,
    commissionBreakdown: { ruleApplied: 'Category Default', percentageRate: 12, fixedFeeKes: 0, subtotalKes: 168000, commissionAmountKes: 20160, vendorNetEarningsKes: 148140 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'Speedaf Express Kenya',
    trackingReference: 'SPF-NYR-33019',
    dispatchedAt: '2026-09-23T14:00:00Z',
    deliveredAt: '2026-09-25T10:45:00Z',
  },
  {
    id: 'sub_seed_kazuri_01',
    parentOrderId: 'ord_hist_05',
    vendorId: 'ven_kazuri_beads',
    vendorName: 'Kazuri Ceramic & Bead Studio',
    items: [{ productId: 'prod_kazuri_necklace', title: 'Kazuri Safari Sunrise Ceramic Beaded Collar Necklace', sku: 'KZR-NCK-SUN-01', unitPriceKes: 4750, quantity: 3, lineTotalKes: 14250, selectedAttributes: {}, image: '/src/assets/images/hero_nairobi_crafts_1790583409822.jpg' }],
    subtotalKes: 142500,
    vendorDeliveryFeeShareKes: 250,
    platformCommissionKes: 12825,
    vendorNetEarningsKes: 129925,
    commissionBreakdown: { ruleApplied: 'Vendor Override', percentageRate: 9, fixedFeeKes: 0, subtotalKes: 142500, commissionAmountKes: 12825, vendorNetEarningsKes: 129925 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'Sendy / Fargo Express',
    trackingReference: 'FGO-KRN-11829',
    dispatchedAt: '2026-09-23T15:00:00Z',
    deliveredAt: '2026-09-25T12:00:00Z',
  },
  {
    id: 'sub_seed_lamu_01',
    parentOrderId: 'ord_hist_06',
    vendorId: 'ven_lamu_silversmiths',
    vendorName: 'Lamu Archipelago Silversmiths',
    items: [{ productId: 'prod_lamu_cuff', title: 'Hand-chiseled Swahili Sterling Filigree Cuff', sku: 'LAM-SLV-CUFF-88', unitPriceKes: 9000, quantity: 2, lineTotalKes: 18000, selectedAttributes: {}, image: '/src/assets/images/hero_nairobi_crafts_1790583409822.jpg' }],
    subtotalKes: 126000,
    vendorDeliveryFeeShareKes: 600,
    platformCommissionKes: 12600,
    vendorNetEarningsKes: 114000,
    commissionBreakdown: { ruleApplied: 'Global Platform', percentageRate: 10, fixedFeeKes: 0, subtotalKes: 126000, commissionAmountKes: 12600, vendorNetEarningsKes: 114000 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'Fargo Air Cargo Lamu',
    trackingReference: 'FGO-LAM-99120',
    dispatchedAt: '2026-09-21T10:00:00Z',
    deliveredAt: '2026-09-24T15:00:00Z',
  },
  {
    id: 'sub_seed_mombasa_01',
    parentOrderId: 'ord_hist_07',
    vendorId: 'ven_mombasa_woodcraft',
    vendorName: 'Swahili Coast Carvings',
    items: [{ productId: 'prod_dhow_mirror', title: 'Carved Reclaimed Dhow Teak Wall Mirror', sku: 'SWC-MIR-DHOW-03', unitPriceKes: 9000, quantity: 1, lineTotalKes: 9000, selectedAttributes: {}, image: '/src/assets/images/hero_nairobi_crafts_1790583409822.jpg' }],
    subtotalKes: 99000,
    vendorDeliveryFeeShareKes: 600,
    platformCommissionKes: 9900,
    vendorNetEarningsKes: 89700,
    commissionBreakdown: { ruleApplied: 'Global Platform', percentageRate: 10, fixedFeeKes: 0, subtotalKes: 99000, commissionAmountKes: 9900, vendorNetEarningsKes: 89700 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'G4S Coastline',
    trackingReference: 'G4S-MBA-44910',
    dispatchedAt: '2026-09-22T08:30:00Z',
    deliveredAt: '2026-09-25T14:10:00Z',
  },
  {
    id: 'sub_seed_honey_01',
    parentOrderId: 'ord_hist_08',
    vendorId: 'ven_riftvalley_honey',
    vendorName: 'Rift Valley Pure Apiaries',
    items: [{ productId: 'prod_acacia_honey', title: 'Pure Acacia Wildflower Comb Honey 1kg Jar', sku: 'RVH-ACA-1KG', unitPriceKes: 1850, quantity: 4, lineTotalKes: 7400, selectedAttributes: {}, image: '/src/assets/images/hero_nairobi_crafts_1790583409822.jpg' }],
    subtotalKes: 78500,
    vendorDeliveryFeeShareKes: 350,
    platformCommissionKes: 7850,
    vendorNetEarningsKes: 71000,
    commissionBreakdown: { ruleApplied: 'Global Platform', percentageRate: 10, fixedFeeKes: 0, subtotalKes: 78500, commissionAmountKes: 7850, vendorNetEarningsKes: 71000 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'Fargo Courier Naivasha',
    trackingReference: 'FGO-NVS-10928',
    dispatchedAt: '2026-09-24T10:00:00Z',
    deliveredAt: '2026-09-26T16:00:00Z',
  },
  {
    id: 'sub_seed_kericho_01',
    parentOrderId: 'ord_hist_09',
    vendorId: 'ven_kericho_tea',
    vendorName: 'Kericho Crown Highland Teas',
    items: [{ productId: 'prod_purple_tea', title: 'Highland Purple Leaf Orthodox Artisan Tin', sku: 'KCT-PURP-200G', unitPriceKes: 1800, quantity: 3, lineTotalKes: 5400, selectedAttributes: {}, image: '/src/assets/images/hero_nairobi_crafts_1790583409822.jpg' }],
    subtotalKes: 64800,
    vendorDeliveryFeeShareKes: 350,
    platformCommissionKes: 7128,
    vendorNetEarningsKes: 58022,
    commissionBreakdown: { ruleApplied: 'Category Default', percentageRate: 11, fixedFeeKes: 0, subtotalKes: 64800, commissionAmountKes: 7128, vendorNetEarningsKes: 58022 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'Speedaf Courier',
    trackingReference: 'SPF-KRC-88192',
    dispatchedAt: '2026-09-23T11:00:00Z',
    deliveredAt: '2026-09-25T15:30:00Z',
  },
  {
    id: 'sub_seed_turkana_01',
    parentOrderId: 'ord_hist_10',
    vendorId: 'ven_turkana_weavers',
    vendorName: 'Turkana Heritage Palm Weavers',
    items: [{ productId: 'prod_palm_hamper', title: 'Hand-dyed Doum Palm Market Hamper with Leather Handles', sku: 'TRK-PLM-HMP-01', unitPriceKes: 4200, quantity: 1, lineTotalKes: 4200, selectedAttributes: {}, image: '/src/assets/images/hero_nairobi_crafts_1790583409822.jpg' }],
    subtotalKes: 54600,
    vendorDeliveryFeeShareKes: 500,
    platformCommissionKes: 5460,
    vendorNetEarningsKes: 49640,
    commissionBreakdown: { ruleApplied: 'Global Platform', percentageRate: 10, fixedFeeKes: 0, subtotalKes: 54600, commissionAmountKes: 5460, vendorNetEarningsKes: 49640 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'Postal Corporation of Kenya (EMS)',
    trackingReference: 'EMS-LDW-77201',
    dispatchedAt: '2026-09-20T14:00:00Z',
    deliveredAt: '2026-09-24T11:00:00Z',
  },
  {
    id: 'sub_seed_kisumu_01',
    parentOrderId: 'ord_hist_11',
    vendorId: 'ven_kisumu_pottery',
    vendorName: 'Dunga Hillside Terracotta Studio',
    items: [{ productId: 'prod_clay_pot', title: 'Dunga Hillside Terracotta Charcoal Water Cooling Crock', sku: 'DNG-CLY-WAT-01', unitPriceKes: 3800, quantity: 1, lineTotalKes: 3800, selectedAttributes: {}, image: '/src/assets/images/hero_nairobi_crafts_1790583409822.jpg' }],
    subtotalKes: 38200,
    vendorDeliveryFeeShareKes: 400,
    platformCommissionKes: 3820,
    vendorNetEarningsKes: 34780,
    commissionBreakdown: { ruleApplied: 'Global Platform', percentageRate: 10, fixedFeeKes: 0, subtotalKes: 38200, commissionAmountKes: 3820, vendorNetEarningsKes: 34780 },
    fulfillmentStatus: 'delivered',
    courierPartner: 'Fargo Express Kisumu',
    trackingReference: 'FGO-KSM-30192',
    dispatchedAt: '2026-09-22T13:00:00Z',
    deliveredAt: '2026-09-25T17:00:00Z',
  },
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_9001',
    actorRole: 'CUSTOMER',
    actorId: 'cust_wambui_01',
    actorName: 'Wambui Kariuki (+254720987654)',
    action: 'ORDER_CREATED',
    targetType: 'ORDER',
    targetId: 'ord_demo_9182',
    metadata: { totalAmountKes: 23650, subOrderCount: 2 },
    ipAddress: '197.237.144.12', // Kenyan ISP IP
    timestamp: '2026-09-27T14:32:00Z',
  },
  {
    id: 'log_9002',
    actorRole: 'SYSTEM',
    actorId: 'sys_daraja_mpesa',
    actorName: 'Safaricom Daraja Gateway',
    action: 'MPESA_PAYMENT_VERIFIED',
    targetType: 'ORDER',
    targetId: 'ord_demo_9182',
    metadata: { receiptNumber: 'QKI9281726', amountKes: 23650, resultCode: 0 },
    ipAddress: '196.201.214.200',
    timestamp: '2026-09-27T14:33:02Z',
  },
  {
    id: 'log_9003',
    actorRole: 'VENDOR',
    actorId: 'ven_olkaria_leather',
    actorName: 'Olkaria Artisan Leather',
    action: 'SUBORDER_DISPATCHED',
    targetType: 'SUBORDER',
    targetId: 'sub_9182_v1',
    metadata: { courier: 'Fargo Courier Kenya', tracking: 'FGO-NRB-88392' },
    ipAddress: '105.160.44.8',
    timestamp: '2026-09-27T16:00:00Z',
  },
];

// Initial Platform Settings
export const INITIAL_SETTINGS: PlatformSettings = {
  adminConfig: {},
  escrowInspectionHours: 72,
  minimumPayoutThresholdKes: 500,
  autoApprovePayoutUnderKes: 10000,
  defaultCommissionRatePercent: 10,
  darajaEnvironment: 'sandbox',
  darajaPaybillNumber: '408221',
  darajaShortcode: '174379',
  darajaConsumerKeyMasked: 'daraja_ck_live_98124••••••••••',
  darajaPasskeyMasked: '',
  smsGatewayProvider: 'AfricasTalking',
  smsSenderId: 'SOKOSALAMA',
  supportEmail: 'support@sokosalama.co.ke',
  supportPhone: '+254700000001',
  maintenanceMode: false,
  kraWithholdingTaxEnabled: true,
};

// Initial Disputes (for customer/vendor escrow issues)
export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp_301',
    disputeNumber: 'DSP-2026-081',
    subOrderId: 'sub_9182_v2',
    parentOrderId: 'ord_demo_9182',
    customerId: 'cust_wambui_01',
    customerName: 'Wambui Kariuki',
    customerPhone: '+254720987654',
    vendorId: 'ven_kikomeo_attire',
    vendorName: 'Kiko Contemporary Fashion',
    amountAtStakeKes: 8900,
    reason: 'Wrong Product / Variant',
    description: 'Buyer requested S (38R) but received XL. Item is untouched with original labels attached in Westlands.',
    evidenceImages: ['/src/assets/images/product_kitenge_jacket_1790583422282.jpg'],
    status: 'opened',
    createdAt: '2026-09-27T17:40:00Z',
  },
];

// Initial Hot & Flash Deals with Admin Timers
export const INITIAL_HOT_DEALS: HotDeal[] = [
  {
    id: 'deal_samsung_s24',
    productId: 'prod_samsung_s24',
    title: 'Samsung Galaxy S24 Ultra 5G (256GB Titanium)',
    badgeText: 'FLASH 20% OFF',
    dealPriceKes: 119000,
    originalPriceKes: 148500,
    discountPercentage: 20,
    endsAt: new Date(Date.now() + 14 * 3600 * 1000 + 22 * 60 * 1000).toISOString(), // ~14h 22m from now
    totalQuota: 25,
    claimedCount: 19,
    isActive: true,
    featured: true,
  },
  {
    id: 'deal_sony_wh1000xm5',
    productId: 'prod_sony_wh1000xm5',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling',
    badgeText: 'HOT DEAL 25%',
    dealPriceKes: 31500,
    originalPriceKes: 42000,
    discountPercentage: 25,
    endsAt: new Date(Date.now() + 8 * 3600 * 1000 + 45 * 60 * 1000).toISOString(), // ~8h 45m from now
    totalQuota: 30,
    claimedCount: 24,
    isActive: true,
    featured: true,
  },
  {
    id: 'deal_philips_airfryer',
    productId: 'prod_philips_airfryer',
    title: 'Philips Digital Airfryer XXL (7.2L Rapid Air)',
    badgeText: 'MEGA SALE 26%',
    dealPriceKes: 18900,
    originalPriceKes: 25500,
    discountPercentage: 26,
    endsAt: new Date(Date.now() + 19 * 3600 * 1000 + 10 * 60 * 1000).toISOString(),
    totalQuota: 40,
    claimedCount: 31,
    isActive: true,
    featured: true,
  },
  {
    id: 'deal_nike_airmax',
    productId: 'prod_nike_airmax',
    title: 'Nike Air Max 270 React Lifestyle Running',
    badgeText: 'LIMITED 29%',
    dealPriceKes: 8900,
    originalPriceKes: 12500,
    discountPercentage: 29,
    endsAt: new Date(Date.now() + 6 * 3600 * 1000 + 15 * 60 * 1000).toISOString(),
    totalQuota: 50,
    claimedCount: 42,
    isActive: true,
    featured: true,
  },
];

// Initial Registered Accounts for Authentication
export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_demo_customer',
    name: 'Demo Customer',
    email: 'demo.customer@sokosalama.co.ke',
    phone: '+254700000002',
    role: 'CUSTOMER',
    county: 'Nairobi',
    town: 'Westlands',
    password: 'DemoCustomer2026',
    createdAt: '2026-09-30T00:00:00Z',
  },
  {
    id: 'usr_cust_01',
    name: 'Wambui Kariuki',
    email: 'wambui.k@gmail.com',
    phone: '+254720987654',
    role: 'CUSTOMER',
    county: 'Nairobi',
    town: 'Westlands',
    password: 'password123',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'usr_cust_02',
    name: 'Juma Omondi',
    email: 'juma.omondi@gmail.com',
    phone: '+254712345678',
    role: 'CUSTOMER',
    county: 'Mombasa',
    town: 'Nyali',
    password: 'password123',
    createdAt: '2026-02-20T11:30:00Z',
  },
  {
    id: 'usr_ven_olkaria',
    name: 'Olkaria Artisan Leather',
    email: 'leather@olkaria.co.ke',
    phone: '+254712345678',
    role: 'VENDOR',
    vendorId: 'ven_olkaria_leather',
    county: 'Nakuru',
    town: 'Naivasha',
    password: 'vendor123',
    createdAt: '2025-04-10T08:00:00Z',
  },
  {
    id: 'usr_ven_kikomeo',
    name: 'Kiko Contemporary Fashion',
    email: 'rep@kikomeo.co.ke',
    phone: '+254722998877',
    role: 'VENDOR',
    vendorId: 'ven_kikomeo_attire',
    county: 'Nairobi',
    town: 'Kilimani',
    password: 'vendor123',
    createdAt: '2025-03-22T09:00:00Z',
  },
  {
    id: 'usr_ven_mtkenya',
    name: 'Mount Kenya Highland Roasters',
    email: 'orders@mtkenyacoffee.co.ke',
    phone: '+254733445566',
    role: 'VENDOR',
    vendorId: 'ven_mtkenya_coffee',
    county: 'Nyeri',
    town: 'Nyeri CBD',
    password: 'vendor123',
    createdAt: '2025-01-05T08:00:00Z',
  },
  {
    id: 'usr_ven_mombasa',
    name: 'Swahili Coast Carvings',
    email: 'info@swahilicrafts.co.ke',
    phone: '+254701239876',
    role: 'VENDOR',
    vendorId: 'ven_mombasa_woodcraft',
    county: 'Mombasa',
    town: 'Old Town',
    password: 'vendor123',
    createdAt: '2025-02-15T09:00:00Z',
  },
  {
    id: 'usr_ven_kazuri',
    name: 'Kazuri Ceramic & Bead Studio',
    email: 'craft@kazuribeads.co.ke',
    phone: '+254711223344',
    role: 'VENDOR',
    vendorId: 'ven_kazuri_beads',
    county: 'Nairobi',
    town: 'Karen',
    password: 'vendor123',
    createdAt: '2025-06-12T10:00:00Z',
  },
  {
    id: 'usr_admin_main',
    name: 'Antony Onyi (Platform Admin)',
    email: 'admin@sokosalama.co.ke',
    phone: '+254700000001',
    role: 'ADMIN',
    county: 'Nairobi',
    town: 'CBD',
    password: 'admin2026',
    createdAt: '2025-01-01T00:00:00Z',
  },
];

// In-Memory Database Store Class with ACID-like atomic mutations
class MarketplaceDataStore {
  settings: PlatformSettings = { ...INITIAL_SETTINGS };
  disputes: Dispute[] = [...INITIAL_DISPUTES];
  users: UserAccount[] = [...INITIAL_USERS];
  vendors: Vendor[] = [...INITIAL_VENDORS];
  products: Product[] = [...INITIAL_PRODUCTS];
  deliveryZones: DeliveryZone[] = [...INITIAL_DELIVERY_ZONES];
  commissionRules: CommissionRule[] = [...INITIAL_COMMISSION_RULES];
  parentOrders: ParentOrder[] = [...INITIAL_PARENT_ORDERS];
  subOrders: SubOrder[] = [...INITIAL_SUB_ORDERS];
  wallets: Record<string, VendorWallet> = { ...INITIAL_WALLETS };
  transactions: WalletTransaction[] = [...INITIAL_TRANSACTIONS];
  payouts: PayoutRequest[] = [...INITIAL_PAYOUTS];
  auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  reviews: ProductReview[] = [...INITIAL_REVIEWS];
  hotDeals: HotDeal[] = [...INITIAL_HOT_DEALS];

  // Helper for audit logging
  logAudit(
    actorRole: AuditLog['actorRole'],
    actorId: string,
    actorName: string,
    action: AuditLog['action'],
    targetType: AuditLog['targetType'],
    targetId: string,
    metadata: Record<string, any> = {}
  ): AuditLog {
    const entry: AuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      actorRole,
      actorId,
      actorName,
      action,
      targetType,
      targetId,
      metadata,
      ipAddress: '197.237.150.' + Math.floor(Math.random() * 250 + 1),
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  // 1. Commission Calculation Engine
  calculateSubOrderCommission(vendorId: string, category: string, subtotalKes: number) {
    // Priority 1: Vendor specific rule
    const vendorRule = this.commissionRules.find(r => r.isActive && r.type === 'vendor' && r.targetVendorId === vendorId);
    if (vendorRule) {
      const commission = Math.round((subtotalKes * vendorRule.ratePercent) / 100) + vendorRule.fixedFeeKes;
      return {
        ruleApplied: 'Vendor Override' as const,
        percentageRate: vendorRule.ratePercent,
        fixedFeeKes: vendorRule.fixedFeeKes,
        subtotalKes,
        commissionAmountKes: commission,
        vendorNetEarningsKes: Math.max(0, subtotalKes - commission),
      };
    }

    // Priority 2: Category specific rule
    const catRule = this.commissionRules.find(r => r.isActive && r.type === 'category' && r.targetCategory === category);
    if (catRule) {
      const commission = Math.round((subtotalKes * catRule.ratePercent) / 100) + catRule.fixedFeeKes;
      return {
        ruleApplied: 'Category Default' as const,
        percentageRate: catRule.ratePercent,
        fixedFeeKes: catRule.fixedFeeKes,
        subtotalKes,
        commissionAmountKes: commission,
        vendorNetEarningsKes: Math.max(0, subtotalKes - commission),
      };
    }

    // Priority 3: Global Platform baseline
    const globalRule = this.commissionRules.find(r => r.isActive && r.type === 'global') || {
      ratePercent: 10,
      fixedFeeKes: 0,
    };
    const commission = Math.round((subtotalKes * globalRule.ratePercent) / 100) + globalRule.fixedFeeKes;
    return {
      ruleApplied: 'Global Platform' as const,
      percentageRate: globalRule.ratePercent,
      fixedFeeKes: globalRule.fixedFeeKes,
      subtotalKes,
      commissionAmountKes: commission,
      vendorNetEarningsKes: Math.max(0, subtotalKes - commission),
    };
  }

  // 2. Checkout & Order Splitting with Authoritative Price & Stock Check
  createOrder(payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: ParentOrder['deliveryAddress'];
    cartItems: {
      productId: string;
      quantity: number;
      selectedAttributes: Record<string, string>;
    }[];
  }) {
    if (!payload.cartItems || payload.cartItems.length === 0) {
      throw new Error('Cart is empty.');
    }

    // Step A: Validate zone
    const zone = this.deliveryZones.find(z => z.id === payload.deliveryAddress.zoneId && z.isActive);
    if (!zone) {
      throw new Error('Invalid or inactive delivery zone selected.');
    }

    // Step B: Authoritative product price and stock validation
    const verifiedItems: {
      product: Product;
      quantity: number;
      selectedAttributes: Record<string, string>;
      lineTotalKes: number;
    }[] = [];

    for (const item of payload.cartItems) {
      const product = this.products.find(p => p.id === item.productId && p.approvalStatus === 'approved' && p.isActive);
      if (!product) {
        throw new Error(`Product ${item.productId} is not available for purchase.`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for "${product.title}". Only ${product.stockQuantity} remaining.`);
      }
      verifiedItems.push({
        product,
        quantity: item.quantity,
        selectedAttributes: item.selectedAttributes,
        lineTotalKes: product.priceKes * item.quantity,
      });
    }

    // Step C: Group items by Vendor (Sub-Orders)
    const itemsByVendor: Record<string, typeof verifiedItems> = {};
    for (const vItem of verifiedItems) {
      const vId = vItem.product.vendorId;
      if (!itemsByVendor[vId]) itemsByVendor[vId] = [];
      itemsByVendor[vId].push(vItem);
    }

    const vendorIds = Object.keys(itemsByVendor);
    const subtotalKes = verifiedItems.reduce((sum, item) => sum + item.lineTotalKes, 0);
    const totalAmountKes = subtotalKes + zone.feeKes;

    const parentOrderId = 'ord_' + Date.now();
    const orderNumber = 'SOKO-' + Math.floor(1000 + Math.random() * 9000);
    const deliveryFeePerVendor = Math.round(zone.feeKes / vendorIds.length);

    // Step D: Create Sub-Orders
    const createdSubOrders: SubOrder[] = [];
    const subOrderIds: string[] = [];

    vendorIds.forEach((vId, idx) => {
      const vItems = itemsByVendor[vId];
      const vendor = this.vendors.find(v => v.id === vId);
      const vendorName = vendor ? vendor.name : 'Vendor ' + vId;
      const vSubtotal = vItems.reduce((acc, it) => acc + it.lineTotalKes, 0);

      // Primary category for commission
      const primaryCategory = vItems[0].product.category;
      const commissionBreakdown = this.calculateSubOrderCommission(vId, primaryCategory, vSubtotal);

      const subId = `sub_${orderNumber}_v${idx + 1}`;
      subOrderIds.push(subId);

      const subOrder: SubOrder = {
        id: subId,
        parentOrderId,
        vendorId: vId,
        vendorName,
        items: vItems.map(vi => ({
          productId: vi.product.id,
          title: vi.product.title,
          sku: vi.product.sku,
          unitPriceKes: vi.product.priceKes,
          quantity: vi.quantity,
          lineTotalKes: vi.lineTotalKes,
          selectedAttributes: vi.selectedAttributes,
          image: vi.product.images[0] || '',
        })),
        subtotalKes: vSubtotal,
        vendorDeliveryFeeShareKes: deliveryFeePerVendor,
        platformCommissionKes: commissionBreakdown.commissionAmountKes,
        vendorNetEarningsKes: commissionBreakdown.vendorNetEarningsKes + deliveryFeePerVendor,
        commissionBreakdown,
        fulfillmentStatus: 'pending',
        customerDelivery: {
          name: payload.customerName,
          phone: payload.customerPhone,
          county: payload.deliveryAddress.county,
          town: payload.deliveryAddress.town,
          streetDetails: payload.deliveryAddress.streetDetails,
          buildingNotes: payload.deliveryAddress.buildingNotes,
        },
      };

      createdSubOrders.push(subOrder);
    });

    // Step E: Create Parent Order with Pending Payment
    const checkoutRequestId = 'ws_CO_' + Date.now() + Math.floor(100 + Math.random() * 900);
    const merchantRequestId = 'MR-' + orderNumber;

    const parentOrder: ParentOrder = {
      id: parentOrderId,
      orderNumber,
      customerId: 'cust_' + payload.customerPhone.replace(/\D/g, ''),
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      deliveryAddress: payload.deliveryAddress,
      deliveryFeeKes: zone.feeKes,
      subtotalKes,
      totalAmountKes,
      paymentStatus: 'pending',
      mpesaDetails: {
        checkoutRequestId,
        merchantRequestId,
        phoneNumber: payload.customerPhone,
      },
      subOrderIds,
      createdAt: new Date().toISOString(),
    };

    // Decrement stock authoritatively
    verifiedItems.forEach(vi => {
      vi.product.stockQuantity -= vi.quantity;
    });

    this.parentOrders.unshift(parentOrder);
    createdSubOrders.forEach(so => this.subOrders.unshift(so));

    this.logAudit(
      'CUSTOMER',
      parentOrder.customerId,
      `${parentOrder.customerName} (${parentOrder.customerPhone})`,
      'ORDER_CREATED',
      'ORDER',
      parentOrder.id,
      { orderNumber, subOrdersCount: createdSubOrders.length, totalAmountKes }
    );

    return {
      parentOrder,
      subOrders: createdSubOrders,
      checkoutRequestId,
      merchantRequestId,
    };
  }

  // 3. M-Pesa STK Callback with Server-Side Idempotency & Replay Protection
  confirmMpesaPayment(checkoutRequestId: string, mpesaReceiptNumber: string, resultCode: number = 0) {
    const parentOrder = this.parentOrders.find(
      o => o.mpesaDetails?.checkoutRequestId === checkoutRequestId
    );
    if (!parentOrder) {
      throw new Error(`Order not found for checkout request ID: ${checkoutRequestId}`);
    }

    // Replay check
    if (parentOrder.paymentStatus === 'paid') {
      return { success: true, message: 'Payment already processed (idempotent)', parentOrder };
    }

    if (resultCode !== 0) {
      parentOrder.paymentStatus = 'failed';
      // Restore stock on failed checkout
      const relatedSubOrders = this.subOrders.filter(so => so.parentOrderId === parentOrder.id);
      relatedSubOrders.forEach(so => {
        so.items.forEach(it => {
          const prod = this.products.find(p => p.id === it.productId);
          if (prod) prod.stockQuantity += it.quantity;
        });
      });
      return { success: false, message: 'M-Pesa payment failed or was cancelled by user', parentOrder };
    }

    // Success flow
    parentOrder.paymentStatus = 'paid';
    if (parentOrder.mpesaDetails) {
      parentOrder.mpesaDetails.mpesaReceiptNumber = mpesaReceiptNumber;
      parentOrder.mpesaDetails.paidAt = new Date().toISOString();
    }

    // Atomic Escrow lock: credit pending escrow for each vendor suborder
    const relatedSubOrders = this.subOrders.filter(so => so.parentOrderId === parentOrder.id);
    for (const subOrder of relatedSubOrders) {
      this.ensureWallet(subOrder.vendorId);
      const wallet = this.wallets[subOrder.vendorId];

      const pendingCreditAmount = subOrder.vendorNetEarningsKes;
      wallet.pendingEscrowBalanceKes += pendingCreditAmount;
      wallet.updatedAt = new Date().toISOString();

      const tx: WalletTransaction = {
        id: 'tx_escrow_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        walletId: wallet.id,
        vendorId: subOrder.vendorId,
        type: 'CREDIT_PENDING_ESCROW',
        amountKes: pendingCreditAmount,
        availableBalanceAfterKes: wallet.availableBalanceKes,
        pendingBalanceAfterKes: wallet.pendingEscrowBalanceKes,
        subOrderId: subOrder.id,
        description: `Escrow locked for Sub-Order ${subOrder.id} (${parentOrder.orderNumber})`,
        referenceId: `ESC-${parentOrder.orderNumber}-${subOrder.vendorId}`,
        createdAt: new Date().toISOString(),
      };
      this.transactions.unshift(tx);
    }

    this.logAudit(
      'SYSTEM',
      'sys_mpesa',
      'Safaricom Daraja Service',
      'MPESA_PAYMENT_VERIFIED',
      'ORDER',
      parentOrder.id,
      {
        orderNumber: parentOrder.orderNumber,
        receipt: mpesaReceiptNumber,
        amountKes: parentOrder.totalAmountKes,
      }
    );

    return { success: true, message: 'Payment verified and escrow locked successfully', parentOrder };
  }

  // 4. Sub-Order Fulfillment: Vendor Dispatches
  dispatchSubOrder(subOrderId: string, courierPartner: string, trackingReference: string, vendorId?: string) {
    const subOrder = this.subOrders.find(so => so.id === subOrderId);
    if (!subOrder) throw new Error('Sub-order not found.');

    // IDOR check if called in vendor context
    if (vendorId && subOrder.vendorId !== vendorId) {
      throw new Error('Access denied: You do not own this sub-order.');
    }

    subOrder.fulfillmentStatus = 'dispatched';
    subOrder.courierPartner = courierPartner;
    subOrder.trackingReference = trackingReference;
    subOrder.dispatchedAt = new Date().toISOString();

    this.logAudit(
      'VENDOR',
      subOrder.vendorId,
      subOrder.vendorName,
      'SUBORDER_DISPATCHED',
      'SUBORDER',
      subOrder.id,
      { courierPartner, trackingReference }
    );

    return subOrder;
  }

  // 5. Delivery Confirmation & Atomic Escrow Release to Vendor Wallet
  confirmSubOrderDelivery(subOrderId: string, actor: UserSession) {
    const subOrder = this.subOrders.find(so => so.id === subOrderId);
    if (!subOrder) throw new Error('Sub-order not found.');

    if (subOrder.fulfillmentStatus === 'delivered') {
      return { success: true, subOrder, message: 'Already marked as delivered.' };
    }

    subOrder.fulfillmentStatus = 'delivered';
    subOrder.deliveredAt = new Date().toISOString();

    // Release escrow: move from pendingEscrow to availableBalance
    this.ensureWallet(subOrder.vendorId);
    const wallet = this.wallets[subOrder.vendorId];
    const earnings = subOrder.vendorNetEarningsKes;

    // Adjust balances
    wallet.pendingEscrowBalanceKes = Math.max(0, wallet.pendingEscrowBalanceKes - earnings);
    wallet.availableBalanceKes += earnings;
    wallet.totalLifetimeEarnedKes += earnings;
    wallet.updatedAt = new Date().toISOString();

    // Double-Entry records
    const releaseTx: WalletTransaction = {
      id: 'tx_rel_' + Date.now(),
      walletId: wallet.id,
      vendorId: subOrder.vendorId,
      type: 'RELEASE_ESCROW_TO_AVAILABLE',
      amountKes: earnings,
      availableBalanceAfterKes: wallet.availableBalanceKes,
      pendingBalanceAfterKes: wallet.pendingEscrowBalanceKes,
      subOrderId: subOrder.id,
      description: `Escrow released to available balance on delivery completion of ${subOrder.id}`,
      referenceId: `REL-${subOrder.id}`,
      createdAt: new Date().toISOString(),
    };
    this.transactions.unshift(releaseTx);

    // Platform commission record
    const commTx: WalletTransaction = {
      id: 'tx_com_' + Date.now(),
      walletId: wallet.id,
      vendorId: subOrder.vendorId,
      type: 'COMMISSION_DEDUCTION',
      amountKes: subOrder.platformCommissionKes,
      availableBalanceAfterKes: wallet.availableBalanceKes,
      pendingBalanceAfterKes: wallet.pendingEscrowBalanceKes,
      subOrderId: subOrder.id,
      description: `Platform fee deducted (${subOrder.commissionBreakdown.percentageRate}% + KES ${subOrder.commissionBreakdown.fixedFeeKes})`,
      referenceId: `COM-${subOrder.id}`,
      createdAt: new Date().toISOString(),
    };
    this.transactions.unshift(commTx);

    this.logAudit(
      actor.role,
      actor.id,
      actor.name,
      'SUBORDER_DELIVERED',
      'SUBORDER',
      subOrder.id,
      { releasedEarningsKes: earnings, commissionKes: subOrder.platformCommissionKes }
    );

    return { success: true, subOrder, wallet };
  }

  // 6. Vendor Wallet Payout Request (M-Pesa B2C)
  requestPayout(vendorId: string, amountKes: number, destinationMpesa: string) {
    if (amountKes < 500) {
      throw new Error('Minimum payout threshold is KES 500.');
    }
    this.ensureWallet(vendorId);
    const wallet = this.wallets[vendorId];
    if (wallet.availableBalanceKes < amountKes) {
      throw new Error(`Insufficient available balance. You have KES ${wallet.availableBalanceKes.toLocaleString()} available.`);
    }

    const vendor = this.vendors.find(v => v.id === vendorId);
    const vendorName = vendor ? vendor.name : 'Vendor ' + vendorId;

    // Deduct from available balance immediately to hold in payout escrow
    wallet.availableBalanceKes -= amountKes;
    wallet.updatedAt = new Date().toISOString();

    const payoutId = 'pay_' + Date.now();
    const payoutNumber = 'B2C-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const payout: PayoutRequest = {
      id: payoutId,
      payoutNumber,
      vendorId,
      vendorName,
      amountKes,
      status: 'requested',
      destinationMpesaNumber: destinationMpesa,
      requestedAt: new Date().toISOString(),
    };
    this.payouts.unshift(payout);

    const tx: WalletTransaction = {
      id: 'tx_pay_req_' + Date.now(),
      walletId: wallet.id,
      vendorId,
      type: 'PAYOUT_REQUEST_DEBIT',
      amountKes,
      availableBalanceAfterKes: wallet.availableBalanceKes,
      pendingBalanceAfterKes: wallet.pendingEscrowBalanceKes,
      payoutId,
      description: `M-Pesa B2C payout requested to ${destinationMpesa} (${payoutNumber})`,
      referenceId: payoutNumber,
      createdAt: new Date().toISOString(),
    };
    this.transactions.unshift(tx);

    this.logAudit(
      'VENDOR',
      vendorId,
      vendorName,
      'PAYOUT_REQUESTED',
      'PAYOUT',
      payoutId,
      { amountKes, destinationMpesa, payoutNumber }
    );

    return { payout, wallet };
  }

  // 7. Admin Payout Processing (Disburse or Reject)
  processPayout(payoutId: string, approve: boolean, adminSession: UserSession, notes?: string) {
    const payout = this.payouts.find(p => p.id === payoutId);
    if (!payout) throw new Error('Payout request not found.');
    if (payout.status !== 'requested' && payout.status !== 'processing') {
      throw new Error(`Payout is already ${payout.status}.`);
    }

    const wallet = this.wallets[payout.vendorId];

    if (approve) {
      payout.status = 'completed';
      payout.processedAt = new Date().toISOString();
      payout.processedByAdminId = adminSession.id;
      payout.b2cReceiptNumber = 'QK' + Math.floor(10000000 + Math.random() * 90000000);
      payout.notes = notes || 'M-Pesa B2C disbursement successful.';
      if (wallet) {
        wallet.totalLifetimeWithdrawnKes += payout.amountKes;
      }

      this.logAudit(
        'ADMIN',
        adminSession.id,
        adminSession.name,
        'PAYOUT_APPROVED',
        'PAYOUT',
        payout.id,
        { b2cReceipt: payout.b2cReceiptNumber, amountKes: payout.amountKes }
      );
    } else {
      payout.status = 'rejected';
      payout.processedAt = new Date().toISOString();
      payout.processedByAdminId = adminSession.id;
      payout.notes = notes || 'Payout request declined by administrator.';

      // Reverse funds back to vendor available balance
      if (wallet) {
        wallet.availableBalanceKes += payout.amountKes;
        wallet.updatedAt = new Date().toISOString();

        const reversalTx: WalletTransaction = {
          id: 'tx_rev_' + Date.now(),
          walletId: wallet.id,
          vendorId: payout.vendorId,
          type: 'PAYOUT_REFUND_REVERSAL',
          amountKes: payout.amountKes,
          availableBalanceAfterKes: wallet.availableBalanceKes,
          pendingBalanceAfterKes: wallet.pendingEscrowBalanceKes,
          payoutId: payout.id,
          description: `Payout ${payout.payoutNumber} rejected: funds returned to available balance.`,
          referenceId: 'REV-' + payout.payoutNumber,
          createdAt: new Date().toISOString(),
        };
        this.transactions.unshift(reversalTx);
      }

      this.logAudit(
        'ADMIN',
        adminSession.id,
        adminSession.name,
        'PAYOUT_REJECTED',
        'PAYOUT',
        payout.id,
        { reason: payout.notes, amountKes: payout.amountKes }
      );
    }

    return payout;
  }

  // 8. Admin Product Approval Flow
  moderateProduct(productId: string, approve: boolean, adminSession: UserSession, reason?: string) {
    const product = this.products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found.');

    if (approve) {
      product.approvalStatus = 'approved';
      product.isActive = true;
      product.rejectionReason = undefined;

      this.logAudit(
        'ADMIN',
        adminSession.id,
        adminSession.name,
        'PRODUCT_APPROVED',
        'PRODUCT',
        product.id,
        { title: product.title, vendorId: product.vendorId }
      );
    } else {
      product.approvalStatus = 'rejected';
      product.isActive = false;
      product.rejectionReason = reason || 'Product did not meet quality or catalogue compliance guidelines.';

      this.logAudit(
        'ADMIN',
        adminSession.id,
        adminSession.name,
        'PRODUCT_REJECTED',
        'PRODUCT',
        product.id,
        { title: product.title, reason: product.rejectionReason }
      );
    }

    return product;
  }

  // 8b. Admin Bulk Product Moderation (Approve/Reject multiple)
  bulkModerateProducts(productIds: string[], approve: boolean, adminSession: UserSession, reason?: string) {
    const updatedProducts: Product[] = [];
    const validIds = new Set(productIds);

    for (const product of this.products) {
      if (validIds.has(product.id)) {
        if (approve) {
          product.approvalStatus = 'approved';
          product.isActive = true;
          product.rejectionReason = undefined;

          this.logAudit(
            'ADMIN',
            adminSession.id,
            adminSession.name,
            'PRODUCT_APPROVED',
            'PRODUCT',
            product.id,
            { title: product.title, vendorId: product.vendorId, bulkAction: true, totalInBatch: productIds.length }
          );
        } else {
          product.approvalStatus = 'rejected';
          product.isActive = false;
          product.rejectionReason = reason || 'Batch rejected during compliance audit.';

          this.logAudit(
            'ADMIN',
            adminSession.id,
            adminSession.name,
            'PRODUCT_REJECTED',
            'PRODUCT',
            product.id,
            { title: product.title, reason: product.rejectionReason, bulkAction: true, totalInBatch: productIds.length }
          );
        }
        updatedProducts.push(product);
      }
    }

    return updatedProducts;
  }

  // 9. Vendor adds new product
  createProduct(vendorId: string, input: Omit<Product, 'id' | 'vendorId' | 'vendorName' | 'rating' | 'reviewsCount' | 'createdAt'>) {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (!vendor) throw new Error('Vendor not found.');

    const newProd: Product = {
      ...input,
      id: 'prod_' + Date.now(),
      vendorId,
      vendorName: vendor.name,
      rating: 0,
      reviewsCount: 0,
      approvalStatus: 'submitted', // Requires Admin approval
      isActive: false,
      createdAt: new Date().toISOString(),
    };

    this.products.unshift(newProd);

    this.logAudit(
      'VENDOR',
      vendorId,
      vendor.name,
      'PRODUCT_SUBMITTED',
      'PRODUCT',
      newProd.id,
      { title: newProd.title, sku: newProd.sku }
    );

    return newProd;
  }

  // 9b. Vendor updates existing product
  updateProduct(vendorId: string, productId: string, updates: Partial<Product>) {
    const product = this.products.find(p => p.id === productId && p.vendorId === vendorId);
    if (!product) throw new Error('Product not found or not authorized to edit.');

    if (updates.title !== undefined) product.title = updates.title.trim();
    if (updates.description !== undefined) product.description = updates.description.trim();
    if (updates.priceKes !== undefined) product.priceKes = Number(updates.priceKes);
    if (updates.stockQuantity !== undefined) product.stockQuantity = Math.max(0, Number(updates.stockQuantity));
    if (updates.category !== undefined) product.category = updates.category;
    if (updates.images !== undefined && Array.isArray(updates.images)) product.images = updates.images;
    if (updates.isActive !== undefined) product.isActive = Boolean(updates.isActive);
    if (updates.sku !== undefined) product.sku = updates.sku.trim();

    this.logAudit(
      'VENDOR',
      vendorId,
      product.vendorName,
      'PRODUCT_SUBMITTED',
      'PRODUCT',
      product.id,
      { action: 'PRODUCT_UPDATED', title: product.title, priceKes: product.priceKes, stockQuantity: product.stockQuantity }
    );

    return product;
  }

  // 9c. Vendor deletes product
  deleteProduct(vendorId: string, productId: string) {
    const idx = this.products.findIndex(p => p.id === productId && p.vendorId === vendorId);
    if (idx === -1) throw new Error('Product not found or not authorized to delete.');
    const removed = this.products.splice(idx, 1)[0];

    this.logAudit(
      'VENDOR',
      vendorId,
      removed.vendorName,
      'PRODUCT_REJECTED',
      'PRODUCT',
      removed.id,
      { action: 'PRODUCT_DELETED', title: removed.title }
    );

    return { success: true, productId: removed.id };
  }

  // 9d. Vendor updates store profile
  updateVendorProfile(vendorId: string, updates: Partial<Vendor>) {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (!vendor) throw new Error('Vendor store not found.');

    if (updates.name !== undefined && updates.name.trim()) vendor.name = updates.name.trim();
    if (updates.bio !== undefined) vendor.bio = updates.bio.trim();
    if (updates.phone !== undefined && updates.phone.trim()) vendor.phone = updates.phone.trim();
    if (updates.mpesaPayoutNumber !== undefined && updates.mpesaPayoutNumber.trim()) {
      vendor.mpesaPayoutNumber = updates.mpesaPayoutNumber.trim();
    }
    if (updates.county !== undefined && updates.county.trim()) vendor.county = updates.county.trim();
    if (updates.town !== undefined && updates.town.trim()) vendor.town = updates.town.trim();
    if (updates.businessRegistrationNumber !== undefined) {
      vendor.businessRegistrationNumber = updates.businessRegistrationNumber.trim();
    }

    this.logAudit(
      'VENDOR',
      vendor.id,
      vendor.name,
      'VENDOR_KYC_APPROVED',
      'VENDOR',
      vendor.id,
      { action: 'PROFILE_UPDATED', updatedFields: Object.keys(updates) }
    );

    return vendor;
  }

  // 10. Update Commission Rules
  saveCommissionRule(rule: CommissionRule, adminSession: UserSession) {
    const idx = this.commissionRules.findIndex(r => r.id === rule.id);
    if (idx >= 0) {
      this.commissionRules[idx] = { ...rule, updatedAt: new Date().toISOString() };
    } else {
      this.commissionRules.push({ ...rule, id: 'rule_' + Date.now(), updatedAt: new Date().toISOString() });
    }

    this.logAudit(
      'ADMIN',
      adminSession.id,
      adminSession.name,
      'COMMISSION_RULE_UPDATED',
      'COMMISSION_RULE',
      rule.id,
      { name: rule.name, ratePercent: rule.ratePercent, fixedFeeKes: rule.fixedFeeKes }
    );

    return rule;
  }

  // 11. Vendor KYC / Status update
  updateVendorStatus(vendorId: string, status: Vendor['status'], adminSession: UserSession) {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (!vendor) throw new Error('Vendor not found.');

    vendor.status = status;
    this.logAudit(
      'ADMIN',
      adminSession.id,
      adminSession.name,
      status === 'approved' ? 'VENDOR_KYC_APPROVED' : 'VENDOR_SUSPENDED',
      'VENDOR',
      vendor.id,
      { status }
    );

    return vendor;
  }

  // 12. Update Vendor Custom Commission Override
  updateVendorCommission(vendorId: string, commissionRatePercent: number, customFixedFeeKes: number, adminSession: UserSession) {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (!vendor) throw new Error('Vendor not found.');

    vendor.commissionRatePercent = commissionRatePercent;
    vendor.customFixedFeeKes = customFixedFeeKes;

    // Check if custom rule exists in rules array
    const existingRuleIdx = this.commissionRules.findIndex(r => r.type === 'vendor' && r.targetVendorId === vendorId);
    if (existingRuleIdx >= 0) {
      this.commissionRules[existingRuleIdx].ratePercent = commissionRatePercent;
      this.commissionRules[existingRuleIdx].fixedFeeKes = customFixedFeeKes;
      this.commissionRules[existingRuleIdx].updatedAt = new Date().toISOString();
    } else {
      this.commissionRules.push({
        id: 'rule_ven_' + vendorId,
        name: `${vendor.name} Negotiated Rate`,
        type: 'vendor',
        targetVendorId: vendorId,
        ratePercent: commissionRatePercent,
        fixedFeeKes: customFixedFeeKes,
        isActive: true,
        updatedAt: new Date().toISOString(),
      });
    }

    this.logAudit(
      'ADMIN',
      adminSession.id,
      adminSession.name,
      'COMMISSION_RULE_UPDATED',
      'VENDOR',
      vendor.id,
      { commissionRatePercent, customFixedFeeKes }
    );

    return vendor;
  }

  // 13. Platform Settings Management
  updateSettings(newSettings: Partial<PlatformSettings>, adminSession: UserSession) {
    const { secretDrafts, ...safeSettings } = newSettings;
    if (secretDrafts && Object.values(secretDrafts).some(Boolean)) {
      throw new Error('Payment credentials can only be saved through the encrypted admin settings API.');
    }
    this.settings = {
      ...this.settings,
      ...safeSettings,
    };

    this.logAudit(
      'ADMIN',
      adminSession.id,
      adminSession.name,
      'SETTINGS_UPDATED',
      'SETTINGS',
      'platform_settings',
      { updatedFields: Object.keys(newSettings) }
    );

    return this.settings;
  }

  // 14. Dispute Resolution Engine (Escrow Arbitrator)
  resolveDispute(
    disputeId: string,
    resolutionType: 'FULL_REFUND' | 'RELEASE_TO_VENDOR' | 'SPLIT_ESCROW',
    notes: string,
    adminSession: UserSession
  ) {
    const dispute = this.disputes.find(d => d.id === disputeId);
    if (!dispute) throw new Error('Dispute record not found.');

    const subOrder = this.subOrders.find(so => so.id === dispute.subOrderId);
    if (!subOrder) throw new Error('Associated sub-order not found.');

    const parentOrder = this.parentOrders.find(po => po.id === dispute.parentOrderId);
    this.ensureWallet(dispute.vendorId);
    const wallet = this.wallets[dispute.vendorId];

    dispute.status = resolutionType === 'FULL_REFUND' ? 'resolved_refunded' : resolutionType === 'RELEASE_TO_VENDOR' ? 'resolved_vendor_paid' : 'resolved_split';
    dispute.resolutionType = resolutionType;
    dispute.adminResolutionNotes = notes;
    dispute.resolvedAt = new Date().toISOString();
    dispute.resolvedByAdminId = adminSession.id;

    if (resolutionType === 'FULL_REFUND') {
      // Return escrow funds from pending escrow to customer
      wallet.pendingEscrowBalanceKes = Math.max(0, wallet.pendingEscrowBalanceKes - subOrder.vendorNetEarningsKes);
      wallet.updatedAt = new Date().toISOString();

      subOrder.fulfillmentStatus = 'cancelled';
      if (parentOrder) {
        parentOrder.paymentStatus = 'refunded';
      }

      const tx: WalletTransaction = {
        id: 'tx_ref_' + Date.now(),
        walletId: wallet.id,
        vendorId: dispute.vendorId,
        type: 'REFUND_CUSTOMER_DEBIT',
        amountKes: subOrder.vendorNetEarningsKes,
        availableBalanceAfterKes: wallet.availableBalanceKes,
        pendingBalanceAfterKes: wallet.pendingEscrowBalanceKes,
        subOrderId: subOrder.id,
        description: `Dispute ${dispute.disputeNumber} resolved: Escrow refunded to customer via M-Pesa`,
        referenceId: 'REV-' + dispute.disputeNumber,
        createdAt: new Date().toISOString(),
      };
      this.transactions.unshift(tx);
    } else if (resolutionType === 'RELEASE_TO_VENDOR') {
      // Award escrow to vendor
      this.confirmSubOrderDelivery(subOrder.id, adminSession);
    } else if (resolutionType === 'SPLIT_ESCROW') {
      // 50/50 split settlement
      const halfAmount = Math.round(subOrder.vendorNetEarningsKes / 2);
      wallet.pendingEscrowBalanceKes = Math.max(0, wallet.pendingEscrowBalanceKes - subOrder.vendorNetEarningsKes);
      wallet.availableBalanceKes += halfAmount;
      wallet.updatedAt = new Date().toISOString();

      subOrder.fulfillmentStatus = 'delivered';

      const splitTx: WalletTransaction = {
        id: 'tx_splt_' + Date.now(),
        walletId: wallet.id,
        vendorId: dispute.vendorId,
        type: 'RELEASE_ESCROW_TO_AVAILABLE',
        amountKes: halfAmount,
        availableBalanceAfterKes: wallet.availableBalanceKes,
        pendingBalanceAfterKes: wallet.pendingEscrowBalanceKes,
        subOrderId: subOrder.id,
        description: `Dispute ${dispute.disputeNumber} 50/50 split settlement credited to vendor`,
        referenceId: 'SPLIT-' + dispute.disputeNumber,
        createdAt: new Date().toISOString(),
      };
      this.transactions.unshift(splitTx);
    }

    this.logAudit(
      'ADMIN',
      adminSession.id,
      adminSession.name,
      'DISPUTE_RESOLVED',
      'DISPUTE',
      dispute.id,
      { resolutionType, notes, amountKes: dispute.amountAtStakeKes }
    );

    return dispute;
  }

  // 15. Delivery Zone Management
  saveDeliveryZone(zone: DeliveryZone, adminSession: UserSession) {
    const existingIndex = this.deliveryZones.findIndex(z => z.id === zone.id);
    if (existingIndex >= 0) {
      this.deliveryZones[existingIndex] = zone;
    } else {
      this.deliveryZones.push({ ...zone, id: zone.id || 'zone_' + Date.now() });
    }

    this.logAudit(
      'ADMIN',
      adminSession.id,
      adminSession.name,
      'ZONE_CONFIGURED',
      'ZONE',
      zone.id,
      { county: zone.county, name: zone.name, feeKes: zone.feeKes }
    );

    return this.deliveryZones;
  }

  deleteDeliveryZone(zoneId: string, adminSession: UserSession) {
    this.deliveryZones = this.deliveryZones.filter(z => z.id !== zoneId);
    this.logAudit(
      'ADMIN',
      adminSession.id,
      adminSession.name,
      'ZONE_CONFIGURED',
      'ZONE',
      zoneId,
      { action: 'DELETED' }
    );
    return this.deliveryZones;
  }

  // 16. Auto-Release Delivered Escrows (Simulated Cron Job)
  autoReleaseDeliveredEscrows(adminSession: UserSession) {
    const releasedList: string[] = [];
    const dispatched = this.subOrders.filter(so => so.fulfillmentStatus === 'dispatched');

    for (const sub of dispatched) {
      this.confirmSubOrderDelivery(sub.id, adminSession);
      releasedList.push(sub.id);
    }

    return { releasedCount: releasedList.length, subOrderIds: releasedList };
  }

  // 17. Authentication & User Management
  authenticateUser(identifier: string, password?: string): UserSession {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/\s+/g, '').replace(/^0/, '+254');

    // 1. Check in registered users list
    let matchedUser = this.users.find(u => {
      const matchEmail = u.email.toLowerCase() === cleanId;
      const matchPhone = u.phone === cleanPhone || u.phone === identifier.trim();
      return matchEmail || matchPhone;
    });

    // 2. If not found in users, check vendors directly
    if (!matchedUser) {
      const matchedVendor = this.vendors.find(v => {
        const matchEmail = v.ownerEmail.toLowerCase() === cleanId;
        const matchPhone = v.phone === cleanPhone || v.phone === identifier.trim();
        return matchEmail || matchPhone;
      });
      if (matchedVendor) {
        matchedUser = {
          id: 'usr_ven_' + matchedVendor.id,
          name: `${matchedVendor.name} Rep`,
          email: matchedVendor.ownerEmail,
          phone: matchedVendor.phone,
          role: 'VENDOR',
          vendorId: matchedVendor.id,
          county: matchedVendor.county,
          town: matchedVendor.town,
          createdAt: matchedVendor.joinedAt,
        };
      }
    }

    // 3. Fallback for admin shortcut
    if (!matchedUser && (cleanId === 'admin' || cleanId === 'admin@sokosalama.co.ke')) {
      matchedUser = this.users.find(u => u.role === 'ADMIN');
    }

    if (!matchedUser) {
      throw new Error(`No account found matching "${identifier}". Please check your email/phone or sign up.`);
    }

    // Check password if provided and user has a configured password
    if (password && matchedUser.password && matchedUser.password !== password) {
      throw new Error('Incorrect password. Please try again or use password reset.');
    }

    const session: UserSession = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      phone: matchedUser.phone,
      role: matchedUser.role,
      vendorId: matchedUser.vendorId,
      county: matchedUser.county,
      town: matchedUser.town,
    };

    this.logAudit(
      matchedUser.role,
      matchedUser.id,
      matchedUser.name,
      'USER_LOGIN',
      'USER',
      matchedUser.id,
      { method: identifier.includes('@') ? 'email' : 'phone', role: matchedUser.role }
    );

    return session;
  }

  registerCustomerUser(data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    county?: string;
    town?: string;
  }): UserSession {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim().startsWith('+') ? data.phone.trim() : (data.phone.trim().startsWith('0') ? '+254' + data.phone.trim().slice(1) : '+254' + data.phone.trim());

    // Check duplicate email
    const existing = this.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error(`An account with email ${data.email} already exists. Please log in.`);
    }

    const newId = 'usr_cust_' + Date.now();
    const newUser: UserAccount = {
      id: newId,
      name: data.name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      role: 'CUSTOMER',
      county: data.county || 'Nairobi',
      town: data.town || 'CBD',
      password: data.password || 'password123',
      createdAt: new Date().toISOString(),
    };

    this.users.unshift(newUser);

    const session: UserSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      county: newUser.county,
      town: newUser.town,
    };

    this.logAudit(
      'CUSTOMER',
      newUser.id,
      newUser.name,
      'USER_REGISTERED',
      'USER',
      newUser.id,
      { county: newUser.county, town: newUser.town }
    );

    return session;
  }

  registerVendorStore(data: {
    storeName: string;
    category?: string;
    ownerName: string;
    email: string;
    phone: string;
    county: string;
    town: string;
    mpesaPayoutNumber: string;
    bio: string;
    password?: string;
    businessRegistrationNumber?: string;
  }): { session: UserSession; vendor: Vendor } {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim().startsWith('+') ? data.phone.trim() : (data.phone.trim().startsWith('0') ? '+254' + data.phone.trim().slice(1) : '+254' + data.phone.trim());
    const cleanMpesa = data.mpesaPayoutNumber.trim().startsWith('+') ? data.mpesaPayoutNumber.trim() : (data.mpesaPayoutNumber.trim().startsWith('0') ? '+254' + data.mpesaPayoutNumber.trim().slice(1) : '+254' + data.mpesaPayoutNumber.trim());

    // Generate slug & vendor ID
    const slugBase = data.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const vendorId = 'ven_' + slugBase + '_' + Math.random().toString(36).substring(2, 6);

    const newVendor: Vendor = {
      id: vendorId,
      name: data.storeName.trim(),
      slug: slugBase,
      ownerEmail: cleanEmail,
      phone: cleanPhone,
      county: data.county,
      town: data.town,
      status: 'approved', // Pre-approve to allow immediate portal onboarding
      mpesaPayoutNumber: cleanMpesa,
      bio: data.bio.trim() || `Authentic Kenyan merchant specializing in handcrafted products.`,
      rating: 5.0,
      joinedAt: new Date().toISOString(),
      businessRegistrationNumber: data.businessRegistrationNumber || `BN-${Math.floor(1000000 + Math.random() * 9000000)}-KE`,
      commissionRatePercent: 10,
    };

    this.vendors.unshift(newVendor);
    this.ensureWallet(newVendor.id);

    const userId = 'usr_ven_' + newVendor.id;
    const newUser: UserAccount = {
      id: userId,
      name: `${data.storeName} (${data.ownerName || 'Merchant'})`,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'VENDOR',
      vendorId: newVendor.id,
      county: data.county,
      town: data.town,
      password: data.password || 'vendor123',
      createdAt: new Date().toISOString(),
    };

    this.users.unshift(newUser);

    const session: UserSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: 'VENDOR',
      vendorId: newVendor.id,
      county: newVendor.county,
      town: newVendor.town,
    };

    this.logAudit(
      'VENDOR',
      newUser.id,
      newUser.name,
      'VENDOR_ONBOARDED',
      'VENDOR',
      newVendor.id,
      { storeName: newVendor.name, county: newVendor.county }
    );

    return { session, vendor: newVendor };
  }

  resetUserPassword(identifier: string, newPassword?: string): boolean {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/\s+/g, '').replace(/^0/, '+254');

    const user = this.users.find(u => {
      return u.email.toLowerCase() === cleanId || u.phone === cleanPhone || u.phone === identifier.trim();
    });

    if (!user) {
      throw new Error(`No account found matching "${identifier}".`);
    }

    user.password = newPassword || 'password123';
    this.logAudit(
      user.role,
      user.id,
      user.name,
      'PASSWORD_RESET',
      'USER',
      user.id,
      { email: user.email }
    );
    return true;
  }

  getAllUsers(): UserAccount[] {
    return this.users;
  }

  // Hot Deals Management
  getHotDeals(): HotDeal[] {
    return [...this.hotDeals];
  }

  createOrUpdateHotDeal(data: Partial<HotDeal> & { productId: string }, adminSession?: UserSession): HotDeal {
    const product = this.products.find(p => p.id === data.productId);
    if (!product) throw new Error('Product not found for hot deal');

    const existingIndex = this.hotDeals.findIndex(d => d.id === data.id || d.productId === data.productId);
    const originalPrice = product.priceKes;
    const dealPrice = Number(data.dealPriceKes) || Math.round(originalPrice * 0.8);
    const discount = Math.max(1, Math.round(((originalPrice - dealPrice) / originalPrice) * 100));

    const dealObj: HotDeal = {
      id: data.id || `deal_${Date.now()}`,
      productId: data.productId,
      title: data.title || product.title,
      badgeText: data.badgeText || `FLASH ${discount}% OFF`,
      dealPriceKes: dealPrice,
      originalPriceKes: originalPrice,
      discountPercentage: discount,
      endsAt: data.endsAt || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      totalQuota: Number(data.totalQuota) || 20,
      claimedCount: Number(data.claimedCount) || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      featured: data.featured !== undefined ? data.featured : true,
    };

    if (existingIndex >= 0) {
      this.hotDeals[existingIndex] = { ...this.hotDeals[existingIndex], ...dealObj };
      if (adminSession) {
        this.logAudit('ADMIN', adminSession.id, adminSession.name, 'HOT_DEAL_UPDATED' as any, 'PRODUCT', product.id, { deal: dealObj });
      }
      return this.hotDeals[existingIndex];
    } else {
      this.hotDeals.push(dealObj);
      if (adminSession) {
        this.logAudit('ADMIN', adminSession.id, adminSession.name, 'HOT_DEAL_CREATED' as any, 'PRODUCT', product.id, { deal: dealObj });
      }
      return dealObj;
    }
  }

  deleteHotDeal(dealId: string, adminSession?: UserSession): boolean {
    const deal = this.hotDeals.find(d => d.id === dealId);
    this.hotDeals = this.hotDeals.filter(d => d.id !== dealId);
    if (adminSession && deal) {
      this.logAudit('ADMIN', adminSession.id, adminSession.name, 'HOT_DEAL_DELETED' as any, 'PRODUCT', deal.productId, { dealId });
    }
    return true;
  }

  toggleHotDeal(dealId: string, isActive: boolean): HotDeal {
    const deal = this.hotDeals.find(d => d.id === dealId);
    if (!deal) throw new Error('Hot deal not found');
    deal.isActive = isActive;
    return deal;
  }

  extendHotDealTimer(dealId: string, hoursToAdd: number): HotDeal {
    const deal = this.hotDeals.find(d => d.id === dealId);
    if (!deal) throw new Error('Hot deal not found');
    const currentEnd = new Date(deal.endsAt).getTime();
    const baseTime = currentEnd > Date.now() ? currentEnd : Date.now();
    deal.endsAt = new Date(baseTime + hoursToAdd * 3600 * 1000).toISOString();
    deal.isActive = true;
    return deal;
  }

  private ensureWallet(vendorId: string) {
    if (!this.wallets[vendorId]) {
      this.wallets[vendorId] = {
        id: 'wal_' + vendorId,
        vendorId,
        availableBalanceKes: 0,
        pendingEscrowBalanceKes: 0,
        totalLifetimeEarnedKes: 0,
        totalLifetimeWithdrawnKes: 0,
        updatedAt: new Date().toISOString(),
      };
    }
  }
}

// Export singleton instance
export const db = new MarketplaceDataStore();
