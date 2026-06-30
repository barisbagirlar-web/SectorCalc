export interface Plan {
  id: string
  credits: number
  label: string
  badge: 'none' | 'popular' | 'bestval' | 'team'
  badgeText: string
  price: number
  perCredit: number
  savingPct: number
  paddlePriceId: string
  features: string[]
  cta: string
  highlighted: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    credits: 1,
    label: 'Try it',
    badge: 'none',
    badgeText: 'No commitment',
    price: 1.99,
    perCredit: 1.99,
    savingPct: 0,
    paddlePriceId: process.env.NEXT_PUBLIC_PRICE_ID_TRY_IT || 'pri_01kvv1wpnq508nkg37f9vy0aqy',
    features: ['1 pro calculation', 'PDF report included', 'No account required'],
    cta: 'Buy 1 credit',
    highlighted: false,
  },
  {
    id: 'essentials',
    credits: 5,
    label: 'Essentials',
    badge: 'none',
    badgeText: 'Save 50%',
    price: 4.99,
    perCredit: 1.00,
    savingPct: 50,
    paddlePriceId: process.env.NEXT_PUBLIC_PRICE_ID_ESSENTIALS || 'pri_01kvv20wppf64fht2tn82wq8wc',
    features: ['5 pro calculations', 'PDF export on all', '12-month validity'],
    cta: 'Get 5 credits',
    highlighted: false,
  },
  {
    id: 'popular',
    credits: 15,
    label: 'Most popular',
    badge: 'popular',
    badgeText: 'Most popular',
    price: 7.99,
    perCredit: 0.53,
    savingPct: 73,
    paddlePriceId: process.env.NEXT_PUBLIC_PRICE_ID_POPULAR || 'pri_01kvv24222vst09fyh7rxv3ck8',
    features: ['15 pro calculations', 'Shareable PDF reports', 'Priority support', '12-month validity'],
    cta: 'Get 15 credits',
    highlighted: true,
  },
  {
    id: 'department',
    credits: 30,
    label: 'Department',
    badge: 'team',
    badgeText: 'Teams',
    price: 11.99,
    perCredit: 0.40,
    savingPct: 80,
    paddlePriceId: process.env.NEXT_PUBLIC_PRICE_ID_TEAMS || 'pri_01kvv27axkgbd5ddmd9c6gaaj9',
    features: ['30 pro calculations', 'Team PDF sharing', 'Usage dashboard', '12-month validity'],
    cta: 'Get 30 credits',
    highlighted: false,
  },
  {
    id: 'enterprise',
    credits: 100,
    label: 'Best value',
    badge: 'bestval',
    badgeText: 'Best value',
    price: 24.99,
    perCredit: 0.25,
    savingPct: 87,
    paddlePriceId: process.env.NEXT_PUBLIC_PRICE_ID_BEST_VALUE || 'pri_01kvv28x31xas1q8pdrqqa4hr7',
    features: ['100 pro calculations', 'Invoice / PO billing', 'API access (beta)', 'Dedicated onboarding', '12-month validity'],
    cta: 'Get 100 credits',
    highlighted: false,
  },
]
