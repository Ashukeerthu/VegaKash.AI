/**
 * Comprehensive World Cities Database
 * 
 * Includes:
 * - Top 100 Global Cities (by tourism, economy, population)
 * - All State/Province Capitals from major countries
 * 
 * @module data/worldCities
 */

// ============================================
// TOP 100 GLOBAL CITIES
// ============================================
export const TOP_GLOBAL_CITIES = [
  // Asia Pacific
  { city: "Tokyo", country: "Japan", region: "Asia Pacific" },
  { city: "Singapore", country: "Singapore", region: "Asia Pacific" },
  { city: "Hong Kong", country: "China", region: "Asia Pacific" },
  { city: "Bangkok", country: "Thailand", region: "Asia Pacific" },
  { city: "Seoul", country: "South Korea", region: "Asia Pacific" },
  { city: "Kuala Lumpur", country: "Malaysia", region: "Asia Pacific" },
  { city: "Shanghai", country: "China", region: "Asia Pacific" },
  { city: "Beijing", country: "China", region: "Asia Pacific" },
  { city: "Sydney", country: "Australia", region: "Asia Pacific" },
  { city: "Melbourne", country: "Australia", region: "Asia Pacific" },
  { city: "Osaka", country: "Japan", region: "Asia Pacific" },
  { city: "Taipei", country: "Taiwan", region: "Asia Pacific" },
  { city: "Ho Chi Minh City", country: "Vietnam", region: "Asia Pacific" },
  { city: "Hanoi", country: "Vietnam", region: "Asia Pacific" },
  { city: "Jakarta", country: "Indonesia", region: "Asia Pacific" },
  { city: "Bali", country: "Indonesia", region: "Asia Pacific" },
  { city: "Manila", country: "Philippines", region: "Asia Pacific" },
  { city: "Phuket", country: "Thailand", region: "Asia Pacific" },
  { city: "Auckland", country: "New Zealand", region: "Asia Pacific" },
  { city: "Queenstown", country: "New Zealand", region: "Asia Pacific" },
  // Additional Asia Pacific cities from list
  { city: "Kyoto", country: "Japan", region: "Asia Pacific" },
  { city: "Nara", country: "Japan", region: "Asia Pacific" },
  { city: "Hiroshima", country: "Japan", region: "Asia Pacific" },
  { city: "Busan", country: "South Korea", region: "Asia Pacific" },
  { city: "Jeju Island", country: "South Korea", region: "Asia Pacific" },
  { city: "Chiang Mai", country: "Thailand", region: "Asia Pacific" },
  { city: "Krabi", country: "Thailand", region: "Asia Pacific" },
  { city: "Koh Samui", country: "Thailand", region: "Asia Pacific" },
  { city: "Pattaya", country: "Thailand", region: "Asia Pacific" },
  { city: "Ayutthaya", country: "Thailand", region: "Asia Pacific" },
  { city: "Siem Reap", country: "Cambodia", region: "Asia Pacific" },
  { city: "Phnom Penh", country: "Cambodia", region: "Asia Pacific" },
  { city: "Luang Prabang", country: "Laos", region: "Asia Pacific" },
  { city: "Hoi An", country: "Vietnam", region: "Asia Pacific" },
  { city: "Da Nang", country: "Vietnam", region: "Asia Pacific" },
  { city: "Ha Long Bay", country: "Vietnam", region: "Asia Pacific" },
  { city: "Sapa", country: "Vietnam", region: "Asia Pacific" },
  { city: "Langkawi", country: "Malaysia", region: "Asia Pacific" },
  { city: "Penang", country: "Malaysia", region: "Asia Pacific" },
  { city: "Malacca", country: "Malaysia", region: "Asia Pacific" },
  { city: "Borneo", country: "Malaysia", region: "Asia Pacific" },
  { city: "Ubud", country: "Indonesia", region: "Asia Pacific" },
  { city: "Lombok", country: "Indonesia", region: "Asia Pacific" },
  { city: "Yogyakarta", country: "Indonesia", region: "Asia Pacific" },
  { city: "Komodo Island", country: "Indonesia", region: "Asia Pacific" },
  { city: "Boracay", country: "Philippines", region: "Asia Pacific" },
  { city: "Palawan", country: "Philippines", region: "Asia Pacific" },
  { city: "Cebu", country: "Philippines", region: "Asia Pacific" },
  { city: "Kathmandu", country: "Nepal", region: "Asia Pacific" },
  { city: "Pokhara", country: "Nepal", region: "Asia Pacific" },
  { city: "Everest Base Camp", country: "Nepal", region: "Asia Pacific" },
  { city: "Colombo", country: "Sri Lanka", region: "Asia Pacific" },
  { city: "Kandy", country: "Sri Lanka", region: "Asia Pacific" },
  { city: "Galle", country: "Sri Lanka", region: "Asia Pacific" },
  { city: "Ella", country: "Sri Lanka", region: "Asia Pacific" },
  { city: "Sigiriya", country: "Sri Lanka", region: "Asia Pacific" },
  { city: "Dhaka", country: "Bangladesh", region: "Asia Pacific" },
  { city: "Cox's Bazar", country: "Bangladesh", region: "Asia Pacific" },
  { city: "Thimphu", country: "Bhutan", region: "Asia Pacific" },
  { city: "Paro", country: "Bhutan", region: "Asia Pacific" },
  { city: "Male", country: "Maldives", region: "Asia Pacific" },
  { city: "Maldives", country: "Maldives", region: "Asia Pacific" },
  { city: "Brisbane", country: "Australia", region: "Asia Pacific" },
  { city: "Perth", country: "Australia", region: "Asia Pacific" },
  { city: "Gold Coast", country: "Australia", region: "Asia Pacific" },
  { city: "Cairns", country: "Australia", region: "Asia Pacific" },
  { city: "Great Barrier Reef", country: "Australia", region: "Asia Pacific" },
  { city: "Tasmania", country: "Australia", region: "Asia Pacific" },
  { city: "Adelaide", country: "Australia", region: "Asia Pacific" },
  { city: "Uluru", country: "Australia", region: "Asia Pacific" },
  { city: "Christchurch", country: "New Zealand", region: "Asia Pacific" },
  { city: "Wellington", country: "New Zealand", region: "Asia Pacific" },
  { city: "Rotorua", country: "New Zealand", region: "Asia Pacific" },
  { city: "Milford Sound", country: "New Zealand", region: "Asia Pacific" },
  { city: "Fiji", country: "Fiji", region: "Asia Pacific" },
  { city: "Bora Bora", country: "French Polynesia", region: "Asia Pacific" },
  { city: "Tahiti", country: "French Polynesia", region: "Asia Pacific" },
  { city: "Moorea", country: "French Polynesia", region: "Asia Pacific" },
  
  // Europe
  { city: "Paris", country: "France", region: "Europe" },
  { city: "London", country: "United Kingdom", region: "Europe" },
  { city: "Rome", country: "Italy", region: "Europe" },
  { city: "Barcelona", country: "Spain", region: "Europe" },
  { city: "Amsterdam", country: "Netherlands", region: "Europe" },
  { city: "Berlin", country: "Germany", region: "Europe" },
  { city: "Prague", country: "Czech Republic", region: "Europe" },
  { city: "Vienna", country: "Austria", region: "Europe" },
  { city: "Venice", country: "Italy", region: "Europe" },
  { city: "Florence", country: "Italy", region: "Europe" },
  { city: "Madrid", country: "Spain", region: "Europe" },
  { city: "Lisbon", country: "Portugal", region: "Europe" },
  { city: "Dublin", country: "Ireland", region: "Europe" },
  { city: "Edinburgh", country: "United Kingdom", region: "Europe" },
  { city: "Munich", country: "Germany", region: "Europe" },
  { city: "Zurich", country: "Switzerland", region: "Europe" },
  { city: "Geneva", country: "Switzerland", region: "Europe" },
  { city: "Copenhagen", country: "Denmark", region: "Europe" },
  { city: "Stockholm", country: "Sweden", region: "Europe" },
  { city: "Oslo", country: "Norway", region: "Europe" },
  { city: "Helsinki", country: "Finland", region: "Europe" },
  { city: "Athens", country: "Greece", region: "Europe" },
  { city: "Santorini", country: "Greece", region: "Europe" },
  { city: "Budapest", country: "Hungary", region: "Europe" },
  { city: "Warsaw", country: "Poland", region: "Europe" },
  { city: "Krakow", country: "Poland", region: "Europe" },
  { city: "Brussels", country: "Belgium", region: "Europe" },
  { city: "Milan", country: "Italy", region: "Europe" },
  { city: "Nice", country: "France", region: "Europe" },
  { city: "Monaco", country: "Monaco", region: "Europe" },
  // Additional European cities from list
  { city: "Interlaken", country: "Switzerland", region: "Europe" },
  { city: "Lucerne", country: "Switzerland", region: "Europe" },
  { city: "Hallstatt", country: "Austria", region: "Europe" },
  { city: "Salzburg", country: "Austria", region: "Europe" },
  { city: "Innsbruck", country: "Austria", region: "Europe" },
  { city: "Amalfi Coast", country: "Italy", region: "Europe" },
  { city: "Cinque Terre", country: "Italy", region: "Europe" },
  { city: "Sorrento", country: "Italy", region: "Europe" },
  { city: "Capri", country: "Italy", region: "Europe" },
  { city: "Naples", country: "Italy", region: "Europe" },
  { city: "Mykonos", country: "Greece", region: "Europe" },
  { city: "Dubrovnik", country: "Croatia", region: "Europe" },
  { city: "Split", country: "Croatia", region: "Europe" },
  { city: "Reykjavik", country: "Iceland", region: "Europe" },
  { city: "Bruges", country: "Belgium", region: "Europe" },
  { city: "Porto", country: "Portugal", region: "Europe" },
  { city: "Seville", country: "Spain", region: "Europe" },
  { city: "Granada", country: "Spain", region: "Europe" },
  { city: "Valencia", country: "Spain", region: "Europe" },
  { city: "Ibiza", country: "Spain", region: "Europe" },
  { city: "Mallorca", country: "Spain", region: "Europe" },
  { city: "Frankfurt", country: "Germany", region: "Europe" },
  { city: "Hamburg", country: "Germany", region: "Europe" },
  { city: "Cologne", country: "Germany", region: "Europe" },
  { city: "Lyon", country: "France", region: "Europe" },
  { city: "Marseille", country: "France", region: "Europe" },
  { city: "Bordeaux", country: "France", region: "Europe" },
  { city: "Cannes", country: "France", region: "Europe" },
  { city: "St. Tropez", country: "France", region: "Europe" },
  { city: "Provence", country: "France", region: "Europe" },
  { city: "Versailles", country: "France", region: "Europe" },
  { city: "Mont Saint-Michel", country: "France", region: "Europe" },
  { city: "Glasgow", country: "United Kingdom", region: "Europe" },
  { city: "Liverpool", country: "United Kingdom", region: "Europe" },
  { city: "Manchester", country: "United Kingdom", region: "Europe" },
  { city: "Cambridge", country: "United Kingdom", region: "Europe" },
  { city: "Oxford", country: "United Kingdom", region: "Europe" },
  { city: "Bath", country: "United Kingdom", region: "Europe" },
  { city: "Stonehenge", country: "United Kingdom", region: "Europe" },
  { city: "Lake District", country: "United Kingdom", region: "Europe" },
  { city: "Scottish Highlands", country: "United Kingdom", region: "Europe" },
  
  // North America
  { city: "New York", country: "United States", region: "North America" },
  { city: "Los Angeles", country: "United States", region: "North America" },
  { city: "Las Vegas", country: "United States", region: "North America" },
  { city: "San Francisco", country: "United States", region: "North America" },
  { city: "Miami", country: "United States", region: "North America" },
  { city: "Orlando", country: "United States", region: "North America" },
  { city: "Chicago", country: "United States", region: "North America" },
  { city: "Toronto", country: "Canada", region: "North America" },
  { city: "Vancouver", country: "Canada", region: "North America" },
  { city: "Montreal", country: "Canada", region: "North America" },
  { city: "Cancun", country: "Mexico", region: "North America" },
  { city: "Mexico City", country: "Mexico", region: "North America" },
  { city: "Honolulu", country: "United States", region: "North America" },
  { city: "Boston", country: "United States", region: "North America" },
  { city: "Washington DC", country: "United States", region: "North America" },
  { city: "Seattle", country: "United States", region: "North America" },
  // Additional North American cities
  { city: "San Diego", country: "United States", region: "North America" },
  { city: "Denver", country: "United States", region: "North America" },
  { city: "Atlanta", country: "United States", region: "North America" },
  { city: "Houston", country: "United States", region: "North America" },
  { city: "Dallas", country: "United States", region: "North America" },
  { city: "Austin", country: "United States", region: "North America" },
  { city: "Nashville", country: "United States", region: "North America" },
  { city: "New Orleans", country: "United States", region: "North America" },
  { city: "Philadelphia", country: "United States", region: "North America" },
  { city: "Phoenix", country: "United States", region: "North America" },
  { city: "Portland", country: "United States", region: "North America" },
  { city: "Grand Canyon", country: "United States", region: "North America" },
  { city: "Yellowstone", country: "United States", region: "North America" },
  { city: "Yosemite", country: "United States", region: "North America" },
  { city: "Niagara Falls", country: "United States", region: "North America" },
  { city: "Key West", country: "United States", region: "North America" },
  { city: "Maui", country: "United States", region: "North America" },
  { city: "Aspen", country: "United States", region: "North America" },
  { city: "Napa Valley", country: "United States", region: "North America" },
  { city: "Alaska", country: "United States", region: "North America" },
  { city: "Calgary", country: "Canada", region: "North America" },
  { city: "Ottawa", country: "Canada", region: "North America" },
  { city: "Quebec City", country: "Canada", region: "North America" },
  { city: "Victoria", country: "Canada", region: "North America" },
  { city: "Banff", country: "Canada", region: "North America" },
  { city: "Whistler", country: "Canada", region: "North America" },
  { city: "Niagara Falls", country: "Canada", region: "North America" },
  { city: "Halifax", country: "Canada", region: "North America" },
  { city: "Tulum", country: "Mexico", region: "North America" },
  { city: "Playa del Carmen", country: "Mexico", region: "North America" },
  { city: "Cozumel", country: "Mexico", region: "North America" },
  { city: "Los Cabos", country: "Mexico", region: "North America" },
  { city: "Puerto Vallarta", country: "Mexico", region: "North America" },
  { city: "Oaxaca", country: "Mexico", region: "North America" },
  { city: "Guadalajara", country: "Mexico", region: "North America" },
  { city: "San Miguel de Allende", country: "Mexico", region: "North America" },
  { city: "Costa Rica", country: "Costa Rica", region: "North America" },
  { city: "San Jose", country: "Costa Rica", region: "North America" },
  { city: "Arenal", country: "Costa Rica", region: "North America" },
  { city: "Panama City", country: "Panama", region: "North America" },
  { city: "Belize City", country: "Belize", region: "North America" },
  { city: "Antigua", country: "Guatemala", region: "North America" },
  { city: "Guatemala City", country: "Guatemala", region: "North America" },
  
  // Middle East
  { city: "Dubai", country: "UAE", region: "Middle East" },
  { city: "Abu Dhabi", country: "UAE", region: "Middle East" },
  { city: "Doha", country: "Qatar", region: "Middle East" },
  { city: "Istanbul", country: "Turkey", region: "Middle East" },
  { city: "Tel Aviv", country: "Israel", region: "Middle East" },
  { city: "Jerusalem", country: "Israel", region: "Middle East" },
  { city: "Amman", country: "Jordan", region: "Middle East" },
  { city: "Riyadh", country: "Saudi Arabia", region: "Middle East" },
  { city: "Muscat", country: "Oman", region: "Middle East" },
  { city: "Bahrain", country: "Bahrain", region: "Middle East" },
  // Additional Middle East cities
  { city: "Petra", country: "Jordan", region: "Middle East" },
  { city: "Dead Sea", country: "Jordan", region: "Middle East" },
  { city: "Wadi Rum", country: "Jordan", region: "Middle East" },
  { city: "Cappadocia", country: "Turkey", region: "Middle East" },
  { city: "Antalya", country: "Turkey", region: "Middle East" },
  { city: "Bodrum", country: "Turkey", region: "Middle East" },
  { city: "Izmir", country: "Turkey", region: "Middle East" },
  { city: "Pamukkale", country: "Turkey", region: "Middle East" },
  { city: "Ephesus", country: "Turkey", region: "Middle East" },
  { city: "Jeddah", country: "Saudi Arabia", region: "Middle East" },
  { city: "Mecca", country: "Saudi Arabia", region: "Middle East" },
  { city: "Medina", country: "Saudi Arabia", region: "Middle East" },
  { city: "Kuwait City", country: "Kuwait", region: "Middle East" },
  { city: "Manama", country: "Bahrain", region: "Middle East" },
  { city: "Sharjah", country: "UAE", region: "Middle East" },
  { city: "Ras Al Khaimah", country: "UAE", region: "Middle East" },
  { city: "Fujairah", country: "UAE", region: "Middle East" },
  { city: "Salalah", country: "Oman", region: "Middle East" },
  { city: "Beirut", country: "Lebanon", region: "Middle East" },
  { city: "Byblos", country: "Lebanon", region: "Middle East" },
  { city: "Tehran", country: "Iran", region: "Middle East" },
  { city: "Isfahan", country: "Iran", region: "Middle East" },
  { city: "Shiraz", country: "Iran", region: "Middle East" },
  
  // South America
  { city: "Rio de Janeiro", country: "Brazil", region: "South America" },
  { city: "São Paulo", country: "Brazil", region: "South America" },
  { city: "Buenos Aires", country: "Argentina", region: "South America" },
  { city: "Lima", country: "Peru", region: "South America" },
  { city: "Cusco", country: "Peru", region: "South America" },
  { city: "Bogota", country: "Colombia", region: "South America" },
  { city: "Cartagena", country: "Colombia", region: "South America" },
  { city: "Santiago", country: "Chile", region: "South America" },
  { city: "Quito", country: "Ecuador", region: "South America" },
  { city: "Montevideo", country: "Uruguay", region: "South America" },
  // Additional South America cities
  { city: "Machu Picchu", country: "Peru", region: "South America" },
  { city: "Galapagos Islands", country: "Ecuador", region: "South America" },
  { city: "Patagonia", country: "Argentina", region: "South America" },
  { city: "Iguazu Falls", country: "Argentina", region: "South America" },
  { city: "Mendoza", country: "Argentina", region: "South America" },
  { city: "Bariloche", country: "Argentina", region: "South America" },
  { city: "Medellin", country: "Colombia", region: "South America" },
  { city: "Salvador", country: "Brazil", region: "South America" },
  { city: "Florianopolis", country: "Brazil", region: "South America" },
  { city: "Foz do Iguacu", country: "Brazil", region: "South America" },
  { city: "La Paz", country: "Bolivia", region: "South America" },
  { city: "Salar de Uyuni", country: "Bolivia", region: "South America" },
  { city: "Atacama Desert", country: "Chile", region: "South America" },
  { city: "Valparaiso", country: "Chile", region: "South America" },
  { city: "Torres del Paine", country: "Chile", region: "South America" },
  { city: "Easter Island", country: "Chile", region: "South America" },
  { city: "Caracas", country: "Venezuela", region: "South America" },
  { city: "Angel Falls", country: "Venezuela", region: "South America" },
  
  // Africa
  { city: "Cape Town", country: "South Africa", region: "Africa" },
  { city: "Johannesburg", country: "South Africa", region: "Africa" },
  { city: "Cairo", country: "Egypt", region: "Africa" },
  { city: "Marrakech", country: "Morocco", region: "Africa" },
  { city: "Casablanca", country: "Morocco", region: "Africa" },
  { city: "Nairobi", country: "Kenya", region: "Africa" },
  { city: "Zanzibar", country: "Tanzania", region: "Africa" },
  { city: "Victoria Falls", country: "Zimbabwe", region: "Africa" },
  { city: "Mauritius", country: "Mauritius", region: "Africa" },
  { city: "Seychelles", country: "Seychelles", region: "Africa" },
  // Additional Africa cities
  { city: "Durban", country: "South Africa", region: "Africa" },
  { city: "Kruger National Park", country: "South Africa", region: "Africa" },
  { city: "Garden Route", country: "South Africa", region: "Africa" },
  { city: "Stellenbosch", country: "South Africa", region: "Africa" },
  { city: "Luxor", country: "Egypt", region: "Africa" },
  { city: "Giza", country: "Egypt", region: "Africa" },
  { city: "Alexandria", country: "Egypt", region: "Africa" },
  { city: "Sharm El Sheikh", country: "Egypt", region: "Africa" },
  { city: "Hurghada", country: "Egypt", region: "Africa" },
  { city: "Aswan", country: "Egypt", region: "Africa" },
  { city: "Fes", country: "Morocco", region: "Africa" },
  { city: "Chefchaouen", country: "Morocco", region: "Africa" },
  { city: "Essaouira", country: "Morocco", region: "Africa" },
  { city: "Agadir", country: "Morocco", region: "Africa" },
  { city: "Tangier", country: "Morocco", region: "Africa" },
  { city: "Masai Mara", country: "Kenya", region: "Africa" },
  { city: "Mombasa", country: "Kenya", region: "Africa" },
  { city: "Serengeti", country: "Tanzania", region: "Africa" },
  { city: "Kilimanjaro", country: "Tanzania", region: "Africa" },
  { city: "Dar es Salaam", country: "Tanzania", region: "Africa" },
  { city: "Ngorongoro Crater", country: "Tanzania", region: "Africa" },
  { city: "Accra", country: "Ghana", region: "Africa" },
  { city: "Lagos", country: "Nigeria", region: "Africa" },
  { city: "Dakar", country: "Senegal", region: "Africa" },
  { city: "Kigali", country: "Rwanda", region: "Africa" },
  { city: "Gorilla Trekking", country: "Rwanda", region: "Africa" },
  { city: "Addis Ababa", country: "Ethiopia", region: "Africa" },
  { city: "Lalibela", country: "Ethiopia", region: "Africa" },
  { city: "Windhoek", country: "Namibia", region: "Africa" },
  { city: "Sossusvlei", country: "Namibia", region: "Africa" },
  { city: "Etosha", country: "Namibia", region: "Africa" },
  { city: "Okavango Delta", country: "Botswana", region: "Africa" },
  { city: "Chobe", country: "Botswana", region: "Africa" },
  { city: "Livingstone", country: "Zambia", region: "Africa" },
  
  // Caribbean
  { city: "Jamaica", country: "Jamaica", region: "Caribbean" },
  { city: "Montego Bay", country: "Jamaica", region: "Caribbean" },
  { city: "Punta Cana", country: "Dominican Republic", region: "Caribbean" },
  { city: "Santo Domingo", country: "Dominican Republic", region: "Caribbean" },
  { city: "Bahamas", country: "Bahamas", region: "Caribbean" },
  { city: "Nassau", country: "Bahamas", region: "Caribbean" },
  { city: "Aruba", country: "Aruba", region: "Caribbean" },
  { city: "Curacao", country: "Curacao", region: "Caribbean" },
  { city: "Barbados", country: "Barbados", region: "Caribbean" },
  { city: "St. Lucia", country: "St. Lucia", region: "Caribbean" },
  { city: "Turks and Caicos", country: "Turks and Caicos", region: "Caribbean" },
  { city: "Cayman Islands", country: "Cayman Islands", region: "Caribbean" },
  { city: "Puerto Rico", country: "Puerto Rico", region: "Caribbean" },
  { city: "San Juan", country: "Puerto Rico", region: "Caribbean" },
  { city: "Cuba", country: "Cuba", region: "Caribbean" },
  { city: "Havana", country: "Cuba", region: "Caribbean" },
  { city: "Trinidad", country: "Trinidad and Tobago", region: "Caribbean" },
  { city: "Virgin Islands", country: "US Virgin Islands", region: "Caribbean" },
  { city: "Antigua", country: "Antigua and Barbuda", region: "Caribbean" },
  { city: "St. Maarten", country: "St. Maarten", region: "Caribbean" },
];

