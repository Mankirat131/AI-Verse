/*
  Static data for the "Explore the AI Universe" section.
  Keeping data in its own file keeps components clean and makes it easy
  to swap this for real API data later.
*/

const categories = [
  {
    id: 'coding',
    name: 'Coding',
    // Short one-line description shown inside each category block
    description: 'Code assistants, debuggers and AI pair programmers.',
    toolCount: '320+ tools',
    featured: true, // the first block renders larger than the others
  },
  {
    id: 'design',
    name: 'Design',
    description: 'UI generation, image editing and creative tools.',
    toolCount: '240+ tools',
  },
  {
    id: 'writing',
    name: 'Writing',
    description: 'Copywriting, editing and long-form assistants.',
    toolCount: '280+ tools',
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Summaries, paper analysis and knowledge search.',
    toolCount: '150+ tools',
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Editing, generation and motion tools.',
    toolCount: '110+ tools',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Ads, SEO, social media and campaign tools.',
    toolCount: '190+ tools',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Notes, automation and personal assistants.',
    toolCount: '260+ tools',
  },
];

export default categories;
