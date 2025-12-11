
export interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string; // Markdown content
  author: string;
  tags: string[];
}

export interface GeneratorConfig {
  topic: string;
  isGenerating: boolean;
}