// ============================================
// INDIA - ALL 113 MAJOR CITIES (Complete List)
// ============================================
export const INDIA_CITIES = [
  // Mega Cities & State Capitals
  { city: "Mumbai", state: "Maharashtra", isCapital: true },
  { city: "Delhi", state: "Delhi", isCapital: true },
  { city: "New Delhi", state: "Delhi", isCapital: true },
  { city: "Bengaluru", state: "Karnataka", isCapital: true },
  { city: "Bangalore", state: "Karnataka", isCapital: true }, // Alternate name
  { city: "Chennai", state: "Tamil Nadu", isCapital: true },
  { city: "Kolkata", state: "West Bengal", isCapital: true },
  { city: "Hyderabad", state: "Telangana", isCapital: true },
  { city: "Pune", state: "Maharashtra", isCapital: false },
  { city: "Ahmedabad", state: "Gujarat", isCapital: false },
  { city: "Surat", state: "Gujarat", isCapital: false },
  { city: "Jaipur", state: "Rajasthan", isCapital: true },
  { city: "Lucknow", state: "Uttar Pradesh", isCapital: true },
  { city: "Kanpur", state: "Uttar Pradesh", isCapital: false },
  { city: "Nagpur", state: "Maharashtra", isCapital: false },
  { city: "Indore", state: "Madhya Pradesh", isCapital: false },
  { city: "Thane", state: "Maharashtra", isCapital: false },
  { city: "Bhopal", state: "Madhya Pradesh", isCapital: true },
  { city: "Visakhapatnam", state: "Andhra Pradesh", isCapital: false },
  { city: "Pimpri-Chinchwad", state: "Maharashtra", isCapital: false },
  { city: "Patna", state: "Bihar", isCapital: true },
  { city: "Vadodara", state: "Gujarat", isCapital: false },
  { city: "Ghaziabad", state: "Uttar Pradesh", isCapital: false },
  { city: "Ludhiana", state: "Punjab", isCapital: false },
  { city: "Agra", state: "Uttar Pradesh", isCapital: false },
  { city: "Nashik", state: "Maharashtra", isCapital: false },
  { city: "Faridabad", state: "Haryana", isCapital: false },
  { city: "Meerut", state: "Uttar Pradesh", isCapital: false },
  { city: "Rajkot", state: "Gujarat", isCapital: false },
  { city: "Kalyan-Dombivli", state: "Maharashtra", isCapital: false },
  { city: "Vasai-Virar", state: "Maharashtra", isCapital: false },
  { city: "Varanasi", state: "Uttar Pradesh", isCapital: false },
  { city: "Srinagar", state: "Jammu & Kashmir", isCapital: true },
  { city: "Aurangabad", state: "Maharashtra", isCapital: false },
  { city: "Dhanbad", state: "Jharkhand", isCapital: false },
  { city: "Amritsar", state: "Punjab", isCapital: false },
  { city: "Navi Mumbai", state: "Maharashtra", isCapital: false },
  { city: "Prayagraj", state: "Uttar Pradesh", isCapital: false },
  { city: "Allahabad", state: "Uttar Pradesh", isCapital: false }, // Old name
  { city: "Ranchi", state: "Jharkhand", isCapital: true },
  { city: "Jamshedpur", state: "Jharkhand", isCapital: true },
  { city: "Howrah", state: "West Bengal", isCapital: false },
  { city: "Coimbatore", state: "Tamil Nadu", isCapital: false },
  { city: "Jodhpur", state: "Rajasthan", isCapital: false },
  { city: "Madurai", state: "Tamil Nadu", isCapital: false },
  { city: "Raipur", state: "Chhattisgarh", isCapital: true },
  { city: "Kota", state: "Rajasthan", isCapital: false },
  { city: "Guwahati", state: "Assam", isCapital: false },
  { city: "Chandigarh", state: "Chandigarh", isCapital: true },
  { city: "Solapur", state: "Maharashtra", isCapital: false },
  { city: "Hubballi-Dharwad", state: "Karnataka", isCapital: false },
  { city: "Hubli", state: "Karnataka", isCapital: false }, // Alternate name
  { city: "Bareilly", state: "Uttar Pradesh", isCapital: false },
  { city: "Mysuru", state: "Karnataka", isCapital: false },
  { city: "Mysore", state: "Karnataka", isCapital: false }, // Alternate name
  { city: "Tiruchirappalli", state: "Tamil Nadu", isCapital: false },
  { city: "Trichy", state: "Tamil Nadu", isCapital: false }, // Alternate name
  { city: "Gwalior", state: "Madhya Pradesh", isCapital: false },
  { city: "Tiruppur", state: "Tamil Nadu", isCapital: false },
  { city: "Jabalpur", state: "Madhya Pradesh", isCapital: false },
  { city: "Moradabad", state: "Uttar Pradesh", isCapital: false },
  { city: "Salem", state: "Tamil Nadu", isCapital: false },
  { city: "Aligarh", state: "Uttar Pradesh", isCapital: false },
  { city: "Noida", state: "Uttar Pradesh", isCapital: false },
  { city: "Jamshedpur", state: "Jharkhand", isCapital: false },
  { city: "Cuttack", state: "Odisha", isCapital: false },
  { city: "Kurnool", state: "Andhra Pradesh", isCapital: false },
  { city: "Bikaner", state: "Rajasthan", isCapital: false },
  { city: "Bhilai", state: "Chhattisgarh", isCapital: false },
  { city: "Warangal", state: "Telangana", isCapital: false },
  { city: "Guntur", state: "Andhra Pradesh", isCapital: false },
  { city: "Amravati", state: "Maharashtra", isCapital: false },
  { city: "Gorakhpur", state: "Uttar Pradesh", isCapital: false },
  { city: "Durgapur", state: "West Bengal", isCapital: false },
  { city: "Asansol", state: "West Bengal", isCapital: false },
  { city: "Tirupati", state: "Andhra Pradesh", isCapital: false },
  { city: "Ajmer", state: "Rajasthan", isCapital: false },
  { city: "Vijayawada", state: "Andhra Pradesh", isCapital: false },
  { city: "Dehradun", state: "Uttarakhand", isCapital: true },
  { city: "Kolhapur", state: "Maharashtra", isCapital: false },
  { city: "Saharanpur", state: "Uttar Pradesh", isCapital: false },
  { city: "Jamnagar", state: "Gujarat", isCapital: false },
  { city: "Nanded", state: "Maharashtra", isCapital: false },
  { city: "Ujjain", state: "Madhya Pradesh", isCapital: false },
  { city: "Bokaro", state: "Jharkhand", isCapital: false },
  { city: "Siliguri", state: "West Bengal", isCapital: false },
  { city: "Sangli", state: "Maharashtra", isCapital: false },
  { city: "Belgaum", state: "Karnataka", isCapital: false },
  { city: "Belagavi", state: "Karnataka", isCapital: false }, // New name
  { city: "Mangalore", state: "Karnataka", isCapital: false },
  { city: "Mangaluru", state: "Karnataka", isCapital: false }, // Official name
  { city: "Kochi", state: "Kerala", isCapital: false },
  { city: "Kozhikode", state: "Kerala", isCapital: false },
  { city: "Calicut", state: "Kerala", isCapital: false }, // Alternate name
  { city: "Thiruvananthapuram", state: "Kerala", isCapital: true },
  { city: "Trivandrum", state: "Kerala", isCapital: true }, // Alternate name
  { city: "Thrissur", state: "Kerala", isCapital: false },
  { city: "Kollam", state: "Kerala", isCapital: false },
  { city: "Palakkad", state: "Kerala", isCapital: false },
  { city: "Kannur", state: "Kerala", isCapital: false },
  { city: "Bhubaneswar", state: "Odisha", isCapital: true },
  { city: "Gandhinagar", state: "Gujarat", isCapital: true },
  { city: "Shimla", state: "Himachal Pradesh", isCapital: true },
  { city: "Jammu", state: "Jammu & Kashmir", isCapital: true },
  { city: "Leh", state: "Ladakh", isCapital: true },
  { city: "Gangtok", state: "Sikkim", isCapital: true },
  { city: "Dispur", state: "Assam", isCapital: true },
  { city: "Shillong", state: "Meghalaya", isCapital: true },
  { city: "Imphal", state: "Manipur", isCapital: true },
  { city: "Kohima", state: "Nagaland", isCapital: true },
  { city: "Aizawl", state: "Mizoram", isCapital: true },
  { city: "Itanagar", state: "Arunachal Pradesh", isCapital: true },
  { city: "Agartala", state: "Tripura", isCapital: true },
  { city: "Panaji", state: "Goa", isCapital: true },
  { city: "Amaravati", state: "Andhra Pradesh", isCapital: true },
  
  // Major Tourist Cities
  { city: "Goa", state: "Goa", isCapital: false },
  { city: "Manali", state: "Himachal Pradesh", isCapital: false },
  { city: "Udaipur", state: "Rajasthan", isCapital: false },
  { city: "Jaisalmer", state: "Rajasthan", isCapital: false },
  { city: "Rishikesh", state: "Uttarakhand", isCapital: false },
  { city: "Haridwar", state: "Uttarakhand", isCapital: false },
  { city: "Darjeeling", state: "West Bengal", isCapital: false },
  { city: "Munnar", state: "Kerala", isCapital: false },
  { city: "Alleppey", state: "Kerala", isCapital: false },
  { city: "Alappuzha", state: "Kerala", isCapital: false }, // Official name
  { city: "Hampi", state: "Karnataka", isCapital: false },
  { city: "Pondicherry", state: "Puducherry", isCapital: true },
  { city: "Puducherry", state: "Puducherry", isCapital: true }, // Official name
  { city: "Andaman Islands", state: "Andaman & Nicobar", isCapital: false },
  { city: "Port Blair", state: "Andaman & Nicobar", isCapital: true },
  { city: "Coorg", state: "Karnataka", isCapital: false },
  { city: "Ooty", state: "Tamil Nadu", isCapital: false },
  { city: "Kodaikanal", state: "Tamil Nadu", isCapital: false },
  { city: "Lonavala", state: "Maharashtra", isCapital: false },
  { city: "Mahabaleshwar", state: "Maharashtra", isCapital: false },
  { city: "Ajanta Ellora", state: "Maharashtra", isCapital: false },
  { city: "Khajuraho", state: "Madhya Pradesh", isCapital: false },
  { city: "Mount Abu", state: "Rajasthan", isCapital: false },
  { city: "Pushkar", state: "Rajasthan", isCapital: false },
  { city: "Ranthambore", state: "Rajasthan", isCapital: false },
  { city: "Nainital", state: "Uttarakhand", isCapital: false },
  { city: "Mussoorie", state: "Uttarakhand", isCapital: false },
  { city: "Jim Corbett", state: "Uttarakhand", isCapital: false },
  { city: "Kaziranga", state: "Assam", isCapital: false },
  { city: "Tawang", state: "Arunachal Pradesh", isCapital: false },
  { city: "Dalhousie", state: "Himachal Pradesh", isCapital: false },
  { city: "Dharamshala", state: "Himachal Pradesh", isCapital: false },
  { city: "McLeod Ganj", state: "Himachal Pradesh", isCapital: false },
  { city: "Kullu", state: "Himachal Pradesh", isCapital: false },
  { city: "Kasol", state: "Himachal Pradesh", isCapital: false },
  { city: "Spiti Valley", state: "Himachal Pradesh", isCapital: false },
  { city: "Lachung", state: "Sikkim", isCapital: false },
  { city: "Pelling", state: "Sikkim", isCapital: false },
  { city: "Kovalam", state: "Kerala", isCapital: false },
  { city: "Varkala", state: "Kerala", isCapital: false },
  { city: "Thekkady", state: "Kerala", isCapital: false },
  { city: "Wayanad", state: "Kerala", isCapital: false },
  { city: "Mamallapuram", state: "Tamil Nadu", isCapital: false },
  { city: "Rameswaram", state: "Tamil Nadu", isCapital: false },
  { city: "Kanyakumari", state: "Tamil Nadu", isCapital: false },
  { city: "Pondichery", state: "Puducherry", isCapital: true },
  { city: "Bodh Gaya", state: "Bihar", isCapital: false },
  { city: "Nalanda", state: "Bihar", isCapital: false },
  { city: "Rajgir", state: "Bihar", isCapital: false },
  { city: "Konark", state: "Odisha", isCapital: false },
  { city: "Puri", state: "Odisha", isCapital: false },
  { city: "Sundarbans", state: "West Bengal", isCapital: false },
  { city: "Shantiniketan", state: "West Bengal", isCapital: false },
  { city: "Mathura", state: "Uttar Pradesh", isCapital: false },
  { city: "Vrindavan", state: "Uttar Pradesh", isCapital: false },
  { city: "Ayodhya", state: "Uttar Pradesh", isCapital: false },
  { city: "Orchha", state: "Madhya Pradesh", isCapital: false },
  { city: "Pachmarhi", state: "Madhya Pradesh", isCapital: false },
  { city: "Sanchi", state: "Madhya Pradesh", isCapital: false },
  { city: "Dwarka", state: "Gujarat", isCapital: false },
  { city: "Somnath", state: "Gujarat", isCapital: false },
  { city: "Kutch", state: "Gujarat", isCapital: false },
  { city: "Rann of Kutch", state: "Gujarat", isCapital: false },
  { city: "Shirdi", state: "Maharashtra", isCapital: false },
  { city: "Alibaug", state: "Maharashtra", isCapital: false },
];

