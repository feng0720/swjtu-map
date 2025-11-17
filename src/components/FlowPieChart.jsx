import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function FlowPieChart({ currentTime, theme, language }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // ---------- 数据 ----------
  const dataSet = {
    操场:     [4000, 5000, 4500, 4500, 4000, 2000, 3500, 3000, 6000, 3000, 2000, 5000, 3000, 5000, 2000],
    图书馆:   [3000, 1500, 1000, 1000, 1000, 4500, 2000, 2500, 1500, 1000, 1500, 3000, 4500, 4500, 8500],
    食堂:     [3000, 1800, 900, 2200, 7600, 6000, 900, 0,    0,    4200, 6800, 4200, 900, 0,    0],
    教学楼:   [4500, 7000, 8400, 7300, 3400, 1750, 7500, 8400, 7200, 6400, 4900, 1900, 4100, 3300, 650],
  };

  // ---------- 中英文翻译 ----------
  const labelMap = {
    操场:     language === "zh" ? "操场" : "Playground",
    图书馆:   language === "zh" ? "图书馆" : "Library",
    食堂:     language === "zh" ? "食堂" : "Canteen",
    教学楼:   language === "zh" ? "教学楼" : "Teaching Building",
  };

  const pieData = [
    { value: dataSet.操场[currentTime], name: labelMap.操场 },
    { value: dataSet.图书馆[currentTime], name: labelMap.图书馆 },
    { value: dataSet.食堂[currentTime], name: labelMap.食堂 },
    { value: dataSet.教学楼[currentTime], name: labelMap.教学楼 },
  ];

  // ---------- 亮 / 暗模式文字 ----------
  const textColor = theme === "light" ? "#333" : "#ddd";

  // ---------- 初始化 + 转圈动画（主题、语言切换时重播） ----------
  const initChart = () => {
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    chartInstance.current.clear(); // ⭐触发重新动画

    chartInstance.current.setOption({
      backgroundColor: "transparent",

      tooltip: {
        trigger: "item",
        textStyle: { color: textColor },
      },

      legend: {
        top: "5%",
        textStyle: { color: textColor },
      },

      series: [
        {
          name: language === "zh" ? "场所占比" : "Area Ratio",
          type: "pie",
          radius: ["30%", "70%"],
          label: {
            show: true,
            formatter: "{b}: {d}%",
            color: textColor,
          },

          // ⭐⭐ 转圈动画
          animationType: "rotate",
          animationDuration: 800,
          animationEasing: "cubicOut",

          data: pieData,
        },
      ],
    });
  };

  // ---------- 初始化 ----------
  useEffect(() => {
    initChart();
  }, []);

  // ---------- 数据变化（不播放动画） ----------
  useEffect(() => {
    if (!chartInstance.current) return;
    chartInstance.current.setOption({
      series: [{ data: pieData }],
    });
  }, [currentTime]);

  // ---------- 主题 or 语言变化（重新播放转圈动画） ----------
  useEffect(() => {
    initChart();
  }, [theme, language]);

  return <div ref={chartRef} className="w-full h-full"></div>;
}
