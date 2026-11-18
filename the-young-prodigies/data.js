/* ============================================================================
   PAYSTACK CONFIGURATION
   ----------------------------------------------------------------------------
   Replace with your LIVE or TEST Paystack Public Key from your Paystack Dashboard
   (Settings -> API Keys & Webhooks).
   ============================================================================ */
const PAYSTACK_PUBLIC_KEY = 'pk_test_YOUR_PAYSTACK_PUBLIC_KEY';

const DELIVERY_FEES = {
  kumasi: 20,
  outside: 40
};

/* ==================== CATALOG DATA (PRICED IN GH₵) ==================== */
const PRODUCTS = [
  {
    id: 'typ-01',
    title: 'Asante Structured Linen Blazer',
    category: 'Tshirts',
    price: 1450,
    material: '100% Organic Flax Linen • Horn Buttons',
    desc: 'Single-breasted architectural blazer with clean dropped shoulders, half-canvas chest construction, and discreet hand-loomed interior piping.',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=85',
    featured: true
  },
  {
    id: 'typ-02',
    title: 'Monolith Wide-Leg Trouser',
    category: 'Tailoring',
    price: 890,
    material: 'Heavyweight Cotton Twill • Kumasi Cut',
    desc: 'Double-pleated tailored trousers offering generous drape and effortless airflow in warm climates while holding a sharp vertical crease.',
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85',
    featured: true
  },
  {
    id: 'typ-03',
    title: 'Sovereign Ivory Silk Midi Dress',
    category: 'Dresses & Sets',
    price: 1620,
    material: '100% Mulberry Silk Crepe',
    desc: 'Bias-cut ivory silhouette designed to skim the form without restriction, finished with French seams and subtle back key-hole closure.',
    img: 'https://images.unsplash.com/photo-1617551307578-7f5160d6615e?auto=format&fit=crop&w=900&q=85',
    featured: true
  },
  {
    id: 'typ-04',
    title: 'Adinkra Minimalist Overcoat',
    category: 'Outerwear',
    price: 1980,
    material: 'Brushed Wool-Cotton Blend',
    desc: 'Longline minimalist coat featuring concealed placket buttons, deep welt pockets, and subtle embossed emblem lining.',
    img: 'https://images.unsplash.com/photo-1561365452-adb940139ffa?auto=format&fit=crop&w=900&q=85',
    featured: true
  },
  {
    id: 'typ-05',
    title: 'Atelier Crisp Poplin Shirt',
    category: 'Shirting & Knitwear',
    price: 680,
    material: 'Long-Staple Ghanaian Cotton',
    desc: 'Boxy studio shirting cut from crisp high-twist cotton poplin with elongated cuffs and mother-of-pearl hardware.',
    img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85',
    featured: false
  },
  {
    id: 'typ-06',
    title: 'Obaatan Sculpted Two-Piece Set',
    category: 'Dresses & Sets',
    price: 1550,
    material: 'Textured Viscose-Linen Weave',
    desc: 'Coordinated sleeveless structured vest and fluid column skirt crafted for gallery openings and evening ceremonies.',
    img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',
    featured: false
  },
  {
    id: 'typ-07',
    title: 'Nocturne Evening Slip Gown',
    category: 'Dresses & Sets',
    price: 1790,
    material: 'Matte Cupro Silk',
    desc: 'Fluid obsidian evening gown with an architectural asymmetric neckline and whisper-soft movement.',
    img: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=900&q=85',
    featured: false
  },
  {
    id: 'typ-08',
    title: 'Prodigy Minimalist Leather Runners',
    category: 'Accessories',
    price: 1250,
    material: 'Vegetable-Tanned Calfskin',
    desc: 'Hand-lasted minimalist footwear stripped of loud branding, balanced on a tonal sculpted rubber sole.',
    img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=85',
    featured: false
  }
];

const LOOKBOOK_FRAMES = [
  {
    layout: 'look-item--wide',
    title: 'Look 01 — The Monolith Blazer',
    subtitle: 'Collection 04 • Kumasi Concrete Study',
    img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=85',
    productId: 'typ-06'
  },
  {
    layout: 'look-item--tall',
    title: 'Look 02 — Bone Linen Tailoring',
    subtitle: 'Collection 04 • Light & Proportion',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=85',
    productId: 'typ-01'
  },
  {
    layout: 'look-item--half',
    title: 'Look 03 — Quiet Ivory Drape',
    subtitle: 'Collection 04 • Mulberry Silk Study',
    img: 'https://images.unsplash.com/photo-1617551307578-7f5160d6615e?auto=format&fit=crop&w=1000&q=85',
    productId: 'typ-03'
  },
  {
    layout: 'look-item--half',
    title: 'Look 04 — Studio Poplin Uniform',
    subtitle: 'Collection 04 • Ghanaian Cotton',
    img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85',
    productId: 'typ-05'
  },
  {
    layout: 'look-item--tall',
    title: 'Look 05 — Nocturne Overcoat',
    subtitle: 'Collection 04 • Evening Form',
    img: 'https://images.unsplash.com/photo-1561365452-adb940139ffa?auto=format&fit=crop&w=900&q=85',
    productId: 'typ-04'
  },
  {
    layout: 'look-item--wide',
    title: 'Look 06 — Atelier Evening Silhouette',
    subtitle: 'Collection 04 • Cupro Silk',
    img: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=1400&q=85',
    productId: 'typ-07'
  }
];