import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Google GenAI client if GEMINI_API_KEY is provided
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Status check API
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'AAB AI',
    creator: 'Aditya Ashok Bagh',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: 'gemini-3.8-flash',
    features: [
      { id: 'chat', name: 'AI Chat', defaultLang: 'Hindi', apiRequired: false },
      { id: 'story', name: 'AI Story Writer in Hindi', defaultLang: 'Hindi', apiRequired: false },
      { id: 'content', name: 'AI Content Writer', defaultLang: 'Hindi & English', apiRequired: false },
      { id: 'photo', name: 'AI Photo Generator', freeEngine: 'Neural Instant Synth', apiRequired: false },
      { id: 'video', name: 'AI Video Creator', defaultLang: 'Hindi & English', apiRequired: false },
    ],
  });
});

// Source Code Zip Download API for one-click export
app.get('/api/download-zip', (_req: Request, res: Response) => {
  const zipPath = path.resolve(__dirname, 'public', 'aab-ai-source-code.zip');
  res.download(zipPath, 'AAB-AI-Source-Code.zip');
});

// Helper for fallback responses if Gemini API key is missing or quota exceeded
function getFallbackChat(userMsg: string, lang: string): string {
  const isHindi = lang === 'hi' || /[\u0900-\u097F]/.test(userMsg);
  if (isHindi) {
    return `नमस्ते! मैं **AAB AI** हूँ, जिसे **आदित्य अशोक बाघ (Aditya Ashok Bagh)** द्वारा विकसित किया गया है। 🌟\n\nआपने पूछा: "${userMsg}"\n\nमैं आपकी हर प्रकार से सहायता करने के लिए तत्पर हूँ—चाहे वह कोई सवाल हो, तकनीकी समस्या, रचनात्मक सोच या सामान्य बातचीत। आप मुझसे किसी भी विषय पर हिंदी या अंग्रेजी में विस्तार से बात कर सकते हैं। आप आगे क्या जानना चाहते हैं?`;
  }
  return `Hello! I am **AAB AI**, created by **Aditya Ashok Bagh**. 🌟\n\nYou asked: "${userMsg}"\n\nI am designed to assist you with everything—from writing code and stories to creative brainstorming and day-to-day knowledge. How else may I assist you today?`;
}

