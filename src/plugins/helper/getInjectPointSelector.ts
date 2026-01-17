/**
 * 根据 injectPoint 获取对应的 querySelector 选择器
 * 该函数会自动读取配置文件中的 injectPoints 作为映射表
 *
 * @param injectPoint - 注入点名称
 * @param injectPointsMap - injectPoints 映射表（通常来自配置文件）
 * @returns 对应的 querySelector 选择器
 * @throws {Error} 如果映射表中不包含该 injectPoint
 *
 * @example
 * ```ts
 * import { getInjectPointSelector } from './helper/getInjectPointSelector';
 * import config from '../path/to/config';
 *
 * try {
 *   const selector = getInjectPointSelector('footer', config.injectPoints);
 *   console.log(selector); // "#footer"
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export function getInjectPointSelector(
  injectPoint: string,
  injectPointsMap: Record<string, string>,
): string {
  if (!injectPointsMap || typeof injectPointsMap !== "object") {
    throw new Error(
      `[hyacine-plugin] injectPoints 映射表无效。收到的类型: ${typeof injectPointsMap}`,
    );
  }

  const selector = injectPointsMap[injectPoint];

  if (selector === undefined || selector === null) {
    const availablePoints = Object.keys(injectPointsMap).join(", ");
    throw new Error(
      `[hyacine-plugin] 未找到 injectPoint "${injectPoint}" 对应的选择器。` +
        `\n可用的注入点有: ${availablePoints || "(无)"}`,
    );
  }

  if (typeof selector !== "string" || selector.trim() === "") {
    throw new Error(
      `[hyacine-plugin] injectPoint "${injectPoint}" 对应的选择器无效: ${JSON.stringify(selector)}`,
    );
  }

  return selector;
}
