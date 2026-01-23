# How to Generate Video Game Sprites with AI

You don't need to be an artist to make video game characters anymore. This guide walks through using Claude AI for research and Gemini 3 Pro for generating pixel art sprites—all for about 13 cents per image.

## The Problem

Building a multiplayer soccer game requires players, fields, goals, and more. But what if you can't draw? AI can get you past the visuals bottleneck.

## Generating a Sprite Sheet with Gemini

Using Gemini 3 Pro (aka "Nano Banana Pro"), you can generate sprite sheets directly with prompts like:

> Create this pixel art sheet of the soccer player. Show the following four poses on a sprite sheet.

The results can be surprisingly complete—multiple poses generated in a single call.

## Defining a Nostalgic Art Style

Before prompting, establish your visual direction:

1. **Look at references** - Shop around for design ideas
2. **Choose color palettes** - Pick colors that inspire you
3. **Study fonts** - Find typography that fits the mood
4. **Consider bit depth**:
   - 8-bit: Classic NES style
   - 16-bit/32-bit: More color variety (SNES, Sega Genesis era)

The goal is making it personal first—then AI can generate sprites that fit your vision.

## Using Claude AI for Research

Claude (especially Opus 4.5) excels at:
- Sequential thinking and tool calling
- Taking unstructured requests and breaking them into steps
- Web searches via EXA MCP integration

### Sample Research Prompt

> I'm trying to do some research and build sprites for a game. I need you to do some research using EXA MCP. I'm not sure what I should be doing in terms of picking the right colors, fonts, and all these other things. My thinking was to start with Figma and look for inspiration.

Claude will:
1. Break down your multi-part request
2. Run web searches for context
3. Generate comprehensive checklists

## AI-Generated Game Asset Checklist

Claude can produce structured guides covering:

### Visual Style Guide
- Research and reference collection
- Tool setup (Aseprite ~$20, or free alternatives)
- Gemini 3 Pro image generation (~13 cents/image)

### Character Sprites
- Complete animation lists for outfield players, goalkeepers, etc.
- Exact AI prompts to use
- Big-head character proportions (roughly 2:1 head to body)
- Limit to ~4 colors per sprite for authenticity

### Environment Assets
- Field structures
- UI elements
- Grass, lines, dirt, goals

### Technical Specs
- Sprite dimensions
- Animation frame counts
- Export settings
- Example implementation code

## Key Workflow

The research confirms this winning combo:

1. **AI Generation** → Create the initial concept
2. **Manual Cleanup** → Polish pixel by pixel in Aseprite for crisp authenticity

Gemini can handle character consistency for up to 14 reference images—perfect for generating complete sprite sheets.

## AI Prompt Template for Gemini 3 Pro

```
Create this pixel art sheet of a soccer player:
- Style: [NES/SNES era, specify bit depth]
- Dimensions: [e.g., 32x32 pixels]
- Poses: [idle, running, kicking, celebrating]
- Colors: [primary, secondary, accent]
- Features: Bold outlines, large expressive head, small body
```

## Creating Themed Team Characters

Example: Team OpenAI vs Team Anthropic

Each team gets:
- Custom branding/colors
- Distinct character designs
- Recognizable but playful representations

### Sample Character Breakdown

**Team OpenAI:**
- Altman (Captain/Striker) - Slightly taller sprite, confident pose, light cap
- Brockman (Defender) - OG founder vibe
- GPT Bot (Goalkeeper)

**Colors:** Teal green, dark green, white, black accent

### Production Notes

- Generate individual character sprite sheets
- Maintain consistency across teams
- Keep it playful and respectful
- Focus on fun rivalry between AI labs
- Meme potential with recognizable (but not literal) characters

## Making Characters Personal

To increase player investment:
- Research modern character design trends
- Let players see themselves in the game
- Consider adding custom face upload features

## Next Steps

1. Generate base sprite sheets with Gemini
2. Clean up in Aseprite
3. Import into game engine
4. Add feature: upload your face as a playable character

---

*The biggest unlock for AI: research assistance + step generation to move from idea to execution.*