// ============================================
// UNITED STATES - STATE CAPITALS
// ============================================
export const USA_STATE_CAPITALS = [
  { city: "Montgomery", state: "Alabama" },
  { city: "Juneau", state: "Alaska" },
  { city: "Phoenix", state: "Arizona" },
  { city: "Little Rock", state: "Arkansas" },
  { city: "Sacramento", state: "California" },
  { city: "Denver", state: "Colorado" },
  { city: "Hartford", state: "Connecticut" },
  { city: "Dover", state: "Delaware" },
  { city: "Tallahassee", state: "Florida" },
  { city: "Atlanta", state: "Georgia" },
  { city: "Honolulu", state: "Hawaii" },
  { city: "Boise", state: "Idaho" },
  { city: "Springfield", state: "Illinois" },
  { city: "Indianapolis", state: "Indiana" },
  { city: "Des Moines", state: "Iowa" },
  { city: "Topeka", state: "Kansas" },
  { city: "Frankfort", state: "Kentucky" },
  { city: "Baton Rouge", state: "Louisiana" },
  { city: "Augusta", state: "Maine" },
  { city: "Annapolis", state: "Maryland" },
  { city: "Boston", state: "Massachusetts" },
  { city: "Lansing", state: "Michigan" },
  { city: "Saint Paul", state: "Minnesota" },
  { city: "Jackson", state: "Mississippi" },
  { city: "Jefferson City", state: "Missouri" },
  { city: "Helena", state: "Montana" },
  { city: "Lincoln", state: "Nebraska" },
  { city: "Carson City", state: "Nevada" },
  { city: "Concord", state: "New Hampshire" },
  { city: "Trenton", state: "New Jersey" },
  { city: "Santa Fe", state: "New Mexico" },
  { city: "Albany", state: "New York" },
  { city: "Raleigh", state: "North Carolina" },
  { city: "Bismarck", state: "North Dakota" },
  { city: "Columbus", state: "Ohio" },
  { city: "Oklahoma City", state: "Oklahoma" },
  { city: "Salem", state: "Oregon" },
  { city: "Harrisburg", state: "Pennsylvania" },
  { city: "Providence", state: "Rhode Island" },
  { city: "Columbia", state: "South Carolina" },
  { city: "Pierre", state: "South Dakota" },
  { city: "Nashville", state: "Tennessee" },
  { city: "Austin", state: "Texas" },
  { city: "Salt Lake City", state: "Utah" },
  { city: "Montpelier", state: "Vermont" },
  { city: "Richmond", state: "Virginia" },
  { city: "Olympia", state: "Washington" },
  { city: "Charleston", state: "West Virginia" },
  { city: "Madison", state: "Wisconsin" },
  { city: "Cheyenne", state: "Wyoming" },
];

