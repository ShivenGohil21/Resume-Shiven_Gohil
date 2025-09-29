// Skills list for matching
const skillsList = [
  "JavaScript", "React", "Node", "MongoDB", "Python", "Java", "C++", "C#", "PHP",
  "Angular", "Vue", "Express", "Django", "Flask", "Spring", "Laravel", "Symfony",
  "TypeScript", "HTML", "CSS", "SASS", "SCSS", "Bootstrap", "Tailwind", "jQuery",
  "MySQL", "PostgreSQL", "SQLite", "Redis", "Elasticsearch", "Docker", "Kubernetes",
  "AWS", "Azure", "GCP", "Git", "GitHub", "GitLab", "Jenkins", "CI/CD",
  "REST API", "GraphQL", "Microservices", "Agile", "Scrum", "DevOps", "Linux",
  "Windows", "macOS", "Android", "iOS", "Swift", "Kotlin", "Flutter", "React Native",
  "Webpack", "Babel", "ESLint", "Jest", "Mocha", "Chai", "Selenium", "Cypress",
  "Machine Learning", "AI", "TensorFlow", "PyTorch", "Data Science", "Analytics",
  "Blockchain", "Solidity", "Web3", "NFT", "Cryptocurrency", "Bitcoin", "Ethereum"
];

// Regex patterns for parsing
const patterns = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi,
  phone: /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g,
  // Flexible name pattern - accepts any case
  name: /^[A-Za-z][A-Za-z\s'.-]*$/m
};

/**
 * Extract name from text - intelligently finds person's name anywhere in resume
 */
const extractName = (text) => {
  console.log('📄 Starting intelligent name extraction...');
  
  // Common company indicators
  const companyKeywords = [
    'ltd', 'limited', 'inc', 'incorporated', 'corp', 'corporation', 'llc', 'llp',
    'technologies', 'solutions', 'systems', 'services', 'consulting', 'software',
    'global', 'international', 'group', 'company', 'enterprises', 'pvt', 'private'
  ];
  
  // Common section headers that might contain names
  const sectionKeywords = [
    'education', 'experience', 'skills', 'projects', 'achievements', 'certifications',
    'objective', 'summary', 'profile', 'about', 'contact', 'references'
  ];
  
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const candidates = [];
  
  // Strategy 1: Look for names near email addresses (common pattern)
  const emailMatch = text.match(patterns.email);
  if (emailMatch) {
    const email = emailMatch[0];
    const emailIndex = text.indexOf(email);
    const beforeEmail = text.substring(Math.max(0, emailIndex - 200), emailIndex);
    const afterEmail = text.substring(emailIndex, Math.min(text.length, emailIndex + 200));
    
    // Extract potential names from email context
    const contextWords = (beforeEmail + ' ' + afterEmail).split(/\s+/);
    contextWords.forEach(word => {
      word = word.trim().replace(/[^\w\s]/g, '');
      if (isValidNameWord(word) && !isCompanyName(word, companyKeywords)) {
        candidates.push({ name: word, source: 'email_context', confidence: 8 });
      }
    });
  }
  
  // Strategy 2: Look in first 10 lines but skip obvious company names
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    
    // Skip obvious non-names
    if (shouldSkipLine(line, sectionKeywords)) continue;
    
    // Check if line could be a name
    if (couldBeName(line)) {
      const confidence = isCompanyName(line, companyKeywords) ? 2 : (i < 3 ? 6 : 4);
      candidates.push({ name: line, source: `line_${i}`, confidence });
    }
    
    // Extract individual words that could be names
    const words = line.split(/\s+/);
    words.forEach(word => {
      word = word.trim().replace(/[^\w]/g, '');
      if (isValidNameWord(word) && !isCompanyName(word, companyKeywords)) {
        const confidence = i < 3 ? 5 : 3;
        candidates.push({ name: word, source: `word_line_${i}`, confidence });
      }
    });
  }
  
  // Strategy 3: Look for capitalized words throughout the text
  const capitalizedWords = text.match(/\b[A-Z][a-z]{1,15}\b/g) || [];
  capitalizedWords.forEach(word => {
    if (isValidNameWord(word) && !isCompanyName(word, companyKeywords)) {
      candidates.push({ name: word, source: 'capitalized', confidence: 2 });
    }
  });
  
  // Remove duplicates and sort by confidence
  const uniqueCandidates = [];
  candidates.forEach(candidate => {
    const existing = uniqueCandidates.find(c => 
      c.name.toLowerCase() === candidate.name.toLowerCase()
    );
    if (existing) {
      existing.confidence = Math.max(existing.confidence, candidate.confidence);
    } else {
      uniqueCandidates.push(candidate);
    }
  });
  
  uniqueCandidates.sort((a, b) => b.confidence - a.confidence);
  
  console.log('🔍 Name candidates:', uniqueCandidates.slice(0, 5));
  
  // Return the highest confidence candidate
  if (uniqueCandidates.length > 0) {
    const bestCandidate = uniqueCandidates[0];
    console.log(`✅ Selected name: "${bestCandidate.name}" (confidence: ${bestCandidate.confidence}, source: ${bestCandidate.source})`);
    return bestCandidate.name;
  }
  
  console.log('❌ No name found');
  return null;
};

// Helper functions
function isValidNameWord(word) {
  return word && 
         word.length >= 2 && 
         word.length <= 20 &&
         /^[A-Za-z]+$/.test(word) &&
         !['the', 'and', 'or', 'at', 'in', 'on', 'to', 'for', 'of', 'with', 'by'].includes(word.toLowerCase());
}

function isCompanyName(text, companyKeywords) {
  const textLower = text.toLowerCase();
  return companyKeywords.some(keyword => textLower.includes(keyword));
}

function shouldSkipLine(line, sectionKeywords) {
  const lineLower = line.toLowerCase();
  return line.includes('@') ||
         line.includes('http') ||
         line.includes('www.') ||
         line.match(/^\d+/) ||
         line.length > 100 ||
         line.length < 2 ||
         sectionKeywords.some(keyword => lineLower.includes(keyword)) ||
         lineLower.includes('resume') ||
         lineLower.includes('curriculum') ||
         lineLower.includes('cv');
}

function couldBeName(line) {
  return /^[A-Za-z\s'.-]{2,50}$/.test(line) &&
         line.split(' ').length <= 4;
}

/**
 * Extract email from text
 */
const extractEmail = (text) => {
  const emails = text.match(patterns.email);
  return emails ? emails[0] : null;
};

/**
 * Extract phone number from text
 */
const extractPhone = (text) => {
  const phones = text.match(patterns.phone);
  return phones ? phones[0] : null;
};

/**
 * Extract skills from text by matching against skills list
 */
const extractSkills = (text) => {
  const foundSkills = [];
  const textLower = text.toLowerCase();
  
  skillsList.forEach(skill => {
    const skillLower = skill.toLowerCase();
    // Check for exact word match (case insensitive)
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(textLower)) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
};

/**
 * Parse PDF text and extract structured data
 */
const parseResumeData = (text) => {
  const parsedData = {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    skills: extractSkills(text)
  };
  
  return parsedData;
};

module.exports = {
  parseResumeData,
  skillsList
};

