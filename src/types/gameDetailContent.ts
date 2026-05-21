export interface HowToPlayStep {
  title: string;
  body: string;
}

export interface GameModeItem {
  name: string;
  desc: string;
}

export interface GameTagItem {
  label: string;
  count: number;
  description?: string;
}

export interface GameControlItem {
  key: string;
  action: string;
}

export interface GameDetailContent {
  developer: string;
  technology: string;
  platforms: string[];
  wiki: string;
  howToPlayDescription: string;
  howToPlay: HowToPlayStep[];
  gameModes: GameModeItem[];
  tips: string[];
  features: string[];
  controls: GameControlItem[];
  tags: GameTagItem[];
}

export const emptyGameDetailContent = (): GameDetailContent => ({
  developer: '',
  technology: 'HTML5',
  platforms: ['Browser (desktop, mobile, tablet)'],
  wiki: '',
  howToPlayDescription: '',
  howToPlay: [],
  gameModes: [],
  tips: [],
  features: [],
  controls: [],
  tags: [],
});

export const gameDetailContentFromApi = (data?: Partial<GameDetailContent> | null): GameDetailContent => ({
  developer: data?.developer ?? '',
  technology: data?.technology ?? 'HTML5',
  platforms: Array.isArray(data?.platforms) && data.platforms.length > 0
    ? data.platforms
    : ['Browser (desktop, mobile, tablet)'],
  wiki: data?.wiki ?? '',
  howToPlayDescription: data?.howToPlayDescription ?? '',
  howToPlay: Array.isArray(data?.howToPlay) ? data.howToPlay : [],
  gameModes: Array.isArray(data?.gameModes) ? data.gameModes : [],
  tips: Array.isArray(data?.tips) ? data.tips : [],
  features: Array.isArray(data?.features) ? data.features : [],
  controls: Array.isArray(data?.controls) ? data.controls : [],
  tags: Array.isArray(data?.tags)
    ? data.tags.map(tag => ({
        label: tag.label || '',
        count: tag.count ?? 0,
        description: tag.description || ''
      }))
    : [],
});

export const appendGameDetailToFormData = (formData: FormData, content: GameDetailContent) => {
  formData.append('developer', content.developer);
  formData.append('technology', content.technology);
  formData.append('wiki', content.wiki);
  formData.append('platforms', JSON.stringify(content.platforms.filter(Boolean)));
  formData.append('howToPlay', JSON.stringify(content.howToPlay));
  formData.append('gameModes', JSON.stringify(content.gameModes));
  formData.append('tips', JSON.stringify(content.tips.filter(Boolean)));
  formData.append('features', JSON.stringify(content.features.filter(Boolean)));
  formData.append('controls', JSON.stringify(content.controls));
  formData.append('tags', JSON.stringify(content.tags));
  formData.append('howToPlayDescription', content.howToPlayDescription);
};