// 1. AI Chat Route
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], language = 'hi', systemRole = '' } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (aiClient) {
      try {
        const sysInstruction = `You are AAB AI, an advanced intelligent AI assistant created by Aditya Ashok Bagh.
The default language is Hindi unless the user asks in English or another language.
Be polite, articulate, culturally respectful, highly intelligent, and insightful.
Provide well-structured answers using markdown formatting, bold points, and clean lists.
Brand attribution: You are built and presented as AAB AI, created by Aditya Ashok Bagh.
${systemRole ? `Additional role: ${systemRole}` : ''}`;

        // Build contents from history
        const contents: any[] = [];
        
        // Add past turns
        for (const turn of history.slice(-8)) {
          if (turn.role && turn.text) {
            contents.push({
              role: turn.role === 'user' ? 'user' : 'model',
              parts: [{ text: turn.text }],
            });
          }
        }

        // Add current user message
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: sysInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || getFallbackChat(message, language);
        res.json({
          reply,
          provider: 'Gemini 3.8 Flash',
          model: 'gemini-3.8-flash',
          hasLiveAi: true,
        });
        return;
      } catch (geminiErr: any) {
        console.warn('Gemini chat error, falling back:', geminiErr?.message);
      }
    }

    // Fallback if no API key or network error
    const fallbackText = getFallbackChat(message, language);
    res.json({
      reply: fallbackText,
      provider: 'AAB AI Engine (Local Mode)',
      hasLiveAi: false,
      notice: 'Gemini API can be attached via Secrets panel for real-time live model responses.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// 2. AI Hindi Story Writer Route
app.post('/api/story', async (req: Request, res: Response) => {
  try {
    const {
      topic = 'साहस और ईमानदारी',
      genre = 'प्रेरणादायक', // Moral/Inspirational, Bal Kahani, Mythology, Sci-Fi, Mystery, Comedy, Romance
      length = 'medium', // short, medium, long
      moral = 'सच्चाई की हमेशा जीत होती है',
      characters = 'रोहन और उसकी दादी',
      language = 'hi',
    } = req.body;

    const targetWords = length === 'short' ? '300-450' : length === 'long' ? '900-1200' : '600-800';

    if (aiClient) {
      try {
        const prompt = `Write an authentic, captivating, deeply engaging story in Hindi (हिंदी).
Brand: AAB AI (Created by Aditya Ashok Bagh).
Parameters:
- Topic / Theme: ${topic}
- Genre / शैली: ${genre}
- Key Moral / सीख: ${moral}
- Main Characters / मुख्य पात्र: ${characters}
- Word count: Approximately ${targetWords} words.

Format your output in clean JSON with the following structure:
{
  "title": "आकर्षक हिंदी शीर्षक",
  "genre": "${genre}",
  "characters": ["पात्र 1: संक्षिप्त परिचय", "पात्र 2: संक्षिप्त परिचय"],
  "synopsis": "कहानी का संक्षिप्त सारांश (2-3 पंक्तियों में)",
  "storyParagraphs": [
    "पहला पैराग्राफ...",
    "दूसरा पैराग्राफ...",
    "तीसरा पैराग्राफ...",
    "चौथा पैराग्राफ..."
  ],
  "moral": "कहानी की मुख्य सीख (Moral Lesson)",
  "readingTimeMinutes": 3,
  "audioScript": "कहानी का वॉइसओवर वाचन के लिए संक्षिप्त परिचय और मुख्य संवाद"
}
Ensure the Hindi is natural, emotional, evocative, grammatically rich (शुद्ध एवं प्रवाहपूर्ण हिंदी), and suited for all age groups.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an acclaimed master Hindi author, poet, and storyteller.',
            responseMimeType: 'application/json',
            temperature: 0.8,
          },
        });

        const raw = response.text?.trim() || '{}';
        const parsed = JSON.parse(raw);
        res.json({
          success: true,
          data: parsed,
          provider: 'Gemini 3.8 Flash',
        });
        return;
      } catch (err: any) {
        console.warn('Gemini story error, falling back:', err?.message);
      }
    }

    // High quality fallback story
    const fallbackStory = {
      title: `${topic} - एक अविस्मरणीय गाथा`,
      genre: genre,
      characters: [
        `${characters.split(',')[0] || 'रोहन'} - एक निष्ठावान और कर्मठ बालक`,
        'गुरुदेव / दादी जी - ज्ञान और संस्कारों की प्रतिमूर्ति',
      ],
      synopsis: `यह कहानी हमें सिखाती है कि जीवन के कठिनतम मोड़ों पर भी यदि धैर्य, सत्य और समर्पण का दामन न छोड़ा जाए, तो विजय अवश्य मिलती है।`,
      storyParagraphs: [
        `एक समय की बात है, हरी-भरी पहाड़ियों की तलहटी में बसे एक शांत गांव में जीवन अपनी स्वाभाविक गति से बह रहा था। वहाँ रहने वाले लोगों के मन में सादगी और प्रेम का वास था। उसी गाँव में ${characters.split(',')[0] || 'रोहन'} रहता था, जिसकी आँखों में बड़े-बड़े सपने और हृदय में अटूट विश्वास था।`,
        `एक दिन गाँव पर एक अप्रत्याशित संकट आ पड़ा। जल के प्राचीन स्रोत सूखने लगे और हर ओर चिंता की लकीरें उभर आईं। कई लोग हताश होकर पलायन की सोचने लगे, परंतु ${characters.split(',')[0] || 'रोहन'} ने हार नहीं मानी। उसने अपने बुजुर्गों से सुना था कि पर्वत के शीर्ष पर एक गुप्त जलधारा है, जिसे खोजने के लिए असीम धैर्य और सच्चे मन की आवश्यकता होती है।`,
        `मार्ग कांटों और गहरी खाइयों से भरा था। कई बार उसका पैर फिसला और मन में संशय के बादल घिरे, लेकिन उसने अपने लक्ष्य से दृष्टि नहीं हटाई। रास्ते में उसे एक घायल पक्षी मिला; अपनी यात्रा की जल्दी होने के बावजूद उसने रुककर उस पक्षी की सेवा की। यही दया और निस्वार्थ भाव उसकी सबसे बड़ी शक्ति बन गए।`,
        `अंततः, सूर्योदय की पहली किरण के साथ वह पर्वत की चोटी पर पहुंचा और वहाँ उसे अमृत तुल्य शीतल जल का प्रवाह मिला। उसने गाँव में जल की धारा प्रवाहित की और पूरे क्षेत्र में नवजीवन का संचार कर दिया। गाँव वालों ने जाना कि सच्ची शक्ति केवल शारीरिक बल में नहीं, बल्कि अडिग संकल्प और परोपकार में होती है।`,
      ],
      moral: moral || 'सच्चा साहस और निस्वार्थ कर्म ही हर कठिनाई पर विजय प्राप्त करते हैं।',
      readingTimeMinutes: 3,
      audioScript: `नमस्ते श्रोताओं! AAB AI द्वारा प्रस्तुत इस प्रेरणादायक कथा को सुनिए, जो हमें याद दिलाती है कि संकल्प और दया ही मानव जीवन का सर्वोच्च आभूषण हैं।`,
    };

    res.json({
      success: true,
      data: fallbackStory,
      provider: 'AAB AI Story Engine',
      hasLiveAi: false,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Story generation failed' });
  }
});

// 3. AI Content Writer Route
app.post('/api/content', async (req: Request, res: Response) => {
  try {
    const {
      type = 'blog', // blog, youtube, instagram, email, bio, ad
      topic = 'आधुनिक भारत में AI का भविष्य',
      tone = 'professional', // professional, casual, enthusiastic, educational, persuasive
      language = 'hi', // hi, en, hinglish
      keywords = '',
      targetAudience = 'General Public',
    } = req.body;

    if (aiClient) {
      try {
        const prompt = `Act as an expert multilingual copywriter and digital content strategist for AAB AI (Created by Aditya Ashok Bagh).
Create high-impact content for:
Type: ${type}
Topic: ${topic}
Tone: ${tone}
Language: ${language === 'hi' ? 'Hindi (हिंदी)' : language === 'hinglish' ? 'Hinglish (Hindi written in Roman / mixed)' : 'English'}
Keywords: ${keywords || 'relevant trending industry keywords'}
Audience: ${targetAudience}

Output valid JSON matching this schema:
{
  "title": "Engaging Headline / Title",
  "hook": "Attention-grabbing opening hook",
  "sections": [
    { "heading": "Section Heading", "body": "Detailed paragraph content..." }
  ],
  "callToAction": "Clear CTA statement",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"],
  "seoMetaDescription": "150-160 characters summary for SEO or preview",
  "tips": "Pro-tip for creator on posting or delivering this content"
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You produce viral, grammatically crisp, audience-converting digital content.',
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const raw = response.text?.trim() || '{}';
        const parsed = JSON.parse(raw);
        res.json({
          success: true,
          data: parsed,
          provider: 'Gemini 3.8 Flash',
        });
        return;
      } catch (err: any) {
        console.warn('Gemini content error, falling back:', err?.message);
      }
    }

    // High quality fallback content
    const isHindi = language === 'hi';
    const fallbackContent = {
      title: isHindi
        ? `${topic}: संपूर्ण विश्लेषण एवं नई दिशाएँ`
        : `${topic}: The Ultimate Comprehensive Guide`,
      hook: isHindi
        ? `क्या आप जानते हैं कि आने वाले 5 वर्षों में यह क्षेत्र पूरी दुनिया को किस प्रकार बदलने जा रहा है? आइए विस्तार से समझते हैं।`
        : `Did you know this very domain is set to revolutionize everyday life faster than anything before it? Let's break it down.`,
      sections: [
        {
          heading: isHindi ? '1. वर्तमान परिदृश्य और अवसर' : '1. The Current Landscape & Opportunities',
          body: isHindi
            ? `आज के तीव्र गति से बदलते डिजिटल युग में सही समय पर सही तकनीक और जानकारी अपनाना सबसे बड़ा विभेदक (differentiator) बन गया है। ${topic} केवल एक रुझान नहीं, बल्कि भविष्य की सशक्त बुनियाद है।`
            : `In today's fast-moving world, adopting the right tools and deep insights is the ultimate competitive advantage. ${topic} is not just a trend—it's the core foundation of tomorrow.`,
        },
        {
          heading: isHindi ? '2. मुख्य रणनीतियाँ और प्रभाव' : '2. Key Actionable Strategies',
          body: isHindi
            ? `सफलता प्राप्त करने के लिए तीन आवश्यक स्तंभ हैं: निरंतर अध्ययन, आधुनिक उपकरणों का विवेकपूर्ण उपयोग और लक्षित क्रियान्वयन। जब आप इन तीनों को संयोजित करते हैं, तो परिणाम असाधारण होते हैं।`
            : `Achieving success requires three core pillars: continuous learning, smart utilization of modern tech, and disciplined execution. Combining these yields exponential returns.`,
        },
        {
          heading: isHindi ? '3. भविष्य की राह' : '3. The Road Ahead',
          body: isHindi
            ? `आने वाले समय में नवाचार ही नेतृत्व करेगा। जो लोग आज तैयारी कर रहे हैं, वे कल नए मानक स्थापित करेंगे।`
            : `Innovation will lead the way. Those preparing today will set the gold standard tomorrow.`,
        },
      ],
      callToAction: isHindi
        ? `आप इस विषय पर क्या सोचते हैं? नीचे अपनी राय साझा करें और AAB AI के साथ जुड़े रहें!`
        : `What are your thoughts on this? Share your perspective below and stay ahead with AAB AI!`,
      hashtags: ['#AABAI', '#Technology', '#Innovation', '#Growth', '#IndiaTech', '#FutureReady'],
      seoMetaDescription: isHindi
        ? `${topic} पर AAB AI द्वारा प्रस्तुत व्यावहारिक और गहन विश्लेषण। जानिए मुख्य रणनीतियाँ और भविष्य का रोडमैप।`
        : `Comprehensive breakdown of ${topic} created with AAB AI. Master the key insights and future outlook today.`,
      tips: isHindi
        ? `इस सामग्री को सुबह 9-11 बजे या शाम 7-9 बजे के बीच पोस्ट करें ताकि अधिकतम दृश्यता (engagement) मिले।`
        : `Post this during peak engagement hours (9-11 AM or 7-9 PM) with a striking cover visual.`,
    };

    res.json({
      success: true,
      data: fallbackContent,
      provider: 'AAB AI Content Engine',
      hasLiveAi: false,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Content generation failed' });
  }
});

// 4. AI Photo Generator Route
// Free & instant high-resolution image engine + prompt enhancement
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      style = 'photorealistic', // photorealistic, anime, digital_art, cinematic, 3d_render, cyber_india
      aspectRatio = '1:1', // 1:1, 16:9, 9:16, 4:3, 3:4
      negativePrompt = '',
    } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // Enhance prompt using Gemini if available for ultra-detailed visual rendering
    let enhancedPrompt = prompt;
    if (aiClient) {
      try {
        const enhanceRes = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert AI visual prompter. Translate and enhance this prompt for text-to-image synthesis into a rich, English visual description with cinematic lighting, 8k resolution details, style: ${style}. Keep it concise under 70 words. Original user prompt: "${prompt}"`,
          config: {
            systemInstruction: 'Output only the enhanced English prompt string without quotes.',
            temperature: 0.7,
          },
        });
        if (enhanceRes.text) {
          enhancedPrompt = enhanceRes.text.trim();
        }
      } catch (err) {
        console.warn('Prompt enhancement fallback:', err);
      }
    }

    // Dimensions based on aspect ratio
    let width = 1024;
    let height = 1024;
    if (aspectRatio === '16:9') {
      width = 1280;
      height = 720;
    } else if (aspectRatio === '9:16') {
      width = 720;
      height = 1280;
    } else if (aspectRatio === '4:3') {
      width = 1024;
      height = 768;
    } else if (aspectRatio === '3:4') {
      width = 768;
      height = 1024;
    }

    // High quality free neural image synthesis using Pollinations AI
    // Completely free, instant, no user API key needed, zero-cost!
    const encodedPrompt = encodeURIComponent(`${enhancedPrompt}, high aesthetic, masterwork, ${style} style`);
    const seed = Math.floor(Math.random() * 9999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;

    res.json({
      success: true,
      imageUrl,
      prompt: prompt,
      enhancedPrompt: enhancedPrompt,
      style,
      aspectRatio,
      dimensions: `${width}x${height}`,
      provider: 'AAB Neural Image Engine (Free & Instant)',
      apiType: 'Instant Free Neural Synthesis',
      seed,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Image generation failed' });
  }
});

// 5. AI Video Creator Route
// Generates complete multi-scene cinematic storyboard with visual frames, voiceover, sound FX, timing, and player-ready animation
app.post('/api/generate-video', async (req: Request, res: Response) => {
  try {
    const {
      topic = 'भारत की अंतरिक्ष यात्रा - चंद्रयान से गगनयान',
      style = 'cinematic', // cinematic, documentary, anime, futuristic, advertisement
      durationSeconds = 30, // 15, 30, 45, 60
      aspectRatio = '16:9', // 16:9, 9:16
      language = 'hi', // hi, en
    } = req.body;

    const sceneCount = durationSeconds <= 20 ? 3 : durationSeconds <= 35 ? 4 : 5;
    const isHindi = language === 'hi';

    if (aiClient) {
      try {
        const prompt = `Act as an award-winning Film & Video Director for AAB AI (Created by Aditya Ashok Bagh).
Create a complete production storyboard and scene-by-scene script for a ${durationSeconds}-second ${style} video.
Topic: ${topic}
Language for voiceover: ${isHindi ? 'Hindi (हिंदी)' : 'English'}
Aspect Ratio: ${aspectRatio}
Number of scenes: ${sceneCount}

Output valid JSON matching this schema:
{
  "title": "Compelling Video Title in ${isHindi ? 'Hindi' : 'English'}",
  "logline": "One-line summary of the video",
  "mood": "Cinematic / Inspirational / Epic / Energetic",
  "backgroundMusicSuggestion": "Music style & tempo recommendation (e.g., Deep synth strings building to an orchestral crescendo)",
  "totalDurationSeconds": ${durationSeconds},
  "aspectRatio": "${aspectRatio}",
  "scenes": [
    {
      "sceneNumber": 1,
      "duration": 6,
      "shotType": "Wide Aerial Drone Shot / Close-up / Fast Pan",
      "visualDescription": "Detailed visual description of what appears on screen",
      "imagePrompt": "English descriptive prompt for rendering the exact frame image with cinematic lighting and ${style} style",
      "voiceover": "Voiceover line in ${isHindi ? 'Hindi' : 'English'} (what the narrator speaks during this scene)",
      "sfx": "Sound effect (e.g., Rocket rumble, wind whoosh, soft chime)",
      "cameraMotion": "Slow zoom in / Smooth dolly left / Static cinematic"
    }
  ],
  "creatorSignature": "AAB AI Studios - Aditya Ashok Bagh",
  "veoPromptExport": "A single prompt ready for external high-end video generators like Google Veo"
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are a master cinematic director crafting high-budget video storyboards.',
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const raw = response.text?.trim() || '{}';
        const parsed = JSON.parse(raw);

        // Attach visual frame URLs to each scene
        if (parsed.scenes && Array.isArray(parsed.scenes)) {
          const w = aspectRatio === '9:16' ? 720 : 1280;
          const h = aspectRatio === '9:16' ? 1280 : 720;
          parsed.scenes = parsed.scenes.map((sc: any, idx: number) => {
            const seed = Math.floor(Math.random() * 888888) + idx * 1000;
            const promptStr = encodeURIComponent(sc.imagePrompt || `${topic} scene ${idx + 1} cinematic lighting`);
            return {
              ...sc,
              frameImageUrl: `https://image.pollinations.ai/prompt/${promptStr}?width=${w}&height=${h}&seed=${seed}&nologo=true`,
            };
          });
        }

        res.json({
          success: true,
          data: parsed,
          provider: 'Gemini 3.8 Flash + AAB Video Synth',
          hasLiveAi: true,
        });
        return;
      } catch (err: any) {
        console.warn('Gemini video error, falling back:', err?.message);
      }
    }

    // High quality fallback video project
    const w = aspectRatio === '9:16' ? 720 : 1280;
    const h = aspectRatio === '9:16' ? 1280 : 720;

    const fallbackScenes = [
      {
        sceneNumber: 1,
        duration: Math.round(durationSeconds / 4),
        shotType: 'Cinematic Wide Establishing Shot',
        visualDescription: isHindi
          ? 'सूर्य की सुनहरी किरणों के बीच क्षितिज पर उभरता हुआ भव्य परिदृश्य और भविष्य की झलक।'
          : 'A grand sunrise casting golden rays across the horizon revealing futuristic possibilities.',
        imagePrompt: `Cinematic wide shot sunrise horizon futuristic landscape golden volumetric lighting 8k`,
        frameImageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + ' sunrise dramatic establishing shot cinematic')}?width=${w}&height=${h}&seed=101&nologo=true`,
        voiceover: isHindi
          ? `हर महान यात्रा की शुरुआत एक साधारण सपने और अटूट विश्वास से होती है।`
          : `Every monumental journey begins with a singular vision and unwavering faith.`,
        sfx: 'Ambient orchestral drone with gentle wind chime',
        cameraMotion: 'Slow cinematic push-in',
      },
      {
        sceneNumber: 2,
        duration: Math.round(durationSeconds / 4),
        shotType: 'Close-up Dynamic Action Shot',
        visualDescription: isHindi
          ? 'कठिन परिश्रम, तकनीकी आविष्कार और ऊर्जा का तीव्र प्रवाह।'
          : 'Intense energy, cutting-edge technology, and passionate pursuit in action.',
        imagePrompt: `Intense close-up technology human innovation neon blue purple backlight high-tech cinematic`,
        frameImageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + ' high technology innovation detailed close up')}?width=${w}&height=${h}&seed=202&nologo=true`,
        voiceover: isHindi
          ? `जब संकल्प और आधुनिक विज्ञान एक साथ मिलते हैं, तो असंभव भी संभव बन जाता है।`
          : `When determined human effort meets advanced technology, boundaries fade away.`,
        sfx: 'Bass drop transitioning to rhythmic synthetic pulse',
        cameraMotion: 'Dynamic arc rotation',
      },
      {
        sceneNumber: 3,
        duration: Math.round(durationSeconds / 4),
        shotType: 'High Angle Aerial Drone Shot',
        visualDescription: isHindi
          ? 'असीमित सीमाओं को पार करते हुए गंतव्य की ओर तीव्र गति से अग्रसर।'
          : 'Soaring above boundaries, accelerating towards the ambitious destination.',
        imagePrompt: `Aerial drone view epic movement stars cosmos exploration cinematic ultra-detailed`,
        frameImageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + ' epic exploration aerial drone view')}?width=${w}&height=${h}&seed=303&nologo=true`,
        voiceover: isHindi
          ? `यह केवल हमारी प्रगति नहीं, बल्कि आने वाली पीढ़ियों के लिए नई उम्मीद का प्रकाश है।`
          : `This is not merely our progress, but a beacon of hope for generations ahead.`,
        sfx: 'Whoosh transition into triumphant brass motif',
        cameraMotion: 'Rapid fly-through upward tilt',
      },
      {
        sceneNumber: 4,
        duration: Math.round(durationSeconds / 4),
        shotType: 'Triumphant Master Shot & Logo Reveal',
        visualDescription: isHindi
          ? 'सफलता का गौरवशाली क्षण, जगमगाते सितारे और प्रेरणादायक आभास।'
          : 'Triumphant achievement against starry backdrop, inspiring awe and victory.',
        imagePrompt: `Triumphant victory epic glowing horizon starry sky neon AAB AI masterpiece 8k`,
        frameImageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + ' triumph victory starry sky masterpiece')}?width=${w}&height=${h}&seed=404&nologo=true`,
        voiceover: isHindi
          ? `भविष्य अब दूर नहीं, भविष्य आज है। AAB AI के साथ अपनी सोच को पंख दें।`
          : `The future is not distant; the future is right now. Power your imagination with AAB AI.`,
        sfx: 'Crescendo finale with lingering harmonic chord',
        cameraMotion: 'Majestic slow pull-back',
      },
    ];

    const fallbackVideo = {
      title: isHindi ? `${topic} - एक नया सवेरा` : `${topic}: The Next Horizon`,
      logline: isHindi
        ? `एक ऐसी प्रेरणादायक यात्रा जो मानवीय संकल्प और आधुनिक तकनीक के संगम को दर्शाती है।`
        : `An inspiring journey uniting human ambition with next-generation innovation.`,
      mood: 'Cinematic & Uplifting',
      backgroundMusicSuggestion: 'Epic cinematic orchestral with ambient synth pads (105 BPM)',
      totalDurationSeconds: durationSeconds,
      aspectRatio: aspectRatio,
      scenes: fallbackScenes,
      creatorSignature: 'AAB AI Studios - Aditya Ashok Bagh',
      veoPromptExport: `Cinematic 4k trailer about ${topic}, volumetric purple and blue neon lighting, photorealistic, 24fps film grain, award-winning cinematography.`,
    };

    res.json({
      success: true,
      data: fallbackVideo,
      provider: 'AAB Video Engine',
      hasLiveAi: false,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Video generation failed' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ AAB AI Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
