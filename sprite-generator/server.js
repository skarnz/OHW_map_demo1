/**
 * Sprite Generator Web Server
 * Provides a UI for generating and previewing health milestone sprites
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Load API key
const envPath = path.join(__dirname, '../engine/.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKeyMatch = envContent.match(/OPENROUTER_API_KEY=(.+)/);
const OPENROUTER_API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : null;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/output', express.static(path.join(__dirname, 'output')));

// Journey nodes organized by view level and category
const MILESTONES = [
  // === QUARTERLY NODES (4) - Large landmark buildings ===
  { id: 'q1-foundation', name: 'Q1: Foundation', size: '4x4', category: 'quarter', environment: 'wilderness', 
    description: 'Log cabin on a lake, forest trails, wilderness setting' },
  { id: 'q2-momentum', name: 'Q2: Momentum', size: '4x4', category: 'quarter', environment: 'suburban',
    description: 'Community center with fountain, park benches, bikes' },
  { id: 'q3-optimization', name: 'Q3: Optimization', size: '4x4', category: 'quarter', environment: 'urban',
    description: 'Garden building with solar panels, mixed residential' },
  { id: 'q4-sustainability', name: 'Q4: Sustainability', size: '6x6', category: 'quarter', environment: 'city',
    description: 'Modern tower with glowing elements, healthy urban life' },

  // === MONTHLY NODES (per-month education & milestones) ===
  { id: 'education-module', name: 'Education Module', size: '2x2', category: 'monthly_education',
    description: 'Graduation cap building, deep learning center' },
  { id: 'monthly-goal-review', name: 'Monthly Goal Review', size: '2x2', category: 'monthly_goal',
    description: 'Target/bullseye themed building, goal tracker' },
  { id: 'monthly-reflection', name: 'Monthly Reflection', size: '2x2', category: 'monthly_reflection',
    description: 'Journal/book themed building, contemplation space' },
  { id: 'monthly-milestone', name: 'Monthly Milestone', size: '3x3', category: 'monthly_milestone',
    description: 'Trophy building, celebration monument' },

  // === WEEKLY NODES (8-9 per week) ===
  { id: 'provider-checkin', name: 'Provider Check-In', size: '2x2', category: 'weekly_provider',
    description: 'Clipboard/medical office building, care team hub' },
  { id: 'weighin-metrics', name: 'Weigh-In & Metrics', size: '2x2', category: 'weekly_weighin',
    description: 'Scale building, body composition center' },
  { id: 'medication-review', name: 'Medication Review', size: '2x2', category: 'weekly_medication',
    description: 'Pill bottle/pharmacy building, medication tracker' },
  { id: 'weekly-goal-check', name: 'Weekly Goal Check', size: '1x1', category: 'weekly_goal',
    description: 'Small target building, SMART goal checkpoint' },
  { id: 'nutrition-summary', name: 'Nutrition Summary', size: '2x2', category: 'weekly_nutrition',
    description: 'Chart/graph building, nutrition breakdown center' },
  { id: 'fitness-summary', name: 'Fitness Summary', size: '2x2', category: 'weekly_fitness',
    description: 'Dumbbell/gym building, activity log center' },
  { id: 'weekly-education', name: 'Weekly Education', size: '1x1', category: 'weekly_education',
    description: 'Book/lightbulb building, bite-sized learning' },
  { id: 'weekly-reflection', name: 'Weekly Reflection', size: '1x1', category: 'weekly_reflection',
    description: 'Notes/journal kiosk, reflection prompt station' },
  { id: 'weekly-milestone', name: 'Weekly Milestone', size: '2x2', category: 'weekly_milestone',
    description: 'Star building, weekly celebration monument' },

  // === DAILY NODES (4-5 per day) ===
  { id: 'daily-medication', name: 'Daily Medication', size: '1x1', category: 'daily_medication',
    description: 'Small pill/syringe station, daily med check' },
  { id: 'daily-nutrition', name: 'Daily Nutrition', size: '1x1', category: 'daily_nutrition',
    description: 'Apple/plate kiosk, meal logging station' },
  { id: 'daily-movement', name: 'Daily Movement', size: '1x1', category: 'daily_movement',
    description: 'Running figure station, step/workout tracker' },
  { id: 'daily-rest', name: 'Daily Rest & Mood', size: '1x1', category: 'daily_rest',
    description: 'Moon/mood face station, sleep and mood check' },
  { id: 'daily-sleep', name: 'Daily Sleep', size: '1x1', category: 'daily_sleep',
    description: 'Bed/pillow station, bedtime reminder' },

  // === ENVIRONMENT DECORATIONS ===
  { id: 'wilderness-cabin', name: 'Wilderness Cabin', size: '3x3', category: 'decoration',
    description: 'Q1 environment: log cabin by a lake' },
  { id: 'forest-tree', name: 'Forest Tree', size: '1x2', category: 'decoration',
    description: 'Dense forest tree for wilderness environment' },
  { id: 'park-bench', name: 'Park Bench', size: '1x1', category: 'decoration',
    description: 'Suburban park bench with person' },
  { id: 'fountain', name: 'Town Fountain', size: '2x2', category: 'decoration',
    description: 'Community fountain, suburban centerpiece' },
  { id: 'garden-bed', name: 'Garden Bed', size: '1x1', category: 'decoration',
    description: 'Urban garden bed with vegetables' },
  { id: 'street-lamp', name: 'Street Lamp', size: '1x1', category: 'decoration',
    description: 'Modern street lamp, city environment' },
];

// API: List milestones
app.get('/api/milestones', (req, res) => {
  res.json(MILESTONES);
});

// API: Generate sprite
app.post('/api/generate', async (req, res) => {
  const { milestoneId, customPrompt } = req.body;
  
  const milestone = MILESTONES.find(m => m.id === milestoneId);
  if (!milestone && !customPrompt) {
    return res.status(400).json({ error: 'Invalid milestone or no custom prompt' });
  }

  const prompt = customPrompt || buildPrompt(milestone);
  
  console.log(`Generating sprite for: ${milestone?.name || 'custom'}`);
  console.log(`Prompt: ${prompt.slice(0, 200)}...`);

  try {
    // Use OpenRouter with Gemini 2.5 Flash Image (Nano Banana) for image generation
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'OHW Sprite Generator'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image', // Image generation model (Nano Banana)
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data).slice(0, 500));
    
    // Check for image in response
    const message = data.choices?.[0]?.message;
    const content = message?.content;
    const images = message?.images || []; // Gemini returns images in separate array
    
    // Ensure output directory exists
    const outputDir = path.join(__dirname, 'output', 'sprites');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    const savedImages = [];
    
    // Handle images array from Gemini response
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const base64Data = img.image_url?.url?.replace(/^data:image\/\w+;base64,/, '') || 
                          img.data?.replace(/^data:image\/\w+;base64,/, '');
        
        if (base64Data) {
          const filename = `${milestone?.id || 'custom'}_${Date.now()}_${i}.png`;
          const filepath = path.join(outputDir, filename);
          fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
          savedImages.push(`/output/sprites/${filename}`);
          console.log(`Saved image: ${filename}`);
        }
      }
    }
    
    // Also check if content is array with image parts
    if (Array.isArray(content)) {
      const imgParts = content.filter(part => part.type === 'image_url' || part.image);
      for (let i = 0; i < imgParts.length; i++) {
        const img = imgParts[i];
        const base64Data = img.image_url?.url?.replace(/^data:image\/\w+;base64,/, '') || 
                          img.image?.replace(/^data:image\/\w+;base64,/, '');
        
        if (base64Data) {
          const filename = `${milestone?.id || 'custom'}_${Date.now()}_array_${i}.png`;
          const filepath = path.join(outputDir, filename);
          fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
          savedImages.push(`/output/sprites/${filename}`);
          console.log(`Saved image from array: ${filename}`);
        }
      }
    }
    
    if (savedImages.length > 0) {
      res.json({
        success: true,
        milestone: milestone?.name || 'custom',
        images: savedImages,
        text: typeof content === 'string' ? content : (Array.isArray(content) ? content.filter(p => p.type === 'text').map(p => p.text).join('\n') : ''),
        model: data.model
      });
    } else if (content) {
      // Text-only response
      res.json({
        success: true,
        milestone: milestone?.name || 'custom',
        response: typeof content === 'string' ? content : JSON.stringify(content),
        model: data.model,
        note: 'No images generated - text response only'
      });
    } else {
      res.json({
        success: false,
        error: 'No content in response',
        raw: data
      });
    }

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Build prompt for milestone
function buildPrompt(milestone) {
  const categoryStyles = {
    quarter: 'large landmark building representing a major phase of the health journey',
    monthly_education: 'education/learning themed building with graduation cap or book elements',
    monthly_goal: 'goal-setting building with target/bullseye visual elements',
    monthly_reflection: 'contemplative journal/book themed peaceful space',
    monthly_milestone: 'celebration trophy or monument building',
    weekly_provider: 'medical office/clipboard themed healthcare building',
    weekly_weighin: 'scale/measurement themed body composition center',
    weekly_medication: 'pharmacy/pill bottle themed medication station',
    weekly_goal: 'small target/checkpoint building',
    weekly_nutrition: 'chart/graph themed nutrition tracking building',
    weekly_fitness: 'gym/dumbbell themed fitness center',
    weekly_education: 'small book/lightbulb learning kiosk',
    weekly_reflection: 'journal/notes themed reflection station',
    weekly_milestone: 'star-shaped celebration monument',
    daily_medication: 'small pill/medicine dispenser station',
    daily_nutrition: 'apple/food plate themed quick-log kiosk',
    daily_movement: 'running figure/steps themed tracker station',
    daily_rest: 'moon/mood emoji themed wellness check station',
    daily_sleep: 'bed/pillow themed sleep reminder station',
    decoration: 'decorative environment element'
  };

  const environmentStyles = {
    wilderness: 'surrounded by forest, lake, nature trails - rustic cabin aesthetic',
    suburban: 'in a town setting with park, benches, bikes - community feel',
    urban: 'mixed residential with gardens, solar panels - transitional urban',
    city: 'modern city setting with glass, lights, greenery - healthy urban life'
  };

  const style = categoryStyles[milestone.category] || 'wellness themed building';
  const envStyle = milestone.environment ? environmentStyles[milestone.environment] : '';
  const customDesc = milestone.description || '';
  
  return `Create an isometric "${milestone.name}" building sprite for a health journey game:

BUILDING TYPE: ${style}
VISUAL CONCEPT: ${customDesc}
SIZE: ${milestone.size} tile footprint (each tile is 44x22 pixels in isometric view)
${envStyle ? `ENVIRONMENT: ${envStyle}` : ''}

STYLE REQUIREMENTS:
- Modern, clean wellness aesthetic with teal/blue/green color palette
- 2:1 isometric projection, front-facing (south) view
- Vibrant but not oversaturated colors
- Health/wellness visual elements (plants, nature, clean lines)
- Floating circular node style - like a game checkpoint

TECHNICAL REQUIREMENTS:
- Pure white or transparent background
- Building centered at bottom-center of image
- Top-left lighting
- No ground shadows
- Clean vector-friendly edges (not pixelated)
- 512x512 pixel output

THEME: This is a node on a health journey map. Users tap these to track their progress. Make it feel rewarding, motivating, and clearly represent its purpose.`;
}

// API: Copy sprite to engine (direct file copy + register)
app.post('/api/copy-to-engine', async (req, res) => {
  const { spritePath, milestoneId } = req.body;
  
  if (!spritePath || !milestoneId) {
    return res.status(400).json({ error: 'Missing spritePath or milestoneId' });
  }
  
  try {
    const sourcePath = path.join(__dirname, spritePath.replace('/output/', 'output/'));
    const milestone = MILESTONES.find(m => m.id === milestoneId);
    const filename = `${milestone?.size || '2x2'}${milestoneId}_south.png`;
    const destDir = path.join(__dirname, '../engine/public/Building/milestones');
    const destPath = path.join(destDir, filename);
    
    // Create milestones directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    
    console.log(`Copied ${sourcePath} to ${destPath}`);
    
    // Also save a registry entry for the generated sprite
    const registryDir = path.join(__dirname, '../engine/public/generated');
    if (!fs.existsSync(registryDir)) {
      fs.mkdirSync(registryDir, { recursive: true });
    }
    
    const registryEntry = {
      id: milestoneId,
      name: milestone?.name || milestoneId,
      category: milestone?.category || 'custom',
      size: milestone?.size || '2x2',
      spritePath: `/Building/milestones/${filename}`,
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(registryDir, `${milestoneId}.json`),
      JSON.stringify(registryEntry, null, 2)
    );
    
    res.json({
      success: true,
      message: `Sprite copied to engine`,
      enginePath: `/Building/milestones/${filename}`,
      filename,
      registry: registryEntry
    });
  } catch (error) {
    console.error('Copy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Get list of generated sprites that have been copied to engine
app.get('/api/engine-sprites', (req, res) => {
  const registryDir = path.join(__dirname, '../engine/public/generated');
  
  if (!fs.existsSync(registryDir)) {
    return res.json({ sprites: [] });
  }
  
  const files = fs.readdirSync(registryDir).filter(f => f.endsWith('.json'));
  const sprites = files.map(f => {
    const content = fs.readFileSync(path.join(registryDir, f), 'utf-8');
    return JSON.parse(content);
  });
  
  res.json({ sprites });
});

// Serve the UI
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>OHW Sprite Generator</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 20px;
      background: #1a1a2e;
      color: #eee;
    }
    h1 { color: #4ecca3; }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
      gap: 15px;
      margin: 20px 0;
    }
    .card {
      background: #16213e;
      border-radius: 12px;
      padding: 15px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid transparent;
    }
    .card:hover { 
      transform: translateY(-3px); 
      box-shadow: 0 5px 20px rgba(78, 204, 163, 0.3);
      border-color: #4ecca3;
    }
    .card.selected { border-color: #4ecca3; background: #1a2744; }
    .card h3 { margin: 0 0 8px; color: #4ecca3; font-size: 14px; }
    .card .meta { font-size: 12px; color: #888; }
    .card .category { 
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      margin-top: 8px;
    }
    .category.weight { background: #ff6b6b33; color: #ff6b6b; }
    .category.fitness { background: #4ecdc433; color: #4ecdc4; }
    .category.nutrition { background: #ffe66d33; color: #ffe66d; }
    .category.wellness { background: #95e1d333; color: #95e1d3; }
    .category.landmark { background: #dda0dd33; color: #dda0dd; }
    
    .controls {
      background: #16213e;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    textarea {
      width: 100%;
      height: 150px;
      background: #1a1a2e;
      border: 1px solid #333;
      border-radius: 8px;
      color: #eee;
      padding: 12px;
      font-family: monospace;
      resize: vertical;
    }
    button {
      background: #4ecca3;
      color: #1a1a2e;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 16px;
      margin-top: 10px;
    }
    button:hover { background: #3db892; }
    button:disabled { background: #555; cursor: not-allowed; }
    
    .output {
      background: #16213e;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      min-height: 200px;
    }
    .output pre {
      background: #1a1a2e;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre-wrap;
    }
    .output img {
      max-width: 100%;
      border-radius: 8px;
      background: #fff;
    }
    .loading {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #4ecca3;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #4ecca3;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <h1>🎨 OHW Health Journey Sprite Generator</h1>
  <p>Select a milestone to generate an isometric building sprite using Gemini AI</p>
  
  <h2>Milestones</h2>
  <div class="grid" id="milestones"></div>
  
  <div class="controls">
    <h3>Generation Prompt</h3>
    <textarea id="prompt" placeholder="Select a milestone above or write a custom prompt..."></textarea>
    <br>
    <button id="generate" onclick="generate()">🚀 Generate Sprite</button>
  </div>
  
  <div class="output">
    <h3>Output</h3>
    <div id="output">Select a milestone and click Generate to create a sprite</div>
  </div>

  <script>
    let selectedMilestone = null;
    
    // Load milestones
    fetch('/api/milestones')
      .then(r => r.json())
      .then(milestones => {
        const grid = document.getElementById('milestones');
        milestones.forEach(m => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = \`
            <h3>\${m.name}</h3>
            <div class="meta">Size: \${m.size}</div>
            <span class="category \${m.category}">\${m.category}</span>
          \`;
          card.onclick = () => selectMilestone(m, card);
          grid.appendChild(card);
        });
      });
    
    function selectMilestone(m, card) {
      document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedMilestone = m;
      
      // Build prompt
      const prompt = buildPrompt(m);
      document.getElementById('prompt').value = prompt;
    }
    
    function buildPrompt(m) {
      const styles = {
        weight: 'celebratory achievement monument with scale/weight theme',
        fitness: 'energetic gym/exercise themed structure', 
        nutrition: 'healthy food/cooking themed building',
        wellness: 'peaceful zen/meditation themed space',
        landmark: 'grand ceremonial milestone building'
      };
      return \`Create an isometric "\${m.name}" building sprite for a health journey game:

BUILDING TYPE: \${styles[m.category] || 'wellness themed building'}
SIZE: \${m.size} tile footprint (each tile is 44x22 pixels in isometric view)

STYLE REQUIREMENTS:
- Modern, clean wellness aesthetic
- 2:1 isometric projection, front-facing (south) view
- Vibrant but not oversaturated colors
- Health/wellness visual elements (plants, nature, clean lines)

TECHNICAL REQUIREMENTS:
- Pure white or transparent background
- Building centered at bottom-center of image
- Top-left lighting
- No ground shadows
- Clean pixel-art friendly edges
- 512x512 pixel output

THEME: This represents a \${m.category} achievement in someone's health journey. Make it feel rewarding and motivating.\`;
    }
    
    async function copyToEngine(spritePath) {
      if (!selectedMilestone) {
        alert('No milestone selected');
        return;
      }
      
      try {
        const res = await fetch('/api/copy-to-engine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            spritePath,
            milestoneId: selectedMilestone.id
          })
        });
        
        const data = await res.json();
        if (data.success) {
          alert(\`Sprite copied to engine!\\n\\nPath: \${data.enginePath}\\n\\nRefresh the main app at localhost:3000 to see it.\`);
        } else {
          alert('Error: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Error copying: ' + err.message);
      }
    }
    
    async function generate() {
      const btn = document.getElementById('generate');
      const output = document.getElementById('output');
      const prompt = document.getElementById('prompt').value;
      
      if (!prompt.trim()) {
        alert('Please enter a prompt or select a milestone');
        return;
      }
      
      btn.disabled = true;
      output.innerHTML = '<div class="loading"><div class="spinner"></div>Generating sprite...</div>';
      
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            milestoneId: selectedMilestone?.id,
            customPrompt: prompt
          })
        });
        
        const data = await res.json();
        
        if (data.success && data.images && data.images.length > 0) {
          // Show generated images
          const imagesHtml = data.images.map(img => \`
            <div style="margin: 10px 0; background: #fff; border-radius: 8px; padding: 10px; display: inline-block;">
              <img src="\${img}" style="max-width: 400px; max-height: 400px;" />
            </div>
          \`).join('');
          
          output.innerHTML = \`
            <p><strong>Generated for:</strong> \${data.milestone}</p>
            <p><strong>Model:</strong> \${data.model}</p>
            \${imagesHtml}
            <p style="margin-top: 15px;"><strong>Saved to:</strong> <code>\${data.images.join(', ')}</code></p>
            <p>\${data.text || ''}</p>
            <button onclick="copyToEngine('\${data.images[0]}')" style="margin-top: 10px;">
              📦 Copy to Engine
            </button>
          \`;
        } else if (data.success) {
          output.innerHTML = \`
            <p><strong>Generated for:</strong> \${data.milestone}</p>
            <p><strong>Model:</strong> \${data.model}</p>
            <pre>\${data.response || data.text || 'No content'}</pre>
            <p style="color: #ffe66d;">\${data.note || ''}</p>
          \`;
        } else {
          output.innerHTML = '<pre style="color:#ff6b6b">' + JSON.stringify(data, null, 2) + '</pre>';
        }
      } catch (err) {
        output.innerHTML = '<pre style="color:#ff6b6b">Error: ' + err.message + '</pre>';
      }
      
      btn.disabled = false;
    }
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n🎨 Sprite Generator running at http://localhost:${PORT}\n`);
});
