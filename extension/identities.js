// Fictional identity generator
// All names are from well-known fictional characters to ensure no real person is impersonated.

const FICTIONAL_IDENTITIES = [
  // Movies & TV
  { firstName: "Walter", lastName: "White", universe: "Breaking Bad" },
  { firstName: "Saul", lastName: "Goodman", universe: "Better Call Saul" },
  { firstName: "Michael", lastName: "Scott", universe: "The Office" },
  { firstName: "Dwight", lastName: "Schrute", universe: "The Office" },
  { firstName: "Homer", lastName: "Simpson", universe: "The Simpsons" },
  { firstName: "Bart", lastName: "Simpson", universe: "The Simpsons" },
  { firstName: "Philip", lastName: "Fry", universe: "Futurama" },
  { firstName: "Bender", lastName: "Rodriguez", universe: "Futurama" },
  { firstName: "Rick", lastName: "Sanchez", universe: "Rick and Morty" },
  { firstName: "Morty", lastName: "Smith", universe: "Rick and Morty" },
  { firstName: "Tony", lastName: "Stark", universe: "Marvel" },
  { firstName: "Bruce", lastName: "Wayne", universe: "DC Comics" },
  { firstName: "Peter", lastName: "Parker", universe: "Marvel" },
  { firstName: "Clark", lastName: "Kent", universe: "DC Comics" },
  { firstName: "Darth", lastName: "Vader", universe: "Star Wars" },
  { firstName: "Han", lastName: "Solo", universe: "Star Wars" },
  { firstName: "Gandalf", lastName: "LeGris", universe: "Lord of the Rings" },
  { firstName: "Frodo", lastName: "Baggins", universe: "Lord of the Rings" },
  { firstName: "Shrek", lastName: "Ogre", universe: "Shrek" },
  { firstName: "Donkey", lastName: "Kong", universe: "Nintendo" },
  { firstName: "Mario", lastName: "Mario", universe: "Nintendo" },
  { firstName: "Luigi", lastName: "Mario", universe: "Nintendo" },
  { firstName: "Solid", lastName: "Snake", universe: "Metal Gear" },

  // Literature
  { firstName: "Sherlock", lastName: "Holmes", universe: "Conan Doyle" },
  { firstName: "Jay", lastName: "Gatsby", universe: "F. Scott Fitzgerald" },
  { firstName: "Jean", lastName: "Valjean", universe: "Les Misérables" },
  { firstName: "Edmond", lastName: "Dantès", universe: "Monte-Cristo" },

  // Anime & Manga
  { firstName: "Goku", lastName: "Son", universe: "Dragon Ball" },
  { firstName: "Naruto", lastName: "Uzumaki", universe: "Naruto" },
  { firstName: "Light", lastName: "Yagami", universe: "Death Note" },
  { firstName: "Monkey D.", lastName: "Luffy", universe: "One Piece" },
  { firstName: "Spike", lastName: "Spiegel", universe: "Cowboy Bebop" },
  { firstName: "Guts", lastName: "Berserker", universe: "Berserk" },

  // Video Games
  { firstName: "Gordon", lastName: "Freeman", universe: "Half-Life" },
  { firstName: "Master", lastName: "Chief", universe: "Halo" },
  { firstName: "Geralt", lastName: "deRiv", universe: "The Witcher" },
  { firstName: "Arthur", lastName: "Morgan", universe: "Red Dead" },
  { firstName: "Trevor", lastName: "Philips", universe: "GTA V" },
  { firstName: "CJ", lastName: "Johnson", universe: "GTA San Andreas" },
  { firstName: "Steve", lastName: "Minecraft", universe: "Minecraft" },
  { firstName: "GLaDOS", lastName: "Aperture", universe: "Portal" },

  // Memes & Internet culture
  { firstName: "Doge", lastName: "Shiba", universe: "Internet" },
  { firstName: "Chad", lastName: "Thundercock", universe: "Internet" },
  { firstName: "Karen", lastName: "Manager", universe: "Internet" },
  { firstName: "Nyan", lastName: "Cat", universe: "Internet" },
  { firstName: "Pepe", lastName: "LaGrenouille", universe: "Internet" },

  // French culture
  { firstName: "Astérix", lastName: "LeGaulois", universe: "Astérix" },
  { firstName: "Obélix", lastName: "Carrièrdepierre", universe: "Astérix" },
  { firstName: "OSS", lastName: "117", universe: "OSS 117" },
  { firstName: "Hubert", lastName: "Bonisseur de la Bath", universe: "OSS 117" },
  { firstName: "Perceval", lastName: "deGalles", universe: "Kaamelott" },
  { firstName: "Arthur", lastName: "Pendragon", universe: "Kaamelott" },
];

