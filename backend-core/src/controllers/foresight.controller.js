import { foresightService } from '../services/foresight.service.js';

export const getForesight = async (req, res) => {
  const merchantId = req.user.id;
  console.log("dapat")

  try {
    const aiResponse = await foresightService.getForecast(merchantId);
    return res.status(200).json(aiResponse);
  } catch (err) {
    const isTimeout = err.name === 'AbortError' || err.message.includes('timeout');
    const reason    = isTimeout
      ? 'AI service timed out after 5000 ms'
      : `AI service unreachable: ${err.message}`;
    
    console.error(`[ForesightController] ❌ ${reason}`);
    
    // Fallback response prevents frontend from crashing if AI is down
    return res.status(502).json(foresightService.buildFallbackResponse(reason));
  }
};
