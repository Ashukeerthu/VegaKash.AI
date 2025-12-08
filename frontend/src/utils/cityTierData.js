/**
 * City Tier & Cost-of-Living Database
 * 
 * @module utils/cityTierData
 * @description Complete city tier mapping for India and international cities
 * Includes city → tier → COL multiplier mappings
 * 
 * Usage:
 * import { getCityTier, getTierMultiplier, getCitiesByTier, getStatesCities } from './cityTierData'
 * 
 * const tier = getCityTier('Hyderabad') // Returns: { tier: 'tier_1', multiplier: 1.25 }
 * const cities = getCitiesByTier('tier_1') // Returns: [...metros]
 */

// ============================================
// TIER DEFINITIONS & COL MULTIPLIERS
// ============================================

export const TIER_DEFINITIONS = {
  tier_1: {
    name: 'Tier 1 - Metropolitan',
    description: 'Major metros with high cost of living',
    multiplier: 1.25,
    examples: 'Mumbai, Bangalore, Delhi NCR, Hyderabad',
    color: '#FF6B6B', // Red for high cost
  },
  tier_2: {
    name: 'Tier 2 - Major Cities',
    description: 'Significant cities with moderate living costs',
    multiplier: 1.05,
    examples: 'Jaipur, Lucknow, Indore, Coimbatore',
    color: '#FFA500', // Orange for moderate cost
  },
  tier_3: {
    name: 'Tier 3 - Emerging Cities',
    description: 'Developing cities with lower living costs',
    multiplier: 0.90,
    examples: 'Vizag, Mysore, Bhubaneswar, Raipur',
    color: '#4CAF50', // Green for low cost (good for savings)
  },
  other: {
    name: 'Other',
    description: 'Unknown or international cities',
    multiplier: 1.00,
    examples: 'Unknown cities',
    color: '#9E9E9E', // Gray for unknown
  },
};

// ============================================
// TIER 1 METROS (COL: 1.25)
// ============================================