const FUNNY_STREETS = [
  "742 Evergreen Terrace",
  "221B Baker Street",
  "4 Privet Drive",
  "1600 Pennsylvania Avenue (sous-sol)",
  "12 Grimmauld Place",
  "42 Wallaby Way",
  "1 Infinite Loop (le vrai)",
  "404 Not Found Street",
  "69 Nice Boulevard",
  "1337 Hacker Lane",
  "3.14 Pi Avenue",
  "666 Satan's Cul-de-sac",
  "123 Sesame Street",
  "0 Null Pointer Drive",
  "255.255.255.255 Broadcast Blvd",
  "80 Port Avenue",
  "443 Secure Street",
  "27 Rue du Chat qui Pêche",
  "1 Rue de la Paix (mais pas la vraie)",
  "99 Luftballons Straße",
  "420 Blaze It Road",
  "1 Place de la Table Ronde (c'est pas faux)",
  "88 Miles Per Hour Drive",
  "7 Dragon Ball Avenue",
  "1000 Sunny Go Harbor",
];

const FUNNY_CITIES = [
  { city: "Gotham City", zip: "10001", country: "US" },
  { city: "Bikini Bottom", zip: "00000", country: "US" },
  { city: "Springfield", zip: "49735", country: "US" },
  { city: "Poudlard-sur-Mer", zip: "75013", country: "FR" },
  { city: "Minas Tirith", zip: "31000", country: "FR" },
  { city: "Hyrule Village", zip: "69000", country: "FR" },
  { city: "Raccoon City", zip: "80085", country: "US" },
  { city: "Tatooine-les-Bains", zip: "13000", country: "FR" },
  { city: "Los Santos", zip: "90210", country: "US" },
  { city: "Night City", zip: "77777", country: "US" },
  { city: "Pallet Town", zip: "01000", country: "FR" },
  { city: "Whiterun", zip: "59000", country: "FR" },
  { city: "Kakariko Village", zip: "33000", country: "FR" },
  { city: "Midgar-sur-Seine", zip: "75001", country: "FR" },
  { city: "Kaamelott", zip: "56000", country: "FR" },
  { city: "Village d'Astérix", zip: "29200", country: "FR" },
  { city: "Shelbyville", zip: "40003", country: "US" },
  { city: "Vice City", zip: "33101", country: "US" },
  { city: "Cloudcuckooland", zip: "99999", country: "US" },
  { city: "Duloc", zip: "12345", country: "US" },
];

const FUNNY_EMAIL_DOMAINS = [
  "totallyreal.email",
  "definitelynotfake.com",
  "trustme.bro",
  "fridge.cool",
  "not.a.robot",
  "finger.fridge",
  "legit.af",
  "real.human",
  "nice.try",
  "null.dev",
  "127.0.0.1.mail",
  "localhost.email",
  "rm-rf.root",
  "sudo.please",
  "git.push.force",
  "stackoverflow.copy",
  "works.on.my.machine",
  "dontreply.ever",
  "temp.yolo",
  "oui.oui.baguette",
];

const PHONE_FORMATS = [
  { format: "+1 (555) ###-####", country: "US" },
  { format: "+33 6 ## ## ## ##", country: "FR" },
  { format: "+44 7### ######", country: "UK" },
  { format: "+81 90-####-####", country: "JP" },
  { format: "+49 170 #######", country: "DE" },
  { format: "+39 3## ### ####", country: "IT" },
  { format: "+34 6## ### ###", country: "ES" },
];

function generateIdentity() {
  const person = FICTIONAL_IDENTITIES[Math.floor(Math.random() * FICTIONAL_IDENTITIES.length)];
  const location = FUNNY_CITIES[Math.floor(Math.random() * FUNNY_CITIES.length)];
  const street = FUNNY_STREETS[Math.floor(Math.random() * FUNNY_STREETS.length)];
  const domain = FUNNY_EMAIL_DOMAINS[Math.floor(Math.random() * FUNNY_EMAIL_DOMAINS.length)];
  const phoneTemplate = PHONE_FORMATS[Math.floor(Math.random() * PHONE_FORMATS.length)];

  // Generate email from name
  const cleanFirst = person.firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  const cleanLast = person.lastName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  const emailVariants = [
    `${cleanFirst}.${cleanLast}`,
    `${cleanFirst}_${cleanLast}`,
    `${cleanFirst}${cleanLast}${Math.floor(Math.random() * 100)}`,
    `x_${cleanFirst}_x`,
    `the.real.${cleanFirst}`,
    `not.${cleanFirst}`,
    `${cleanFirst}.${cleanLast}.official`,
  ];
  const emailUser = emailVariants[Math.floor(Math.random() * emailVariants.length)];
  const email = `${emailUser}@${domain}`;

  // Generate phone from template
  const phone = phoneTemplate.format.replace(/#/g, () => Math.floor(Math.random() * 10));

  return {
    firstName: person.firstName,
    lastName: person.lastName,
    universe: person.universe,
    email,
    phone,
    phoneCountry: phoneTemplate.country,
    street,
    city: location.city,
    zip: location.zip,
    country: location.country,
  };
}
