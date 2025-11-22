import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import library from "../assets/library.jpg";
import light_logo from "../assets/xiaohui.png";

export default function Register() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'zh');

  // 文本字典
  const texts = {
    zh: {
      title: "注册新账号",
      studentId: "学号",
      name: "姓名",
      password: "密码",
      confirm: "确认密码",
      register: "注册",
      toLogin: "已有账号？去登录",
      fillAll: "请完整填写所有信息",
      pwdNotMatch: "两次输入的密码不一致",
      idExists: "该学号已被注册",
      success: "注册成功，现在返回登录",
      back: "返回",
      langSwitch: "English",
    },
    en: {
      title: "Register New Account",
      studentId: "Student ID",
      name: "Name",
      password: "Password",
      confirm: "Confirm Password",
      register: "Register",
      toLogin: "Already have an account? Login",
      fillAll: "Please fill in all fields",
      pwdNotMatch: "Passwords do not match",
      idExists: "This student ID is already registered",
      success: "Registration successful, returning to login",
      back: "Back",
      langSwitch: "中文",
    }
  };

  const handleRegister = () => {
    if (!studentId || !name || !password || !confirm) {
      alert(texts[language].fillAll);
      return;
    }
    if (password !== confirm) {
      alert(texts[language].pwdNotMatch);
      return;
    }

    // 从 localStorage 读取已注册用户（简单模拟）
    const raw = localStorage.getItem('users') || '{}';
    let users = {};
    try { users = JSON.parse(raw) || {}; } catch(e) { users = {}; }

    if (users[studentId]) {
      alert(texts[language].idExists);
      return;
    }

    users[studentId] = { name, password };
    localStorage.setItem('users', JSON.stringify(users));
    // 顺便保存 userName 以便登录页预填
    localStorage.setItem('userName', name);

    alert(texts[language].success);
    navigate('/login', { state: { studentId, name } });
  };

  return (
    <div className="relative h-screen overflow-hidden flex justify-center items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${library})`, filter: 'blur(0px) brightness(1.0)' }}
        aria-hidden="true"
      ></div>

      <div className="absolute top-[3%] left-[3%]">
        <img src={light_logo} alt="校徽" className="w-64" />
      </div>
      <div></div>
      <div className="relative w-[30%] z-10 bg-white/50 dark:bg-black/60 rounded-2xl p-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-[3%] right-[3%] text-black font-black hover:text-black dark:hover:text-white dark:text-gray-300"
          title={texts[language].back}
        >
          ✕
        </button>

        {/* 语言切换按钮 */}
        <div className="absolute top-2 left-2">
          <button
            onClick={() => {
              const nextLang = language === 'zh' ? 'en' : 'zh';
              setLanguage(nextLang);
              localStorage.setItem('language', nextLang);
            }}
            className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {texts[language].langSwitch}
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 text-center text-cyan-800 dark:text-gray-200">{texts[language].title}</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm mb-1 dark:text-gray-300">{texts[language].studentId}</label>
            <input value={studentId} onChange={(e)=>setStudentId(e.target.value)} className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 dark:text-gray-300">{texts[language].name}</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 dark:text-gray-300">{texts[language].password}</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 dark:text-gray-300">{texts[language].confirm}</label>
            <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white" />
          </div>

          <button onClick={handleRegister} className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow">{texts[language].register}</button>

          <div className="text-center text-sm mt-2">
            <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">{texts[language].toLogin}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
