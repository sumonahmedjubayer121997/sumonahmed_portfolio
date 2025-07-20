export const personalContext = `
Hi, I'm Sumon Ahmed — a Software Engineer.
I build modern apps with React, TypeScript, Firebase, and AI tools.

💼 Experience:
- Software Engineer at ABC Corp (2023–Now) – Built AI-enabled dashboards
- Intern at DevX (2022) – Created automation tools

🚀 Projects:
- DevGPT: Chatbot for software docs
- MyPortfolio: Portfolio to showcase apps, blogs

Reach me at sumonahmed.info
`;

export const isQueryAboutSumon = (query: string): boolean => {
  const keywords = ['sumon', 'your', 'experience', 'project', 'portfolio', 'you', 'yourself'];
  return keywords.some(word => query.toLowerCase().includes(word));
};