// ============================================
// CANADA - PROVINCE CAPITALS
// ============================================
export const CANADA_PROVINCE_CAPITALS = [
  { city: "Ottawa", province: "Ontario", isNationalCapital: true },
  { city: "Toronto", province: "Ontario", isProvincialCapital: true },
  { city: "Quebec City", province: "Quebec", isProvincialCapital: true },
  { city: "Victoria", province: "British Columbia", isProvincialCapital: true },
  { city: "Edmonton", province: "Alberta", isProvincialCapital: true },
  { city: "Winnipeg", province: "Manitoba", isProvincialCapital: true },
  { city: "Regina", province: "Saskatchewan", isProvincialCapital: true },
  { city: "Halifax", province: "Nova Scotia", isProvincialCapital: true },
  { city: "Fredericton", province: "New Brunswick", isProvincialCapital: true },
  { city: "Charlottetown", province: "Prince Edward Island", isProvincialCapital: true },
  { city: "St. John's", province: "Newfoundland and Labrador", isProvincialCapital: true },
  { city: "Whitehorse", province: "Yukon", isProvincialCapital: true },
  { city: "Yellowknife", province: "Northwest Territories", isProvincialCapital: true },
  { city: "Iqaluit", province: "Nunavut", isProvincialCapital: true },
  { city: "Calgary", province: "Alberta", isProvincialCapital: false },
  { city: "Vancouver", province: "British Columbia", isProvincialCapital: false },
  { city: "Montreal", province: "Quebec", isProvincialCapital: false },
];

