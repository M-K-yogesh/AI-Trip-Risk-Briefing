const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const axios = require('axios');

/**
 * Generates an outstation trip risk briefing from an AI model or a fallback mock.
 * @param {Object} details Trip details (routeFrom, routeTo, season, vehicleType, duration, notes)
 * @param {string} provider Selected AI provider ('chatgpt', 'gemini', 'pollinations')
 * @param {boolean} lowTokenMode Whether to restrict token usage and enforce brevity
 * @returns {Promise<{text: string, providerUsed: string}>}
 */
async function generateBriefing(details, provider, lowTokenMode = false) {
  const { routeFrom, routeTo, season, vehicleType, duration, notes } = details;
  
  // Construct the structured prompt
  let prompt = `You are an expert transport safety and trip risk analyst for Manivtha Tours & Travels.

Generate a professional outstation trip risk briefing.

Trip Details:
Route: ${routeFrom} to ${routeTo}
Season: ${season}
Vehicle Type: ${vehicleType}
Trip Duration: ${duration}
Additional Notes: ${notes || 'None'}

Include:
1. Weather Conditions
2. Road Risks
3. Safety Checkpoints
4. Driver Recommendations
5. Fuel & Rest Stop Suggestions
6. Vehicle Safety Checklist
7. Emergency Preparation
8. Night Driving Alerts
9. Final Safety Summary

Return response in clean formatted sections. Make sure to use clear headers for each section.

At the very end of your response, output a section named "Overall Safety Scores" in this exact format:
[ROUTE_SAFETY_SCORE]: <score>%
[VEHICLE_SUITABILITY_SCORE]: <score>%
[OVERALL_RISK_FACTOR]: <Low Risk | Moderate Risk | High Risk>
`;

  if (lowTokenMode) {
    prompt += `\n\n[LOW-TOKEN MODE ACTIVE] - Please be extremely concise. Keep each section limited to 1-2 bullet points. Do not exceed 250 words total. Focus only on high-risk critical warnings. Still include the "Overall Safety Scores" section at the end.`;
  }

  const maxTokens = lowTokenMode ? 550 : 2500; // slightly increase lowTokenMode limit to accommodate scores section safely

  switch (provider.toLowerCase()) {
    case 'chatgpt': {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey === 'YOUR_OPENAI_API_KEY') {
        throw new Error('OpenAI API Key is missing or default placeholder. Please configure it in your .env file.');
      }
      try {
        const openai = new OpenAI({ apiKey });
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature: lowTokenMode ? 0.3 : 0.7
        });
        return { text: response.choices[0].message.content, providerUsed: 'ChatGPT (gpt-4o-mini)' };
      } catch (err) {
        console.error('OpenAI Error:', err.message);
        throw new Error('OpenAI API Error: ' + err.message);
      }
    }

    case 'gemini': {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API Key is missing or default placeholder. Please configure it in your .env file.');
      }
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: lowTokenMode ? 0.2 : 0.7
          }
        });
        return { text: result.response.text(), providerUsed: 'Gemini 1.5 Flash' };
      } catch (err) {
        console.error('Gemini Error:', err.message);
        throw new Error('Gemini API Error: ' + err.message);
      }
    }



    case 'pollinations': {
      try {
        const response = await axios.post(
          'https://text.pollinations.ai/',
          {
            messages: [{ role: 'user', content: prompt }],
            model: 'openai'
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 25000,
            responseType: 'text'
          }
        );
        return { text: response.data, providerUsed: 'Pollinations AI (Free)' };
      } catch (err) {
        console.error('Pollinations AI Error:', err.message);
        throw new Error('Pollinations AI API Error: ' + err.message);
      }
    }

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Dynamic score calculator for mock data.
 */
function determineMockScores(details) {
  const dest = (details.routeTo || '').toLowerCase();
  
  if (dest.includes('bangalore')) {
    return {
      safetyScore: 92,
      suitabilityScore: 94,
      riskFactor: 'Low Risk'
    };
  }
  if (dest.includes('goa')) {
    return {
      safetyScore: 58,
      suitabilityScore: 65,
      riskFactor: 'High Risk'
    };
  }
  if (dest.includes('mumbai')) {
    return {
      safetyScore: 64,
      suitabilityScore: 70,
      riskFactor: 'High Risk'
    };
  }
  return {
    safetyScore: 82,
    suitabilityScore: 86,
    riskFactor: 'Moderate Risk'
  };
}

