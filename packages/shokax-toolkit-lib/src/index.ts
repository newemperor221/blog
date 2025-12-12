/* v8 ignore next 100 */

import { formatCategories } from './posts/formatCategories'
import { generateTagCloud } from './posts/generateTagCloud'
import { structurePostsByDate } from './posts/structurePostsByDate'
import { calculatePostStats, calculateTotalWords, formatReadingTime } from './posts/calculateStats'
import { getRandomItems, shuffleArray } from './posts/randomPosts'
import { fmtNum } from './tools/fmtNum'
import { generateRandomBrightColor } from './tools/generateRandomBrightColor'

// Named exports
export {
  formatCategories,
  structurePostsByDate,
  generateTagCloud,
  calculatePostStats,
  calculateTotalWords,
  formatReadingTime,
  getRandomItems,
  shuffleArray,
  generateRandomBrightColor,
  fmtNum,
}

// Re-export types
export type { Category, Post } from './posts/types'

export default {
  formatCategories,
  structurePostsByDate,
  generateTagCloud,
  calculatePostStats,
  calculateTotalWords,
  formatReadingTime,
  getRandomItems,
  shuffleArray,
  generateRandomBrightColor,
  fmtNum,
}