export const TIER_1_CITIES = {
  India: {
    'Maharashtra': ['Mumbai', 'Pune', 'Thane', 'Nagpur', 'Navi Mumbai', 'Pimpri-Chinchwad', 'Nashik'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Delhi/NCR': ['Delhi', 'New Delhi', 'Gurgaon', 'Gurugram', 'Noida', 'Greater Noida', 'Faridabad', 'Ghaziabad', 'Dwarka'],
    'Telangana': ['Hyderabad', 'Secunderabad', 'Warangal'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
    'West Bengal': ['Kolkata', 'Howrah'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'Rajasthan': ['Jaipur'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
    'Punjab': ['Chandigarh', 'Mohali', 'Panchkula'],
  },
};

// ============================================
// TIER 2 MAJOR CITIES (COL: 1.05)
// ============================================

export const TIER_2_CITIES = {
  India: {
    'Rajasthan': ['Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad'],
    'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'],
    'Tamil Nadu': ['Salem', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi'],
    'Kerala': ['Thrissur', 'Kollam', 'Kannur', 'Palakkad'],
    'Gujarat': ['Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Anand'],
    'Haryana': ['Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    'Andhra Pradesh': ['Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Kakinada', 'Rajahmundry', 'Tirupati'],
    'Maharashtra': ['Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Sangli'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi'],
    'Assam': ['Guwahati', 'Dibrugarh', 'Jorhat', 'Silchar'],
    'West Bengal': ['Durgapur', 'Asansol', 'Siliguri'],
  },
};

// ============================================
// TIER 3 EMERGING CITIES (COL: 0.90)
// ============================================

export const TIER_3_CITIES = {
  India: {
    'Andhra Pradesh': ['Visakhapatnam', 'Vizag', 'Anantapur', 'Kadapa', 'Eluru', 'Ongole'],
    'Karnataka': ['Hubballi', 'Davangere', 'Bellary', 'Tumkur', 'Shimoga', 'Bijapur'],
    'Odisha': ['Sambalpur', 'Brahmapur', 'Puri', 'Balasore'],
    'Chhattisgarh': ['Durg', 'Rajnandgaon'],
    'Assam': ['Nagaon', 'Tezpur', 'Tinsukia'],
    'Jharkhand': ['Hazaribagh', 'Giridih', 'Deoghar'],
    'Bihar': ['Darbhanga', 'Purnia', 'Begusarai', 'Katihar', 'Saharsa'],
    'Uttarakhand': ['Rishikesh', 'Rudrapur', 'Kashipur', 'Pithoragarh'],
    'Himachal Pradesh': ['Kullu', 'Palampur', 'Bilaspur', 'Una'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
    'Tripura': ['Agartala'],
    'Meghalaya': ['Shillong'],
    'Manipur': ['Imphal'],
    'Nagaland': ['Kohima', 'Dimapur'],
    'Mizoram': ['Aizawl'],
    'Arunachal Pradesh': ['Itanagar'],
    'Sikkim': ['Gangtok'],
    'Chandigarh': ['Chandigarh'],
    'Puducherry': ['Puducherry', 'Pondicherry'],
    'Andaman and Nicobar Islands': ['Port Blair'],
    'Dadra and Nagar Haveli': ['Silvassa'],
    'Daman and Diu': ['Daman', 'Diu'],
    'Lakshadweep': ['Kavaratti'],
    'Punjab': ['Hoshiarpur', 'Kapurthala', 'Moga', 'Pathankot'],
    'Haryana': ['Karnal', 'Sonipat', 'Sirsa', 'Bhiwani'],
    'Rajasthan': ['Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Tonk'],
    'Madhya Pradesh': ['Sagar', 'Dewas', 'Ratlam', 'Satna', 'Rewa'],
    'Uttar Pradesh': ['Gorakhpur', 'Noida', 'Firozabad', 'Jhansi', 'Saharanpur', 'Muzaffarnagar', 'Mathura'],
    'Gujarat': ['Morbi', 'Surendranagar', 'Mehsana', 'Navsari'],
    'Maharashtra': ['Jalgaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar'],
    'Tamil Nadu': ['Thanjavur', 'Dindigul', 'Karur', 'Pudukkottai', 'Cuddalore'],
    'Kerala': ['Malappuram', 'Alappuzha', 'Kottayam', 'Pathanamthitta'],
    'West Bengal': ['Kharagpur', 'Burdwan', 'Haldia', 'Raiganj'],
    'Karnataka': ['Raichur', 'Bidar', 'Hassan', 'Mandya'],
  },
};

// ============================================
// INTERNATIONAL CITIES - EXPANDED DATABASE
// ============================================
// Tier 1 International: Major metropolitan hubs (COL: 1.25)
// Tier 2 International: Major cities (COL: 1.05)
// Tier 3 International: Emerging cities (COL: 0.90)

export const INTERNATIONAL_TIER_1_CITIES = {
  'United States': {
    'California': ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose', 'Oakland', 'Palo Alto', 'Mountain View', 'Sunnyvale', 'Santa Clara', 'Berkeley', 'Irvine', 'Santa Monica'],
    'New York': ['New York City', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx'],
    'Illinois': ['Chicago', 'Naperville', 'Evanston'],
    'Massachusetts': ['Boston', 'Cambridge', 'Brookline'],
    'Washington': ['Seattle', 'Bellevue', 'Redmond'],
    'District of Columbia': ['Washington DC', 'Washington'],
    'Connecticut': ['Stamford', 'Greenwich'],
    'New Jersey': ['Jersey City', 'Hoboken'],
    'Virginia': ['Arlington', 'Alexandria'],
    'Maryland': ['Bethesda', 'Rockville'],
  },
  'United Kingdom': {
    'England': ['London', 'Westminster', 'City of London', 'Camden', 'Kensington', 'Chelsea', 'Canary Wharf'],
    'Scotland': ['Edinburgh'],
  },
  'Canada': {
    'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Markham', 'Vaughan'],
    'British Columbia': ['Vancouver', 'Victoria', 'Burnaby', 'Richmond', 'Surrey'],
    'Quebec': ['Montreal', 'Laval'],
    'Alberta': ['Calgary', 'Edmonton'],
  },
  'Australia': {
    'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Parramatta'],
    'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
    'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Cairns'],
    'Western Australia': ['Perth', 'Fremantle'],
  },
  'Singapore': {
    'Central Region': ['Singapore', 'Marina Bay', 'Orchard', 'Raffles Place', 'Bugis'],
    'East Region': ['Tampines', 'Bedok', 'Pasir Ris'],
    'North Region': ['Woodlands', 'Yishun'],
    'North-East Region': ['Serangoon', 'Hougang', 'Punggol', 'Sengkang'],
    'West Region': ['Jurong East', 'Jurong West', 'Choa Chu Kang', 'Clementi'],
  },
  'UAE': {
    'Dubai': ['Dubai', 'Dubai Marina', 'Downtown Dubai', 'Jumeirah', 'Business Bay', 'DIFC', 'Palm Jumeirah', 'JBR'],
    'Abu Dhabi': ['Abu Dhabi', 'Al Ain', 'Yas Island', 'Saadiyat Island'],
    'Sharjah': ['Sharjah'],
    'Ajman': ['Ajman'],
    'Ras Al Khaimah': ['Ras Al Khaimah'],
    'Fujairah': ['Fujairah'],
    'Umm Al Quwain': ['Umm Al Quwain'],
  },
  'Germany': {
    'Berlin': ['Berlin'],
    'Bavaria': ['Munich'],
    'Hesse': ['Frankfurt'],
    'Hamburg': ['Hamburg'],
  },
  'France': {
    'Île-de-France': ['Paris', 'Versailles'],
    'Provence-Alpes-Côte d\'Azur': ['Nice', 'Cannes'],
  },
  'Japan': {
    'Tokyo': ['Tokyo', 'Shibuya', 'Shinjuku'],
    'Osaka': ['Osaka'],
  },
  'China': {
    'Shanghai': ['Shanghai', 'Pudong'],
    'Beijing': ['Beijing'],
    'Guangdong': ['Shenzhen', 'Guangzhou'],
    'Hong Kong': ['Hong Kong'],
  },
  'Switzerland': {
    'Zurich': ['Zurich'],
    'Geneva': ['Geneva'],
  },
  'Netherlands': {
    'North Holland': ['Amsterdam'],
    'South Holland': ['Rotterdam', 'The Hague'],
  },
  'Sweden': {
    'Stockholm': ['Stockholm'],
  },
  'Norway': {
    'Oslo': ['Oslo'],
  },
  'Denmark': {
    'Copenhagen': ['Copenhagen'],
  },
  'South Korea': {
    'Seoul': ['Seoul', 'Gangnam'],
    'Busan': ['Busan'],
  },
  'New Zealand': {
    'Auckland': ['Auckland'],
    'Wellington': ['Wellington'],
  },
};

export const INTERNATIONAL_TIER_2_CITIES = {
  'United States': {
    'Texas': ['Houston', 'Austin', 'Dallas', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Plano', 'Irving', 'Frisco'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Miami Beach', 'West Palm Beach', 'St. Petersburg', 'Tallahassee'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie'],
    'Arizona': ['Phoenix', 'Scottsdale', 'Tucson', 'Mesa', 'Tempe', 'Chandler', 'Gilbert'],
    'Colorado': ['Denver', 'Boulder', 'Colorado Springs', 'Aurora', 'Fort Collins'],
    'Georgia': ['Atlanta', 'Augusta', 'Savannah', 'Columbus', 'Alpharetta'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Ann Arbor'],
    'Minnesota': ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth'],
    'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Chapel Hill', 'Cary'],
    'Oregon': ['Portland', 'Eugene', 'Salem', 'Bend'],
    'Nevada': ['Las Vegas', 'Reno', 'Henderson'],
    'Tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'],
    'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay'],
    'Indiana': ['Indianapolis', 'Fort Wayne', 'Carmel'],
    'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Columbia'],
    'Utah': ['Salt Lake City', 'Provo', 'Park City'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
    'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport'],
    'Kentucky': ['Louisville', 'Lexington'],
    'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman'],
    'New Mexico': ['Albuquerque', 'Santa Fe'],
    'South Carolina': ['Charleston', 'Columbia', 'Greenville', 'Myrtle Beach'],
    'Alabama': ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile'],
    'Rhode Island': ['Providence', 'Newport'],
    'Hawaii': ['Honolulu', 'Pearl City', 'Hilo'],
    'Alaska': ['Anchorage'],
    'Maine': ['Portland'],
    'New Hampshire': ['Manchester', 'Nashua'],
    'Vermont': ['Burlington'],
    'Delaware': ['Wilmington', 'Dover'],
    'Connecticut': ['Hartford', 'New Haven', 'Bridgeport'],
    'New Jersey': ['Newark', 'Trenton', 'Atlantic City'],
    'Virginia': ['Richmond', 'Virginia Beach', 'Norfolk', 'Chesapeake'],
    'West Virginia': ['Charleston'],
    'Maryland': ['Baltimore', 'Annapolis'],
    'Iowa': ['Des Moines', 'Cedar Rapids', 'Iowa City'],
    'Kansas': ['Wichita', 'Overland Park', 'Kansas City'],
    'Nebraska': ['Omaha', 'Lincoln'],
    'Arkansas': ['Little Rock', 'Fayetteville'],
    'Mississippi': ['Jackson', 'Gulfport'],
    'Montana': ['Billings', 'Missoula'],
    'Idaho': ['Boise', 'Idaho Falls'],
    'Wyoming': ['Cheyenne', 'Casper'],
    'South Dakota': ['Sioux Falls', 'Rapid City'],
    'North Dakota': ['Fargo', 'Bismarck'],
  },
  'United Kingdom': {
    'England': ['Manchester', 'Birmingham', 'Liverpool', 'Bristol', 'Leeds', 'Sheffield', 'Newcastle', 'Nottingham', 'Leicester', 'Coventry', 'Bradford', 'Southampton', 'Portsmouth', 'Brighton', 'Oxford', 'Cambridge', 'Reading', 'Milton Keynes', 'Sunderland', 'Derby', 'York', 'Bath', 'Exeter', 'Canterbury', 'Norwich', 'Ipswich', 'Hull', 'Stoke-on-Trent', 'Wolverhampton'],
    'Scotland': ['Glasgow', 'Aberdeen', 'Dundee', 'Inverness', 'Stirling', 'Perth'],
    'Wales': ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Bangor'],
    'Northern Ireland': ['Belfast', 'Derry', 'Londonderry', 'Lisburn'],
  },
  'Canada': {
    'Ontario': ['Hamilton', 'London', 'Kitchener', 'Waterloo', 'Windsor', 'Oshawa', 'Barrie', 'Guelph', 'Kingston'],
    'British Columbia': ['Kelowna', 'Abbotsford', 'Nanaimo', 'Kamloops', 'Prince George'],
    'Alberta': ['Red Deer', 'Lethbridge', 'Medicine Hat', 'Fort McMurray'],
    'Quebec': ['Quebec City', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Trois-Rivières'],
    'Manitoba': ['Winnipeg', 'Brandon'],
    'Saskatchewan': ['Regina', 'Saskatoon', 'Prince Albert'],
    'Nova Scotia': ['Halifax', 'Dartmouth', 'Sydney'],
    'New Brunswick': ['Moncton', 'Saint John', 'Fredericton'],
    'Newfoundland and Labrador': ['St. John\'s'],
    'Prince Edward Island': ['Charlottetown'],
  },
  'Australia': {
    'New South Wales': ['Central Coast', 'Maitland', 'Wagga Wagga', 'Albury'],
    'Victoria': ['Frankston', 'Dandenong', 'Mornington', 'Warrnambool'],
    'Queensland': ['Townsville', 'Toowoomba', 'Mackay', 'Rockhampton', 'Bundaberg'],
    'South Australia': ['Adelaide', 'Mount Gambier', 'Whyalla'],
    'Western Australia': ['Mandurah', 'Bunbury', 'Geraldton', 'Kalgoorlie'],
    'Australian Capital Territory': ['Canberra'],
    'Tasmania': ['Hobart', 'Launceston', 'Burnie', 'Devonport'],
    'Northern Territory': ['Darwin', 'Alice Springs'],
  },
  'Germany': {
    'North Rhine-Westphalia': ['Cologne', 'Dusseldorf', 'Dortmund', 'Essen'],
    'Baden-Württemberg': ['Stuttgart'],
    'Saxony': ['Leipzig', 'Dresden'],
  },
  'France': {
    'Auvergne-Rhône-Alpes': ['Lyon', 'Grenoble'],
    'Occitanie': ['Toulouse', 'Montpellier'],
    'Provence': ['Marseille'],
    'Brittany': ['Rennes'],
  },
  'Spain': {
    'Madrid': ['Madrid'],
    'Catalonia': ['Barcelona'],
    'Andalusia': ['Seville', 'Malaga'],
    'Valencia': ['Valencia'],
  },
  'Italy': {
    'Lazio': ['Rome'],
    'Lombardy': ['Milan'],
    'Campania': ['Naples'],
    'Tuscany': ['Florence'],
    'Veneto': ['Venice'],
  },
  'Poland': {
    'Mazovia': ['Warsaw'],
    'Lesser Poland': ['Krakow'],
    'Pomeranian': ['Gdansk'],
  },
  'Russia': {
    'Moscow': ['Moscow'],
    'Leningrad Oblast': ['St. Petersburg'],
  },
  'Thailand': {
    'Bangkok': ['Bangkok'],
    'Chiang Mai': ['Chiang Mai'],
    'Phuket': ['Phuket'],
  },
  'Malaysia': {
    'Kuala Lumpur': ['Kuala Lumpur'],
    'Penang': ['George Town'],
    'Johor': ['Johor Bahru'],
  },
  'Philippines': {
    'Metro Manila': ['Manila', 'Makati', 'Quezon City'],
    'Cebu': ['Cebu City'],
  },
  'Indonesia': {
    'Jakarta': ['Jakarta'],
    'Bali': ['Denpasar'],
  },
  'Vietnam': {
    'Hanoi': ['Hanoi'],
    'Ho Chi Minh': ['Ho Chi Minh City'],
  },
  'Sri Lanka': {
    'Western': ['Colombo'],
    'Central': ['Kandy'],
  },
  'Mexico': {
    'Federal District': ['Mexico City'],
    'Jalisco': ['Guadalajara'],
    'Nuevo León': ['Monterrey'],
  },
  'Brazil': {
    'São Paulo': ['São Paulo'],
    'Rio de Janeiro': ['Rio de Janeiro'],
    'Minas Gerais': ['Belo Horizonte'],
    'Bahia': ['Salvador'],
  },
  'Argentina': {
    'Buenos Aires': ['Buenos Aires'],
    'Córdoba': ['Córdoba'],
  },
  'Chile': {
    'Santiago': ['Santiago'],
  },
  'South Africa': {
    'Gauteng': ['Johannesburg', 'Pretoria'],
    'Western Cape': ['Cape Town'],
    'KwaZulu-Natal': ['Durban'],
  },
  'Nigeria': {
    'Lagos': ['Lagos'],
    'Federal Capital Territory': ['Abuja'],
  },
  'Egypt': {
    'Cairo': ['Cairo'],
    'Alexandria': ['Alexandria'],
  },
  'Turkey': {
    'Istanbul': ['Istanbul'],
    'Ankara': ['Ankara'],
    'Izmir': ['Izmir'],
  },
  'Saudi Arabia': {
    'Riyadh': ['Riyadh'],
    'Mecca': ['Jeddah'],
  },
  'Israel': {
    'Tel Aviv': ['Tel Aviv'],
    'Jerusalem': ['Jerusalem'],
  },
  'Ireland': {
    'Dublin': ['Dublin'],
    'Cork': ['Cork'],
  },
  'Belgium': {
    'Brussels': ['Brussels'],
    'Antwerp': ['Antwerp'],
  },
  'Austria': {
    'Vienna': ['Vienna'],
    'Salzburg': ['Salzburg'],
  },
  'Czech Republic': {
    'Prague': ['Prague'],
  },
  'Portugal': {
    'Lisbon': ['Lisbon'],
    'Porto': ['Porto'],
  },
  'Greece': {
    'Attica': ['Athens'],
    'Thessaloniki': ['Thessaloniki'],
  },
  'Japan': {
    'Kansai': ['Kyoto'],
  },
};

export const INTERNATIONAL_TIER_3_CITIES = {
  'United States': {
    'Ohio': ['Dayton', 'Canton', 'Youngstown'],
    'Indiana': ['Bloomington', 'Evansville', 'South Bend'],
    'Wisconsin': ['Kenosha', 'Racine', 'Appleton'],
    'Missouri': ['Independence', 'Lee\'s Summit'],
    'Tennessee': ['Murfreesboro', 'Franklin', 'Clarksville'],
    'Oklahoma': ['Broken Arrow', 'Edmond'],
    'New Mexico': ['Las Cruces', 'Rio Rancho'],
    'Louisiana': ['Lafayette', 'Lake Charles'],
    'Kentucky': ['Owensboro', 'Bowling Green'],
    'California': ['Bakersfield', 'Fresno', 'Stockton', 'Sacramento', 'Modesto', 'Riverside', 'San Bernardino'],
    'Texas': ['Lubbock', 'Amarillo', 'Corpus Christi', 'Laredo', 'McAllen'],
    'Florida': ['Pensacola', 'Gainesville', 'Lakeland', 'Daytona Beach'],
    'Arizona': ['Yuma', 'Flagstaff', 'Prescott'],
    'Colorado': ['Pueblo', 'Grand Junction'],
    'Georgia': ['Macon', 'Athens', 'Warner Robins'],
    'Michigan': ['Lansing', 'Flint', 'Kalamazoo'],
    'Minnesota': ['St. Cloud', 'Bloomington'],
    'North Carolina': ['Wilmington', 'Asheville', 'Fayetteville'],
    'Oregon': ['Medford', 'Springfield', 'Corvallis'],
    'Nevada': ['Carson City', 'Sparks'],
    'Pennsylvania': ['Scranton', 'Reading', 'Harrisburg'],
    'Illinois': ['Rockford', 'Peoria', 'Springfield'],
    'Washington': ['Spokane', 'Tacoma', 'Vancouver'],
    'New York': ['Rochester', 'Buffalo', 'Syracuse', 'Albany', 'Yonkers'],
    'Massachusetts': ['Worcester', 'Springfield', 'Lowell'],
  },
  'United Kingdom': {
    'England': ['Bournemouth', 'Poole', 'Luton', 'Basildon', 'Slough', 'Gloucester', 'Blackpool', 'Preston', 'Cheltenham', 'Peterborough', 'Northampton', 'Swindon', 'Warrington', 'Huddersfield', 'Rotherham', 'Barnsley', 'Doncaster', 'Maidstone', 'Southend-on-Sea'],
    'Scotland': ['Livingston', 'Paisley', 'East Kilbride', 'Falkirk'],
    'Wales': ['Barry', 'Neath', 'Pontypridd', 'Caerphilly'],
    'Northern Ireland': ['Newtownabbey', 'Bangor', 'Craigavon'],
  },
  'Canada': {
    'Ontario': ['Sudbury', 'Thunder Bay', 'Sarnia', 'Sault Ste. Marie', 'Belleville', 'Peterborough', 'Niagara Falls'],
    'British Columbia': ['Chilliwack', 'Vernon', 'Courtenay', 'Campbell River', 'Cranbrook'],
    'Alberta': ['Grande Prairie', 'Airdrie', 'Spruce Grove', 'Leduc'],
    'Quebec': ['Saguenay', 'Lévis', 'Drummondville', 'Granby'],
    'Manitoba': ['Thompson', 'Portage la Prairie', 'Steinbach'],
    'Saskatchewan': ['Moose Jaw', 'Swift Current', 'Yorkton'],
    'Nova Scotia': ['Truro', 'New Glasgow', 'Glace Bay'],
    'New Brunswick': ['Bathurst', 'Miramichi', 'Edmundston'],
    'Newfoundland and Labrador': ['Corner Brook', 'Conception Bay South'],
    'Yukon': ['Whitehorse'],
    'Northwest Territories': ['Yellowknife'],
    'Nunavut': ['Iqaluit'],
  },
  'Australia': {
    'Queensland': ['Hervey Bay', 'Gladstone', 'Maryborough'],
    'New South Wales': ['Dubbo', 'Orange', 'Tamworth', 'Port Macquarie', 'Bathurst', 'Lismore', 'Nowra'],
    'Victoria': ['Shepparton', 'Wodonga', 'Traralgon', 'Mildura'],
    'South Australia': ['Port Augusta', 'Port Lincoln', 'Murray Bridge'],
    'Western Australia': ['Albany', 'Port Hedland', 'Broome'],
    'Tasmania': ['Ulverstone'],
  },
  'Germany': {
    'Lower Saxony': ['Hannover'],
    'Bremen': ['Bremen'],
  },
  'France': {
    'Grand Est': ['Strasbourg'],
    'Pays de la Loire': ['Nantes'],
  },
  'Spain': {
    'Basque Country': ['Bilbao'],
    'Galicia': ['A Coruña'],
  },
  'Italy': {
    'Sicily': ['Palermo'],
    'Piedmont': ['Turin'],
  },
  'Poland': {
    'Greater Poland': ['Poznań'],
    'Silesia': ['Katowice'],
  },
  'Thailand': {
    'Khon Kaen': ['Khon Kaen'],
  },
  'Malaysia': {
    'Selangor': ['Shah Alam'],
  },
  'Philippines': {
    'Davao': ['Davao City'],
  },
  'Indonesia': {
    'East Java': ['Surabaya'],
  },
  'Vietnam': {
    'Da Nang': ['Da Nang'],
  },
  'Mexico': {
    'Quintana Roo': ['Cancún'],
    'Baja California': ['Tijuana'],
  },
  'Brazil': {
    'Paraná': ['Curitiba'],
    'Rio Grande do Sul': ['Porto Alegre'],
  },
  'South Africa': {
    'Eastern Cape': ['Port Elizabeth'],
  },
  'United States': {
    'Arizona': ['Phoenix'],
    'Pennsylvania': ['Philadelphia'],
    'Texas': ['San Antonio'],
  },
  'Canada': {
    'Ontario': ['Ottawa'],
    'Manitoba': ['Winnipeg'],
  },
  'Poland': {
    'Silesia': ['Wroclaw'],
    'Greater Poland': ['Poznan'],
  },
  'Russia': {
    'Sverdlovsk Oblast': ['Yekaterinburg'],
    'Novosibirsk': ['Novosibirsk'],
  },
  'Thailand': {
    'Chiang Mai': ['Chiang Mai'],
    'Phuket': ['Phuket'],
  },
  'Sri Lanka': {
    'Central': ['Kandy'],
    'Southern': ['Galle'],
  },
  'UAE': {
    'Abu Dhabi': ['Abu Dhabi'],
    'Sharjah': ['Sharjah'],
  },
  'Mexico': {
    'Jalisco': ['Guadalajara'],
    'Nuevo León': ['Monterrey'],
  },
  'Brazil': {
    'Minas Gerais': ['Belo Horizonte'],
    'Bahia': ['Salvador'],
  },
  'South Korea': {
    'Gyeonggi': ['Incheon'],
    'Busan': ['Busan'],
  },
  'Indonesia': {
    'Jakarta': ['Jakarta'],
    'Surabaya': ['Surabaya'],
  },
  'Philippines': {
    'National Capital Region': ['Manila'],
    'Cebu': ['Cebu City'],
  },
  'Vietnam': {
    'Ho Chi Minh City': ['Ho Chi Minh City'],
    'Hanoi': ['Hanoi'],
  },
  'Malaysia': {
    'Selangor': ['Kuala Lumpur'],
    'Penang': ['Georgetown'],
  },
};

export const INTERNATIONAL_CITIES = {
  'United States': {
    'California': ['San Francisco', 'Los Angeles', 'San Diego', 'Sacramento'],
    'New York': ['New York City', 'Buffalo', 'Rochester'],
    'Texas': ['Houston', 'Austin', 'Dallas', 'San Antonio'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
    'Illinois': ['Chicago'],
    'Massachusetts': ['Boston'],
    'Washington': ['Seattle', 'Tacoma'],
    'Arizona': ['Phoenix'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh'],
    'Colorado': ['Denver'],
  },
  'United Kingdom': {
    'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
    'Scotland': ['Edinburgh', 'Glasgow'],
    'Wales': ['Cardiff', 'Swansea'],
  },
  'Canada': {
    'Ontario': ['Toronto', 'Ottawa', 'Hamilton'],
    'British Columbia': ['Vancouver', 'Victoria'],
    'Alberta': ['Calgary', 'Edmonton'],
    'Quebec': ['Montreal', 'Quebec City'],
    'Manitoba': ['Winnipeg'],
  },
  'Australia': {
    'New South Wales': ['Sydney', 'Newcastle'],
    'Victoria': ['Melbourne'],
    'Queensland': ['Brisbane', 'Gold Coast'],
    'Western Australia': ['Perth'],
    'South Australia': ['Adelaide'],
  },
  'Germany': {
    'Berlin': ['Berlin'],
    'Hesse': ['Frankfurt'],
    'Bavaria': ['Munich'],
    'North Rhine-Westphalia': ['Cologne', 'Düsseldorf'],
    'Hamburg': ['Hamburg'],
  },
  'France': {
    'Île-de-France': ['Paris', 'Versailles'],
    'Provence': ['Marseille', 'Aix-en-Provence'],
    'Rhône-Alpes': ['Lyon'],
  },
  'Poland': {
    'Mazovia': ['Warsaw'],
    'Lesser Poland': ['Krakow'],
    'Silesia': ['Wroclaw'],
    'Greater Poland': ['Poznan'],
  },
  'Russia': {
    'Moscow': ['Moscow'],
    'Leningrad Oblast': ['St. Petersburg'],
    'Sverdlovsk Oblast': ['Yekaterinburg'],
    'Novosibirsk Oblast': ['Novosibirsk'],
  },
  'Japan': {
    'Tokyo': ['Tokyo'],
    'Kansai': ['Osaka', 'Kyoto', 'Kobe'],
    'Nagoya Region': ['Nagoya'],
    'Fukuoka': ['Fukuoka'],
  },
  'South Korea': {
    'Seoul': ['Seoul'],
    'Gyeonggi': ['Incheon', 'Suwon'],
    'Busan': ['Busan'],
    'Daegu': ['Daegu'],
  },
  'China': {
    'Shanghai': ['Shanghai'],
    'Beijing': ['Beijing'],
    'Guangdong': ['Shenzhen', 'Guangzhou'],
    'Zhejiang': ['Hangzhou'],
    'Chongqing': ['Chongqing'],
  },
  'Singapore': {
    'Central': ['Singapore'],
  },
  'UAE': {
    'Dubai': ['Dubai', 'Deira'],
    'Abu Dhabi': ['Abu Dhabi'],
    'Sharjah': ['Sharjah'],
  },
  'Thailand': {
    'Bangkok': ['Bangkok'],
    'Chiang Mai': ['Chiang Mai'],
    'Phuket': ['Phuket'],
    'Pattaya': ['Pattaya'],
  },
  'Sri Lanka': {
    'Western': ['Colombo', 'Negombo'],
    'Central': ['Kandy'],
    'Southern': ['Galle', 'Matara'],
  },
  'Mexico': {
    'Federal': ['Mexico City'],
    'Jalisco': ['Guadalajara'],
    'Nuevo León': ['Monterrey'],
    'Baja California': ['Tijuana'],
  },
  'Brazil': {
    'São Paulo': ['São Paulo', 'Campinas'],
    'Rio de Janeiro': ['Rio de Janeiro'],
    'Minas Gerais': ['Belo Horizonte'],
    'Bahia': ['Salvador'],
  },
  'Indonesia': {
    'Jakarta': ['Jakarta'],
    'West Java': ['Bandung'],
    'East Java': ['Surabaya'],
  },
  'Philippines': {
    'National Capital Region': ['Manila', 'Quezon City'],
    'Cebu': ['Cebu City'],
    'Davao Region': ['Davao City'],
  },
  'Vietnam': {
    'Ho Chi Minh City': ['Ho Chi Minh City'],
    'Hanoi': ['Hanoi'],
    'Da Nang': ['Da Nang'],
  },
  'Malaysia': {
    'Selangor': ['Kuala Lumpur'],
    'Penang': ['Georgetown'],
    'Johor': ['Johor Bahru'],
  },
  'New Zealand': {
    'Auckland': ['Auckland'],
    'Wellington': ['Wellington'],
    'Canterbury': ['Christchurch'],
  },
  'Sweden': {
    'Stockholm': ['Stockholm'],
    'Västra Götaland': ['Gothenburg'],
  },
  'Netherlands': {
    'North Holland': ['Amsterdam'],
    'South Holland': ['Rotterdam'],
    'Utrecht': ['Utrecht'],
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get city tier and COL multiplier
 * @param {string} cityName - City name
 * @param {string} country - Country name (optional, helps narrow search)
 * @returns {Object} { tier: string, multiplier: number, name: string }
 */
export const getCityTier = (cityName, country = null) => {
  if (!cityName) return { tier: 'other', multiplier: 1.0, name: 'Unknown' };

  const searchCity = cityName.toLowerCase().trim();

  // Check India Tier 1
  for (const state in TIER_1_CITIES.India) {
    if (TIER_1_CITIES.India[state].some(c => c.toLowerCase() === searchCity)) {
      return {
        tier: 'tier_1',
        multiplier: 1.25,
        name: TIER_DEFINITIONS.tier_1.name,
      };
    }
  }

  // Check India Tier 2
  for (const state in TIER_2_CITIES.India) {
    if (TIER_2_CITIES.India[state].some(c => c.toLowerCase() === searchCity)) {
      return {
        tier: 'tier_2',
        multiplier: 1.05,
        name: TIER_DEFINITIONS.tier_2.name,
      };
    }
  }

  // Check India Tier 3
  for (const state in TIER_3_CITIES.India) {
    if (TIER_3_CITIES.India[state].some(c => c.toLowerCase() === searchCity)) {
      return {
        tier: 'tier_3',
        multiplier: 0.90,
        name: TIER_DEFINITIONS.tier_3.name,
      };
    }
  }

  // Check International Tier 1
  for (const intlCountry in INTERNATIONAL_TIER_1_CITIES) {
    if (country && country.toLowerCase() !== intlCountry.toLowerCase()) {
      continue; // Skip if country specified and doesn't match
    }
    for (const region in INTERNATIONAL_TIER_1_CITIES[intlCountry]) {
      if (
        INTERNATIONAL_TIER_1_CITIES[intlCountry][region].some(
          c => c.toLowerCase() === searchCity
        )
      ) {
        return {
          tier: 'tier_1',
          multiplier: 1.25,
          name: TIER_DEFINITIONS.tier_1.name,
        };
      }
    }
  }

  // Check International Tier 2
  for (const intlCountry in INTERNATIONAL_TIER_2_CITIES) {
    if (country && country.toLowerCase() !== intlCountry.toLowerCase()) {
      continue;
    }
    for (const region in INTERNATIONAL_TIER_2_CITIES[intlCountry]) {
      if (
        INTERNATIONAL_TIER_2_CITIES[intlCountry][region].some(
          c => c.toLowerCase() === searchCity
        )
      ) {
        return {
          tier: 'tier_2',
          multiplier: 1.05,
          name: TIER_DEFINITIONS.tier_2.name,
        };
      }
    }
  }

  // Check International Tier 3
  for (const intlCountry in INTERNATIONAL_TIER_3_CITIES) {
    if (country && country.toLowerCase() !== intlCountry.toLowerCase()) {
      continue;
    }
    for (const region in INTERNATIONAL_TIER_3_CITIES[intlCountry]) {
      if (
        INTERNATIONAL_TIER_3_CITIES[intlCountry][region].some(
          c => c.toLowerCase() === searchCity
        )
      ) {
        return {
          tier: 'tier_3',
          multiplier: 0.90,
          name: TIER_DEFINITIONS.tier_3.name,
        };
      }
    }
  }

  // Check General International Cities (default tier_other)
  for (const intlCountry in INTERNATIONAL_CITIES) {
    if (country && country.toLowerCase() !== intlCountry.toLowerCase()) {
      continue;
    }
    for (const region in INTERNATIONAL_CITIES[intlCountry]) {
      if (
        INTERNATIONAL_CITIES[intlCountry][region].some(
          c => c.toLowerCase() === searchCity
        )
      ) {
        return {
          tier: 'other',
          multiplier: 1.0,
          name: TIER_DEFINITIONS.other.name,
        };
      }
    }
  }

  // Not found - return default
  return {
    tier: 'other',
    multiplier: 1.0,
    name: TIER_DEFINITIONS.other.name,
  };
};

/**
 * Get tier multiplier
 * @param {string} tier - Tier name (tier_1, tier_2, tier_3, other)
 * @returns {number} COL multiplier
 */
export const getTierMultiplier = (tier) => {
  return TIER_DEFINITIONS[tier]?.multiplier || 1.0;
};

/**
 * Get all cities for a specific tier
 * @param {string} tier - Tier name
 * @returns {Array} List of cities in the tier
 */
export const getCitiesByTier = (tier) => {
  const cities = [];

  if (tier === 'tier_1') {
    for (const state in TIER_1_CITIES.India) {
      cities.push(...TIER_1_CITIES.India[state]);
    }
  } else if (tier === 'tier_2') {
    for (const state in TIER_2_CITIES.India) {
      cities.push(...TIER_2_CITIES.India[state]);
    }
  } else if (tier === 'tier_3') {
    for (const state in TIER_3_CITIES.India) {
      cities.push(...TIER_3_CITIES.India[state]);
    }
  }

  return cities.sort();
};

/**
 * Get all states and their cities for a country
 * @param {string} country - Country name ('India' for domestic)
 * @returns {Object} { state: [cities] }
 */
export const getStatesCities = (country = 'India') => {
  if (country === 'India') {
    return {
      'Tier 1': TIER_1_CITIES.India,
      'Tier 2': TIER_2_CITIES.India,
      'Tier 3': TIER_3_CITIES.India,
    };
  }

  // For international countries, return their tier structure
  const countryData = {};
  
  // Add Tier 1 cities if country exists in international tier 1
  if (INTERNATIONAL_TIER_1_CITIES[country]) {
    countryData['Tier 1 - Metropolitan'] = INTERNATIONAL_TIER_1_CITIES[country];
  }
  
  // Add Tier 2 cities if country exists in international tier 2
  if (INTERNATIONAL_TIER_2_CITIES[country]) {
    countryData['Tier 2 - Major Cities'] = INTERNATIONAL_TIER_2_CITIES[country];
  }
  
  // Add Tier 3 cities if country exists in international tier 3
  if (INTERNATIONAL_TIER_3_CITIES[country]) {
    countryData['Tier 3 - Emerging'] = INTERNATIONAL_TIER_3_CITIES[country];
  }
  
  // Fallback to general international cities if no tier-specific data
  if (Object.keys(countryData).length === 0 && INTERNATIONAL_CITIES[country]) {
    countryData['All Cities'] = INTERNATIONAL_CITIES[country];
  }

  return countryData || {};
};

/**
 * Get all countries available
 * @returns {Array} List of country names sorted alphabetically
 */
export const getAllCountries = () => {
  const allCountries = [
    'India',
    ...Object.keys(INTERNATIONAL_CITIES).sort(),
  ];
  return allCountries;
};

/**
 * Get all states for a country
 * @param {string} country - Country name
 * @returns {Array} List of state/region names sorted alphabetically
 */
export const getAllStates = (country = 'India') => {
  if (country === 'India') {
    const states = new Set();
    [TIER_1_CITIES.India, TIER_2_CITIES.India, TIER_3_CITIES.India].forEach(
      tierData => {
        Object.keys(tierData).forEach(state => states.add(state));
      }
    );
    return Array.from(states).sort();
  }

  // For international countries, combine all regions
  const states = new Set();
  
  if (INTERNATIONAL_TIER_1_CITIES[country]) {
    Object.keys(INTERNATIONAL_TIER_1_CITIES[country]).forEach(region => states.add(region));
  }
  
  if (INTERNATIONAL_TIER_2_CITIES[country]) {
    Object.keys(INTERNATIONAL_TIER_2_CITIES[country]).forEach(region => states.add(region));
  }
  
  if (INTERNATIONAL_TIER_3_CITIES[country]) {
    Object.keys(INTERNATIONAL_TIER_3_CITIES[country]).forEach(region => states.add(region));
  }
  
  // Fallback to general international cities
  if (states.size === 0 && INTERNATIONAL_CITIES[country]) {
    Object.keys(INTERNATIONAL_CITIES[country]).forEach(region => states.add(region));
  }

  return Array.from(states).sort();
};

/**
 * Get cities for a specific state/region
 * @param {string} state - State/region name
 * @param {string} country - Country name
 * @returns {Array} List of cities sorted alphabetically
 */
export const getCitiesByState = (state, country = 'India') => {
  if (country === 'India') {
    const allCities = [
      ...(TIER_1_CITIES.India[state] || []),
      ...(TIER_2_CITIES.India[state] || []),
      ...(TIER_3_CITIES.India[state] || []),
    ];
    return allCities.sort();
  }

  // For international countries, check all tier levels
  let cities = [];
  
  if (INTERNATIONAL_TIER_1_CITIES[country]) {
    cities = [...cities, ...(INTERNATIONAL_TIER_1_CITIES[country][state] || [])];
  }
  
  if (INTERNATIONAL_TIER_2_CITIES[country]) {
    cities = [...cities, ...(INTERNATIONAL_TIER_2_CITIES[country][state] || [])];
  }
  
  if (INTERNATIONAL_TIER_3_CITIES[country]) {
    cities = [...cities, ...(INTERNATIONAL_TIER_3_CITIES[country][state] || [])];
  }
  
  // Fallback to general international cities
  if (cities.length === 0 && INTERNATIONAL_CITIES[country]) {
    cities = INTERNATIONAL_CITIES[country][state] || [];
  }

  return cities.sort();
};

/**
 * Calculate COL-adjusted budget allocation
 * @param {number} baseNeeds - Base needs percentage (default 50)
 * @param {number} colMultiplier - COL multiplier (1.25, 1.05, 0.90, 1.00)
 * @returns {Object} { needs, wants, savings }
 */
export const calculateColAdjustedBudget = (
  baseNeeds = 50,
  colMultiplier = 1.0
) => {
  const baseSavings = 20;
  const baseWants = 30;

  // Apply COL factor to needs
  const colFactor = (colMultiplier - 1) * 0.8;
  const adjustedNeeds = baseNeeds * (1 + colFactor);

  // Reduce savings by the increase in needs
  const reduction = adjustedNeeds - baseNeeds;
  const minSavings = 5; // Minimum savings threshold
  const adjustedSavings = Math.max(baseSavings - reduction, minSavings);

  // Remaining to wants
  const adjustedWants = 100 - adjustedNeeds - adjustedSavings;

  return {
    needs: Math.round(adjustedNeeds * 100) / 100,
    wants: Math.round(adjustedWants * 100) / 100,
    savings: Math.round(adjustedSavings * 100) / 100,
    adjustmentFactor: colFactor,
  };
};

/**
 * Get color for tier for UI display
 * @param {string} tier - Tier name
 * @returns {string} Hex color code
 */
export const getTierColor = (tier) => {
  return TIER_DEFINITIONS[tier]?.color || '#9E9E9E';
};

/**
 * Get all tier options for dropdown
 * @returns {Array} [{ value: 'tier_1', label: 'Tier 1 - Metropolitan', ... }]
 */
export const getTierOptions = () => {
  return Object.entries(TIER_DEFINITIONS).map(([key, value]) => ({
    value: key,
    label: value.name,
    description: value.description,
    multiplier: value.multiplier,
    color: value.color,
  }));
};

/**
 * Get lifestyle options for dropdown
 * @returns {Array} [{ value: 'minimal', label: 'Minimal', ... }]
 */
export const getLifestyleOptions = () => {
  return [
    {
      value: 'minimal',
      label: '🟢 Minimal',
      description: 'Budget-conscious, essential spending',
      wantsPercentage: 22.5,
      icon: '🟢',
    },
    {
      value: 'moderate',
      label: '🟡 Moderate',
      description: 'Balanced lifestyle with some leisure',
      wantsPercentage: 32.5,
      icon: '🟡',
      isDefault: true,
    },
    {
      value: 'comfort',
      label: '🟠 Comfort',
      description: 'Comfortable living, regular dining/entertainment',
      wantsPercentage: 37.5,
      icon: '🟠',
    },
    {
      value: 'premium',
      label: '🔴 Premium',
      description: 'High-end lifestyle, luxury spending',
      wantsPercentage: 45,
      icon: '🔴',
    },
  ];
};

/**
 * Apply lifestyle modifier to budget split
 * @param {number} baseWants - Base wants percentage
 * @param {string} lifestyle - Lifestyle type
 * @returns {number} Adjusted wants percentage
 */
export const applyLifestyleModifier = (baseWants, lifestyle) => {
  const options = getLifestyleOptions();
  const option = options.find(o => o.value === lifestyle);
  return option?.wantsPercentage || baseWants;
};

// ============================================
// EXPORT DATA FOR UI
// ============================================

export const cityTierData = {
  TIER_DEFINITIONS,
  TIER_1_CITIES,
  TIER_2_CITIES,
  TIER_3_CITIES,
  INTERNATIONAL_TIER_1_CITIES,
  INTERNATIONAL_TIER_2_CITIES,
  INTERNATIONAL_TIER_3_CITIES,
  INTERNATIONAL_CITIES,
};

export default cityTierData;