/**
 * Returns a structurally formatted, highly readable mock briefing for demonstration.
 */
function getMockBriefing(details, modeName, lowTokenMode) {
  const { routeFrom, routeTo, season, vehicleType, duration } = details;
  const mockScores = determineMockScores(details);
  
  if (lowTokenMode) {
    return `### AI Outstation Trip Risk Briefing [${modeName}]
*(Low-Token Summary Mode)*

1. **Weather Conditions**: Seasonal conditions. Expect visibility shifts. Verify climate control systems.
2. **Road Risks**: General highway route risks, local congestion, and speed limit restrictions.
3. **Safety Checkpoints**: Police border points and toll junctions. Keep all trip documentation ready.
4. **Driver Recommendations**: Maintain standard speed limits. Ensure adequate rest and hydration.
5. **Fuel & Rest Stops**: Major fuel and refreshment hubs located every 100-150km.
6. **Vehicle Safety Checklist**: Check tire inflation, fluid levels, and test active safety systems.
7. **Emergency Preparation**: Keep support dispatch helpline and first-aid kits accessible.
8. **Night Driving Alerts**: Stay alert to oncoming high-beams and slow heavy transport.
9. **Final Safety Summary**: Operational readiness verified. Proceed with caution level matching risk.

Overall Safety Scores
[ROUTE_SAFETY_SCORE]: ${mockScores.safetyScore}%
[VEHICLE_SUITABILITY_SCORE]: ${mockScores.suitabilityScore}%
[OVERALL_RISK_FACTOR]: ${mockScores.riskFactor}`;
  }

  return `# AI Outstation Trip Risk Briefing [${modeName}]
*Prepared for Manivtha Tours & Travels | Route: ${routeFrom} to ${routeTo}*

---

### 1. Weather Conditions
* **Season Environment:** The trip is scheduled during the **${season}** season. 
* **Details:** Expect typical regional weather conditions along the ${routeFrom} - ${routeTo} corridor. Visibilities are generally excellent, but sudden weather changes could alter road traction. Keep an eye on engine temperature.
* **Driver Action:** Maintain cabin AC, keep hydrated, and use wipers immediately if precipitation begins.

### 2. Road Risks
* **Highway Quality:** Standard highway corridor. Road conditions vary based on local development projects and terrain.
* **Key Risk Zones:** Check for local diversions, construction potholes, and slow vehicle crossings near villages.
* **Speed Enforcement:** Speed cameras may be active. Strict speed-limit compliance is strongly advised.

### 3. Safety Checkpoints
* **Toll Plazas:** Standard national highway toll gates. Ensure active electronic toll account balance.
* **Security & Checking:** Regional security and transport verification checkpoints. Driver must carry all original vehicle papers.

### 4. Driver Recommendations
* **Rest Schedule:** Take a mandatory 15-minute rest break every 3 hours of continuous driving.
* **Safety Rules:** Maintain safe following distance behind trucks. Defensive driving protocols are in effect.

### 5. Fuel & Rest Stop Suggestions
* **Recommended Stops:** Reliable rest centers at major junctions offering clean facilities and dining options.
* **Refueling:** Top-up fuel at trusted brand outlets before departure.

### 6. Vehicle Safety Checklist
* **Tires:** Check tread depth and verify pressure (including spare tire).
* **Fluids:** Top up washer fluid, verify brake fluid level, and check engine coolant.
* **Lights:** Ensure indicators, headlamps, tail lamps, and hazard lights are fully operational.

### 7. Emergency Preparation
* **Support Contact:** Manivtha Control Room helpline.
* **On-board Gear:** Standard fire extinguisher, warning triangles, jack, wheel spanner, and first-aid kit.

### 8. Night Driving Alerts
* **Caution:** If driving extends into night hours (${duration}), watch for glare from oncoming high-beams.
* **Alertness:** Use express stop tea points to combat drowsiness. Avoid speed bursts on unlit highway patches.

### 9. Final Safety Summary
* **Verdict:** Route is cleared for travel with precautions. Verify driver rest logs prior to trip.

Overall Safety Scores
[ROUTE_SAFETY_SCORE]: ${mockScores.safetyScore}%
[VEHICLE_SUITABILITY_SCORE]: ${mockScores.suitabilityScore}%
[OVERALL_RISK_FACTOR]: ${mockScores.riskFactor}`;
}

module.exports = {
  generateBriefing
};

