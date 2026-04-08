const REQUEST_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = Number(process.env.RATE_LIMIT_MAX || 120);
const BUCKET_CLEANUP_THRESHOLD = 5000;

const requestBuckets = new Map();
let lastCleanupAt = Date.now();

const cleanupBuckets = (now) => {
  if (requestBuckets.size < BUCKET_CLEANUP_THRESHOLD && now - lastCleanupAt < REQUEST_WINDOW_MS) {
    return;
  }

  for (const [key, bucket] of requestBuckets.entries()) {
    if (now - bucket.start > REQUEST_WINDOW_MS) {
      requestBuckets.delete(key);
    }
  }
  lastCleanupAt = now;
};

const setSecurityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Allow framing for the PDF preview endpoint
  if (!req.path.includes("/certificate/generate/")) {
    res.setHeader("X-Frame-Options", "DENY");
  }
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
};

const rateLimit = (req, res, next) => {
  const now = Date.now();
  cleanupBuckets(now);
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  const bucket = requestBuckets.get(ip) || { count: 0, start: now };

  if (now - bucket.start > REQUEST_WINDOW_MS) {
    bucket.count = 0;
    bucket.start = now;
  }

  bucket.count += 1;
  requestBuckets.set(ip, bucket);

  if (bucket.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      message: "Too many requests. Please try again shortly."
    });
  }

  return next();
};

module.exports = {
  rateLimit,
  setSecurityHeaders
};
