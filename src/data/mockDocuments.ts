import { Document } from '../types';

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc_science_01',
    title: 'Class 8 Science — Chapter 7: Conservation of Plants and Animals',
    category: 'Science',
    language: 'en-IN',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-24T14:30:00Z',
    progressPercent: 65,
    totalWords: 340,
    estimatedReadTimeMinutes: 3,
    originalViewStyle: {
      headerColor: '#047857',
      chapterNumber: 'CHAPTER 07',
      subheading: 'National Parks, Biosphere Reserves, and Ecosystem Equilibrium',
      accentColor: '#10B981'
    },
    pages: [
      {
        pageNumber: 1,
        content: `Deforestation means clearing of forests and using that land for other purposes. Trees in the forest are cut for procuring land for cultivation, building houses and factories, making furniture, or using wood as fuel.

Some natural causes of deforestation are forest fires and severe droughts. Deforestation increases the temperature and pollution level on the earth. It increases the level of carbon dioxide in the atmosphere. Ground water level also gets lowered.

Deforestation disturbs the balance in nature. If cutting of trees continues, rainfall and the fertility of the soil will decrease. Moreover, there will be increased chances of natural calamities such as floods and droughts.

A biosphere reserve helps to maintain the biodiversity and culture of that area. A biosphere reserve may also contain other protected areas in it. For example, the Pachmarhi Biosphere Reserve consists of one national park named Satpura and two wildlife sanctuaries named Bori and Pachmarhi.`,
        paragraphs: [
          'Deforestation means clearing of forests and using that land for other purposes. Trees in the forest are cut for procuring land for cultivation, building houses and factories, making furniture, or using wood as fuel.',
          'Some natural causes of deforestation are forest fires and severe droughts. Deforestation increases the temperature and pollution level on the earth. It increases the level of carbon dioxide in the atmosphere. Ground water level also gets lowered.',
          'Deforestation disturbs the balance in nature. If cutting of trees continues, rainfall and the fertility of the soil will decrease. Moreover, there will be increased chances of natural calamities such as floods and droughts.',
          'A biosphere reserve helps to maintain the biodiversity and culture of that area. A biosphere reserve may also contain other protected areas in it. For example, the Pachmarhi Biosphere Reserve consists of one national park named Satpura and two wildlife sanctuaries named Bori and Pachmarhi.'
        ],
        simplifiedContent: `Deforestation happens when people cut down big forests. People do this to make space for farm fields, houses, roads, and factories.

Forest fires and long dry periods (droughts) can also destroy trees naturally. When trees are lost, our planet becomes hotter and air pollution goes up.

Trees protect our soil and bring rain. Without trees, we get more floods and dry land.

Biosphere reserves are special protected zones where plants, animals, and local communities live safely together without harming nature.`,
        keyTerms: [
          { term: 'Deforestation', definition: 'The purposeful clearing of forested land for human use.' },
          { term: 'Biosphere Reserve', definition: 'A large protected area of land for conservation of wildlife, plants, and traditional tribal life.' },
          { term: 'Biodiversity', definition: 'The variety of plant and animal life in a particular habitat or in the world.' }
        ],
        translations: {
          'hi-IN': `वनों की कटाई का अर्थ है वनों को साफ करना और उस भूमि का अन्य उपयोग करना। खेती, मकान और कारखाने बनाने, फर्नीचर बनाने या ईंधन के रूप में लकड़ी के उपयोग के लिए पेड़ काटे जाते हैं।

वनों की कटाई के कुछ प्राकृतिक कारण जंगल की आग और गंभीर सूखा हैं। वनों की कटाई से पृथ्वी पर तापमान और प्रदूषण का स्तर बढ़ता है। यह वायुमंडल में कार्बन डाइऑक्साइड के स्तर को बढ़ाता है। भूजल स्तर भी नीचे चला जाता है।

वनों की कटाई प्रकृति में संतुलन बिगाड़ती है। यदि पेड़ों की कटाई जारी रही तो वर्षा और मिट्टी की उर्वरता कम हो जाएगी।

एक बायोस्फीयर रिजर्व उस क्षेत्र की जैव विविधता और संस्कृति को बनाए रखने में मदद करता है। उदाहरण के लिए, पचमढ़ी बायोस्फीयर रिजर्व में सतपुड़ा नामक एक राष्ट्रीय उद्यान और बोरी तथा पचमढ़ी नामक दो वन्यजीव अभयारण्य शामिल हैं।`,
          'mr-IN': `जंगलतोड म्हणजे जंगले नष्ट करून त्या जमिनीचा इतर कामांसाठी वापर करणे. शेतीसाठी जमीन मिळवणे, घरे आणि कारखाने बांधणे यासाठी झाडे तोडली जातात.

जंगलतोडीमुळे पृथ्वीचे तापमान आणि प्रदूषण पातळी वाढते. यामुळे पर्यावरणाचा तोल बिघडतो.

बायोस्फिअर रिझर्व्ह त्या भागातील जैवविविधता आणि संस्कृतीचे रक्षण करण्यास मदत करते.`,
          'es-ES': `La deforestación significa talar bosques y utilizar esa tierra para otros fines. Los árboles del bosque se talan para obtener tierras de cultivo, construir casas y fábricas.

La deforestación aumenta la temperatura y el nivel de contaminación en la tierra. Aumenta el nivel de dióxido de carbono en la atmósfera.

Una reserva de la biosfera ayuda a mantener la biodiversidad y la cultura de esa zona.`
        }
      }
    ],
    status: 'completed'
  },
  {
    id: 'doc_history_02',
    title: 'History Chapter 4 — The Ancient Silk Road and Global Exchange',
    category: 'History',
    language: 'en-IN',
    createdAt: '2026-08-18T14:15:00Z',
    updatedAt: '2026-08-23T11:20:00Z',
    progressPercent: 40,
    totalWords: 290,
    estimatedReadTimeMinutes: 2,
    originalViewStyle: {
      headerColor: '#B45309',
      chapterNumber: 'CHAPTER 04',
      subheading: 'Caravans, Desert Oases, and Cultural Crossroads of Afro-Eurasia',
      accentColor: '#F59E0B'
    },
    pages: [
      {
        pageNumber: 1,
        content: `The Silk Road was not a single paved road, but an expansive network of ancient trade routes that linked China, Central Asia, India, Persia, and the Mediterranean world.

Merchants rarely traveled the entire five-thousand-mile distance. Instead, goods were transported from one oasis market to another by distinct caravans of camels and packhorses. Chinese silk, Indian spices, Persian tapestries, and Roman glassware were exchanged along the bustling desert posts.

Beyond physical goods, the Silk Road was a great conduit of human ideas, scientific inventions, and spiritual traditions. Paper-making techniques, magnetic compasses, astronomy, and Buddhism spread peacefully across nations through travelers and wandering scholars.`,
        paragraphs: [
          'The Silk Road was not a single paved road, but an expansive network of ancient trade routes that linked China, Central Asia, India, Persia, and the Mediterranean world.',
          'Merchants rarely traveled the entire five-thousand-mile distance. Instead, goods were transported from one oasis market to another by distinct caravans of camels and packhorses. Chinese silk, Indian spices, Persian tapestries, and Roman glassware were exchanged along the bustling desert posts.',
          'Beyond physical goods, the Silk Road was a great conduit of human ideas, scientific inventions, and spiritual traditions. Paper-making techniques, magnetic compasses, astronomy, and Buddhism spread peacefully across nations through travelers and wandering scholars.'
        ],
        simplifiedContent: `The Silk Road was a huge web of trade routes connecting Asia, India, the Middle East, and Europe.

Traders did not walk the whole path. They met at small desert towns called oases and traded silk, spices, glass, and cloth.

More than objects, people shared new inventions like paper, compasses, and great ideas that helped civilizations learn from each other.`,
        keyTerms: [
          { term: 'Caravan', definition: 'A group of travelers or merchants journeying together across deserts for safety.' },
          { term: 'Oasis', definition: 'A fertile spot in a desert where water is found.' },
          { term: 'Conduit', definition: 'A channel or pathway through which things or knowledge flow.' }
        ],
        translations: {
          'hi-IN': `रेशम मार्ग (सिल्क रोड) कोई एक पक्की सड़क नहीं थी, बल्कि प्राचीन व्यापार मार्गों का एक विशाल जाल था जो चीन, मध्य एशिया, भारत, फारस और भूमध्यसागरीय दुनिया को जोड़ता था।

व्यापारी शायद ही कभी पूरी पांच हजार मील की दूरी तय करते थे। इसके बजाय, सामान को एक नखलिस्तान (ओएसिस) बाजार से दूसरे बाजार तक ऊंटों के कारवां द्वारा ले जाया जाता था।

भौतिक वस्तुओं के अलावा, सिल्क रोड मानव विचारों, वैज्ञानिक आविष्कारों और आध्यात्मिक परंपराओं का एक महान माध्यम था।`,
          'mr-IN': `रेशीम मार्ग हे प्राचीन व्यापारी मार्गांचे एक मोठे जाळे होते ज्याने चीन, मध्य आशिया, भारत आणि युरोपला जोडले होते.

या मार्गावरून कापड, मसाले आणि नवीन शोध जसे की कागद आणि होकायंत्र जगभर पसरले.`,
          'es-ES': `La Ruta de la Seda era una red de rutas comerciales que conectaba Asia y Europa para intercambiar telas, especias y nuevos inventos.`
        }
      }
    ],
    status: 'completed'
  },
  {
    id: 'doc_english_03',
    title: 'English Reading Practice — The Keeper of the Whispering Light',
    category: 'English',
    language: 'en-IN',
    createdAt: '2026-08-22T08:00:00Z',
    updatedAt: '2026-08-25T09:10:00Z',
    progressPercent: 90,
    totalWords: 245,
    estimatedReadTimeMinutes: 2,
    originalViewStyle: {
      headerColor: '#1E40AF',
      chapterNumber: 'STORY 03',
      subheading: 'A Tale of Diligence and Maritime Watchfulness',
      accentColor: '#3B82F6'
    },
    pages: [
      {
        pageNumber: 1,
        content: `High on the jagged cliffs of Cape Tempest stood a solitary stone lighthouse. For forty winters, old Elias climbed the spiral staircase each sunset to trim the heavy brass wick.

On tempestuous nights, when violent gales howled like hungry wolves and ocean waves crashed against the dark granite bedrock, ships looked for that amber beacon. Elias knew that even a momentary flicker of darkness could steer a homeward crew onto treacherous rocks.

He loved the rhythm of the ocean. In every ray of rotating light, there was a steady promise of safe harbor and guiding hope for all weary travelers.`,
        paragraphs: [
          'High on the jagged cliffs of Cape Tempest stood a solitary stone lighthouse. For forty winters, old Elias climbed the spiral staircase each sunset to trim the heavy brass wick.',
          'On tempestuous nights, when violent gales howled like hungry wolves and ocean waves crashed against the dark granite bedrock, ships looked for that amber beacon. Elias knew that even a momentary flicker of darkness could steer a homeward crew onto treacherous rocks.',
          'He loved the rhythm of the ocean. In every ray of rotating light, there was a steady promise of safe harbor and guiding hope for all weary travelers.'
        ],
        simplifiedContent: `Elias was a gentle lighthouse keeper who lived on a tall, rocky cliff by the sea. Every evening, he climbed the stairs to light the bright lamp.

When heavy storms and giant waves made the sea dangerous, ships looked for his warm yellow light to find their way home safely.

Elias took great care of his light because he knew it kept sailors safe from sharp hidden rocks.`,
        keyTerms: [
          { term: 'Solitary', definition: 'Existing alone or isolated from others.' },
          { term: 'Tempestuous', definition: 'Characterized by strong, turbulent storms or violent winds.' },
          { term: 'Beacon', definition: 'A guiding or warning light set in a high prominent position.' }
        ],
        translations: {
          'hi-IN': `केप टेम्पेस्ट की नुकीली चट्टानों पर एक अकेला पत्थर का लाइटहाउस खड़ा था। चालीस सर्दियों से, बूढ़ा एलियास हर सूर्यास्त को बत्ती जलाने के लिए घुमावदार सीढ़ियाँ चढ़ता था।

तूफानी रातों में, जब तेज हवाएं चलती थीं और समुद्र की लहरें चट्टानों से टकराती थीं, तो जहाज उस सुनहरी रोशनी की तलाश करते थे।

उसे समुद्र की लय से प्यार था। घूमती रोशनी की हर किरण में सुरक्षित बंदरगाह का एक अटूट वादा था।`
        }
      }
    ],
    status: 'completed'
  },
  {
    id: 'doc_math_04',
    title: 'Mathematics — Patterns and Golden Symmetry in Living Nature',
    category: 'Mathematics',
    language: 'en-IN',
    createdAt: '2026-08-24T16:00:00Z',
    updatedAt: '2026-08-25T11:00:00Z',
    progressPercent: 15,
    totalWords: 260,
    estimatedReadTimeMinutes: 2,
    originalViewStyle: {
      headerColor: '#7C2D12',
      chapterNumber: 'MODULE 02',
      subheading: 'Fibonacci Spirals, Pinecones, and Sunflower Seed Geometries',
      accentColor: '#EA580C'
    },
    pages: [
      {
        pageNumber: 1,
        content: `Mathematics is not merely a collection of abstract numbers; it is the fundamental language with which nature builds living structures.

When you observe the spiral patterns on a sunflower head or the overlapping scales of a pinecone, you are viewing the famous Fibonacci sequence in motion: zero, one, one, two, three, five, eight, thirteen, and twenty-one.

Each subsequent number is the sum of the two preceding numbers. Plants utilize this exact mathematical ratio to pack the maximum number of seeds into the smallest possible space, ensuring every seed receives optimal sunlight and rainwater.`,
        paragraphs: [
          'Mathematics is not merely a collection of abstract numbers; it is the fundamental language with which nature builds living structures.',
          'When you observe the spiral patterns on a sunflower head or the overlapping scales of a pinecone, you are viewing the famous Fibonacci sequence in motion: zero, one, one, two, three, five, eight, thirteen, and twenty-one.',
          'Each subsequent number is the sum of the two preceding numbers. Plants utilize this exact mathematical ratio to pack the maximum number of seeds into the smallest possible space, ensuring every seed receives optimal sunlight and rainwater.'
        ],
        simplifiedContent: `Math is all around us in nature. Sunflowers, pinecones, and seashells follow a special number pattern called the Fibonacci sequence.

In this pattern, you add the last two numbers to get the next one: 1, 1, 2, 3, 5, 8, 13...

Sunflowers use this pattern so their seeds fit tightly together and catch as much sunshine as possible.`,
        keyTerms: [
          { term: 'Fibonacci Sequence', definition: 'A series of numbers where each number is the addition of the previous two numbers.' },
          { term: 'Symmetry', definition: 'A balanced and proportionate arrangement of parts.' }
        ],
        translations: {
          'hi-IN': `गणित केवल संख्याओं का संग्रह नहीं है; यह वह भाषा है जिसके साथ प्रकृति जीवित संरचनाओं का निर्माण करती है।

जब आप सूरजमुखी के फूल पर सर्पिल पैटर्न देखते हैं, तो आप प्रसिद्ध फाइबोनैचि अनुक्रम देख रहे होते हैं: 0, 1, 1, 2, 3, 5, 8, 13... पौधे इस अनुपात का उपयोग अधिक से अधिक बीजों को व्यवस्थित करने के लिए करते हैं।`
        }
      }
    ],
    status: 'completed'
  }
];
