/**
 * Emoji to icon mapping for workspace icons
 * Maps emoji characters to their corresponding icon names
 */
export const EMOJI_TO_ICON_MAP: Record<string, string> = {
  '📚': 'book',
  '💡': 'lightbulb',
  '🎯': 'target',
  '🚀': 'rocket',
  '⚡': 'zap',
  '🔥': 'flame',
  '💎': 'gem',
  '🌟': 'star',
  '🎨': 'palette',
  '🔬': 'microscope',
  '📊': 'bar-chart-3',
  '🎵': 'music',
  '📝': 'file-text',
  '🔍': 'search',
  '💻': 'laptop',
  '📱': 'smartphone',
  '🌱': 'sprout',
  '🎪': 'tent',
  '🏆': 'trophy',
  '🎲': 'dice-6',
  '🔧': 'wrench',
  '📦': 'package',
  '🎭': 'theater-masks',
  '🌍': 'globe',
};

/**
 * Icon to emoji mapping for workspace icons
 * Maps icon names to their corresponding emoji characters
 */
export const ICON_TO_EMOJI_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(EMOJI_TO_ICON_MAP).map(([emoji, icon]) => [icon, emoji])
);

/**
 * Available workspace icons as an array of objects
 */
export const WORKSPACE_ICONS = Object.entries(EMOJI_TO_ICON_MAP).map(([emoji, icon]) => ({
  emoji,
  icon,
  label: getIconLabel(icon)
}));

/**
 * Gets a human-readable label for an icon
 * @param icon - The icon name
 * @returns A human-readable label
 */
function getIconLabel(icon: string): string {
  const labels: Record<string, string> = {
    'book': 'Book',
    'lightbulb': 'Lightbulb',
    'target': 'Target',
    'rocket': 'Rocket',
    'zap': 'Lightning',
    'flame': 'Fire',
    'gem': 'Gem',
    'star': 'Star',
    'palette': 'Palette',
    'microscope': 'Microscope',
    'bar-chart-3': 'Chart',
    'music': 'Music',
    'file-text': 'Document',
    'search': 'Search',
    'laptop': 'Laptop',
    'smartphone': 'Phone',
    'sprout': 'Plant',
    'tent': 'Tent',
    'trophy': 'Trophy',
    'dice-6': 'Dice',
    'wrench': 'Tools',
    'package': 'Package',
    'theater-masks': 'Theater',
    'globe': 'Globe',
    'paintbrush': 'Paint',
  };
  
  return labels[icon] || icon;
}

/**
 * Converts emoji to icon name
 * @param emoji - The emoji character
 * @returns The corresponding icon name
 */
export function emojiToIcon(emoji: string): string {
  return EMOJI_TO_ICON_MAP[emoji] || 'file-text';
}

/**
 * Converts icon name to emoji
 * @param icon - The icon name
 * @returns The corresponding emoji character
 */
export function iconToEmoji(icon: string): string {
  return ICON_TO_EMOJI_MAP[icon] || '📝';
}

/**
 * Available workspace colors
 */
export const WORKSPACE_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Slate', value: '#64748b' },
];
