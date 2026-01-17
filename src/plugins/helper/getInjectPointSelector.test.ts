import { describe, expect, test } from "bun:test";
import { getInjectPointSelector } from "./getInjectPointSelector";

describe("getInjectPointSelector", () => {
  test("应该返回正确的选择器", () => {
    const injectPoints = {
      footer: "#footer",
      sidebar: "#sidebar",
      header: ".header-container",
      "custom-point": "[data-custom]",
    };

    expect(getInjectPointSelector("footer", injectPoints)).toBe("#footer");
    expect(getInjectPointSelector("sidebar", injectPoints)).toBe("#sidebar");
    expect(getInjectPointSelector("header", injectPoints)).toBe(".header-container");
    expect(getInjectPointSelector("custom-point", injectPoints)).toBe("[data-custom]");
  });

  test("当 injectPoint 不存在时应该抛出错误", () => {
    const injectPoints = {
      footer: "#footer",
      sidebar: "#sidebar",
    };

    expect(() => {
      getInjectPointSelector("nonexistent", injectPoints);
    }).toThrow(/未找到 injectPoint "nonexistent" 对应的选择器/);

    expect(() => {
      getInjectPointSelector("header", injectPoints);
    }).toThrow(/未找到 injectPoint "header" 对应的选择器/);
  });

  test("当映射表无效时应该抛出错误", () => {
    expect(() => {
      // @ts-expect-error: 故意传入 null 以测试错误处理
      getInjectPointSelector("footer", null);
    }).toThrow(/injectPoints 映射表无效/);

    expect(() => {
      // @ts-expect-error: 故意传入 undefined 以测试错误处理
      getInjectPointSelector("footer", undefined);
    }).toThrow(/injectPoints 映射表无效/);
  });

  test("当选择器值为空字符串时应该抛出错误", () => {
    const injectPoints = {
      footer: "",
      sidebar: "   ",
    };

    expect(() => {
      getInjectPointSelector("footer", injectPoints);
    }).toThrow(/injectPoint "footer" 对应的选择器无效/);

    expect(() => {
      getInjectPointSelector("sidebar", injectPoints);
    }).toThrow(/injectPoint "sidebar" 对应的选择器无效/);
  });

  test("错误消息应该包含可用的注入点列表", () => {
    const injectPoints = {
      footer: "#footer",
      sidebar: "#sidebar",
      header: ".header",
    };

    try {
      getInjectPointSelector("nonexistent", injectPoints);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      const message = (error as Error).message;
      expect(message).toContain("footer");
      expect(message).toContain("sidebar");
      expect(message).toContain("header");
    }
  });

  test("应该处理复杂的选择器", () => {
    const injectPoints = {
      complex: "div.container > .item:first-child",
      attribute: '[data-inject="point"]',
      pseudo: ".element::before",
    };

    expect(getInjectPointSelector("complex", injectPoints)).toBe(
      "div.container > .item:first-child",
    );
    expect(getInjectPointSelector("attribute", injectPoints)).toBe('[data-inject="point"]');
    expect(getInjectPointSelector("pseudo", injectPoints)).toBe(".element::before");
  });

  test("应该处理包含特殊字符的 injectPoint 键", () => {
    const injectPoints = {
      "post-footer": "#post-footer",
      "footer-status": ".footer-status",
      "segments-sticky": "[data-segments-sticky]",
    };

    expect(getInjectPointSelector("post-footer", injectPoints)).toBe("#post-footer");
    expect(getInjectPointSelector("footer-status", injectPoints)).toBe(".footer-status");
    expect(getInjectPointSelector("segments-sticky", injectPoints)).toBe("[data-segments-sticky]");
  });
});
