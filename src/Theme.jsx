import { createContext, useContext, useLayoutEffect, useState } from "react";

// 创建主题上下文
const ThemeContext = createContext();

export const ThemeProvider = ({children})=>{
  const [theme,setTheme] = useState('light');

  useLayoutEffect(()=>{
    const savedTheme = localStorage.getItem('theme');

    if(savedTheme==='light'){
      // 在<html上设置>dark属性使得暗色模式可以生效
      document.documentElement.setAttribute('theme','light');
      setTheme('light');
    }
    else if(savedTheme==='dark'){
      document.documentElement.setAttribute('theme','dark');
      setTheme('dark');
    }
    else {
      // 检测用户现在的系统的主题颜色
      const preferDark = window.matchMedia("prefers-color-scheme: dark").matches;
      const nextTheme = preferDark?"dark":"light";
      document.documentElement.setAttribute('theme',nextTheme);
      setTheme(nextTheme);
    }
  },[]);

  // 主题切换函数
  const toggleTheme = ()=>{
    const nextTheme = theme==='light'?'dark':'light';
    document.documentElement.setAttribute('theme',nextTheme);
    setTheme(nextTheme);
    localStorage.setItem('theme',nextTheme); // 保存当前的主题
  };

  return (
    <ThemeContext.Provider value={{theme,toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = ()=>{
  const context = useContext(ThemeContext);
  if(!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}