// ============================================
// AUSTRALIA - STATE CAPITALS
// ============================================
export const AUSTRALIA_STATE_CAPITALS = [
  { city: "Canberra", state: "Australian Capital Territory", isNationalCapital: true },
  { city: "Sydney", state: "New South Wales", isStateCapital: true },
  { city: "Melbourne", state: "Victoria", isStateCapital: true },
  { city: "Brisbane", state: "Queensland", isStateCapital: true },
  { city: "Perth", state: "Western Australia", isStateCapital: true },
  { city: "Adelaide", state: "South Australia", isStateCapital: true },
  { city: "Hobart", state: "Tasmania", isStateCapital: true },
  { city: "Darwin", state: "Northern Territory", isStateCapital: true },
  { city: "Gold Coast", state: "Queensland", isStateCapital: false },
  { city: "Cairns", state: "Queensland", isStateCapital: false },
];

// ============================================
// EUROPE - COUNTRY CAPITALS
// ============================================
export const EUROPE_CAPITALS = [
  { city: "London", country: "United Kingdom" },
  { city: "Paris", country: "France" },
  { city: "Berlin", country: "Germany" },
  { city: "Rome", country: "Italy" },
  { city: "Madrid", country: "Spain" },
  { city: "Lisbon", country: "Portugal" },
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Brussels", country: "Belgium" },
  { city: "Vienna", country: "Austria" },
  { city: "Bern", country: "Switzerland" },
  { city: "Prague", country: "Czech Republic" },
  { city: "Warsaw", country: "Poland" },
  { city: "Budapest", country: "Hungary" },
  { city: "Athens", country: "Greece" },
  { city: "Dublin", country: "Ireland" },
  { city: "Copenhagen", country: "Denmark" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Oslo", country: "Norway" },
  { city: "Helsinki", country: "Finland" },
  { city: "Reykjavik", country: "Iceland" },
  { city: "Moscow", country: "Russia" },
  { city: "Kyiv", country: "Ukraine" },
  { city: "Bucharest", country: "Romania" },
  { city: "Sofia", country: "Bulgaria" },
  { city: "Belgrade", country: "Serbia" },
  { city: "Zagreb", country: "Croatia" },
  { city: "Ljubljana", country: "Slovenia" },
  { city: "Sarajevo", country: "Bosnia and Herzegovina" },
  { city: "Bratislava", country: "Slovakia" },
  { city: "Tallinn", country: "Estonia" },
  { city: "Riga", country: "Latvia" },
  { city: "Vilnius", country: "Lithuania" },
  { city: "Valletta", country: "Malta" },
  { city: "Luxembourg City", country: "Luxembourg" },
  { city: "Monaco", country: "Monaco" },
  { city: "Andorra la Vella", country: "Andorra" },
];

// ============================================
// ASIA - COUNTRY CAPITALS
// ============================================
export const ASIA_CAPITALS = [
  { city: "New Delhi", country: "India" },
  { city: "Jamshedpur", country: "India" },
  { city: "Beijing", country: "China" },
  { city: "Tokyo", country: "Japan" },
  { city: "Seoul", country: "South Korea" },
  { city: "Pyongyang", country: "North Korea" },
  { city: "Bangkok", country: "Thailand" },
  { city: "Hanoi", country: "Vietnam" },
  { city: "Jakarta", country: "Indonesia" },
  { city: "Kuala Lumpur", country: "Malaysia" },
  { city: "Singapore", country: "Singapore" },
  { city: "Manila", country: "Philippines" },
  { city: "Taipei", country: "Taiwan" },
  { city: "Dhaka", country: "Bangladesh" },
  { city: "Colombo", country: "Sri Lanka" },
  { city: "Kathmandu", country: "Nepal" },
  { city: "Thimphu", country: "Bhutan" },
  { city: "Naypyidaw", country: "Myanmar" },
  { city: "Phnom Penh", country: "Cambodia" },
  { city: "Vientiane", country: "Laos" },
  { city: "Ulaanbaatar", country: "Mongolia" },
  { city: "Islamabad", country: "Pakistan" },
  { city: "Kabul", country: "Afghanistan" },
  { city: "Male", country: "Maldives" },
  { city: "Bandar Seri Begawan", country: "Brunei" },
  { city: "Dili", country: "Timor-Leste" },
];

// ============================================
// MIDDLE EAST - COUNTRY CAPITALS
// ============================================
export const MIDDLE_EAST_CAPITALS = [
  { city: "Riyadh", country: "Saudi Arabia" },
  { city: "Abu Dhabi", country: "UAE" },
  { city: "Dubai", country: "UAE" },
  { city: "Doha", country: "Qatar" },
  { city: "Kuwait City", country: "Kuwait" },
  { city: "Manama", country: "Bahrain" },
  { city: "Muscat", country: "Oman" },
  { city: "Ankara", country: "Turkey" },
  { city: "Tehran", country: "Iran" },
  { city: "Baghdad", country: "Iraq" },
  { city: "Damascus", country: "Syria" },
  { city: "Amman", country: "Jordan" },
  { city: "Beirut", country: "Lebanon" },
  { city: "Jerusalem", country: "Israel" },
  { city: "Tel Aviv", country: "Israel" },
  { city: "Sanaa", country: "Yemen" },
];

// ============================================
// SOUTH AMERICA - COUNTRY CAPITALS
// ============================================
export const SOUTH_AMERICA_CAPITALS = [
  { city: "Brasília", country: "Brazil" },
  { city: "Buenos Aires", country: "Argentina" },
  { city: "Santiago", country: "Chile" },
  { city: "Lima", country: "Peru" },
  { city: "Bogotá", country: "Colombia" },
  { city: "Caracas", country: "Venezuela" },
  { city: "Quito", country: "Ecuador" },
  { city: "La Paz", country: "Bolivia" },
  { city: "Asunción", country: "Paraguay" },
  { city: "Montevideo", country: "Uruguay" },
  { city: "Georgetown", country: "Guyana" },
  { city: "Paramaribo", country: "Suriname" },
  { city: "Cayenne", country: "French Guiana" },
  { city: "São Paulo", country: "Brazil" },
  { city: "Rio de Janeiro", country: "Brazil" },
];

// ============================================
// AFRICA - COUNTRY CAPITALS
// ============================================
export const AFRICA_CAPITALS = [
  { city: "Cairo", country: "Egypt" },
  { city: "Pretoria", country: "South Africa" },
  { city: "Cape Town", country: "South Africa" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Lagos", country: "Nigeria" },
  { city: "Abuja", country: "Nigeria" },
  { city: "Casablanca", country: "Morocco" },
  { city: "Rabat", country: "Morocco" },
  { city: "Tunis", country: "Tunisia" },
  { city: "Algiers", country: "Algeria" },
  { city: "Addis Ababa", country: "Ethiopia" },
  { city: "Dar es Salaam", country: "Tanzania" },
  { city: "Accra", country: "Ghana" },
  { city: "Dakar", country: "Senegal" },
  { city: "Kampala", country: "Uganda" },
  { city: "Kigali", country: "Rwanda" },
  { city: "Lusaka", country: "Zambia" },
  { city: "Harare", country: "Zimbabwe" },
  { city: "Maputo", country: "Mozambique" },
  { city: "Luanda", country: "Angola" },
  { city: "Kinshasa", country: "DR Congo" },
  { city: "Port Louis", country: "Mauritius" },
  { city: "Antananarivo", country: "Madagascar" },
];

// ============================================
// CENTRAL AMERICA & CARIBBEAN
// ============================================
export const CENTRAL_AMERICA_CARIBBEAN = [
  { city: "Mexico City", country: "Mexico" },
  { city: "Cancun", country: "Mexico" },
  { city: "Guatemala City", country: "Guatemala" },
  { city: "Tegucigalpa", country: "Honduras" },
  { city: "San Salvador", country: "El Salvador" },
  { city: "Managua", country: "Nicaragua" },
  { city: "San José", country: "Costa Rica" },
  { city: "Panama City", country: "Panama" },
  { city: "Havana", country: "Cuba" },
  { city: "Kingston", country: "Jamaica" },
  { city: "Nassau", country: "Bahamas" },
  { city: "Santo Domingo", country: "Dominican Republic" },
  { city: "Port-au-Prince", country: "Haiti" },
  { city: "San Juan", country: "Puerto Rico" },
  { city: "Bridgetown", country: "Barbados" },
  { city: "Port of Spain", country: "Trinidad and Tobago" },
];

// ============================================
// CHINA - PROVINCE CAPITALS
// ============================================
export const CHINA_PROVINCE_CAPITALS = [
  { city: "Beijing", province: "Beijing", isNationalCapital: true },
  { city: "Shanghai", province: "Shanghai" },
  { city: "Guangzhou", province: "Guangdong" },
  { city: "Shenzhen", province: "Guangdong" },
  { city: "Chengdu", province: "Sichuan" },
  { city: "Hangzhou", province: "Zhejiang" },
  { city: "Wuhan", province: "Hubei" },
  { city: "Xi'an", province: "Shaanxi" },
  { city: "Nanjing", province: "Jiangsu" },
  { city: "Chongqing", province: "Chongqing" },
  { city: "Tianjin", province: "Tianjin" },
  { city: "Suzhou", province: "Jiangsu" },
  { city: "Qingdao", province: "Shandong" },
  { city: "Dalian", province: "Liaoning" },
  { city: "Shenyang", province: "Liaoning" },
  { city: "Changsha", province: "Hunan" },
  { city: "Zhengzhou", province: "Henan" },
  { city: "Kunming", province: "Yunnan" },
  { city: "Guilin", province: "Guangxi" },
  { city: "Harbin", province: "Heilongjiang" },
  { city: "Lhasa", province: "Tibet" },
  { city: "Urumqi", province: "Xinjiang" },
  { city: "Hong Kong", province: "Hong Kong SAR" },
  { city: "Macau", province: "Macau SAR" },
];

// ============================================
// JAPAN - MAJOR CITIES
// ============================================
export const JAPAN_CITIES = [
  { city: "Tokyo", prefecture: "Tokyo" },
  { city: "Osaka", prefecture: "Osaka" },
  { city: "Kyoto", prefecture: "Kyoto" },
  { city: "Yokohama", prefecture: "Kanagawa" },
  { city: "Nagoya", prefecture: "Aichi" },
  { city: "Sapporo", prefecture: "Hokkaido" },
  { city: "Fukuoka", prefecture: "Fukuoka" },
  { city: "Kobe", prefecture: "Hyogo" },
  { city: "Hiroshima", prefecture: "Hiroshima" },
  { city: "Nara", prefecture: "Nara" },
  { city: "Okinawa", prefecture: "Okinawa" },
  { city: "Sendai", prefecture: "Miyagi" },
  { city: "Hakone", prefecture: "Kanagawa" },
  { city: "Nikko", prefecture: "Tochigi" },
  { city: "Kanazawa", prefecture: "Ishikawa" },
];

// ============================================
// COMBINED SEARCHABLE LIST
// ============================================
export const getAllCities = () => {
  const cities = new Map(); // Use Map to avoid duplicates
  
  // Add top global cities
  TOP_GLOBAL_CITIES.forEach(c => {
    cities.set(`${c.city}, ${c.country}`, { 
      label: `${c.city}, ${c.country}`,
      city: c.city,
      country: c.country,
      region: c.region,
      type: 'global'
    });
  });
  
  // Add India cities
  INDIA_CITIES.forEach(c => {
    cities.set(`${c.city}, India`, {
      label: c.state ? `${c.city}, ${c.state}, India` : `${c.city}, India`,
      city: c.city,
      country: 'India',
      state: c.state,
      isCapital: c.isCapital,
      type: 'india'
    });
  });
  
  // Add USA state capitals
  USA_STATE_CAPITALS.forEach(c => {
    cities.set(`${c.city}, USA`, {
      label: `${c.city}, ${c.state}, USA`,
      city: c.city,
      country: 'United States',
      state: c.state,
      isCapital: true,
      type: 'usa'
    });
  });
  
  // Add Canada cities
  CANADA_PROVINCE_CAPITALS.forEach(c => {
    cities.set(`${c.city}, Canada`, {
      label: `${c.city}, ${c.province}, Canada`,
      city: c.city,
      country: 'Canada',
      province: c.province,
      isCapital: c.isProvincialCapital || c.isNationalCapital,
      type: 'canada'
    });
  });
  
  // Add Australia cities
  AUSTRALIA_STATE_CAPITALS.forEach(c => {
    cities.set(`${c.city}, Australia`, {
      label: `${c.city}, ${c.state}, Australia`,
      city: c.city,
      country: 'Australia',
      state: c.state,
      isCapital: c.isStateCapital || c.isNationalCapital,
      type: 'australia'
    });
  });
  
  // Add Europe capitals
  EUROPE_CAPITALS.forEach(c => {
    cities.set(`${c.city}, ${c.country}`, {
      label: `${c.city}, ${c.country}`,
      city: c.city,
      country: c.country,
      isCapital: true,
      type: 'europe'
    });
  });
  
  // Add Asia capitals
  ASIA_CAPITALS.forEach(c => {
    cities.set(`${c.city}, ${c.country}`, {
      label: `${c.city}, ${c.country}`,
      city: c.city,
      country: c.country,
      isCapital: true,
      type: 'asia'
    });
  });
  
  // Add Middle East capitals
  MIDDLE_EAST_CAPITALS.forEach(c => {
    cities.set(`${c.city}, ${c.country}`, {
      label: `${c.city}, ${c.country}`,
      city: c.city,
      country: c.country,
      isCapital: true,
      type: 'middleeast'
    });
  });
  
  // Add South America capitals
  SOUTH_AMERICA_CAPITALS.forEach(c => {
    cities.set(`${c.city}, ${c.country}`, {
      label: `${c.city}, ${c.country}`,
      city: c.city,
      country: c.country,
      isCapital: true,
      type: 'southamerica'
    });
  });
  
  // Add Africa capitals
  AFRICA_CAPITALS.forEach(c => {
    cities.set(`${c.city}, ${c.country}`, {
      label: `${c.city}, ${c.country}`,
      city: c.city,
      country: c.country,
      isCapital: true,
      type: 'africa'
    });
  });
  
  // Add Central America & Caribbean
  CENTRAL_AMERICA_CARIBBEAN.forEach(c => {
    cities.set(`${c.city}, ${c.country}`, {
      label: `${c.city}, ${c.country}`,
      city: c.city,
      country: c.country,
      isCapital: true,
      type: 'centralamerica'
    });
  });
  
  // Add China cities
  CHINA_PROVINCE_CAPITALS.forEach(c => {
    cities.set(`${c.city}, China`, {
      label: `${c.city}, ${c.province}, China`,
      city: c.city,
      country: 'China',
      province: c.province,
      isCapital: c.isNationalCapital,
      type: 'china'
    });
  });
  
  // Add Japan cities
  JAPAN_CITIES.forEach(c => {
    cities.set(`${c.city}, Japan`, {
      label: `${c.city}, ${c.prefecture}, Japan`,
      city: c.city,
      country: 'Japan',
      prefecture: c.prefecture,
      type: 'japan'
    });
  });
  
  return Array.from(cities.values()).sort((a, b) => a.label.localeCompare(b.label));
};

// Get cities by country
export const getCitiesByCountry = (country) => {
  return getAllCities().filter(c => c.country.toLowerCase() === country.toLowerCase());
};

// Search cities
export const searchCities = (query) => {
  if (!query || query.length < 2) return [];
  const lowerQuery = query.toLowerCase();
  return getAllCities().filter(c => 
    c.label.toLowerCase().includes(lowerQuery) ||
    c.city.toLowerCase().includes(lowerQuery) ||
    c.country.toLowerCase().includes(lowerQuery) ||
    (c.state && c.state.toLowerCase().includes(lowerQuery)) ||
    (c.province && c.province.toLowerCase().includes(lowerQuery))
  ).slice(0, 20); // Limit results
};

// Get total count
export const getTotalCityCount = () => getAllCities().length;

export default {
  getAllCities,
  getCitiesByCountry,
  searchCities,
  getTotalCityCount,
  TOP_GLOBAL_CITIES,
  INDIA_CITIES,
  USA_STATE_CAPITALS,
  CANADA_PROVINCE_CAPITALS,
  AUSTRALIA_STATE_CAPITALS,
  EUROPE_CAPITALS,
  ASIA_CAPITALS,
  MIDDLE_EAST_CAPITALS,
  SOUTH_AMERICA_CAPITALS,
  AFRICA_CAPITALS,
  CENTRAL_AMERICA_CARIBBEAN,
  CHINA_PROVINCE_CAPITALS,
  JAPAN_CITIES,
};
