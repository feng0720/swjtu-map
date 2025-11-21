import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import library from "../assets/library.jpg"
import light_logo from "../assets/xiaohui.png";
import dark_logo from "../assets/whitexiaohui.png";

export default function LogIn() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(() => localStorage.getItem('userName') || "");
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'zh');

  // 登录按钮点击事件
  const handleLogin = () => {
    if (!studentId || !name || !password) {
      alert("请完整填写所有信息");
      return;
    }

    // 假装验证成功（以后可替换为真实接口）
    console.log("学号:", studentId);
    console.log("姓名:", name);
    console.log("密码:", password);

    // 登录成功后保存到 localStorage 并导航到加载页（加载页会再跳回主页）
    localStorage.setItem('loginStatus', '2');
    localStorage.setItem('userName', name);
    navigate('/loading');
  };

  return (
    <div className="relative h-screen overflow-hidden flex justify-center items-center">
      {/* 图片部分 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${library})`,filter:'blur(0px) brightness(1.0)', }}
        aria-hidden="true"
      ></div>

      {/* 校徽 */}
      <div className="absolute top-[3%] left-[3%]">
        <img src={light_logo} alt="西南交大校徽" className="w-64" />
      </div>

      <div className="relative w-[30%] z-10 bg-white/50 dark:bg-black/50 rounded-2xl p-6">
      {/* 关闭按钮（回到主页） */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-2 right-2 text-black font-black hover:text-black dark:hover:text-white dark:text-gray-300"
        title={language === 'zh' ? '返回' : 'Back'}
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4 text-center text-cyan-800 dark:text-gray-200">
        {language==='zh'?'登录校园导航系统':'Log in to the campus navigation system'}
      </h2>

      {/* 表单 */}
      <div className="flex flex-col gap-4">

        <div className="flex flex-col">
          <label className="text-sm mb-1 dark:text-gray-300">{language==='zh'?'学号':'Student ID'}</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white"
            placeholder={language==='zh'?'请输入学号':'Please enter your student ID.'}
            onKeyDown={(e)=>e.key==='Enter'&&handleLogin()}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 dark:text-gray-300">{language==='zh'?'姓名':'Name'}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white"
            placeholder={language==='zh'?'请输入姓名':'Please enter your name.'}
            onKeyDown={(e)=>e.key==='Enter'&&handleLogin()}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 dark:text-gray-300">{language==='zh'?'密码':'Password'}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white"
            placeholder={language==='zh'?'请输入密码':'Please enter your Password.'}
            onKeyDown={(e)=>e.key==='Enter'&&handleLogin()}
          />
        </div>

        {/* 登录按钮 */}
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
        >
          登录
        </button>
        </div>
      </div>
    </div>
  );
}
